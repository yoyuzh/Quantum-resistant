"""Shared bounded parser for project indexing and independent AI candidates."""
from __future__ import annotations

import ast
import tokenize
from scanner.control import MAX_NODES, MAX_DEPTH


def parse_python(text, filename='<source>', check=lambda: None):
    from scanner.python_analysis import validate_parser_input
    try:
        validate_parser_input(text)
    except tokenize.TokenError as exc:
        raise SyntaxError('Python词法无法解析') from exc
    tree = ast.parse(text, filename=filename, feature_version=(3, 10))
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
