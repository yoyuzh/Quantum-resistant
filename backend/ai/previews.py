from __future__ import annotations

import json
import time
import uuid
from datetime import datetime, timedelta, timezone
from threading import Timer

from fastapi import HTTPException

from backend.ai.config import AiConfig
from backend.ai.context import SourceBudgetExceeded, build_context
from backend.ai.models import Preview, stable_digest
from backend.collection_common import CollectionTimeout, Deadline
from backend.task_store import TERMINAL
from scanner.control import analysis_control


class PreviewStore:
    """与 TaskStore 共用锁、调度及存储；只持有有界脱敏快照。"""
    def __init__(self, store, *, ttl=300, max_previews=4, max_bytes=2 * 1024 * 1024, now=time.monotonic):
        self.store, self.ttl = store, ttl
        self.max_previews, self.max_bytes, self.now = max_previews, max_bytes, now
        self.entries = {}
        self.building = 0

    def prune(self):
        with self.store.lock:
            for identity, entry in list(self.entries.items()):
                if self.now() >= entry["end"]:
                    self.store.storage.remove_folder(entry["folder"])
                    entry["timer"].cancel()
                    del self.entries[identity]

    def close(self):
        with self.store.lock:
            for entry in self.entries.values():
                entry["timer"].cancel()
                self.store.storage.remove_folder(entry["folder"])
            self.entries.clear()

    def prepare(self, source_task_id: str, config: AiConfig) -> Preview:
        with self.store.lock:
            self.prune()
            if self.store.closed:
                raise HTTPException(503, "服务正在关闭，请稍后重试")
            if self.building + len(self.entries) >= self.max_previews:
                raise HTTPException(429, "AI 预览容量已满，请等待预览到期后重试")
            self.building += 1
        try:
            return self.store.run_sync(lambda: self._prepare(source_task_id, config))
        finally:
            with self.store.lock:
                self.building -= 1

    def _prepare(self, source_task_id: str, config: AiConfig) -> Preview:
        deadline = Deadline.after(config.budgets["prepare_seconds"])
        with self.store.read_job(source_task_id) as job:
            if job.kind not in {"snippet", "files", "github", "pypi"}:
                raise HTTPException(409, "此任务不支持 AI 分析，请进行普通扫描")
            if job.state not in TERMINAL:
                raise HTTPException(409, "来源任务尚未结束，请等待扫描完成")
            if not job.result:
                raise HTTPException(409, "来源没有可用结果，请重新扫描")
            result = json.loads(job.result.read_text(encoding="utf-8"))
            paths = getattr(job.control, "source_paths", {})
            if not paths:
                raise HTTPException(409, "来源源码不可用，请重新扫描")

            def read_source(identity):
                deadline.remaining()
                path = paths.get(identity)
                if path is None:
                    raise ValueError("源码不可用")
                size = path.size if hasattr(path, "size") else path.stat().st_size
                if size > config.budgets["search_bytes"] - read_source.used:
                    raise SourceBudgetExceeded()
                text = path.read_text(encoding="utf-8")
                read_source.used += size
                return text

            read_source.used = 0
            try:
                with analysis_control(deadline.remaining):
                    candidates, coverage = build_context(result, read_source, config.budgets, deadline.remaining)
            except CollectionTimeout:
                raise HTTPException(504, "AI 本地预览准备超时，请缩小范围") from None
        deadline.remaining()
        data = {"source_task_id": source_task_id, "config_version": config.public()["config_version"],
                "target_origin": config.target_origin, "model": config.model, "budgets": dict(config.budgets),
                "candidates": [item.model_dump() for item in candidates], "candidate_coverage": coverage.model_dump()}
        preview = Preview(**data, preview_id=uuid.uuid4().hex, digest=stable_digest(data),
                          expires_at=(datetime.now(timezone(timedelta(hours=8))) + timedelta(seconds=self.ttl)).isoformat())
        encoded = preview.model_dump_json().encode("utf-8")
        with self.store.lock:
            self.prune()
            if self.store.closed:
                raise HTTPException(503, "服务正在关闭，请稍后重试")
            if len(encoded) + sum(entry["size"] for entry in self.entries.values()) > self.max_bytes:
                raise HTTPException(429, "AI 预览序列化容量不足，请缩小范围")
            folder = self.store.storage.folder()
            try:
                path = self.store.storage.write(folder, encoded, ".json")
            except (RuntimeError, OSError):
                self.store.storage.remove_folder(folder)
                raise HTTPException(429, "AI 预览临时存储容量不足，请稍后重试") from None
            timer = Timer(self.ttl, self.prune)
            timer.daemon = True
            self.entries[preview.preview_id] = {"folder": folder, "path": path, "size": len(encoded),
                "end": self.now() + self.ttl, "config": config.internal_version(), "timer": timer}
            timer.start()
        return preview

