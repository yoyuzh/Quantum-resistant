from __future__ import annotations

import json
import os
from pathlib import Path
from queue import Queue
import secrets
import subprocess
import sys
import tempfile
from threading import Thread
import unittest
from unittest.mock import patch

import httpx
from fastapi.testclient import TestClient
from backend import main, runtime
from backend.desktop_boundary import DesktopBoundary
from backend.runtime import DesktopRuntime
from backend.temp_storage import TemporaryStorage

ROOT = Path(__file__).resolve().parents[1]


class DesktopBoundaryTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        root = Path(self.directory.name)
        self.config = DesktopRuntime(ROOT, root / 'data', root / 'cache', 18321, secrets.token_hex(32))
        self.client = TestClient(DesktopBoundary(main.app, self.config), base_url=self.config.origin)
        self.headers = {'X-Quantum-Desktop-Token': self.config.token}

    def test_every_route_requires_capability_including_reads_and_assets(self):
        asset = next((ROOT / 'web' / 'assets').glob('*.js')).name
        for path in ['/', '/api/health', '/api/config', '/api/tasks/missing',
                     '/api/tasks/missing/sources/a', '/static/data/popular.json', '/static/assets/' + asset]:
            self.assertEqual(self.client.get(path).status_code, 403, path)
            self.assertEqual(self.client.get(path, headers={'X-Quantum-Desktop-Token': 'wrong'}).status_code, 403)
        response = self.client.get('/', headers=self.headers)
        self.assertEqual(response.status_code, 200)
        self.assertIn("script-src 'self'", response.headers['content-security-policy'])
        self.assertNotIn(self.config.token, response.text)

    def test_duplicates_binary_tokens_wrong_host_and_origins_fail_closed(self):
        headers = [('X-Quantum-Desktop-Token', self.config.token), ('X-Quantum-Desktop-Token', self.config.token)]
        self.assertEqual(self.client.get('/api/health', headers=headers).status_code, 403)
        self.assertEqual(self.client.get('/api/health', headers=[(b'X-Quantum-Desktop-Token', b'\xff')]).status_code, 403)
        for origin in ['null', 'https://csrc.nist.gov', 'http://127.0.0.1:18322']:
            self.assertEqual(self.client.get('/api/health', headers={**self.headers, 'Origin': origin}).status_code, 403)
        with patch.dict(os.environ, {'QUANTUM_ALLOWED_HOSTS': 'evil.example', 'QUANTUM_ALLOWED_ORIGINS': 'https://evil.example'}):
            self.assertEqual(self.client.get('/api/health', headers={**self.headers, 'Host': 'evil.example'}).status_code, 403)
            with patch.object(runtime, 'desktop', self.config):
                self.assertEqual(self.client.get('/api/health', headers=self.headers).status_code, 200)

    def test_paths_separate_writable_snapshot_and_private_temporary_storage(self):
        with patch.object(runtime, 'desktop', self.config):
            self.assertEqual(main.popular_results_path(), self.config.data_root / 'popular.json')
            storage = TemporaryStorage()
            try:
                self.assertEqual(storage.root.parent, self.config.cache_root / 'scans')
                self.assertNotEqual(storage.root.parent, self.config.resource_root)
            finally:
                storage.close()
        self.assertEqual(main.popular_results_path(), main.WEB_DIR / 'data/popular.json')

    def test_runtime_secret_not_in_repr_and_invalid_config_rejected(self):
        self.assertNotIn(self.config.token, repr(self.config))
        with self.assertRaises(ValueError):
            DesktopRuntime(ROOT, Path('relative'), Path('relative'), 0, 'short')


class DesktopProcessTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory(prefix='quantum desktop 中文 ')
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.token = secrets.token_hex(32)
        self.process = subprocess.Popen([sys.executable, '-B', str(ROOT / 'desktop/backend_entry.py')],
                                        stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                        text=True, encoding='utf-8', cwd=self.root,
                                        creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0)
        self.addCleanup(self.cleanup_process)
        self.lines = Queue()
        def read():
            for line in self.process.stdout:
                self.lines.put(json.loads(line))
        Thread(target=read, daemon=True).start()
        self.process.stdin.write(json.dumps({'token': self.token, 'data_root': str(self.root / 'data'),
                                            'cache_root': str(self.root / 'cache')}) + '\n')
        self.process.stdin.flush()
        ready = self.lines.get(timeout=15)
        self.assertEqual(ready['event'], 'ready')
        # Windows venv python.exe may redirect to a separate interpreter process.
        self.assertGreater(ready['pid'], 0)
        self.client = httpx.Client(base_url=f"http://127.0.0.1:{ready['port']}", trust_env=False,
                                   headers={'X-Quantum-Desktop-Token': self.token})
        self.addCleanup(self.client.close)

    def cleanup_process(self):
        if self.process.poll() is None:
            self.process.kill()
        self.process.wait(timeout=5)
        for stream in [self.process.stdin, self.process.stdout, self.process.stderr]:
            stream.close()

    def test_atomic_port_real_authenticated_server_scan_and_shutdown(self):
        self.assertEqual(self.client.get('/').status_code, 200)
        self.assertEqual(self.client.get('/api/health').json(), {'status': 'ok'})
        self.assertEqual(self.client.get('/docs').status_code, 404)
        self.assertEqual(self.client.get('/api/popular/results').status_code, 404)
        response = self.client.post('/api/scan/snippet', json={'content': 'value = 1', 'filename': 'example.py'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['findings'], [])
        self.process.stdin.write('{"command":"status","id":1}\n')
        self.process.stdin.flush()
        self.assertEqual(self.lines.get(timeout=5), {'event': 'status', 'id': 1, 'active': 0})
        self.process.stdin.write('{"command":"shutdown"}\n')
        self.process.stdin.flush()
        self.assertEqual(self.process.wait(timeout=12), 0)
        self.assertFalse(list((self.root / 'cache/scans').glob('session-*')))

    def test_parent_pipe_eof_stops_backend(self):
        self.process.stdin.close()
        self.assertEqual(self.process.wait(timeout=12), 0)


if __name__ == '__main__':
    unittest.main()
