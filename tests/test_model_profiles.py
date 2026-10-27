from __future__ import annotations

import asyncio
import json
import tempfile
import time
from pathlib import Path
from unittest.mock import patch
import unittest

import httpx
from backend.ai.config import ConfigStore,Settings
from backend.ai.config import BUDGETS
from backend.ai.preferences import Preferences
from backend.ai.profiles import Profiles
from backend.ai.provider import body,complete,parse,ProviderError
from backend.ai.providers import PROVIDERS
from backend import task_routes
from tests import test_ai_integrated as fixture
from tests.test_result_integration import MemoryCredentials


class ProfileTests(unittest.TestCase):
    setUp=fixture.IntegratedAiTests.setUp
    wait=fixture.IntegratedAiTests.wait
    scan=fixture.IntegratedAiTests.scan

    def isolated(self):
        folder=tempfile.TemporaryDirectory();self.addCleanup(folder.cleanup)
        self.service.preferences=Preferences(Path(folder.name),MemoryCredentials())
        return Path(folder.name)

    def profile(self,name='A',**changes):
        response=self.client.post('/api/ai/profiles',json={'name':name,'preset':'compatible','base_url':'https://model.invalid/v1',
            'model':'fixture-'+name,'api_key':'test-only-'+name,'consent':True,'remember':False,**changes})
        self.assertEqual(response.status_code,201,response.text)
        return response.json()

    def activate(self,profile):
        r=self.client.put('/api/ai/active',json={'profile_id':profile['id'] if profile else None})
        self.assertEqual(r.status_code,200,r.text)

    def test_profiles_have_single_activation_and_durable_off_without_keys_in_metadata(self):
        root=self.isolated();a=self.profile(remember=True);b=self.profile('B',remember=True)
        self.activate(a);self.activate(b)
        self.assertEqual(sum(p['active'] for p in self.client.get('/api/ai/profiles').json()['profiles']),1)
        self.activate(None)
        disk=(root/'ai-profiles.json').read_text(encoding='utf-8')
        self.assertNotIn('test-only-',disk)
        restored=Profiles(self.service);restored.bootstrap()
        self.assertIsNone(restored.active)
        self.assertEqual(len(restored.values),2)
        restored.activate(a['id'])
        self.assertEqual(restored.current().api_key,'test-only-A')

    def test_switch_does_not_cancel_bound_task_and_edit_does(self):
        self.isolated();a=self.profile();b=self.profile('B');self.activate(a)
        self.fake.delay=.3
        identity=self.scan('import opaque\nopaque.encrypt(a)\n',ai=True)
        self.activate(b)
        result=self.wait(identity)
        self.assertEqual(result['ai_analysis']['profile_id'],a['id'])
        self.assertEqual(result['ai_analysis']['status'],'completed')
        # A new task binds B, even before the static phase reaches the model.
        second=self.scan('import opaque\nopaque.encrypt(b)\n',ai=True)
        changed={k:v for k,v in b.items() if k in Settings.model_fields}
        changed.update(name='B',model='edited',api_key='')
        self.client.put('/api/ai/profiles/'+b['id'],json=changed).raise_for_status()
        result=self.wait(second)
        self.assertIn(result['ai_analysis']['status'],('cancelled','skipped'))

    def test_save_failure_is_session_only_and_credential_removal_is_per_profile(self):
        root=self.isolated();a=self.profile(remember=True);b=self.profile('B',remember=True)
        self.activate(a)
        self.client.delete('/api/ai/profiles/'+b['id']+'/credential').raise_for_status()
        profiles=self.client.get('/api/ai/profiles').json()['profiles']
        self.assertTrue(next(p for p in profiles if p['id']==a['id'])['has_key'])
        self.assertFalse(next(p for p in profiles if p['id']==b['id'])['has_key'])
        self.service.preferences.credentials.fail=True
        c=self.profile('C',remember=True)
        self.assertFalse(c['credential_persisted'])
        self.assertTrue(c['ready'])
        self.assertNotIn('test-only-',(root/'ai-profiles.json').read_text(encoding='utf-8'))

    def test_legacy_migration_retires_fallback_only_after_new_secret_is_durable(self):
        root=self.isolated()
        settings=Settings(preset='compatible',base_url='https://model.invalid/v1',model='legacy',api_key='test-only-legacy',consent=True)
        config=self.service.config.update(settings)
        self.service.preferences.save(config)
        profiles=Profiles(self.service);profiles.bootstrap()
        self.assertEqual(profiles.current().api_key,'test-only-legacy')
        self.assertFalse((root/'ai-settings.json').exists())
        self.assertTrue((root/'ai-profiles.json').exists())
        restored=Profiles(self.service);restored.bootstrap()
        self.assertEqual(restored.current().api_key,'test-only-legacy')
        self.assertEqual(len(self.service.preferences.credentials.values),1)

    def test_permanent_auth_failure_updates_ready_state_without_exposing_upstream_text(self):
        self.isolated();a=self.profile();self.activate(a);self.fake.status=401
        result=self.wait(self.scan(ai=True))
        self.assertEqual(result['ai_analysis']['stop_reason'],'provider_auth')
        status=self.client.get('/api/ai/config').json()
        self.assertFalse(status['ready'])
        self.assertEqual(status['connection']['status'],'provider_auth')
        self.assertNotIn('must never be reflected',json.dumps(status))

    def test_explicit_old_profile_selection_rejected_and_inactive_test_allowed(self):
        self.isolated();a=self.profile();b=self.profile('B');self.activate(b)
        r=self.client.post('/api/tasks/snippet',json={'content':'x=1','ai_assisted':True,'ai_profile_id':a['id'],'ai_profile_version':a['version']},headers={'X-Request-ID':'outdated-profile-request'})
        self.assertEqual(r.status_code,409)
        r=self.client.post('/api/ai/profiles/'+a['id']+'/test')
        self.assertEqual(r.status_code,200,r.text)
        self.assertEqual(self.fake.requests[-1]['messages'][0]['content'],'Return only the JSON object {"ok":true}.')

    def test_fixed_connection_test_does_not_require_source_sending_consent(self):
        self.isolated();a=self.profile()
        value={**self.service.profiles.public(a['id']),'consent':False}
        from backend.ai.profiles import ProfileInput
        fields={k:v for k,v in value.items() if k in ProfileInput.model_fields}
        self.service.profiles.put(a['id'],ProfileInput(**fields),persist=False)
        response=self.client.post('/api/ai/profiles/'+a['id']+'/test')
        self.assertEqual(response.status_code,200,response.text)
        self.assertFalse(self.service.profiles.values[a['id']].consent)
        self.assertFalse(self.service.profiles.public(a['id'])['ready'])

    def test_switching_model_for_continuation_retains_completed_opinions_and_origins(self):
        self.isolated();a=self.profile();b=self.profile('B');self.activate(a)
        with patch.dict(BUDGETS,calls=1,batch=1):
            first=self.scan('import opaque\nopaque.encrypt_a(data)\nopaque.sign_b(data)\nopaque.verify_c(data)',ai=True)
            original=self.wait(first)
        self.assertEqual(original['ai_analysis']['coverage']['completed'],1)
        self.activate(b)
        request=self.client.post('/api/tasks/ai',json={'source_task_id':first,'ai_profile_id':b['id'],'ai_profile_version':b['version']},headers={'X-Request-ID':'cross-model-continuation'})
        self.assertEqual(request.status_code,202,request.text)
        result=self.wait(request.json()['id'])
        self.assertEqual(result['ai_analysis']['coverage']['completed'],3)
        self.assertEqual({o['model_origin']['profile_id'] for o in result['ai_analysis']['opinions']},{a['id'],b['id']})
        self.assertEqual(len(result['ai_analysis']['runs']),2)
        report=self.client.get('/api/tasks/'+request.json()['id']+'/report/markdown')
        self.assertEqual(report.status_code,200,report.text)
        self.assertIn('fixture-A',report.text)
        self.assertIn('fixture-B',report.text)
        self.assertNotIn('test-only-',report.text)
        sent=[c['focus']['line'] for wire in self.fake.requests for c in json.loads(wire['messages'][1]['content'])['candidates']]
        self.assertEqual(len(sent),len(set(sent)))


class AdapterTests(unittest.IsolatedAsyncioTestCase):
    async def test_native_refusals_and_truncations_are_not_accepted_as_completed_json(self):
        fixtures=[('responses',{'status':'incomplete','output':[]},'output_truncated'),
                  ('responses',{'status':'completed','output':[{'content':[{'type':'refusal','refusal':'blocked'}]}]},'provider_refusal'),
                  ('anthropic',{'stop_reason':'max_tokens','content':[]},'output_truncated'),
                  ('anthropic',{'stop_reason':'refusal','content':[]},'provider_refusal'),
                  ('gemini',{'candidates':[{'finishReason':'MAX_TOKENS','content':{'parts':[]}}]},'output_truncated'),
                  ('gemini',{'promptFeedback':{'blockReason':'SAFETY'}},'provider_refusal')]
        for protocol,payload,expected in fixtures:
            config=ConfigStore().update(Settings(preset='compatible',base_url='https://model.invalid/v1',model='fixture',api_key='test-only',consent=True,protocol=protocol,output_mode='schema'))
            async def response(request):return httpx.Response(200,json=payload)
            async with httpx.AsyncClient(transport=httpx.MockTransport(response)) as client:
                with self.assertRaises(ProviderError) as caught:
                    await complete(client,config,b'{}',lambda:None)
            self.assertEqual(caught.exception.code,expected)

    async def test_native_protocols_use_their_auth_paths_usage_and_finish_status(self):
        candidate={'candidate_id':'c','source_id':'s','line':1,'refs':[], 'evidence':[{'evidence_id':'e','source_id':'s','file_name':'a.py','start_line':1,'end_line':1,'text':'opaque.sign(a)'}],'expansions':{}}
        opinion={'candidate_id':'c1','algorithm':'unknown','purpose':'unknown','decision':'insufficient','basis':'insufficient','rationale':'实现未提供','evidence_ids':['e1']}
        content=json.dumps({'opinions':[opinion]})
        fixtures={
            'responses':({'status':'completed','output':[{'content':[{'type':'output_text','text':content}]}],'usage':{'input_tokens':5,'output_tokens':3,'total_tokens':8}},'Authorization','responses'),
            'anthropic':({'stop_reason':'end_turn','content':[{'type':'text','text':content}],'usage':{'input_tokens':5,'output_tokens':3}},'x-api-key','messages'),
            'gemini':({'candidates':[{'finishReason':'STOP','content':{'parts':[{'text':content}]}}],'usageMetadata':{'promptTokenCount':5,'candidatesTokenCount':3,'totalTokenCount':8}},'x-goog-api-key','generateContent'),
        }
        for protocol,(payload,header,path) in fixtures.items():
            store=ConfigStore();config=store.update(Settings(preset='compatible',base_url='https://model.invalid/v1',model='fixture',api_key='test-only',consent=True,protocol=protocol,auth_mode={'anthropic':'x-api-key','gemini':'x-goog-api-key'}.get(protocol,'bearer'),output_mode='schema'))
            async def response(request):
                self.assertIn(header.lower(),request.headers)
                self.assertIn(path,request.url.path)
                wire=json.loads(request.content)
                self.assertNotIn('tools',wire)
                return httpx.Response(200,json=payload)
            async with httpx.AsyncClient(transport=httpx.MockTransport(response)) as client:
                text,usage=await complete(client,config,body(config,[candidate]),lambda:None)
            self.assertEqual(usage['total_tokens'],8)
            self.assertEqual(len(parse(text,[candidate])[0]),1)

    def test_all_provider_presets_have_explicit_supported_capabilities(self):
        self.assertGreaterEqual(len(PROVIDERS),20)
        for provider in PROVIDERS:
            self.assertIn(provider['protocol'],('chat','responses','anthropic','gemini'))
            self.assertIn(provider['output_mode'],('schema','json','prompt'))
