"""Offline smoke test against a source or frozen backend using synthetic text only."""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from queue import Queue
import secrets
import subprocess
import tempfile
from threading import Thread
import time
from urllib.request import Request, build_opener, ProxyHandler
from urllib.error import HTTPError


def check(command: list[str]) -> None:
    with tempfile.TemporaryDirectory(prefix='quantum 验收 ') as directory:
        root = Path(directory)
        token = secrets.token_hex(32)
        process = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                   stderr=subprocess.PIPE, text=True, encoding='utf-8', cwd=root,
                                   creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0)
        lines = Queue()
        def read():
            for line in process.stdout:
                lines.put(json.loads(line))
        Thread(target=read, daemon=True).start()
        try:
            process.stdin.write(json.dumps({'token': token, 'data_root': str(root / 'data'),
                                            'cache_root': str(root / 'cache')}) + '\n')
            process.stdin.flush()
            ready = lines.get(timeout=30)
            assert ready['event'] == 'ready' and isinstance(ready['pid'], int) and ready['pid'] > 0
            origin = f"http://127.0.0.1:{ready['port']}"
            opener = build_opener(ProxyHandler({}))
            def request(path, body=None, headers=None, authenticate=True):
                values = {'X-Quantum-Desktop-Token': token} if authenticate else {}
                values.update(headers or {})
                if isinstance(body, dict):
                    body = json.dumps(body).encode('utf-8')
                    values['Content-Type'] = 'application/json'
                try:
                    with opener.open(Request(origin + path, data=body, headers=values), timeout=15) as response:
                        return response.status, response.read(), response.headers
                except HTTPError as exc:
                    return exc.code, exc.read(), exc.headers
            assert request('/')[0] == 200
            assert request('/', authenticate=False)[0] == 403
            assert request('/api/health')[0] == 200
            assert request('/docs')[0] == 404
            assert request('/api/popular/results')[0] == 404
            assert request('/static/src/App.vue')[0] == 404
            code = 'from cryptography.hazmat.primitives.asymmetric import rsa\nrsa.generate_private_key(public_exponent=65537, key_size=2048)\n'
            status, body, _ = request('/api/tasks/snippet', {'content': code, 'filename': '中文 测试.py'},
                                      {'X-Request-ID': 'desktop-smoke-snippet-0001'})
            assert status == 202
            job = json.loads(body)['id']
            for _ in range(50):
                result_status, body, _ = request(f'/api/tasks/{job}/result?include_content=false')
                if result_status == 200:
                    break
                assert result_status == 409
                time.sleep(.1)
            assert result_status == 200
            result = json.loads(body)
            assert result['findings'] and result['sources'][0]['content'] == ''
            for format in ('html', 'markdown', 'json', 'csv'):
                status, output, _ = request(f'/api/report/{format}', result)
                assert status == 200 and output
                if format == 'json':
                    assert json.loads(output)['findings']
            upload = ('--smoke\r\nContent-Disposition: form-data; name="files"; filename="example.py"\r\n'
                      'Content-Type: text/plain\r\n\r\n' + code + '\r\n--smoke--\r\n').encode()
            status, body, _ = request('/api/tasks/files', upload, {'Content-Type': 'multipart/form-data; boundary=smoke',
                                                                  'X-Request-ID': 'desktop-smoke-files-0001'})
            assert status == 202
            process.stdin.write('{"command":"shutdown"}\n')
            process.stdin.flush()
            assert process.wait(timeout=12) == 0
            assert not list((root / 'cache/scans').glob('session-*'))
            print('PASS: authenticated pages/API, static isolation, synthetic snippet/upload, four reports, shutdown cleanup')
        finally:
            if process.poll() is None:
                process.kill()
            process.wait(timeout=5)
            for stream in (process.stdin, process.stdout, process.stderr):
                stream.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('command', nargs='+')
    check(parser.parse_args().command)
