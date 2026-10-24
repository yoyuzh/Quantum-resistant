from __future__ import annotations

import ast
import re
from collections import Counter
from pathlib import PurePosixPath
from typing import Any, Callable
from scanner.control import checkpoint

from backend.ai.candidates import independent_positions, round_robin
from backend.ai.models import (Candidate, CandidateCoverage, EvidenceLine, EvidenceLocation,
                                  SemanticEvidence, finding_fingerprint, stable_digest)

PRIVATE_BEGIN = re.compile(r"-----BEGIN (?:[A-Z0-9]+ )*(?:PRIVATE KEY|PUBLIC KEY|CERTIFICATE)-----")
PRIVATE_END = re.compile(r"-----END (?:[A-Z0-9]+ )*(?:PRIVATE KEY|PUBLIC KEY|CERTIFICATE)-----")
SECRET_ASSIGNMENT = re.compile(
    r"(?i)((?:[\"']?)(?:[\w.-]*(?:password|passwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token|authorization)[\w.-]*)(?:[\"']?)\s*[:=]\s*)(.*)"
)
TOKEN = re.compile(r"\b(?:sk-[A-Za-z0-9_-]{8,}|gh[pousr]_[A-Za-z0-9_]{10,}|github_pat_[A-Za-z0-9_]{10,}|AKIA[A-Z0-9]{16}|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)\b")
URL_PASSWORD = re.compile(r"(https?://)[^\s/@]+:[^\s/@]+@", re.I)


class SourceBudgetExceeded(ValueError):
    pass


def redact(text: str) -> list[str]:
    """逐行屏蔽已识别秘密；行号不变。不能保证识别所有秘密。"""
    lines = []
    private = False
    secret_block = None
    block_indent = 0
    for original in text.splitlines():
        checkpoint()
        if secret_block is not None:
            if secret_block == 'yaml' and original.strip() and len(original) - len(original.lstrip()) <= block_indent:
                secret_block = None
            else:
                lines.append('[REDACTED SECRET]')
                if secret_block != 'yaml' and secret_block in original:
                    secret_block = None
                continue
        assignment = SECRET_ASSIGNMENT.search(original)
        if assignment:
            value = assignment[2].strip()
            if value.startswith(('|', '>')):
                secret_block = 'yaml'
                block_indent = len(original) - len(original.lstrip())
            elif value.startswith(('\"\"\"', "'''")) and value.count(value[:3]) == 1:
                secret_block = value[:3]
        begin, end = PRIVATE_BEGIN.search(original), PRIVATE_END.search(original)
        if begin:
            private = True
            # 只保留已识别的类型头；同一行的正文也不能泄露。
            line = original[:begin.start()] + begin.group() + " [REDACTED]"
        elif private:
            line = end.group() if end else "[REDACTED PEM BODY]"
        else:
            line = original
        if end:
            private = False
        line = SECRET_ASSIGNMENT.sub(lambda match: match[1] + '"[REDACTED]"', line)
        line = TOKEN.sub("[REDACTED TOKEN]", line)
        line = URL_PASSWORD.sub(r"\1[REDACTED]@", line)
        lines.append(line)
    return lines


def context_lines(text: str, redacted: list[str], start: int, end: int, filename: str, limit: int) -> list[EvidenceLine]:
    """优先完整所属函数与导入；超大函数改用完整行窗口，绝不拆行。"""
    lower, upper = max(1, start - 4), min(len(redacted), end + 4)
    imports: set[int] = set()
    if PurePosixPath(filename).suffix.lower() == ".py":
        try:
            tree = ast.parse(text)
            functions = []
            for node in ast.walk(tree):
                checkpoint()
                if isinstance(node, (ast.Import, ast.ImportFrom)):
                    imports.update(range(node.lineno, (node.end_lineno or node.lineno) + 1))
                if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.lineno <= start <= (node.end_lineno or node.lineno):
                    functions.append(node)
            if functions:
                function = min(functions, key=lambda n: (n.end_lineno or n.lineno) - n.lineno)
                lo, hi = function.lineno, function.end_lineno or function.lineno
                if sum(len(line.encode("utf-8")) + 1 for line in redacted[lo - 1:hi]) <= limit:
                    lower, upper = lo, hi
        except (SyntaxError, RecursionError):
            pass
    # 候选核心行先分配，再邻接，最后导入；最终按原行号排序。
    chosen, used = {}, 0
    groups = [range(start, min(end, len(redacted)) + 1),
              sorted(range(lower, upper + 1), key=lambda n: (abs(n - start), n)), sorted(imports)]
    for group in groups:
        for number in group:
            if number in chosen or not 1 <= number <= len(redacted):
                continue
            line = redacted[number - 1]
            size = len(line.encode("utf-8")) + 1
            if used + size <= limit and len(chosen) < 500 and len(line) <= 8192:
                chosen[number] = line
                used += size
    if start not in chosen:
        return []
    return [EvidenceLine(line=number, text=line) for number, line in sorted(chosen.items())]


def _semantic_metadata(text: str, start: int, end: int) -> SemanticEvidence:
    """建立轻量定义—使用索引；不执行输入源码，无法确认时保守降级。"""
    try:
        tree = ast.parse(text)
    except (SyntaxError, RecursionError):
        return SemanticEvidence(missing_information=["无法解析源码定义—使用关系"])
    target = None
    parents: dict[ast.AST, ast.AST] = {}
    definitions: dict[str, list[int]] = {}
    uses: dict[str, list[int]] = {}
    for parent in ast.walk(tree):
        for child in ast.iter_child_nodes(parent):
            parents[child] = parent
        if isinstance(parent, ast.Call) and parent.lineno <= start <= (parent.end_lineno or parent.lineno):
            target = parent
        if isinstance(parent, ast.Assign):
            for assigned in parent.targets:
                if isinstance(assigned, ast.Name):
                    definitions.setdefault(assigned.id, []).append(parent.lineno)
        if isinstance(parent, ast.Name):
            uses.setdefault(parent.id, []).append(parent.lineno)
    if target is None:
        return SemanticEvidence(missing_information=["未找到调用节点"])
    api = ast.unparse(target.func)
    normalized = ast.dump(ast.arguments(posonlyargs=[], args=target.args, vararg=None,
                                        kwonlyargs=[], kw_defaults=[], kwarg=None, defaults=[]),
                          annotate_fields=True, include_attributes=False)
    scope = "module"
    branch_sensitive = False
    current = target
    while current in parents:
        current = parents[current]
        if isinstance(current, (ast.FunctionDef, ast.AsyncFunctionDef)):
            scope = current.name
        if isinstance(current, (ast.If, ast.For, ast.AsyncFor, ast.While, ast.Try, ast.With, ast.AsyncWith,
                                 ast.Match)):
            branch_sensitive = True
    lowered = api.lower()
    if any(word in lowered for word in ("sign", "verify", "signature")):
        purpose = "signature"
    elif any(word in lowered for word in ("encrypt", "decrypt", "cipher", "decipher")):
        purpose = "encryption"
    elif any(word in lowered for word in ("generate", "private_key", "public_key", "keygen")):
        purpose = "key_generation"
    elif any(word in lowered for word in ("hash", "digest")):
        purpose = "hash"
    else:
        purpose = "unknown"
    names = {node.id for node in ast.walk(target) if isinstance(node, ast.Name)}
    assigned_targets = []
    for parent in ast.walk(tree):
        if isinstance(parent, ast.Assign) and any(node is target or target in ast.walk(node) for node in [parent.value]):
            assigned_targets.extend(node.id for node in parent.targets if isinstance(node, ast.Name))
    reassigned = any(len(definitions.get(name, [])) > 1 for name in assigned_targets)
    missing = []
    if not names:
        missing.append("调用参数没有可追踪变量")
    if branch_sensitive:
        missing.append("分支控制流可能改变用途")
    if reassigned:
        missing.append("变量存在重赋值")
    if purpose == "unknown":
        missing.append("用途未知")
    confidence = "unknown" if branch_sensitive or purpose == "unknown" else "possible" if reassigned else "confirmed_local"
    priority = "P1" if names and (reassigned or any(line != start for name in names for line in uses.get(name, []))) else "P2"
    if scope == "module":
        priority = "P4" if purpose == "unknown" else priority
    return SemanticEvidence(api=api, normalized_parameters=normalized[:512], scope=scope,
                            purpose=purpose, confidence=confidence, evidence_priority=priority,
                            missing_information=missing[:10], branch_sensitive=branch_sensitive,
                            reassigned=reassigned)


def build_context(result: dict, read_source: Callable[[str], str], budgets: dict, check: Callable[[], object]) -> tuple[list[Candidate], CandidateCoverage]:
    """元数据全量计数，源码按 source_id 稳定顺序有界读取，并保守聚合语义等价位置。"""
    coverage = CandidateCoverage(source_files=len(result.get("sources", [])),
                                 source_partial=not bool(result.get("coverage")) or bool(result["coverage"].get("partial")))
    skipped: Counter = Counter()
    sources = sorted(result.get("sources", []), key=lambda source: source["source_id"])
    static, independent, texts, digests = [], [], {}, {}
    findings: dict[str, list] = {}
    for finding in result.get("findings", []):
        findings.setdefault(finding["source_id"], []).append(finding)
    diagnostics: dict[str, list] = {}
    for diagnostic in result.get("diagnostics", []):
        if diagnostic.get("code") == "unknown_pem_algorithm" and diagnostic.get("source_id"):
            diagnostics.setdefault(diagnostic["source_id"], []).append(diagnostic)
    for source in sources:
        check()
        identity = source["source_id"]
        supported = PurePosixPath(source["file_name"]).suffix.lower() in {".py", ".json", ".yaml", ".yml"}
        has_static = identity in findings or identity in diagnostics
        if not supported and not has_static:
            skipped["unsupported"] += 1
            continue
        if not source.get("content_available", True):
            skipped["source_missing"] += 1
            continue
        if coverage.searched_files >= budgets["search_files"]:
            skipped["search_file_limit"] += 1
            continue
        try:
            text = read_source(identity)
        except SourceBudgetExceeded:
            skipped["search_byte_limit"] += 1
            continue
        except (OSError, ValueError):
            skipped["source_missing"] += 1
            continue
        size = len(text.encode("utf-8"))
        if coverage.searched_bytes + size > budgets["search_bytes"]:
            skipped["search_byte_limit"] += 1
            continue
        coverage.searched_files += 1
        coverage.searched_bytes += size
        texts[identity] = (source["file_name"], text, redact(text))
        digests[identity] = stable_digest(text)
        for finding in sorted(findings.get(identity, []), key=lambda f: (f["line"], finding_fingerprint(f))):
            static.append((identity, finding["line"], finding["line"], "static", "static_finding", finding_fingerprint(finding)))
        for item in diagnostics.get(identity, []):
            number = item.get("line") or next((i for i, line in enumerate(text.splitlines(), 1) if "-----BEGIN " in line), 1)
            static.append((identity, number, number, "pem_diagnostic", "unknown_pem_algorithm", None))
        positions, reasons = independent_positions(text, source["file_name"], check) if supported else ([], ["unsupported"])
        skipped.update(reasons)
        independent.extend((identity, lo, hi, "independent", rule, None) for lo, hi, rule in positions)
    merged: dict[tuple[str, int], dict[str, Any]] = {}
    order: list[tuple[str, int]] = []
    static_positions = {(item[0], item[1]) for item in static}
    overlap = [item for item in independent if (item[0], item[1]) in static_positions]
    fresh = [item for item in independent if (item[0], item[1]) not in static_positions]
    for identity, lo, hi, origin, rule, ref in round_robin(static, fresh) + overlap:
        key = (identity, lo)
        if key not in merged:
            order.append(key)
            merged[key] = {"hi": hi, "origins": set(), "rules": set(), "refs": set()}
        entry = merged[key]
        entry["hi"] = max(entry["hi"], hi)
        entry["origins"].add(origin)
        entry["rules"].add(rule)
        if ref:
            entry["refs"].add(ref)
    coverage.discovered_candidates = len(order)

    grouped: dict[tuple, dict[str, Any]] = {}
    group_order: list[tuple] = []
    for identity, lo in order:
        entry = merged[(identity, lo)]
        name, text, _ = texts[identity]
        evidence = _semantic_metadata(text, lo, entry["hi"]) if name.endswith(".py") else SemanticEvidence()
        if evidence.confidence == "confirmed_local":
            semantic_key = (identity, tuple(sorted(entry["rules"])), evidence.api,
                            evidence.normalized_parameters, evidence.scope, evidence.purpose)
        else:
            # possible/unknown 绝不跨位置合并，避免变量重赋值和分支语义错误。
            semantic_key = (identity, "position", lo)
        if semantic_key not in grouped:
            group_order.append(semantic_key)
            grouped[semantic_key] = {"identity": identity, "lo": lo, "hi": entry["hi"],
                                     "origins": set(entry["origins"]), "rules": set(entry["rules"]),
                                     "refs": set(entry["refs"]), "members": [(identity, lo, entry["hi"])],
                                     "evidence": evidence}
        else:
            group = grouped[semantic_key]
            group["hi"] = max(group["hi"], entry["hi"])
            group["origins"].update(entry["origins"])
            group["rules"].update(entry["rules"])
            group["refs"].update(entry["refs"])
            group["members"].append((identity, lo, entry["hi"]))
    coverage.aggregated_candidates = len(group_order)

    candidates, selected_files = [], set()
    for semantic_key in group_order:
        check()
        group = grouped[semantic_key]
        identity, lo, hi = group["identity"], group["lo"], group["hi"]
        if len(candidates) >= budgets["preview_candidates"]:
            skipped["candidate_limit"] += len(group["members"])
            continue
        if identity not in selected_files and len(selected_files) >= budgets["preview_files"]:
            skipped["preview_file_limit"] += len(group["members"])
            continue
        name, text, redacted = texts[identity]
        lines = context_lines(text, redacted, lo, hi, name, budgets["candidate_bytes"])
        size = sum(len(line.text.encode("utf-8")) + 1 for line in lines)
        if not lines:
            skipped["line_too_large"] += len(group["members"])
            continue
        if coverage.context_bytes + size > budgets["context_bytes"]:
            skipped["context_byte_limit"] += len(group["members"])
            continue
        rules = sorted(group["rules"])
        members = [EvidenceLocation(source_id=item[0], start_line=item[1], end_line=item[2])
                   for item in sorted(group["members"], key=lambda item: (item[0], item[1], item[2]))]
        group_id = stable_digest({"source_id": identity, "semantic_key": [str(item) for item in semantic_key],
                                  "members": [item.model_dump() for item in members]})
        candidate_id = stable_digest([digests[identity], identity, lo, hi, rules, group_id])
        evidence = group["evidence"]
        levels = ["P0"] if group["refs"] else []
        if evidence.evidence_priority not in levels:
            levels.append(evidence.evidence_priority)
        if name.endswith(".py"):
            levels.extend(level for level in ("P1", "P2", "P3") if level not in levels)
        if name.endswith((".json", ".yaml", ".yml")) and "P4" not in levels:
            levels.append("P4")
        candidates.append(Candidate(candidate_id=candidate_id, group_id=group_id,
                                    source_id=identity, file_name=name,
                                    start_line=lo, end_line=hi,
                                    origins=sorted(group["origins"]), rules=rules,
                                    input_digest=digests[identity],
                                    static_finding_refs=sorted(group["refs"])[:100], lines=lines,
                                    member_locations=members, semantic_evidence=evidence,
                                    context_levels=levels[:5]))
        selected_files.add(identity)
        coverage.context_bytes += size
    coverage.selected_files = len(selected_files)
    coverage.selected_candidates = len(candidates)
    coverage.analyzed_candidates = len(candidates)
    coverage.skip_reasons = dict(sorted(skipped.items()))
    coverage.partial = coverage.source_partial or bool(skipped)
    return candidates, coverage
