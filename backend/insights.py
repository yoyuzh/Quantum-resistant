"""Deterministic summaries of confirmed evidence, never confidence estimates."""
from __future__ import annotations

from collections import Counter
from typing import Any


def build_insights(findings: list[dict[str, Any]]) -> dict[str, Any]:
    from backend.analysis import METHOD_LABELS, migration_direction

    algorithms = Counter(f["algorithm"] for f in findings)
    methods = Counter(f.get("detection_method") or "unknown" for f in findings)
    purposes = Counter(migration_direction(f["algorithm"])["purpose"] for f in findings)
    files: dict[str, dict] = {}
    for finding in findings:
        row = files.setdefault(finding["source_id"], {
            "key": finding["source_id"], "label": finding["file_name"], "count": 0,
        })
        row["count"] += 1
    ranked = sorted(files.values(), key=lambda row: (-row["count"], row["label"], row["key"]))
    ordered_algorithms = sorted(algorithms.items(), key=lambda row: (-row[1], row[0]))
    total = len(findings)
    conclusions = [f"本次确认 {total} 项发现，涉及 {len(files)} 个文件、{len(algorithms)} 类算法。"]
    if total:
        name, count = ordered_algorithms[0]
        conclusions.append(f"命中最多的是 {name}（{count} 项）；发现次数表示使用位置数量，不代表风险概率。")
        conclusions.append(f"优先复核 {ranked[0]['label']}（{ranked[0]['key']}）：共 {ranked[0]['count']} 项发现。")
        unknown = purposes.get("用途待确认", 0)
        if unknown:
            conclusions.append(f"其中 {unknown} 项发现的用途待确认，不能仅凭 RSA 或通用 ECC 推断签名或密钥建立。")
        conclusions.append("下一步：确认实际用途与协议约束，再评估实现支持、互操作和性能。")
    else:
        conclusions.append("本次范围内未命中已知传统公钥算法；不等于整个项目不存在相关用法。")
    return {
        "finding_count": total, "affected_files": len(files), "conclusions": conclusions,
        "algorithms": [{"key": key, "label": key, "count": value} for key, value in ordered_algorithms],
        "files": ranked[:8], "other_files": len(ranked[8:]),
        "other_findings": sum(row["count"] for row in ranked[8:]),
        "methods": [{"key": key, "label": METHOD_LABELS.get(key, "未记录"), "count": value}
                    for key, value in sorted(methods.items(), key=lambda row: (-row[1], row[0]))],
        "purposes": [{"key": key, "label": key, "count": purposes.get(key, 0)}
                     for key in ("数字签名", "密钥建立", "用途待确认")],
    }
