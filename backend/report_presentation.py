"""Reading-report presentation; canonical exports and analysis stay unchanged."""
from __future__ import annotations

from typing import Any

BOUNDARIES = [
    "迁移评分是启发式优先级，不代表风险概率。高风险项 × 25 + 受影响文件 × 10 + 算法种类 × 10，上限 100。",
    "扫描仅覆盖本次输入与当前规则；零发现不能证明安全。资产清单不是完整供应链或标准化 CBOM，报告不附完整源码。",
    "识别方式表示证据来源，不是置信度。用途与迁移方案需人工复核；ML-KEM 用于密钥封装，ML-DSA、SLH-DSA 用于数字签名，不能直接替换任意 API。",
]


def scope_status(coverage: dict | None) -> str:
    if not coverage:
        return "扫描范围未知。"
    if coverage.get("partial"):
        return "部分扫描：存在未扫描内容，仅列出完整分析的文件。" + ("候选总数未知。" if coverage.get("candidate_files") is None else "")
    if coverage.get("candidate_files") is None:
        return "候选总数未知，无法确认全部候选的覆盖情况。"
    return "扫描范围：本次受支持的候选文件。"


def key_conclusions(analysis: dict[str, Any]) -> list[str]:
    insights = analysis["insights"]
    lines = []
    if insights["algorithms"]:
        top = insights["algorithms"][0]
        lines.append(f"主要算法：{top['label']} · {top['count']} 项发现。")
    if insights["files"]:
        top = insights["files"][0]
        identities = {a['source_id'] for a in analysis['assets'] if a['file_name'] == top['label']}
        label = top['label']
        if len(identities) > 1:
            suffix = top['key'][-6:]
            suffix = top['key'] if sum(identity.endswith(suffix) for identity in identities) > 1 else suffix
            label += f" · {suffix}"
        lines.append(f"命中最多：{label} · {top['count']} 项发现。")
    pending = next((row["count"] for row in insights["purposes"] if row["key"] == "用途待确认"), 0)
    if pending:
        lines.append(f"用途待确认：{pending} 项，需结合调用上下文复核。")
    return lines or ["未发现已知量子脆弱公钥算法用法。"]
