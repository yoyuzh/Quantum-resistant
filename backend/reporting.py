from __future__ import annotations

from collections import Counter
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from scan_quantum_vuln import build_migration_score

BEIJING_TZ = timezone(timedelta(hours=8))


def beijing_now_iso() -> str:
    return datetime.now(BEIJING_TZ).isoformat(timespec="seconds")


def build_summary(sources: list[dict[str, Any]], findings: list[dict[str, Any]]) -> dict[str, Any]:
    algorithm_counts = Counter(str(finding["algorithm"]) for finding in findings)
    return {
        "source_count": len(sources),
        "finding_count": len(findings),
        "algorithm_counts": dict(sorted(algorithm_counts.items())),
        "migration_score": build_migration_score(sources, findings),
    }


def markdown_table_cell(value: object) -> str:
    text = str(value)
    return text.replace("|", "\\|").replace("\n", "<br>")


def build_markdown_report(
    sources: list[dict[str, Any]],
    findings: list[dict[str, Any]],
    source_type: str,
    scanned_at: Optional[str] = None,
) -> str:
    generated_at = scanned_at or beijing_now_iso()
    summary = build_summary(sources, findings)

    lines = [
        "# 量子脆弱密码算法扫描报告",
        "",
        f"- 扫描时间：{generated_at}",
        f"- 输入来源：{source_type}",
        f"- 文件数量：{summary['source_count']}",
        f"- 风险发现总数：{summary['finding_count']}",
        f"- 迁移评分：{summary['migration_score']['score']}/100",
        f"- 迁移优先级：{summary['migration_score']['priority']}",
        "",
        "## 算法统计",
        "",
    ]

    if summary["algorithm_counts"]:
        lines.extend(["| 算法 | 数量 |", "| --- | ---: |"])
        for algorithm, count in summary["algorithm_counts"].items():
            lines.append(f"| {markdown_table_cell(algorithm)} | {count} |")
    else:
        lines.append("未发现已知量子脆弱公钥算法用法。")

    lines.extend(["", "## 发现明细", ""])

    if not findings:
        lines.append("未发现已知量子脆弱公钥算法用法。")
        return "\n".join(lines)

    lines.extend(
        [
            "| 文件 | 行号 | 算法 | 风险等级 | 证据 | 原因 | 迁移建议 |",
            "| --- | ---: | --- | --- | --- | --- | --- |",
        ]
    )
    for finding in findings:
        lines.append(
            "| "
            + " | ".join(
                [
                    markdown_table_cell(finding.get("file_name", "")),
                    markdown_table_cell(finding.get("line", "")),
                    markdown_table_cell(finding.get("algorithm", "")),
                    markdown_table_cell(finding.get("risk_level", "")),
                    markdown_table_cell(finding.get("evidence", "")),
                    markdown_table_cell(finding.get("reason", "")),
                    markdown_table_cell(finding.get("recommendation", "")),
                ]
            )
            + " |"
        )

    return "\n".join(lines)
