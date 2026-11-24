"""Shared bounded parser for project indexing and independent AI candidates."""
from __future__ import annotations

import ast
import io
import sys
import tokenize
from scanner.control import MAX_NODES, MAX_DEPTH


class ParserInputLimit(SyntaxError):
    """Lexical input exceeds the limits for entering the native parser."""


def validate_parser_input(text, check):
    # Flat containers and long argument lists do not grow the parser stack.
    # Retain a limit for each expression and a separate total token budget.
    segments = [0]
    for index, token in enumerate(tokenize.generate_tokens(io.StringIO(text).readline)):
        if index % 128 == 0:
            check()
        if index >= MAX_NODES * 4:
            raise ParserInputLimit('Python 输入 token 数超过预检查上限')
        if token.type in (tokenize.NL, tokenize.INDENT, tokenize.DEDENT, tokenize.COMMENT, tokenize.ENDMARKER):
            continue
        operator = token.string if token.type == tokenize.OP else ''
        if token.type == tokenize.NEWLINE or operator in (',', ';'):
            segments[-1] = 0
            continue
        if operator in (')', ']', '}') and len(segments) > 1:
            segments.pop()
        segments[-1] += 1
        if segments[-1] > MAX_DEPTH * 4:
            raise ParserInputLimit('Python 表达式超过预检查深度范围')
        if operator in ('(', '[', '{'):
            if len(segments) > MAX_DEPTH * 2:
                raise ParserInputLimit('Python 表达式超过预检查嵌套深度')
            segments.append(0)


def parse_python(text, filename='<source>', check=lambda: None, *, target_minor=sys.version_info.minor):
    try:
        validate_parser_input(text, check)
    except tokenize.TokenError as exc:
        raise SyntaxError('Python词法无法解析') from exc
    tree = ast.parse(text, filename=filename, feature_version=(3, target_minor))
    pending, count = [(tree, 0)], 0
    while pending:
        node, depth = pending.pop()
        count += 1
        if count % 128 == 1:
            check()
        if count > MAX_NODES or depth > MAX_DEPTH:
            raise OverflowError('ast_limit')
        pending.extend((child, depth + 1) for child in ast.iter_child_nodes(node))
    return tree
