from __future__ import annotations

from collections import Counter
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from scan_quantum_vuln import build_migration_score
from backend.analysis import METHOD_LABELS, build_analysis

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
    coverage: dict | None = None,
    diagnostics: list[dict] | None = None,
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
    ]

    coverage_lines = ["## 扫描范围与诊断", "", "迁移评分是启发式优先级，不代表风险概率。"]
    if coverage:
        coverage_lines.append(f"实际扫描 {coverage['scanned_files']} 个文件；候选数量：{coverage.get('candidate_files') if coverage.get('candidate_files') is not None else '未知'}；跳过 {coverage.get('skipped_files', 0)} 个文件。")
        coverage_lines.append("存在未扫描部分，零发现不代表整个项目没有相关用法。" if coverage.get("partial") else "结果仅对应本次输入的受支持规则范围。")
    else:
        coverage_lines.append("扫描范围未知。")
    coverage_lines.extend(f"- {markdown_table_cell(d['message'])}" for d in diagnostics or [])
    lines.extend([*coverage_lines, "", "## 算法统计", ""])

    if summary["algorithm_counts"]:
        lines.extend(["| 算法 | 数量 |", "| --- | ---: |"])
        for algorithm, count in summary["algorithm_counts"].items():
            lines.append(f"| {markdown_table_cell(algorithm)} | {count} |")
    else:
        lines.append("未发现已知量子脆弱公钥算法用法。")

    analysis = build_analysis(findings)
    lines.extend(["", "本报告是本次输入的静态证据清单，不是完整供应链或标准化 CBOM。", ""])
    if analysis["assets"]:
        lines.extend(["## 密码资产清单", "", "| 文件（身份） | 算法 | 命中 | 识别方式 | 密码库 / API |", "| --- | --- | ---: | --- | --- |"])
        for asset in analysis["assets"]:
            cells = [f"{asset['file_name']} ({asset['source_id']})", asset["algorithm"], asset["finding_count"],
                     " / ".join(METHOD_LABELS.get(m, "未记录") for m in asset["detection_methods"]),
                     " / ".join(asset["resolved_apis"] or asset["libraries"]) or "未记录"]
            lines.append("| " + " | ".join(markdown_table_cell(c) for c in cells) + " |")
        lines.extend(["", "## 迁移待办", "", "按受影响文件数、发现数排序；用途和实际迁移方案需人工确认。", ""])
        for item in analysis["migrations"]:
            lines.extend([f"### {markdown_table_cell(item['algorithm'])} · {item['affected_files']} 个文件 / {item['finding_count']} 项发现",
                          "", f"用途：{item['purpose']}；参考方向：{' / '.join(item['targets'])}。"])
            lines.extend(f"- {step['title']}：{step['description']}" for step in item["actions"])
            lines.extend([f"[NIST 标准参考]({item['reference_url']})", ""])

    lines.extend(["", "## 发现明细", ""])

    if not findings:
        lines.append("未发现已知量子脆弱公钥算法用法。")
        return "\n".join(lines)

    lines.extend(
        [
            "| 文件（身份） | 行号 | 算法 | 风险等级 | 证据 | 原因 | 迁移建议 | 识别方式 |",
            "| --- | ---: | --- | --- | --- | --- | --- | --- |",
        ]
    )
    for finding in findings:
        lines.append(
            "| "
            + " | ".join(
                [
                    markdown_table_cell(f"{finding.get('file_name', '')} ({finding.get('source_id', '')})"),
                    markdown_table_cell(finding.get("line", "")),
                    markdown_table_cell(finding.get("algorithm", "")),
                    markdown_table_cell(finding.get("risk_level", "")),
                    markdown_table_cell(finding.get("evidence", "")),
                    markdown_table_cell(finding.get("reason", "")),
                    markdown_table_cell(finding.get("recommendation", "")),
                    METHOD_LABELS.get(finding.get("detection_method"), "未记录"),
                ]
            )
            + " |"
        )

    return "\n".join(lines)
