from __future__ import annotations

import asyncio
import gzip
import io
import os
import tarfile
import unittest
import zipfile
from unittest.mock import patch

import httpx
from fastapi import HTTPException
from fastapi.testclient import TestClient

from backend.main import app
from backend.collection_common import CollectionError, Deadline, get_with_retries
from backend.archives import collect_from_tar_bytes, collect_from_zip_bytes
from backend.multipart import MultipartParser
from backend.uploads import parse_multipart_files
from backend.upload_stream import read_upload
from backend.temp_storage import TemporaryStorage


def multipart(content=b'x=1', extra_headers=b''):
    return (b'--fixture\r\nContent-Disposition: form-data; name="files"; filename="a.py"\r\n'
            + extra_headers + b'\r\n' + content + b'\r\n--fixture--\r\n')


class BrowserBoundaryTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_static_allowlist_and_security_headers(self):
        for path in ['/static/src/App.vue', '/static/tests/api.test.js', '/static/package.json',
                     '/static/package-lock.json', '/static/app.js', '/static/node_modules/vite/package.json']:
            self.assertEqual(self.client.get(path).status_code, 404, path)
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers['x-content-type-options'], 'nosniff')
        self.assertEqual(response.headers['x-frame-options'], 'DENY')
        self.assertEqual(self.client.get('/static/index.html').status_code, 200)

    def test_host_origin_and_configured_development_source(self):
        self.assertEqual(self.client.get('/api/health', headers={'Host': 'attacker.example'}).status_code, 400)
        for source in ['null', 'https://attacker.example', 'http://testserver.attacker.example', 'http://testserver/path']:
            self.assertEqual(self.client.post('/api/scan/snippet', json={'content': 'x=1'}, headers={'Origin': source}).status_code, 403)
        self.assertEqual(self.client.post('/api/scan/snippet', json={'content': 'x=1'}, headers={'Origin': 'http://testserver'}).status_code, 200)
        with patch.dict(os.environ, {'QUANTUM_ALLOWED_HOSTS': '192.168.1.10', 'QUANTUM_ALLOWED_ORIGINS': 'http://192.168.1.10:3010'}):
            self.assertEqual(self.client.post('/api/scan/snippet', json={'content': 'x=1'},
                             headers={'Host': '192.168.1.10:8010', 'Origin': 'http://192.168.1.10:3010'}).status_code, 200)

    def test_actual_json_bytes_without_length_and_multibyte_source(self):
        with patch('backend.request_boundary.MAX_COLLECTED_FILE_BYTES', 1):
            response = self.client.post('/api/scan/snippet', content=iter([b' ' * 40000, b' ' * 40000]),
                                        headers={'Content-Type': 'application/json'})
            self.assertEqual(response.status_code, 413)

    def test_duplicate_host_and_origin_headers_are_rejected(self):
        for headers in [[('Host', 'attacker.example'), ('Host', 'testserver')],
                        [('Origin', 'http://testserver'), ('Origin', 'https://attacker.example')]]:
            self.assertEqual(self.client.post('/api/scan/snippet', json={'content': 'x=1'}, headers=headers).status_code, 400)
        with patch('backend.request_boundary.MAX_UPLOAD_BYTES', 8):
            self.assertEqual(self.client.post('/api/report/json', json={'sources': []}).status_code, 413)
        with patch('backend.task_routes.MAX_COLLECTED_FILE_BYTES', 3):
            response = self.client.post('/api/tasks/snippet', json={'content': '中文'}, headers={'X-Request-ID': 'security-snippet-0001'})
            self.assertEqual(response.status_code, 413)


class DownloadBoundaryTests(unittest.TestCase):
    def test_forbidden_initial_and_redirect_targets_never_connect(self):
        for target in ['http://pypi.org/x', 'https://pypi.org:444/x', 'https://user@pypi.org/x',
                       'http://127.0.0.1/x', 'https://files.pythonhosted.org.attacker.example/x']:
            calls = []
            with httpx.Client(transport=httpx.MockTransport(lambda r: calls.append(r) or httpx.Response(200))) as client:
                with self.assertRaises(CollectionError):
                    get_with_retries(client, target)
                self.assertEqual(calls, [])
        calls = []
        def redirect(request):
            calls.append(request)
            return httpx.Response(302, headers={'Location': 'http://127.0.0.1/internal'})
        with httpx.Client(transport=httpx.MockTransport(redirect), follow_redirects=True) as client:
            with self.assertRaises(CollectionError):
                get_with_retries(client, 'https://pypi.org/x')
        self.assertEqual(len(calls), 1)

    def test_redirect_limit_and_credentials(self):
        calls = []
        def redirect(request):
            calls.append(request)
            if request.url.host == 'api.github.com':
                return httpx.Response(302, headers={'Location': 'https://codeload.github.com/archive'})
            return httpx.Response(200, content=b'ok')
        with httpx.Client(transport=httpx.MockTransport(redirect),
                          headers={'Authorization': 'Bearer client-default', 'Cookie': 'client-private=1'},
                          auth=('fixture', 'password')) as client:
            self.assertEqual(get_with_retries(client, 'https://api.github.com/archive',
                             headers={'Authorization': 'Bearer secret', 'Cookie': 'private=1'}).content, b'ok')
        self.assertIn('authorization', calls[0].headers)
        self.assertNotIn('authorization', calls[1].headers)
        self.assertNotIn('cookie', calls[1].headers)
        calls.clear()
        with httpx.Client(transport=httpx.MockTransport(lambda r: calls.append(r) or httpx.Response(302, headers={'Location': '/again'}))) as client:
            with self.assertRaises(CollectionError):
                get_with_retries(client, 'https://pypi.org/x')
        self.assertEqual(len(calls), 6)

    def test_compressed_expansion_is_limited_before_storage(self):
        compressed = gzip.compress(b'x' * 200000)
        def handler(request):
            return httpx.Response(200, headers={'Content-Encoding': 'gzip'}, stream=httpx.ByteStream(compressed))
        storage = TemporaryStorage()
        self.addCleanup(storage.close)
        budget = Deadline.after(2)
        budget.control.storage = storage
        budget.control.folder = storage.folder()
        with httpx.Client(transport=httpx.MockTransport(handler)) as client:
            with self.assertRaises(CollectionError):
                get_with_retries(client, 'https://pypi.org/x', max_bytes=1000, spool=True, deadline=budget)
        self.assertEqual(storage.bytes, 0)

    def test_gzip_members_and_truncated_encoding(self):
        for encoded, expected in [(gzip.compress(b'one') + gzip.compress(b'two'), b'onetwo'),
                                  (gzip.compress(b'one')[:-3], None)]:
            with httpx.Client(transport=httpx.MockTransport(lambda r: httpx.Response(200,
                             headers={'Content-Encoding': 'gzip'}, stream=httpx.ByteStream(encoded)))) as client:
                if expected is None:
                    with self.assertRaises(httpx.DecodingError):
                        get_with_retries(client, 'https://pypi.org/x')
                else:
                    self.assertEqual(get_with_retries(client, 'https://pypi.org/x').content, expected)


class UploadBoundaryTests(unittest.TestCase):
    def test_boundary_prefix_all_chunk_splits_and_compatibility(self):
        content = b'x=1\r\n--fixtureXsuffix\r\n--fixture-\r\ny=2'
        data = multipart(content)
        for size in [1, 2, 3, 7, 16, len(data)]:
            parser = MultipartParser('multipart/form-data; boundary=fixture')
            documents = []
            for start in range(0, len(data), size):
                documents.extend(parser.feed(data[start:start + size]))
            documents.extend(parser.finish())
            self.assertEqual(documents, [('a.py', content)])
        self.assertEqual(parse_multipart_files('multipart/form-data; boundary=fixture', data), [('a.py', content.decode())])

    def test_truncation_duplicate_headers_and_injection(self):
        for data in [multipart()[:-5], multipart(extra_headers=b'Content-Disposition: form-data; name="files"; filename="b.py"\r\n')]:
            with self.assertRaises(HTTPException):
                parse_multipart_files('multipart/form-data; boundary=fixture', data)
        with self.assertRaises(HTTPException):
            MultipartParser('multipart/form-data; boundary="bad\r\nboundary"')

    def test_idle_total_timeout_and_disconnect(self):
        class Request:
            headers = {'content-type': 'multipart/form-data; boundary=fixture'}
            async def stream(self):
                await asyncio.sleep(.05)
                yield multipart()
        storage = TemporaryStorage()
        self.addCleanup(storage.close)
        for key in ['UPLOAD_IDLE_SECONDS', 'UPLOAD_TIMEOUT_SECONDS']:
            with patch('backend.upload_stream.' + key, .001), self.assertRaises(HTTPException) as error:
                asyncio.run(read_upload(Request(), storage, storage.folder()))
            self.assertEqual(error.exception.status_code, 408)


class ArchiveBoundaryTests(unittest.TestCase):
    def test_zip_preflight_checks_member_count_before_allocating_directory(self):
        stream = io.BytesIO()
        with zipfile.ZipFile(stream, 'w') as archive:
            archive.writestr('a.py', 'x=1')
            archive.writestr('b.bin', 'x')
        with patch('backend.archive_limits.MAX_ARCHIVE_MEMBERS', 1), patch('backend.archives.zipfile.ZipFile') as constructor:
            with self.assertRaises(CollectionError):
                collect_from_zip_bytes(stream.getvalue(), 'fixture')
            constructor.assert_not_called()

    def test_zip_unsupported_files_consume_expanded_budget(self):
        stream = io.BytesIO()
        with zipfile.ZipFile(stream, 'w') as archive:
            archive.writestr('a.py', 'x=1')
            archive.writestr('ignored.bin', b'x' * 100)
            archive.writestr('b.py', 'x=2')
        with patch('backend.archives.MAX_ARCHIVE_EXPANDED_BYTES', 10):
            result = collect_from_zip_bytes(stream.getvalue(), 'fixture')
        self.assertEqual(len(result), 1)
        self.assertTrue(result.coverage['partial'])
        self.assertEqual(result.coverage['skip_reasons']['archive_budget'], 1)

    def test_zip_false_eocd_count_cannot_bypass_preflight(self):
        stream = io.BytesIO()
        with zipfile.ZipFile(stream, 'w') as archive:
            for name in ['a.py', 'b.py']:
                archive.writestr(name, 'x=1')
        data = bytearray(stream.getvalue())
        offset = data.rfind(b'PK\x05\x06')
        data[offset + 8:offset + 12] = b'\0' * 4
        with patch('backend.archive_limits.MAX_ARCHIVE_MEMBERS', 1), patch('backend.archives.zipfile.ZipFile') as constructor:
            with self.assertRaises(CollectionError):
                collect_from_zip_bytes(bytes(data), 'fixture')
            constructor.assert_not_called()

    def test_tar_member_budget_preserves_indexed_files(self):
        stream = io.BytesIO()
        with tarfile.open(fileobj=stream, mode='w:gz') as archive:
            for name in ['root/a.py', 'root/ignored.bin', 'root/b.py']:
                entry = tarfile.TarInfo(name)
                entry.size = 3
                archive.addfile(entry, io.BytesIO(b'x=1'))
        with patch('backend.archives.MAX_ARCHIVE_MEMBERS', 1):
            result = collect_from_tar_bytes(stream.getvalue(), 'fixture')
        self.assertEqual(result[0][1], 'a.py')
        self.assertTrue(result.coverage['partial'])
        self.assertIsNone(result.coverage['candidate_files'])

    def test_tar_unsupported_payload_consumes_expansion_allowance(self):
        stream = io.BytesIO()
        with tarfile.open(fileobj=stream, mode='w:gz') as archive:
            entry = tarfile.TarInfo('ignored.bin')
            entry.size = 100000
            archive.addfile(entry, io.BytesIO(b'x' * entry.size))
        with patch('backend.archive_limits.MAX_ARCHIVE_EXPANDED_BYTES', 2048):
            with self.assertRaises(CollectionError):
                collect_from_tar_bytes(stream.getvalue(), 'fixture')
