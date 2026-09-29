from __future__ import annotations

import hashlib
from typing import Iterable
from scanner.rules import Finding

def merge_findings(findings: Iterable[Finding]) -> list[Finding]:
    merged_by_location: dict[tuple[int, str], Finding] = {}
    for finding in findings:
        key = (finding.line, finding.algorithm)
        if key not in merged_by_location:
            merged_by_location[key] = finding
    return sorted(
        merged_by_location.values(),
        key=lambda item: (item.line, item.algorithm, item.evidence),
    )


def make_source_id(filename: str, source: str) -> str:
    digest = hashlib.sha256(f"{filename}\0{source}".encode("utf-8")).hexdigest()
    return f"src_{digest[:12]}"


def build_migration_score(
    sources: list[dict[str, object]],
    findings: list[dict[str, object]],
) -> dict[str, int | str]:
    high_risk_findings = sum(1 for finding in findings if "高" in str(finding.get("risk_level", "")))
    affected_files = len(
        {
            str(finding.get("source_id") or finding.get("file_name", ""))
            for finding in findings
            if finding.get("source_id") or finding.get("file_name")
        }
    )
    algorithm_variety = len(
        {
            str(finding.get("algorithm", ""))
            for finding in findings
            if finding.get("algorithm")
        }
    )
    score = min(100, high_risk_findings * 25 + affected_files * 10 + algorithm_variety * 10)

    if score >= 40:
        risk_level = "高"
        priority = "立即规划迁移"
    elif score > 0:
        risk_level = "中"
        priority = "纳入迁移排期"
    else:
        risk_level = "低"
        priority = "持续观察"

    return {
        "score": score,
        "risk_level": risk_level,
        "priority": priority,
        "high_risk_findings": high_risk_findings,
        "affected_files": affected_files,
        "algorithm_variety": algorithm_variety,
        "source_count": len(sources),
    }
