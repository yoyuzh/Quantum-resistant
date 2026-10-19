"""AST argument binding without inspect, eval or importing target modules."""
from __future__ import annotations

import ast
from dataclasses import dataclass
from typing import Callable

from deep_analysis.abstract_values import FactStore
from deep_analysis.semantic_models import Fact


@dataclass(frozen=True)
class Signature:
    positional: tuple[str, ...]
    positional_only: tuple[str, ...] = ()
    keyword_only: tuple[str, ...] = ()
    defaults: tuple[tuple[str, ast.expr | Fact], ...] = ()
    vararg: str | None = None
    kwarg: str | None = None


def function_signature(node: ast.FunctionDef | ast.AsyncFunctionDef) -> Signature:
    positional = tuple(a.arg for a in (*node.args.posonlyargs, *node.args.args))
    defaults = list(zip(positional[len(positional) - len(node.args.defaults):], node.args.defaults))
    defaults.extend((a.arg, default) for a, default in zip(node.args.kwonlyargs, node.args.kw_defaults) if default is not None)
    return Signature(positional, tuple(a.arg for a in node.args.posonlyargs), tuple(a.arg for a in node.args.kwonlyargs),
                     tuple(defaults), node.args.vararg.arg if node.args.vararg else None,
                     node.args.kwarg.arg if node.args.kwarg else None)


def actuals(call: ast.Call) -> tuple[list[ast.expr], dict[str, ast.expr], str | None]:
    positional, keywords = [], {}
    for arg in call.args:
        if isinstance(arg, ast.Starred):
            if not isinstance(arg.value, (ast.List, ast.Tuple)) or any(isinstance(e, ast.Starred) for e in arg.value.elts):
                return [], {}, 'dynamic_unpack'
            positional.extend(arg.value.elts)
        else:
            positional.append(arg)
    for keyword in call.keywords:
        if keyword.arg is not None:
            pairs = [(keyword.arg, keyword.value)]
        elif isinstance(keyword.value, ast.Dict) and all(isinstance(k, ast.Constant) and type(k.value) is str for k in keyword.value.keys):
            pairs = [(k.value, v) for k, v in zip(keyword.value.keys, keyword.value.values)]
        else:
            return [], {}, 'dynamic_unpack'
        for name, value in pairs:
            if name in keywords:
                return [], {}, 'invalid_argument_binding'
            keywords[name] = value
    if len(positional) + len(keywords) > 64:
        return [], {}, 'argument_limit'
    return positional, keywords, None


def bind_arguments(call: ast.Call, signature: Signature, store: FactStore,
                   evaluate: Callable[[ast.expr], Fact], default: Callable[[ast.expr], Fact]) -> tuple[dict[str, Fact], str | None]:
    positional, keywords, reason = actuals(call)
    names = (*signature.positional, *signature.keyword_only)
    defaults = dict(signature.defaults)
    if len(names) > 64:
        return {name: store.unknown('argument_limit') for name in names[:64]}, 'argument_limit'
    if reason is None:
        if (len(positional) > len(signature.positional) or any(k in signature.positional_only for k in keywords)
                or any(k in signature.positional[:len(positional)] for k in keywords)
                or any(k not in names for k in keywords)):
            reason = 'invalid_argument_binding'
        elif any(name not in signature.positional[:len(positional)] and name not in keywords and name not in defaults for name in names):
            reason = 'missing_argument'
    if reason:
        return {name: store.unknown(reason) for name in names}, reason
    bound = {name: evaluate(value) for name, value in zip(signature.positional, positional)}
    bound.update((name, evaluate(value)) for name, value in keywords.items())
    for name in names:
        if name not in bound:
            value = defaults[name]
            bound[name] = value if isinstance(value, Fact) else default(value)
    return bound, None
