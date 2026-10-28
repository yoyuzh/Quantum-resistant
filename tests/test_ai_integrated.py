"""Real task/routes/storage with an in-process mock model; no external requests."""
from __future__ import annotations

import asyncio
import hashlib
import json
import time
import unittest
import uuid
import threading
from unittest.mock import patch

import httpx
from fastapi.testclient import TestClient

from backend import task_routes
from backend.task_store import TaskStore
from backend.ai.config import BUDGETS, Settings, endpoint
from backend.ai.context import select
from backend.ai.provider import parse
from backend.ai.redaction import redact
from backend.main import app
from scanner.engine import analyze_source


def request_id():
    return uuid.uuid4().hex


class FakeModel:
    def __init__(self, delay=0, invalid=False, status=200):
        self.requests = []
        self.delay, self.invalid, self.status = delay, invalid, status

    async def __call__(self, request):
        data = json.loads(request.content)
        self.requests.append(data)
        if self.delay:
            await asyncio.sleep(self.delay)
        if self.status != 200:
            return httpx.Response(self.status, json={'error': 'must never be reflected'})
        if data['messages'] == [{'role': 'user', 'content': 'Return only the JSON object {"ok":true}.'}]:
            return httpx.Response(200, json={'choices': [{'finish_reason': 'stop', 'message': {'content': '{"ok":true}'}}]})
        payload = json.loads(data['messages'][1]['content'])
        items = [{'candidate_id': c['candidate_id'], 'algorithm': 'unknown', 'purpose': 'unknown',
                  'opinion_kind': 'abstain', 'rationale': '缺少库实现，无法确认算法。', 'missing_information': ['库实现'],
                  'evidence_ids': c['evidence_ids'][:1], 'missing_symbols': []} for c in payload['candidates']]
        content = 'invalid-json' if self.invalid else json.dumps({'opinions': items}, ensure_ascii=False)
        return httpx.Response(200, json={'choices': [{'finish_reason': 'stop', 'message': {'content': content}}],
                                       'usage': {'prompt_tokens': 50, 'completion_tokens': 30, 'total_tokens': 80}})


class IntegratedAiTests(unittest.TestCase):
    def setUp(self):
        isolated = patch.object(task_routes, 'store', TaskStore())
        isolated.start()
        self.addCleanup(isolated.stop)
        self.client = TestClient(app)
        self.client.__enter__()
        self.addCleanup(lambda: self.client.__exit__(None, None, None))
        self.service = task_routes.store.ai
        self.fake = FakeModel()
        self.client.portal.call(self.service.client.aclose)
        self.service.client = httpx.AsyncClient(transport=httpx.MockTransport(self.fake), follow_redirects=False)

    def configure(self, **changes):
        value = {'base_url': 'https://model.invalid/v1', 'preset': 'compatible', 'model': 'fixture',
                 'api_key': 'test-credential-only', 'consent': True}
        value.update(changes)
        response = self.client.put('/api/ai/config', json=value)
        self.assertEqual(response.status_code, 200, response.text)
        self.assertNotIn('test-credential-only', response.text)
        return response.json()

    def scan(self, text='import opaque\nopaque.encrypt(data)\n', ai=False):
        response = self.client.post('/api/tasks/snippet', json={'content': text, 'ai_assisted': ai}, headers={'X-Request-ID': request_id()})
        self.assertEqual(response.status_code, 202, response.text)
        return response.json()['id']

    def wait(self, identity, seconds=4):
        end = time.monotonic() + seconds
        while time.monotonic() < end:
            status = self.client.get('/api/tasks/' + identity).json()
            if status.get('state') in ('succeeded', 'partial', 'failed', 'cancelled'):
                response = self.client.get('/api/tasks/' + identity + '/result?include_content=false')
                self.assertEqual(response.status_code, 200, response.text)
                return response.json()
            time.sleep(.01)
        self.fail('task did not finish')

    def supplement(self, identity, request=None):
        response = self.client.post('/api/tasks/ai', json={'source_task_id': identity}, headers={'X-Request-ID': request or request_id()})
        self.assertEqual(response.status_code, 202, response.text)
        return response.json()['id']

    def test_default_without_configuration_preserves_basic_result(self):
        result = self.wait(self.scan(ai=True))
        self.assertEqual(result['ai_analysis']['status'], 'skipped')
        self.assertIn('deep_analysis', result)
        self.assertEqual(self.fake.requests, [])

    def test_explicit_connection_test_only_sends_fixed_content(self):
        self.configure(preset='deepseek')
        requests = []
        def answer(request):
            requests.append(json.loads(request.content))
            return httpx.Response(200, json={'choices': [{'finish_reason': 'stop', 'message': {'content': '{"ok":true}'}}]})
        self.client.portal.call(self.service.client.aclose)
        self.service.client = httpx.AsyncClient(transport=httpx.MockTransport(answer))
        self.assertEqual(self.client.post('/api/ai/test').status_code, 200)
        self.assertEqual(requests[0]['messages'], [{'role': 'user', 'content': 'Return only the JSON object {"ok":true}.'}])
        self.assertEqual(requests[0]['thinking'], {'type': 'disabled'})
        self.assertEqual(task_routes.store.scheduler.used, 0)

    def test_wrapper_declaration_does_not_duplicate_its_crypto_call_candidate(self):
        self.configure()
        result = self.wait(self.scan('import opaque\ndef encrypt_payload(data):\n return opaque.encrypt(data)\n', ai=True))
        self.assertEqual(result['ai_analysis']['coverage']['discovered'], 1)
        self.assertEqual(result['ai_analysis']['opinions'][0]['candidate_location']['line'], 3)

    def test_other_language_unknown_wrappers_are_candidates_not_static_confirmations(self):
        self.configure()
        response = self.client.post('/api/tasks/snippet', json={'filename': 'app.ts', 'ai_assisted': True,
            'content': '// opaque.encrypt(ignored)\nconst note="opaque.sign(ignored)";\nopaque.encrypt(data);\nassign(data); design(data); pokemon(data);\n'},
            headers={'X-Request-ID': request_id()})
        self.assertEqual(response.status_code, 202)
        result = self.wait(response.json()['id'])
        self.assertEqual(result['findings'], [])
        self.assertEqual(result['deep_analysis']['operations'], [])
        self.assertEqual(result['ai_analysis']['coverage']['discovered'], 1)
        self.assertEqual(result['ai_analysis']['opinions'][0]['candidate_location']['line'], 3)

    def test_local_wrapper_groups_evidence_but_retains_distinct_same_line_calls(self):
        self.configure()
        result = self.wait(self.scan('def rsa_encrypt(m,e,n):\n return pow(m,e,n)\na=rsa_encrypt(x,3,n); b=rsa_encrypt(y,65537,n)\n', ai=True))
        opinions = result['ai_analysis']['opinions']
        self.assertEqual(len(opinions), 2)
        self.assertEqual({o['candidate_location']['line'] for o in opinions}, {3})
        self.assertEqual(len({o['candidate_id'] for o in opinions}), 2)
        self.assertEqual(result['ai_analysis']['calls'], 1)

    def test_task_reports_use_saved_projection_and_do_not_expose_source(self):
        identity = self.scan('from cryptography.hazmat.primitives.asymmetric import rsa\nrsa.generate_private_key(65537,2048)\n')
        base = self.wait(identity)
        for format in ('html','markdown','csv','json'):
            report = self.client.get(f'/api/tasks/{identity}/report/{format}')
            self.assertEqual(report.status_code, 200, report.text)
            self.assertNotIn('test-credential-only', report.text)
            if format == 'json':
                value = report.json()
                self.assertEqual(value['findings'], base['findings'])
                self.assertTrue(all('content' not in s for s in value['sources']))
        self.assertEqual(self.client.get(f'/api/tasks/{identity}/report/xml').status_code,400)

    def test_large_task_advances_automatically_with_bounded_context_windows(self):
        self.configure()
        windows = []
        original = self.service.materialize
        def measured(job, prepared, selected, check):
            windows.append(len(selected))
            return original(job, prepared, selected, check)
        with patch.object(self.service, 'materialize', measured):
            identity = self.scan('import opaque\n'+'\n'.join(f'opaque.encrypt_{i}(data)' for i in range(130)), ai=True)
            result = self.wait(identity, seconds=15)
        self.assertEqual(result['ai_analysis']['coverage']['completed'],130)
        self.assertEqual(result['ai_analysis']['coverage']['remaining'],0)
        self.assertEqual(result['ai_analysis']['calls'],11)
        self.assertLessEqual(max(windows),BUDGETS['batch']*4)
        self.assertEqual(sum(windows),130)

    def test_automatic_ai_and_supplement_keep_static_findings_unchanged(self):
        self.configure()
        identity = self.scan(ai=False)
        base = self.wait(identity)
        self.assertNotIn('ai_analysis', base)
        repeated_id = request_id()
        extra = self.supplement(identity, repeated_id)
        self.assertEqual(extra, self.supplement(identity, repeated_id))
        result = self.wait(extra)
        self.assertEqual(result['findings'], base['findings'])
        self.assertEqual(result['summary'], base['summary'])
        self.assertEqual(result['ai_analysis']['status'], 'completed')
        calls = len(self.fake.requests)
        again_id = self.supplement(extra)
        again = self.wait(again_id)
        self.assertEqual(len(self.fake.requests), calls)
        self.assertEqual(again['ai_analysis']['coverage']['remaining'], 0)
        third = self.wait(self.supplement(again_id))
        self.assertEqual(third['ai_analysis']['status'], 'completed')
        source = result['sources'][0]
        self.assertTrue(source['content_available'])
        self.assertEqual(self.client.get(f"/api/tasks/{extra}/sources/{source['source_id']}").status_code, 200)
        automatic = self.wait(self.scan(ai=True))
        self.assertEqual(automatic['ai_analysis']['status'], 'completed')
        self.assertEqual(len(self.fake.requests), calls)

    def test_checkpoint_is_readable_while_ai_waits_and_other_scan_can_finish(self):
        self.configure()
        self.fake.delay = .5
        identity = self.scan(ai=True)
        end = time.monotonic() + 2
        while not self.fake.requests and time.monotonic() < end:
            time.sleep(.01)
        self.assertTrue(self.fake.requests)
        checkpoint = self.client.get(f'/api/tasks/{identity}/checkpoint')
        self.assertEqual(checkpoint.status_code, 200)
        self.assertIn('summary', checkpoint.json())
        self.assertEqual(self.client.get(f'/api/tasks/{identity}/result').status_code, 409)
        other = self.wait(self.scan('x=1', ai=False))
        self.assertEqual(other['summary']['finding_count'], 0)
        self.assertEqual(self.wait(identity)['ai_analysis']['status'], 'completed')

    def test_stop_ai_retains_basic_and_discards_late_response(self):
        self.configure()
        self.fake.delay = 1
        identity = self.scan(ai=True)
        end = time.monotonic() + 2
        while not self.fake.requests and time.monotonic() < end:
            time.sleep(.01)
        self.assertEqual(self.client.post(f'/api/tasks/{identity}/stop-ai').status_code, 200)
        result = self.wait(identity)
        self.assertEqual(result['ai_analysis']['status'], 'cancelled')
        self.assertEqual(result['ai_analysis']['opinions'], [])
        self.assertIn('summary', result)

    def test_invalid_batches_stop_after_bounded_scoped_recovery(self):
        self.configure()
        self.fake.invalid = True
        text = 'import opaque\n' + '\n'.join(f'opaque.encrypt_{i}(data)' for i in range(20))
        result = self.wait(self.scan(text, ai=True))
        self.assertEqual(result['ai_analysis']['status'], 'partial')
        self.assertLessEqual(len(self.fake.requests), 8)
        self.assertTrue(any(d['code'] == 'protocol_failures' for d in result['ai_analysis']['diagnostics']))

    def test_rate_limit_recovers_at_most_three_times_without_exposing_response(self):
        self.configure()
        self.fake.status = 429
        result = self.wait(self.scan(ai=True),seconds=8)
        self.assertEqual(len(self.fake.requests), 3)
        self.assertNotIn('must never be reflected', json.dumps(result))
        self.assertEqual(result['ai_analysis']['diagnostics'][0]['code'], 'provider_rate_limit')
        self.assertIsNone(result['ai_analysis']['usage'])

    def test_no_candidate_does_not_call_model(self):
        self.configure()
        result = self.wait(self.scan('a=pow(3,4,5)', ai=True))
        self.assertEqual(result['ai_analysis']['status'], 'completed')
        self.assertEqual(result['ai_analysis']['calls'], 0)

    def test_redaction_and_export_never_include_secret_or_full_source(self):
        self.configure()
        identity = self.scan('import opaque\napi_key="sk-sensitive-fixture-12345"\nopaque.encrypt(data)\n', ai=True)
        self.wait(identity)
        text = json.dumps(self.fake.requests)
        self.assertNotIn('sk-sensitive-fixture-12345', text)
        self.assertNotIn('test-credential-only', text)
        exported = self.client.get(f'/api/tasks/{identity}/analysis/export').json()
        self.assertNotIn('sources', exported)
        self.assertNotIn('sk-sensitive-fixture-12345', json.dumps(exported))

    def test_path_manifest_preserves_two_contexts_and_legacy_flat_does_not_guess(self):
        files = {'wrap.py': 'import jwt\ndef issue(a):\n return jwt.encode({},k,algorithm=a)',
                 'main.py': 'from wrap import issue\nissue("RS256"); issue("HS256")'}
        entries = [{'index': i, 'relative_path': name, 'sha256': hashlib.sha256(text.encode()).hexdigest()} for i, (name, text) in enumerate(files.items())]
        response = self.client.post('/api/tasks/files-with-paths', files=[('files', (name, text.encode())) for name, text in files.items()],
                    data={'manifest': json.dumps({'schema_version': 'upload-paths-1', 'entries': entries}), 'ai_assisted': 'false'}, headers={'X-Request-ID': request_id()})
        self.assertEqual(response.status_code, 202, response.text)
        identity = response.json()['id']
        result = self.wait(identity)
        operations = result['deep_analysis']['operations']
        self.assertEqual({o['algorithm'].get('value') for o in operations}, {'RS256', 'HS256'})
        self.assertEqual(len({o['operation_id'] for o in operations}), 2)
        with task_routes.store.read_job(identity) as job:
            catalogue = json.loads(job.control.ai_catalog.read_text(encoding='utf-8'))
            context_groups = [c for c in catalogue['candidates'] if c['context']]
            self.assertEqual(context_groups, [])
            self.assertEqual(catalogue['locally_resolved'], 2)
        self.assertLessEqual(result['deep_analysis']['cache']['peak_ast_files'], 2)
        bad = self.client.post('/api/tasks/files-with-paths', files=[('files', ('main.py', b'x=1'))],
            data={'manifest': json.dumps({'schema_version': 'upload-paths-1', 'entries': [{'index': 0, 'relative_path': '../main.py', 'sha256': hashlib.sha256(b'x=1').hexdigest()}]})}, headers={'X-Request-ID': request_id()})
        self.assertEqual(bad.status_code, 422)

    def test_configuration_change_stops_old_batches_and_empty_key_preserves(self):
        original = self.configure()
        self.configure(api_key='')
        self.assertTrue(self.service.config.get().api_key)
        self.fake.delay = .5
        identity = self.scan(ai=True)
        end = time.monotonic() + 2
        while not self.fake.requests and time.monotonic() < end:
            time.sleep(.01)
        self.configure(model='changed')
        result = self.wait(identity)
        self.assertEqual(result['ai_analysis']['opinions'], [])
        self.assertEqual(result['ai_analysis']['status'], 'cancelled')
        self.assertNotEqual(original['version'], self.service.config.get().version)

    def test_completed_parallel_batch_survives_cancel_of_its_slow_peer(self):
        self.configure()
        async def handler(request):
            if self.fake.requests:
                await asyncio.sleep(2)
            return await self.fake(request)
        self.client.portal.call(self.service.client.aclose)
        self.service.client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
        text = 'import opaque\n' + '\n'.join(f'opaque.encrypt_{i}(data)' for i in range(BUDGETS['batch']*2))
        identity = self.scan(text, ai=True)
        end = time.monotonic() + 3
        while time.monotonic() < end:
            checkpoint = self.client.get(f'/api/tasks/{identity}/checkpoint')
            if checkpoint.status_code == 200 and checkpoint.json().get('ai_analysis', {}).get('opinions'):
                break
            time.sleep(.01)
        self.client.post(f'/api/tasks/{identity}/stop-ai')
        result = self.wait(identity)
        self.assertEqual(len(result['ai_analysis']['opinions']), BUDGETS['batch'])
        self.assertEqual(result['ai_analysis']['status'], 'cancelled')

    def test_continue_processes_only_remaining_groups(self):
        self.configure()
        text = 'import opaque\n' + '\n'.join(f'opaque.encrypt_{i}(data)' for i in range(5))
        with patch.dict(BUDGETS, groups=2, calls=1, batch=2):
            first = self.scan(text, ai=True)
            result = self.wait(first)
            self.assertEqual(result['ai_analysis']['coverage']['remaining'], 3)
            second = self.supplement(first)
            self.assertEqual(self.wait(second)['ai_analysis']['coverage']['remaining'], 1)
            final = self.wait(self.supplement(second))
        self.assertEqual(final['ai_analysis']['status'], 'completed')
        sent = [c['focus']['line'] for request in self.fake.requests for c in json.loads(request['messages'][1]['content'])['candidates']]
        self.assertEqual(len(sent), len(set(sent)))

    def test_selection_window_refills_without_a_manual_continue(self):
        self.configure()
        with patch.dict(BUDGETS, groups=2):
            result = self.wait(self.scan('import opaque\n'+'\n'.join(f'opaque.encrypt_{i}(data)' for i in range(5)), ai=True))
        self.assertEqual(result['ai_analysis']['coverage']['completed'],5)
        self.assertEqual(result['ai_analysis']['coverage']['remaining'],0)
        self.assertEqual(result['ai_analysis']['calls'],3)

    def test_missing_opinions_are_recovered_once_without_repeating_accepted_work(self):
        self.configure()
        async def omit_once(request):
            response = await self.fake(request)
            if len(self.fake.requests)==1:
                data=response.json()
                payload=json.loads(data['choices'][0]['message']['content'])
                payload['opinions']=payload['opinions'][:1]
                data['choices'][0]['message']['content']=json.dumps(payload)
                return httpx.Response(200,json=data)
            return response
        self.client.portal.call(self.service.client.aclose)
        self.service.client=httpx.AsyncClient(transport=httpx.MockTransport(omit_once))
        identity=self.scan('import opaque\nopaque.encrypt_a(x)\nopaque.encrypt_b(y)\nopaque.encrypt_c(z)', ai=True)
        result=self.wait(identity)
        ai=result['ai_analysis']
        self.assertEqual(ai['status'],'completed')
        self.assertEqual(ai['automatic_recovery'],{'scheduled':2,'completed':2})
        sent=[c['focus']['line'] for r in self.fake.requests for c in json.loads(r['messages'][1]['content'])['candidates']]
        self.assertEqual(sent.count(2),1)
        self.assertEqual(sent.count(3),2)
        self.assertEqual(sent.count(4),2)
        status=self.client.get('/api/tasks/'+identity).json()
        self.assertLessEqual(len(status['activity_log']),6)
        self.assertTrue(any(a.get('files') for a in status['activity_log']))

    def test_empty_opinion_recovery_is_bounded_and_explains_remaining_work(self):
        self.configure()
        async def empty(request):
            response=await self.fake(request)
            data=response.json()
            data['choices'][0]['message']['content']='{"opinions":[]}'
            return httpx.Response(200,json=data)
        self.client.portal.call(self.service.client.aclose)
        self.service.client=httpx.AsyncClient(transport=httpx.MockTransport(empty))
        result=self.wait(self.scan(ai=True))
        self.assertEqual(len(self.fake.requests),3)
        self.assertEqual(result['ai_analysis']['stop_reason'],'unresolved_responses')
        self.assertEqual(result['ai_analysis']['coverage']['remaining'],1)

    def test_truncated_output_gets_one_automatic_scoped_recovery(self):
        self.configure()
        async def truncate_once(request):
            response=await self.fake(request)
            if len(self.fake.requests)==1:
                data=response.json()
                data['choices'][0]['finish_reason']='length'
                return httpx.Response(200,json=data)
            return response
        self.client.portal.call(self.service.client.aclose)
        self.service.client=httpx.AsyncClient(transport=httpx.MockTransport(truncate_once))
        value=self.wait(self.scan(ai=True))['ai_analysis']
        self.assertEqual(len(self.fake.requests),2)
        self.assertEqual(value['status'],'completed')
        self.assertEqual(value['automatic_recovery']['completed'],1)
        self.assertIsNone(value['usage'])

    def test_prompt_change_reprocesses_old_opinions_instead_of_reusing_them(self):
        self.configure()
        identity=self.scan(ai=True)
        self.wait(identity)
        with patch('backend.ai.provider.PROMPT_VERSION','new-prompt'), patch('backend.ai.runner.PROMPT_VERSION','new-prompt'):
            value=self.wait(self.supplement(identity))
        self.assertEqual(value['ai_analysis']['prompt_version'],'new-prompt')
        self.assertEqual(len(self.fake.requests),2)

    def test_queued_source_expiry_preserves_submitted_basic_result(self):
        self.configure()
        identity = self.scan()
        base = self.wait(identity)
        store = task_routes.store
        release = threading.Event()
        self.addCleanup(release.set)
        for i in range(2):
            store.submit('fixture-blocker', {}, request_id(), lambda budget: (release.wait(3), {'sources': []})[1])
        extra = self.supplement(identity)
        with store.lock:
            store.jobs[identity].ended -= 1000
            store._prune()
        release.set()
        result = self.wait(extra)
        self.assertEqual(result['findings'], base['findings'])
        self.assertIn('过期', self.client.get('/api/tasks/' + extra).json()['error'])
        self.assertEqual(self.fake.requests, [])

    def test_changed_source_digest_blocks_sending(self):
        self.configure()
        identity = self.scan()
        self.wait(identity)
        job = task_routes.store.jobs[identity]
        path = next(iter(job.control.source_paths.values()))
        with path.path.open('r+b') as stream:
            stream.seek(path.offset)
            stream.write(b'changed')
        extra = self.supplement(identity)
        self.wait(extra)
        self.assertEqual(self.fake.requests, [])
        self.assertIn('摘要', self.client.get('/api/tasks/' + extra).json()['error'])

    def test_input_budget_failure_does_not_send_or_loop(self):
        self.configure()
        with patch.dict(BUDGETS, request_bytes=32):
            result = self.wait(self.scan(ai=True))
        self.assertEqual(result['ai_analysis']['calls'], 0)
        self.assertEqual(result['ai_analysis']['status'], 'partial')
        self.assertEqual(self.fake.requests, [])

    def test_response_limit_retains_static_result(self):
        self.configure()
        with patch.dict(BUDGETS, response_bytes=64):
            result = self.wait(self.scan(ai=True))
        self.assertEqual(result['ai_analysis']['opinions'], [])
        self.assertTrue(any(d['code'] == 'response_limit' for d in result['ai_analysis']['diagnostics']))

    def test_configuration_is_readonly_from_non_loopback(self):
        remote = TestClient(app, base_url='http://localhost', client=('192.0.2.9', 50000))
        self.assertFalse(remote.get('/api/ai/config').json()['can_manage'])
        self.assertEqual(remote.put('/api/ai/config', json={'model': 'fixture'}).status_code, 403)
        self.assertEqual(remote.post('/api/ai/test').status_code, 403)

    def test_one_scoped_expansion_and_cached_evidence_rebinding(self):
        self.configure()
        bodies = []
        async def expand(request):
            value = json.loads(request.content)
            payload = json.loads(value['messages'][1]['content'])
            bodies.append(payload)
            items = []
            for candidate in payload['candidates']:
                items.append({'candidate_id': candidate['candidate_id'], 'algorithm': 'unknown', 'purpose': 'unknown',
                    'opinion_kind': 'abstain', 'rationale': '实现仍不完整。', 'missing_information': ['库实现'],
                    'evidence_ids': candidate['evidence_ids'][-1:],
                    'missing_symbols': candidate['available_symbols'][:1]})
            return httpx.Response(200, json={'choices': [{'finish_reason': 'stop', 'message': {'content': json.dumps({'opinions': items})}}]})
        self.client.portal.call(self.service.client.aclose)
        self.service.client = httpx.AsyncClient(transport=httpx.MockTransport(expand))
        text = 'def config():\n    return "RS256"\n' + '\n' * 30 + 'opaque.encrypt(data)\n'
        first = self.wait(self.scan(text, ai=True))
        self.assertEqual(len(bodies), 2)
        self.assertGreater(len(bodies[1]['evidence']), len(bodies[0]['evidence']))
        self.assertEqual(first['ai_analysis']['status'], 'completed')
        self.assertIsNone(first['ai_analysis']['usage']['total_tokens'])
        second = self.wait(self.scan(text, ai=True))
        self.assertEqual(len(bodies), 2)
        own_ids = {s['source_id'] for s in second['sources']}
        for opinion in second['ai_analysis']['opinions']:
            self.assertTrue(all(c['source_id'] in own_ids for c in opinion['citations']))


class AiContractTests(unittest.TestCase):
    def test_empty_truncated_malformed_and_redirected_responses_fail_closed(self):
        from backend.ai.config import Config
        from backend.ai.provider import complete, ProviderError
        cases = [
            ({'choices': [{'finish_reason': 'stop', 'message': {'content': ''}}]}, 'provider_format'),
            ({'choices': [{'finish_reason': 'length', 'message': {'content': '{'}}]}, 'output_truncated'),
            ({'choices': []}, 'provider_format'),
            ({'choices': [{'finish_reason': 'stop', 'message': {}}]}, 'provider_format'),
        ]
        async def exercise():
            for payload, expected in cases:
                with self.subTest(expected=expected):
                    async with httpx.AsyncClient(transport=httpx.MockTransport(lambda request: httpx.Response(200, json=payload))) as client:
                        with self.assertRaises(ProviderError) as caught:
                            await complete(client, Config(base_url='https://model.invalid/'), b'{}', lambda: None)
                        self.assertEqual(caught.exception.code, expected)
            for status in (302, 401, 403, 429):
                requests = []
                def answer(request):
                    requests.append(request)
                    return httpx.Response(status, headers={'Location': 'https://unexpected.invalid/'})
                async with httpx.AsyncClient(transport=httpx.MockTransport(answer), follow_redirects=False) as client:
                    with self.assertRaises(ProviderError):
                        await complete(client, Config(base_url='https://model.invalid/'), b'{}', lambda: None)
                self.assertEqual(len(requests), 1)
        asyncio.run(exercise())

    def test_slow_model_wall_clock_cancels_without_retry(self):
        from backend.ai.config import Config
        from backend.ai.provider import complete, ProviderError
        requests = []
        async def answer(request):
            requests.append(request)
            await asyncio.sleep(2)
            return httpx.Response(200)
        async def exercise():
            async with httpx.AsyncClient(transport=httpx.MockTransport(answer)) as client:
                with patch.dict(BUDGETS, request_seconds=.02), self.assertRaises(ProviderError) as caught:
                    await complete(client, Config(base_url='https://model.invalid/'), b'{}', lambda: None)
                self.assertEqual(caught.exception.code, 'provider_timeout')
        asyncio.run(exercise())
        self.assertEqual(len(requests), 1)

    def test_deepseek_explicitly_disables_thinking(self):
        from backend.ai.config import Config
        from backend.ai.provider import body
        value = json.loads(body(Config(preset='deepseek'), []))
        self.assertEqual(value['thinking'], {'type': 'disabled'})
        self.assertEqual(value['response_format'], {'type': 'json_object'})
        self.assertNotIn('reasoning_effort', value)
    def test_untrusted_endpoints_are_rejected(self):
        for value in ('http://example.org/v1', 'https://u:p@example.org', 'https://example.org?key=secret', 'https://example.org/#x', 'https://example.org\\@localhost'):
            with self.subTest(value=value), self.assertRaises(ValueError):
                endpoint(value)
        self.assertTrue(endpoint('http://127.0.0.1:8019/v1').endswith('/v1/'))

    def test_duplicate_and_foreign_evidence_are_not_accepted(self):
        candidate = {'candidate_id': 'one', 'refs': ['finding'], 'evidence': [{'evidence_id': 'e1'}], 'expansions': {}}
        opinion = {'candidate_id': 'one', 'algorithm': 'RSA', 'purpose': 'sign', 'opinion_kind': 'supports_static',
                   'rationale': '识别依据', 'evidence_ids': ['foreign']}
        self.assertEqual(parse(json.dumps({'opinions': [opinion]}), [candidate])[0], [])
        opinion['evidence_ids'] = ['e1']
        self.assertEqual(parse(json.dumps({'opinions': [opinion, opinion]}), [candidate])[0], [])

    def test_candidate_lanes_have_reserved_capacity(self):
        values = [{'candidate_id': str(i), 'lanes': [lane]} for lane in ('review', 'independent', 'unresolved') for i in range(BUDGETS['groups'])]
        values = [{'candidate_id': str(i), 'lanes': row['lanes']} for i, row in enumerate(values)]
        selected = select({'candidates': values}, set())
        self.assertEqual(len(selected), BUDGETS['groups'])
        self.assertEqual(sum('unresolved' in x['lanes'] for x in selected), BUDGETS['groups']//2)
        self.assertEqual(sum('independent' in x['lanes'] for x in selected), BUDGETS['groups']//4)

    def test_wire_aliases_rebind_and_duplicate_alias_cannot_bypass_validation(self):
        candidate = {'candidate_id':'original-question','refs':['finding'],
                     'evidence':[{'evidence_id':'original-evidence'}], 'expansions':{}}
        opinion = {'candidate_id':'c1','algorithm':'RSA','purpose':'sign','opinion_kind':'supports_static',
                   'rationale':'静态调用', 'evidence_ids':['e1']}
        accepted, _ = parse(json.dumps({'opinions':[opinion]}),[candidate])
        self.assertEqual(accepted[0]['candidate_id'],'original-question')
        duplicate = {**opinion,'candidate_id':'original-question'}
        self.assertEqual(parse(json.dumps({'opinions':[opinion,duplicate]}),[candidate])[0],[])

    def test_secret_redaction_preserves_crypto_api_and_trailing_algorithm(self):
        text = 'secret = derive("literal-secret", algorithm="SHA256")\nkey="key-literal"; algorithm="RS256"'
        masked = '\n'.join(redact(text))
        self.assertNotIn('literal-secret',masked)
        self.assertNotIn('key-literal',masked)
        self.assertIn('derive(',masked)
        self.assertIn('algorithm="SHA256"',masked)
        self.assertIn('algorithm="RS256"',masked)

    def test_rule_boundaries_and_imported_node_api(self):
        for text in ('monkey="RS256"', 'algorithm="documentation mentions RS256"', '# algorithm="RS256"'):
            self.assertEqual(analyze_source(text)[0], [])
        self.assertEqual(analyze_source('signatureAlgorithm="RS256"')[0][0]['algorithm'], 'RSA')
        text = 'import { generateKeyPairSync as make } from "node:crypto";\nmake("rsa", {modulusLength: 2048});'
        self.assertEqual(analyze_source(text, 'a.ts')[0][0]['algorithm'], 'RSA')
        self.assertEqual(analyze_source(text.replace('node:crypto', 'business'), 'a.ts')[0], [])
        self.assertEqual(analyze_source('RSA.generate(2048)', 'a.js')[0], [])

    def test_multiline_secrets_and_pem_body_are_masked(self):
        text = 'secret="""first\nsecond\n"""\n-----BEGIN PRIVATE KEY-----\nKEYBODY\n-----END PRIVATE KEY-----'
        masked = '\n'.join(redact(text))
        self.assertNotIn('second', masked)
        self.assertNotIn('KEYBODY', masked)
        masked = '\n'.join(redact('key = b"private bytes"\nprivate_key="""part1\npart2\n"""'))
        self.assertNotIn('private bytes', masked)
        self.assertNotIn('part2', masked)
