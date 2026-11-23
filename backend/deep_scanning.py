"""Large-source adapter: retain immutable identities and metered disk summaries."""
from __future__ import annotations

import hashlib
import platform
import sys
import time
from collections import Counter
from dataclasses import dataclass
from types import SimpleNamespace

from backend.collection_common import CollectionTimeout
from backend.collection_config import DEEP_TIMEOUT_SECONDS, MAX_COLLECTED_FILES, MAX_TEXT_BYTES
from backend.pipeline import ANALYSIS_SLOTS
from deep_analysis.identity import content_digest, snapshot_id
from deep_analysis.lazy_ast import AstCache
from deep_analysis.models import Budgets, Coverage, CoverageCount, SnapshotIdentity, SourceIdentity, Versions
from deep_analysis.paths import path_names, safe_path
from deep_analysis.pipeline import analyze_crypto, CRYPTO_SEMANTICS_VERSION
from deep_analysis.crypto_rules import RULES_VERSION, ENGINE_VERSION, VERIFIER_VERSION, LIBRARY_PROFILES
from deep_analysis.snapshot import package_roots


@dataclass(frozen=True)
class DiskSource:
    identity: SourceIdentity
    path: object

    @property
    def content(self):
        text = self.path.read_text(encoding='utf-8')
        if content_digest(text) != self.identity.sha256:
            raise ValueError('源码摘要改变')
        return text


def source_snapshot(base, control, deadline):
    sources, notes = [], []
    paths = getattr(control, 'source_paths', {})
    relative = getattr(control, 'path_fidelity', base['source_type'] in ('github_repository', 'pypi_package'))
    size = 0
    records = [record for record in base['sources'] if record['file_name'].lower().endswith(('.py', '.pyw'))
               or (base['source_type'] == 'snippet' and '.' not in record['file_name'])]
    candidates = []
    for record in sorted(records, key=lambda s: (s['file_name'], s['source_id'])):
        try:
            name = safe_path(record['file_name']) if relative else record['file_name']
        except ValueError:
            notes.append('source_path_invalid')
            continue
        candidates.append((record, name))
    keys = Counter(name.casefold() for _, name in candidates) if relative else Counter()
    for record, name in candidates:
        deadline.remaining()
        if relative and (keys[name.casefold()] > 1 or any(parent in keys for parent in _parents(name.casefold()))):
            notes.append('source_path_conflict')
            continue
        path = paths.get(record['source_id'])
        if path is None:
            notes.append('source_unavailable')
            continue
        try:
            encoded = path.read_text(encoding='utf-8').encode('utf-8')
        except (OSError, UnicodeError):
            notes.append('source_unavailable')
            continue
        if len(sources) >= MAX_COLLECTED_FILES or size + len(encoded) > MAX_TEXT_BYTES:
            notes.append('source_limit')
            continue
        digest = hashlib.sha256(encoded).hexdigest()
        if getattr(control, 'source_digests', {}).get(record['source_id'], digest) != digest:
            notes.append('source_digest_mismatch')
            continue
        identity = SourceIdentity(source_id=record['source_id'], relative_path=name,
                                  sha256=digest, size_bytes=len(encoded))
        sources.append(DiskSource(identity, path))
        size += len(encoded)
    fidelity = 'snippet' if base['source_type'] == 'snippet' else 'relative_paths' if relative else 'flat_basename'
    roots = package_roots(tuple(s.identity.relative_path for s in sources)) if relative else ()
    gaps = set(notes)
    if not relative:
        gaps.add('snippet_local_only' if fidelity == 'snippet' else 'flat_paths_no_cross_module')
    if relative and not roots:
        gaps.add('package_root_missing')
    count = len(sources)
    coverage = Coverage(collected=CoverageCount(count=len(base['sources']), total=(base.get('coverage') or {}).get('candidate_files')),
                        available=CoverageCount(count=count, total=len(records)), selected=CoverageCount(count=count, total=len(records)),
                        parsed=CoverageCount(count=0, total=count), analyzed=CoverageCount(count=0, total=count),
                        partial=bool(notes or (base.get('coverage') or {}).get('partial')), gaps=tuple(sorted(gaps)))
    selected = {s.identity.source_id for s in sources}
    unavailable_imports = path_names(record['file_name'] for record in records if record['source_id'] not in selected)
    identity = SnapshotIdentity(snapshot_id='pending', source_type=base['source_type'], path_fidelity=fidelity,
                                sources=tuple(s.identity for s in sources), package_roots=roots,
                                unavailable_imports=tuple(sorted(name for name in unavailable_imports if name.isidentifier() and len(name) <= 512)),
                                collection_version='collected-text-2', coverage=coverage)
    identity = identity.model_copy(update={'snapshot_id': snapshot_id(identity)})
    cache = AstCache(sources, deadline.remaining)
    from backend.source_facts import SummaryStore
    summaries = SummaryStore(control, identity.sources)
    def summarize(module):
        if module.source_id in control.source_facts:
            return
        try:
            summaries.write(module)
        except (OSError, RuntimeError):
            return  # Evidence replay can proceed without the optional AI retrieval cache.
        control.emit(activity={'action':'索引模块', 'files':[module.path], 'completed':len(control.source_facts), 'total':len(sources)})
    cache.summarize = summarize
    return SimpleNamespace(identity=identity, logical=SimpleNamespace(sources=tuple(sources)), diagnostics=(), ast_cache=cache)


def _parents(path: str):
    while '/' in path:
        path = path.rpartition('/')[0]
        yield path


def run_deep(base, budget):
    control = budget.control
    deadline = budget.child(DEEP_TIMEOUT_SECONDS)
    versions = Versions(rules=RULES_VERSION, semantics=CRYPTO_SEMANTICS_VERSION, engine=ENGINE_VERSION,
                        verifier=VERIFIER_VERSION, host_python=platform.python_version(),
                        target_python=f'3.{sys.version_info.minor}', library_profiles=LIBRARY_PROFILES)
    last = {'schema_version': 'deep-static-1', 'status': 'partial', 'work_completed': False, 'operations': [], 'evidence_paths': [],
            'diagnostics': [], 'versions': versions.model_dump(mode='json')}
    acquired = False
    names = {s['source_id']:s['file_name'] for s in base['sources']}
    def preserve(result):
        nonlocal last
        last = result.model_dump(mode='json')

    def progress(operation, checked, total):
        control.emit(activity={'action':'核验跨文件调用', 'files':[names[operation.sink_location.source_id]],
                               'completed':checked, 'total':total})
    try:
        control.emit(stage='跨文件静态分析')
        wait_started = time.monotonic()
        while not acquired:
            acquired = ANALYSIS_SLOTS.acquire(timeout=.1)
            deadline.remaining()
        cpu_wait = time.monotonic() - wait_started
        effective = deadline.remaining()
        snapshot = source_snapshot(base, control, deadline)
        budgets = Budgets(effective_seconds=effective, cpu_wait_seconds=cpu_wait)
        last = analyze_crypto(snapshot, budgets=budgets, checkpoint=deadline.remaining, on_operation=progress,
                              on_interrupted=preserve).model_dump(mode='json')
        last['cache'] = {'max_ast_files': 2, 'peak_ast_files': snapshot.ast_cache.peak, 'parses': snapshot.ast_cache.parses}
    except CollectionTimeout:
        last['status'] = 'cancelled' if control.cancelled.is_set() else 'partial'
        message = '跨文件核验已取消。' if control.cancelled.is_set() else '跨文件核验达到时间上限。'
        last['diagnostics'].append({'code': 'deep_interrupted', 'message': message})
    except Exception as exc:
        last['status'] = 'failed'
        last['diagnostics'].append({'code': 'deep_failure', 'message': '跨文件分析失败（' + type(exc).__name__ + '）'})
    finally:
        if acquired:
            ANALYSIS_SLOTS.release()
    return {**base, 'deep_analysis': last}
