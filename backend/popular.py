from __future__ import annotations

import logging
from collections import Counter
from dataclasses import asdict, dataclass, field

import httpx

from backend.collection_common import CollectionError, CollectionTimeout, Deadline, concurrent_collect, remote_client_options
from backend.collectors import collect_github_sources
from backend.remote_sources import describe_http_error, github_get, github_headers
from backend.reporting import beijing_now_iso
from scan_quantum_vuln import analyze_source, build_migration_score, make_source_id

logger = logging.getLogger(__name__)
GITHUB_SEARCH_API = "https://api.github.com/search/repositories"
POPULAR_SCAN_WORKERS = 3
POPULAR_REPO_FILE_LIMIT = 6
POPULAR_BATCH_TIMEOUT_SECONDS = 60.0
SEARCH_QUERY = "topic:cryptography language:python"


@dataclass
class RepoInfo:
    full_name: str
    html_url: str
    star_count: int


@dataclass
class RepoScanResult:
    full_name: str
    star_count: int
    url: str
    migration_score: int
    finding_count: int
    algorithms: list[str] = field(default_factory=list)
    findings: list[dict] = field(default_factory=list)
    success: bool = True
    error: str | None = None
    coverage: dict | None = None
    diagnostics: list[dict] = field(default_factory=list)
    details_truncated: bool = False
    error_code: str | None = None


@dataclass
class BatchResult:
    scanned_at: str
    repos: list[dict] = field(default_factory=list)
    meta: dict = field(default_factory=dict)
    failures: list[dict] = field(default_factory=list)


class FetchError(CollectionError):
    pass


def fetch_popular_repos(top: int = 20, token: str | None = None, *, deadline: Deadline | None = None) -> list[RepoInfo]:
    budget = deadline or Deadline.after(POPULAR_BATCH_TIMEOUT_SECONDS)
    headers = github_headers()
    if token:
        headers["Authorization"] = f"Bearer {token}"
    try:
        with httpx.Client(**remote_client_options()) as client:
            response = github_get(client, GITHUB_SEARCH_API, headers=headers,
                params={"q": SEARCH_QUERY, "sort": "stars", "order": "desc", "per_page": str(top)},
                deadline=budget)
            items = response.json()["items"]
            return [RepoInfo(item["full_name"], item["html_url"], item.get("stargazers_count", 0)) for item in items[:top]]
    except CollectionTimeout:
        raise
    except (httpx.HTTPError, CollectionError, OSError, ValueError, KeyError, TypeError) as exc:
        raise FetchError(f"无法检索热门仓库：{describe_http_error(exc)}") from exc


def scan_single_repo(repo: RepoInfo, max_files: int = POPULAR_REPO_FILE_LIMIT, *, deadline: Deadline | None = None, reserve_seconds: float = 0) -> RepoScanResult:
    budget = deadline or Deadline.after(POPULAR_BATCH_TIMEOUT_SECONDS)
    try:
        collection_budget = budget.child(max(0, budget.remaining() - reserve_seconds)) if reserve_seconds else budget
        sources = collect_github_sources(repo.html_url, max_files=max_files, deadline=collection_budget)
        if not sources:
            raise CollectionError("没有采集到可扫描文件")
        findings, records = [], []
        diagnostics = list(getattr(sources, "diagnostics", []))
        for index, (origin, filename, content) in enumerate(sources):
            try:
                budget.remaining()
            except CollectionTimeout:
                if not records:
                    raise
                diagnostics.append({"code": "analysis_interrupted", "message": "分析中断，已保留完整分析的文件。"})
                break
            budget.control.emit(stage="分析仓库源码")
            source_id = make_source_id(f"{repo.full_name}:{index}:{filename}", content)
            records.append({"source_id": source_id, "file_name": filename})
            found, notes = analyze_source(content, filename, "github_repository", source_id, include_metadata=True)
            findings.extend(found)
            diagnostics.extend(notes)
            budget.control.emit(analyzed_delta=1)
        score = build_migration_score(records, findings)
        ordered = sorted(findings, key=lambda f: (int(f.get("line", 0)), f.get("file_name", "")))
        coverage = dict(getattr(sources, "coverage", {"scanned_files": len(sources), "file_limit": max_files, "candidate_files": None, "partial": True, "skipped_files": 0}))
        if len(records) < len(sources):
            coverage.update(scanned_files=len(records), partial=True, skipped_files=coverage.get('skipped_files', 0) + len(sources) - len(records))
        return RepoScanResult(repo.full_name, repo.star_count, repo.html_url, int(score["score"]), len(findings),
            algorithms=sorted({f["algorithm"] for f in findings}), findings=ordered[:20],
            coverage=coverage,
            diagnostics=diagnostics, details_truncated=len(findings) > 20)
    except (CollectionError, OSError, ValueError) as exc:
        return RepoScanResult(repo.full_name, repo.star_count, repo.html_url, 0, 0, success=False, error=str(exc),
                              error_code='timeout' if isinstance(exc, CollectionTimeout) else 'collection_error')
    finally:
        budget.control.emit(repos_delta=1)


def run_batch_scan(repos: list[RepoInfo], max_workers: int = POPULAR_SCAN_WORKERS, *, max_files: int = POPULAR_REPO_FILE_LIMIT, deadline: Deadline | None = None, reserve_seconds: float = 0) -> BatchResult:
    budget = deadline or Deadline.after(POPULAR_BATCH_TIMEOUT_SECONDS)
    options = {'reserve_seconds': reserve_seconds} if reserve_seconds else {}
    completed, timed_out = concurrent_collect(repos, lambda repo: scan_single_repo(repo, max_files=max_files, deadline=budget, **options), max_workers, budget)
    results = {repo.full_name: result for repo, result in completed}
    successes, failures = [], []
    for repo in repos:
        result = results.get(repo.full_name)
        if isinstance(result, RepoScanResult) and result.success:
            successes.append(asdict(result))
        else:
            error = result.error if isinstance(result, RepoScanResult) else "扫描超时或未完成" if result is None else "扫描发生异常"
            failure = {"full_name": repo.full_name, "error": error}
            if isinstance(result, RepoScanResult) and result.error_code:
                failure['code'] = result.error_code
            failures.append(failure)
    return BatchResult(beijing_now_iso(), successes,
        {"total_repos": len(successes), "requested_count": len(repos), "query": SEARCH_QUERY + " sort:stars",
         "scan_mode": "concurrent", "workers": max(1, min(max_workers, len(repos))) if repos else 0,
         "max_files": max_files, "timed_out": timed_out, "failed_count": len(failures)}, failures)


def scan_popular(top: int = 8, max_files: int = POPULAR_REPO_FILE_LIMIT) -> BatchResult:
    budget = Deadline.after(POPULAR_BATCH_TIMEOUT_SECONDS)
    repos = fetch_popular_repos(top=top, deadline=budget)
    result = run_batch_scan(repos, max_files=max_files, deadline=budget)
    if not result.repos:
        reasons = Counter(item.get("error", "扫描未完成") for item in result.failures)
        details = "；".join(f"{reason}（{count} 个）" for reason, count in reasons.most_common(3))
        suffix = f"。失败原因：{details}" if details else ""
        logger.warning("热门扫描没有成功的仓库：%s", details or "无失败详情")
        if result.meta["timed_out"]:
            raise CollectionTimeout(f"热门扫描超时，没有完成的仓库；上次结果已保留{suffix}")
        raise CollectionError(f"本次未获得可扫描的仓库结果；上次结果已保留{suffix}")
    return result
