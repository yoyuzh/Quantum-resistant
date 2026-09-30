from __future__ import annotations

import io
import tarfile
import zipfile
from collections import Counter
from pathlib import Path
from pathlib import PurePosixPath

from backend.collection_common import CollectedSources, CollectionTimeout, Deadline
from backend.collection_config import ALLOWED_SOURCE_SUFFIXES, MAX_COLLECTED_FILES, MAX_COLLECTED_FILE_BYTES


class DeadlineReader:
    """Check compressed input reads too, including tar's implicit forward seeks."""
    def __init__(self, stream, budget):
        self.stream, self.budget = stream, budget

    def read(self, size=-1):
        self.budget.remaining()
        return self.stream.read(size)

    def seek(self, offset, whence=0):
        self.budget.remaining()
        return self.stream.seek(offset, whence)

    def tell(self):
        return self.stream.tell()


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
    reasons = Counter()
    deadline.control.emit(stage="读取归档")
    deadline.control.emit(candidate_files=len(candidates), processed_files=0)
    for entry, raw_name, size in candidates:
        try:
            deadline.remaining()
        except CollectionTimeout:
            if not documents:
                raise
            diagnostics.append({"code": "collection_interrupted", "message": "归档采集中断，已保留读完的文件。"})
            break
        if len(documents) >= limit:
            reasons['file_limit'] += len(candidates) - len(documents) - sum(reasons.values())
            break
        name = safe_archive_member_name(raw_name, root)
        if not name or size > MAX_COLLECTED_FILE_BYTES:
            reasons['path' if not name else 'file_size'] += 1
            deadline.control.emit(processed_delta=1, skipped_delta=1)
            continue
        try:
            data = read(entry)
            if len(data) > MAX_COLLECTED_FILE_BYTES:
                reasons['file_size'] += 1
                deadline.control.emit(processed_delta=1, skipped_delta=1)
                continue
            content = data.decode("utf-8-sig")
        except UnicodeError:
            reasons['encoding'] += 1
            deadline.control.emit(processed_delta=1, skipped_delta=1)
            continue
        except CollectionTimeout:
            if not documents:
                raise
            diagnostics.append({'code': 'collection_interrupted', 'message': '归档读取中断，已保留读完的文件。'})
            reasons['cancelled' if deadline.control.cancelled.is_set() else 'timeout'] += len(candidates) - len(documents) - sum(reasons.values())
            break
        except (OSError, RuntimeError, zipfile.BadZipFile):
            reasons['read_failure'] += 1
            deadline.control.emit(processed_delta=1, skipped_delta=1)
            continue
        if not deadline.control.accept(len(data)):
            diagnostics.append({"code": "text_budget", "message": "采集文本达到来源总量上限。"})
            reasons['text_budget'] += len(candidates) - len(documents) - sum(reasons.values())
            break
        try:
            documents.append(deadline.control.publish((origin, name, content)))
        except (CollectionTimeout, RuntimeError, OSError) as exc:
            diagnostics.append({'code': 'collection_interrupted', 'message': str(exc)})
            reasons['cancelled' if deadline.control.cancelled.is_set() else 'timeout' if isinstance(exc, CollectionTimeout) else 'storage'] += len(candidates) - len(documents) - sum(reasons.values())
            break
        deadline.control.emit(collected_delta=1, processed_delta=1)
    skipped = len(candidates) - len(documents)
    if skipped:
        diagnostics.append({"code": "files_skipped", "message": f"归档中有 {skipped} 个候选文件因采集上限、大小、路径或编码限制未扫描。"})
    if skipped > sum(reasons.values()):
        reasons['cancelled' if deadline.control.cancelled.is_set() else 'timeout'] += skipped - sum(reasons.values())
    deadline.control.emit(processed_files=len(candidates), skipped_files=skipped, analysis_total=len(documents), totals_final=True)
    return CollectedSources(documents, limit=limit, candidates=len(candidates), skipped=skipped, partial=bool(skipped), diagnostics=diagnostics, skip_reasons=dict(reasons))


def collect_from_zip_bytes(data: bytes, origin: str, *, max_files: int = MAX_COLLECTED_FILES, strip_root: bool = True, deadline: Deadline | None = None) -> CollectedSources:
    budget = deadline or Deadline.after()
    with zipfile.ZipFile(data if isinstance(data, Path) else io.BytesIO(data)) as archive:
        entries = [(i, i.filename, i.file_size) for i in archive.infolist() if not i.is_dir()]
        root = _root([name for _, name, _ in entries], strip_root)
        def read(info):
            with archive.open(info) as stream:
                return stream.read(MAX_COLLECTED_FILE_BYTES + 1)
        return _collect(entries, read, origin, max_files, root, budget)


def collect_from_tar_bytes(data: bytes, origin: str, *, max_files: int = MAX_COLLECTED_FILES, deadline: Deadline | None = None) -> CollectedSources:
    budget = deadline or Deadline.after()
    with data.open('rb') if isinstance(data, Path) else io.BytesIO(data) as raw:
        with tarfile.open(fileobj=DeadlineReader(raw, budget), mode="r:*") as archive:
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
