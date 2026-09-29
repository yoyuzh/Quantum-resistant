from __future__ import annotations

import ast
import io
import re
import tokenize

from scanner.python_analysis import QuantumCryptoVisitor
from scanner.rules import DIRECT_REGEX_RULES, Finding, PEM_HEADER_RULES, SENSITIVE_STRING_CONTEXT_RE, STRING_IDENTIFIER_RULES, VULNERABLE_ALGOS


def strip_strings_and_comments(source: str) -> str:
    lines = [list(line) for line in source.splitlines(keepends=True)]
    try:
        for token in tokenize.generate_tokens(io.StringIO(source).readline):
            if token.type not in (tokenize.STRING, tokenize.COMMENT):
                continue
            for row in range(token.start[0] - 1, min(token.end[0], len(lines))):
                start = token.start[1] if row == token.start[0] - 1 else 0
                end = token.end[1] if row == token.end[0] - 1 else len(lines[row])
                for col in range(start, min(end, len(lines[row]))):
                    if lines[row][col] not in "\r\n":
                        lines[row][col] = " "
    except (tokenize.TokenError, IndentationError, SyntaxError, ValueError, TypeError):
        pass
    return "".join("".join(line) for line in lines)


def mask_c_style(source: str, *, strings: bool = True) -> str:
    # Match literals before comments so that URLs inside strings remain intact.
    pattern = re.compile(r'"{3,}[\s\S]*?"{3,}|@"(?:""|[^"])*"|"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|//[^\n]*|/\*[\s\S]*?(?:\*/|$)')
    def replace(match: re.Match[str]) -> str:
        value = match.group()
        if not strings and not value.startswith(("//", "/*")):
            return value
        return "".join(c if c in "\r\n" else " " for c in value)
    return pattern.sub(replace, source)


def without_hash_comment(line: str) -> str:
    quote = None
    escaped = False
    for i, char in enumerate(line):
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
        if not line.lstrip().startswith(("import ", "from ")):
            continue
        try:
            tree = ast.parse(line.strip())
        except (SyntaxError, ValueError):
            continue
        visitor.visit(tree)
    return visitor.aliases


def finding(line: int, algorithm: str, evidence: str) -> Finding:
    p = VULNERABLE_ALGOS[algorithm]
    return Finding(line, p.name, p.risk_level, p.reason, p.recommendation, evidence)


def scan_pem(source: str) -> list[Finding]:
    return [finding(i, key, evidence)
            for i, line in enumerate(source.splitlines(), 1)
            for key, pattern, evidence in PEM_HEADER_RULES if pattern.search(line)]


def scan_with_regex(source: str, aliases: dict[str, str] | None = None, *, c_style: bool = False) -> list[Finding]:
    clean = mask_c_style(source) if c_style else strip_strings_and_comments(source)
    config_source = mask_c_style(source, strings=False) if c_style else source
    visitor = QuantumCryptoVisitor()
    visitor.aliases = aliases or extract_aliases_from_source(clean)
    results = scan_pem(source)
    raw_lines = config_source.splitlines()
    for number, line in enumerate(clean.splitlines(), 1):
        for key, pattern, evidence in DIRECT_REGEX_RULES:
            if pattern.search(line):
                results.append(finding(number, key, evidence))
        for match in re.finditer(r"\b([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)\s*\(", line):
            name = match.group(1)
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
                    results.append(finding(number, key, f"{evidence}: {match.group()}"))
    unique = {(f.line, f.algorithm): f for f in results}
    return sorted(unique.values(), key=lambda f: (f.line, f.algorithm))
