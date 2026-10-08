from __future__ import annotations

import ast
import io
import re
import tokenize

from scanner.control import checkpoint, mask_span
from scanner.lexing import c_style_channels
from scanner.pem_analysis import pem_material
from scanner.python_analysis import QuantumCryptoVisitor
from scanner.rules import DIRECT_REGEX_RULES, Finding, PEM_HEADER_RULES, SENSITIVE_STRING_CONTEXT_RE, STRING_IDENTIFIER_RULES, VULNERABLE_ALGOS


def strip_strings_and_comments(source: str) -> str:
    lines = [list(line) for line in source.splitlines(keepends=True)]
    try:
        for token in tokenize.generate_tokens(io.StringIO(source).readline):
            checkpoint()
            if token.type not in (tokenize.STRING, tokenize.COMMENT):
                continue
            for row in range(token.start[0] - 1, min(token.end[0], len(lines))):
                start = token.start[1] if row == token.start[0] - 1 else 0
                end = token.end[1] if row == token.end[0] - 1 else len(lines[row])
                mask_span(lines[row], start, min(end, len(lines[row])))
    except (tokenize.TokenError, IndentationError, SyntaxError, ValueError, TypeError):
        pass
    return "".join("".join(line) for line in lines)


def mask_c_style(source: str, *, strings: bool = True) -> str:
    calls, comments, _ = c_style_channels(source)
    return calls if strings else comments


def without_hash_comment(line: str) -> str:
    quote = None
    escaped = False
    for i, char in enumerate(line):
        if i % 2048 == 0:
            checkpoint()
        if escaped:
            escaped = False
        elif char == "\\" and quote:
            escaped = True
        elif char == quote:
            quote = None
        elif char in "\"'" and quote is None:
            quote = char
        elif char == "#" and quote is None:
            return line[:i]
    return line


def extract_aliases_from_source(source: str) -> dict[str, str]:
    visitor = QuantumCryptoVisitor()
    for line in source.splitlines():
        checkpoint()
        if not line.lstrip().startswith(("import ", "from ")):
            continue
        try:
            tree = ast.parse(line.strip())
        except (SyntaxError, ValueError):
            continue
        visitor.visit(tree)
    return visitor.aliases


def finding(line: int, algorithm: str, evidence: str, method: str = "text_call") -> Finding:
    p = VULNERABLE_ALGOS[algorithm]
    return Finding(line, p.name, p.risk_level, p.reason, p.recommendation, evidence, method)


def scan_pem(source: str) -> list[Finding]:
    results = []
    for i, line in enumerate(source.splitlines(), 1):
        checkpoint()
        # Material starts at a header, not at a documentation/comment prefix.
        if not line.startswith("-----BEGIN "):
            continue
        for key, pattern, evidence in PEM_HEADER_RULES:
            if pattern.search(line):
                results.append(finding(i, key, evidence, "pem_header"))
    return results


def scan_with_regex(source: str, aliases: dict[str, str] | None = None, *, c_style: bool = False, include_pem: bool = True) -> list[Finding]:
    if c_style:
        clean, config_source, _ = c_style_channels(source)
    else:
        clean = strip_strings_and_comments(source)
        config_source = source
    visitor = QuantumCryptoVisitor()
    visitor.aliases = aliases or extract_aliases_from_source(clean)
    results: list[Finding] = []
    if include_pem:
        suffix = '.pem' if source.startswith('-----BEGIN ') else '.js' if c_style else '.py'
        for first_line, material in pem_material(source, suffix):
            results.extend(Finding(item.line + first_line - 1, item.algorithm, item.risk_level,
                                   item.reason, item.recommendation, item.evidence, item.detection_method)
                           for item in scan_pem(material))
    raw_lines = config_source.splitlines()
    for number, line in enumerate(clean.splitlines(), 1):
        checkpoint()
        for key, pattern, evidence in DIRECT_REGEX_RULES:
            if pattern.search(line):
                results.append(finding(number, key, evidence))
        # Consume each maximal name once; never retry every dotted suffix.
        for match in re.finditer(r"\b[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*", line):
            checkpoint()
            end = match.end()
            while end < len(line) and line[end].isspace():
                if end % 2048 == 0:
                    checkpoint()
                end += 1
            if end == len(line) or line[end] != "(":
                continue
            name = match.group()
            key = visitor.resolve_algorithm_from_call(name)
            if key:
                results.append(finding(number, key, name))
        if number > len(raw_lines) or not line.strip():
            continue
        raw = without_hash_comment(raw_lines[number - 1])
        context = re.match(r"\s*['\"]?([\w.-]+)['\"]?\s*[:=]\s*(.*)", raw)
        if context and SENSITIVE_STRING_CONTEXT_RE.search(context.group(1)):
            for key, pattern, evidence in STRING_IDENTIFIER_RULES:
                match = pattern.search(context.group(2))
                if match:
                    results.append(finding(number, key, f"{evidence}: {match.group()}", "text_config"))
    unique = {(f.line, f.algorithm): f for f in results}
    return sorted(unique.values(), key=lambda f: (f.line, f.algorithm))
