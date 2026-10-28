"""Server-owned source reuse, async phase transitions and metered model cache."""
from __future__ import annotations

import asyncio
import json
import time
from collections import OrderedDict
from threading import Event, RLock

import httpx
from fastapi import HTTPException

from backend.ai.config import BUDGETS, ConfigStore, digest
from backend.ai.context import catalog, packets, select
from backend.ai.runner import analyze
from backend.ai.provider import reusable, continuable


class AiService:
    def __init__(self, store):
        self.store = store
        self.config = ConfigStore()
        self.loop = self.client = None
        self.cache = OrderedDict()
        from backend.ai.preferences import Preferences
        self.preferences = Preferences()
        self.settings_lock = RLock()
        from backend.ai.profiles import Profiles
        self.profiles = Profiles(self)

    async def start(self):
        self.loop = asyncio.get_running_loop()
        from backend import runtime
        import os
        if not runtime.desktop and os.environ.get('QUANTUM_AI_ENABLED', '').lower() not in ('true', '1'):
            stored = await asyncio.to_thread(self.preferences.load)
            if stored:
                self.config.update(stored)
        await asyncio.to_thread(self.profiles.bootstrap)
        self.client = httpx.AsyncClient(follow_redirects=False, timeout=httpx.Timeout(45, connect=5, pool=5),
                                       limits=httpx.Limits(max_connections=2, max_keepalive_connections=2))

    async def close(self):
        if self.client:
            await self.client.aclose()
        self.client = None
        self.loop = None

    def skipped(self):
        return {'schema_version': 'ai-assisted-2', 'status': 'skipped', 'opinions': [], 'calls': 0,
                'diagnostics': [{'code': 'ai_not_configured', 'message': 'AI未运行：请先配置模型并确认代码片段发送范围'}]}

    def cached(self, key):
        with self.store.lock:
            path = self.cache.get(key)
            if path is None:
                return None
            try:
                value = json.loads(path.read_text(encoding='utf-8'))
                self.cache.move_to_end(key)
                return value
            except (OSError, ValueError):
                self.cache.pop(key, None)
                return None

    def cache_opinion(self, job, key, opinion):
        try:
            path = self.store.storage.write_json(job.folder, opinion)
        except (OSError, RuntimeError):
            return  # Optional cache never discards a valid result.
        with self.store.lock:
            self.cache[key] = path
            while len(self.cache) > 2048:
                self.cache.popitem(last=False)

    def catalogue(self, job, base, budget):
        catalogue_path = getattr(job.control, 'ai_catalog', None)
        if catalogue_path:
            from backend.original_a import ENGINE_IDENTITY, ADAPTER_VERSION
            retained = json.loads(catalogue_path.read_text(encoding='utf-8'))
            if (retained.get('engine_identity') == ENGINE_IDENTITY
                    and retained.get('adapter_version') == ADAPTER_VERSION
                    and retained.get('static_versions') == base.get('deep_analysis', {}).get('versions')):
                return retained
            job.control.ai_catalog = None
        value = catalog(base, job.control, budget.remaining)
        # Complete simple local operations need no model round trip.
        resolved = {o['operation_id'] for o in base.get('deep_analysis', {}).get('operations', [])
                    if o.get('resolution_status') == 'resolved' and o.get('algorithm',{}).get('value') not in (None,'unknown')
                    and o.get('operation_type') not in (None,'unknown')
                    and all(c['level'] == 'E3' for c in o['claims'] if c['claim_type'] in ('ALGORITHM','OPERATION_TYPE'))}
        def locally_complete(candidate):
            # Only the exact operation/context is authoritative, never a neighbouring line.
            operation_refs = set(candidate['refs']) & resolved
            return bool(operation_refs) and 'unresolved' not in candidate['lanes'] and any(
                fact.get('verified') and fact.get('purpose') not in (None,'unknown') for fact in candidate['facts'])
        value['locally_resolved'] = sum(locally_complete(c) for c in value['candidates'])
        value['candidates'] = [c for c in value['candidates'] if not locally_complete(c)]
        job.control.ai_catalog = self.store.storage.write_json(job.folder, value)
        return value

    def prepare(self, job, base, budget, catalogue=None, paths=None):
        value = catalogue if catalogue is not None else self.catalogue(job, base, budget)
        if not getattr(job.control, 'ai_catalog', None):
            job.control.ai_catalog = self.store.storage.write_json(job.folder, value)
        config = getattr(job,'ai_config',None) or self.config.get()
        previous = base.get('ai_analysis', {})
        completed = {o['candidate_id'] for o in previous.get('opinions', [])} if continuable(previous,value['snapshot']) else set()
        selected = select(value, completed)
        if paths is not None:
            copied = {}
            for identity, path in paths.items():
                budget.remaining()
                text = path.read_text(encoding='utf-8')
                if identity in value['identities'] and digest([value['sources'][identity]['file_name'], text]) != value['identities'][identity]:
                    raise ValueError('来源源码摘要已改变，请重新扫描')
                copied[identity] = self.store.storage.write_source(job.folder, text.encode('utf-8'))
            job.control.source_paths = copied
        prepared = {'descriptors': selected, 'catalogue': value, 'snapshot': value['snapshot'], 'total': len(value['candidates']),
                    'searched_files': value['searched_files'], 'searched_bytes': value['searched_bytes'],
                    'partial': value['partial'], 'diagnostics': value['diagnostics'],
                    'locally_resolved': value.get('locally_resolved', 0)}
        self.store.storage.write_json(job.folder, prepared)
        return prepared

    def materialize(self, job, prepared, selected, check):
        if job.kind == 'popular':
            from backend.popular_analysis import materialize
            return materialize(job,selected,check)
        ready = [c for c in selected if 'evidence' in c]
        fresh = [c for c in selected if 'evidence' not in c]
        return ready + packets(prepared['catalogue'], fresh, job.control.source_paths, check)

    def continue_job(self, job, base, budget):
        config = getattr(job,'ai_config',None) or self.config.get()
        if not config.ready or self.loop is None or self.loop.is_closed():
            return False
        ai_budget = budget.child(BUDGETS['seconds'])
        prepared = self.prepare(job, base, ai_budget)
        return self.schedule(job, base, prepared, config, ai_budget.end)

    def continue_popular(self,job,base):
        from backend.collection_common import Deadline
        from backend.popular_analysis import prepare
        config=getattr(job,'ai_config',None) or self.config.get()
        if not config.ready or self.loop is None:
            return False
        budget=Deadline(min(time.monotonic()+BUDGETS['seconds'],job.accepted+2100),job.control)
        job.control.emit(stage='模型上下文准备',activity={'action':'按仓库准备独立证据与共享分析队列','files':[]})
        prepared=prepare(self,job,budget)
        return self.schedule(job,base,prepared,config,budget.end)

    def schedule(self, job, base, prepared, config, end):
        if not config.ready:
            raise HTTPException(409, '模型配置或发送授权已变化，请重新确认设置')
        with self.store.lock:
            job.stop_ai = Event()
            job.state, job.stage = 'queued', '等待AI辅助分析'
            job.future = self.store.scheduler.submit(self.execute, job, base, prepared, config, end, loop=self.loop)
        return True

    async def execute(self, job, base, prepared, config, end):
        with self.store.lock:
            job.state, job.stage = 'running', 'AI辅助分析'
        try:
            result = await analyze(self, job, base, prepared, config, end)
            job.control.emit(stage='结果整理', activity={'action':'整合确认发现、待复核意见与迁移待办', 'files':[]})
            await asyncio.get_running_loop().run_in_executor(self.store.executor, self.store._finish, job, result)
        except asyncio.CancelledError:
            self.store._fail(job, RuntimeError('AI已停止，已保存结果保留'))
        except Exception:
            # Never put upstream exceptions, response bodies or credentials into diagnostics.
            self.store._fail(job, RuntimeError('AI阶段未完成，静态结果和已保存意见已保留'))
        finally:
            self.store._end(job)

    def submit(self, source_id, request_id, selection=None):
        payload = {'source_task_id': source_id, **(selection or {})}
        with self.store.lock:
            for job in self.store.jobs.values():
                if job.request_id == request_id:
                    if job.kind != 'ai' or job.payload != payload:
                        raise HTTPException(409, '请求标识已用于其他输入')
                    return self.store._snapshot(job)
        if not self.config.get().ready or self.loop is None:
            raise HTTPException(503, '请先配置模型并确认发送范围')
        with self.store.read_job(source_id) as source:
            if source.state not in {'succeeded', 'partial', 'cancelled'} or not source.result or source.kind == 'popular':
                raise HTTPException(409, '请等待扫描结束后补做AI分析')
            base = json.loads(source.result.read_text(encoding='utf-8'))
        queued_at = time.monotonic()
        ticket = self.store.reserve()
        folder = None
        try:
            folder = self.store.storage.folder()
            initial = self.store.storage.write_json(folder, base)
            if initial.stat().st_size > self.store.max_bytes:
                raise HTTPException(413, '基础结果超过共享结果容量')
            return self.store.submit('ai', payload, request_id, lambda budget: self.existing(source_id, budget, queued_at),
                                     folder=folder, admission=ticket, initial_result=initial)
        except BaseException:
            ticket.release()
            if folder:
                self.store.storage.remove_folder(folder)
            raise

    def existing(self, source_id, budget, queued_at):
        from backend.collection_common import Deadline
        budget = Deadline(min(budget.end, queued_at + BUDGETS['seconds']), budget.control)
        budget.remaining()
        with self.store.lock:
            job = next(j for j in self.store.jobs.values() if j.control is budget.control)
        if not (job.ai_config or self.config.get()).ready:
            raise HTTPException(409, '模型配置或发送授权已变化，请重新确认设置')
        with self.store.lock:
            job = next(j for j in self.store.jobs.values() if j.control is budget.control)
        with self.store.read_job(source_id) as source:
            base = json.loads(source.result.read_text(encoding='utf-8'))
            origin_id = source_id if getattr(source.control, 'source_paths', {}) else getattr(source.control, 'source_task_id', None) or source.payload.get('source_task_id', source_id)
            with self.store.read_job(origin_id) as origin:
                if not getattr(origin.control, 'source_paths', {}):
                    raise HTTPException(409, '来源源码已过期或不可用，无法补做AI分析')
                value = self.catalogue(origin, base, budget)
                job.control.source_task_id = origin_id
                self.store._save(job, base)
                prepared = self.prepare(job, base, budget, value, origin.control.source_paths)
                job.control.source_task_id = origin_id
        job.control.ai_continuation = (base, prepared, job.ai_config or self.config.get(), min(budget.end, queued_at + BUDGETS['seconds']))
        return base

    def stop(self, identity):
        with self.store.lock:
            self.store.get(identity)
            job = self.store.jobs[identity]
            if job.kind == 'ai' and job.stop_ai is None and job.ended is None:
                return self.store.cancel(identity)
            if job.stop_ai is not None and job.ended is None:
                job.stop_ai.set()
                job.progress['ai_stop_requested'] = True
                job.stage = '正在停止AI并保存结果'
            return self.store._snapshot(job)
