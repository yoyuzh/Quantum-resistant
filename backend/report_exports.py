from __future__ import annotations

import csv
import io
from typing import Any

from backend.analysis import METHOD_LABELS, build_analysis
from backend.reporting import beijing_now_iso, build_summary


def build_json_report(sources: list[dict[str, Any]], findings: list[dict[str, Any]],
                      source_type: str, scanned_at: str | None = None,
                      coverage: dict | None = None, diagnostics: list[dict] | None = None) -> dict[str, Any]:
    return {
        "version": 1, "scanned_at": scanned_at or beijing_now_iso(), "source_type": source_type,
        "scope_note": "本次静态扫描的密码资产清单，不是完整供应链或标准化 CBOM。未包含完整源码。",
        "sources": [{key: value for key, value in source.items() if key != "content"} for source in sources],
        "findings": findings, "summary": build_summary(sources, findings),
        "coverage": coverage, "diagnostics": diagnostics or [], "analysis": build_analysis(findings),
    }


def csv_cell(value: object) -> str:
    text = "" if value is None else str(value)
    # Spreadsheet applications may evaluate values even after leading whitespace.
    if text.lstrip().startswith(("=", "+", "-", "@")) or text.startswith(("\t", "\r", "\n")):
        return "'" + text
    return text


def build_csv_report(findings: list[dict[str, Any]]) -> str:
    output = io.StringIO(newline="")
    writer = csv.writer(output)
    columns = [
        ("source_id", "文件身份"), ("file_name", "文件"), ("line", "行号"),
        ("algorithm", "算法"), ("risk_level", "风险等级"), ("detection_method", "识别方式"),
        ("library", "密码库"), ("resolved_api", "完整 API"), ("evidence", "证据"),
        ("reason", "原因"), ("recommendation", "迁移建议"),
    ]
    writer.writerow([label for _, label in columns])
    for item in findings:
        values = {**item, "detection_method": METHOD_LABELS.get(item.get("detection_method"), "未记录")}
        writer.writerow([csv_cell(values.get(key)) for key, _ in columns])
    return "\ufeff" + output.getvalue()
