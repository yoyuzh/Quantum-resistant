"""Real backend task lifecycle; remote acquisition is always mocked."""
from __future__ import annotations

import json
import hashlib
import time
from threading import Event
import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient
from backend import task_routes
from backend.main import app
from backend.task_store import TaskStore

CODE = 'import jwt\na=jwt.encode({},runtime_key,algorithm="RS256")\nb=jwt.encode({},runtime_key,algorithm="HS256")\n'


class DeepWorkflowTests(unittest.TestCase):
    def setUp(self):
        self.store = TaskStore()
        self.addCleanup(self.store.close)
        self.patcher = patch.object(task_routes, 'store', self.store)
        self.patcher.start()
        self.addCleanup(self.patcher.stop)
        self.client = TestClient(app)

    def submit(self, body=None, request_id='deep-workflow-request-1234'):
        return self.client.post('/api/tasks/snippet', json=body or {'content': CODE, 'analysis_mode': 'deep'}, headers={'X-Request-ID': request_id})

    def finish(self, response):
        self.assertEqual(response.status_code, 202, response.text)
        identity = response.json()['id']
        self.store.jobs[identity].future.result(timeout=5)
        return identity, self.store.result(identity, False)

    def test_explicit_deep_and_basic_preserve_old_statistics(self):
        _, basic = self.finish(self.submit({'content': CODE}, 'basic-workflow-request-1234'))
        identity, deep = self.finish(self.submit())
        self.assertNotIn('deep_analysis', basic)
        self.assertEqual(basic['findings'], deep['findings'])
        self.assertEqual(basic['summary'], deep['summary'])
        self.assertEqual(deep['deep_analysis']['status'], 'completed')
        self.assertEqual([o['algorithm']['value'] for o in deep['deep_analysis']['operations']], ['RS256', 'HS256'])
        self.assertEqual(self.store.get(identity)['state'], 'succeeded')

    def test_invalid_mode_and_mode_fingerprint_conflict(self):
        self.assertEqual(self.submit({'content': CODE, 'analysis_mode': 'invalid'}).status_code, 422)
        first = self.submit({'content': CODE})
        self.finish(first)
        self.assertEqual(self.submit().status_code, 409)

    def test_deep_non_python_is_skipped(self):
        _, result = self.finish(self.submit({'filename': 'a.txt', 'content': 'nothing', 'analysis_mode': 'deep'}))
        self.assertEqual(result['deep_analysis']['status'], 'skipped')

    def test_after_scan_reuses_source_and_is_idempotent(self):
        source, basic = self.finish(self.submit({'content': CODE}))
        with patch('backend.task_execution.build_scan_response', side_effect=AssertionError('must not rescan')):
            response = self.client.post('/api/tasks/deep-analysis', json={'source_task_id': source}, headers={'X-Request-ID': 'after-scan-deep-request-1234'})
            identity, result = self.finish(response)
        self.assertEqual(result['summary'], basic['summary'])
        replay = self.client.post('/api/tasks/deep-analysis', json={'source_task_id': source}, headers={'X-Request-ID': 'after-scan-deep-request-1234'})
        self.assertEqual(replay.json()['id'], identity)
        self.assertEqual(result['deep_analysis']['status'], 'completed')

    def test_after_scan_missing_and_unreadable_sources(self):
        response = self.client.post('/api/tasks/deep-analysis', json={'source_task_id': 'missing'}, headers={'X-Request-ID': 'missing-deep-request-1234'})
        self.assertEqual(response.status_code, 404)
        source, _ = self.finish(self.submit({'content': CODE}))
        self.store.storage.discard_sources(self.store.jobs[source].folder)
        response = self.client.post('/api/tasks/deep-analysis', json={'source_task_id': source}, headers={'X-Request-ID': 'unreadable-deep-request-1234'})
        self.assertEqual(response.status_code, 409)

    def test_export_is_server_side_and_secret_free(self):
        identity, result = self.finish(self.submit({'content': CODE.replace('runtime_key', '"PRIVATE-SECRET-456"'), 'analysis_mode': 'deep'}))
        exported = self.client.get('/api/tasks/' + identity + '/deep-analysis/export')
        self.assertEqual(exported.status_code, 200)
        self.assertEqual(exported.json()['schema_version'], 'deep-static-1')
        for forbidden in ('PRIVATE-SECRET-456', '/Users/mac', '"content":'):
            self.assertNotIn(forbidden, exported.text)
        self.assertEqual(exported.json()['operations'], result['deep_analysis']['operations'])

    def test_four_inputs_and_flat_path_upload_modes(self):
        for kind, payload, collector in (('github', {'repository_url': 'https://github.com/a/b'}, 'collect_github_sources'),
                                         ('pypi', {'package_name': 'example'}, 'collect_pypi_sources')):
            with patch('backend.main.' + collector, return_value=[('a.py', CODE)]) as collect:
                response = self.client.post('/api/tasks/' + kind, json={**payload, 'analysis_mode': 'deep'}, headers={'X-Request-ID': kind + '-deep-test-request-1234'})
                _, result = self.finish(response)
                self.assertEqual(result['deep_analysis']['status'], 'completed')
                collect.assert_called_once()
        for fields in ([('analysis_mode', (None, 'deep')), ('files', ('a.py', CODE))],
                       [('files', ('a.py', CODE)), ('analysis_mode', (None, 'deep'))]):
            response = self.client.post('/api/tasks/files', files=fields, headers={'X-Request-ID': 'files-deep-request-' + str(len(self.store.jobs))})
            _, result = self.finish(response)
            self.assertEqual(result['deep_analysis']['status'], 'completed')
            self.assertEqual(result['deep_analysis']['snapshot']['path_fidelity'], 'flat_basename')
        manifest = {'schema_version': 'upload-paths-1', 'entries': [{'index': 0, 'relative_path': 'pkg/a.py', 'sha256': hashlib.sha256(CODE.encode()).hexdigest()}]}
        response = self.client.post('/api/tasks/files-with-paths', files=[('files', ('a.py', CODE)), ('manifest', (None, json.dumps(manifest))), ('analysis_mode', (None, 'deep'))], headers={'X-Request-ID': 'paths-deep-test-request-1234'})
        _, result = self.finish(response)
        self.assertEqual(result['deep_analysis']['snapshot']['sources'][0]['relative_path'], 'pkg/a.py')

    def test_legacy_sync_never_enables_deep_and_bad_form_mode_is_rejected(self):
        with patch('backend.deep_work.analyze_crypto', side_effect=AssertionError('deep must remain explicit')):
            response = self.client.post('/api/scan/snippet', json={'content': CODE, 'analysis_mode': 'deep'})
            self.assertEqual(response.status_code, 200)
            self.assertNotIn('deep_analysis', response.json())
        response = self.client.post('/api/tasks/files', files=[('files', ('a.py', CODE)), ('analysis_mode', (None, 'invalid'))], headers={'X-Request-ID': 'invalid-mode-form-request-1234'})
        self.assertEqual(response.status_code, 422)
        self.assertEqual(self.store.scheduler.used, 0)

    def test_cancel_preserves_basic_and_complete_proofs_and_releases_cpu(self):
        from backend import deep_work
        from backend.pipeline import ANALYSIS_SLOTS
        entered, release = Event(), Event()
        real = deep_work.analyze_crypto
        def controlled(source, **kwargs):
            publish = kwargs['on_result']
            def first(result):
                publish(result)
                entered.set()
                release.wait(2)
                kwargs['checkpoint']()
            kwargs['on_result'] = first
            return real(source, **kwargs)
        with patch.object(deep_work, 'analyze_crypto', side_effect=controlled):
            response = self.submit()
            identity = response.json()['id']
            try:
                self.assertTrue(entered.wait(2))
                checkpoint = json.loads(self.store.jobs[identity].result.read_text())
                self.assertEqual(len(checkpoint['deep_analysis']['operations']), 1)
                self.store.cancel(identity)
            finally:
                release.set()
            _, result = self.finish(response)
        self.assertEqual(self.store.get(identity)['state'], 'partial')
        self.assertEqual(result['deep_analysis']['status'], 'cancelled')
        self.assertEqual(len(result['deep_analysis']['operations']), 1)
        self.assertTrue(all(p['verification_status'] == 'valid' for p in result['deep_analysis']['evidence_paths']))
        self.assertTrue(ANALYSIS_SLOTS.acquire(blocking=False))
        self.assertTrue(ANALYSIS_SLOTS.acquire(blocking=False))
        ANALYSIS_SLOTS.release()
        ANALYSIS_SLOTS.release()
        self.assertEqual(self.store.scheduler.used, 0)
        before = self.store.get(identity)
        self.store.jobs[identity].control.emit(stage='late', deep_operations=999)
        self.assertFalse(self.store.checkpoint(self.store.jobs[identity], {'sources': []}))
        self.assertEqual(self.store.get(identity), before)

    def test_cpu_wait_uses_deep_deadline_and_leaves_no_ticket_or_reader(self):
        from backend import deep_work
        from backend.pipeline import ANALYSIS_SLOTS
        source, _ = self.finish(self.submit({'content': CODE}))
        ANALYSIS_SLOTS.acquire()
        ANALYSIS_SLOTS.acquire()
        try:
            with patch.object(deep_work, 'DEEP_BUDGETS', deep_work.DEEP_BUDGETS.model_copy(update={'seconds': .05})):
                response = self.client.post('/api/tasks/deep-analysis', json={'source_task_id': source}, headers={'X-Request-ID': 'cpu-deadline-test-request-1234'})
                identity, result = self.finish(response)
        finally:
            ANALYSIS_SLOTS.release()
            ANALYSIS_SLOTS.release()
        self.assertEqual(result['deep_analysis']['status'], 'partial')
        self.assertGreater(result['deep_analysis']['budgets']['cpu_wait_seconds'], .02)
        self.assertLessEqual(result['deep_analysis']['budgets']['effective_seconds'], .05)
        self.assertEqual(self.store.jobs[source].readers, 0)
        self.assertEqual(self.store.scheduler.used, 0)

    def test_remaining_ordinary_deadline_is_not_reset(self):
        from backend import deep_work
        from backend.collection_common import Deadline
        from tests.deep_static.test_snapshot_index import snapshot
        source, base = self.finish(self.submit({'content': CODE}))
        budget = Deadline.after(.03)
        def slow(snapshot, **kwargs):
            while True:
                kwargs['checkpoint']()
                time.sleep(.002)
        with patch.object(deep_work, 'analyze_crypto', side_effect=slow):
            result = deep_work.run_deep(base, budget, lambda deadline, limits: snapshot({'a.py': CODE}))
        self.assertEqual(result['deep_analysis']['status'], 'partial')
        self.assertLessEqual(result['deep_analysis']['budgets']['effective_seconds'], .03)

    def test_final_write_failure_keeps_previous_complete_proofs(self):
        write = self.store.storage.write_json
        def fail_completed(folder, value):
            if value.get('deep_analysis', {}).get('status') == 'completed':
                raise OSError('injected sensitive host path must not escape')
            return write(folder, value)
        with patch.object(self.store.storage, 'write_json', side_effect=fail_completed):
            identity, result = self.finish(self.submit())
        self.assertEqual(self.store.get(identity)['state'], 'partial')
        self.assertEqual(result['deep_analysis']['status'], 'partial')
        self.assertTrue(result['deep_analysis']['operations'])
        self.assertTrue(all(p['verification_status'] == 'valid' for p in result['deep_analysis']['evidence_paths']))
        self.assertNotIn('injected sensitive', self.store.get(identity)['error'])

    def test_source_expiry_while_queued_keeps_baseline_without_recollection(self):
        source, basic = self.finish(self.submit({'content': CODE}))
        release = Event()
        blocks = [self.store.submit('pypi', {}, 'block-expiry-request-' + str(i), lambda budget: (release.wait(2) and {}) or {}) for i in range(2)]
        try:
            response = self.client.post('/api/tasks/deep-analysis', json={'source_task_id': source}, headers={'X-Request-ID': 'queued-expiry-request-1234'})
            self.assertEqual(response.status_code, 202)
            self.assertEqual(self.store.jobs[source].readers, 0)
            self.store.jobs[source].ended -= self.store.ttl + 1
            self.store._expire()
            self.assertNotIn(source, self.store.jobs)
        finally:
            release.set()
        identity, result = self.finish(response)
        self.assertEqual(result['summary'], basic['summary'])
        self.assertEqual(result['deep_analysis']['status'], 'failed')
        self.assertIn('deep_source_unavailable', [d['code'] for d in result['deep_analysis']['diagnostics']])
        self.assertEqual(self.store.get(identity)['state'], 'partial')

    def test_queued_cancellation_retains_seed_result_and_releases_capacity(self):
        source, basic = self.finish(self.submit({'content': CODE}))
        release = Event()
        blocks = [self.store.submit('pypi', {}, 'block-cancel-request-' + str(i), lambda budget: (release.wait(2) and {}) or {}) for i in range(2)]
        try:
            response = self.client.post('/api/tasks/deep-analysis', json={'source_task_id': source}, headers={'X-Request-ID': 'queued-cancel-request-1234'})
            identity = response.json()['id']
            cancelled = self.store.cancel(identity)
            self.assertEqual(cancelled['state'], 'partial')
            self.assertTrue(self.store.jobs[identity].future.cancelled())
            result = self.store.result(identity, False)
            self.assertEqual(result['summary'], basic['summary'])
            self.assertEqual(result['deep_analysis']['status'], 'cancelled')
        finally:
            release.set()

    def test_export_expiry_and_changed_source_never_fake_replay(self):
        identity, result = self.finish(self.submit())
        path = next(iter(self.store.jobs[identity].control.source_paths.values()))
        path.path.write_bytes(CODE.replace('RS256', 'HS256').encode())
        exported = self.client.get('/api/tasks/' + identity + '/deep-analysis/export').json()
        self.assertTrue(all(p['replay_status'] == 'requires_revalidation' for p in exported['evidence_paths']))
        self.store.storage.discard_sources(self.store.jobs[identity].folder)
        exported = self.client.get('/api/tasks/' + identity + '/deep-analysis/export').json()
        self.assertTrue(all(p['replay_status'] == 'unavailable' for p in exported['evidence_paths']))
        self.assertEqual(self.client.get('/api/tasks/missing/deep-analysis/export').status_code, 404)

    def test_mode_and_after_source_conflicts_extra_fields_and_queue_full(self):
        source, _ = self.finish(self.submit({'content': CODE}))
        body = {'source_task_id': source, 'verification_status': 'valid'}
        self.assertEqual(self.client.post('/api/tasks/deep-analysis', json=body, headers={'X-Request-ID': 'extra-body-deep-request-1234'}).status_code, 422)
        release = Event()
        for i in range(6):
            self.store.submit('pypi', {}, 'queue-full-deep-request-' + str(i), lambda budget: (release.wait(2) and {}) or {})
        try:
            response = self.client.post('/api/tasks/deep-analysis', json={'source_task_id': source}, headers={'X-Request-ID': 'full-after-deep-request-1234'})
            self.assertEqual(response.status_code, 429)
        finally:
            release.set()

    def test_source_digest_change_is_rejected_before_copy(self):
        source, basic = self.finish(self.submit({'content': CODE}))
        path = next(iter(self.store.jobs[source].control.source_paths.values()))
        path.path.write_bytes(CODE.replace('RS256', 'HS256').encode())
        response = self.client.post('/api/tasks/deep-analysis', json={'source_task_id': source}, headers={'X-Request-ID': 'changed-after-deep-request-1234'})
        identity, result = self.finish(response)
        self.assertEqual(result['deep_analysis']['status'], 'failed')
        self.assertEqual(result['summary'], basic['summary'])
        self.assertEqual(result['deep_analysis']['operations'], [])
        self.assertEqual(self.store.jobs[source].readers, 0)

    def test_small_selection_and_shared_structure_limits_are_reported(self):
        from backend import deep_work
        from deep_analysis.models import Budgets
        from pydantic import ValidationError
        for values in ({'python_files': 201}, {'source_bytes': 8 * 1024 * 1024 + 1}, {'seconds': 121}, {'structure_bytes': 32 * 1024 * 1024 + 1}):
            with self.assertRaises(ValidationError):
                Budgets(**values)
        for values in ({'python_files': 0}, {'source_bytes': 0}, {'index_nodes': 1}, {'structure_bytes': 1}):
            with patch.object(deep_work, 'DEEP_BUDGETS', Budgets(**values)):
                _, result = self.finish(self.submit(request_id='limited-deep-request-' + str(len(self.store.jobs))))
            deep = result['deep_analysis']
            self.assertEqual(deep['status'], 'partial')
            self.assertEqual(deep['operations'], [])
            self.assertLessEqual(deep['budgets']['used_nodes'], deep['budgets']['index_nodes'])
            self.assertLessEqual(deep['budgets']['used_structure_bytes'], deep['budgets']['structure_bytes'])
            if values.get('source_bytes') == 0 or values.get('python_files') == 0:
                self.assertEqual(deep['budgets']['physical_read_bytes'], 0)

    def test_mixed_retention_does_not_extend_source_ttl_and_reader_blocks_cleanup(self):
        self.store.max_results = 1
        source, _ = self.finish(self.submit({'content': CODE}))
        response = self.client.post('/api/tasks/deep-analysis', json={'source_task_id': source}, headers={'X-Request-ID': 'mixed-retention-request-1234'})
        identity, result = self.finish(response)
        self.assertNotIn(source, self.store.jobs)
        self.assertIn(identity, self.store.jobs)
        with self.store.read_job(identity) as job:
            job.ended -= self.store.ttl + 1
            self.store._expire()
            self.assertIn(identity, self.store.jobs)
            self.assertTrue(job.folder.exists())
        self.assertNotIn(identity, self.store.jobs)
        self.assertEqual(self.store.storage.bytes, 0)

    def test_storage_pressure_or_write_failure_preserves_basic_checkpoint(self):
        write = self.store.storage.write_json
        def reject_deep(folder, value):
            if 'deep_analysis' in value:
                raise RuntimeError('injected storage full')
            return write(folder, value)
        with patch.object(self.store.storage, 'write_json', side_effect=reject_deep):
            identity, result = self.finish(self.submit())
        self.assertEqual(self.store.get(identity)['state'], 'partial')
        self.assertTrue(result['sources'])
        self.assertEqual(result['summary']['source_count'], 1)
        self.assertNotIn('deep_analysis', result)
        self.assertEqual(self.client.get('/api/tasks/' + identity + '/deep-analysis/export').status_code, 409)

    def test_export_of_running_and_basic_tasks_is_conflict(self):
        identity, _ = self.finish(self.submit({'content': CODE}))
        self.assertEqual(self.client.get('/api/tasks/' + identity + '/deep-analysis/export').status_code, 409)
        release = Event()
        response = self.store.submit('pypi', {}, 'running-export-request-1234', lambda budget: (release.wait(2) and {}) or {})
        try:
            self.assertEqual(self.client.get('/api/tasks/' + response['id'] + '/deep-analysis/export').status_code, 409)
        finally:
            release.set()

    def test_restart_cleans_abandoned_deep_folder_without_resuming(self):
        import tempfile
        from pathlib import Path
        from backend.temp_storage import TemporaryStorage
        with tempfile.TemporaryDirectory() as directory:
            parent = Path(directory)
            orphan = parent / 'session-abandoned'
            orphan.mkdir()
            (orphan / '.lease').write_bytes(b'1')
            (orphan / 'deep.json').write_text('{"status":"partial"}')
            with patch('backend.temp_storage.temporary_parent', return_value=parent), patch('backend.deep_work.analyze_crypto', side_effect=AssertionError('no resume')):
                storage = TemporaryStorage()
                self.assertFalse(orphan.exists())
                storage.close()

    def test_exact_snapshot_file_and_byte_limits_do_not_read_excluded_content(self):
        from deep_analysis.snapshot import build_snapshot
        reads = []
        class Document:
            def __init__(self, index, size):
                self.name = f'f{index:03}.py'
                self.source_id = f'id-{index}'
                self.size_bytes = size
            def __getitem__(self, index):
                self.assert_index = index
                reads.append(self.source_id)
                return '#' + ' ' * (self.size_bytes - 1)
        source = build_snapshot([Document(i, 1) for i in range(201)], 'github_repository')
        self.assertEqual(len(source.logical.sources), 200)
        self.assertEqual(len(reads), 200)
        self.assertEqual(source.physical_read_bytes, 200)
        reads.clear()
        source = build_snapshot([Document(i, 2 * 1024 * 1024) for i in range(5)], 'github_repository')
        self.assertEqual(len(source.logical.sources), 4)
        self.assertEqual(len(reads), 4)
        self.assertEqual(source.physical_read_bytes, 8 * 1024 * 1024)
        self.assertEqual(source.identity.coverage.available.count, 5)
        self.assertTrue(source.identity.coverage.partial)
