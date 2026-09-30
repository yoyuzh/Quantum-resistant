from __future__ import annotations

import base64
import io
import json
import threading
import unittest
import zipfile
import asyncio
import tempfile
from pathlib import Path
from time import perf_counter
from unittest.mock import patch

import httpx
from fastapi.testclient import TestClient

from backend import main, task_routes
from backend.collection_common import CollectionControl, CollectedSources, Deadline
from backend.pipeline import ScanPipeline
from backend.popular import RepoInfo, run_batch_scan, scan_single_repo, BatchResult
from backend.remote_sources import github_sources, pypi_sources
from backend.scanning import build_scan_response
from backend.task_store import TaskStore
from backend.temp_storage import TemporaryStorage
from backend.upload_stream import read_upload

CODE = 'from Crypto.PublicKey import RSA\nRSA.generate(2048)\n'


def archive_bytes(count):
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
        for i in range(count):
            archive.writestr(f'repo/pkg/{i}.py', CODE)
    return buffer.getvalue()


class ScaleTests(unittest.TestCase):
    def test_archive_deadline_during_read_is_not_a_read_failure(self):
        from backend.archives import _collect
        from backend.collection_common import CollectionTimeout
        def read(entry):
            if entry == 1:
                raise CollectionTimeout('timeout')
            return CODE.encode()
        docs = _collect([(0, 'a.py', 1), (1, 'b.py', 1), (2, 'c.py', 1)], read, 'origin', 5000, None, Deadline.after())
        self.assertEqual(len(docs), 1)
        self.assertEqual(docs.coverage['skip_reasons'], {'timeout': 2})

    def test_popular_cancelled_file_statistics_are_not_doubled(self):
        budget = Deadline.after()
        def analyze(*args, **kwargs):
            budget.control.request_cancel()
            return [], []
        with patch('backend.popular.collect_github_sources', return_value=CollectedSources([('a.py', CODE), ('b.py', CODE), ('c.py', CODE)])), patch('backend.popular.analyze_source', side_effect=analyze):
            result = scan_single_repo(RepoInfo('a/b', 'https://github.com/a/b', 1), deadline=budget)
        self.assertEqual(result.coverage['scanned_files'], 1)
        self.assertEqual(result.coverage['skipped_files'], 2)

    def test_sync_and_cli_incomplete_popular_do_not_replace_snapshot(self):
        from scripts.batch_scan_popular import main as cli
        from contextlib import redirect_stderr
        result = BatchResult('now', [{'full_name': 'a/b'}], {'timed_out': True})
        with patch.object(main, 'scan_popular', return_value=result), patch.object(main, 'write_results') as write:
            response = self.client.post('/api/popular/scan', json={'top': 2})
            self.assertEqual(response.status_code, 200)
            self.assertFalse(response.json()['meta']['saved_snapshot'])
            write.assert_not_called()
        with patch('scripts.batch_scan_popular.scan_popular', return_value=result), patch('scripts.batch_scan_popular.write_results') as write, patch('sys.argv', ['batch_scan_popular', '--top', '2']), redirect_stderr(io.StringIO()):
            self.assertEqual(cli(), 1)
            write.assert_not_called()

    def setUp(self):
        self.store = TaskStore()
        self.addCleanup(self.store.close)
        self.override = patch.object(task_routes, 'store', self.store)
        self.override.start()
        self.addCleanup(self.override.stop)
        self.client = TestClient(main.app)

    def finish(self, identity):
        self.store.jobs[identity].future.result(timeout=30)
        return self.store.get(identity)

    def test_config_and_120_file_upload_lazy_source_and_exports(self):
        config = self.client.get('/api/config').json()
        self.assertEqual(config['max_files'], 5000)
        files = [('files', ('same.py', CODE + f'# {i}\n')) for i in range(120)]
        response = self.client.post('/api/tasks/files', files=files, headers={'X-Request-ID': 'upload-identity-0001'})
        self.assertEqual(response.status_code, 202, response.text)
        identity = response.json()['id']
        status = self.finish(identity)
        self.assertEqual((status['collected_files'], status['analyzed_files']), (120, 120))
        metadata = self.client.get(f'/api/tasks/{identity}/result?include_content=false').json()
        self.assertEqual(len(metadata['sources']), 120)
        self.assertEqual(len({s['source_id'] for s in metadata['sources']}), 120)
        self.assertTrue(all(s['content'] == '' and s['content_available'] for s in metadata['sources']))
        source_id = metadata['sources'][119]['source_id']
        source = self.client.get(f'/api/tasks/{identity}/sources/{source_id}').json()
        self.assertIn('# 119', source['content'])
        complete = self.client.get(f'/api/tasks/{identity}/result').json()
        self.assertIn('RSA.generate', complete['sources'][0]['content'])
        for format in ('html', 'markdown', 'json', 'csv'):
            exported = self.client.post(f'/api/report/{format}', json=metadata)
            self.assertEqual(exported.status_code, 200, exported.text[:100])

    def test_upload_identity_uses_content_and_order(self):
        headers = {'X-Request-ID': 'upload-identity-0002'}
        files = [('files', ('a.py', CODE)), ('files', ('a.py', 'x=1'))]
        first = self.client.post('/api/tasks/files', files=files, headers=headers).json()
        self.finish(first['id'])
        duplicate = self.client.post('/api/tasks/files', files=files, headers=headers)
        self.assertEqual(duplicate.json()['id'], first['id'])
        self.assertEqual(self.client.post('/api/tasks/files', files=files[::-1], headers=headers).status_code, 409)
        files[0] = ('files', ('a.py', CODE.replace('2048', '4096')))
        self.assertEqual(self.client.post('/api/tasks/files', files=files, headers=headers).status_code, 409)
        self.assertEqual(len(list(self.store.storage.root.iterdir())), 2)  # lease and retained job

    def test_snippet_background_and_invalid_upload_cleanup(self):
        response = self.client.post('/api/tasks/snippet', json={'filename': 'a.py', 'content': CODE}, headers={'X-Request-ID': 'snippet-identity-001'})
        self.assertEqual(response.status_code, 202)
        self.finish(response.json()['id'])
        before = self.store.storage.bytes
        for name, content in [('bad.exe', b'x'), ('bad.py', b'\xff')]:
            response = self.client.post('/api/tasks/files', files={'files': (name, content)}, headers={'X-Request-ID': 'bad-upload-identity'})
            self.assertEqual(response.status_code, 400)
        self.assertEqual(self.store.storage.bytes, before)

    def test_5000_files_pipeline_and_transfer_size(self):
        documents = [(f'file_{i}.py', CODE + '# ' + 'x' * 1024) for i in range(5000)]
        started = perf_counter()
        submitted = self.store.submit('files', {'file_count': 5000}, 'large-scan', lambda budget: task_routes.local_work(documents, 'manual_upload', budget))
        status = self.finish(submitted['id'])
        metadata = self.store.result(submitted['id'], False)
        full = self.store.result(submitted['id'])
        self.assertEqual(status['analyzed_files'], 5000)
        self.assertEqual(metadata['coverage']['scanned_files'], 5000)
        self.assertFalse(metadata['coverage']['partial'])
        self.assertLess(len(json.dumps(metadata)), len(json.dumps(full)))
        self.assertLess(perf_counter() - started, 30)

    def test_github_archive_pinned_and_three_requests_for_120_files(self):
        calls = []
        def handler(request):
            calls.append(str(request.url))
            if request.url.path == '/repos/a/b':
                return httpx.Response(200, json={'default_branch': 'main'})
            if '/git/trees/' in request.url.path:
                return httpx.Response(200, json={'sha': 'fixed-sha', 'tree': [{'type': 'blob', 'path': f'pkg/{i}.py', 'size': len(CODE)} for i in range(120)]})
            if request.url.path == '/a/b/archive/fixed-sha.zip':
                return httpx.Response(200, content=archive_bytes(120))
            return httpx.Response(404)
        real = httpx.Client
        with patch('backend.remote_sources.httpx.Client', side_effect=lambda **kw: real(transport=httpx.MockTransport(handler))):
            docs = github_sources('https://github.com/a/b', 5000, Deadline.after())
        self.assertEqual(len(docs), 120)
        self.assertEqual(len(calls), 3)
        self.assertFalse(docs.coverage['partial'])

    def test_archive_failure_falls_back_and_tree_version_is_pinned(self):
        calls = []
        def handler(request):
            calls.append(str(request.url))
            if request.url.path == '/repos/a/b':
                return httpx.Response(200, json={'default_branch': 'main'})
            if '/git/trees/' in request.url.path:
                return httpx.Response(200, json={'sha': 'fixed-sha', 'tree': [{'type': 'blob', 'path': f'{i}.py', 'size': len(CODE)} for i in range(35)]})
            if '/contents/' in request.url.path:
                self.assertEqual(request.url.params['ref'], 'fixed-sha')
                return httpx.Response(200, json={'encoding': 'base64', 'content': base64.b64encode(CODE.encode()).decode()})
            return httpx.Response(404)
        real = httpx.Client
        with patch('backend.remote_sources.httpx.Client', side_effect=lambda **kw: real(transport=httpx.MockTransport(handler))):
            docs = github_sources('https://github.com/a/b', 5000, Deadline.after())
        self.assertEqual(len(docs), 35)
        self.assertEqual(len(calls), 38)

    def test_pypi_more_than_80_files(self):
        real = httpx.Client
        def handler(request):
            if request.url.host == 'pypi.org':
                return httpx.Response(200, json={'urls': [{'filename': 'package.whl', 'url': 'https://files.pythonhosted.org/package.whl'}]})
            return httpx.Response(200, content=archive_bytes(150))
        with patch('backend.remote_sources.httpx.Client', side_effect=lambda **kw: real(transport=httpx.MockTransport(handler))):
            docs = pypi_sources('demo', Deadline.after())
        self.assertEqual(len(docs), 150)

    def test_direct_collector_pipeline_does_not_analyze_files_twice(self):
        from backend.archives import collect_from_zip_bytes
        budget = Deadline.after()
        pipeline = ScanPipeline(budget, 'github_repository')
        try:
            docs = collect_from_zip_bytes(archive_bytes(120), 'repo', deadline=budget)
            result = build_scan_response(docs, 'github_repository', deadline=budget)
            self.assertEqual(result.summary.source_count, 120)
            self.assertEqual(result.summary.finding_count, 120)
            self.assertIsNone(budget.control.pipeline)
        finally:
            pipeline.finish()

    def test_popular_separate_budgets_and_scopes(self):
        budgets = []
        def collect(url, *, deadline, **kwargs):
            budgets.append(deadline.control)
            deadline.control.emit(candidate_files=100, stage='各自采集')
            return CollectedSources([(url, f'{i}.py', CODE) for i in range(100)], candidates=100)
        repos = [RepoInfo(f'a/{i}', f'https://github.com/a/{i}', i) for i in range(8)]
        with patch('backend.popular.collect_github_sources', collect):
            result = run_batch_scan(repos)
        self.assertEqual(len(result.repos), 8)
        self.assertTrue(all(repo['coverage']['scanned_files'] == 100 for repo in result.repos))
        self.assertEqual(len({id(control) for control in budgets}), 8)
        self.assertTrue(all(control.max_bytes == 64 * 1024 * 1024 for control in budgets))

    def test_backpressure_cancellation_and_analysis_failure(self):
        budget = Deadline.after()
        release, entered = threading.Event(), threading.Event()
        def analyze(*args, **kwargs):
            entered.set()
            release.wait(3)
            raise ValueError('bad analysis')
        pipeline = ScanPipeline(budget, 'manual_upload', analyzer=analyze)
        pipeline.publish(('a.py', CODE))
        self.assertTrue(entered.wait(1))
        for i in range(16):
            pipeline.publish((f'{i}.py', CODE))
        blocked = threading.Thread(target=lambda: self._cancelled_publish(pipeline))
        blocked.start()
        budget.control.request_cancel()
        release.set()
        blocked.join(3)
        pipeline.finish()
        self.assertFalse(blocked.is_alive())
        self.assertLessEqual(pipeline.queue.maxsize, 16)
        self.assertEqual(pipeline.skip_reasons['analysis_failure'], 1)
        self.assertEqual(len(pipeline.records), 0)

    @staticmethod
    def _cancelled_publish(pipeline):
        from backend.collection_common import CollectionTimeout
        try:
            pipeline.publish(('blocked.py', CODE))
        except CollectionTimeout:
            pass

    def test_storage_capacity_and_expiration_clean_files(self):
        storage = TemporaryStorage(max_bytes=3)
        try:
            folder = storage.folder()
            storage.write(folder, b'123')
            with self.assertRaises(RuntimeError):
                storage.write(folder, b'4')
            storage.remove_folder(folder)
            self.assertEqual(storage.bytes, 0)
        finally:
            storage.close()
        clock = [0.0]
        store = TaskStore(ttl=1, now=lambda: clock[0])
        self.addCleanup(store.close)
        submitted = store.submit('snippet', {}, 'expired', lambda budget: task_routes.local_work([('a.py', CODE)], 'snippet', budget))
        store.jobs[submitted['id']].future.result(3)
        folder = store.jobs[submitted['id']].folder
        clock[0] = 2
        from fastapi import HTTPException
        with self.assertRaises(HTTPException):
            store.source(submitted['id'], 'unknown')
        self.assertFalse(folder.exists())

    def test_storage_pressure_preserves_analysis_before_optional_source(self):
        content = CODE + '# ' + 'x' * 200000
        self.store.storage.max_bytes = len(content.encode()) + 1024
        identity = self.store.submit('files', {}, 'storage-pressure', lambda budget: task_routes.local_work([('a.py', content)], 'manual_upload', budget))['id']
        self.assertEqual(self.finish(identity)['state'], 'succeeded')
        result = self.store.result(identity, False)
        self.assertEqual(result['summary']['finding_count'], 1)
        self.assertFalse(result['sources'][0]['content_available'])
        self.assertIn('source_storage_evicted', [d['code'] for d in result['diagnostics']])

    def test_progress_scope_does_not_overwrite_global_and_freezes(self):
        def work(budget):
            budget.control.emit(stage='批次执行')
            budget.control.emit(scope='a/b', stage='下载', processed_delta=2, candidate_files=4)
            return {'repos': [{'full_name': 'a/b'}]}
        identity = self.store.submit('popular', {}, 'progress', work)['id']
        self.finish(identity)
        before = self.store.get(identity)
        self.store.jobs[identity].control.emit(collected_delta=100, stage='late')
        self.assertEqual(before, self.store.get(identity))
        self.assertEqual(before['repositories'][0]['stage'], '下载')
        self.assertEqual(before['repositories'][0]['processed_files'], 2)

    def test_multipart_boundaries_split_into_seven_byte_chunks(self):
        class UploadRequest:
            headers = {'content-type': 'multipart/form-data; boundary=split-boundary'}
            async def stream(self):
                data = (b'--split-boundary\r\nContent-Disposition: form-data; name="files"; filename="a.py"\r\n\r\n'
                        + CODE.encode() + b'\r\n--split-boundary--\r\n')
                for start in range(0, len(data), 7):
                    yield data[start:start + 7]
        folder = self.store.storage.folder()
        try:
            docs, fingerprint = asyncio.run(read_upload(UploadRequest(), self.store.storage, folder))
            self.assertEqual(docs[0][2], CODE)
            self.assertEqual(fingerprint['file_count'], 1)
        finally:
            self.store.storage.remove_folder(folder)

    def test_abandoned_session_cleanup_keeps_live_storage(self):
        parent = self.store.storage.root.parent
        orphan = Path(tempfile.mkdtemp(prefix='session-orphan-', dir=parent))
        (orphan / '.lease').write_bytes(b'1')
        (orphan / 'source.txt').write_text('temporary test data')
        TemporaryStorage.cleanup_abandoned(parent)
        self.assertFalse(orphan.exists())
        self.assertTrue(self.store.storage.root.exists())

    def test_ttl_timer_cleans_without_a_status_request(self):
        store = TaskStore(ttl=.1)
        self.addCleanup(store.close)
        submitted = store.submit('snippet', {}, 'ttl-timer', lambda budget: task_routes.local_work([('a.py', CODE)], 'snippet', budget))
        store.jobs[submitted['id']].future.result(3)
        folder = store.jobs[submitted['id']].folder
        expired = threading.Event()
        original = store.storage.remove_folder
        def remove(path):
            original(path)
            expired.set()
        store.storage.remove_folder = remove
        self.assertTrue(expired.wait(2))
        self.assertFalse(folder.exists())
