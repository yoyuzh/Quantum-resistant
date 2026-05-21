"""Tests for batch_scan_popular.py — Unit tests (task 6.1).

覆盖：
- GitHub Search API 调用参数和认证头
- 编排逻辑（collect_github_sources + scan_source_for_crypto）
- --top 参数解析
- 进度输出格式
- 退出码（成功/部分成功/致命错误）
- 原子写入逻辑（tempfile + rename）
- 空仓库列表场景

Requirements: 1.1–1.6, 2.1–2.7, 3.1–3.5, 8.1–8.5
"""

from __future__ import annotations

import json
import os
import sys
import tempfile
import unittest
from io import StringIO
from pathlib import Path
from unittest.mock import MagicMock, patch

import httpx

from scripts.batch_scan_popular import (
    BatchResult,
    RepoInfo,
    RepoScanResult,
    fetch_popular_repos,
    main,
    run_batch_scan,
    scan_single_repo,
    write_results,
)


def _make_github_search_response(items, status_code=200):
    """构造模拟的 GitHub Search API 响应。"""
    content = json.dumps({"items": items}).encode()
    return httpx.Response(
        status_code=status_code,
        content=content,
        headers={"content-type": "application/json"},
        request=httpx.Request("GET", "https://api.github.com/search/repositories"),
    )


class TestFetchPopularRepos(unittest.TestCase):
    """验证 fetch_popular_repos 的 API 调用参数和认证头。"""

    @patch("scripts.batch_scan_popular.httpx.Client")
    def test_calls_github_api_with_correct_params(self, mock_client_cls):
        """Req 1.1: 验证查询参数 language:python, sort=stars, order=desc."""
        items = [{"full_name": "owner/repo", "html_url": "https://github.com/owner/repo", "stargazers_count": 5000}]
        mock_client = MagicMock()
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client.get.return_value = _make_github_search_response(items)
        mock_client_cls.return_value = mock_client

        repos = fetch_popular_repos(top=10, token=None)

        mock_client.get.assert_called_once()
        call_kwargs = mock_client.get.call_args
        params = call_kwargs.kwargs.get("params") or call_kwargs[1].get("params")
        self.assertEqual(params["q"], "language:python")
        self.assertEqual(params["sort"], "stars")
        self.assertEqual(params["order"], "desc")
        self.assertEqual(params["per_page"], "10")
        self.assertEqual(len(repos), 1)
        self.assertEqual(repos[0].full_name, "owner/repo")
        self.assertEqual(repos[0].star_count, 5000)

    @patch("scripts.batch_scan_popular.httpx.Client")
    def test_includes_bearer_token_when_provided(self, mock_client_cls):
        """Req 1.2: 设置 token 时包含 Authorization: Bearer <token>。"""
        mock_client = MagicMock()
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client.get.return_value = _make_github_search_response([])
        mock_client_cls.return_value = mock_client

        fetch_popular_repos(top=5, token="my-secret-token")

        call_kwargs = mock_client.get.call_args
        headers = call_kwargs.kwargs.get("headers") or call_kwargs[1].get("headers")
        self.assertEqual(headers["Authorization"], "Bearer my-secret-token")

    @patch("scripts.batch_scan_popular.httpx.Client")
    def test_no_auth_header_when_no_token(self, mock_client_cls):
        """Req 1.3: 无 token 时不包含 Authorization 头。"""
        mock_client = MagicMock()
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client.get.return_value = _make_github_search_response([])
        mock_client_cls.return_value = mock_client

        with patch.dict(os.environ, {}, clear=False):
            os.environ.pop("GITHUB_TOKEN", None)
            fetch_popular_repos(top=5, token=None)

        call_kwargs = mock_client.get.call_args
        headers = call_kwargs.kwargs.get("headers") or call_kwargs[1].get("headers")
        self.assertNotIn("Authorization", headers)

    @patch("scripts.batch_scan_popular.httpx.Client")
    def test_rate_limit_403_exits_nonzero(self, mock_client_cls):
        """Req 1.4: 速率限制 403 时以非零退出码终止。"""
        mock_client = MagicMock()
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client.get.return_value = _make_github_search_response([], status_code=403)
        mock_client_cls.return_value = mock_client

        with self.assertRaises(SystemExit) as ctx:
            fetch_popular_repos(top=5, token=None)
        self.assertNotEqual(ctx.exception.code, 0)

    @patch("scripts.batch_scan_popular.httpx.Client")
    def test_rate_limit_429_exits_nonzero(self, mock_client_cls):
        """Req 1.4: 速率限制 429 时以非零退出码终止。"""
        mock_client = MagicMock()
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client.get.return_value = _make_github_search_response([], status_code=429)
        mock_client_cls.return_value = mock_client

        with self.assertRaises(SystemExit) as ctx:
            fetch_popular_repos(top=5, token=None)
        self.assertNotEqual(ctx.exception.code, 0)

    @patch("scripts.batch_scan_popular.httpx.Client")
    def test_http_500_exits_nonzero(self, mock_client_cls):
        """Req 1.5: 其他 HTTP 错误以非零退出码终止。"""
        mock_client = MagicMock()
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client.get.return_value = _make_github_search_response([], status_code=500)
        mock_client_cls.return_value = mock_client

        with self.assertRaises(SystemExit) as ctx:
            fetch_popular_repos(top=5, token=None)
        self.assertNotEqual(ctx.exception.code, 0)

    @patch("scripts.batch_scan_popular.httpx.Client")
    def test_timeout_exits_nonzero(self, mock_client_cls):
        """Req 1.5: 超时以非零退出码终止。"""
        mock_client = MagicMock()
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client.get.side_effect = httpx.TimeoutException("timeout")
        mock_client_cls.return_value = mock_client

        with self.assertRaises(SystemExit) as ctx:
            fetch_popular_repos(top=5, token=None)
        self.assertNotEqual(ctx.exception.code, 0)

    @patch("scripts.batch_scan_popular.httpx.Client")
    def test_fewer_results_returns_available(self, mock_client_cls):
        """Req 1.6: 结果不足 top 个时正常返回可用结果。"""
        items = [{"full_name": "a/b", "html_url": "https://github.com/a/b", "stargazers_count": 100}]
        mock_client = MagicMock()
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client.get.return_value = _make_github_search_response(items)
        mock_client_cls.return_value = mock_client

        repos = fetch_popular_repos(top=20, token=None)
        self.assertEqual(len(repos), 1)


class TestScanSingleRepo(unittest.TestCase):
    """验证 scan_single_repo 的编排逻辑。"""

    @patch("scripts.batch_scan_popular.scan_source_for_crypto")
    @patch("scripts.batch_scan_popular.collect_github_sources")
    def test_successful_scan_with_findings(self, mock_collect, mock_scan):
        """Req 2.1, 2.2, 2.4: 成功扫描并计算迁移评分。"""
        mock_collect.return_value = [
            ("https://github.com/owner/repo", "crypto.py", "from cryptography import rsa")
        ]
        mock_scan.return_value = [
            {"line": 1, "file_name": "crypto.py", "algorithm": "RSA", "risk_level": "高风险", "evidence": "rsa import"}
        ]

        repo = RepoInfo(full_name="owner/repo", html_url="https://github.com/owner/repo", star_count=1000)
        result = scan_single_repo(repo)

        self.assertTrue(result.success)
        self.assertIsNone(result.error)
        self.assertEqual(result.finding_count, 1)
        self.assertIn("RSA", result.algorithms)
        self.assertGreater(result.migration_score, 0)

    @patch("scripts.batch_scan_popular.collect_github_sources")
    def test_collection_failure_returns_error(self, mock_collect):
        """Req 2.3: 采集失败时返回 success=False 并记录 error。"""
        from backend.collectors import CollectionError
        mock_collect.side_effect = CollectionError("网络错误")

        repo = RepoInfo(full_name="owner/repo", html_url="https://github.com/owner/repo", star_count=500)
        result = scan_single_repo(repo)

        self.assertFalse(result.success)
        self.assertIn("网络错误", result.error)
        self.assertEqual(result.finding_count, 0)
        self.assertEqual(result.migration_score, 0)

    @patch("scripts.batch_scan_popular.scan_source_for_crypto")
    @patch("scripts.batch_scan_popular.collect_github_sources")
    def test_zero_findings_returns_valid_result(self, mock_collect, mock_scan):
        """Req 2.7: 零 findings 时返回 finding_count=0, migration_score=0。"""
        mock_collect.return_value = [("https://github.com/owner/clean", "main.py", "print('hello')")]
        mock_scan.return_value = []

        repo = RepoInfo(full_name="owner/clean", html_url="https://github.com/owner/clean", star_count=200)
        result = scan_single_repo(repo)

        self.assertTrue(result.success)
        self.assertEqual(result.finding_count, 0)
        self.assertEqual(result.migration_score, 0)
        self.assertEqual(result.algorithms, [])

    @patch("scripts.batch_scan_popular.scan_source_for_crypto")
    @patch("scripts.batch_scan_popular.collect_github_sources")
    def test_findings_capped_at_20_sorted_by_line(self, mock_collect, mock_scan):
        """Req 2.5: findings 最多 20 条，按 line 升序。"""
        mock_collect.return_value = [("https://github.com/owner/repo", "big.py", "code")]
        findings = [
            {"line": 100 - i, "file_name": "big.py", "algorithm": "RSA", "risk_level": "高风险", "evidence": f"f{i}"}
            for i in range(30)
        ]
        mock_scan.return_value = findings

        repo = RepoInfo(full_name="owner/repo", html_url="https://github.com/owner/repo", star_count=300)
        result = scan_single_repo(repo)

        self.assertEqual(len(result.findings), 20)
        lines = [f["line"] for f in result.findings]
        self.assertEqual(lines, sorted(lines))


class TestRunBatchScan(unittest.TestCase):
    """验证 run_batch_scan 编排逻辑。"""

    @patch("scripts.batch_scan_popular.scan_single_repo")
    def test_empty_repo_list_returns_valid_result(self, mock_scan):
        """Req 2.6: 空仓库列表时返回有效空结果。"""
        result = run_batch_scan([])

        mock_scan.assert_not_called()
        self.assertEqual(result.repos, [])
        self.assertEqual(result.meta["total_repos"], 0)
        self.assertEqual(result.meta["requested_count"], 0)
        self.assertTrue(result.scanned_at.endswith("+08:00"))

    @patch("scripts.batch_scan_popular.scan_single_repo")
    def test_progress_output_format(self, mock_scan):
        """Req 8.3: 打印进度信息格式 '正在扫描 [i/N]: owner/repo'。"""
        mock_scan.return_value = RepoScanResult(
            full_name="owner/repo", star_count=100, url="https://github.com/owner/repo",
            migration_score=0, finding_count=0, algorithms=[], findings=[], success=True,
        )
        repos = [RepoInfo(full_name="owner/repo", html_url="https://github.com/owner/repo", star_count=100)]

        captured = StringIO()
        with patch("sys.stdout", captured):
            run_batch_scan(repos)

        output = captured.getvalue()
        self.assertIn("正在扫描 [1/1]: owner/repo", output)

    @patch("scripts.batch_scan_popular.scan_single_repo")
    def test_failed_repo_skipped_others_continue(self, mock_scan):
        """Req 2.3: 单仓库失败时跳过继续扫描其余仓库。"""
        mock_scan.side_effect = [
            RepoScanResult(
                full_name="fail/repo", star_count=500, url="https://github.com/fail/repo",
                migration_score=0, finding_count=0, success=False, error="timeout",
            ),
            RepoScanResult(
                full_name="ok/repo", star_count=300, url="https://github.com/ok/repo",
                migration_score=10, finding_count=1, algorithms=["RSA"],
                findings=[{"line": 1, "algorithm": "RSA"}], success=True,
            ),
        ]
        repos = [
            RepoInfo(full_name="fail/repo", html_url="https://github.com/fail/repo", star_count=500),
            RepoInfo(full_name="ok/repo", html_url="https://github.com/ok/repo", star_count=300),
        ]

        result = run_batch_scan(repos)

        self.assertEqual(result.meta["total_repos"], 1)
        self.assertEqual(result.repos[0]["full_name"], "ok/repo")

    @patch("scripts.batch_scan_popular.scan_single_repo")
    def test_meta_contains_requested_count_and_query(self, mock_scan):
        """Req 3.2: meta 包含 requested_count 和 query。"""
        mock_scan.return_value = RepoScanResult(
            full_name="a/b", star_count=100, url="https://github.com/a/b",
            migration_score=0, finding_count=0, success=True,
        )
        repos = [RepoInfo(full_name="a/b", html_url="https://github.com/a/b", star_count=100)]
        result = run_batch_scan(repos)

        self.assertEqual(result.meta["requested_count"], 1)
        self.assertEqual(result.meta["query"], "language:python sort:stars")


class TestWriteResults(unittest.TestCase):
    """验证原子写入逻辑。"""

    def test_atomic_write_creates_valid_json(self):
        """Req 3.1, 3.2, 3.4: 原子写入产生有效 JSON，UTF-8 编码，中文保留。"""
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "data" / "popular.json"
            batch_result = BatchResult(
                scanned_at="2024-01-15T14:30:00+08:00",
                repos=[{"full_name": "测试/仓库", "star_count": 100}],
                meta={"total_repos": 1, "requested_count": 20, "query": "language:python sort:stars"},
            )

            write_results(batch_result, output_path)

            self.assertTrue(output_path.exists())
            content = output_path.read_text(encoding="utf-8")
            data = json.loads(content)
            self.assertEqual(data["scanned_at"], "2024-01-15T14:30:00+08:00")
            self.assertEqual(data["repos"][0]["full_name"], "测试/仓库")
            self.assertIn("测试/仓库", content)
            self.assertNotIn("\\u", content)

    def test_creates_output_directory_if_missing(self):
        """Req 3.3: 输出目录不存在时自动创建。"""
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "nested" / "dir" / "popular.json"
            batch_result = BatchResult(
                scanned_at="2024-01-15T14:30:00+08:00",
                repos=[],
                meta={"total_repos": 0, "requested_count": 20, "query": "language:python sort:stars"},
            )

            write_results(batch_result, output_path)
            self.assertTrue(output_path.exists())

    def test_write_failure_exits_nonzero(self):
        """Req 3.5: 写入失败时以非零退出码退出。"""
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "popular.json"
            batch_result = BatchResult(
                scanned_at="2024-01-15T14:30:00+08:00",
                repos=[],
                meta={"total_repos": 0, "requested_count": 20, "query": "language:python sort:stars"},
            )

            with patch("tempfile.mkstemp", side_effect=PermissionError("permission denied")):
                with self.assertRaises(SystemExit) as ctx:
                    write_results(batch_result, output_path)
                self.assertNotEqual(ctx.exception.code, 0)

    def test_json_has_2_space_indentation(self):
        """Req 3.2: JSON 使用 2-space 缩进。"""
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "popular.json"
            batch_result = BatchResult(
                scanned_at="2024-01-15T14:30:00+08:00",
                repos=[{"full_name": "a/b"}],
                meta={"total_repos": 1, "requested_count": 20, "query": "language:python sort:stars"},
            )

            write_results(batch_result, output_path)

            content = output_path.read_text(encoding="utf-8")
            lines = content.split("\n")
            indented_lines = [line for line in lines if line.startswith(" ")]
            for line in indented_lines:
                stripped = line.lstrip(" ")
                indent_len = len(line) - len(stripped)
                self.assertEqual(indent_len % 2, 0, f"Indent not multiple of 2: '{line}'")

    def test_atomic_write_replaces_existing_file(self):
        """Req 3.1: 原子写入通过 tempfile + os.replace 实现。"""
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "popular.json"
            batch_result = BatchResult(
                scanned_at="2024-01-15T14:30:00+08:00",
                repos=[{"full_name": "x/y", "star_count": 42}],
                meta={"total_repos": 1, "requested_count": 20, "query": "language:python sort:stars"},
            )

            write_results(batch_result, output_path)

            batch_result.repos = [{"full_name": "new/repo", "star_count": 99}]
            write_results(batch_result, output_path)
            second_content = output_path.read_text(encoding="utf-8")

            self.assertIn("new/repo", second_content)
            self.assertNotIn("x/y", second_content)


class TestMainCLI(unittest.TestCase):
    """验证 CLI 入口和参数解析。"""

    @patch("scripts.batch_scan_popular.write_results")
    @patch("scripts.batch_scan_popular.run_batch_scan")
    @patch("scripts.batch_scan_popular.fetch_popular_repos")
    def test_top_argument_parsed(self, mock_fetch, mock_run, mock_write):
        """Req 8.2: --top 参数正确传递给 fetch_popular_repos。"""
        mock_fetch.return_value = []
        mock_run.return_value = BatchResult(
            scanned_at="2024-01-15T14:30:00+08:00", repos=[],
            meta={"total_repos": 0, "requested_count": 10, "query": "language:python sort:stars"},
        )
        with patch("sys.argv", ["batch_scan_popular.py", "--top", "10"]):
            main()
        mock_fetch.assert_called_once_with(top=10)

    @patch("scripts.batch_scan_popular.write_results")
    @patch("scripts.batch_scan_popular.run_batch_scan")
    @patch("scripts.batch_scan_popular.fetch_popular_repos")
    def test_default_top_is_20(self, mock_fetch, mock_run, mock_write):
        """Req 8.2: 默认 --top 为 20。"""
        mock_fetch.return_value = []
        mock_run.return_value = BatchResult(
            scanned_at="2024-01-15T14:30:00+08:00", repos=[],
            meta={"total_repos": 0, "requested_count": 20, "query": "language:python sort:stars"},
        )
        with patch("sys.argv", ["batch_scan_popular.py"]):
            main()
        mock_fetch.assert_called_once_with(top=20)

    @patch("scripts.batch_scan_popular.write_results")
    @patch("scripts.batch_scan_popular.run_batch_scan")
    @patch("scripts.batch_scan_popular.fetch_popular_repos")
    def test_success_returns_zero(self, mock_fetch, mock_run, mock_write):
        """Req 8.5: 成功时返回退出码 0。"""
        mock_fetch.return_value = []
        mock_run.return_value = BatchResult(
            scanned_at="2024-01-15T14:30:00+08:00", repos=[],
            meta={"total_repos": 0, "requested_count": 20, "query": "language:python sort:stars"},
        )
        with patch("sys.argv", ["batch_scan_popular.py"]):
            exit_code = main()
        self.assertEqual(exit_code, 0)

    @patch("scripts.batch_scan_popular.write_results")
    @patch("scripts.batch_scan_popular.run_batch_scan")
    @patch("scripts.batch_scan_popular.fetch_popular_repos")
    def test_summary_output_format(self, mock_fetch, mock_run, mock_write):
        """Req 8.4: 打印完成摘要包含仓库数、findings 数、输出路径。"""
        mock_fetch.return_value = []
        mock_run.return_value = BatchResult(
            scanned_at="2024-01-15T14:30:00+08:00",
            repos=[{"full_name": "a/b", "finding_count": 3}],
            meta={"total_repos": 1, "requested_count": 20, "query": "language:python sort:stars"},
        )
        captured = StringIO()
        with patch("sys.argv", ["batch_scan_popular.py"]):
            with patch("sys.stdout", captured):
                main()
        output = captured.getvalue()
        self.assertIn("1 个仓库", output)
        self.assertIn("3 项风险", output)
        self.assertIn("popular.json", output)

    @patch("scripts.batch_scan_popular.fetch_popular_repos")
    def test_fatal_error_exits_nonzero(self, mock_fetch):
        """Req 8.5: 致命错误（无法访问 GitHub API）以非零退出码终止。"""
        mock_fetch.side_effect = SystemExit(1)
        with patch("sys.argv", ["batch_scan_popular.py"]):
            with self.assertRaises(SystemExit) as ctx:
                main()
            self.assertNotEqual(ctx.exception.code, 0)


if __name__ == "__main__":
    unittest.main()
