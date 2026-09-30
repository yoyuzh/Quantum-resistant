from __future__ import annotations

import io
import gzip
import threading
import unittest
import zipfile
from concurrent.futures import ThreadPoolExecutor
from unittest.mock import patch

import httpx
from fastapi import HTTPException
from fastapi.testclient import TestClient
from backend import task_routes
from backend.main import app
from backend.collection_common import CollectionControl, CollectionTimeout, Deadline, get_with_retries, concurrent_collect
from backend.archives import collect_from_zip_bytes
from backend.scanning import build_scan_response
from backend.html_report import build_html_report
from backend.insights import build_insights
from backend.remote_sources import pypi_sources
from backend.task_store import TaskStore
from backend.popular import BatchResult, RepoInfo

CODE = 'from Crypto.PublicKey import RSA\nRSA.generate(2048)'


class TaskTests(unittest.TestCase):
    def setUp(self):
        self.store = TaskStore()
        self.addCleanup(self.store.close)

    def finish(self, identity):
        self.store.jobs[identity].future.result(timeout=3)
        return self.store.get(identity)

    def test_success_idempotency_and_conflict(self):
        result = build_scan_response([('a.py', CODE)], 'snippet').model_dump()
        first = self.store.submit('github', {'url': 'a'}, 'request-one', lambda d: result)
        same = self.store.submit('github', {'url': 'a'}, 'request-one', lambda d: self.fail('duplicate'))
        self.assertEqual(first['id'], same['id'])
        self.assertEqual(self.finish(first['id'])['state'], 'succeeded')
        self.assertEqual(self.store.result(first['id']), result)
        with self.assertRaises(HTTPException) as ctx:
            self.store.submit('pypi', {}, 'request-one', lambda d: result)
        self.assertEqual(ctx.exception.status_code, 409)

    def test_queue_limit_cancel_releases_reservation(self):
        store = TaskStore(workers=1, queue=1)
        release, started = threading.Event(), threading.Event()
        self.addCleanup(store.close)
        self.addCleanup(release.set)
        def work(d):
            started.set()
            release.wait(3)
            return {'sources': []}
        first = store.submit('github', {}, 'first', work)
        self.assertTrue(started.wait(1))
        lock = threading.Lock()
        queued = store.submit('popular', {}, 'second', work, lock)
        with self.assertRaises(HTTPException) as ctx:
            store.submit('pypi', {}, 'third', work)
        self.assertEqual(ctx.exception.status_code, 429)
        self.assertEqual(store.cancel(queued['id'])['state'], 'cancelled')
        self.assertFalse(lock.locked())
        release.set()
        store.jobs[first['id']].future.result(timeout=2)

    def test_cancel_preserves_complete_file_and_frozen_progress(self):
        analyzed, release = threading.Event(), threading.Event()
        self.addCleanup(release.set)
        def work(d):
            d.control.emit(stage='静态分析', collected_delta=2, analyzed_delta=1)
            analyzed.set()
            release.wait(2)
            return {'sources': [{'source_id': 'one'}], 'coverage': {'partial': True}}
        job = self.store.submit('github', {}, 'cancel', work)
        self.assertTrue(analyzed.wait(1))
        self.store.cancel(job['id'])
        release.set()
        status = self.finish(job['id'])
        self.assertEqual(status['state'], 'partial')
        self.assertEqual(status['analyzed_files'], 1)
        self.store.jobs[job['id']].control.emit(analyzed_delta=20)
        self.assertEqual(self.store.get(job['id'])['analyzed_files'], 1)

    def test_expiration_and_memory_eviction(self):
        clock = [10.0]
        store = TaskStore(now=lambda: clock[0], ttl=10, max_results=1)
        self.addCleanup(store.close)
        one = store.submit('pypi', {}, '1', lambda d: {'sources': [{}]})
        store.jobs[one['id']].future.result(timeout=2)
        clock[0] += 1
        two = store.submit('pypi', {}, '2', lambda d: {'sources': [{}]})
        store.jobs[two['id']].future.result(timeout=2)
        with self.assertRaises(HTTPException):
            store.get(one['id'])
        clock[0] += 11
        with self.assertRaises(HTTPException):
            store.result(two['id'])
        limited = TaskStore(max_bytes=1)
        self.addCleanup(limited.close)
        large = limited.submit('pypi', {}, 'large', lambda d: {'sources': [{}]})
        future = limited.jobs[large['id']].future
        future.result(timeout=2)
        with self.assertRaises(HTTPException):
            limited.get(large['id'])

    def test_api_real_job_and_restart_not_found(self):
        with patch.object(task_routes, 'store', self.store), patch('backend.main.collect_github_sources', return_value=[('a.py', CODE)]):
            client = TestClient(app)
            response = client.post('/api/tasks/github', json={'repository_url': 'https://github.com/a/b'}, headers={'X-Request-ID': 'test-request-123456'})
            self.assertEqual(response.status_code, 202)
            identity = response.json()['id']
            self.finish(identity)
            status = client.get('/api/tasks/' + identity).json()
            self.assertEqual(status['analyzed_files'], 1)
            result = client.get('/api/tasks/' + identity + '/result')
            self.assertEqual(result.status_code, 200)
            self.assertEqual(result.json()['analysis']['insights']['finding_count'], 1)
            self.assertEqual(client.get('/api/tasks/missing').status_code, 404)

    def test_popular_incomplete_never_overwrites_snapshot(self):
        batch = BatchResult('now', repos=[{'coverage': {}, 'diagnostics': []}], meta={'timed_out': True})
        with patch.object(task_routes, 'fetch_popular_repos', return_value=[]), patch.object(task_routes, 'run_batch_scan', return_value=batch), patch('backend.main.write_results') as save:
            result = task_routes.popular_work(type('Payload', (), {'top': 8})(), Deadline.after(120))
        self.assertTrue(result['meta']['incomplete'])
        save.assert_not_called()

    def test_popular_save_failure_keeps_result_and_commit_is_cancel_boundary(self):
        batch = BatchResult('now', repos=[{'coverage': {}, 'diagnostics': []}], meta={'timed_out': False})
        budget = Deadline.after(120)
        with patch.object(task_routes, 'fetch_popular_repos', return_value=[]), patch.object(task_routes, 'run_batch_scan', return_value=batch), patch('backend.main.write_results', side_effect=OSError('disk')):
            result = task_routes.popular_work(type('Payload', (), {'top': 8})(), budget)
        self.assertTrue(result['meta']['incomplete'])
        self.assertFalse(result['meta']['saved_snapshot'])
        self.assertFalse(budget.control.request_cancel())
        self.assertFalse(budget.control.cancelled.is_set())

    def test_two_lifespans_can_accept_new_jobs(self):
        with patch.object(task_routes, 'store', self.store), patch('backend.main.collect_pypi_sources', return_value=[('demo.py', CODE)]):
            for index in range(2):
                with TestClient(app) as client:
                    created = client.post('/api/tasks/pypi', json={'package_name': 'fixture'}, headers={'X-Request-ID': f'request-lifecycle-{index}'})
                    self.assertEqual(created.status_code, 202)
                    task_routes.store.jobs[created.json()['id']].future.result(timeout=2)

    def test_task_failure_and_repeated_cancel(self):
        def fail(d):
            raise CollectionTimeout('连接超时')
        job = self.store.submit('github', {}, 'failure', fail)
        self.assertEqual(self.finish(job['id'])['state'], 'failed')
        self.assertEqual(self.store.cancel(job['id'])['state'], 'failed')
        with self.assertRaises(HTTPException):
            self.store.result(job['id'])


class ReliabilityTests(unittest.TestCase):
    def test_compressed_response_decoded_exactly_once(self):
        encoded = gzip.compress(b'{"ok":true}')
        with httpx.Client(transport=httpx.MockTransport(lambda r: httpx.Response(200, headers={'Content-Encoding': 'gzip', 'ETag': 'v1'}, content=encoded))) as client:
            response = get_with_retries(client, 'https://example.test')
        self.assertEqual(response.json(), {'ok': True})
        self.assertEqual(response.headers['etag'], 'v1')

    def test_global_http_concurrency_is_bounded(self):
        reached, release = threading.Event(), threading.Event()
        lock = threading.Lock()
        active, peak = 0, 0
        def handle(request):
            nonlocal active, peak
            with lock:
                active += 1
                peak = max(peak, active)
                if active == 8:
                    reached.set()
            release.wait(2)
            with lock:
                active -= 1
            return httpx.Response(200, content=b'ok')
        with httpx.Client(transport=httpx.MockTransport(handle)) as client, ThreadPoolExecutor(max_workers=12) as executor:
            futures = [executor.submit(get_with_retries, client, 'https://example.test', deadline=Deadline.after(5)) for _ in range(12)]
            try:
                self.assertTrue(reached.wait(1))
                self.assertEqual(peak, 8)
            finally:
                release.set()
            self.assertTrue(all(f.result(timeout=2).content == b'ok' for f in futures))
        self.assertEqual(peak, 8)

    def test_cancelled_batch_drains_cooperative_completed_work(self):
        budget = Deadline.after(2)
        budget.control.grace_seconds = 2
        def work(value):
            budget.control.cancelled.set()
            return value * 2
        results, interrupted = concurrent_collect([1, 2, 3], work, 1, budget)
        self.assertTrue(interrupted)
        self.assertEqual(results, [(1, 2)])

    def test_retry_after_and_header_preservation(self):
        calls = []
        def handle(request):
            calls.append(request)
            return httpx.Response(429, headers={'Retry-After': '2'}) if len(calls) == 1 else httpx.Response(200, headers={'ETag': 'abc'}, content=b'ok')
        with httpx.Client(transport=httpx.MockTransport(handle)) as client, patch.object(Deadline, 'pause') as pause:
            response = get_with_retries(client, 'https://example.test', deadline=Deadline.after(10))
        pause.assert_called_once_with(2)
        self.assertEqual(response.headers['etag'], 'abc')
        self.assertEqual(len(calls), 2)

    def test_rate_limit_longer_than_budget_does_not_retry(self):
        calls = []
        def handle(request):
            calls.append(request)
            return httpx.Response(429, headers={'Retry-After': '60'})
        with httpx.Client(transport=httpx.MockTransport(handle)) as client:
            with self.assertRaises(httpx.HTTPStatusError):
                get_with_retries(client, 'https://example.test', deadline=Deadline.after(2))
        self.assertEqual(len(calls), 1)

    def test_archive_cancellation_keeps_completed_file(self):
        buffer = io.BytesIO()
        with zipfile.ZipFile(buffer, 'w') as archive:
            archive.writestr('a.py', CODE)
            archive.writestr('b.py', CODE)
        control = CollectionControl()
        control.report = lambda **values: control.cancelled.set() if values.get('collected_delta') else None
        result = collect_from_zip_bytes(buffer.getvalue(), 'fixture', deadline=Deadline(Deadline.after().end, control))
        self.assertEqual(len(result), 1)
        self.assertTrue(result.coverage['partial'])
        self.assertEqual(result.diagnostics[0]['code'], 'collection_interrupted')

    def test_analysis_cancellation_retains_only_completed_sources(self):
        control = CollectionControl()
        control.report = lambda **values: control.cancelled.set() if values.get('analyzed_delta') else None
        result = build_scan_response([('same.py', CODE), ('same.py', CODE)], 'manual_upload', deadline=Deadline(Deadline.after().end, control))
        self.assertEqual(len(result.sources), 1)
        self.assertEqual(result.coverage.scanned_files, 1)
        self.assertTrue(result.coverage.partial)

    def test_text_budget_is_shared_by_children(self):
        deadline = Deadline.after()
        self.assertTrue(deadline.control.accept(20 * 1024 * 1024))
        self.assertFalse(deadline.child(5).control.accept(1))

    def test_pypi_limits_candidates_and_skips_oversize(self):
        requests = []
        urls = [{'filename': f'{i}.tar.gz', 'packagetype': 'sdist', 'size': 100,
                 'url': f'https://files.pythonhosted.org/{i}.tar.gz'} for i in range(7)]
        urls.insert(0, {'filename': 'large.tar.gz', 'size': 100 * 1024 * 1024, 'url': 'https://files.pythonhosted.org/large.tar.gz'})
        def handle(request):
            requests.append(str(request.url))
            return httpx.Response(200, json={'urls': urls}) if request.url.host == 'pypi.org' else httpx.Response(404)
        real_client = httpx.Client
        with patch('backend.remote_sources.httpx.Client', side_effect=lambda **kw: real_client(transport=httpx.MockTransport(handle))):
            with self.assertRaises(RuntimeError):
                pypi_sources('demo', Deadline.after(5))
        self.assertEqual(len(requests), 4)
        self.assertFalse(any('large.tar.gz' in url for url in requests))


class ReportInsightTests(unittest.TestCase):
    def test_html_is_escaped_offline_and_shared_with_json(self):
        data = build_scan_response([('demo.py', CODE)], 'snippet').model_dump()
        data['findings'][0]['file_name'] = '<img src=x onerror=alert(1)>'
        data['findings'][0]['evidence'] = '</pre><script>alert(1)</script>'
        data.pop('summary')
        data.pop('analysis')
        report = build_html_report(**data)
        self.assertNotIn('<script', report)
        self.assertNotIn('<img', report)
        self.assertIn('&lt;script&gt;', report)
        self.assertIn('@page{size:A4', report)
        self.assertIn('用途待确认', report)
        self.assertNotIn('RSA.generate(2048)', report)
        client = TestClient(app)
        html = client.post('/api/report/html', json=data)
        structured = client.post('/api/report/json', json=data).json()
        self.assertEqual(html.status_code, 200)
        for conclusion in structured['analysis']['insights']['conclusions']:
            from html import escape
            self.assertIn(escape(conclusion, quote=True), html.text)

    def test_top_files_total_and_mutually_exclusive_purpose(self):
        base = build_scan_response([('a.py', CODE)], 'snippet').model_dump()['findings'][0]
        findings = [{**base, 'source_id': str(i), 'file_name': 'same.py', 'algorithm': algorithm, 'detection_method': None}
                    for i, algorithm in enumerate(['RSA', 'ECC', 'ECDSA', 'ECDH', 'Ed25519', 'DH', 'DSA', 'RSA', 'RSA', 'RSA'])]
        result = build_insights(findings)
        self.assertEqual(result['affected_files'], 10)
        self.assertEqual(result['other_files'], 2)
        self.assertEqual(sum(row['count'] for row in result['files']) + result['other_findings'], 10)
        self.assertEqual(sum(row['count'] for row in result['purposes']), 10)
        self.assertEqual(result['methods'], [{'key': 'unknown', 'label': '未记录', 'count': 10}])

    def test_empty_insights_do_not_invent_safety(self):
        result = build_insights([])
        self.assertEqual(result['affected_files'], 0)
        self.assertEqual(result['files'], [])
        self.assertIn('不等于', result['conclusions'][1])


if __name__ == '__main__':
    unittest.main()
