from __future__ import annotations

import json

from pydantic import ValidationError

from backend.ai.models import AiDiagnostic, Candidate, ModelOpinion, Opinion


def parse_opinions(content: str, candidates: list[Candidate]) -> tuple[list[Opinion], list[AiDiagnostic]]:
    def reject_constant(value):
        raise ValueError("非 JSON 常量")

    try:
        data = json.loads(content, parse_constant=reject_constant)
        if not isinstance(data, dict) or set(data) != {"opinions"} or not isinstance(data["opinions"], list):
            raise ValueError()
        if len(data["opinions"]) > len(candidates) * 2 + 10:
            raise ValueError()
    except (ValueError, TypeError, RecursionError):
        return [], [AiDiagnostic(code="invalid_json", message="模型未返回约定的 JSON 对象，本次不自动纠错重发")]
    known = {item.candidate_id: item for item in candidates}
    opinions, diagnostics, seen = [], [], set()
    # 重复候选全部拒绝，不能用顺序选择其中一个意见。
    counts = {}
    for raw in data["opinions"]:
        if isinstance(raw, dict) and isinstance(raw.get("candidate_id"), str):
            identity = raw["candidate_id"]
            counts[identity] = counts.get(identity, 0) + 1
    for raw in data["opinions"]:
        try:
            item = ModelOpinion.model_validate(raw)
        except ValidationError:
            diagnostics.append(AiDiagnostic(code="invalid_opinion", message="模型单项字段、枚举或长度无效，未保留该项"))
            continue
        identity = item.candidate_id
        if identity not in known:
            diagnostics.append(AiDiagnostic(code="unknown_candidate", message="模型返回未发送的候选标识"))
            continue
        if counts[identity] != 1:
            if identity not in seen:
                diagnostics.append(AiDiagnostic(code="duplicate_candidate", message="模型重复返回同一候选，已拒绝该候选意见", candidate_id=identity))
            seen.add(identity)
            continue
        candidate = known[identity]
        errors = []
        lines = {line.line: line.text for line in candidate.lines}
        for citation in item.citations:
            if citation.source_id != candidate.source_id:
                errors.append("引用来源不属于本候选发送快照")
                continue
            # 先限制范围再迭代，不能按供应商伪造的超大行号分配列表。
            if citation.end_line - citation.start_line + 1 > len(lines):
                errors.append("引用行超出实际发送范围")
                continue
            numbers = range(citation.start_line, citation.end_line + 1)
            if any(number not in lines for number in numbers):
                errors.append("引用行未发送或越界")
            elif citation.quote != "\n".join(lines[number] for number in numbers):
                errors.append("引用文本与脱敏快照不一致")
        if item.opinion_kind in {"supports_static", "questions_static"} and not candidate.static_finding_refs:
            errors.append("候选没有可复核的静态发现引用")
        status = "invalid" if errors else "valid" if item.citations else "absent"
        opinions.append(Opinion(**item.model_dump(), citation_status=status, citation_errors=errors))
    completed = {opinion.candidate_id for opinion in opinions}
    for identity in sorted(known.keys() - completed):
        diagnostics.append(AiDiagnostic(code="missing_candidate", message="模型未完整返回此候选，未伪造弃答", candidate_id=identity))
    return opinions, diagnostics
