from __future__ import annotations

import json
import tempfile
import time
import unittest
from pathlib import Path
from unittest.mock import patch

import httpx
from fastapi import HTTPException
from fastapi.testclient import TestClient

from backend import main, task_routes
from backend.task_store import TaskStore
from backend.collection_common import CollectedSources
from backend.popular import RepoInfo
from backend.repository_library import Repository, enrich_seed_copy, read_library


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

    def test_seed_purposes_enrich_only_comparable_copies(self):
        current = next(repo for repo in read_library().repos
                       if any(group.purpose != 'unknown' for group in repo.algorithm_inventory.groups))
        data = current.model_dump(mode='json')
        counts = {}
        for group in data['algorithm_inventory']['groups']:
            key = group['algorithm'], group['status']
            counts[key] = counts.get(key, 0) + group['count']
        data['algorithm_inventory']['groups'] = [
            dict(algorithm=algorithm, status=status, count=count, purpose='unknown', origin='unknown', example=None)
            for (algorithm, status), count in counts.items()
        ]
        old = Repository.model_validate(data)
        self.assertEqual(enrich_seed_copy(old, current), current)
        changed = old.model_copy(update={'scanned_at': old.scanned_at.replace(year=2030)})
        self.assertEqual(enrich_seed_copy(changed, current), changed)

    def test_seed_update_keeps_known_purposes_in_partially_classified_copies(self):
        current = next(repo for repo in read_library().repos if
                       any(g.purpose == 'key_material' for g in repo.algorithm_inventory.groups) and
                       any(g.purpose not in ('key_material', 'unknown') for g in repo.algorithm_inventory.groups))
        data = current.model_dump(mode='json')
        groups = data['algorithm_inventory']['groups']
        group = next(g for g in groups if g['purpose'] == 'key_material')
        old_group = next((g for g in groups if g['purpose'] == 'unknown' and g['origin'] == 'unknown'
                          and g['algorithm'] == group['algorithm'] and g['status'] == group['status']), None)
        if old_group:
            old_group['count'] += group['count']
            groups.remove(group)
        else:
            group.update(purpose='unknown', origin='unknown')
        old = Repository.model_validate(data)
        self.assertEqual(enrich_seed_copy(old, current), current)
        next(g for g in groups if g['purpose'] != 'unknown')['origin'] = 'ai'
        edited = Repository.model_validate(data)
        self.assertEqual(enrich_seed_copy(edited, current), edited)

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

    def test_recheck_preserves_better_previous_snapshot_and_reports_coverage(self):
        template = read_library().repos[0].model_dump(mode='json')
        date = '2020-01-01T00:00:00Z'
        full = {**template, 'full_name': 'owner/complete', 'scanned_at': date, 'coverage': {
            'scanned_files': 2, 'candidate_files': 2, 'skipped_files': 0, 'file_limit': 5000, 'partial': False,
        }}
        partial = {**full, 'full_name': 'owner/partial', 'coverage': {
            **full['coverage'], 'scanned_files': 1, 'skipped_files': 1, 'partial': True,
        }}
        self.assertEqual(self.client.post(self.url + '/import', json={'schema_version': 1, 'repos': [full, partial]}).status_code, 200)

        def collect(url, **kwargs):
            first = (url, 'config.py', 'algorithm = "RS256"\n')
            if url.endswith('/complete'):
                return CollectedSources([first], candidates=2, skipped=1, partial=True, skip_reasons={'download_failure': 1})
            return CollectedSources([first, (url, 'other.py', 'value = 1')], candidates=2)

        def submit(names, key):
            response = self.client.post('/api/tasks/library/recheck', json={'repositories': names},
                                        headers={'X-Request-ID': 'library-recheck-' + key})
            self.assertEqual(response.status_code, 202, response.text)
            identity = response.json()['id']
            for _ in range(300):
                status = self.client.get('/api/tasks/' + identity).json()
                if status['state'] in {'succeeded', 'partial', 'failed', 'cancelled'}:
                    return status, self.client.get('/api/tasks/' + identity + '/result').json()
                time.sleep(.02)
            self.fail('复查任务未结束')

        store = TaskStore()
        self.addCleanup(store.close)
        with patch.object(task_routes, 'store', store), self.client, \
             patch('backend.popular.collect_github_sources', side_effect=collect) as fetch:
            status, _ = submit(['owner/complete', 'owner/missing'], 'missing')
            self.assertEqual(status['state'], 'failed')
            fetch.assert_not_called()
            status, result = submit(['https://github.com/OWNER/COMPLETE', 'owner/complete', 'owner/partial'], 'covered')
            self.assertEqual(status['state'], 'partial')
            self.assertEqual(result['meta']['library_saved_repositories'], ['owner/partial'])
            self.assertEqual(result['meta']['library_retained_repositories'], ['owner/complete'])
            self.assertEqual(result['repos'][0]['coverage']['skip_reasons'], {'download_failure': 1})
            self.assertEqual(fetch.call_count, 2)
            saved = {record.full_name: record for record in read_library().repos}
            self.assertEqual(saved['owner/complete'], Repository.model_validate(full))
            self.assertFalse(saved['owner/partial'].coverage.partial)
            replay = self.client.post(self.url + '/batches/' + status['id']).json()
            self.assertEqual(replay['library_retained_repositories'], ['owner/complete'])

    def test_ai_discovery_scans_only_selected_candidates_and_respects_limit(self):
        requests = []
        outputs = iter([[999], [2], [1]])

        def model(request):
            body = json.loads(request.content)
            requests.append(json.loads(body['messages'][1]['content']))
            return httpx.Response(200, json={'choices': [{'message': {'content': json.dumps({
                'selected_ids': next(outputs),
            })}, 'finish_reason': 'stop'}]})

        def collect(url, **kwargs):
            return CollectedSources([(url, 'config.py', 'algorithm = "RS256"\n')], candidates=1)

        def submit(limit, key):
            task = self.client.post('/api/tasks/library/discover', json={
                **profile, 'max_repositories': limit,
            }, headers={'X-Request-ID': 'library-discovery-' + key})
            self.assertEqual(task.status_code, 202, task.text)
            identity = task.json()['id']
            for _ in range(300):
                status = self.client.get('/api/tasks/' + identity).json()
                if status['state'] in {'succeeded', 'partial', 'failed', 'cancelled'}:
                    return status, self.client.get('/api/tasks/' + identity + '/result').json()
                time.sleep(.02)
            self.fail('仓库筛选任务未结束')

        store = TaskStore()
        self.addCleanup(store.close)
        with patch.object(task_routes, 'store', store), self.client:
            self.client.portal.call(store.ai.client.aclose)
            store.ai.client = httpx.AsyncClient(transport=httpx.MockTransport(model))
            response = self.client.put('/api/ai/config', json={
                'base_url': 'https://model.invalid/v1', 'preset': 'compatible',
                'model': 'fixture', 'api_key': 'fixture-key', 'consent': True,
            })
            self.assertEqual(response.status_code, 200, response.text)
            config = response.json()
            profile = {'ai_profile_id': config['profile_id'], 'ai_profile_version': config['version']}
            seed = read_library().repos[0].full_name
            candidates = [RepoInfo(name, 'https://github.com/' + name, 10)
                          for name in (seed, 'owner/first', 'OWNER/FIRST', 'owner/second', 'owner/third')]
            with patch('backend.repository_discovery.fetch_popular_repos', return_value=candidates), \
                 patch('backend.popular.collect_github_sources', side_effect=collect) as fetch:
                status, _ = submit(1, 'invalid')
                self.assertEqual(status['state'], 'failed')
                self.assertIn('仓库选择无效', status['error'])
                fetch.assert_not_called()
                status, result = submit(1, 'limited')
                self.assertEqual(status['state'], 'succeeded')
                self.assertEqual([r['full_name'] for r in result['repos']], ['owner/second'])
                self.assertEqual(result['meta']['skipped_existing'], 1)
                self.assertEqual(requests[1], {'max_selected': 1, 'candidates': [
                    {'id': 1, 'name': 'owner/first', 'stars': 10},
                    {'id': 2, 'name': 'owner/second', 'stars': 10},
                    {'id': 3, 'name': 'owner/third', 'stars': 10},
                ]})
                status, result = submit(None, 'unlimited')
                self.assertEqual(status['state'], 'succeeded')
                self.assertEqual([r['full_name'] for r in result['repos']], ['owner/first'])
                self.assertEqual(requests[2]['max_selected'], 2)
                self.assertEqual(fetch.call_count, 2)

    def test_purpose_refresh_saves_static_and_opted_in_ai_evidence(self):
        self._assert_purpose_review('purposes', {'max_repositories': 1})

    def test_recheck_saves_static_purposes_and_limits_ai_to_unrecognized_purposes(self):
        repo = read_library().repos[0].full_name
        self._assert_purpose_review('recheck', {'repositories': [repo]})

    def _assert_purpose_review(self, endpoint, selection):
        seen = []

        def model(request):
            payload = json.loads(json.loads(request.content)['messages'][1]['content'])
            seen.extend(payload['candidates'])
            items = [{'candidate_id': item['candidate_id'], 'algorithm': 'RSA', 'purpose': 'key_generation',
                      'rationale': 'RSA.generate 调用生成 RSA 密钥。', 'basis': 'known_api',
                      'decision': 'identified', 'evidence_ids': item['evidence_ids']}
                     for item in payload['candidates']]
            return httpx.Response(200, json={'choices': [{'message': {'content': json.dumps({'opinions': items})},
                                                         'finish_reason': 'stop'}]})

        def collect(url, **kwargs):
            return CollectedSources([
                (url, 'partial.py', 'from Crypto.PublicKey import RSA\nRSA.generate(2048)\nif (\n'),
                (url, 'trusted.py', 'from cryptography.hazmat.primitives.asymmetric import ed448\ned448.Ed448PrivateKey.generate()\n'),
            ], candidates=2)

        store = TaskStore()
        self.addCleanup(store.close)
        with patch.object(task_routes, 'store', store), self.client:
            self.client.portal.call(store.ai.client.aclose)
            store.ai.client = httpx.AsyncClient(transport=httpx.MockTransport(model))
            config = self.client.put('/api/ai/config', json={
                'base_url': 'https://model.invalid/v1', 'preset': 'compatible',
                'model': 'fixture', 'api_key': 'fixture-key', 'consent': True,
            }).json()
            with patch('backend.popular.collect_github_sources', side_effect=collect):
                response = self.client.post('/api/tasks/library/' + endpoint, json={
                    **selection, 'ai_assisted': True,
                    'ai_profile_id': config['profile_id'], 'ai_profile_version': config['version'],
                }, headers={'X-Request-ID': 'library-purpose-refresh-01'})
                self.assertEqual(response.status_code, 202, response.text)
                identity = response.json()['id']
                for _ in range(300):
                    status = self.client.get('/api/tasks/' + identity).json()
                    if status['state'] in {'succeeded', 'partial', 'failed', 'cancelled'}:
                        break
                    time.sleep(.02)
                result = self.client.get('/api/tasks/' + identity + '/result').json()
            self.assertTrue(status['purpose_review'])
            self.assertTrue(result['meta']['library_saved'], result)
            self.assertEqual(len(seen), 1)
            repo = result['repos'][0]
            self.assertEqual(repo['coverage']['degraded_files'], 1)
            self.assertIn(repo['full_name'], result['meta']['library_retained_repositories'])
            purposes = {(g['algorithm'], g['purpose'], g['origin'], g['status'])
                        for g in repo['algorithm_inventory']['groups']}
            self.assertIn(('RSA', 'key_generation', 'ai', 'confirmed'), purposes)
            self.assertIn(('Ed448', 'key_generation', 'static', 'confirmed'), purposes)
