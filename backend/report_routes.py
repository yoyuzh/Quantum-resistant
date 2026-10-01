"""HTTP adapters for shared report builders."""
from __future__ import annotations

import json
from fastapi import APIRouter, Response
from backend.models import ReportRequest
from backend.reporting import build_markdown_report
from backend.report_exports import build_csv_report, build_json_report
from backend.html_report import build_html_report

router = APIRouter()


@router.post("/api/report/markdown")
def export_markdown_report(payload: ReportRequest) -> Response:
    report = build_markdown_report(**payload.model_dump())
    return Response(report, media_type="text/markdown", headers={"Content-Disposition": 'attachment; filename="quantum-scan-report.md"'})


@router.post("/api/report/json")
def export_json_report(payload: ReportRequest) -> Response:
    report = build_json_report(**payload.model_dump())
    return Response(json.dumps(report, ensure_ascii=False, indent=2), media_type="application/json",
                    headers={"Content-Disposition": 'attachment; filename="quantum-scan-report.json"'})


@router.post("/api/report/csv")
def export_csv_report(payload: ReportRequest) -> Response:
    report = build_csv_report([finding.model_dump() for finding in payload.findings])
    return Response(report, media_type="text/csv",
                    headers={"Content-Disposition": 'attachment; filename="quantum-scan-findings.csv"'})


@router.post('/api/report/html')
def export_html_report(payload: ReportRequest) -> Response:
    return Response(build_html_report(**payload.model_dump()), media_type='text/html',
                    headers={'Content-Disposition': 'attachment; filename="quantum-scan-report.html"'})
