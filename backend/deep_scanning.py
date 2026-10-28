"""Large-source adapter: retain immutable identities and metered disk summaries."""
from __future__ import annotations

import platform

from backend.collection_common import CollectionTimeout
from backend.pipeline import ANALYSIS_SLOTS
from original_a.deep_analysis.models import Versions
from backend.original_a import (analyze_crypto, CRYPTO_SEMANTICS_VERSION, RULES_VERSION, ENGINE_VERSION,
                                VERIFIER_VERSION, LIBRARY_PROFILES, adapt_result, summarize_sources,
                                ENGINE_IDENTITY, ADAPTER_VERSION)


def source_snapshot(base, control, deadline):
    from backend.original_a import source_snapshot as original_snapshot
    return original_snapshot(base, control, deadline)


def run_deep(base, budget):
    control = budget.control
    deadline = budget.child(120)  # Preserve A's declared time budget.
    versions = Versions(rules=RULES_VERSION, semantics=CRYPTO_SEMANTICS_VERSION, engine=ENGINE_VERSION,
                        verifier=VERIFIER_VERSION, host_python=platform.python_version(), target_python='3.10', library_profiles=LIBRARY_PROFILES)
    last = {'schema_version': 'deep-static-1', 'status': 'partial', 'operations': [], 'evidence_paths': [],
            'diagnostics': [], 'versions': versions.model_dump(mode='json'),
            'engine_identity': ENGINE_IDENTITY, 'adapter_version': ADAPTER_VERSION}
    acquired = False
    names = {s['source_id']:s['file_name'] for s in base['sources']}
    def publish(result):
        nonlocal last
        last = adapt_result(result.model_dump(mode='json'))
        operation = result.operations[-1] if result.operations else None
        control.emit(activity={'action':'核验参数传播、算法与调用用途', 'files':[names.get(operation.sink_location.source_id,'')] if operation else [], 'completed':len(result.operations), 'total':None})
    try:
        control.emit(stage='跨文件静态分析')
        while not acquired:
            acquired = ANALYSIS_SLOTS.acquire(timeout=.1)
            deadline.remaining()
        snapshot = source_snapshot(base, control, deadline)
        last = adapt_result(analyze_crypto(snapshot, checkpoint=deadline.remaining, on_result=publish).model_dump(mode='json'))
        last['engine_identity'] = ENGINE_IDENTITY
        last['adapter_version'] = ADAPTER_VERSION
        last['retrieval_index'] = summarize_sources(base, control, deadline, snapshot)
    except CollectionTimeout:
        last['status'] = 'cancelled' if control.cancelled.is_set() else 'partial'
        last['diagnostics'].append({'code': 'deep_interrupted', 'message': '跨文件阶段已停止，保留完整核验部分'})
        if 'coverage' in last:
            last['coverage']['partial'] = True
            last['coverage']['gaps'] = sorted(set(last['coverage']['gaps']) | {'deep_interrupted'})
    except Exception as exc:
        last['status'] = 'failed'
        last['diagnostics'].append({'code': 'deep_failure', 'message': '跨文件分析未完成，基础结果已保留（' + type(exc).__name__ + '）'})
        if 'coverage' in last:
            last['coverage']['partial'] = True
            last['coverage']['gaps'] = sorted(set(last['coverage']['gaps']) | {'adapter_failure'})
    finally:
        if acquired:
            ANALYSIS_SLOTS.release()
    last.update(engine_identity=ENGINE_IDENTITY, adapter_version=ADAPTER_VERSION)
    return {**base, 'deep_analysis': last}
