from __future__ import annotations

from fastapi import APIRouter, HTTPException
from backend import task_routes
from backend.ai.models import AiAnalysisResult, Preview, PreviewRequest, SubmitRequest
from backend.ai.runner import analyze
from backend.collection_common import CollectionTimeout
from fastapi.responses import JSONResponse

from backend.ai.config import get_config

router = APIRouter(prefix="/api/ai", tags=["AI 辅助分析"])
task_router = APIRouter(tags=["AI 辅助分析"])


@router.get("/config")
def configuration() -> JSONResponse:
    return JSONResponse(get_config().public(), headers={"Cache-Control": "no-store"})


def require_config():
    config = get_config()
    if not config.enabled or not config.valid:
        raise HTTPException(503, config.reason)
    return config


@router.post("/previews")
def preview(payload: PreviewRequest):
    config = require_config()
    try:
        return task_routes.store.ai_previews.prepare(payload.source_task_id, config)
    except CollectionTimeout:
        raise HTTPException(504, "AI 本地预览准备超时，请缩小范围") from None


@task_router.post("/api/tasks/ai", status_code=202)
def submit(payload: SubmitRequest, request_id: task_routes.RequestId):
    store = task_routes.store
    fingerprint = payload.model_dump()
    # 必须先检查幂等，已接纳的任务不依赖预览 TTL 或当前配置。
    with store.lock:
        store._prune()
        for job in store.jobs.values():
            if job.request_id == request_id:
                if job.kind != "ai" or job.payload.get("request") != fingerprint:
                    raise HTTPException(409, "请求标识已用于其他输入")
                return store._snapshot(job)
        config = require_config()
        previews = store.ai_previews
        previews.prune()
        entry = previews.entries.get(payload.preview_id)
        if entry is None:
            consumed = any(job.kind == "ai" and job.payload.get("preview_id") == payload.preview_id
                           for job in store.jobs.values())
            raise HTTPException(409 if consumed else 404, "预览已消费" if consumed else "预览不存在或已过期，请重新预览")
        snapshot = Preview.model_validate_json(entry["path"].read_bytes())
        if payload.digest != snapshot.digest or config.internal_version() != entry["config"]:
            raise HTTPException(409, "预览摘要或模型配置已变化，请重新预览")
        ticket = store.reserve()
        folder = None
        try:
            folder = store.storage.folder()
            # 独立副本移交任务；失败时原预览不消费。
            store.storage.write(folder, snapshot.model_dump_json().encode("utf-8"), ".json")
            state = store.submit("ai", {"request": fingerprint, "source_task_id": snapshot.source_task_id,
                                       "preview_id": snapshot.preview_id}, request_id,
                                 lambda budget: analyze(snapshot, config, budget), folder=folder, admission=ticket)
        except (RuntimeError, OSError):
            ticket.release()
            if folder:
                store.storage.remove_folder(folder)
            raise HTTPException(429, "AI 任务临时存储容量不足，请稍后重试") from None
        except BaseException:
            ticket.release()
            if folder:
                store.storage.remove_folder(folder)
            raise
        entry["timer"].cancel()
        store.storage.remove_folder(entry["folder"])
        del previews.entries[payload.preview_id]
        return state


@router.get("/tasks/{identity}/export")
def export(identity: str):
    store = task_routes.store
    with store.read_job(identity) as job:
        if job.kind != "ai":
            raise HTTPException(409, "此导出接口只接受 AI 分析任务")
        # 严格模型构成导出白名单，禁止复用任意供应商对象。
        result = AiAnalysisResult.model_validate(store.result(identity, include_content=False))
    return JSONResponse(result.model_dump(), headers={
        "Content-Disposition": 'attachment; filename="ai-analysis.json"', "Cache-Control": "no-store"})
