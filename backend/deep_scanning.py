"""Large-source adapter: retain immutable identities and metered disk summaries."""
from __future__ import annotations

import hashlib
import json
import platform
from dataclasses import dataclass
from types import SimpleNamespace

from backend.collection_common import CollectionTimeout
from backend.pipeline import ANALYSIS_SLOTS
from deep_analysis.identity import content_digest, snapshot_id
from deep_analysis.lazy_ast import AstCache
from deep_analysis.models import Budgets, Coverage, CoverageCount, Diagnostic, SnapshotIdentity, SourceIdentity, Versions
from deep_analysis.paths import validate_paths
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
    for record in sorted(base['sources'], key=lambda s: (s['file_name'], s['source_id'])):
        deadline.remaining()
        if not record['file_name'].endswith(('.py', '.pyw')):
            continue
        path = paths.get(record['source_id'])
        if path is None:
            notes.append('source_unavailable')
            continue
        text = path.read_text(encoding='utf-8')
        encoded = text.encode('utf-8')
        if len(sources) >= 5000 or size + len(encoded) > 100 * 1024 * 1024:
            notes.append('source_limit')
            continue
        identity = SourceIdentity(source_id=record['source_id'], relative_path=record['file_name'],
                                  sha256=hashlib.sha256(encoded).hexdigest(), size_bytes=len(encoded))
        sources.append(DiskSource(identity, path))
        size += len(encoded)
    if relative:
        validate_paths([s.identity.relative_path for s in sources])
    fidelity = 'snippet' if base['source_type'] == 'snippet' else 'relative_paths' if relative else 'flat_basename'
    roots = package_roots(tuple(s.identity.relative_path for s in sources)) if relative else ()
    gaps = set(notes)
    if not relative:
        gaps.add('snippet_local_only' if fidelity == 'snippet' else 'flat_paths_no_cross_module')
    if relative and len(roots) != 1:
        gaps.add('package_root_not_unique')
    count = len(sources)
    coverage = Coverage(collected=CoverageCount(count=len(base['sources']), total=(base.get('coverage') or {}).get('candidate_files')),
                        available=CoverageCount(count=count), selected=CoverageCount(count=count, total=count),
                        parsed=CoverageCount(count=0, total=count), analyzed=CoverageCount(count=0, total=count),
                        partial=bool(notes or (base.get('coverage') or {}).get('partial')), gaps=tuple(sorted(gaps)))
    identity = SnapshotIdentity(snapshot_id='pending', source_type=base['source_type'], path_fidelity=fidelity,
                                sources=tuple(s.identity for s in sources), package_roots=roots,
                                collection_version='collected-text-2', coverage=coverage)
    identity = identity.model_copy(update={'snapshot_id': snapshot_id(identity)})
    # The persisted summary contains identities only; no full-source serialization.
    control.storage.write_json(control.folder, {'snapshot': identity.model_dump(mode='json')})
    cache = AstCache(sources, deadline.remaining)
    from backend.source_facts import SummaryStore
    summaries = SummaryStore(control, identity.sources)
    def summarize(module):
        if module.source_id in control.source_facts:
            return
        summaries.write(module)
        control.emit(activity={'action':'建立模块索引与导入关系', 'files':[module.path], 'completed':len(control.source_facts), 'total':len(sources)})
    cache.summarize = summarize
    return SimpleNamespace(identity=identity, logical=SimpleNamespace(sources=tuple(sources)), diagnostics=(), ast_cache=cache)


def run_deep(base, budget):
    control = budget.control
    deadline = budget.child(180)
    versions = Versions(rules=RULES_VERSION, semantics=CRYPTO_SEMANTICS_VERSION, engine=ENGINE_VERSION,
                        verifier=VERIFIER_VERSION, host_python=platform.python_version(), target_python='3.10', library_profiles=LIBRARY_PROFILES)
    last = {'schema_version': 'deep-static-1', 'status': 'partial', 'operations': [], 'evidence_paths': [],
            'diagnostics': [], 'versions': versions.model_dump(mode='json')}
    acquired = False
    names = {s['source_id']:s['file_name'] for s in base['sources']}
    def publish(result):
        nonlocal last
        last = result.model_dump(mode='json')
        operation = result.operations[-1] if result.operations else None
        control.emit(activity={'action':'核验参数传播、算法与调用用途', 'files':[names.get(operation.sink_location.source_id,'')] if operation else [], 'completed':len(result.operations), 'total':None})
    try:
        control.emit(stage='跨文件静态分析')
        while not acquired:
            acquired = ANALYSIS_SLOTS.acquire(timeout=.1)
            deadline.remaining()
        snapshot = source_snapshot(base, control, deadline)
        if not snapshot.logical.sources:
            last.update(status='skipped', coverage=snapshot.identity.coverage.model_dump(mode='json'))
        else:
            last = analyze_crypto(snapshot, checkpoint=deadline.remaining, on_result=publish).model_dump(mode='json')
        last['cache'] = {'max_ast_files': 2, 'peak_ast_files': snapshot.ast_cache.peak, 'parses': snapshot.ast_cache.parses}
    except CollectionTimeout:
        last['status'] = 'cancelled' if control.cancelled.is_set() else 'partial'
        last['diagnostics'].append({'code': 'deep_interrupted', 'message': '跨文件阶段已停止，保留完整核验部分'})
    except Exception as exc:
        last['status'] = 'failed'
        last['diagnostics'].append({'code': 'deep_failure', 'message': '跨文件分析未完成，基础结果已保留（' + type(exc).__name__ + '）'})
    finally:
        if acquired:
            ANALYSIS_SLOTS.release()
    return {**base, 'deep_analysis': last}
