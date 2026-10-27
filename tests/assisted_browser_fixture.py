"""Offline integrated UI acceptance, localhost:8018 only; no production fixture routes."""
from __future__ import annotations

from unittest.mock import patch

import httpx
import uvicorn

from backend import main
from backend.ai.config import Settings
from backend.ai.service import AiService
from backend.collection_common import CollectedSources
from tests.test_ai_integrated import FakeModel
import json
import asyncio
import os

FILES = {
    'auth/wrapper.py': 'import jwt\ndef issue(payload,key,algorithm):\n return jwt.encode(payload,key,algorithm=algorithm)\n',
    'auth/__init__.py': '',
    'main.py': 'from auth.wrapper import issue\nissue({},key,"RS256")\nissue({},key,"HS256")\n',
    'adapters/long_path_for_crypto_provider_review.py': 'import opaque\ndef encrypt_payload(data):\n return opaque.encrypt(data)\n',
}
if os.environ.get('QUANTUM_FIXTURE_GRAPH_CASES') == 'true':
    FILES['auth/wrapper.py'] += 'def rsa_encrypt_raw(m,e,n):\n return pow(m,e,n)\ncipher=rsa_encrypt_raw(payload,65537,n)\n'
    FILES['keys/factory.py'] = 'from cryptography.hazmat.primitives.asymmetric import ec\ndef make_curve_key():\n return ec.generate_private_key(ec.SECP256R1())\n'
if os.environ.get('QUANTUM_FIXTURE_REAL_FILES') == 'true':
    from pathlib import Path
    FILES = {p.name:p.read_text(encoding='utf-8') for p in (Path(__file__).resolve().parents[1]/'sample_inputs').glob('risky_*.py')}


def collect(value, *, deadline=None, **kwargs):
    if 'scale5000' in str(value):
        text='from cryptography.hazmat.primitives.asymmetric import rsa\nrsa.generate_private_key(public_exponent=65537,key_size=2048)\n'
        docs=[]
        for index in range(5000):
            document=(str(value),f'scale/file_{index:04d}.py',text)
            docs.append(deadline.control.publish(document) if deadline else document)
            if deadline:deadline.control.emit(collected_delta=1,processed_delta=1,candidate_files=5000)
        return CollectedSources(docs,candidates=5000)
    return CollectedSources([(str(value), name, text) for name, text in FILES.items()], candidates=len(FILES))


real_start = AiService.start


class BusinessModel(FakeModel):
    async def __call__(self, request):
        data = json.loads(request.content)
        if len(data['messages']) == 1:
            return await super().__call__(request)
        payload = json.loads(data['messages'][1]['content'])
        delay=float(os.environ.get('QUANTUM_FIXTURE_AI_DELAY','4'))
        first_line=payload['candidates'][0]['focus']['line'] if payload['candidates'] else 0
        await asyncio.sleep(delay * (1.5 if first_line >= 8 else 1))
        opinions = [{'candidate_id':c['candidate_id'], 'algorithm':'RSA' if not c['static_refs'] and any('rsa_encrypt_raw' in e['text'] for e in payload['evidence'] if e['evidence_id'] in c['evidence_ids']) else 'unknown', 'purpose':'unknown',
                     'opinion_kind':'supports_static' if c['static_refs'] else 'new_candidate',
                     'rationale':'原调用已由静态证据核验，迁移前需核对签名格式和验证方。' if c['static_refs'] else '封装实现尚未提供，需要补充具体密码库及算法配置。',
                     'evidence_ids':c['evidence_ids'][:1], 'missing_information':[] if c['static_refs'] else ['封装内部库实现'], 'missing_symbols':[]}
                    for c in payload['candidates']]
        for opinion in opinions:
            opinion.update(basis='implementation' if opinion['algorithm']=='RSA' else 'insufficient',
                           blocking_gaps=[] if opinion['algorithm']=='RSA' else ['实际实现未提供'],
                           decision='identified' if opinion['algorithm']=='RSA' else 'insufficient')
            if opinion['algorithm']=='RSA':
                opinion.update(purpose='encrypt',rationale='封装使用公钥指数与模数执行模幂，调用处传入65537，研判为手写RSA加密。',missing_information=[])
        return httpx.Response(200,json={'choices':[{'finish_reason':'stop','message':{'content':json.dumps({'opinions':opinions},ensure_ascii=False)}}],
                                        'usage':{'prompt_tokens':120,'completion_tokens':100,'total_tokens':220}})


async def fixture_start(self):
    await real_start(self)
    await self.client.aclose()
    self.client = httpx.AsyncClient(transport=httpx.MockTransport(BusinessModel()), follow_redirects=False)
    from backend.ai.profiles import ProfileInput
    self.profiles.put(None,ProfileInput(name='离线验收',base_url='https://model.invalid/v1',model='offline-fixture',preset='compatible',api_key='fixture-credential-only',consent=True,remember=False),activate=True,persist=False)


if __name__ == '__main__':
    from backend import task_routes,popular
    def repos(top=5,**kwargs):
        return [popular.RepoInfo(f'fixture/repository-{i+1}',f'https://github.com/fixture/repository-{i+1}',100-i) for i in range(top)]
    with patch.object(AiService, 'start', fixture_start), patch.object(main, 'collect_github_sources', collect), patch.object(main, 'collect_pypi_sources', collect), patch.object(popular,'collect_github_sources',collect), patch.object(task_routes,'fetch_popular_repos',repos), patch.object(main,'write_results'):
        uvicorn.run(main.app, host='127.0.0.1', port=8018, access_log=False)
