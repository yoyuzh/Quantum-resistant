"""HTTP companion to real browser checks; localhost only, remote collectors mocked."""
from __future__ import annotations

import hashlib
import json
import time
import uuid
from pathlib import Path

import httpx

from tests.deep_static.browser_fixture import CALLER, WRAPPER


def run() -> dict:
    observations = {}
    with httpx.Client(base_url='http://127.0.0.1:8010', timeout=30) as production, \
         httpx.Client(base_url='http://127.0.0.1:8018', timeout=30) as fixture:
        def create(client, kind, **kwargs):
            response = client.post('/api/tasks/' + kind, headers={'X-Request-ID': str(uuid.uuid4())}, **kwargs)
            response.raise_for_status()
            return response.json()['id']

        def finish(client, identity):
            until = time.monotonic() + 15
            while time.monotonic() < until:
                state = client.get('/api/tasks/' + identity).json()
                if state['state'] in ('succeeded', 'partial', 'failed', 'cancelled'):
                    if not state['has_result']:
                        return state, None
                    response = client.get('/api/tasks/' + identity + '/result?include_content=false')
                    response.raise_for_status()
                    return state, response.json()
                time.sleep(.05)
            raise AssertionError('task did not finish within 15 seconds')

        assert production.get('/').status_code == 200
        paths = production.get('/openapi.json').json()['paths']
        assert not any(path.startswith('/fixture') for path in paths)
        observations['production_fixture_routes_absent'] = True
        code = 'import jwt\ndef wrap(algorithm):\n    return jwt.encode({}, "ui-secret-marker", algorithm=algorithm)\nwrap("RS256")\nwrap("HS256")\n'
        base_id = create(production, 'snippet', json={'filename': 'main.py', 'content': code})
        _, base = finish(production, base_id)
        assert 'deep_analysis' not in base
        deep_id = create(production, 'deep-analysis', json={'source_task_id': base_id})
        state, result = finish(production, deep_id)
        deep = result['deep_analysis']
        assert {op['algorithm'].get('value') for op in deep['operations']} == {'RS256', 'HS256'}
        assert result['summary'] == base['summary']
        exported = production.get(f'/api/tasks/{deep_id}/deep-analysis/export').json()
        assert exported['schema_version'] == 'deep-static-1'
        assert 'ui-secret-marker' not in json.dumps(exported)
        assert not any('content' in source for source in exported['snapshot']['sources'])
        observations['snippet_reuse'] = {'source_id': base_id, 'task_id': deep_id, 'state': state['state'], 'algorithms': [op['algorithm'] for op in deep['operations']], 'basic_summary_preserved': True}
        for format_name in ('html', 'markdown', 'json', 'csv'):
            response = production.post('/api/report/' + format_name, json=base)
            assert response.status_code == 200, (format_name, response.text)
        observations['legacy_four_exports'] = 'passed'
        flat_id = create(production, 'files', files=[('files', ('a.py', code.encode()))], data={'analysis_mode': 'deep'})
        _, flat = finish(production, flat_id)
        assert flat['deep_analysis']['snapshot']['path_fidelity'] == 'flat_basename'
        observations['flat_upload'] = {'task_id': flat_id, 'path_fidelity': 'flat_basename'}
        docs = [('project/app/main.py', CALLER), ('project/crypto/__init__.py', ''), ('project/crypto/wrap.py', WRAPPER)]
        manifest = {'schema_version': 'upload-paths-1', 'entries': [
            {'index': i, 'relative_path': path, 'sha256': hashlib.sha256(content.encode()).hexdigest()}
            for i, (path, content) in enumerate(docs)]}
        directory_id = create(production, 'files-with-paths', files=[('files', (Path(path).name, content.encode())) for path, content in docs],
                              data={'analysis_mode': 'deep', 'manifest': json.dumps(manifest)})
        _, directory = finish(production, directory_id)
        assert directory['deep_analysis']['snapshot']['path_fidelity'] == 'relative_paths'
        assert len(directory['deep_analysis']['operations']) == 2
        observations['directory'] = {'task_id': directory_id, 'operations': 2, 'fidelity': 'relative_paths'}
        for kind, payload in [('github', {'repository_url': 'https://github.com/demo/unknown'}), ('pypi', {'package_name': 'demo'})]:
            identity = create(fixture, kind, json={**payload, 'analysis_mode': 'deep'})
            state, remote = finish(fixture, identity)
            assert len(remote['deep_analysis']['operations']) == 2
            observations[kind] = {'task_id': identity, 'state': state['state'], 'operations': 2, 'remote_collector': 'mock'}
        identity = create(fixture, 'pypi', json={'package_name': 'deep-failure', 'analysis_mode': 'deep'})
        state, failed = finish(fixture, identity)
        assert state['state'] == 'partial' and failed['deep_analysis']['status'] == 'failed'
        assert failed['summary']['source_count'] == 3
        observations['deep_failure'] = {'task_id': identity, 'outer': state['state'], 'inner': 'failed', 'basic_preserved': True}
        identity = create(fixture, 'pypi', json={'package_name': 'deep-pause', 'analysis_mode': 'deep'})
        until = time.monotonic() + 10
        while time.monotonic() < until:
            progress = fixture.get('/api/tasks/' + identity).json()
            if progress.get('deep_operations', 0) >= 1:
                break
            time.sleep(.05)
        assert progress.get('deep_operations', 0) >= 1
        assert fixture.post(f'/api/tasks/{identity}/cancel').status_code == 200
        state, cancelled = finish(fixture, identity)
        assert state['state'] == 'partial' and cancelled['deep_analysis']['status'] == 'cancelled'
        assert len(cancelled['deep_analysis']['operations']) == 1
        observations['cancellation'] = {'task_id': identity, 'outer': 'partial', 'inner': 'cancelled', 'complete_operations': 1, 'basic_preserved': True}
        expired_id = observations['github']['task_id']
        assert fixture.post('/fixture/expire-source/' + expired_id).status_code == 200
        expired_export = fixture.get(f'/api/tasks/{expired_id}/deep-analysis/export').json()
        assert all(path['replay_status'] == 'unavailable' for path in expired_export['evidence_paths'])
        response = fixture.post('/api/tasks/deep-analysis', json={'source_task_id': expired_id}, headers={'X-Request-ID': str(uuid.uuid4())})
        assert response.status_code == 409
        observations['expired_source'] = {'task_id': expired_id, 'export_replay': 'unavailable', 'new_analysis_http': 409}
    return observations


if __name__ == '__main__':
    output = Path('output/deep-ui-20261019/http-validation.json')
    result = run()
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(result, ensure_ascii=False, indent=2))
