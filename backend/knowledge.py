from __future__ import annotations

from scanner.rules import VULNERABLE_ALGOS


def knowledge_graph() -> dict[str, list[dict[str, str]]]:
    nodes = [
        {"id": "math:integer-factorization", "label": "大整数分解", "type": "MathProblem"},
        {"id": "math:discrete-log", "label": "离散对数", "type": "MathProblem"},
        {"id": "math:elliptic-curve-dlog", "label": "椭圆曲线离散对数", "type": "MathProblem"},
        {"id": "risk:shor", "label": "Shor 算法量子威胁", "type": "Risk"},
        {"id": "pqc:ML-KEM", "label": "ML-KEM / FIPS 203", "type": "PQCRecommendation"},
        {"id": "pqc:ML-DSA", "label": "ML-DSA / FIPS 204", "type": "PQCRecommendation"},
        {"id": "pqc:SLH-DSA", "label": "SLH-DSA / FIPS 205", "type": "PQCRecommendation"},
    ]
    edges = []
    for profile in VULNERABLE_ALGOS.values():
        identity = f"algorithm:{profile.name}"
        nodes.append({"id": identity, "label": profile.name, "type": "Algorithm", "reason": profile.reason, "recommendation": profile.recommendation})
        problem = "integer-factorization" if profile.name == "RSA" else "discrete-log" if profile.name in {"DH", "DSA"} else "elliptic-curve-dlog"
        edges.append({"source": identity, "target": f"math:{problem}", "label": "依赖"})
        for target in ("ML-KEM", "ML-DSA", "SLH-DSA"):
            if target in profile.recommendation:
                edges.append({"source": identity, "target": f"pqc:{target}", "label": "按用途评估迁移"})
    for problem in ("integer-factorization", "discrete-log", "elliptic-curve-dlog"):
        edges.append({"source": f"math:{problem}", "target": "risk:shor", "label": "受影响"})
    return {"nodes": nodes, "edges": edges}
