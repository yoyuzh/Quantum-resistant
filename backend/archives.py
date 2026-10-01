from __future__ import annotations

import io
import gzip
import bz2
import tarfile
import zipfile
from collections import Counter
from pathlib import Path
from pathlib import PurePosixPath

from backend.collection_common import CollectedSources, CollectionTimeout, Deadline, CollectionError
from backend.collection_config import (ALLOWED_SOURCE_SUFFIXES, MAX_COLLECTED_FILES, MAX_COLLECTED_FILE_BYTES,
                                       MAX_ARCHIVE_MEMBERS, MAX_ARCHIVE_METADATA_BYTES, MAX_ARCHIVE_EXPANDED_BYTES)
from backend.archive_limits import ArchiveLimit, ExpandedReader, zip_preflight


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
        except ArchiveLimit:
            diagnostics.append({"code": "archive_budget", "message": "归档展开数据达到安全上限，已保留完成部分。"})
            reasons["archive_budget"] += len(candidates) - len(documents) - sum(reasons.values())
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


def limited_collection(result, extra_candidates=0):
    result.coverage['partial'] = True
    if extra_candidates is None:
        result.coverage['candidate_files'] = None
    else:
        result.coverage['candidate_files'] += extra_candidates
        result.coverage['skipped_files'] += extra_candidates
        reasons = result.coverage['skip_reasons']
        reasons['archive_budget'] = reasons.get('archive_budget', 0) + extra_candidates
    result.diagnostics.append({'code': 'archive_budget', 'message': '归档成员、元数据或展开数据达到安全上限，存在未扫描部分。'})
    return result


def collect_from_zip_bytes(data: bytes, origin: str, *, max_files: int = MAX_COLLECTED_FILES, strip_root: bool = True, deadline: Deadline | None = None) -> CollectedSources:
    budget = deadline or Deadline.after()
    with data.open('rb') if isinstance(data, Path) else io.BytesIO(data) as raw:
        zip_preflight(raw, budget)
        with zipfile.ZipFile(raw) as archive:
            entries, expanded, metadata = [], 0, 0
            infos = archive.infolist()
            cut = len(infos)
            for index, info in enumerate(infos):
                budget.remaining()
                expanded += info.file_size
                metadata += len(info.filename.encode('utf-8', errors='replace')) + len(info.extra) + len(info.comment) + 46
                if index >= MAX_ARCHIVE_MEMBERS or expanded > MAX_ARCHIVE_EXPANDED_BYTES or metadata > MAX_ARCHIVE_METADATA_BYTES:
                    cut = index
                    break
                if not info.is_dir():
                    entries.append((info, info.filename, info.file_size))
            root = _root([name for _, name, _ in entries], strip_root)
            def read(info):
                budget.remaining()
                with archive.open(info) as stream:
                    return stream.read(MAX_COLLECTED_FILE_BYTES + 1)
            result = _collect(entries, read, origin, max_files, root, budget)
            if cut < len(infos):
                extra = sum(not i.is_dir() and PurePosixPath(i.filename).suffix.lower() in ALLOWED_SOURCE_SUFFIXES for i in infos[cut:])
                result = limited_collection(result, extra)
            return result


def tar_stream(raw, budget):
    signature = raw.read(6)
    raw.seek(0)
    if signature.startswith(b'\x1f\x8b'):
        return gzip.GzipFile(fileobj=DeadlineReader(raw, budget))
    if signature.startswith(b'BZh'):
        return bz2.BZ2File(raw)
    if signature.startswith(b'\xfd7zXZ\x00'):
        raise CollectionError('不支持 XZ 归档压缩，请使用 gzip、bzip2 或未压缩 TAR')
    return raw


class BoundedTarInfo(tarfile.TarInfo):
    def _proc_member(self, archive):
        archive.metadata_bytes = getattr(archive, 'metadata_bytes', 0) + 512
        archive.member_count = getattr(archive, 'member_count', 0) + 1
        if self.type in {tarfile.XHDTYPE, tarfile.XGLTYPE, tarfile.GNUTYPE_LONGNAME, tarfile.GNUTYPE_LONGLINK}:
            archive.metadata_bytes += self.size
        if archive.metadata_bytes > MAX_ARCHIVE_METADATA_BYTES or archive.member_count > MAX_ARCHIVE_MEMBERS:
            raise ArchiveLimit('归档成员数量或元数据超过限制')
        return super()._proc_member(archive)


def collect_from_tar_bytes(data: bytes, origin: str, *, max_files: int = MAX_COLLECTED_FILES, deadline: Deadline | None = None) -> CollectedSources:
    budget = deadline or Deadline.after()
    entries, limited = [], False
    # Index without retaining file bodies, then stream selected files using the
    # same expanded-byte allowance. This preserves root stripping and memory bounds.
    expanded_bytes = 0
    def open_raw():
        return data.open('rb') if isinstance(data, Path) else io.BytesIO(data)
    with open_raw() as raw:
        expanded = tar_stream(raw, budget)
        reader = ExpandedReader(expanded, budget)
        try:
            with tarfile.open(fileobj=reader, mode='r|', tarinfo=BoundedTarInfo) as archive:
                try:
                    for member in archive:
                        budget.remaining()
                        if member.isfile():
                            entries.append((member, member.name, member.size))
                except ArchiveLimit:
                    limited = True
            expanded_bytes = reader.bytes
        finally:
            if expanded is not raw:
                expanded.close()
    root = _root([name for _, name, _ in entries], True)
    with open_raw() as raw:
        expanded = tar_stream(raw, budget)
        reader = ExpandedReader(expanded, budget)
        reader.bytes = expanded_bytes
        try:
            with tarfile.open(fileobj=reader, mode='r|', tarinfo=BoundedTarInfo) as archive:
                def read(member):
                    current = archive.next()
                    while current is not None and current.offset < member.offset:
                        budget.remaining()
                        current = archive.next()
                    if current is None or current.offset != member.offset:
                        raise OSError('归档文件未读取')
                    stream = archive.extractfile(current)
                    if stream is None:
                        raise OSError('无法读取归档文件')
                    with stream:
                        return stream.read(MAX_COLLECTED_FILE_BYTES + 1)
                result = _collect(entries, read, origin, max_files, root, budget)
                return limited_collection(result, None) if limited else result
        finally:
            if expanded is not raw:
                expanded.close()
