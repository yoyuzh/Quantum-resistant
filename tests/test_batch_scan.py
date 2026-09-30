from __future__ import annotations

import io
import json
import os
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path
from unittest.mock import patch

import httpx
from fastapi.testclient import TestClient

from backend.collection_common import CollectedSources, CollectionError, CollectionTimeout, Deadline
from backend.main import app, POPULAR_SCAN_LOCK
from backend.popular import BatchResult, FetchError, RepoInfo, RepoScanResult, fetch_popular_repos, run_batch_scan, scan_popular, scan_single_repo
from backend.remote_sources import _REJECTED_AUTH
from backend.storage import write_results
from scripts.batch_scan_popular import main


def repo(name="a/b"):
    return RepoInfo(name, "https://github.com/" + name, 100)


def success(name="a/b"):
    return RepoScanResult(name, 100, "https://github.com/" + name, 0, 0)


class PopularServiceTests(unittest.TestCase):
    def setUp(self):
        _REJECTED_AUTH.clear()

    def test_popular_search_retries_invalid_token_anonymously(self):
        authorizations = []
        real_client = httpx.Client
        def handle(request):
            authorizations.append(request.headers.get("authorization"))
            if request.headers.get("authorization"):
                return httpx.Response(401)
            return httpx.Response(200, json={"items": [{"full_name": "a/b", "html_url": "https://github.com/a/b", "stargazers_count": 100}]})
        with patch.dict(os.environ, {"GITHUB_TOKEN": "invalid"}), \
             patch("backend.popular.httpx.Client", side_effect=lambda **kw: real_client(transport=httpx.MockTransport(handle))):
            self.assertEqual(fetch_popular_repos(top=1)[0].full_name, "a/b")
        self.assertEqual(authorizations, ["Bearer invalid", None])

    @patch("backend.popular.github_get")
    def test_search_query_and_token(self, get):
        get.return_value = httpx.Response(200, json={"items": [{"full_name": "a/b", "html_url": "https://github.com/a/b", "stargazers_count": 100}]})
        self.assertEqual(fetch_popular_repos(top=8, token="test-token")[0].full_name, "a/b")
        options = get.call_args.kwargs
        self.assertEqual(options["params"]["q"], "topic:cryptography language:python")
        self.assertEqual(options["params"]["sort"], "stars")
        self.assertEqual(options["params"]["per_page"], "8")
        self.assertEqual(options["headers"]["Authorization"], "Bearer test-token")

    @patch("backend.popular.github_get")
    def test_search_failures(self, get):
        for status in (403, 429, 500):
            response = httpx.Response(status, request=httpx.Request("GET", "https://api.github.com"))
            get.side_effect = httpx.HTTPStatusError("failed", request=response.request, response=response)
            with self.assertRaises(FetchError):
                fetch_popular_repos()
        get.side_effect = CollectionTimeout("timeout")
        with self.assertRaises(CollectionTimeout):
            fetch_popular_repos()

    @patch("backend.popular.github_get")
    def test_malformed_search_response(self, get):
        get.return_value = httpx.Response(200, json={"unexpected": []})
        with self.assertRaises(FetchError):
            fetch_popular_repos()

    @patch("backend.popular.collect_github_sources")
    def test_actual_scan_caps_details_and_uses_unique_sources(self, collect):
        code = 'algorithm = "RS256"\n' * 25
        collect.return_value = CollectedSources([("origin", "same.py", code), ("origin", "same.py", code)])
        result = scan_single_repo(repo())
        self.assertTrue(result.success)
        self.assertEqual(result.finding_count, 50)
        self.assertEqual(len(result.findings), 20)
        self.assertEqual(len({f["source_id"] for f in result.findings}), 2)
        self.assertTrue(result.details_truncated)
        self.assertEqual(collect.call_args.kwargs["max_files"], 5000)

    @patch("backend.popular.collect_github_sources")
    def test_failed_empty_and_clean_collection(self, collect):
        collect.side_effect = CollectionError("failure")
        self.assertFalse(scan_single_repo(repo()).success)
        collect.side_effect = None
        collect.return_value = []
        self.assertFalse(scan_single_repo(repo()).success)
        collect.return_value = [("origin", "clean.py", "x = 1")]
        result = scan_single_repo(repo())
        self.assertTrue(result.success)
        self.assertEqual(result.migration_score, 0)

    @patch("backend.popular.scan_single_repo")
    def test_batch_preserves_order_and_failures(self, scan):
        scan.side_effect = lambda r, **kw: success(r.full_name) if r.full_name != "bad/repo" else RepoScanResult(r.full_name, 0, r.html_url, 0, 0, success=False, error="failed")
        result = run_batch_scan([repo("x/y"), repo("bad/repo"), repo("a/b")])
        self.assertEqual([r["full_name"] for r in result.repos], ["x/y", "a/b"])
        self.assertEqual(result.failures[0]["full_name"], "bad/repo")
        self.assertEqual(result.meta["failed_count"], 1)

    @patch("backend.popular.scan_single_repo")
    def test_expired_budget_submits_no_work(self, scan):
        result = run_batch_scan([repo()], deadline=Deadline.after(-1))
        scan.assert_not_called()
        self.assertTrue(result.meta["timed_out"])
        self.assertEqual(len(result.failures), 1)

    def test_empty_batch(self):
        result = run_batch_scan([])
        self.assertEqual(result.repos, [])
        self.assertEqual(result.meta["total_repos"], 0)

    @patch("backend.popular.run_batch_scan")
    @patch("backend.popular.fetch_popular_repos", return_value=[repo()])
    def test_search_and_batch_share_budget_and_all_failed_is_error(self, fetch, batch):
        batch.return_value = BatchResult("now", meta={"timed_out": False})
        with self.assertRaises(CollectionError):
            scan_popular()
        self.assertIs(fetch.call_args.kwargs["deadline"], batch.call_args.kwargs["deadline"])

    @patch("backend.popular.run_batch_scan")
    @patch("backend.popular.fetch_popular_repos", return_value=[repo()])
    def test_all_failed_batch_reports_collection_reason(self, fetch, batch):
        batch.return_value = BatchResult("now", meta={"timed_out": False}, failures=[
            {"full_name": "a/b", "error": "GitHub 连接失败，请检查代理"},
        ])
        with self.assertRaisesRegex(CollectionError, "GitHub 连接失败，请检查代理"):
            scan_popular()

    @patch("backend.popular.scan_single_repo")
    @patch("backend.popular.fetch_popular_repos")
    def test_popular_partial_failure_keeps_successes(self, fetch, scan):
        fetch.return_value = [repo("good/repo"), repo("bad/repo")]
        scan.side_effect = lambda item, **kw: success(item.full_name) if item.full_name == "good/repo" else RepoScanResult(item.full_name, 0, item.html_url, 0, 0, success=False, error="GitHub 拒绝访问")
        result = scan_popular(top=2)
        self.assertEqual([item["full_name"] for item in result.repos], ["good/repo"])
        self.assertEqual(result.failures[0]["full_name"], "bad/repo")


class PopularApiTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    @patch("backend.main.write_results")
    @patch("backend.main.scan_popular")
    def test_post_actual_service_contract(self, scan, write):
        scan.return_value = BatchResult("now", [{"full_name": "a/b"}], {"failed_count": 1}, [{"full_name": "bad/repo", "error": "failed"}])
        response = self.client.post("/api/popular/scan", json={"top": 5})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["failures"][0]["full_name"], "bad/repo")
        scan.assert_called_once_with(top=5)
        write.assert_called_once()

    @patch("backend.main.scan_popular")
    def test_conflict(self, scan):
        POPULAR_SCAN_LOCK.acquire()
        try:
            self.assertEqual(self.client.post("/api/popular/scan").status_code, 409)
            scan.assert_not_called()
        finally:
            POPULAR_SCAN_LOCK.release()

    @patch("backend.main.write_results")
    @patch("backend.main.scan_popular")
    def test_errors_preserve_old_results_and_release_lock(self, scan, write):
        for error, status in [(CollectionError("failed"), 502), (CollectionTimeout("timeout"), 504)]:
            scan.side_effect = error
            self.assertEqual(self.client.post("/api/popular/scan").status_code, status)
            write.assert_not_called()
            self.assertFalse(POPULAR_SCAN_LOCK.locked())

    @patch("backend.main.write_results", side_effect=OSError("denied"))
    @patch("backend.main.scan_popular", return_value=BatchResult("now", [{"full_name": "a/b"}]))
    def test_write_failure(self, scan, write):
        self.assertEqual(self.client.post("/api/popular/scan").status_code, 500)
        self.assertFalse(POPULAR_SCAN_LOCK.locked())


class StorageAndCliTests(unittest.TestCase):
    def test_atomic_write_and_failure_cleanup(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "nested/popular.json"
            write_results(BatchResult("北京时间", [{"full_name": "中文"}]), path)
            content = path.read_text(encoding="utf-8")
            self.assertEqual(json.loads(content)["scanned_at"], "北京时间")
            with patch("backend.storage.os.replace", side_effect=OSError("denied")):
                with self.assertRaises(OSError):
                    write_results(BatchResult("new"), path)
            self.assertEqual(path.read_text(encoding="utf-8"), content)
            self.assertEqual(list(path.parent.glob("*.tmp")), [])

    @patch("scripts.batch_scan_popular.write_results")
    @patch("scripts.batch_scan_popular.scan_popular", return_value=BatchResult("now", [{"full_name": "a/b"}]))
    def test_cli_defaults_and_options(self, scan, write):
        for argv, top, limit in [(["batch"], 20, 5000), (["batch", "--top", "5", "--max-files", "12"], 5, 12)]:
            with patch("sys.argv", argv), redirect_stdout(io.StringIO()):
                self.assertEqual(main(), 0)
            scan.assert_called_with(top=top, max_files=limit)

    @patch("scripts.batch_scan_popular.scan_popular", side_effect=CollectionError("failure"))
    def test_cli_failure(self, scan):
        with patch("sys.argv", ["batch"]), redirect_stderr(io.StringIO()):
            self.assertEqual(main(), 1)
