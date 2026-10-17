from __future__ import annotations

import ast
import re
from collections import Counter
from pathlib import PurePosixPath
from typing import Callable
from scanner.control import checkpoint

from backend.ai.candidates import independent_positions, round_robin
from backend.ai.models import Candidate, CandidateCoverage, EvidenceLine, finding_fingerprint, stable_digest

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


def build_context(result: dict, read_source: Callable[[str], str], budgets: dict, check: Callable[[], object]) -> tuple[list[Candidate], CandidateCoverage]:
    """元数据全量计数，源码按 source_id 稳定顺序有界读取。"""
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
        # 检索限制覆盖所有读取（包括静态通路），比独立检索上限更保守。
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
    merged = {}
    order = []
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
    candidates, selected_files = [], set()
    for identity, lo in order:
        check()
        entry = merged[(identity, lo)]
        if len(candidates) >= budgets["preview_candidates"]:
            skipped["candidate_limit"] += 1
            continue
        if identity not in selected_files and len(selected_files) >= budgets["preview_files"]:
            skipped["preview_file_limit"] += 1
            continue
        name, text, redacted = texts[identity]
        lines = context_lines(text, redacted, lo, entry["hi"], name, budgets["candidate_bytes"])
        size = sum(len(line.text.encode("utf-8")) + 1 for line in lines)
        if not lines:
            skipped["line_too_large"] += 1
            continue
        if coverage.context_bytes + size > budgets["context_bytes"]:
            skipped["context_byte_limit"] += 1
            continue
        rules = sorted(entry["rules"])
        candidates.append(Candidate(candidate_id=stable_digest([digests[identity], identity, lo, entry["hi"], rules]),
                                    source_id=identity, file_name=name, start_line=lo, end_line=entry["hi"],
                                    origins=sorted(entry["origins"]), rules=rules, input_digest=digests[identity],
                                    static_finding_refs=sorted(entry["refs"])[:100], lines=lines))
        selected_files.add(identity)
        coverage.context_bytes += size
    coverage.selected_files = len(selected_files)
    coverage.selected_candidates = len(candidates)
    coverage.skip_reasons = dict(sorted(skipped.items()))
    coverage.partial = coverage.source_partial or bool(skipped)
    return candidates, coverage
