"""Recognize PEM material, excluding comments and standalone documentation."""
from __future__ import annotations

import ast
import io
import re
import tokenize

from scanner.control import checkpoint
from scanner.lexing import c_style_channels


_HEADER = re.compile(r'^-----BEGIN (?:RSA |DSA |EC )?(?:PRIVATE|PUBLIC) KEY-----', re.MULTILINE)


def pem_material(source: str, suffix: str, tree: ast.AST | None = None) -> list[tuple[int, str]]:
    if suffix in {'.pem', '.key', '.pub'} or suffix == '.txt' and source.startswith('-----BEGIN '):
        return [(1, source)]
    candidates: list[tuple[int, str, int]] = []
    if tree is not None:
        stack = [tree]
        while stack:
            checkpoint()
            node = stack.pop()
            if isinstance(node, ast.Expr) and isinstance(node.value, (ast.Constant, ast.JoinedStr)):
                continue  # Docstrings and standalone documentation literals.
            if isinstance(node, ast.Constant) and isinstance(node.value, (str, bytes)):
                try:
                    value = node.value.decode('ascii') if isinstance(node.value, bytes) else node.value
                except UnicodeError:
                    continue
                candidates.append((node.lineno, value, node.end_lineno - node.lineno))
            stack.extend(ast.iter_child_nodes(node))
    elif suffix in {'.py', '.pyw', ''}:
        lines = source.splitlines()
        try:
            for token in tokenize.generate_tokens(io.StringIO(source).readline):
                checkpoint()
                if token.type == tokenize.STRING and lines[token.start[0] - 1][:token.start[1]].strip():
                    try:
                        value = ast.literal_eval(token.string)
                    except (SyntaxError, ValueError):
                        continue
                    if isinstance(value, str):
                        candidates.append((token.start[0], value, token.end[0] - token.start[0]))
        except (tokenize.TokenError, SyntaxError, IndentationError, UnicodeError):
            pass
    else:
        _, _, literals = c_style_channels(source)
        # Iterate locations once rather than recounting the source per string.
        cursor, line = 0, 1
        for start, end in literals:
            checkpoint()
            line += source.count('\n', cursor, start)
            cursor = start
            value = source[start:end].lstrip('@\"\'`').rstrip('\"\'`').replace('\\n', '\n').replace('\\r', '\r')
            candidates.append((line, value, source.count('\n', start, end)))
    # A source literal must contain a block, not just a quoted header in prose.
    materials = []
    for line, value, physical_lines in candidates:
        checkpoint()
        leading = len(value) - len(value.lstrip())
        trimmed = value[leading:]
        if _HEADER.match(trimmed) and '-----END ' in trimmed:
            offset = min(value.count('\n', 0, leading), physical_lines)
            materials.append((line + offset, trimmed))
    return materials
