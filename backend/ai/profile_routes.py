from __future__ import annotations

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, ConfigDict, Field
from backend import runtime, task_routes
from backend.ai.profiles import ProfileInput
from backend.ai.routes import local, test
from backend.ai.providers import PROVIDERS

router=APIRouter(prefix='/api/ai')


class Activation(BaseModel):
    model_config=ConfigDict(extra='forbid',strict=True)
    profile_id: str | None = Field(default=None,max_length=64)


def mutable(request):
    local(request)
    if runtime.desktop:
        raise HTTPException(403,'桌面配置须通过受限进程通信保存')


def action(kind,identity=None,settings=None):
    service=task_routes.store.ai
    with service.settings_lock:
        profiles=service.profiles
        if kind in ('create','update'):
            return profiles.put(identity if kind=='update' else None,ProfileInput.model_validate(settings))
        if kind=='activate':
            return profiles.activate(identity)
        if kind in ('delete','clear'):
            return profiles.remove(identity,credential_only=kind=='clear')
        raise HTTPException(422,'模型配置操作无效')


@router.get('/providers')
def providers():
    return {'providers':PROVIDERS}


@router.get('/profiles')
def profiles(request: Request):
    response=task_routes.store.ai.profiles.listing()
    try:
        local(request);response['can_manage']=True
    except HTTPException:
        response['can_manage']=False
    return response


@router.post('/profiles',status_code=201)
def create(value: ProfileInput,request: Request):
    mutable(request)
    return action('create',settings=value.model_dump())


@router.put('/profiles/{identity}')
def update(identity: str,value: ProfileInput,request: Request):
    mutable(request)
    return action('update',identity,value.model_dump())


@router.delete('/profiles/{identity}')
def delete(identity: str,request: Request):
    mutable(request)
    return action('delete',identity)


@router.delete('/profiles/{identity}/credential')
def clear(identity: str,request: Request):
    mutable(request)
    return action('clear',identity)


@router.put('/active')
def activate(value: Activation,request: Request):
    mutable(request)
    return action('activate',value.profile_id)


@router.post('/profiles/{identity}/test')
async def profile_test(identity: str,request: Request):
    return await test(request,profile_id=identity)
