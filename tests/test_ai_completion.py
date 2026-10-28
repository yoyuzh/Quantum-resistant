from __future__ import annotations

import json
import asyncio
import unittest
import httpx

from backend.ai.provider import parse
from backend.integration import integrate
from tests import test_ai_integrated as fixture


class CompletionTests(unittest.TestCase):
    setUp = fixture.IntegratedAiTests.setUp
    configure = fixture.IntegratedAiTests.configure
    wait = fixture.IntegratedAiTests.wait
    scan = fixture.IntegratedAiTests.scan

    def test_free_http_slot_refills_before_the_slow_peer_finishes(self):
        self.configure()
        requests=[]
        async def response(request):
            requests.append(json.loads(json.loads(request.content)['messages'][1]['content']))
            if len(requests)==1:
                await asyncio.sleep(.7)
                self.assertGreaterEqual(len(requests),3, 'fast slot waited for its slow peer')
            return await self.fake(request)
        self.client.portal.call(self.service.client.aclose)
        self.service.client=httpx.AsyncClient(transport=httpx.MockTransport(response))
        source='import opaque\n'+'\n'.join(f'opaque.encrypt_{i}(data)' for i in range(40))
        value=self.wait(self.scan(source,ai=True),seconds=8)['ai_analysis']
        self.assertEqual(value['coverage']['completed'],40)
        self.assertEqual(value['calls'],4)
        lines=[c['focus']['line'] for payload in requests for c in payload['candidates']]
        self.assertEqual(len(lines),len(set(lines)))

    def test_parse_coverage_diagnostic_does_not_leave_completed_model_work_retryable(self):
        self.configure()
        value = self.wait(self.scan('from Crypto.PublicKey import RSA\nRSA.generate(2048)\ndef broken(:\n', ai=True))
        ai = value['ai_analysis']
        self.assertTrue(ai['coverage']['search_partial'])
        self.assertEqual(ai['status'], 'completed')
        self.assertEqual(ai['execution']['remaining'], 0)
        self.assertEqual(ai['execution']['retryable'], 0)

    def test_final_repair_is_isolated_and_successes_are_not_resent(self):
        self.configure()
        requests=[]
        async def response(request):
            payload=json.loads(json.loads(request.content)['messages'][1]['content'])
            requests.append(payload)
            if len(requests)<=2:
                return httpx.Response(200,json={'choices':[{'finish_reason':'stop','message':{'content':'{"opinions":[]}'}}]})
            self.assertEqual(len(payload['candidates']),1)
            return await self.fake(request)
        self.client.portal.call(self.service.client.aclose)
        self.service.client=httpx.AsyncClient(transport=httpx.MockTransport(response))
        result=self.wait(self.scan('import opaque\nopaque.encrypt(a)\nopaque.sign(b)\n',ai=True))['ai_analysis']
        self.assertEqual(result['status'],'completed')
        self.assertEqual(result['calls'],4)
        self.assertEqual(result['coverage']['completed'],2)

    def test_failed_first_window_is_repaired_before_unvisited_candidates(self):
        self.configure()
        requests = []

        async def response(request):
            payload = json.loads(json.loads(request.content)['messages'][1]['content'])
            requests.append(payload)
            if len(requests) == 1:
                return httpx.Response(200,json={'choices':[{'finish_reason':'stop','message':{'content':'{"opinions":[]}'}}]})
            return await self.fake(request)

        self.client.portal.call(self.service.client.aclose)
        self.service.client = httpx.AsyncClient(transport=httpx.MockTransport(response))
        source = 'import opaque\n'+'\n'.join(f'opaque.encrypt_{i}(data)' for i in range(20))
        result = self.wait(self.scan(source, ai=True),seconds=8)
        self.assertEqual(result['ai_analysis']['status'],'completed')
        first = requests[0]['candidates'][0]['focus']['line']
        self.assertTrue(any(c['focus']['line']==first and 'repair' in c for p in requests[2:5] for c in p['candidates']))


class ProjectionTests(unittest.TestCase):
    def test_generic_constructor_and_dynamic_jwt_do_not_acquire_algorithm_from_a_name(self):
        from backend.ai.assessment import scope_check
        for text,purpose in (('jwe = JsonWebEncryption()','key_exchange'),('return jwt.encode(header,payload,key,[alg])','sign')):
            opinion={'algorithm':'RSA','purpose':purpose,'candidate_location':{'source_id':'s','line':1},
                     'citations':[{'source_id':'s','start_line':1,'text':text}]}
            self.assertFalse(scope_check(opinion)[0])
        opinion['citations'][0]['text']='return jwt.encode({"alg":"RS256"},payload,key)'
        self.assertTrue(scope_check(opinion)[0])
    def test_reduced_protocol_is_strict_and_derives_relation(self):
        candidate={'candidate_id':'c','source_id':'s','line':2,'refs':[],
                   'evidence':[{'evidence_id':'e','source_id':'s','start_line':1,'end_line':3}], 'expansions':{}}
        item={'candidate_id':'c1','algorithm':'RSA','purpose':'sign','decision':'identified',
              'basis':'implementation','rationale':'公钥签名实现。','evidence_ids':['e1']}
        opinions, notes=parse(json.dumps({'opinions':[item]}),[candidate])
        self.assertFalse(notes)
        self.assertEqual(opinions[0]['opinion_kind'],'new_candidate')
        item['evidence_ids']=['forged']
        opinions, notes=parse(json.dumps({'opinions':[item]}),[candidate])
        self.assertFalse(opinions)
        self.assertTrue(notes[0]['fields'])

    def test_conditional_references_do_not_claim_a_confirmed_target_or_change_score(self):
        base={'sources':[{'source_id':'s','file_name':'a.py','source_type':'snippet'}],
              'findings':[{'source_id':'s','file_name':'a.py','source_type':'snippet','line':1,'algorithm':'RSA',
                           'risk_level':'高','reason':'r','recommendation':'r','evidence':'RSA'}]}
        view=integrate(base)
        asset=view['analysis']['assets'][0]
        self.assertEqual(asset['targets'],[])
        self.assertEqual(len(asset['migration_references']),2)
        self.assertTrue(all(r['kind']=='conditional' for r in asset['migration_references']))
        before=view['summary']
        base['ai_analysis']={'opinions':[{'candidate_id':'c','candidate_location':{'source_id':'s','line':1},
            'algorithm':'RSA','purpose':'sign','opinion_kind':'supports_static','rationale':'签名用途。',
            'basis':'implementation','decision':'identified','blocking_gaps':[], 'citation_status':'valid',
            'citations':[{'source_id':'s','start_line':1,'end_line':1}],
            'static_refs':[__import__('backend.ai.config',fromlist=['digest']).digest(base['findings'][0])]}]}
        after=integrate(base)
        self.assertEqual(after['summary'],before)
        self.assertEqual(after['findings'][0]['purpose_code'],'unknown')
        self.assertEqual(after['findings'][0]['effective_purpose_code'],'sign')
        self.assertEqual(after['analysis']['assets'][0]['purpose_origin'],'ai')


if __name__ == '__main__':
    unittest.main()
