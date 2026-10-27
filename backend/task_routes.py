"""Async job endpoints; legacy routes retain their existing contract."""
from __future__ import annotations

import hashlib
from typing import Annotated
from fastapi import APIRouter, Header, Request, HTTPException

from backend.models import GitHubScanRequest, PyPIScanRequest, PopularScanRequest, SnippetScanRequest
from backend.upload_stream import read_upload
from backend.uploads import normalize_filename
from backend.collection_config import MAX_COLLECTED_FILE_BYTES
from backend.popular import fetch_popular_repos, run_batch_scan
from backend.task_store import TaskStore
from backend.task_execution import remote_work as execute_remote, local_work, popular_work as execute_popular

store = TaskStore()
router = APIRouter(prefix='/api/tasks')
RequestId = Annotated[str, Header(alias='X-Request-ID', min_length=16, max_length=64, pattern=r'^[A-Za-z0-9_-]+$')]


def remote_work(kind, value, budget, *, collector=None):
    # Compatibility seams for callers and the offline fixture stay at the adapter.
    from backend import main
    collector = collector or (main.collect_github_sources if kind == 'github' else main.collect_pypi_sources)
    return execute_remote(kind, value, budget, collector=collector)


def popular_work(payload, budget):
    from backend import main
    budget.control.assisted_popular = 'ai_assisted' in getattr(payload,'model_fields_set',set())
    return execute_popular(payload, budget, search=fetch_popular_repos, batch_scan=run_batch_scan,
                           save=main.write_results, output_path=main.popular_results_path())


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
    fingerprint = {'filename': name, 'digest': hashlib.sha256(data).hexdigest(), 'ai_assisted': payload.ai_assisted, 'ai_profile_id':payload.ai_profile_id, 'ai_profile_version':payload.ai_profile_version}
    admission = store.reserve()
    folder = None
    from backend.temp_storage import StoredDocument
    from scan_quantum_vuln import make_source_id
    try:
        folder = store.storage.folder()
        path = store.storage.write_source(folder, data)
        document = StoredDocument(None, name, path, make_source_id(f'0:{name}', payload.content))
        result = store.submit('snippet', fingerprint, request_id, lambda budget: local_work([document], 'snippet', budget), folder=folder, admission=admission)
        return result
    except RuntimeError as exc:
        admission.release()
        if folder:
            store.storage.remove_folder(folder)
        raise HTTPException(413, str(exc)) from exc
    except BaseException:
        admission.release()
        if folder:
            store.storage.remove_folder(folder)
        raise


@router.post('/files', status_code=202)
async def files(request: Request, request_id: RequestId):
    admission = store.reserve()
    folder = None
    try:
        folder = store.storage.folder()
        documents, fingerprint = await read_upload(request, store.storage, folder, allow_mode=True)
        fingerprint['_cross_file'] = True
        result = store.submit('files', fingerprint, request_id, lambda budget: local_work(documents, 'manual_upload', budget), folder=folder, admission=admission)
        return result
    except RuntimeError as exc:
        admission.release()
        if folder:
            store.storage.remove_folder(folder)
        raise HTTPException(413, str(exc)) from exc
    except BaseException:
        admission.release()
        if folder:
            store.storage.remove_folder(folder)
        raise


@router.post('/files-with-paths', status_code=202)
async def files_with_paths(request: Request, request_id: RequestId):
    from backend.path_upload import read_path_upload
    admission = store.reserve()
    folder = None
    try:
        folder = store.storage.folder()
        documents, fingerprint = await read_path_upload(request, store.storage, folder)
        def work(budget):
            budget.control.path_fidelity = True
            return local_work(documents, 'manual_upload', budget)
        return store.submit('files', fingerprint, request_id, work, folder=folder, admission=admission)
    except BaseException:
        admission.release()
        if folder:
            store.storage.remove_folder(folder)
        raise


@router.get('/{identity}/checkpoint')
def checkpoint(identity: str):
    return store.checkpoint(identity)


@router.post('/popular', status_code=202)
def popular(payload: PopularScanRequest, request_id: RequestId):
    from backend.main import POPULAR_SCAN_LOCK
    return store.submit('popular', payload.model_dump(exclude_unset=True), request_id, lambda budget: popular_work(payload, budget), POPULAR_SCAN_LOCK)


@router.get('/{identity}/repositories/{repository_id}')
def repository_result(identity: str, repository_id: str):
    import json
    with store.read_job(identity) as job:
        with store.lock:
            record = getattr(job.control, 'popular_snapshots', {}).get(repository_id)
            if not record:
                raise HTTPException(404, '仓库详情不存在或已过期')
            value = json.loads(record['path'].read_text(encoding='utf-8'))
    return {**value, 'task_id':identity, 'repository_id':repository_id}


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
