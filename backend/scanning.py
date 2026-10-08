from __future__ import annotations

from typing import Any
from fastapi import HTTPException
from backend.models import MAX_SOURCE_BYTES, SourceType, ScanResponse
from backend.reporting import beijing_now_iso, build_summary
from backend.analysis import build_analysis
from backend.collection_common import CollectionTimeout, Deadline
from scan_quantum_vuln import make_source_id, analyze_source
from backend.pipeline import ANALYSIS_SLOTS
from scanner.control import analysis_control


def build_scan_response(
    documents: list[tuple[str, str] | tuple[str, str, str]],
    source_type: SourceType,
    *, deadline: Deadline | None = None,
) -> ScanResponse:
    scanned_at = beijing_now_iso()
    sources: list[dict[str, Any]] = []
    findings: list[dict[str, Any]] = []
    diagnostics = list(getattr(documents, "diagnostics", []))

    pipeline = getattr(deadline.control, 'pipeline', None) if deadline else None
    if pipeline:
        for document in documents:
            try:
                pipeline.publish(document)
            except CollectionTimeout:
                break
        pipeline.finish()
        sources, findings = pipeline.records, pipeline.findings
        diagnostics.extend(pipeline.diagnostics)
    for index, document in enumerate([] if pipeline else documents):
        if deadline:
            try:
                deadline.remaining()
            except CollectionTimeout:
                diagnostics.append({"code": "analysis_interrupted", "message": "分析已中断，仅保留完整分析过的文件。"})
                break
            deadline.control.emit(stage="静态分析")
        if len(document) == 3:
            origin, filename, content = document
        else:
            filename, content = document
            origin = None
        if len(content.encode("utf-8")) > MAX_SOURCE_BYTES:
            raise HTTPException(status_code=413, detail=f"{filename} 超过 2 MiB 限制")

        source_id = make_source_id(f"{index}:{filename}", content)
        source_record = {
            "source_id": source_id,
            "file_name": filename,
            "source_type": source_type,
            "content": content,
            "line_count": len(content.splitlines()),
            "char_count": len(content),
            "origin": origin,
        }
        with ANALYSIS_SLOTS, analysis_control(deadline.remaining if deadline else lambda: None):
            file_findings, file_diagnostics = analyze_source(content, filename, source_type, source_id, include_metadata=True)
        sources.append(source_record)
        findings.extend(file_findings)
        diagnostics.extend(file_diagnostics)
        if deadline:
            deadline.control.emit(analyzed_delta=1)

    summary = build_summary(sources, findings)
    coverage = dict(getattr(documents, "coverage", {"scanned_files": len(sources), "candidate_files": len(documents)}))
    coverage['scanned_files'] = len(sources)
    if len(sources) < len(documents):
        coverage['partial'] = True
        coverage['skipped_files'] = coverage.get('skipped_files', 0) + len(documents) - len(sources)
    if pipeline:
        reasons = dict(coverage.get('skip_reasons', {}))
        for reason, count in pipeline.skip_reasons.items():
            reasons[reason] = reasons.get(reason, 0) + count
        coverage['skip_reasons'] = reasons
        if pipeline.skip_reasons:
            diagnostics.append({'code': 'analysis_interrupted', 'message': '存在未完成分析的文件，已保留完整分析过的部分。'})
    if deadline:
        deadline.control.emit(stage='汇总结果', skipped_files=coverage.get('skipped_files', 0))
    return ScanResponse(
        scanned_at=scanned_at,
        source_type=source_type,
        sources=sources,
        findings=findings,
        summary=summary,
        coverage=coverage,
        diagnostics=diagnostics,
        analysis=build_analysis(findings),
    )
