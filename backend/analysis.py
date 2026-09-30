"""Evidence-based inventory shared by the UI and all report formats."""
from __future__ import annotations

from typing import Any
from backend.insights import build_insights

METHOD_LABELS = {
    "ast_call": "AST 调用", "ast_config": "AST 配置",
    "text_call": "文本调用", "text_config": "文本配置", "pem_header": "PEM 头",
}
STANDARD_URL = "https://csrc.nist.gov/projects/post-quantum-cryptography"
SIGNATURES = {"DSA", "ECDSA", "Ed25519", "Ed448"}
EXCHANGES = {"DH", "ECDH", "X25519", "X448"}


def migration_direction(algorithm: str) -> dict[str, Any]:
    if algorithm in SIGNATURES:
        purpose, targets = "数字签名", ["ML-DSA", "SLH-DSA"]
    elif algorithm in EXCHANGES:
        purpose, targets = "密钥建立", ["ML-KEM"]
    else:
        purpose, targets = "用途待确认", ["ML-KEM", "ML-DSA", "SLH-DSA"]
    return {"purpose": purpose, "targets": targets, "reference_url": STANDARD_URL}


def build_analysis(findings: list[dict[str, Any]]) -> dict[str, Any]:
    assets: dict[tuple[str, str], dict[str, Any]] = {}
    migrations: dict[str, dict[str, Any]] = {}
    for item in findings:
        identity, algorithm = item["source_id"], item["algorithm"]
        key = (identity, algorithm)
        direction = migration_direction(algorithm)
        asset = assets.setdefault(key, {
            "source_id": identity, "file_name": item["file_name"], "algorithm": algorithm,
            "finding_count": 0, "locations": [], "detection_methods": [], "libraries": [],
            "resolved_apis": [], **direction,
        })
        asset["finding_count"] += 1
        asset["locations"].append({"line": item["line"], "evidence": item["evidence"]})
        for field, value in (("detection_methods", item.get("detection_method") or "unknown"),
                             ("libraries", item.get("library")), ("resolved_apis", item.get("resolved_api"))):
            if value and value not in asset[field]:
                asset[field].append(value)
        migration = migrations.setdefault(algorithm, {
            "algorithm": algorithm, "source_ids": [], "finding_count": 0, **direction,
        })
        if identity not in migration["source_ids"]:
            migration["source_ids"].append(identity)
        migration["finding_count"] += 1
    for asset in assets.values():
        asset["locations"].sort(key=lambda location: (location["line"], location["evidence"]))
    for migration in migrations.values():
        migration["affected_files"] = len(migration["source_ids"])
        migration["actions"] = [
            {"title": "确认用途", "description": "确认签名、密钥建立或其他用途，核对数据保密周期与实际调用场景。"},
            {"title": "选择实现", "description": "按用途评估 " + " / ".join(migration["targets"]) + "，确认所用密码库与平台支持。ML-KEM 是密钥封装机制，不能直接替换签名或任意加密 API。"},
            {"title": "验证兼容", "description": "核对通信双方、证书格式、密钥管理与协议支持；混合方案需单独评估。"},
            {"title": "测试验证", "description": "补充互操作、性能、密钥生命周期和回退测试，人工复核后制定迁移排期。"},
        ]
    return {
        "version": 1,
        "insights": build_insights(findings),
        "assets": sorted(assets.values(), key=lambda a: (a["file_name"], a["source_id"], a["algorithm"])),
        "migrations": sorted(migrations.values(), key=lambda m: (-m["affected_files"], -m["finding_count"], m["algorithm"])),
    }
