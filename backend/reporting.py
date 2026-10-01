from __future__ import annotations

from collections import Counter
from html import escape
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from scan_quantum_vuln import build_migration_score
from backend.analysis import METHOD_LABELS, build_analysis

BEIJING_TZ = timezone(timedelta(hours=8))
SOURCE_LABELS = {'snippet': '代码片段', 'manual_upload': '文件上传',
                 'github_repository': 'GitHub 仓库', 'pypi_package': 'PyPI 包'}


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
    text = escape(str(value), quote=False)
    return text.replace("|", "\\|").replace("\n", " ↵ ")


def build_markdown_report(
    sources: list[dict[str, Any]], findings: list[dict[str, Any]], source_type: str,
    scanned_at: Optional[str] = None, coverage: dict | None = None,
    diagnostics: list[dict] | None = None,
) -> str:
    from backend.report_presentation import BOUNDARIES, key_conclusions, scope_status
    import json
    import re
    summary = build_summary(sources, findings)
    analysis = build_analysis(findings)
    insights = analysis["insights"]
    cell = markdown_table_cell
    lines = ["# 量子脆弱密码算法扫描报告", "",
             f"{cell(SOURCE_LABELS.get(source_type, source_type))} · {cell(scanned_at or beijing_now_iso())}（北京时间）", "",
             "## 摘要与关键结论", "",
             f"- 风险发现总数：{summary['finding_count']} · 受影响文件：{insights['affected_files']}",
             f"- 文件数量：{summary['source_count']} · 算法种类：{len(summary['algorithm_counts'])}",
             f"- 迁移评分：{summary['migration_score']['score']}/100 · 迁移优先级：{cell(summary['migration_score']['priority'])}",
             *[f"- {cell(line)}" for line in key_conclusions(analysis)], "", scope_status(coverage), "",
             "## 扫描范围", ""]
    def rows(headers, values):
        lines.extend(["| " + " | ".join(headers) + " |", "| " + " | ".join("---" for _ in headers) + " |"])
        lines.extend("| " + " | ".join(cell(v) for v in row) + " |" for row in values)
        lines.append("")
    if coverage:
        rows(["项目", "本次数据"], [["已分析文件", coverage.get('scanned_files', summary['source_count'])],
             ["候选文件", coverage.get('candidate_files') if coverage.get('candidate_files') is not None else '未知'],
             ["跳过文件", coverage.get('skipped_files', 0)]])
    else:
        lines.extend(["扫描范围未知。", ""])
    lines.extend(["## 主要统计", "", f"统计分母：本次全部 {len(findings)} 项发现。", ""])
    for title, key in [("算法", "algorithms"), ("受影响文件 Top 8", "files"), ("用途", "purposes")]:
        lines.extend([f"### {title}", ""])
        rows(["项目", "发现数"], [[r['label'] + (f" ({r['key']})" if key == 'files' else ''), r['count']] for r in insights[key]])
    if insights['other_files']:
        lines.extend([f"其余 {insights['other_files']} 个命中文件，共 {insights['other_findings']} 项发现。", ""])
    lines.extend(["## 密码资产清单", ""])
    rows(["文件（身份）", "算法 / 用途", "命中", "识别方式", "密码库", "完整 API", "迁移参考"], [
        [f"{a['file_name']} ({a['source_id']})", f"{a['algorithm']} / {a['purpose']}", a['finding_count'],
         ' / '.join(METHOD_LABELS.get(m, '未记录') for m in a['detection_methods']),
         ' / '.join(a['libraries']) or '未记录', ' / '.join(a['resolved_apis']) or '未记录', ' / '.join(a['targets'])]
        for a in analysis['assets']])
    lines.extend(["## 发现明细", ""])
    if not findings:
        lines.extend(["未发现已知量子脆弱公钥算法用法。", ""])
    for index, finding in enumerate(findings, 1):
        lines.extend([f"### {index}. {cell(finding['algorithm'])} · 第 {cell(finding['line'])} 行 · {cell(finding['risk_level'])}", "",
                      f"文件：{cell(finding['file_name'])}", ""])
        # A longer fence preserves arbitrary evidence containing backticks and newlines.
        evidence = str(finding['evidence'])
        longest = max((len(run) for run in re.findall(r'`+', evidence)), default=0)
        fence = '`' * max(3, longest + 1)
        lines.extend([fence + 'text', evidence, fence, ""])
        method = METHOD_LABELS.get(finding.get('detection_method'), '未记录')
        if finding.get('detection_method'):
            method += f" ({finding['detection_method']})"
        lines.extend([
            f"- 文件身份：{cell(finding['source_id'])} · 来源：{cell(finding.get('source_type') or '未记录')}",
            f"- 识别方式：{cell(method)} · 密码库：{cell(finding.get('library') or '未记录')}",
            f"- 完整 API：{cell(finding.get('resolved_api') or '未记录')}", "",
            f"原因：{cell(finding['reason'])}", "",
            f"迁移参考：{cell(finding['recommendation'])}", "",
        ])
    lines.extend(["## 迁移待办", ""])
    for item in analysis['migrations']:
        lines.extend([f"### {cell(item['algorithm'])} · {item['affected_files']} 个文件 / {item['finding_count']} 项发现", "",
                      f"{cell(item['purpose'])} · 参考：{cell(' / '.join(item['targets']))}", ""])
        lines.extend(f"- **{cell(step['title'])}**：{cell(step['description'])}" for step in item['actions'])
        lines.extend([f"[NIST 标准参考]({item['reference_url']})", ""])
    if not analysis['migrations']:
        lines.extend(["无迁移待办。", ""])
    lines.extend(["## 附录", "", "### 评分与能力边界", "", *[f"- {line}" for line in BOUNDARIES], "", "### 识别依据", ""])
    rows(["识别方式", "发现数"], [[r['label'], r['count']] for r in insights['methods']])
    lines.extend(["### 范围详情", ""])
    rows(["字段", "值"], [[k, json.dumps(v, ensure_ascii=False) if isinstance(v, (dict, list)) else v] for k, v in (coverage or {}).items()])
    lines.extend(["### 文件元信息", ""])
    rows(["文件", "元信息"], [[s.get('file_name', ''), json.dumps({k: v for k, v in s.items() if k != 'content'}, ensure_ascii=False)] for s in sources])
    lines.extend(["### 扫描诊断", ""])
    rows(["提示", "完整诊断"], [[d.get('message', ''), json.dumps(d, ensure_ascii=False)] for d in diagnostics or []])
    return "\n".join(lines)
