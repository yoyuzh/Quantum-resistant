"""Async job endpoints; legacy routes retain their existing contract."""
from __future__ import annotations

from dataclasses import asdict
import hashlib
from typing import Annotated
from fastapi import APIRouter, Header, Request, HTTPException
from starlette.concurrency import run_in_threadpool

from backend.collection_common import CollectionError
from backend.models import GitHubScanRequest, PyPIScanRequest, PopularScanRequest, SnippetScanRequest
from backend.pipeline import ScanPipeline
from backend.collection_common import CollectedSources, CollectionTimeout
from backend.upload_stream import read_upload
from backend.uploads import normalize_filename
from backend.collection_config import MAX_COLLECTED_FILE_BYTES
from backend.popular import fetch_popular_repos, run_batch_scan, batch_incomplete
from backend.scanning import build_scan_response
from backend.task_store import TaskStore

store = TaskStore()
router = APIRouter(prefix='/api/tasks')
RequestId = Annotated[str, Header(alias='X-Request-ID', min_length=16, max_length=64, pattern=r'^[A-Za-z0-9_-]+$')]


def remote_work(kind, value, budget, *, collector=None):
    # Resolve the public seam at run time, including the offline browser fixture.
    from backend import main
    collector = collector or (main.collect_github_sources if kind == 'github' else main.collect_pypi_sources)
    source_type = 'github_repository' if kind == 'github' else 'pypi_package'
    pipeline = ScanPipeline(budget, source_type)
    try:
        try:
            docs = collector(value, deadline=budget)
        except (CollectionTimeout, RuntimeError, OSError) as exc:
            if not pipeline.documents:
                raise
            docs = CollectedSources(pipeline.documents, partial=True, diagnostics=[{'code': 'collection_interrupted', 'message': str(exc)}])
        if not docs:
            raise CollectionError('未找到可扫描的文本文件')
        return build_scan_response(docs, source_type, deadline=budget).model_dump()
    finally:
        pipeline.finish()


def local_work(documents, source_type, budget):
    pipeline = ScanPipeline(budget, source_type)
    budget.control.emit(stage='读取与分析', candidate_files=len(documents), analysis_total=len(documents), totals_final=True)
    accepted = []
    diagnostics = []
    failure_reason = 'timeout'
    try:
        for document in documents:
            try:
                accepted.append(pipeline.publish(document))
                budget.control.emit(collected_delta=1, processed_delta=1)
            except CollectionTimeout:
                failure_reason = 'cancelled' if budget.control.cancelled.is_set() else 'timeout'
                break
            except (RuntimeError, OSError) as exc:
                failure_reason = 'storage'
                diagnostics.append({'code': 'collection_interrupted', 'message': str(exc)})
                break
        docs = CollectedSources(accepted, candidates=len(documents), skipped=len(documents) - len(accepted), partial=len(accepted) < len(documents),
                                skip_reasons={failure_reason: len(documents) - len(accepted)} if len(accepted) < len(documents) else {}, diagnostics=diagnostics)
        return build_scan_response(docs, source_type, deadline=budget).model_dump()
    finally:
        pipeline.finish()


def popular_work(payload, budget):
    from backend import main
    budget.control.emit(stage='检索热门仓库')
    repos = fetch_popular_repos(payload.top, deadline=budget.child(30))
    budget.control.emit(stage='采集与分析仓库', total_repos=len(repos))
    result = run_batch_scan(repos, deadline=budget)
    if not result.repos:
        raise CollectionError('没有完成的仓库；上次榜单已保留')
    incomplete = batch_incomplete(result) or budget.control.cancelled.is_set()
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


@router.post('/snippet', status_code=202)
def snippet(payload: SnippetScanRequest, request_id: RequestId):
    if not payload.content.strip():
        raise HTTPException(400, '请先输入待扫描内容')
    data = payload.content.encode('utf-8')
    if len(data) > MAX_COLLECTED_FILE_BYTES:
        raise HTTPException(413, '代码片段超过 2 MiB 限制')
    # The job payload is a fingerprint, not another copy of the submitted code.
    name = normalize_filename(payload.filename)
    fingerprint = {'filename': name, 'digest': hashlib.sha256(data).hexdigest()}
    folder = store.storage.folder()
    from backend.temp_storage import StoredDocument
    from scan_quantum_vuln import make_source_id
    try:
        path = store.storage.write_source(folder, data)
        document = StoredDocument(None, name, path, make_source_id(f'0:{name}', payload.content))
        result = store.submit('snippet', fingerprint, request_id, lambda budget: local_work([document], 'snippet', budget), folder=folder)
        if store.jobs[result['id']].folder != folder:
            store.storage.remove_folder(folder)
        return result
    except RuntimeError as exc:
        store.storage.remove_folder(folder)
        raise HTTPException(413, str(exc)) from exc
    except Exception:
        store.storage.remove_folder(folder)
        raise


@router.post('/files', status_code=202)
async def files(request: Request, request_id: RequestId):
    folder = store.storage.folder()
    try:
        documents, fingerprint = await read_upload(request, store.storage, folder)
        result = store.submit('files', fingerprint, request_id, lambda budget: local_work(documents, 'manual_upload', budget), folder=folder)
        if store.jobs[result['id']].folder != folder:
            store.storage.remove_folder(folder)
        return result
    except RuntimeError as exc:
        store.storage.remove_folder(folder)
        raise HTTPException(413, str(exc)) from exc
    except Exception:
        store.storage.remove_folder(folder)
        raise


@router.post('/popular', status_code=202)
def popular(payload: PopularScanRequest, request_id: RequestId):
    from backend.main import POPULAR_SCAN_LOCK
    return store.submit('popular', payload.model_dump(), request_id, lambda budget: popular_work(payload, budget), POPULAR_SCAN_LOCK)


@router.get('/{identity}')
def status(identity: str):
    return store.get(identity)


@router.get('/{identity}/result')
def result(identity: str, include_content: bool = True):
    return store.result(identity, include_content)


@router.get('/{identity}/sources/{source_id}')
def source(identity: str, source_id: str):
    return store.source(identity, source_id)


@router.post('/{identity}/cancel')
def cancel(identity: str):
    return store.cancel(identity)
