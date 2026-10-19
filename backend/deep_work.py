"""Cooperative AST adapter on the existing task thread, CPU slots and deadline."""
from __future__ import annotations

import time
import platform
from fastapi import HTTPException

from backend.collection_common import CollectionTimeout
from backend.pipeline import ANALYSIS_SLOTS
from deep_analysis.crypto_rules import RULES_VERSION, ENGINE_VERSION, VERIFIER_VERSION, LIBRARY_PROFILES
from deep_analysis.models import Budgets, DeepAnalysisResult, Diagnostic, Versions
from deep_analysis.pipeline import analyze_crypto, CRYPTO_SEMANTICS_VERSION
from deep_analysis.snapshot import build_snapshot

DEEP_BUDGETS = Budgets()


class SourceUnavailable(RuntimeError):
    """A retained source could not be read or no longer matches its digest."""


def empty_result(source_type, status, code, budgets):
    snapshot = build_snapshot([], source_type)
    versions = Versions(rules=RULES_VERSION, engine=ENGINE_VERSION, semantics=CRYPTO_SEMANTICS_VERSION,
                        verifier=VERIFIER_VERSION, host_python=platform.python_version(), target_python='3.10',
                        library_profiles=LIBRARY_PROFILES)
    return DeepAnalysisResult(status=status, snapshot=snapshot.identity, coverage=snapshot.identity.coverage,
                              diagnostics=(Diagnostic(code=code, message='深度阶段未完成，基础结果保留；未处理范围不代表无风险'),),
                              budgets=budgets, versions=versions)


def run_deep(base, budget, prepare):
    """prepare reads/copies only retained source while holding a real reader lease."""
    limits = DEEP_BUDGETS
    control = budget.control
    save = getattr(control, 'checkpoint_result', lambda value: True)
    # Must persist the old contract before any deep read, CPU wait or inference.
    if save(base) is False:
        return base
    deadline = budget.child(limits.seconds)
    effective = max(0, min(limits.seconds, deadline.end - time.monotonic()))
    last = empty_result(base['source_type'], 'partial', 'deep_pending', limits)
    acquired = False
    started = None
    waiting = time.monotonic()
    cpu_wait = 0.0
    physical = 0

    def measured(result):
        metrics = result.budgets.model_copy(update={
            'queue_seconds': max(0, getattr(control, 'queue_seconds', 0)),
            'effective_seconds': effective,
            'cpu_wait_seconds': cpu_wait,
            'analysis_seconds': max(0, time.monotonic() - started) if started is not None else 0,
            'physical_read_bytes': physical, 'unique_read_bytes': sum(s.size_bytes for s in result.snapshot.sources),
        })
        return result.model_copy(update={'budgets': metrics})

    def publish(result):
        nonlocal last
        last = measured(result)
        if save({**base, 'deep_analysis': last.model_dump(mode='json')}) is False:
            raise CollectionTimeout('任务已结束，停止迟到的深度分析')
        control.emit(stage='Python深度分析', deep_status=last.status,
                     deep_operations=len(last.operations), deep_coverage=last.coverage.model_dump(mode='json'),
                     deep_budgets=last.budgets.model_dump(mode='json'))

    try:
        deadline.remaining()
        control.emit(stage='等待深度分析CPU', deep_status='running', deep_budgets=measured(last).budgets.model_dump(mode='json'))
        while not acquired:
            deadline.remaining()
            acquired = ANALYSIS_SLOTS.acquire(timeout=min(.1, deadline.remaining()))
        cpu_wait = time.monotonic() - waiting
        started = time.monotonic()
        deadline.remaining()
        snapshot = prepare(deadline, limits)
        physical = snapshot.physical_read_bytes
        last = last.model_copy(update={'snapshot': snapshot.identity, 'coverage': snapshot.identity.coverage})
        if not snapshot.logical.sources:
            notes = (*snapshot.diagnostics, Diagnostic(code='no_python_sources', message='可用来源中没有选中的Python源码'))
            bad_source = any(d.code in ('source_unavailable', 'source_digest_mismatch') for d in snapshot.diagnostics)
            state = 'failed' if bad_source else 'partial' if snapshot.identity.coverage.partial else 'skipped'
            last = last.model_copy(update={'status': state, 'diagnostics': notes})
        else:
            # No auxiliary pool or lingering futures: exit returns only after this adapter stops.
            last = analyze_crypto(snapshot, budgets=limits, checkpoint=deadline.remaining, on_result=publish)
        deadline.remaining()
    except CollectionTimeout:
        code = 'deep_cancelled' if control.cancelled.is_set() else 'deep_timeout'
        last = last.model_copy(update={'status': 'cancelled' if control.cancelled.is_set() else 'partial',
                                      'diagnostics': (*last.diagnostics, Diagnostic(code=code, message='深度阶段已停止，保留完整核验部分'))[:1000]})
    except (SourceUnavailable, HTTPException):
        last = last.model_copy(update={'status': 'failed', 'diagnostics': (*last.diagnostics,
             Diagnostic(code='deep_source_unavailable', message='保留来源已不可读取或摘要改变，未重新采集；基础结果保留'))[:1000]})
    except Exception:
        # Exception text may contain key material or host paths. Never expose it.
        last = last.model_copy(update={'status': 'failed', 'diagnostics': (*last.diagnostics,
             Diagnostic(code='deep_failed', message='深度阶段异常，基础结果与此前完整证据保留'))[:1000]})
    finally:
        if started is None:
            cpu_wait = max(0, time.monotonic() - waiting)
        if acquired:
            ANALYSIS_SLOTS.release()
    last = measured(last)
    result = {**base, 'deep_analysis': last.model_dump(mode='json')}
    save(result)
    control.emit(deep_status=last.status, deep_budgets=last.budgets.model_dump(mode='json'))
    return result


def complete_scan(base, documents, budget, mode='basic', *, relative_paths=None):
    control = budget.control
    selected = {s['source_id'] for s in base['sources']}
    docs = [doc for doc in documents if getattr(doc, 'source_id', None) in selected]
    control.source_metadata = {doc.source_id: {'relative_path': getattr(doc, 'relative_path', doc.name), 'name': doc.name,
                                              'sha256': getattr(control, 'source_hashes', {}).get(doc.source_id)}
                               for doc in docs}
    control.path_fidelity = relative_paths if relative_paths is not None else base['source_type'] in ('github_repository', 'pypi_package')
    if mode != 'deep':
        return base
    def prepare(deadline, limits):
        return build_snapshot(docs, base['source_type'], relative_paths=control.path_fidelity,
                              coverage=base.get('coverage'), budgets=limits, checkpoint=deadline.remaining)
    return run_deep(base, budget, prepare)
