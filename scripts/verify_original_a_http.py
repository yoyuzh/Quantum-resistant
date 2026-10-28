"""Real loopback HTTP acceptance with isolated config and synthetic text only."""
from __future__ import annotations

import json
import os
from pathlib import Path
import socket
import subprocess
import sys
import tempfile
import time

import httpx

ROOT = Path(__file__).resolve().parents[1]
CODE = 'import jwt\nclass Tokens:\n def issue(self): return jwt.encode({},key,algorithm="RS256")\n def read(self,t): return jwt.decode(t,key,algorithms=["RS256"])\n'


def main():
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        port = sock.getsockname()[1]
    with tempfile.TemporaryDirectory(prefix='original-a-http-') as directory:
        env = {**os.environ, 'QUANTUM_AI_CONFIG_DIR': directory, 'QUANTUM_AI_ENABLED': '0',
               'QUANTUM_AI_API_KEY': '', 'QUANTUM_ALLOWED_ORIGINS': 'http://localhost:13010',
               'QUANTUM_ALLOWED_HOSTS': '127.0.0.1', 'TMPDIR': directory}
        with (Path(directory) / 'server.log').open('w+') as log:
            process = subprocess.Popen([sys.executable, '-B', 'start.py', '--host', '127.0.0.1', '--port', str(port), '--strict-port'],
                                       cwd=ROOT, env=env, stdout=log, stderr=log)
            try:
                with httpx.Client(base_url=f'http://127.0.0.1:{port}', trust_env=False, timeout=10) as client:
                    until = time.monotonic() + 25
                    while True:
                        try:
                            if client.get('/api/health').status_code == 200:
                                break
                        except httpx.TransportError:
                            pass
                        assert process.poll() is None and time.monotonic() < until
                        time.sleep(.1)
                    assert client.get('/').status_code == 200
                    denied = client.post('/api/tasks/snippet', json={'content': CODE}, headers={'Origin': 'https://untrusted.invalid', 'X-Request-ID': 'original-a-http-denied'})
                    assert denied.status_code == 403, denied.text
                    submitted = client.post('/api/tasks/snippet', json={'content': CODE, 'filename': 'tokens.py', 'ai_assisted': False},
                                            headers={'Origin': 'http://localhost:13010', 'X-Request-ID': 'original-a-http-template'})
                    assert submitted.status_code == 202, submitted.text
                    identity = submitted.json()['id']
                    until = time.monotonic() + 25
                    while True:
                        response = client.get(f'/api/tasks/{identity}/result', params={'include_content': 'false'})
                        if response.status_code == 200:
                            break
                        assert response.status_code == 409 and time.monotonic() < until, response.text
                        time.sleep(.05)
                    result = response.json()
                    deep = result['deep_analysis']
                    assert deep['engine_identity'].startswith('original-a:d8e07c9'), deep
                    assert len(deep['operations']) == 2, deep
                    assert all(o['context']['kind'] == 'uninstantiated_template' and o['call_site'] is None for o in deep['operations'])
                    assert {o['evidence_scope'] for o in deep['operations']} == {'definition_template', 'algorithm_policy'}
                    assert all(p['versions'] == deep['versions'] for p in deep['evidence_paths'])
                    assert result['integrated_analysis']['context_counts']['invocation'] == 0
                    assert result['sources'][0]['content'] == ''
                    source_id = result['sources'][0]['source_id']
                    source = client.get(f'/api/tasks/{identity}/sources/{source_id}')
                    assert source.status_code == 200 and source.json()['content'] == CODE, source.text
                    reports = {}
                    target = ROOT / 'output/original-a/http'
                    target.mkdir(parents=True, exist_ok=True)
                    for format in ('html', 'markdown', 'json', 'csv'):
                        report = client.get(f'/api/tasks/{identity}/report/{format}')
                        assert report.status_code == 200, report.text
                        assert ('未实例化定义' in report.text and '允许算法' in report.text) if format != 'json' else 'algorithm_policy' in report.text
                        (target / f'report.{format}').write_text(report.text)
                        reports[format] = {'status': report.status_code, 'bytes': len(report.content)}
                    legacy = {path: client.post(path, json={}).status_code for path in ('/api/tasks/deep-analysis', '/api/ai/previews')}
                    evidence = {'page': 200, 'origin_allowed': 202, 'origin_denied': 403, 'engine': deep['engine_identity'],
                                'deep_status': deep['status'], 'versions': deep['versions'], 'source_roundtrip': True,
                                'context_counts': result['integrated_analysis']['context_counts'], 'reports': reports,
                                'legacy_observed': legacy, 'model_calls': 0, 'remote_collection_calls': 0}
                    (target / 'evidence.json').write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + '\n')
                    (target / 'result.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
                    print(json.dumps(evidence, ensure_ascii=False))
            finally:
                process.terminate()
                process.wait(timeout=10)


if __name__ == '__main__':
    main()
