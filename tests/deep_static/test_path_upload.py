from __future__ import annotations

import json
import time
import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient

from backend import task_routes
from backend.main import app
from backend.task_store import TaskStore
from deep_analysis.identity import content_digest


class PathUploadTests(unittest.TestCase):
    def setUp(self):
        self.store = TaskStore()
        self.addCleanup(self.store.close)
        self.patcher = patch.object(task_routes, 'store', self.store)
        self.patcher.start()
        self.addCleanup(self.patcher.stop)
        self.client = TestClient(app)

    def parts(self, text='x=1\r\n', path='pkg/a.py', mode='basic', raw=None):
        manifest = {'schema_version': 'upload-paths-1', 'entries': [
            {'index': 0, 'relative_path': path, 'sha256': content_digest(text)}]}
        return [('files', ('a.py', raw if raw is not None else text.encode(), 'text/plain')),
                ('manifest', (None, json.dumps(manifest).encode())), ('analysis_mode', (None, mode))]

    def post(self, parts, request_id='path-upload-request-0001'):
        return self.client.post('/api/tasks/files-with-paths', files=parts, headers={'X-Request-ID': request_id})

    def finish(self, identity):
        job = self.store.jobs[identity]
        job.future.result(timeout=10)
        return self.store.result(identity)

    def test_field_order_bom_path_and_legacy_source_identity(self):
        parts = self.parts(raw=b'\xef\xbb\xbfx=1\r\n')
        response = self.post(list(reversed(parts)))
        self.assertEqual(response.status_code, 202, response.text)
        result = self.finish(response.json()['id'])
        source = result['sources'][0]
        self.assertEqual(source['file_name'], 'pkg/a.py')
        self.assertEqual(self.store.source(response.json()['id'], source['source_id'])['content'], 'x=1\r\n')
        legacy = self.client.post('/api/tasks/files', files=[parts[0]], headers={'X-Request-ID': 'legacy-upload-request-0001'})
        self.assertEqual(self.finish(legacy.json()['id'])['sources'][0]['source_id'], source['source_id'])

    def test_idempotency_includes_paths_and_mode(self):
        first = self.post(self.parts()).json()['id']
        self.finish(first)
        before = self.store.storage.bytes
        replay = self.post(list(reversed(self.parts())))
        self.assertEqual(replay.status_code, 202)
        self.assertEqual(replay.json()['id'], first)
        self.assertEqual(self.store.storage.bytes, before)
        for parts in (self.parts(path='pkg/b.py'), self.parts(mode='deep')):
            response = self.post(parts)
            self.assertEqual(response.status_code, 409, response.text)
            self.assertEqual(self.store.storage.bytes, before)

    def test_failure_entire_batch_cleanup(self):
        original = self.parts()
        cases = [(self.parts(path='../a.py'), 422), (self.parts(mode='oops'), 422),
                 (original[:1], 422), (original + [original[1]], 422), (original + [original[2]], 422)]
        for entries in ([{'index': 1, 'relative_path': 'a.py', 'sha256': content_digest('x=1\r\n')}],
                        [{'index': 0, 'relative_path': 'a.py', 'sha256': '0' * 64}],
                        [{'index': 0, 'relative_path': 'a.py', 'sha256': content_digest('x=1\r\n'), 'extra': 1}]):
            parts = list(original)
            parts[1] = ('manifest', (None, json.dumps({'schema_version': 'upload-paths-1', 'entries': entries})))
            cases.append((parts, 409 if entries[0].get('sha256') == '0' * 64 else 422))
        for parts, status in cases:
            with self.subTest(status=status, parts=parts):
                response = self.post(parts)
                self.assertEqual(response.status_code, status, response.text)
                self.assertEqual(self.store.storage.bytes, 0)
                self.assertFalse(list(self.store.storage.root.glob('*/sources.bin')))
                self.assertFalse(self.store.jobs)

    def test_two_same_basenames_and_path_collisions(self):
        digest = content_digest('pass')
        for paths, status in [(('one/a.py', 'two/a.py'), 202), (('A.py', 'a.py'), 422),
                              (('é.py', 'e\u0301.py'), 422), (('a', 'a/x.py'), 422)]:
            parts = [('files', ('a.py', b'pass')), ('files', ('a.py', b'pass')),
                     ('manifest', (None, json.dumps({'schema_version': 'upload-paths-1', 'entries': [
                         {'index': i, 'relative_path': p, 'sha256': digest} for i, p in enumerate(paths)]})))]
            response = self.post(parts, 'paths-test-' + str(status) + '-' + str(len(paths[0])) + '-0000000')
            self.assertEqual(response.status_code, status, response.text)
            if status == 202:
                result = self.finish(response.json()['id'])
                self.assertEqual(len({s['source_id'] for s in result['sources']}), 2)
                self.assertEqual({s['file_name'] for s in result['sources']}, set(paths))

    def test_stream_request_and_manifest_and_source_quotas(self):
        response = self.post(self.parts(text='a' * 70000))
        self.assertEqual(response.status_code, 202, response.text)  # Middleware must not buffer/cap at 64KiB.
        self.finish(response.json()['id'])
        before = self.store.storage.bytes
        for target, value, parts in [('backend.path_upload.MAX_UPLOAD_BYTES', 100, self.parts()),
                                     ('backend.path_upload.MAX_TEXT_BYTES', 1, self.parts()),
                                     ('backend.path_upload.MAX_COLLECTED_FILES', 0, self.parts())]:
            with patch(target, value):
                response = self.post(parts, 'quota-request-0000000001')
            self.assertEqual(response.status_code, 413, response.text)
            self.assertEqual(self.store.storage.bytes, before)
        parts = self.parts()
        parts[1] = ('manifest', (None, b' ' * (4 * 1024 * 1024 + 1)))
        self.assertEqual(self.post(parts).status_code, 413)
        self.assertEqual(self.store.storage.bytes, before)

    def test_mock_remote_partial_collection_inherits_coverage_and_paths(self):
        from backend.collection_common import CollectedSources
        from backend.models import SourceRecord
        from deep_analysis.snapshot import build_snapshot
        from deep_analysis.symbol_index import build_index
        for kind, endpoint, payload, collector in (
                ('github_repository', 'github', {'repository_url': 'https://github.com/a/b'}, 'collect_github_sources'),
                ('pypi_package', 'pypi', {'package_name': 'test-package'}, 'collect_pypi_sources')):
            docs = CollectedSources([('pkg/__init__.py', ''), ('pkg/a.py', 'from .missing import f\nf()')],
                                    candidates=None, partial=True, skipped=1, skip_reasons={'truncated': 1})
            with patch('backend.main.' + collector, return_value=docs) as mocked:
                response = self.client.post('/api/tasks/' + endpoint, json=payload,
                                            headers={'X-Request-ID': 'remote-snapshot-' + endpoint + '-00001'})
                result = self.finish(response.json()['id'])
                mocked.assert_called_once()
            snap = build_snapshot([SourceRecord.model_validate(s) for s in result['sources']], kind, coverage=result['coverage'])
            self.assertTrue(snap.identity.coverage.partial)
            self.assertIn('truncated', snap.identity.coverage.gaps)
            self.assertIsNone(snap.identity.coverage.collected.total)
            index = build_index(snap)
            self.assertTrue(all(c.target is None for m in index.modules for c in m.calls))


    def test_duplicate_json_fields_and_index_rejected(self):
        parts = self.parts()
        parts[1] = ('manifest', (None, '{"schema_version":"upload-paths-1","schema_version":"upload-paths-1","entries":[]}'))
        self.assertEqual(self.post(parts).status_code, 422)
        parts = self.parts()
        value = json.loads(parts[1][1][1])
        value['entries'] *= 2
        parts[1] = ('manifest', (None, json.dumps(value)))
        self.assertEqual(self.post(parts).status_code, 422)
        self.assertEqual(self.store.storage.bytes, 0)
