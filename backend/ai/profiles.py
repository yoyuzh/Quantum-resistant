"""Bounded profile registry. Secrets stay in memory or trusted OS storage."""
from __future__ import annotations

import json
import os
import secrets
from dataclasses import replace
from threading import RLock
from pathlib import Path

from fastapi import HTTPException
from pydantic import Field
from backend.ai.config import Config, ConfigStore, POLICY, Settings
from backend.reporting import beijing_now_iso


class ProfileInput(Settings):
    base_url: str = Field(min_length=1,max_length=2048)
    model: str = Field(min_length=1,max_length=120)
    name: str = Field(default='模型配置',min_length=1,max_length=80)
    remember: bool = True


class Profiles:
    def __init__(self,service):
        self.service=service
        self.lock=RLock()
        self.values={}
        self.active=None
        self.references={}
        self.health={}
        self.remember={}
        self.persisted=set()
        self.readonly=set()
        self.unavailable=set()
        self.disk_loaded=False

    @property
    def preferences(self):
        return self.service.preferences

    def current(self):
        with self.lock:
            return self.values.get(self.active,Config())

    def valid(self,config,require_consent=True):
        if not config.profile_id:
            return self.service.config.get().version==config.version
        with self.lock:
            value=self.values.get(config.profile_id)
            return bool(value and value.version==config.version and (value.consent or not require_consent))

    def bootstrap(self):
        from backend import runtime
        if runtime.desktop:
            if not self.values and self.service.config.get().base_url:
                identity='environment' if os.environ.get('QUANTUM_AI_ENABLED','').lower() in ('true','1') else 'legacy-default'
                self.values[identity]=replace(self.service.config.get(),profile_id=identity,profile_name='环境变量' if identity=='environment' else '默认配置')
                self.active=identity
                if identity=='environment':self.readonly.add(identity)
            self._sync()
            return
        path=self.preferences.root/'ai-profiles.json'
        try:
            if path.stat().st_size>512*1024:
                raise ValueError()
            record=json.loads(path.read_text(encoding='utf-8'))
            if record.get('version')!=1 or len(record['profiles'])>32:
                raise ValueError()
            for item in record['profiles']:
                identity=item['id']
                value=ProfileInput.model_validate({**item['settings'],'api_key':'','remember':True})
                credential=item.get('credential')
                if credential:
                    self.references[identity]=credential
                    try:
                        value.api_key=self.preferences.credentials.read(credential) or ''
                    except Exception:
                        pass
                value.consent=value.consent and item.get('policy')==POLICY
                self._put(identity,value)
                self.persisted.add(identity)
                self.health[identity]={'status':'untested'}
            self.active=record.get('active_profile_id')
            self.disk_loaded=True
        except FileNotFoundError:
            pass
        except Exception:
            self.values.clear();self.references.clear();self.persisted.clear()
        env=os.environ.get('QUANTUM_AI_ENABLED','').lower() in ('1','true')
        legacy=self.service.config.get()
        if env and legacy.base_url:
            self.values['environment']=replace(legacy,profile_id='environment',profile_name='环境变量')
            self.readonly.add('environment')
            if not self.disk_loaded:
                self.active='environment'
        elif not self.disk_loaded and legacy.base_url:
            self.values['legacy-default']=replace(legacy,profile_id='legacy-default',profile_name='默认配置')
            self.remember['legacy-default']=self.preferences.persisted
            self.active='legacy-default'
            if self.preferences.persisted:
                self.persist()
        if self.active not in self.values:
            self.active=None
        self._sync()

    def _sync(self):
        with self.service.config.lock:
            self.service.config.value=self.values.get(self.active,Config())

    def public(self,identity):
        value=self.values[identity]
        health=self.health.get(identity,{'status':'untested'})
        blocked=health.get('status') in ('provider_auth','provider_balance')
        return {**value.public(),'id':identity,'name':value.profile_name,'active':identity==self.active,
                'ready':value.ready and not blocked,'remember':self.remember.get(identity,False),
                'readonly':identity in self.readonly,'connection':health,
                'credential_persisted':identity in self.persisted,
                'credential_storage':'system' if identity in self.persisted else 'process',
                'credential_unavailable':bool(identity in self.unavailable or self.references.get(identity) and not value.api_key)}

    def listing(self):
        with self.lock:
            return {'active_profile_id':self.active,'profiles':[self.public(i) for i in self.values]}

    def _put(self,identity,request):
        store=ConfigStore()
        old=self.values.get(identity)
        store.value=old or Config()
        value=store.update(request)
        # Destination or sending policy changes must not inherit old consent.
        if old and (old.base_url!=value.base_url or old.protocol!=value.protocol) and request.consent is not True:
            value=replace(value,consent=False)
        self.values[identity]=replace(value,profile_id=identity,profile_name=request.name)
        if value.api_key:self.unavailable.discard(identity)
        self.remember[identity]=request.remember
        if old is None or old.version!=value.version:
            self.health[identity]={'status':'untested'}
        return self.values[identity]

    def put(self,identity,request,activate=False,persist=True):
        with self.lock:
            if identity in self.readonly:
                raise HTTPException(403,'环境变量配置为只读')
            if identity and identity not in self.values:
                raise HTTPException(404,'模型配置不存在')
            if not identity and sum(i not in self.readonly for i in self.values)>=32:
                raise HTTPException(413,'最多保存32份模型配置')
            identity=identity or secrets.token_hex(12)
            try:
                self._put(identity,request)
            except ValueError:
                raise HTTPException(422,'模型地址、类型或凭据格式无效') from None
            if not request.remember:
                self.persisted.discard(identity)
            if activate:
                self.active=identity
            self._sync()
            if persist:
                self.persist()
            return self.public(identity)

    def activate(self,identity):
        with self.lock:
            if identity is not None and identity not in self.values:
                raise HTTPException(404,'模型配置不存在')
            self.active=identity
            self._sync();self.persist()
            return self.listing()

    def remove(self,identity,credential_only=False):
        with self.lock:
            if identity not in self.values:
                raise HTTPException(404,'模型配置不存在')
            if identity in self.readonly:
                raise HTTPException(403,'环境变量配置为只读')
            if credential_only:
                self.values[identity]=replace(self.values[identity],api_key='',consent=False,version=secrets.token_hex(16))
                self.health[identity]={'status':'untested'}
            else:
                self.values.pop(identity);self.remember.pop(identity,None);self.health.pop(identity,None)
                if self.active==identity:
                    self.active=None
            self.unavailable.discard(identity)
            self._sync()
            if not self.persist():
                # Never let a failed deletion revive a retired credential at restart.
                try:
                    (self.preferences.root/'ai-profiles.json').unlink(missing_ok=True)
                    self.preferences.clear()
                except OSError:
                    raise HTTPException(500,'配置删除未能持久化，请检查用户目录权限') from None
            return self.listing()

    def persist(self):
        from backend import runtime
        if runtime.desktop:
            return True
        previous=dict(self.references);created=[];refs={};items=[]
        try:
            for identity,value in self.values.items():
                if not self.remember.get(identity) or identity in self.readonly:
                    continue
                credential=None
                if value.api_key:
                    # Reuse unchanged credentials, including active-selection-only saves.
                    credential=previous.get(identity)
                    if not credential or self.preferences.credentials.read(credential)!=value.api_key:
                        credential=secrets.token_hex(16)
                        self.preferences.credentials.write(credential,value.api_key)
                        created.append(credential)
                elif identity in self.references and identity in self.persisted:
                    # An unavailable OS key remains recoverable; explicit deletion clears this flag below.
                    credential=previous.get(identity) if value.consent else None
                if credential:
                    refs[identity]=credential
                settings={k:v for k,v in value.public().items() if k in Settings.model_fields and k!='api_key'}
                items.append({'id':identity,'settings':{**settings,'name':value.profile_name},'credential':credential,'policy':POLICY})
            root=self.preferences.root;root.mkdir(parents=True,exist_ok=True,mode=0o700)
            temporary=root/('ai-profiles-'+secrets.token_hex(8)+'.tmp')
            with os.fdopen(os.open(temporary,os.O_CREAT|os.O_EXCL|os.O_WRONLY,0o600),'w',encoding='utf-8') as stream:
                json.dump({'version':1,'active_profile_id':self.active,'profiles':items},stream,ensure_ascii=False)
                stream.flush();os.fsync(stream.fileno())
            os.replace(temporary,root/'ai-profiles.json')
            self.references=refs;self.persisted={i['id'] for i in items}
            try:self.preferences.clear()
            except Exception:pass
            for ref in set(previous.values())-set(refs.values()):
                try:self.preferences.credentials.delete(ref)
                except Exception:pass
            return True
        except Exception:
            for ref in created:
                try:self.preferences.credentials.delete(ref)
                except Exception:pass
            if 'temporary' in locals():
                temporary.unlink(missing_ok=True)
            self.persisted=set()
            return False

    def bind(self,payload):
        with self.lock:
            if payload.get('ai_profile_id') and payload['ai_profile_id']!=self.active:
                raise HTTPException(409,'启用模型已变化，请重新确认后提交')
            identity=payload.get('ai_profile_id') or self.active
            config=self.values.get(identity,self.service.config.get())
            if payload.get('ai_profile_id') and (config.profile_id!=identity or payload.get('ai_profile_version') not in (None,config.version)):
                raise HTTPException(409,'模型配置已变化，请重新确认后提交')
            return config

    def report(self,config,status):
        with self.lock:
            current=self.values.get(config.profile_id)
            if current and current.version==config.version:
                self.health[config.profile_id]={'status':status,'at':beijing_now_iso()}
