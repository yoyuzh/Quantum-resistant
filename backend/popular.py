from __future__ import annotations

"""热门 Python 仓库批量量子脆弱性扫描核心逻辑。

提供获取热门仓库列表、单仓库扫描、批量编排等功能。
被 CLI 脚本 (scripts/batch_scan_popular.py) 和 API 端点共同使用。
"""

import logging
import os
import time
from dataclasses import dataclass, field

import httpx

from backend.collectors import CollectionError, collect_github_sources
from backend.reporting import beijing_now_iso
from scan_quantum_vuln import build_migration_score, scan_source_for_crypto

logger = logging.getLogger(__name__)

GITHUB_SEARCH_API = "https://api.github.com/search/repositories"
HTTP_TIMEOUT_SECONDS = 20.0


@dataclass
class RepoInfo:
    """GitHub 仓库基本信息。"""

    full_name: str  # "owner/repo"
    html_url: str  # "https://github.com/owner/repo"
    star_count: int  # star 数


@dataclass
class RepoScanResult:
    """单仓库扫描结果。"""

    full_name: str
    star_count: int
    url: str
    migration_score: int
    finding_count: int
    algorithms: list[str] = field(default_factory=list)
    findings: list[dict] = field(default_factory=list)
    success: bool = True
    error: str | None = None


@dataclass
class BatchResult:
    """批量扫描汇总结果。"""

    scanned_at: str
    repos: list[dict] = field(default_factory=list)
    meta: dict = field(default_factory=dict)


class FetchError(RuntimeError):
    """获取热门仓库列表时发生的错误。"""


def fetch_popular_repos(top: int = 20, token: str | None = None) -> list[RepoInfo]:
    """从 GitHub Search API 获取 star 数最高的 Python 仓库列表。

    内置重试机制（最多 3 次），应对间歇性 SSL/网络错误。

    Args:
        top: 获取仓库数量上限，默认 20。
        token: GitHub Personal Access Token，用于提高速率限制。
               若为 None 则尝试从环境变量 GITHUB_TOKEN 读取。

    Returns:
        RepoInfo 列表，按 star 数降序排列。结果可能少于 top 个。

    Raises:
        FetchError: 当 GitHub API 请求失败时抛出。
    """
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
    last_error: Exception | None = None

    for attempt in range(1, max_retries + 1):
        try:
            with httpx.Client(timeout=HTTP_TIMEOUT_SECONDS, follow_redirects=True) as client:
                response = client.get(GITHUB_SEARCH_API, headers=headers, params=params)
            break  # 请求成功，跳出重试循环
        except httpx.TimeoutException as exc:
            last_error = exc
            if attempt < max_retries:
                logger.warning("GitHub API 请求超时，第 %d 次重试…", attempt)
                time.sleep(attempt * 2)
                continue
            raise FetchError(
                f"GitHub Search API 请求超时（{HTTP_TIMEOUT_SECONDS}s），已重试 {max_retries} 次，请检查网络连接"
            )
        except (httpx.HTTPError, OSError) as exc:
            last_error = exc
            if attempt < max_retries:
                logger.warning("GitHub API 请求失败（%s），第 %d 次重试…", exc, attempt)
                time.sleep(attempt * 2)
                continue
            raise FetchError(
                f"GitHub Search API 请求失败（已重试 {max_retries} 次）：{exc}"
            )
    else:
        raise FetchError(f"GitHub Search API 请求失败：{last_error}")

    if response.status_code in (403, 429):
        raise FetchError(
            f"GitHub Search API 速率限制（HTTP {response.status_code}）。"
            "请设置环境变量 GITHUB_TOKEN 以提高请求配额"
        )

    if response.status_code != 200:
        raise FetchError(
            f"GitHub Search API 返回错误（HTTP {response.status_code}）："
            f"{response.text[:200]}"
        )

    data = response.json()
    items = data.get("items", [])

    repos: list[RepoInfo] = []
    for item in items:
        repos.append(
            RepoInfo(
                full_name=item["full_name"],
                html_url=item["html_url"],
                star_count=item.get("stargazers_count", 0),
            )
        )

    return repos


def scan_single_repo(repo: RepoInfo) -> RepoScanResult:
    """对单个仓库执行量子脆弱性扫描。"""
    max_retries = 3
    sources = None

    for attempt in range(1, max_retries + 1):
        try:
            sources = collect_github_sources(repo.html_url)
            break
        except (CollectionError, OSError) as exc:
            if attempt < max_retries:
                logger.warning(
                    "仓库 %s 采集失败（第 %d 次重试）：%s", repo.full_name, attempt, exc
                )
                time.sleep(attempt * 2)
                continue
            logger.warning("仓库 %s 采集失败（已重试 %d 次）：%s", repo.full_name, max_retries, exc)
            return RepoScanResult(
                full_name=repo.full_name,
                star_count=repo.star_count,
                url=repo.html_url,
                migration_score=0,
                finding_count=0,
                success=False,
                error=str(exc),
            )
        except Exception as exc:
            logger.warning("仓库 %s 采集异常：%s", repo.full_name, exc)
            return RepoScanResult(
                full_name=repo.full_name,
                star_count=repo.star_count,
                url=repo.html_url,
                migration_score=0,
                finding_count=0,
                success=False,
                error=str(exc),
            )

    if sources is None:
        return RepoScanResult(
            full_name=repo.full_name,
            star_count=repo.star_count,
            url=repo.html_url,
            migration_score=0,
            finding_count=0,
            success=False,
            error="采集失败",
        )

    all_findings: list[dict] = []
    source_dicts: list[dict] = []
    for origin, filename, content in sources:
        source_dicts.append({"origin": origin, "filename": filename})
        file_findings = scan_source_for_crypto(
            source=content,
            filename=filename,
            source_type="github_repository",
            source_id=repo.full_name,
        )
        all_findings.extend(file_findings)

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
    migration_score: int = score_result["score"]
    algorithms = sorted(set(str(f["algorithm"]) for f in all_findings if f.get("algorithm")))
    sorted_findings = sorted(all_findings, key=lambda f: int(f.get("line", 0)))
    top_findings = sorted_findings[:20]

    return RepoScanResult(
        full_name=repo.full_name,
        star_count=repo.star_count,
        url=repo.html_url,
        migration_score=migration_score,
        finding_count=len(all_findings),
        algorithms=algorithms,
        findings=top_findings,
        success=True,
    )


def run_batch_scan(repos: list[RepoInfo]) -> BatchResult:
    """编排批量扫描流程：顺序扫描仓库列表，汇总结果。"""
    total = len(repos)
    successful_repos: list[dict] = []

    for i, repo in enumerate(repos, start=1):
        logger.info("正在扫描 [%d/%d]: %s", i, total, repo.full_name)
        result = scan_single_repo(repo)

        if not result.success:
            logger.warning("跳过仓库 %s：%s", repo.full_name, result.error)
            continue

        successful_repos.append({
            "full_name": result.full_name,
            "star_count": result.star_count,
            "url": result.url,
            "migration_score": result.migration_score,
            "finding_count": result.finding_count,
            "algorithms": result.algorithms,
            "findings": result.findings,
        })

    meta = {
        "total_repos": len(successful_repos),
        "requested_count": total,
        "query": "language:python sort:stars",
    }

    return BatchResult(
        scanned_at=beijing_now_iso(),
        repos=successful_repos,
        meta=meta,
    )
