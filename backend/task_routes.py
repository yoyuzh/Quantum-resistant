"""Async job endpoints; legacy routes retain their existing contract."""
from __future__ import annotations

from dataclasses import asdict
from typing import Annotated
from fastapi import APIRouter, Header

from backend.collection_common import CollectionError
from backend.models import GitHubScanRequest, PyPIScanRequest, PopularScanRequest
from backend.popular import fetch_popular_repos, run_batch_scan
from backend.scanning import build_scan_response
from backend.task_store import TaskStore

store = TaskStore()
router = APIRouter(prefix='/api/tasks')
RequestId = Annotated[str, Header(alias='X-Request-ID', min_length=16, max_length=64, pattern=r'^[A-Za-z0-9_-]+$')]


def remote_work(kind, value, budget):
    # Resolve the public seam at run time, including the offline browser fixture.
    from backend import main
    collector = main.collect_github_sources if kind == 'github' else main.collect_pypi_sources
    docs = collector(value, deadline=budget.child(150))
    if not docs:
        raise CollectionError('未找到可扫描的文本文件')
    return build_scan_response(docs, 'github_repository' if kind == 'github' else 'pypi_package', deadline=budget).model_dump()


def popular_work(payload, budget):
    from backend import main
    budget.control.emit(stage='检索热门仓库')
    repos = fetch_popular_repos(payload.top, deadline=budget.child(30))
    result = run_batch_scan(repos, deadline=budget, reserve_seconds=30)
    if not result.repos:
        raise CollectionError('没有完成的仓库；上次榜单已保留')
    incomplete = result.meta['timed_out'] or budget.control.cancelled.is_set() or any(f.get('code') == 'timeout' for f in result.failures) or any(
        any(d.get('code') in {'collection_timeout', 'collection_interrupted', 'analysis_interrupted'} for d in repo.get('diagnostics', []))
        for repo in result.repos)
    result.meta['incomplete'] = incomplete
    result.meta['saved_snapshot'] = False
    if not incomplete:
        if not budget.control.begin_commit():
            result.meta['incomplete'] = True
        else:
            try:
                result.meta['saved_snapshot'] = True
                main.write_results(result, main.WEB_DIR / 'data/popular.json')
            except OSError:
                result.meta.update(saved_snapshot=False, incomplete=True)
                result.meta['save_error'] = '无法保存榜单，已保留上次快照；本次结果仍可查看'
    return asdict(result)


@router.post('/github', status_code=202)
def github(payload: GitHubScanRequest, request_id: RequestId):
    return store.submit('github', payload.model_dump(), request_id, lambda budget: remote_work('github', payload.repository_url, budget))


@router.post('/pypi', status_code=202)
def pypi(payload: PyPIScanRequest, request_id: RequestId):
    return store.submit('pypi', payload.model_dump(), request_id, lambda budget: remote_work('pypi', payload.package_name, budget))


@router.post('/popular', status_code=202)
def popular(payload: PopularScanRequest, request_id: RequestId):
    from backend.main import POPULAR_SCAN_LOCK
    return store.submit('popular', payload.model_dump(), request_id, lambda budget: popular_work(payload, budget), POPULAR_SCAN_LOCK)


@router.get('/{identity}')
def status(identity: str):
    return store.get(identity)


@router.get('/{identity}/result')
def result(identity: str):
    return store.result(identity)


@router.post('/{identity}/cancel')
def cancel(identity: str):
    return store.cancel(identity)
