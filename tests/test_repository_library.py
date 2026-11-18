from __future__ import annotations

import json
import tempfile
import time
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException
from fastapi.testclient import TestClient

from backend import main, task_routes
from backend.task_store import TaskStore
from backend.collection_common import CollectedSources
from backend.repository_library import read_library


class LibraryTests(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.local = Path(directory.name) / 'library.json'
        self.seed = main.PROJECT_ROOT / 'web/repository-seed.json'
        mock_paths = patch('backend.repository_library.paths', return_value=(self.seed, self.local))
        mock_paths.start()
        self.addCleanup(mock_paths.stop)
        self.client = TestClient(main.app, raise_server_exceptions=False)
        self.url = '/api/repository-library'

    def test_portable_roundtrip_conflicts_and_atomic_failure(self):
        initial = self.client.get(self.url).json()
        self.assertEqual(len({r['full_name'].casefold() for r in initial['repos']}), 30)
        self.assertTrue(all(len(r['revision']) == 40 and r['coverage']['scanned_files'] > 0 for r in initial['repos']))
        row = {**initial['repos'][0], 'full_name': 'owner/new', 'scanned_at': '2025-01-01T00:00:00Z'}
        def upload(*rows):
            return self.client.post(self.url + '/import', json={'schema_version': 1, 'repos': rows})
        self.assertEqual(upload(row).status_code, 200)
        original_bytes = self.local.read_bytes()
        self.assertEqual(upload(row, {**row, 'full_name': 'OWNER/NEW', 'scanned_at':'2024-01-01T00:00:00Z'}).status_code, 200)
        self.assertEqual(self.local.read_bytes(), original_bytes)
        with patch('backend.storage.os.replace', side_effect=OSError('disk')):
            self.assertEqual(upload({**row, 'full_name':'other/new'}).status_code, 500)
        self.assertEqual(self.local.read_bytes(), original_bytes)
        self.assertEqual(upload({**row, 'full_name':'owner/..'}).status_code, 422)
        self.assertEqual(upload({**row, 'credential': 'unwanted'}).status_code, 422)
        self.assertEqual(original_bytes, self.local.read_bytes())
        newer = {**row, 'full_name':'Owner/New', 'scanned_at':'2025-01-02T00:00:00Z', 'migration_score': 8}
        result = upload(newer).json()
        self.assertEqual(len(result['repos']), len(initial['repos']) + 1)
        updated = next(r for r in read_library().repos if r.full_name.casefold() == 'owner/new')
        self.assertEqual(updated.migration_score, 8)
        self.assertEqual(self.client.post(self.url+'/import', json=result).json(), result)

    def test_upgraded_seed_adds_missing_repositories_to_local_library(self):
        initial = self.client.get(self.url).json()
        refreshed = {**initial['repos'][0], 'scanned_at': '2030-01-01T00:00:00Z'}
        user_added = {**initial['repos'][1], 'full_name': 'owner/added'}
        self.local.write_text(json.dumps({'schema_version': 1, 'repos': [refreshed, user_added]}))
        previous = self.local.read_bytes()
        result = self.client.get(self.url).json()
        records = {r['full_name']: r for r in result['repos']}
        self.assertEqual(len(records), 31)
        self.assertEqual(records[refreshed['full_name']], refreshed)
        self.assertEqual(records[user_added['full_name']], user_added)
        self.assertEqual(self.local.read_bytes(), previous)

    def test_append_skips_existing_and_retains_data_on_failed_refresh(self):
        code = 'algorithm = "RS256"\n'
        def collect(url, **kwargs):
            return CollectedSources([(url, 'src/config.py', code)], candidates=1)
        def submit(names, refresh, key):
            task = self.client.post('/api/tasks/library', json={'repositories': names, 'refresh_existing':refresh},
                                    headers={'X-Request-ID':'library-test-0000'+key})
            self.assertEqual(task.status_code, 202)
            identity = task.json()['id']
            for _ in range(300):
                status = self.client.get('/api/tasks/'+identity).json()
                if status['state'] in {'succeeded','partial','failed','cancelled'}:
                    break
                time.sleep(.02)
            return identity, self.client.get('/api/tasks/'+identity+'/result?include_content=false').json()
        store = TaskStore()
        self.addCleanup(store.close)
        with patch.object(task_routes, 'store', store), self.client:
            seed_name = read_library().repos[0].full_name
            with patch('backend.popular.collect_github_sources', side_effect=collect) as fetch:
                task, result = submit([seed_name, 'https://github.com/owner/new', 'OWNER/NEW'], False, 'append')
                self.assertEqual(fetch.call_count, 1)
                self.assertEqual(result['meta']['skipped_existing'], 1)
                self.assertTrue(result['meta']['library_saved'])
            original = self.local.read_bytes()
            self.assertEqual(self.client.post(self.url+'/batches/'+task).status_code, 200)
            self.assertEqual(original, self.local.read_bytes())
            with patch('backend.popular.collect_github_sources', return_value=[]):
                _, failed = submit(['owner/new'], True, 'failed')
            self.assertEqual(failed['failures'][0]['full_name'], 'owner/new')
            self.assertEqual(original, self.local.read_bytes())
            with patch('backend.popular.collect_github_sources', side_effect=collect), \
                 patch('backend.task_routes.merge_library', side_effect=HTTPException(413, '超过容量')):
                pending, unsaved = submit(['owner/unsaved'], False, 'unsaved')
            self.assertEqual(self.client.get('/api/tasks/' + pending).json()['state'], 'partial')
            self.assertEqual(unsaved['repos'][0]['full_name'], 'owner/unsaved')
            self.assertFalse(unsaved['meta']['library_saved'])
            self.assertEqual(unsaved['meta']['save_error'], '超过容量')
            self.assertEqual(original, self.local.read_bytes())
            self.assertEqual(self.client.post(self.url + '/batches/' + pending).status_code, 200)
