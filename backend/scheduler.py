"""One admission budget and executor for synchronous and background scans."""
from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor, CancelledError, Future
from collections import deque
import asyncio
from threading import RLock
from fastapi import HTTPException


class Admission:
    def __init__(self, scheduler):
        self.scheduler = scheduler
        self.released = False

    def release(self) -> None:
        with self.scheduler.lock:
            if self.released:
                return
            self.released = True
            self.scheduler.used -= 1
            idle = self.scheduler.closed and not self.scheduler.used
        if idle and self.scheduler.on_idle:
            self.scheduler.on_idle()


class ScanScheduler:
    def __init__(self, workers: int, queue: int):
        self.executor = ThreadPoolExecutor(max_workers=workers, thread_name_prefix='scan-job')
        self.capacity = workers + queue
        self.lock = RLock()
        self.used = 0
        self.closed = False
        self.on_idle = None
        self.workers = workers
        self.active = 0
        self.ai_active = 0
        self.pending = deque()

    def submit(self, work, *args, loop=None):
        future = Future()
        with self.lock:
            if self.closed:
                raise RuntimeError('scheduler closed')
            self.pending.append((future, work, args, loop))
            self._dispatch()
        return future

    def _dispatch(self):
        while self.active < self.workers:
            entry = next((e for e in self.pending if not e[3] or not self.ai_active), None)
            if entry is None:
                break
            self.pending.remove(entry)
            future, work, args, loop = entry
            if not future.set_running_or_notify_cancel():
                continue
            self.active += 1
            self.ai_active += bool(loop)
            try:
                actual = asyncio.run_coroutine_threadsafe(work(*args), loop) if loop else self.executor.submit(work, *args)
            except BaseException:
                self.active -= 1
                self.ai_active -= bool(loop)
                raise
            def complete(done, target=future, ai=bool(loop)):
                with self.lock:
                    self.active -= 1
                    self.ai_active -= ai
                    try:
                        target.set_result(done.result())
                    except BaseException as exc:
                        target.set_exception(exc)
                    self._dispatch()
            actual.add_done_callback(complete)

    def reserve(self) -> Admission:
        with self.lock:
            if self.closed:
                raise HTTPException(503, '服务正在关闭，请稍后重试')
            if self.used >= self.capacity:
                raise HTTPException(429, '扫描队列已满，请等待已有任务完成', headers={'Retry-After': '5'})
            self.used += 1
            return Admission(self)

    def run(self, work, admission: Admission | None = None):
        ticket = admission or self.reserve()
        try:
            future = self.submit(work)
        except RuntimeError as exc:
            ticket.release()
            raise HTTPException(503, '服务正在关闭，请稍后重试') from exc
        if admission is None:
            future.add_done_callback(lambda _: ticket.release())
        try:
            return future.result()
        except CancelledError as exc:
            raise HTTPException(503, '服务正在关闭，请稍后重试') from exc

    def close(self) -> None:
        with self.lock:
            self.closed = True
            for future, *_ in self.pending:
                future.cancel()
            self.pending.clear()
            idle = not self.used
        self.executor.shutdown(wait=False, cancel_futures=True)
        if idle and self.on_idle:
            self.on_idle()
