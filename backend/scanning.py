from __future__ import annotations

from typing import Any
from fastapi import HTTPException
from backend.models import MAX_SOURCE_BYTES, SourceType, ScanResponse
from backend.reporting import beijing_now_iso, build_summary
from scan_quantum_vuln import make_source_id, analyze_source

def build_scan_response(
    documents: list[tuple[str, str] | tuple[str, str, str]],
    source_type: SourceType,
) -> ScanResponse:
    scanned_at = beijing_now_iso()
    sources: list[dict[str, Any]] = []
    findings: list[dict[str, Any]] = []
    diagnostics = list(getattr(documents, "diagnostics", []))

    for index, document in enumerate(documents):
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
        sources.append(source_record)
        file_findings, file_diagnostics = analyze_source(content, filename, source_type, source_id)
        findings.extend(file_findings)
        diagnostics.extend(file_diagnostics)

    summary = build_summary(sources, findings)
    return ScanResponse(
        scanned_at=scanned_at,
        source_type=source_type,
        sources=sources,
        findings=findings,
        summary=summary,
        coverage=getattr(documents, "coverage", {"scanned_files": len(sources), "candidate_files": len(sources)}),
        diagnostics=diagnostics,
    )
