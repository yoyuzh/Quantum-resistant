"""Immutable collected-text snapshots. No filesystem traversal or target import."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Iterable

from original_a.deep_analysis.identity import content_digest, snapshot_id
from original_a.deep_analysis.inputs import LogicalInput, LogicalSource
from original_a.deep_analysis.models import Budgets, Coverage, CoverageCount, Diagnostic, SnapshotIdentity, SourceIdentity, SourceType
from original_a.deep_analysis.paths import validate_paths


@dataclass(frozen=True)
class Snapshot:
    identity: SnapshotIdentity
    logical: LogicalInput
    diagnostics: tuple[Diagnostic, ...] = ()
    physical_read_bytes: int = 0


def package_roots(paths: tuple[str, ...]) -> tuple[str, ...]:
    """Only regular packages and top-level modules; namespace packages stay unknown."""
    packages = {p.rsplit("/", 1)[0] for p in paths if p.endswith("/__init__.py")}
    roots = set()
    for path in paths:
        parent = path.rsplit("/", 1)[0] if "/" in path else ""
        if not parent:
            roots.add(".")
        elif parent in packages:
            while parent in packages:
                parent = parent.rsplit("/", 1)[0] if "/" in parent else ""
            roots.add(parent or ".")
    return tuple(sorted(roots))


def build_snapshot(documents: Iterable, source_type: SourceType, *, relative_paths: bool | None = None,
                   coverage: dict | None = None, commit: str | None = None,
                   collection_version: str = "collected-text-1", budgets: Budgets | None = None,
                   checkpoint: Callable[[], object] = lambda: None) -> Snapshot:
    """Read StoredDocument or SourceRecord content only; ignore storage path/offset."""
    budgets = budgets or Budgets()
    if relative_paths is None:
        relative_paths = source_type in ('github_repository', 'pypi_package')
    coverage = coverage if coverage is not None else getattr(documents, "coverage", {})
    docs = sorted(documents, key=lambda d: (getattr(d, 'relative_path', None) or getattr(d, 'file_name', None) or d.name, d.source_id))
    diagnostics: list[Diagnostic] = []
    sources: list[LogicalSource] = []
    available = used = physical = 0
    for document in docs:
        checkpoint()
        if hasattr(document, "file_name"):
            name, identity = document.file_name, document.source_id
            readable = document.content_available is not False
        else:
            name, identity, readable = document.name, document.source_id, True
        if not name.endswith(".py"):
            continue
        if not readable:
            diagnostics.append(Diagnostic(code="source_unavailable", message="已采集源码不可读取，未重新采集"))
            continue
        available += 1
        if len(sources) >= budgets.python_files:
            diagnostics.append(Diagnostic(code="file_limit", message="Python文件选择达到上限"))
            continue
        expected_size = getattr(document, 'size_bytes', getattr(getattr(document, 'path', None), 'size', None))
        if used >= budgets.source_bytes or (expected_size is not None and used + expected_size > budgets.source_bytes):
            diagnostics.append(Diagnostic(code='source_limit', message='源码字节数达到上限'))
            continue
        try:
            content = document.content if hasattr(document, "file_name") else document[2]
            data = content.encode("utf-8")
            physical += len(data)
        except (OSError, UnicodeError):
            diagnostics.append(Diagnostic(code="source_unavailable", message="已采集源码丢失或解码失败"))
            available -= 1
            continue
        expected = getattr(document, 'expected_sha256', None)
        if expected is not None and content_digest(content) != expected:
            diagnostics.append(Diagnostic(code='source_digest_mismatch', message='保留来源摘要已改变，未分析该文件'))
            continue
        if len(data) > 2 * 1024 * 1024 or used + len(data) > budgets.source_bytes:
            diagnostics.append(Diagnostic(code="source_limit", message="源码字节数达到上限"))
            continue
        # Existing decoding (including BOM stripping) is authoritative. Do not normalize text.
        path = getattr(document, "relative_path", None) or name
        source = SourceIdentity(source_id=identity, relative_path=path, sha256=content_digest(content), size_bytes=len(data))
        sources.append(LogicalSource(identity=source, content=content))
        used += len(data)
    fidelity = "snippet" if source_type == "snippet" else "relative_paths" if relative_paths else "flat_basename"
    if fidelity == "relative_paths":
        paths = validate_paths([s.identity.relative_path for s in sources])
        sources = [s.model_copy(update={"identity": s.identity.model_copy(update={"relative_path": p})}) for s, p in zip(sources, paths)]
    sources.sort(key=lambda s: (s.identity.relative_path, s.identity.source_id))
    roots = package_roots(tuple(s.identity.relative_path for s in sources)) if fidelity == "relative_paths" else ()
    gaps = set(coverage.get("skip_reasons", {}))
    if fidelity != "relative_paths":
        gaps.add("snippet_local_only" if fidelity == "snippet" else "flat_paths_no_cross_module")
    elif len(roots) != 1:
        gaps.add("package_root_not_unique")
    gaps.update(d.code for d in diagnostics)
    count = len(sources)
    inherited = Coverage(collected=CoverageCount(count=len(docs), total=coverage.get("candidate_files")),
                         available=CoverageCount(count=available), selected=CoverageCount(count=count, total=available),
                         parsed=CoverageCount(count=0, total=count), analyzed=CoverageCount(count=0, total=count),
                         partial=bool(coverage.get("partial") or diagnostics), gaps=tuple(sorted(gaps))[:200])
    identity = SnapshotIdentity(snapshot_id="pending", source_type=source_type, path_fidelity=fidelity,
                                sources=tuple(s.identity for s in sources), package_roots=roots,
                                commit=commit, collection_version=collection_version, coverage=inherited)
    identity = identity.model_copy(update={"snapshot_id": snapshot_id(identity)})
    return Snapshot(identity, LogicalInput(sources=tuple(sources)), tuple(diagnostics[:200]), physical)
