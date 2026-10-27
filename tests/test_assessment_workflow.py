"""Assessment and independent static evidence must retain different authority."""
from __future__ import annotations

import json
import unittest
from unittest.mock import patch
import httpx
from backend.integration import integrate
from backend import main, task_routes
from backend.popular import RepoInfo
from backend.collection_common import CollectedSources
from tests import test_ai_integrated as ai_fixture
from tests.deep_static.helpers import snapshot
from deep_analysis.pipeline import analyze_crypto
from scanner.engine import analyze_source


class AssessmentTests(unittest.TestCase):
    def test_batch_descriptors_are_fair_bounded_and_unused_shares_are_reassigned(self):
        from backend.popular_analysis import fair_allocations
        self.assertEqual(fair_allocations({'a':20000,'b':0,'c':0},20000),{'a':20000,'b':0,'c':0})
        self.assertEqual(fair_allocations({'a':2,'b':20000,'c':20000},10),{'a':2,'b':4,'c':4})
        values=fair_allocations({str(i):20000 for i in range(30)},20000)
        self.assertEqual(sum(values.values()),20000)
        self.assertLessEqual(max(values.values())-min(values.values()),1)
    def base(self):
        return {'sources':[{'source_id':'s','file_name':'math.py','source_type':'snippet','line_count':2,'char_count':0}], 'findings':[]}

    def opinion(self,**changes):
        return {'candidate_id':'c','algorithm':'RSA','purpose':'encrypt','opinion_kind':'new_candidate','rationale':'模幂与公钥指数构成加密实现。',
                'basis':'implementation','blocking_gaps':[],'decision':'identified','citation_status':'valid',
                'citations':[{'source_id':'s','start_line':1,'end_line':2}],
                'candidate_location':{'source_id':'s','line':2},**changes}

    def test_adopted_ai_is_in_graph_assets_and_migration_but_never_static_score(self):
        base=self.base(); before=integrate(base)
        base['ai_analysis']={'opinions':[self.opinion(purpose='sign')]}
        view=integrate(base)
        self.assertEqual(view['summary'],before['summary'])
        self.assertEqual(view['changes']['ai_assessed'],1)
        self.assertEqual(view['changes']['pending'],0)
        self.assertEqual(view['calls'][0]['algorithm'],'RSA')
        self.assertEqual(view['analysis']['assets'][0]['verification_status'],'ai_assessed')
        self.assertEqual(view['analysis']['migrations'][0]['targets'],['ML-DSA','SLH-DSA'])

    def test_gaps_conflicts_and_unanchored_citations_are_not_adopted(self):
        for changes in ({'blocking_gaps':['实际实现']},{'decision':'conflict'},
                        {'citations':[{'source_id':'other','start_line':1,'end_line':2}]}, {'basis':'insufficient'}):
            with self.subTest(changes=changes):
                base=self.base();base['ai_analysis']={'opinions':[self.opinion(**changes)]}
                view=integrate(base)
                self.assertEqual(view['changes']['ai_assessed'],0)
                self.assertEqual(view['changes']['pending'],1)

    def test_three_definition_factories_are_known_and_not_duplicated(self):
        cases=[('from cryptography.hazmat.primitives.asymmetric import ec\ndef make():\n return ec.generate_private_key(ec.SECP256R1())\n','ECC'),
               ('from Crypto.PublicKey import RSA\ndef make(bits=2048):\n return RSA.generate(bits)\n','RSA'),
               ('from ecdsa import SigningKey,NIST256p\ndef make():\n return SigningKey.generate(curve=NIST256p)\n','ECDSA')]
        for text,algorithm in cases:
            with self.subTest(algorithm=algorithm):
                source=snapshot({'factory.py':text}); identity=source.logical.sources[0].identity.source_id
                base={'sources':[{'source_id':identity,'file_name':'factory.py','source_type':'snippet','line_count':3,'char_count':len(text)}],
                      'findings':analyze_source(text,'factory.py','snippet',identity,include_metadata=True)[0],
                      'deep_analysis':analyze_crypto(source).model_dump(mode='json')}
                view=integrate(base)
                self.assertEqual([(r['algorithm'],r['verification_status']) for r in view['findings']],[(algorithm,'confirmed')])
                self.assertEqual(view['calls'][0]['context_kind'],'uninstantiated_template')
                self.assertEqual(view['calls'][0]['call_chain'],[])

    def test_shadowed_custom_curve_is_not_proven(self):
        text='from ecdsa import SigningKey,NIST256p\nNIST256p=runtime_curve\ndef make():\n return SigningKey.generate(curve=NIST256p)\n'
        operations=analyze_crypto(snapshot({'factory.py':text})).operations
        self.assertFalse(any(o.claims[0].level=='E3' for o in operations))


class RecoveryAndPopularTests(unittest.TestCase):
    setUp=ai_fixture.IntegratedAiTests.setUp
    configure=ai_fixture.IntegratedAiTests.configure
    wait=ai_fixture.IntegratedAiTests.wait
    scan=ai_fixture.IntegratedAiTests.scan

    def test_conflicting_output_fields_are_repaired_instead_of_silently_adopted(self):
        self.configure()
        requests=[]
        async def response(request):
            data=json.loads(request.content);requests.append(data)
            candidate=json.loads(data['messages'][1]['content'])['candidates'][0]
            item={'candidate_id':candidate['candidate_id'],'algorithm':'RSA','purpose':'encrypt',
                  'opinion_kind':'abstain' if len(requests)==1 else 'new_candidate','rationale':'消息与公钥指数执行模幂。',
                  'basis':'implementation','decision':'identified','blocking_gaps':[],
                  'evidence_ids':candidate['evidence_ids'],'missing_information':[],'missing_symbols':[]}
            return httpx.Response(200,json={'choices':[{'finish_reason':'stop','message':{'content':json.dumps({'opinions':[item]})}}]})
        self.client.portal.call(self.service.client.aclose)
        self.service.client=httpx.AsyncClient(transport=httpx.MockTransport(response))
        value=self.wait(self.scan('def rsa_encrypt(m,e,n):\n return pow(m,e,n)\nrsa_encrypt(payload,65537,n)\n',ai=True))
        self.assertEqual(len(requests),2)
        self.assertEqual(value['integrated_analysis']['changes']['ai_assessed'],1)
        self.assertEqual(value['integrated_analysis']['summary']['finding_count'],0)
        self.assertEqual(value['ai_analysis']['coverage']['remaining'],0)

    def test_connection_and_server_errors_recover_while_permanent_errors_stop(self):
        self.configure()
        for code in ('connection',503,402,400):
            requests=[]
            async def response(request):
                requests.append(1)
                if len(requests)==1 or code in (402,400):
                    if code=='connection':
                        raise httpx.ConnectError('private details',request=request)
                    return httpx.Response(code,headers={'Retry-After':'0'},json={'error':'private details'})
                return await self.fake(request)
            self.client.portal.call(self.service.client.aclose)
            self.service.client=httpx.AsyncClient(transport=httpx.MockTransport(response))
            value=self.wait(self.scan(f'import opaque\nopaque.encrypt_{code}(data)\n',ai=True),seconds=6)
            self.assertEqual(len(requests),1 if code in (402,400) else 2)
            self.assertNotIn('private details',json.dumps(value))
            self.assertEqual(value['ai_analysis']['status'],'partial' if code in (402,400) else 'completed')

    def test_transient_rate_limit_recovers_and_auth_never_retries(self):
        self.configure()
        async def once(request):
            if not self.fake.requests:
                self.fake.requests.append({'transient':True})
                return httpx.Response(429,headers={'Retry-After':'0'},json={'private':'do not expose'})
            return await self.fake(request)
        self.client.portal.call(self.service.client.aclose)
        self.service.client=httpx.AsyncClient(transport=httpx.MockTransport(once))
        value=self.wait(self.scan('import opaque\nopaque.encrypt_other(data)\n',ai=True))['ai_analysis']
        self.assertEqual(value['status'],'completed')
        self.assertEqual(value['calls'],2)
        self.assertEqual(value['coverage']['remaining'],0)
        self.fake.requests.clear();self.fake.status=401
        self.service.client=httpx.AsyncClient(transport=httpx.MockTransport(self.fake))
        value=self.wait(self.scan(ai=True))['ai_analysis']
        self.assertEqual(value['stop_reason'],'provider_auth')
        self.assertEqual(value['calls'],1)

    def test_popular_uses_one_ai_budget_and_separate_repository_namespaces(self):
        self.configure()
        repositories=[RepoInfo('one/first','https://github.com/one/first',10),RepoInfo('two/second','https://github.com/two/second',8)]
        def collect(value,**kwargs):
            return CollectedSources([(value,'same.py','import opaque\nopaque.encrypt(data)\n')],candidates=1)
        with patch.object(task_routes,'fetch_popular_repos',return_value=repositories),patch('backend.popular.collect_github_sources',collect),patch.object(main,'write_results') as write:
            response=self.client.post('/api/tasks/popular',json={'top':5,'ai_assisted':True},headers={'X-Request-ID':'test-popular-isolation-1234'})
            self.assertEqual(response.status_code,202,response.text)
            identity=response.json()['id'];result=self.wait(identity,seconds=8)
            self.assertEqual(write.call_count,1)
        self.assertEqual(result['ai_analysis']['coverage']['completed'],2)
        locations=[]
        for repo in result['repos']:
            detail=self.client.get('/api/tasks/'+identity+'/repositories/'+repo['repository_id'])
            self.assertEqual(detail.status_code,200,detail.text)
            value=detail.json();self.assertEqual(len(value['sources']),1)
            locations.append(value['sources'][0]['source_id'])
            self.assertEqual(value['ai_analysis']['coverage']['completed'],1)
            report=self.client.get('/api/tasks/'+identity+'/report/json?repository_id='+repo['repository_id'])
            self.assertEqual(report.status_code,200,report.text)
            self.assertEqual(report.json()['sources'][0]['source_id'],value['sources'][0]['source_id'])
        self.assertEqual(len(set(locations)),2)
        self.assertLessEqual(result['ai_analysis']['calls'],2)

    def test_stopping_popular_ai_preserves_results_without_overwriting_snapshot(self):
        self.configure();self.fake.delay=.8
        repositories=[RepoInfo('one/first','https://github.com/one/first',10)]
        def collect(value,**kwargs):
            return CollectedSources([(value,'same.py','import opaque\nopaque.encrypt(data)\n')],candidates=1)
        with patch.object(task_routes,'fetch_popular_repos',return_value=repositories),patch('backend.popular.collect_github_sources',collect),patch.object(main,'write_results') as write:
            response=self.client.post('/api/tasks/popular',json={'top':5,'ai_assisted':True},headers={'X-Request-ID':'test-popular-stop-ai-1234'})
            identity=response.json()['id']
            deadline=__import__('time').monotonic()+3
            while not self.client.get('/api/tasks/'+identity).json().get('ai_running'):
                self.assertLess(__import__('time').monotonic(),deadline)
                __import__('time').sleep(.01)
            self.client.post('/api/tasks/'+identity+'/stop-ai').raise_for_status()
            result=self.wait(identity)
            write.assert_not_called()
        self.assertEqual(result['ai_analysis']['status'],'cancelled')
        self.assertTrue(result['repos'])
        self.assertTrue(result['meta']['incomplete'])
