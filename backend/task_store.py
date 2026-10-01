"""Bounded single-process jobs. Results are immutable once terminal."""
from __future__ import annotations

import json
import logging
import time
import uuid
from dataclasses import dataclass, field
from threading import RLock, Timer
from typing import Callable
from pathlib import Path
from contextlib import contextmanager

from fastapi import HTTPException
from backend.collection_common import CollectionControl, CollectionTimeout, Deadline
from backend.reporting import beijing_now_iso
from backend.temp_storage import TemporaryStorage
from backend.collection_config import RESULT_CACHE_BYTES, SCAN_TIMEOUT_SECONDS, POPULAR_TIMEOUT_SECONDS
from backend.scheduler import ScanScheduler, Admission

TERMINAL = {'succeeded', 'partial', 'failed', 'cancelled'}
logger = logging.getLogger(__name__)


@dataclass
class Job:
    id: str
    kind: str
    payload: dict
    request_id: str
    state: str = 'queued'
    stage: str = '等待执行'
    created_at: str = field(default_factory=beijing_now_iso)
    started: float | None = None
    ended: float | None = None
    collected: int = 0
    analyzed: int = 0
    repos: int = 0
    error: str = ''
    result: Path | None = None
    size: int = 0
    control: CollectionControl = field(default_factory=CollectionControl)
    future: object = None
    reservation: object = None
    folder: Path | None = None
    progress: dict = field(default_factory=dict)
    repo_progress: dict = field(default_factory=dict)
    readers: int = 0
    expiry: object = None
    admission: Admission | None = None


class TaskStore:
    def __init__(self, workers=2, queue=4, ttl=900, max_results=8, max_bytes=RESULT_CACHE_BYTES, now=time.monotonic):
        self.scheduler = ScanScheduler(workers, queue)
        self.executor = self.scheduler.executor
        self.capacity = workers + queue
        self.ttl, self.max_results, self.max_bytes, self.now = ttl, max_results, max_bytes, now
        self.lock = RLock()
        self.jobs: dict[str, Job] = {}
        self.closed = False
        self.storage = TemporaryStorage()
        self.storage.on_pressure = self._reclaim
        self.scheduler.on_idle = self._close_storage_if_idle

    def _close_storage_if_idle(self):
        with self.lock:
            if self.closed and not self.scheduler.used and not any(j.readers for j in self.jobs.values()):
                self.storage.close()

    def _reclaim(self, size):
        with self.lock:
            finished = sorted((j for j in self.jobs.values() if j.ended is not None and not j.readers), key=lambda j: j.ended)
            for old in finished:
                if self.storage.bytes + size <= self.storage.max_bytes:
                    break
                del self.jobs[old.id]
                if old.expiry:
                    old.expiry.cancel()
                self.storage.remove_folder(old.folder)

    def _prune(self):
        finished = sorted((j for j in self.jobs.values() if j.ended is not None and not j.readers), key=lambda j: j.ended)
        size = sum(j.size for j in finished)
        while finished and (len(finished) > self.max_results or size > self.max_bytes or self.now() - finished[0].ended >= self.ttl):
            old = finished.pop(0)
            size -= old.size
            del self.jobs[old.id]
            if old.expiry:
                old.expiry.cancel()
            self.storage.remove_folder(old.folder)

    def _expire(self):
        with self.lock:
            self._prune()

    def _arm_expiry(self, job):
        if not self.closed:
            job.expiry = Timer(self.ttl, self._expire)
            job.expiry.daemon = True
            job.expiry.start()

    def reserve(self) -> Admission:
        return self.scheduler.reserve()

    def run_sync(self, work: Callable, admission: Admission | None = None):
        return self.scheduler.run(work, admission)

    def submit(self, kind: str, payload: dict, request_id: str, work: Callable, reservation=None, *, folder=None, admission=None) -> dict:
        ticket = admission
        try:
            return self._submit(kind, payload, request_id, work, reservation, folder, ticket)
        except BaseException:
            if ticket:
                ticket.release()
            if folder:
                self.storage.remove_folder(folder)
            raise

    def _submit(self, kind, payload, request_id, work, reservation, folder, admission):
        with self.lock:
            self._prune()
            if self.closed:
                raise HTTPException(503, '服务正在关闭，请稍后重试')
            for existing in self.jobs.values():
                if existing.request_id == request_id:
                    if existing.kind != kind or existing.payload != payload:
                        raise HTTPException(409, '请求标识已用于其他扫描')
                    if admission:
                        admission.release()
                    if folder and folder != existing.folder:
                        self.storage.remove_folder(folder)
                    return self._snapshot(existing)
            ticket = admission or self.reserve()
            acquired = False
            job = None
            try:
                if reservation:
                    acquired = reservation.acquire(blocking=False)
                    if not acquired:
                        raise HTTPException(409, '热门仓库正在扫描，请等待本次扫描完成')
                job = Job(uuid.uuid4().hex, kind, payload, request_id, reservation=reservation, admission=ticket)
                job.folder = folder or self.storage.folder()
                job.control.storage, job.control.folder = self.storage, job.folder
                self.jobs[job.id] = job
                job.control.grace_seconds = 2
                job.control.report = lambda **values: self._progress(job, **values)
                job.future = self.executor.submit(self._run, job, work)
            except BaseException as exc:
                if job:
                    self.jobs.pop(job.id, None)
                    if job.folder:
                        self.storage.remove_folder(job.folder)
                ticket.release()
                if acquired:
                    reservation.release()
                if isinstance(exc, RuntimeError):
                    raise HTTPException(503, '服务正在关闭，请稍后重试') from exc
                raise
            return self._snapshot(job)

    def _progress(self, job, stage=None, collected_delta=0, analyzed_delta=0, repos_delta=0, scope=None, **values):
        with self.lock:
            if job.state != 'running':
                return
            if stage and not scope and not job.control.cancelled.is_set():
                job.stage = stage
            target = job.repo_progress.setdefault(scope, {'name': scope}) if scope else job.progress
            if scope:
                if stage:
                    target['stage'] = stage
                for key, delta in [('collected_files', collected_delta), ('analyzed_files', analyzed_delta), ('completed_repos', repos_delta)]:
                    target[key] = target.get(key, 0) + delta
            for key, value in values.items():
                if key.endswith('_delta'):
                    field_name = {'processed_delta': 'processed_files', 'skipped_delta': 'skipped_files'}.get(key, key[:-6])
                    target[field_name] = target.get(field_name, 0) + value
                else:
                    target[key] = value
            job.collected += collected_delta
            job.analyzed += analyzed_delta
            job.repos += repos_delta

    def _run(self, job, work):
        with self.lock:
            job.state, job.stage, job.started = 'running', '准备扫描', self.now()
        budget = Deadline(time.monotonic() + (POPULAR_TIMEOUT_SECONDS if job.kind == 'popular' else SCAN_TIMEOUT_SECONDS), job.control)
        try:
            result = work(budget)
            result = {**result, **({'sources': [dict(source) for source in result['sources']]} if 'sources' in result else {})}
            job.control.emit(stage='汇总结果')
            paths = getattr(job.control, 'source_paths', {})
            job.control.source_paths = paths
            for source in result.get('sources', []):
                if source.get('source_id') and source.get('content') is not None:
                    if source['source_id'] not in paths:
                        paths[source['source_id']] = self.storage.write_source(job.folder, source['content'].encode('utf-8'))
                    source['content'], source['content_available'] = '', True
            try:
                result_path = self.storage.write_json(job.folder, result)
            except RuntimeError:
                # Analysis is already complete. Preserve it before optional raw code.
                self.storage.discard_sources(job.folder)
                job.control.source_paths = {}
                note = {'code': 'source_storage_evicted', 'message': '临时存储容量不足，完整分析结果已保留；本次源码未保留，查看源码需重新扫描。'}
                for source in result.get('sources', []):
                    source['content_available'] = False
                result.setdefault('diagnostics', []).append(note)
                for repo in result.get('repos', []):
                    repo.setdefault('diagnostics', []).append(note)
                result_path = self.storage.write_json(job.folder, result)
            size = result_path.stat().st_size
            if size > self.max_bytes:
                self.storage.remove(result_path)
                raise RuntimeError('任务结果超过缓存容量，未保存；请缩小扫描范围后重试')
            with self.lock:
                has_result = bool(result.get('repos') if job.kind == 'popular' else result.get('sources'))
                partial = bool(result.get('coverage', {}).get('partial') or result.get('meta', {}).get('incomplete') or job.control.cancelled.is_set())
                job.result = result_path if has_result else None
                job.state = ('partial' if partial else 'succeeded') if has_result else ('cancelled' if job.control.cancelled.is_set() else 'failed')
                if not has_result:
                    job.error = '没有完整分析的文件；上次结果已保留'
                job.size = size
        except Exception as exc:
            with self.lock:
                job.state = 'cancelled' if job.control.cancelled.is_set() else 'failed'
                job.error = str(exc) if isinstance(exc, (CollectionTimeout, RuntimeError, ValueError)) else '扫描服务异常，请重试；上次结果已保留'
                logger.warning('scan_job kind=%s error=%s', job.kind, type(exc).__name__)
        finally:
            with self.lock:
                job.stage, job.ended = '已结束', self.now()
                self._arm_expiry(job)
                if not job.result:
                    self.storage.remove_folder(job.folder)
                if job.reservation:
                    job.reservation.release()
                    job.reservation = None
                self._prune()
                job.admission.release()

    def _snapshot(self, job):
        end = job.ended if job.ended is not None else self.now()
        return {'id': job.id, 'kind': job.kind, 'state': job.state, 'stage': job.stage,
                'target': job.payload.get('repository_url') or job.payload.get('package_name') or job.payload.get('filename') or (f"本地文件 {job.payload.get('file_count')} 个" if job.kind == 'files' else f"热门仓库 {job.payload.get('top', 8)} 个"),
                'created_at': job.created_at, 'elapsed': round(max(0, end - job.started), 1) if job.started is not None else 0,
                'collected_files': job.collected, 'analyzed_files': job.analyzed, 'completed_repos': job.repos,
                'cancel_requested': job.control.cancelled.is_set(), 'error': job.error, 'has_result': job.result is not None,
                **job.progress, 'repositories': [dict(value) for value in job.repo_progress.values()]}

    def get(self, identity):
        with self.lock:
            self._prune()
            if identity not in self.jobs:
                raise HTTPException(404, '任务已过期或服务已重启，请重新扫描')
            return self._snapshot(self.jobs[identity])

    def result(self, identity, include_content=True):
        with self.read_job(identity) as job:
            if job.state not in TERMINAL:
                raise HTTPException(409, '任务尚未结束')
            if not job.result:
                raise HTTPException(409, job.error or '没有可用结果')
            result = json.loads(job.result.read_text(encoding='utf-8'))
            if include_content:
                for source in result.get('sources', []):
                    path = getattr(job.control, 'source_paths', {}).get(source.get('source_id'))
                    if path:
                        source['content'] = path.read_text(encoding='utf-8')
                    source['content_available'] = None
            return result

    def source(self, identity, source_id):
        with self.read_job(identity) as job:
            path = getattr(job.control, 'source_paths', {}).get(source_id)
            if not path:
                raise HTTPException(404, '此文件源码不可用或任务已过期')
            try:
                return {'source_id': source_id, 'content': path.read_text(encoding='utf-8')}
            except OSError as exc:
                raise HTTPException(404, '源码读取失败，请重新扫描') from exc

    @contextmanager
    def read_job(self, identity):
        with self.lock:
            self.get(identity)
            job = self.jobs[identity]
            job.readers += 1
        try:
            yield job
        finally:
            with self.lock:
                job.readers -= 1
                self._prune()
                self._close_storage_if_idle()

    def cancel(self, identity):
        with self.lock:
            status = self.get(identity)
            job = self.jobs[identity]
            if status['state'] not in TERMINAL:
                if not job.control.request_cancel():
                    job.stage = '分析已完成，正在保存结果'
                    return self._snapshot(job)
                job.stage = '正在取消并整理结果'
                if job.future.cancel():
                    job.state, job.ended = 'cancelled', self.now()
                    job.stage = '已取消'
                    self.storage.remove_folder(job.folder)
                    self._arm_expiry(job)
                    if job.reservation:
                        job.reservation.release()
                        job.reservation = None
                    job.admission.release()
            return self._snapshot(job)

    def close(self):
        with self.lock:
            if self.closed:
                return
            self.closed = True
            for job in list(self.jobs.values()):
                if job.expiry:
                    job.expiry.cancel()
                if job.state not in TERMINAL:
                    self.cancel(job.id)
        self.scheduler.close()
