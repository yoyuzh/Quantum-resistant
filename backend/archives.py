from __future__ import annotations

import io
import tarfile
import zipfile
from pathlib import PurePosixPath

from backend.collection_common import CollectedSources, Deadline
from backend.collection_config import ALLOWED_SOURCE_SUFFIXES, MAX_COLLECTED_FILES, MAX_COLLECTED_FILE_BYTES


def safe_archive_member_name(name: str, root: str | None = None) -> str:
    normalized = name.replace("\\", "/")
    path = PurePosixPath(normalized)
    if path.is_absolute() or ".." in path.parts or ":" in normalized or "\x00" in normalized:
        return ""
    parts = list(path.parts)
    if root and len(parts) > 1 and parts[0] == root:
        parts.pop(0)
    return "/".join(parts)


def _root(names: list[str], strip_root: bool) -> str | None:
    paths = [PurePosixPath(n) for n in names if safe_archive_member_name(n)]
    if strip_root and paths and all(len(p.parts) > 1 for p in paths):
        roots = {p.parts[0] for p in paths}
        if len(roots) == 1:
            return roots.pop()
    return None


def _collect(entries, read, origin, limit, root, deadline):
    candidates = [(entry, name, size) for entry, name, size in entries
                  if PurePosixPath(name).suffix.lower() in ALLOWED_SOURCE_SUFFIXES]
    documents, diagnostics = [], []
    for entry, raw_name, size in candidates:
        deadline.remaining()
        if len(documents) >= limit:
            break
        name = safe_archive_member_name(raw_name, root)
        if not name or size > MAX_COLLECTED_FILE_BYTES:
            continue
        try:
            data = read(entry)
            if len(data) > MAX_COLLECTED_FILE_BYTES:
                continue
            content = data.decode("utf-8-sig")
        except (UnicodeError, OSError, RuntimeError, zipfile.BadZipFile):
            continue
        documents.append((origin, name, content))
    skipped = len(candidates) - len(documents)
    if skipped:
        diagnostics.append({"code": "files_skipped", "message": f"归档中有 {skipped} 个候选文件因采集上限、大小、路径或编码限制未扫描。"})
    return CollectedSources(documents, limit=limit, candidates=len(candidates), skipped=skipped, partial=bool(skipped), diagnostics=diagnostics)


def collect_from_zip_bytes(data: bytes, origin: str, *, max_files: int = MAX_COLLECTED_FILES, strip_root: bool = True, deadline: Deadline | None = None) -> CollectedSources:
    budget = deadline or Deadline.after()
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        entries = [(i, i.filename, i.file_size) for i in archive.infolist() if not i.is_dir()]
        root = _root([name for _, name, _ in entries], strip_root)
        def read(info):
            with archive.open(info) as stream:
                return stream.read(MAX_COLLECTED_FILE_BYTES + 1)
        return _collect(entries, read, origin, max_files, root, budget)


def collect_from_tar_bytes(data: bytes, origin: str, *, max_files: int = MAX_COLLECTED_FILES, deadline: Deadline | None = None) -> CollectedSources:
    budget = deadline or Deadline.after()
    with tarfile.open(fileobj=io.BytesIO(data), mode="r:*") as archive:
        entries = []
        for member in archive:
            budget.remaining()
            if member.isfile():
                entries.append((member, member.name, member.size))
        root = _root([name for _, name, _ in entries], True)
        def read(member):
            stream = archive.extractfile(member)
            if stream is None:
                raise OSError("无法读取归档文件")
            with stream:
                return stream.read(MAX_COLLECTED_FILE_BYTES + 1)
        return _collect(entries, read, origin, max_files, root, budget)
