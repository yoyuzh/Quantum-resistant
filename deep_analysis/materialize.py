"""Opt-in private disk view, charged to the existing TemporaryStorage ledger."""
from __future__ import annotations

from contextlib import contextmanager
import os
from pathlib import Path
import stat

from deep_analysis.identity import content_digest
from deep_analysis.paths import validate_paths


class PrivateView:
    def __init__(self, snapshot, storage, checkpoint):
        if not hasattr(os, 'O_NOFOLLOW') or os.open not in os.supports_dir_fd:
            raise RuntimeError('此平台未提供安全目录句柄，禁用磁盘物化')
        validate_paths([s.identity.relative_path for s in snapshot.logical.sources])
        self.snapshot, self.storage, self.checkpoint = snapshot, storage, checkpoint
        self.folder = storage.folder()
        self.fd = None
        try:
            self.fd = os.open(self.folder, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW)
            self.inode = os.fstat(self.fd).st_ino
            self.input = self.folder / 'input'
            os.mkdir('input', mode=0o700, dir_fd=self.fd)
            os.mkdir('scratch', mode=0o700, dir_fd=self.fd)
        except BaseException:
            if self.fd is not None:
                os.close(self.fd)
            storage.remove_folder(self.folder)
            raise

    def parent(self, path, create=False):
        current = os.dup(self.fd)
        try:
            for part in path.split('/')[:-1]:
                if create:
                    try:
                        os.mkdir(part, mode=0o700, dir_fd=current)
                    except FileExistsError:
                        pass
                child = os.open(part, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW, dir_fd=current)
                os.close(current)
                current = child
            return current
        except BaseException:
            os.close(current)
            raise

    def put(self, path, data, readonly=False):
        self.checkpoint()
        # Reserve AND write bytes using the shared ledger before moving into the view.
        stage = self.storage.write(self.folder, data)
        parent = self.parent(path, create=True)
        try:
            name = path.rsplit('/', 1)[-1]
            # Exclusive hard link cannot replace a symlink or an existing destination.
            os.link(stage, name, dst_dir_fd=parent, follow_symlinks=False)
            stage.unlink()
            if readonly:
                os.chmod(name, 0o400, dir_fd=parent, follow_symlinks=False)
        finally:
            os.close(parent)
        self.checkpoint()

    def write_scratch(self, name: str, data: bytes):
        path, = validate_paths([name])
        self.put('scratch/' + path, data)

    def verify(self):
        info = self.folder.lstat()
        if not stat.S_ISDIR(info.st_mode) or info.st_ino != self.inode:
            raise ValueError('私有视图父目录被替换')
        for source in self.snapshot.logical.sources:
            self.checkpoint()
            path = 'input/' + source.identity.relative_path
            parent = self.parent(path)
            try:
                fd = os.open(path.rsplit('/', 1)[-1], os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK, dir_fd=parent)
                with os.fdopen(fd, 'rb') as stream:
                    info = os.fstat(stream.fileno())
                    if not stat.S_ISREG(info.st_mode) or info.st_size != source.identity.size_bytes:
                        raise ValueError('物化文件类型或大小改变')
                    text = stream.read(source.identity.size_bytes + 1).decode('utf-8')
                if content_digest(text) != source.identity.sha256:
                    raise ValueError('物化文件摘要改变')
            finally:
                os.close(parent)

    def close(self):
        os.close(self.fd)
        self.storage.remove_folder(self.folder)


@contextmanager
def materialized(snapshot, storage, checkpoint=lambda: None):
    """No tool is enabled here. Callers must separately constrain any external tool."""
    view = PrivateView(snapshot, storage, checkpoint)
    try:
        for source in snapshot.logical.sources:
            view.put('input/' + source.identity.relative_path, source.content.encode('utf-8'), readonly=True)
        view.verify()
        yield view
        view.verify()
    finally:
        view.close()
