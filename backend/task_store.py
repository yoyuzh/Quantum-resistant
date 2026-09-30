"""Bounded single-process jobs. Results are immutable once terminal."""
from __future__ import annotations

import json
import logging
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from threading import RLock
from typing import Callable

from fastapi import HTTPException
from backend.collection_common import CollectionControl, CollectionTimeout, Deadline
from backend.reporting import beijing_now_iso

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
    result: dict | None = None
    size: int = 0
    control: CollectionControl = field(default_factory=CollectionControl)
    future: object = None
    reservation: object = None


class TaskStore:
    def __init__(self, workers=2, queue=4, ttl=900, max_results=8, max_bytes=128 * 1024 * 1024, now=time.monotonic):
        self.executor = ThreadPoolExecutor(max_workers=workers, thread_name_prefix='scan-job')
        self.capacity = workers + queue
        self.ttl, self.max_results, self.max_bytes, self.now = ttl, max_results, max_bytes, now
        self.lock = RLock()
        self.jobs: dict[str, Job] = {}
        self.closed = False

    def _prune(self):
        finished = sorted((j for j in self.jobs.values() if j.ended is not None), key=lambda j: j.ended)
        size = sum(j.size for j in finished)
        while finished and (len(finished) > self.max_results or size > self.max_bytes or self.now() - finished[0].ended >= self.ttl):
            old = finished.pop(0)
            size -= old.size
            del self.jobs[old.id]

    def submit(self, kind: str, payload: dict, request_id: str, work: Callable, reservation=None) -> dict:
        with self.lock:
            self._prune()
            for existing in self.jobs.values():
                if existing.request_id == request_id:
                    if existing.kind != kind or existing.payload != payload:
                        raise HTTPException(409, '请求标识已用于其他扫描')
                    return self._snapshot(existing)
            if sum(j.state not in TERMINAL for j in self.jobs.values()) >= self.capacity:
                raise HTTPException(429, '扫描队列已满，请等待已有任务完成', headers={'Retry-After': '5'})
            if reservation and not reservation.acquire(blocking=False):
                raise HTTPException(409, '热门仓库正在扫描，请等待本次扫描完成')
            job = Job(uuid.uuid4().hex, kind, payload, request_id, reservation=reservation)
            self.jobs[job.id] = job
            job.control.grace_seconds = 2
            job.control.report = lambda **values: self._progress(job, **values)
            try:
                job.future = self.executor.submit(self._run, job, work)
            except RuntimeError:
                del self.jobs[job.id]
                if reservation:
                    reservation.release()
                raise HTTPException(503, '服务正在关闭，请稍后重试')
            return self._snapshot(job)

    def _progress(self, job, stage=None, collected_delta=0, analyzed_delta=0, repos_delta=0):
        with self.lock:
            if job.state != 'running':
                return
            if stage and not job.control.cancelled.is_set():
                job.stage = stage
            job.collected += collected_delta
            job.analyzed += analyzed_delta
            job.repos += repos_delta

    def _run(self, job, work):
        with self.lock:
            job.state, job.stage, job.started = 'running', '准备扫描', self.now()
        budget = Deadline(time.monotonic() + (120 if job.kind == 'popular' else 180), job.control)
        try:
            result = work(budget)
            with self.lock:
                has_result = bool(result.get('repos') if job.kind == 'popular' else result.get('sources'))
                partial = bool(result.get('coverage', {}).get('partial') or result.get('meta', {}).get('incomplete') or job.control.cancelled.is_set())
                job.result = result if has_result else None
                job.state = ('partial' if partial else 'succeeded') if has_result else ('cancelled' if job.control.cancelled.is_set() else 'failed')
                if not has_result:
                    job.error = '没有完整分析的文件；上次结果已保留'
                job.size = len(json.dumps(job.result, ensure_ascii=False).encode('utf-8')) if job.result else 0
        except Exception as exc:
            with self.lock:
                job.state = 'cancelled' if job.control.cancelled.is_set() else 'failed'
                job.error = str(exc) if isinstance(exc, (CollectionTimeout, RuntimeError, ValueError)) else '扫描服务异常，请重试；上次结果已保留'
                logger.warning('scan_job kind=%s error=%s', job.kind, type(exc).__name__)
        finally:
            with self.lock:
                job.stage, job.ended = '已结束', self.now()
                if job.reservation:
                    job.reservation.release()
                    job.reservation = None
                self._prune()

    def _snapshot(self, job):
        end = job.ended if job.ended is not None else self.now()
        return {'id': job.id, 'kind': job.kind, 'state': job.state, 'stage': job.stage,
                'target': job.payload.get('repository_url') or job.payload.get('package_name') or f"热门仓库 {job.payload.get('top', 8)} 个",
                'created_at': job.created_at, 'elapsed': round(max(0, end - job.started), 1) if job.started is not None else 0,
                'collected_files': job.collected, 'analyzed_files': job.analyzed, 'completed_repos': job.repos,
                'cancel_requested': job.control.cancelled.is_set(), 'error': job.error, 'has_result': job.result is not None}

    def get(self, identity):
        with self.lock:
            self._prune()
            if identity not in self.jobs:
                raise HTTPException(404, '任务已过期或服务已重启，请重新扫描')
            return self._snapshot(self.jobs[identity])

    def result(self, identity):
        with self.lock:
            status = self.get(identity)
            if status['state'] not in TERMINAL:
                raise HTTPException(409, '任务尚未结束')
            if not status['has_result']:
                raise HTTPException(409, status['error'] or '没有可用结果')
            return self.jobs[identity].result

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
                    if job.reservation:
                        job.reservation.release()
                        job.reservation = None
            return self._snapshot(job)

    def close(self):
        with self.lock:
            if self.closed:
                return
            self.closed = True
            for job in list(self.jobs.values()):
                if job.state not in TERMINAL:
                    self.cancel(job.id)
        self.executor.shutdown(wait=False, cancel_futures=True)
