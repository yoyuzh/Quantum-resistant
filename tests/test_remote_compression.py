from __future__ import annotations

import gzip
import io
import json
import unittest
import zipfile
from unittest.mock import patch

import httpx

from backend.collection_common import Deadline, get_with_retries
from backend.popular import fetch_popular_repos
from backend.remote_sources import describe_http_error, pypi_sources


class RemoteCompressionTests(unittest.TestCase):
    def client_factory(self, handler):
        real_client = httpx.Client
        return lambda **kwargs: real_client(transport=httpx.MockTransport(handler))

    def compressed(self, content, content_type):
        encoded = gzip.compress(content)
        return httpx.Response(200, headers={
            'Content-Encoding': 'gzip', 'Content-Length': str(len(encoded)),
            'Content-Type': content_type,
        }, stream=httpx.ByteStream(encoded))

    def test_pypi_compressed_metadata_and_archive(self):
        archive = io.BytesIO()
        with zipfile.ZipFile(archive, 'w') as package:
            package.writestr('package/crypto.py', 'from Crypto.PublicKey import RSA\nRSA.generate(2048)')
        calls = []

        def handle(request):
            calls.append(request.url.host)
            if request.url.host == 'pypi.org':
                metadata = {'urls': [{'filename': 'package.whl', 'packagetype': 'bdist_wheel',
                                     'url': 'https://files.pythonhosted.org/package.whl'}]}
                return self.compressed(json.dumps(metadata).encode(), 'application/json')
            return self.compressed(archive.getvalue(), 'application/octet-stream')

        with patch('backend.remote_sources.httpx.Client', side_effect=self.client_factory(handle)):
            result = pypi_sources('package', Deadline.after(3))
        self.assertEqual(calls, ['pypi.org', 'files.pythonhosted.org'])
        self.assertEqual(result[0][1], 'package/crypto.py')
        self.assertIn('RSA.generate', result[0][2])

    def test_popular_search_compressed_json(self):
        metadata = {'items': [{'full_name': 'owner/repo', 'html_url': 'https://github.com/owner/repo',
                               'stargazers_count': 12}]}
        with patch('backend.popular.httpx.Client', side_effect=self.client_factory(
                lambda request: self.compressed(json.dumps(metadata).encode(), 'application/json'))):
            result = fetch_popular_repos(top=5, deadline=Deadline.after(3))
        self.assertEqual(result[0].full_name, 'owner/repo')
        self.assertEqual(result[0].star_count, 12)

    def test_invalid_compression_does_not_retry_or_masquerade_as_connection_failure(self):
        calls = []

        def handle(request):
            calls.append(request)
            return httpx.Response(200, headers={'Content-Encoding': 'gzip'},
                                  stream=httpx.ByteStream(b'not compressed'))

        with httpx.Client(transport=httpx.MockTransport(handle)) as client:
            with self.assertRaises(httpx.DecodingError) as raised:
                get_with_retries(client, 'https://api.github.com/fixture', deadline=Deadline.after(3))
        self.assertEqual(len(calls), 1)
        self.assertIn('解压失败', describe_http_error(raised.exception))

    def test_error_messages_distinguish_transport_and_format(self):
        for error, expected in [(httpx.ProxyError('private proxy credentials'), '代理连接失败'),
                                (httpx.ConnectError('private host'), '无法建立远程连接'),
                                (ValueError('private response body'), 'JSON')]:
            message = describe_http_error(error)
            self.assertIn(expected, message)
            self.assertNotIn('private', message)
