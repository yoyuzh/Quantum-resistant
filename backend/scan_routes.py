"""Compatibility scan endpoints using the shared execution scheduler."""
from __future__ import annotations

from dataclasses import asdict
from fastapi import APIRouter, HTTPException, Request
from starlette.concurrency import run_in_threadpool
from backend import task_routes
from backend.collectors import CollectionError, CollectionTimeout
from backend.models import SourceType, ScanResponse, SnippetScanRequest, GitHubScanRequest, PyPIScanRequest, PopularScanRequest
from backend.scanning import build_scan_response
from backend.uploads import normalize_filename
from backend.popular import batch_incomplete

router = APIRouter()


def restore_source_content(result: dict, budget) -> ScanResponse:
    for source in result['sources']:
        source['content'] = budget.control.source_paths[source['source_id']].read_text(encoding='utf-8')
        source['content_available'] = None
    return ScanResponse(**result)


@router.post("/api/scan/snippet", response_model=ScanResponse)
def scan_snippet(payload: SnippetScanRequest) -> ScanResponse:
    if not payload.content.strip():
        raise HTTPException(400, "请先输入待扫描内容")
    return task_routes.store.run_sync(lambda: build_scan_response([(normalize_filename(payload.filename), payload.content)], "snippet"))


@router.post("/api/scan/files", response_model=ScanResponse)
async def scan_files(request: Request) -> ScanResponse:
    # The legacy response remains complete; ingestion uses the same bounded spool.
    from backend.upload_stream import read_upload
    from backend.collection_common import Deadline
    admission = task_routes.store.reserve()
    storage = task_routes.store.storage
    folder = None
    budget = Deadline.after()
    try:
        folder = storage.folder()
        budget.control.storage, budget.control.folder = storage, folder
        documents, _ = await read_upload(request, storage, folder)
        result = await run_in_threadpool(task_routes.store.run_sync,
                                        lambda: task_routes.local_work(documents, 'manual_upload', budget), admission)
        return restore_source_content(result, budget)
    finally:
        if folder:
            storage.remove_folder(folder)
        admission.release()


def remote_scan(collector, value: str, source_type: SourceType) -> ScanResponse:
    from backend.collection_common import Deadline
    budget = Deadline.after()
    admission = task_routes.store.reserve()
    storage = task_routes.store.storage
    folder = None
    try:
        folder = storage.folder()
        budget.control.storage, budget.control.folder = storage, folder
        result = task_routes.store.run_sync(
            lambda: task_routes.remote_work('github' if source_type == 'github_repository' else 'pypi',
                                           value, budget, collector=collector), admission)
        return restore_source_content(result, budget)
    except CollectionTimeout as exc:
        raise HTTPException(504, str(exc)) from exc
    except CollectionError as exc:
        raise HTTPException(404 if str(exc) == '未找到可扫描的文本文件' else 502, str(exc)) from exc
    finally:
        if folder:
            storage.remove_folder(folder)
        admission.release()


@router.post("/api/scan/github", response_model=ScanResponse)
def scan_github(payload: GitHubScanRequest) -> ScanResponse:
    from backend import main
    return remote_scan(main.collect_github_sources, payload.repository_url, "github_repository")


@router.post("/api/scan/pypi", response_model=ScanResponse)
def scan_pypi(payload: PyPIScanRequest) -> ScanResponse:
    from backend import main
    return remote_scan(main.collect_pypi_sources, payload.package_name, "pypi_package")


@router.post("/api/popular/scan")
def trigger_popular_scan(payload: PopularScanRequest = PopularScanRequest()) -> dict:
    from backend import main
    if not main.POPULAR_SCAN_LOCK.acquire(blocking=False):
        raise HTTPException(409, "热门仓库正在扫描，请等待本次扫描完成")
    try:
        result = task_routes.store.run_sync(lambda: main.scan_popular(top=payload.top))
        if batch_incomplete(result):
            result.meta.update(incomplete=True, saved_snapshot=False)
            return asdict(result)
        main.write_results(result, main.popular_results_path())
        return asdict(result)
    except CollectionTimeout as exc:
        raise HTTPException(504, str(exc)) from exc
    except CollectionError as exc:
        raise HTTPException(502, str(exc)) from exc
    except OSError as exc:
        raise HTTPException(500, "无法保存扫描结果，请检查数据目录权限；上次结果已保留") from exc
    finally:
        main.POPULAR_SCAN_LOCK.release()
