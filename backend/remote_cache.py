"""Persistent, bounded cache for remote repository and package sources."""
from __future__ import annotations

import gzip
import hashlib
import json
import os
import sys
import tempfile
import time
from pathlib import Path
from threading import RLock

from backend.collection_common import CollectedSources
from backend.collection_config import MAX_COLLECTED_FILES
from backend import runtime

CACHE_VERSION = 1
CACHE_TTL_SECONDS = 24 * 60 * 60
CACHE_MAX_BYTES = 512 * 1024 * 1024


def default_cache_root() -> Path:
    if runtime.desktop:
        return runtime.desktop.cache_root / "remote-sources"
    configured = os.environ.get("QUANTUM_REMOTE_CACHE_DIR")
    if configured:
        return Path(configured).expanduser()
    if os.name == "nt":
        base = Path(os.environ.get("LOCALAPPDATA", Path.home() / "AppData" / "Local"))
    elif sys.platform == "darwin":
        base = Path.home() / "Library" / "Caches"
    else:
        base = Path(os.environ.get("XDG_CACHE_HOME", Path.home() / ".cache"))
    return base / "quantum-resistant-scans" / "remote-sources"


class RemoteSourceCache:
    def __init__(self, root: Path | None = None, *, ttl: int = CACHE_TTL_SECONDS,
                 max_bytes: int = CACHE_MAX_BYTES, clock=time.time):
        self.root = Path(root or default_cache_root())
        self.ttl = ttl
        self.max_bytes = max_bytes
        self.clock = clock
        self.lock = RLock()

    def _path(self, kind: str, key: str) -> Path:
        digest = hashlib.sha256(f"{kind}\0{key}".encode("utf-8")).hexdigest()
        return self.root / kind / f"{digest}.json.gz"

    def load(self, kind: str, key: str, *, deadline=None) -> CollectedSources | None:
        path = self._path(kind, key)
        try:
            if deadline:
                deadline.remaining()
            if self.clock() - path.stat().st_mtime > self.ttl:
                path.unlink(missing_ok=True)
                return None
            with gzip.open(path, "rt", encoding="utf-8") as stream:
                payload = json.load(stream)
            coverage = payload["coverage"]
            documents = [tuple(item) for item in payload["documents"]]
            if payload.get("version") != CACHE_VERSION or not all(len(item) == 3 and all(isinstance(value, str) for value in item) for item in documents):
                raise ValueError("invalid cache")
            return CollectedSources(documents, limit=int(coverage.get("file_limit", MAX_COLLECTED_FILES)),
                                    candidates=coverage.get("candidate_files"),
                                    skipped=int(coverage.get("skipped_files", 0)),
                                    partial=bool(coverage.get("partial")),
                                    diagnostics=payload.get("diagnostics") or [],
                                    skip_reasons=coverage.get("skip_reasons") or {})
        except (OSError, EOFError, ValueError, KeyError, TypeError, AttributeError, json.JSONDecodeError):
            try:
                path.unlink(missing_ok=True)
            except OSError:
                pass
            return None

    def save(self, kind: str, key: str, sources: CollectedSources) -> None:
        if not sources or sources.coverage.get("partial"):
            return
        path = self._path(kind, key)
        payload = {"version": CACHE_VERSION, "documents": [list(item) for item in sources],
                   "coverage": sources.coverage, "diagnostics": sources.diagnostics}
        try:
            with self.lock:
                path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
                fd, name = tempfile.mkstemp(dir=path.parent, prefix=".remote-", suffix=".tmp")
                try:
                    with os.fdopen(fd, "wb") as stream:
                        fd = None
                        with gzip.GzipFile(fileobj=stream, mode="wb") as compressed:
                            compressed.write(json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8"))
                    os.replace(name, path)
                finally:
                    if fd is not None:
                        os.close(fd)
                    if os.path.exists(name):
                        os.unlink(name)
                self._prune()
        except (OSError, TypeError, ValueError):
            return

    def _prune(self) -> None:
        files = [path for path in self.root.rglob("*.json.gz") if path.is_file()]
        total = sum(path.stat().st_size for path in files)
        for path in sorted(files, key=lambda item: item.stat().st_mtime):
            if total <= self.max_bytes:
                break
            try:
                size = path.stat().st_size
                path.unlink()
                total -= size
            except OSError:
                continue


REMOTE_SOURCE_CACHE = RemoteSourceCache()
