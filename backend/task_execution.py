"""Task execution independent of HTTP routing; shared by legacy endpoints."""
from __future__ import annotations

from dataclasses import asdict
from backend.collection_common import CollectionError, CollectionTimeout, CollectedSources
from backend.pipeline import ScanPipeline
from backend.scanning import build_scan_response
from backend.popular import batch_incomplete


def remote_work(kind, value, budget, *, collector):
    source_type = 'github_repository' if kind == 'github' else 'pypi_package'
    pipeline = ScanPipeline(budget, source_type)
    try:
        try:
            docs = collector(value, deadline=budget)
        except (CollectionTimeout, RuntimeError, OSError) as exc:
            if not pipeline.documents:
                raise
            docs = CollectedSources(pipeline.documents, partial=True, diagnostics=[{'code': 'collection_interrupted', 'message': str(exc)}])
        if not docs:
            raise CollectionError('未找到可扫描的文本文件')
        return build_scan_response(docs, source_type, deadline=budget).model_dump()
    finally:
        pipeline.finish()


def local_work(documents, source_type, budget):
    pipeline = ScanPipeline(budget, source_type)
    budget.control.emit(stage='读取与分析', candidate_files=len(documents), analysis_total=len(documents), totals_final=True)
    accepted = []
    diagnostics = []
    failure_reason = 'timeout'
    try:
        for document in documents:
            try:
                accepted.append(pipeline.publish(document))
                budget.control.emit(collected_delta=1, processed_delta=1)
            except CollectionTimeout:
                failure_reason = 'cancelled' if budget.control.cancelled.is_set() else 'timeout'
                break
            except (RuntimeError, OSError) as exc:
                failure_reason = 'storage'
                diagnostics.append({'code': 'collection_interrupted', 'message': str(exc)})
                break
        docs = CollectedSources(accepted, candidates=len(documents), skipped=len(documents) - len(accepted), partial=len(accepted) < len(documents),
                                skip_reasons={failure_reason: len(documents) - len(accepted)} if len(accepted) < len(documents) else {}, diagnostics=diagnostics)
        return build_scan_response(docs, source_type, deadline=budget).model_dump()
    finally:
        pipeline.finish()


def popular_work(payload, budget, *, search, batch_scan, save, output_path):
    budget.control.emit(stage='检索热门仓库')
    repos = search(payload.top, deadline=budget.child(30))
    budget.control.emit(stage='采集与分析仓库', total_repos=len(repos))
    result = batch_scan(repos, deadline=budget)
    if not result.repos:
        raise CollectionError('没有完成的仓库；上次榜单已保留')
    incomplete = batch_incomplete(result) or budget.control.cancelled.is_set()
    result.meta['incomplete'] = incomplete
    result.meta['saved_snapshot'] = False
    if not incomplete:
        if not budget.control.begin_commit():
            result.meta['incomplete'] = True
        else:
            try:
                result.meta['saved_snapshot'] = True
                save(result, output_path)
            except OSError:
                result.meta.update(saved_snapshot=False, incomplete=True)
                result.meta['save_error'] = '无法保存榜单，已保留上次快照；本次结果仍可查看'
    return asdict(result)
