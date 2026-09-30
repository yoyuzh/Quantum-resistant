"""Process-owned temporary files with byte accounting; never use source paths."""
from __future__ import annotations

import json
import shutil
import tempfile
import uuid
import os
import time
import weakref
from pathlib import Path
from threading import RLock

from backend.collection_config import TEMP_STORAGE_BYTES


class TemporaryStorage:
    def __init__(self, max_bytes: int = TEMP_STORAGE_BYTES):
        parent = Path(tempfile.gettempdir()) / 'quantum-resistant-scans'
        parent.mkdir(exist_ok=True)
        self.cleanup_abandoned(parent)
        self.directory = tempfile.TemporaryDirectory(prefix="session-", dir=parent)
        self.root = Path(self.directory.name)
        self.lease = (self.root / '.lease').open('w+b')
        self.lease.write(b'1')
        self.lease.flush()
        self.lock_lease(self.lease)
        self.max_bytes = max_bytes
        self.sizes: dict[Path, int] = {}
        self.lock = RLock()
        self.bytes = 0
        self.on_pressure = None
        self.source_streams = {}
        self.finalizer = weakref.finalize(self, self.finish_directory, self.lease, self.directory, self.source_streams)

    @staticmethod
    def finish_directory(lease, directory, streams):
        for _, stream in streams.values():
            stream.close()
        streams.clear()
        lease.close()
        directory.cleanup()

    def write_source(self, folder, data):
        self.reclaim(len(data))
        with self.lock:
            if self.bytes + len(data) > self.max_bytes:
                raise RuntimeError('临时存储容量不足，已保留可用部分')
            if folder not in self.source_streams:
                path = folder / 'sources.bin'
                stream = path.open('w+b')
                self.source_streams[folder] = (path, stream)
                self.sizes[path] = 0
            path, stream = self.source_streams[folder]
            offset = stream.tell()
            stream.write(data)
            stream.flush()
            self.bytes += len(data)
            self.sizes[path] += len(data)
            return StoredContent(path, offset, len(data))

    @staticmethod
    def lock_lease(stream, unlock=False):
        stream.seek(0)
        if os.name == 'nt':
            import msvcrt
            msvcrt.locking(stream.fileno(), msvcrt.LK_UNLCK if unlock else msvcrt.LK_NBLCK, 1)
        else:
            import fcntl
            fcntl.flock(stream.fileno(), fcntl.LOCK_UN if unlock else fcntl.LOCK_EX | fcntl.LOCK_NB)

    @classmethod
    def cleanup_abandoned(cls, parent):
        for folder in parent.glob('session-*'):
            if not folder.is_dir() or folder.is_symlink() or folder.resolve().parent != parent.resolve():
                continue
            lease = folder / '.lease'
            if not lease.exists():
                if time.time() - folder.stat().st_mtime > 60:
                    shutil.rmtree(folder, ignore_errors=True)
                continue
            try:
                with lease.open('r+b') as stream:
                    cls.lock_lease(stream)
                    cls.lock_lease(stream, unlock=True)
                shutil.rmtree(folder, ignore_errors=True)
            except OSError:
                # A live process owns the lease; never clean its tasks.
                continue

    def reclaim(self, size):
        if self.bytes + size > self.max_bytes and self.on_pressure:
            self.on_pressure(size)

    def folder(self) -> Path:
        path = self.root / uuid.uuid4().hex
        path.mkdir()
        return path

    def write(self, folder: Path, data: bytes, suffix: str = ".txt") -> Path:
        self.reclaim(len(data))
        with self.lock:
            if self.bytes + len(data) > self.max_bytes:
                raise RuntimeError("临时存储容量不足，已保留可用部分；请等待其他任务结束后重试")
            path = folder / (uuid.uuid4().hex + suffix)
            try:
                path.write_bytes(data)
            except OSError:
                path.unlink(missing_ok=True)
                raise
            self.sizes[path] = len(data)
            self.bytes += len(data)
            return path

    def write_json(self, folder: Path, data: dict) -> Path:
        # Stream serialization so a second large JSON string is not held in memory.
        path = folder / (uuid.uuid4().hex + ".json")
        try:
            with path.open("wb") as stream:
                buffer = bytearray()
                for chunk in json.JSONEncoder(ensure_ascii=False).iterencode(data):
                    buffer.extend(chunk.encode('utf-8'))
                    if len(buffer) < 65536:
                        continue
                    self.reclaim(len(buffer))
                    with self.lock:
                        if self.bytes + len(buffer) > self.max_bytes:
                            raise RuntimeError("临时存储容量不足，无法保存任务结果；上次结果已保留")
                        stream.write(buffer)
                        self.sizes[path] = self.sizes.get(path, 0) + len(buffer)
                        self.bytes += len(buffer)
                    buffer.clear()
                self.reclaim(len(buffer))
                with self.lock:
                    if self.bytes + len(buffer) > self.max_bytes:
                        raise RuntimeError('临时存储容量不足，无法保存任务结果')
                    stream.write(buffer)
                    self.sizes[path] = self.sizes.get(path, 0) + len(buffer)
                    self.bytes += len(buffer)
            return path
        except Exception:
            self.remove(path)
            raise

    def append(self, path: Path, data: bytes) -> None:
        self.reclaim(len(data))
        with self.lock:
            if self.bytes + len(data) > self.max_bytes:
                raise RuntimeError('临时存储容量不足，已保留可用部分')
            with path.open('ab') as stream:
                stream.write(data)
            self.sizes[path] += len(data)
            self.bytes += len(data)

    def remove(self, path: Path) -> None:
        with self.lock:
            path.unlink(missing_ok=True)
            self.bytes -= self.sizes.pop(path, 0)

    def discard_sources(self, folder):
        with self.lock:
            streams = self.source_streams.pop(folder, None)
            if streams:
                path, stream = streams
                stream.close()
                self.remove(path)

    def remove_folder(self, folder: Path) -> None:
        with self.lock:
            if folder.parent != self.root:
                raise ValueError("invalid temporary directory")
            streams = self.source_streams.pop(folder, None)
            if streams:
                streams[1].close()
            for path in list(self.sizes):
                if path.parent == folder:
                    self.bytes -= self.sizes.pop(path)
            shutil.rmtree(folder, ignore_errors=True)

    def close(self) -> None:
        for _, stream in self.source_streams.values():
            stream.close()
        self.source_streams.clear()
        self.finalizer()


class StoredContent:
    def __init__(self, path, offset, size):
        self.path, self.offset, self.size = path, offset, size

    def read_text(self, encoding='utf-8'):
        with self.path.open('rb') as stream:
            stream.seek(self.offset)
            return stream.read(self.size).decode(encoding)


class StoredDocument:
    def __init__(self, origin: str | None, name: str, path: Path, source_id: str):
        self.origin, self.name, self.path, self.source_id = origin, name, path, source_id

    def __iter__(self):
        return iter((self.origin, self.name, self.path.read_text(encoding="utf-8")))

    def __getitem__(self, index):
        if index == 0:
            return self.origin
        if index == 1:
            return self.name
        return self.path.read_text(encoding='utf-8')

    def __len__(self):
        return 3
