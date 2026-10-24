from __future__ import annotations

import base64
import io
import os
import tarfile
import tempfile
import threading
import unittest
import urllib.request
import zipfile
from unittest.mock import patch

import httpx

from backend.archives import collect_from_tar_bytes, collect_from_zip_bytes, safe_archive_member_name
from backend.collection_common import CollectionError, CollectionTimeout, Deadline, concurrent_collect, get_with_retries, remote_client_options
from backend.remote_sources import decode_github_blob, github_get, github_headers, github_sources, pypi_sources
from backend.remote_cache import RemoteSourceCache


def zip_bytes(files):
    stream = io.BytesIO()
    with zipfile.ZipFile(stream, "w") as archive:
        for name, data in files:
            archive.writestr(name, data)
    return stream.getvalue()


class ArchiveTests(unittest.TestCase):
    def test_zip_keeps_wheel_package_paths(self):
        docs = collect_from_zip_bytes(zip_bytes([("package/a.py", "x=1"), ("package/sub/a.py", "x=2")]), "wheel", strip_root=False)
        self.assertEqual([d[1] for d in docs], ["package/a.py", "package/sub/a.py"])

    def test_archive_rejects_paths_encoding_size_and_limits_count(self):
        archive = zip_bytes([("repo/good.py", "x=1"), ("repo/too-big.py", b"x" * (2 * 1024 * 1024 + 1)), ("../bad.py", "x=1"), ("repo/nonutf.py", b"\xff"), ("repo/second.py", "x=2")])
        result = collect_from_zip_bytes(archive, "origin", max_files=1)
        self.assertEqual(len(result), 1)
        self.assertEqual(result.coverage["candidate_files"], 5)
        self.assertEqual(result.coverage["skipped_files"], 4)
        self.assertTrue(result.coverage["partial"])
        result = collect_from_zip_bytes(archive, "origin")
        self.assertEqual([d[1] for d in result], ["good.py", "second.py"])

    def test_tar_and_absolute_paths(self):
        stream = io.BytesIO()
        with tarfile.open(fileobj=stream, mode="w:gz") as archive:
            entry = tarfile.TarInfo("package-1/package/a.py")
            entry.size = 3
            archive.addfile(entry, io.BytesIO(b"x=1"))
        docs = collect_from_tar_bytes(stream.getvalue(), "origin")
        self.assertEqual(docs[0][1], "package/a.py")
        for name in ["../a.py", "/tmp/a.py", "C:/a.py", "..\\a.py"]:
            self.assertEqual(safe_archive_member_name(name), "")

    def test_deadline_checked_during_archive(self):
        with self.assertRaises(CollectionTimeout):
            collect_from_zip_bytes(zip_bytes([("a.py", "x=1")]), "origin", deadline=Deadline.after(-1))


class HttpCollectionTests(unittest.TestCase):
    def test_github_cache_avoids_second_remote_download(self):
        source = b'algorithm = "RS256"\n'
        with tempfile.TemporaryDirectory() as directory:
            cache = RemoteSourceCache(directory)
            real_client = httpx.Client

            def handle(request):
                if request.url.host == "api.github.com" and request.url.path.endswith("/repos/a/b"):
                    return httpx.Response(200, json={"default_branch": "main"})
                if request.url.path.endswith("/git/trees/main"):
                    return httpx.Response(200, json={"sha": "abc", "tree": [{"type": "blob", "path": "crypto.py", "size": 22, "url": "https://api.github.com/repos/a/b/git/blobs/one"}]})
                if request.url.path.endswith("/git/blobs/one"):
                    return httpx.Response(200, json={"encoding": "base64", "content": base64.b64encode(source).decode()})
                return httpx.Response(404)

            with patch("backend.remote_sources.httpx.Client", side_effect=lambda **kw: real_client(transport=httpx.MockTransport(handle))):
                first = github_sources("https://github.com/a/b", 2, Deadline.after(3), cache=cache)
            self.assertEqual(len(first), 1)
            with patch("backend.remote_sources.httpx.Client", side_effect=lambda **kw: self.fail("network attempted")):
                second = github_sources("https://github.com/a/b", 2, Deadline.after(3), cache=cache)
            self.assertEqual(second, first)

    def test_pypi_cache_avoids_second_remote_download(self):
        archive = zip_bytes([("package/a.py", "x=1")])
        with tempfile.TemporaryDirectory() as directory:
            cache = RemoteSourceCache(directory)
            real_client = httpx.Client

            def handle(request):
                if request.url.host == "pypi.org":
                    return httpx.Response(200, json={"urls": [{"filename": "package.whl", "url": "https://files.pythonhosted.org/package.whl"}]})
                return httpx.Response(200, content=archive)

            with patch("backend.remote_sources.httpx.Client", side_effect=lambda **kw: real_client(transport=httpx.MockTransport(handle))):
                first = pypi_sources("cached-package", Deadline.after(3), cache=cache)
            with patch("backend.remote_sources.httpx.Client", side_effect=lambda **kw: self.fail("network attempted")):
                second = pypi_sources("cached-package", Deadline.after(3), cache=cache)
            self.assertEqual(second, first)

    def test_windows_proxy_and_explicit_environment_priority(self):
        registry = {"https": "http://127.0.0.1:7890"}
        with patch.dict(os.environ, {"NO_PROXY": "localhost"}, clear=True), \
             patch("backend.collection_common.os.name", "nt"), \
             patch.object(urllib.request, "getproxies_registry", return_value=registry, create=True):
            self.assertEqual(remote_client_options()["proxy"], registry["https"])
            os.environ["HTTPS_PROXY"] = "http://explicit-proxy:8080"
            self.assertNotIn("proxy", remote_client_options())

    def test_lowercase_proxy_environment_prevents_system_proxy_override(self):
        with patch.dict(os.environ, {'https_proxy': 'http://explicit:8080'}, clear=True), \
             patch('backend.collection_common.os.name', 'nt'), \
             patch.object(urllib.request, 'getproxies_registry', return_value={'https': 'http://system:7890'}, create=True):
            self.assertNotIn('proxy', remote_client_options())

    def test_github_requests_do_not_forward_authorization_headers(self):
        authorizations = []
        def handle(request):
            authorizations.append(request.headers.get("authorization"))
            return httpx.Response(401 if request.headers.get("authorization") else 200, json={"ok": True})
        headers = {"Authorization": "Bearer unused", "aUtHoRiZaTiOn": "Bearer unused-too", **github_headers()}
        with httpx.Client(transport=httpx.MockTransport(handle)) as client:
            self.assertTrue(github_get(client, "https://api.github.com/repos/a/b", headers=headers).json()["ok"])
            self.assertTrue(github_get(client, "https://api.github.com/repos/a/b/git/trees/main", headers=headers).json()["ok"])
        self.assertEqual(authorizations, [None, None])
        self.assertIn("Authorization", headers)

    def test_github_headers_ignore_environment_credentials(self):
        for token in ("", "unused-old-token", "unused-replacement-token"):
            with self.subTest(token=token), patch.dict(os.environ, {"GITHUB_TOKEN": token}):
                self.assertEqual(github_headers(), {"Accept": "application/vnd.github+json"})

    def test_anonymous_github_401_is_explicit_error(self):
        calls = []
        def handle(request):
            calls.append(request)
            return httpx.Response(401)
        with httpx.Client(transport=httpx.MockTransport(handle)) as client:
            with self.assertRaisesRegex(CollectionError, "公开访问"):
                github_get(client, "https://api.github.com/repos/a/b", headers=github_headers())
        self.assertEqual(len(calls), 1)

    def test_github_collection_preserves_anonymous_401(self):
        calls = []
        real_client = httpx.Client
        def handle(request):
            calls.append(request)
            return httpx.Response(401)
        with patch.dict(os.environ, {"GITHUB_TOKEN": "invalid"}), \
             patch("backend.remote_sources.httpx.Client", side_effect=lambda **kw: real_client(transport=httpx.MockTransport(handle))):
            with self.assertRaisesRegex(CollectionError, "公开访问"):
                github_sources("https://github.com/a/b", 2, Deadline.after(3))
        self.assertEqual(len(calls), 1)

    def test_github_collection_ignores_environment_token(self):
        authorizations = []
        real_client = httpx.Client
        def handle(request):
            authorizations.append(request.headers.get("authorization"))
            if request.headers.get("authorization"):
                return httpx.Response(401)
            if request.url.path == "/repos/a/b":
                return httpx.Response(200, json={"default_branch": "main"})
            if request.url.path.endswith("/git/trees/main"):
                return httpx.Response(200, json={"tree": [{"type": "blob", "path": "crypto.py", "size": 22, "url": "https://api.github.com/repos/a/b/git/blobs/one"}]})
            if request.url.path.endswith("/git/blobs/one"):
                return httpx.Response(200, json={"encoding": "base64", "content": base64.b64encode(b'algorithm = "RS256"\n').decode()})
            return httpx.Response(404)
        with patch.dict(os.environ, {"GITHUB_TOKEN": "invalid"}), \
             patch("backend.remote_sources.httpx.Client", side_effect=lambda **kw: real_client(transport=httpx.MockTransport(handle))):
            result = github_sources("https://github.com/a/b", 2, Deadline.after(3))
        self.assertEqual(result[0][1], "crypto.py")
        self.assertEqual(authorizations, [None, None, None])

    def test_anonymous_rate_limit_is_actionable_without_token_setup(self):
        for status in (403, 429):
            calls = []
            def handle(request):
                calls.append(request)
                return httpx.Response(status, headers={"Retry-After": "120"})
            with self.subTest(status=status), httpx.Client(transport=httpx.MockTransport(handle)) as client:
                with self.assertRaisesRegex(CollectionError, "公开 API 请求受限.*稍后重试") as caught:
                    github_get(client, "https://api.github.com/search/repositories", headers=github_headers())
                self.assertNotIn("GITHUB_TOKEN", str(caught.exception))
                self.assertEqual(len(calls), 1)

    def test_api_rate_limit_uses_public_archive_fallback(self):
        calls = []
        archive = zip_bytes([
            ("b-main/crypto.py", 'algorithm = "RS256"\n'),
            ("b-main/README.md", "# Public repository\nRSA example"),
        ])
        real_client = httpx.Client
        def handle(request):
            self.assertNotIn("authorization", request.headers)
            calls.append((request.url.host, request.url.path))
            if request.url.host == "api.github.com":
                return httpx.Response(403, headers={'X-RateLimit-Remaining': '0', 'Retry-After': '120'})
            if request.url.path.endswith("/main.zip"):
                return httpx.Response(200, content=archive)
            return httpx.Response(404)
        with patch.dict(os.environ, {"GITHUB_TOKEN": "unused-old-token"}), \
             patch("backend.remote_sources.httpx.Client", side_effect=lambda **kw: real_client(transport=httpx.MockTransport(handle))), \
             patch.object(Deadline, 'pause') as pause:
            result = github_sources("https://github.com/a/b", 2, Deadline.after(600))
        self.assertEqual({item[1] for item in result}, {"crypto.py", "README.md"})
        self.assertFalse(any("/git/trees/" in path for _, path in calls))
        pause.assert_not_called()

    def test_public_archive_falls_back_to_master_branch(self):
        calls = []
        archive = zip_bytes([("b-master/crypto.py", 'algorithm = "RS256"\n')])
        real_client = httpx.Client
        def handle(request):
            self.assertNotIn("authorization", request.headers)
            calls.append(request.url.path)
            if request.url.host == "api.github.com":
                return httpx.Response(429, headers={"Retry-After": "120"})
            if request.url.path.endswith("/master.zip"):
                return httpx.Response(200, content=archive)
            return httpx.Response(404)
        with patch("backend.remote_sources.httpx.Client", side_effect=lambda **kw: real_client(transport=httpx.MockTransport(handle))):
            result = github_sources("https://github.com/a/b", 2, Deadline.after(3))
        self.assertEqual(result[0][1], "crypto.py")
        self.assertEqual(calls[-2:], ["/a/b/archive/refs/heads/main.zip", "/a/b/archive/refs/heads/master.zip"])

    def test_github_expired_deadline_never_connects(self):
        real_client = httpx.Client
        with patch("backend.remote_sources.httpx.Client", side_effect=lambda **kw: real_client(transport=httpx.MockTransport(lambda r: self.fail("network attempted")))):
            with self.assertRaises(CollectionTimeout):
                github_sources("https://github.com/a/b", 2, Deadline.after(-1))

    def test_invalid_remote_json_is_collection_error(self):
        real_client = httpx.Client
        for payload in [None, [], {"tree": [None], "urls": [None]}]:
            with self.subTest(payload=payload), patch("backend.remote_sources.httpx.Client", side_effect=lambda **kw: real_client(transport=httpx.MockTransport(lambda r: httpx.Response(200, json=payload)))):
                with self.assertRaises(CollectionError):
                    github_sources("https://github.com/a/b", 2, Deadline.after(3))
                with self.assertRaises(CollectionError):
                    pypi_sources("example", Deadline.after(3))

    def test_retry_and_timeout_values(self):
        calls = []
        def handle(request):
            calls.append(request)
            return httpx.Response(503 if len(calls) == 1 else 200, content=b"done")
        with httpx.Client(transport=httpx.MockTransport(handle)) as client, patch("backend.collection_common.time.sleep"):
            self.assertEqual(get_with_retries(client, "https://api.github.com/fixture", deadline=Deadline.after(2)).content, b"done")
        self.assertEqual(len(calls), 2)
        self.assertLessEqual(calls[0].extensions["timeout"]["read"], 2)

    def test_nonretryable_and_size_errors(self):
        for response in [httpx.Response(404), httpx.Response(200, content=b"too much")]:
            calls = []
            def handle(request):
                calls.append(request)
                return response
            with httpx.Client(transport=httpx.MockTransport(handle)) as client:
                with self.assertRaises((httpx.HTTPStatusError, CollectionError)):
                    get_with_retries(client, "https://api.github.com/fixture", max_bytes=3)
            self.assertEqual(len(calls), 1)

    def test_expired_deadline_never_connects(self):
        with httpx.Client(transport=httpx.MockTransport(lambda r: self.fail("network attempted"))) as client:
            with self.assertRaises(CollectionTimeout):
                get_with_retries(client, "https://api.github.com/fixture", deadline=Deadline.after(-1))

    def test_deadline_stops_scheduling(self):
        release = threading.Event()
        started = []
        def work(item):
            started.append(item)
            release.wait(1)
            return item
        try:
            results, expired = concurrent_collect(range(20), work, 1, Deadline.after(.03))
            self.assertTrue(expired)
            self.assertEqual(started, [0])
            self.assertEqual(results, [])
        finally:
            release.set()

    def test_github_tree_reports_truncation_and_partial_failures(self):
        api = "https://api.github.com/repos/a/b"
        def handle(request):
            if str(request.url) == api:
                return httpx.Response(200, json={"default_branch": "release"})
            if "/git/trees/" in request.url.path:
                return httpx.Response(200, json={"truncated": True, "tree": [
                    {"path": "crypto.py", "size": 10, "type": "blob", "url": api + "/git/blobs/one"},
                    {"path": "bad.py", "size": 10, "type": "blob", "url": api + "/git/blobs/two"}]})
            if request.url.path.endswith("/one"):
                return httpx.Response(200, json={"encoding": "base64", "content": base64.b64encode(b"x=1").decode()})
            return httpx.Response(404)
        real_client = httpx.Client
        with patch("backend.remote_sources.httpx.Client", side_effect=lambda **kw: real_client(transport=httpx.MockTransport(handle))):
            result = github_sources("https://github.com/a/b", 2, Deadline.after(3))
        self.assertEqual(len(result), 1)
        self.assertIsNone(result.coverage["candidate_files"])
        self.assertEqual(result.coverage["skipped_files"], 1)
        self.assertTrue(result.coverage["partial"])

    def test_pypi_wheel_fallback_and_paths(self):
        archive = zip_bytes([("package/a.py", "x=1")])
        def handle(request):
            if request.url.host == "pypi.org":
                return httpx.Response(200, json={"urls": [
                    {"filename": "test.tar.gz", "packagetype": "sdist", "url": "https://files.pythonhosted.org/test.tar.gz"},
                    {"filename": "test-py3-none-any.whl", "packagetype": "bdist_wheel", "url": "https://files.pythonhosted.org/test.whl"}]})
            return httpx.Response(200, content=archive) if request.url.path.endswith(".whl") else httpx.Response(404)
        real_client = httpx.Client
        with patch("backend.remote_sources.httpx.Client", side_effect=lambda **kw: real_client(transport=httpx.MockTransport(handle))):
            result = pypi_sources("test", Deadline.after(3))
        self.assertEqual(result[0][1], "package/a.py")

    def test_pypi_configured_route_first_then_direct_if_system_proxy_is_down(self):
        archive = zip_bytes([("package/a.py", "x=1")])
        client_options = []
        real_client = httpx.Client
        def make_client(**kwargs):
            client_options.append(kwargs)
            def handle(request):
                if kwargs.get('proxy'):
                    raise httpx.ProxyError("system proxy unavailable", request=request)
                if request.url.host == "pypi.org":
                    return httpx.Response(200, json={"urls": [{"filename": "package.whl", "packagetype": "bdist_wheel", "url": "https://files.pythonhosted.org/package.whl"}]})
                return httpx.Response(200, content=archive)
            return real_client(transport=httpx.MockTransport(handle))
        with patch.dict(os.environ, {}, clear=True), \
             patch("backend.remote_sources.remote_client_options", return_value={"follow_redirects": False, "trust_env": True, "proxy": "http://127.0.0.1:7890"}), \
             patch("backend.remote_sources.httpx.Client", side_effect=make_client):
            result = pypi_sources("package", Deadline.after(3))
        self.assertEqual(result[0][1], "package/a.py")
        self.assertEqual([c["trust_env"] for c in client_options], [True, False])

    def test_pypi_working_proxy_is_used_without_an_extra_direct_attempt(self):
        archive = zip_bytes([('package/a.py', 'x=1')])
        options = []
        real_client = httpx.Client
        def handle(request):
            if request.url.host == 'pypi.org':
                return httpx.Response(200, json={'urls': [{'filename': 'package.whl', 'url': 'https://files.pythonhosted.org/package.whl'}]})
            return httpx.Response(200, content=archive)
        def make_client(**kwargs):
            options.append(kwargs)
            return real_client(transport=httpx.MockTransport(handle))
        with patch.dict(os.environ, {}, clear=True), \
             patch('backend.remote_sources.remote_client_options', return_value={'trust_env': True, 'proxy': 'http://system:7890'}), \
             patch('backend.remote_sources.httpx.Client', side_effect=make_client):
            self.assertEqual(len(pypi_sources('package', Deadline.after(3))), 1)
        self.assertEqual(len(options), 1)
        self.assertEqual(options[0]['proxy'], 'http://system:7890')

    def test_pypi_explicit_proxy_failure_never_bypasses_that_proxy(self):
        real_client = httpx.Client
        options = []
        def make_client(**kwargs):
            options.append(kwargs)
            def fail(request):
                raise httpx.ProxyError('configured proxy unavailable', request=request)
            return real_client(transport=httpx.MockTransport(fail))
        with patch.dict(os.environ, {'HTTPS_PROXY': 'http://explicit:7890'}, clear=True), \
             patch('backend.remote_sources.httpx.Client', side_effect=make_client), \
             patch.object(Deadline, 'pause'):
            with self.assertRaisesRegex(CollectionError, '代理连接失败'):
                pypi_sources('package', Deadline.after(600))
        self.assertEqual(len(options), 1)
        self.assertTrue(options[0]['trust_env'])

    def test_blob_encoding_and_decoded_size(self):
        for payload in [{"encoding": "utf8"}, {"encoding": "base64", "content": "!"}, {"encoding": "base64", "content": base64.b64encode(b"\xff").decode()}]:
            with self.assertRaises(CollectionError):
                decode_github_blob(payload)
