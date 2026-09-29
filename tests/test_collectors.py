from __future__ import annotations

import base64
import io
import tarfile
import threading
import unittest
import zipfile
from unittest.mock import patch

import httpx

from backend.archives import collect_from_tar_bytes, collect_from_zip_bytes, safe_archive_member_name
from backend.collection_common import CollectionError, CollectionTimeout, Deadline, concurrent_collect, get_with_retries
from backend.remote_sources import decode_github_blob, github_sources, pypi_sources


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
            self.assertEqual(get_with_retries(client, "https://example.test", deadline=Deadline.after(2)).content, b"done")
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
                    get_with_retries(client, "https://example.test", max_bytes=3)
            self.assertEqual(len(calls), 1)

    def test_expired_deadline_never_connects(self):
        with httpx.Client(transport=httpx.MockTransport(lambda r: self.fail("network attempted"))) as client:
            with self.assertRaises(CollectionTimeout):
                get_with_retries(client, "https://example.test", deadline=Deadline.after(-1))

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

    def test_blob_encoding_and_decoded_size(self):
        for payload in [{"encoding": "utf8"}, {"encoding": "base64", "content": "!"}, {"encoding": "base64", "content": base64.b64encode(b"\xff").decode()}]:
            with self.assertRaises(CollectionError):
                decode_github_blob(payload)
