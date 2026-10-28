from __future__ import annotations

import json
import asyncio
import ipaddress
import time
from threading import Event

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse

from backend import task_routes, runtime
from backend.ai.config import Settings
from backend.ai.contracts import Submit
from backend.ai.provider import ProviderError, complete

router = APIRouter()


def local(request):
    host = request.client.host if request.client else ''
    try:
        allowed = ipaddress.ip_address(host).is_loopback
    except ValueError:
        allowed = host == 'testclient'
    if not allowed:
        raise HTTPException(403, '模型配置仅允许本机管理，内网访问只能读取状态')


def configure(settings):
    from backend.ai.profiles import ProfileInput
    service=task_routes.store.ai
    with service.settings_lock:
        identity=service.profiles.active
        # Legacy API remains process-only when remember was omitted.
        value=ProfileInput(**settings.model_dump(),name=service.config.get().profile_name or '默认配置')
        saved=service.profiles.put(identity,value,activate=True,persist=bool(settings.remember or 'remember' in settings.model_fields_set))
        return saved


@router.get('/api/ai/config')
def config(request: Request):
    try:
        local(request)
        manage = True
    except HTTPException:
        manage = False
    service=task_routes.store.ai
    active=service.profiles.active
    value=service.profiles.public(active) if active in service.profiles.values else service.config.get().public()
    return JSONResponse({**value, 'active_profile_id':active, 'profile_count':len(service.profiles.values), 'can_manage': manage,
                         'credential_storage': 'desktop' if runtime.desktop else value.get('credential_storage','process'),
                         'credential_persisted': value.get('credential_persisted',False)}, headers={'Cache-Control': 'no-store'})


@router.put('/api/ai/config')
def save(settings: Settings, request: Request):
    local(request)
    if runtime.desktop:
        raise HTTPException(403, '桌面配置须通过受限进程通信保存')
    return JSONResponse(configure(settings), headers={'Cache-Control': 'no-store'})


@router.delete('/api/ai/config/credential')
def clear(request: Request):
    local(request)
    if runtime.desktop:
        raise HTTPException(403, '桌面凭据须通过受限进程通信删除')
    with task_routes.store.ai.settings_lock:
        service=task_routes.store.ai
        if service.profiles.active:
            service.profiles.remove(service.profiles.active,credential_only=True)
        else:
            service.config.clear_key()
    return JSONResponse(task_routes.store.ai.config.get().public(), headers={'Cache-Control': 'no-store'})


@router.post('/api/ai/test')
async def test(request: Request, profile_id: str | None = None):
    local(request)
    service = task_routes.store.ai
    config = service.profiles.values.get(profile_id) if profile_id else service.config.get()
    if config is None:
        raise HTTPException(404,'模型配置不存在')
    if not config.base_url or service.client is None:
        raise HTTPException(503, '请先保存模型配置')
    ticket = task_routes.store.reserve()
    end = time.monotonic() + 45
    stopped = Event()
    def check():
        if stopped.is_set() or not service.profiles.valid(config,require_consent=False):
            raise ProviderError('config_changed', '连接测试已停止或模型配置已变化')
        if time.monotonic() >= end:
            raise ProviderError('provider_timeout', '连接测试超时')
    value = {'model': config.model, 'stream': False, config.output_parameter: 64,
             'messages': [{'role': 'user', 'content': 'Return only the JSON object {"ok":true}.'}]}
    if config.json_mode:
        value['response_format'] = {'type': 'json_object'}
    if config.preset == 'deepseek' and config.reasoning_disabled:
        value['thinking'] = {'type': 'disabled'}
    from backend.ai.protocols import encode
    async def exchange():
        check()
        return await complete(service.client, config, json.dumps(encode(config,value)).encode(), check)
    try:
        future = task_routes.store.scheduler.submit(exchange, loop=service.loop)
        content, usage = await asyncio.wait_for(asyncio.wrap_future(future), 45)
        if json.loads(content) != {'ok': True}:
            raise ValueError()
        service.profiles.report(config,'tested')
        return {'ok': True, 'usage': usage}
    except (ProviderError, ValueError) as exc:
        service.profiles.report(config,exc.code if isinstance(exc,ProviderError) else 'provider_format')
        raise HTTPException(502, exc.message if isinstance(exc, ProviderError) else '模型连接成功，但未按测试协议返回JSON') from None
    except asyncio.TimeoutError:
        raise HTTPException(504, '连接测试等待或请求超时') from None
    finally:
        stopped.set()
        ticket.release()


@router.post('/api/tasks/ai', status_code=202)
def submit(payload: Submit, request_id: task_routes.RequestId):
    return task_routes.store.ai.submit(payload.source_task_id, request_id,payload.model_dump(exclude={'source_task_id'},exclude_none=True))


@router.post('/api/tasks/{identity}/stop-ai')
def stop(identity: str):
    return task_routes.store.ai.stop(identity)


@router.get('/api/tasks/{identity}/analysis/export')
def export(identity: str):
    store = task_routes.store
    with store.read_job(identity) as job:
        if job.ended is None:
            raise HTTPException(409, '请等待任务结束后导出')
        value = store.checkpoint(identity)
        result = {k: value[k] for k in ('scanned_at', 'source_type', 'coverage', 'diagnostics', 'deep_analysis', 'ai_analysis') if k in value}
        return JSONResponse(result, headers={'Cache-Control': 'no-store', 'Content-Disposition': 'attachment; filename="assisted-analysis.json"'})
