"""Shared bounded parser for project indexing and independent AI candidates."""
from __future__ import annotations

import ast
import sys
import tokenize
from scanner.control import AnalysisLimit, MAX_NODES, MAX_DEPTH, analysis_control


def parse_python(text, filename='<source>', check=lambda: None, *, target_minor=sys.version_info.minor):
    from scanner.python_analysis import validate_parser_input
    try:
        with analysis_control(check):
            validate_parser_input(text)
    except tokenize.TokenError as exc:
        raise SyntaxError('Python词法无法解析') from exc
    except AnalysisLimit as exc:
        raise OverflowError('ast_limit') from exc
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
