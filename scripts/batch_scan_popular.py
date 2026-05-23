from __future__ import annotations

"""热门 Python 仓库批量量子脆弱性扫描脚本。

从 GitHub Search API 获取 star 数最高的 Python 仓库，逐一执行量子脆弱性扫描，
将结果写入静态 JSON 文件供前端展示。

用法：
    python3 scripts/batch_scan_popular.py [--top N]
"""

import argparse
import json
import logging
import os
import sys
import tempfile
import time
from pathlib import Path

import httpx

from backend.collectors import CollectionError, collect_github_sources
from backend.popular import (
    BatchResult,
    FetchError,
    RepoInfo,
    RepoScanResult,
)
from backend.reporting import beijing_now_iso
from scan_quantum_vuln import build_migration_score, scan_source_for_crypto

logger = logging.getLogger(__name__)
GITHUB_SEARCH_API = "https://api.github.com/search/repositories"
HTTP_TIMEOUT_SECONDS = 20.0


def fetch_popular_repos(top: int = 20, token: str | None = None) -> list[RepoInfo]:
    if token is None:
        token = os.environ.get("GITHUB_TOKEN")

    headers: dict[str, str] = {"Accept": "application/vnd.github+json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    params = {
        "q": "language:python",
        "sort": "stars",
        "order": "desc",
        "per_page": str(top),
    }

    max_retries = 3
    response: httpx.Response | None = None
    for attempt in range(1, max_retries + 1):
        try:
            with httpx.Client(timeout=HTTP_TIMEOUT_SECONDS, follow_redirects=True) as client:
                response = client.get(GITHUB_SEARCH_API, headers=headers, params=params)
            break
        except httpx.TimeoutException:
            if attempt < max_retries:
                print(f"GitHub API 请求超时，第 {attempt} 次重试。", file=sys.stderr)
                time.sleep(0.1 * attempt)
                continue
            sys.exit(1)
        except httpx.HTTPError as exc:
            if attempt < max_retries:
                print(f"GitHub API 请求失败，第 {attempt} 次重试：{exc}", file=sys.stderr)
                time.sleep(0.1 * attempt)
                continue
            sys.exit(1)

    if response is None:
        sys.exit(1)
    if response.status_code in (403, 429):
        sys.exit(1)
    if response.status_code != 200:
        sys.exit(1)

    data = response.json()
    return [
        RepoInfo(
            full_name=item["full_name"],
            html_url=item["html_url"],
            star_count=item.get("stargazers_count", 0),
        )
        for item in data.get("items", [])
    ]


def scan_single_repo(repo: RepoInfo) -> RepoScanResult:
    try:
        sources = collect_github_sources(repo.html_url)
    except (CollectionError, OSError) as exc:
        return RepoScanResult(
            full_name=repo.full_name,
            star_count=repo.star_count,
            url=repo.html_url,
            migration_score=0,
            finding_count=0,
            success=False,
            error=str(exc),
        )

    all_findings: list[dict] = []
    source_dicts: list[dict] = []
    for origin, filename, content in sources:
        source_dicts.append({"origin": origin, "file_name": filename})
        all_findings.extend(
            scan_source_for_crypto(
                source=content,
                filename=filename,
                source_type="github_repository",
                source_id=repo.full_name,
            )
        )

    if not all_findings:
        return RepoScanResult(
            full_name=repo.full_name,
            star_count=repo.star_count,
            url=repo.html_url,
            migration_score=0,
            finding_count=0,
            success=True,
        )

    score_result = build_migration_score(source_dicts, all_findings)
    sorted_findings = sorted(all_findings, key=lambda f: int(f.get("line", 0)))[:20]
    return RepoScanResult(
        full_name=repo.full_name,
        star_count=repo.star_count,
        url=repo.html_url,
        migration_score=int(score_result["score"]),
        finding_count=len(all_findings),
        algorithms=sorted(set(str(f["algorithm"]) for f in all_findings if f.get("algorithm"))),
        findings=sorted_findings,
        success=True,
    )


def run_batch_scan(repos: list[RepoInfo]) -> BatchResult:
    total = len(repos)
    successful_repos: list[dict] = []
    for index, repo in enumerate(repos, start=1):
        print(f"正在扫描 [{index}/{total}]: {repo.full_name}")
        result = scan_single_repo(repo)
        if not result.success:
            continue
        successful_repos.append(
            {
                "full_name": result.full_name,
                "star_count": result.star_count,
                "url": result.url,
                "migration_score": result.migration_score,
                "finding_count": result.finding_count,
                "algorithms": result.algorithms,
                "findings": result.findings,
            }
        )
    return BatchResult(
        scanned_at=beijing_now_iso(),
        repos=successful_repos,
        meta={
            "total_repos": len(successful_repos),
            "requested_count": total,
            "query": "language:python sort:stars",
        },
    )


def write_results(result: BatchResult, output_path: Path) -> None:
    """将批量扫描结果原子写入 JSON 文件。"""
    output_path = Path(output_path)
    output_dir = output_path.parent
    output_dir.mkdir(parents=True, exist_ok=True)

    data = {
        "scanned_at": result.scanned_at,
        "repos": result.repos,
        "meta": result.meta,
    }

    json_content = json.dumps(data, indent=2, ensure_ascii=False)

    tmp_fd = None
    tmp_path = None
    try:
        tmp_fd, tmp_path = tempfile.mkstemp(
            dir=str(output_dir), suffix=".tmp", prefix=".popular_"
        )
        with os.fdopen(tmp_fd, "w", encoding="utf-8") as f:
            tmp_fd = None
            f.write(json_content)

        os.replace(tmp_path, str(output_path))
        tmp_path = None
    except Exception as exc:
        print(f"写入结果文件失败：{exc}", file=sys.stderr)
        if tmp_path is not None:
            try:
                os.unlink(tmp_path)
            except OSError:
                pass
        if tmp_fd is not None:
            try:
                os.close(tmp_fd)
            except OSError:
                pass
        sys.exit(1)


def main() -> int:
    """CLI 入口：解析参数、执行批量扫描、输出结果。"""
    logging.basicConfig(level=logging.INFO)

    parser = argparse.ArgumentParser(
        description="热门 Python 仓库批量量子脆弱性扫描"
    )
    parser.add_argument(
        "--top",
        type=int,
        default=20,
        help="获取仓库数量，默认 20",
    )
    args = parser.parse_args()

    try:
        repos = fetch_popular_repos(top=args.top)
    except FetchError as exc:
        logger.error("%s", exc)
        return 1

    batch_result = run_batch_scan(repos)

    output_path = Path(__file__).resolve().parents[1] / "web" / "data" / "popular.json"
    write_results(batch_result, output_path)

    total_findings = sum(r.get("finding_count", 0) for r in batch_result.repos)
    print(
        f"扫描完成：共 {batch_result.meta['total_repos']} 个仓库，"
        f"发现 {total_findings} 项风险，结果已写入 {output_path}"
    )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
