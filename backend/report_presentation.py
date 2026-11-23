"""Reading-report presentation; canonical exports and analysis stay unchanged."""
from __future__ import annotations

from typing import Any

SCORE_NOTE = "迁移评分用于安排优先级。高风险项 × 25 + 受影响文件 × 10 + 算法种类 × 10，上限 100。"


def migration_presentation(migrations: list[dict[str, Any]]) -> dict[str, Any]:
    """Factor repeated guidance without changing canonical analysis or exports."""
    def normalize(action: dict, targets: list[str]) -> dict:
        prefix = "按用途评估 " + " / ".join(targets) + "，"
        suffix = "确认所用密码库与平台支持。ML-KEM 是密钥封装机制，不能直接替换签名或任意加密 API。"
        description = action["description"]
        if description == prefix + suffix:
            description = "按用途评估表中候选方案，" + suffix
        return {**action, "description": description}

    normalized = [[normalize(action, item.get("targets", []))
                   for action in item.get("actions", [])] for item in migrations]
    shared: list[dict] = []
    for action in normalized[0] if len(normalized) > 1 else []:
        if action not in shared and all(action in actions for actions in normalized):
            shared.append(action)
    rows = [{**item, "actions": [action for action, normalized_action in
                                zip(item.get("actions", []), normalized[index])
                                if normalized_action not in shared]}
            for index, item in enumerate(migrations)]
    references = list(dict.fromkeys(item["reference_url"] for item in migrations
                                    if item.get("reference_url")))
    return {"rows": rows, "shared": shared, "references": references}


def scope_status(coverage: dict | None) -> str:
    if not coverage:
        return "扫描范围未知。"
    if coverage.get("partial"):
        return "部分扫描。候选总数未知。" if coverage.get("candidate_files") is None else "部分扫描。"
    if coverage.get("candidate_files") is None:
        return "候选总数未知。"
    return ""


def scope_columns(coverage: dict | None, scanned_files: int) -> tuple[list[str], list]:
    scope = coverage or {}
    candidates = scope.get('candidate_files')
    return ['已分析文件', '候选文件', '跳过文件', '降级分析文件'], [
        scope.get('scanned_files', scanned_files), '未知' if candidates is None else candidates,
        scope.get('skipped_files', '未知'), scope.get('degraded_files', '未知'),
    ]


def key_conclusions(analysis: dict[str, Any]) -> list[str]:
    insights = analysis["insights"]
    lines = []
    if insights["algorithms"]:
        top = insights["algorithms"][0]
        lines.append(f"主要算法：{top['label']}（{top['count']} 项发现）")
    if insights["files"]:
        top = insights["files"][0]
        identities = {a['source_id'] for a in analysis['assets'] if a['file_name'] == top['label']}
        label = top['label']
        if len(identities) > 1:
            suffix = top['key'][-6:]
            suffix = top['key'] if sum(identity.endswith(suffix) for identity in identities) > 1 else suffix
            label += f"（{suffix}）"
        lines.append(f"命中最多：{label}（{top['count']} 项发现）")
    pending = next((row["count"] for row in insights["purposes"] if row["key"] == "用途待确认"), 0)
    if pending:
        lines.append(f"{pending} 项用途待确认。")
    return lines or ["本次扫描未检出已知量子脆弱公钥算法。"]
