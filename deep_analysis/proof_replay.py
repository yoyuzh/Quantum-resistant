"""Independent AST witness checker, without engine/Evaluator/FactStore calls.

Replays a single submitted call context using a small, fail-closed interpreter.
It reconstructs required equality edges; CALLS alone never supplies a value.
Only the declarative crypto policy and trusted parser/index are shared.
"""
from __future__ import annotations

import ast
from dataclasses import dataclass, replace
from typing import Callable

from deep_analysis.crypto_rules import RULES
from deep_analysis.identity import stable_id
from deep_analysis.models import Alternative, Ambiguous, Budgets, Known, Span, Unknown
from deep_analysis.symbol_index import Index, Module, dotted, import_base, location, resolve

Edge = tuple[str, Span, Span]


@dataclass(frozen=True)
class Witness:
    value: Known | Ambiguous | Unknown
    last: Span | None = None
    edges: frozenset[Edge] = frozenset()
    nodes: frozenset[Span] = frozenset()
    key_type: str | None = None
    origin: Span | None = None
    items: tuple[Witness, ...] | None = None

    def edge(self, kind: str, source: Span, target: Span) -> Witness:
        return replace(self, last=target, edges=self.edges | {(kind, source, target)}, nodes=self.nodes | {source, target})


def unknown(reason: str) -> Witness:
    return Witness(Unknown(reason=reason))


@dataclass(frozen=True)
class Scope:
    module: Module
    name: str = '<module>'
    parameters: tuple[tuple[str, Witness], ...] = ()
    chain: tuple[Span, ...] = ()
    cutoff: tuple[int, int] | None = None
    blocked: bool = False


class Replay:
    def __init__(self, index: Index, budgets: Budgets, checkpoint: Callable[[], object]):
        self.index, self.budgets, self.checkpoint = index, budgets, checkpoint
        self.modules = {m.source_id: m for m in index.modules}
        self.calls = {c.location: (m, c) for m in index.modules for c in m.calls}
        self.nodes = {location(m.source_id, n): n for m in index.modules for n in ast.walk(m.tree)
                      if hasattr(n, 'end_lineno') and n.end_lineno is not None}
        self.functions = {}
        for module in index.modules:
            pending = [(module.tree, '<module>')]
            while pending:
                node, scope = pending.pop()
                if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    scope += '.' + node.name
                    self.functions[module.source_id + ':' + scope] = (module, node, scope)
                pending.extend((n, scope) for n in ast.iter_child_nodes(node))
        self.cross = all(m.name is not None for m in index.modules)
        self.active = 0
        self.visits = 0

    def expr(self, node: ast.AST, scope: Scope) -> Witness:
        self.checkpoint()
        self.visits += 1
        if self.active >= self.budgets.ast_depth or self.visits > self.budgets.index_nodes:
            return unknown('replay_limit')
        self.active += 1
        try:
            witness = self._expr(node, scope)
            if len(witness.nodes) > self.budgets.slice_nodes or len(witness.edges) > self.budgets.slice_nodes:
                return unknown('replay_slice_limit')
            return witness
        finally:
            self.active -= 1

    def _expr(self, node: ast.AST, scope: Scope) -> Witness:
        module = scope.module
        span = location(module.source_id, node)
        if scope.blocked or any(s.kind == 'dynamic_namespace' for s in module.symbols):
            return unknown('unsupported_scope')
        if isinstance(node, ast.Constant) and type(node.value) in (str, int, float, bool, type(None)):
            try:
                return Witness(Known(value=node.value), span, nodes=frozenset({span}))
            except ValueError:
                return unknown('literal_limit')
        if isinstance(node, ast.Name):
            value = self.lookup(node.id, node, scope)
            return value.edge('ASSIGN_FLOW', value.last or span, span)
        if isinstance(node, ast.Attribute):
            target, _ = resolve(dotted(node), scope.name, module, list(self.modules.values()), self.cross)
            if target and ':' not in target:
                return unknown('module_is_not_scalar')
            name = dotted(node)
            if not name or not self.cross:
                return unknown('unsupported_attribute')
            head, suffix = name.split('.', 1)
            bindings = self.bindings(head, scope)
            if len(bindings) != 1 or bindings[0].kind != 'import' or not bindings[0].target:
                return unknown('unsupported_attribute')
            return self.imported(bindings[0].target + '.' + suffix, node, scope)
        if isinstance(node, ast.IfExp):
            test = self.expr(node.test, scope).value
            arms = (node.body, node.orelse)
            if isinstance(test, Known) and type(test.value) is bool:
                return self.expr(arms[0 if test.value else 1], scope)
            return self.merge(tuple(self.expr(n, scope) for n in arms))
        if isinstance(node, (ast.List, ast.Tuple)) and len(node.elts) <= 64 and not any(isinstance(n, ast.Starred) for n in node.elts):
            return Witness(Unknown(reason='literal_container'), items=tuple(self.expr(n, scope) for n in node.elts))
        if isinstance(node, ast.Dict) and len(node.keys) <= 32 and all(isinstance(k, ast.Constant) and type(k.value) is str for k in node.keys):
            if len({k.value for k in node.keys}) != len(node.keys):
                return unknown('duplicate_mapping_key')
            return Witness(Unknown(reason='literal_mapping'), items=tuple(self.expr(n, scope) for pair in zip(node.keys, node.values) for n in pair))
        if isinstance(node, ast.Call):
            return self.call(node, scope)
        return unknown('unsupported_transform')

    def bindings(self, name: str, scope: Scope) -> list:
        current = scope.name
        while True:
            found = [s for s in scope.module.symbols if s.scope == current and s.name == name]
            if found or current == '<module>':
                return found
            current = current.rsplit('.', 1)[0]

    def lookup(self, name: str, use: ast.AST | None, scope: Scope) -> Witness:
        if any(s.kind == 'global_taint' and s.name == name for s in scope.module.symbols):
            return unknown('dynamic_scope_write')
        function = self.functions.get(scope.module.source_id + ':' + scope.name)
        body = function[1].body if function else scope.module.tree.body
        initial = dict(scope.parameters).get(name)
        local = any(s.name == name and s.scope == scope.name and s.kind in ('write', 'parameter', 'function', 'class') for s in scope.module.symbols)
        if initial is None:
            if function and not local:
                cutoff = ast.Pass(lineno=scope.cutoff[0], col_offset=scope.cutoff[1]) if scope.cutoff else None
                return self.lookup(name, cutoff, Scope(scope.module))
            initial = unknown('unbound_local' if function else 'unbound_name')
        return self.scan(name, body, use, scope, initial)

    def scan(self, name: str, body: list, use: ast.AST | None, scope: Scope, value: Witness) -> Witness:
        point = (use.lineno, use.col_offset) if use else None
        for stmt in body:
            self.checkpoint()
            if point and (stmt.lineno, stmt.col_offset) >= point:
                break
            inside = point and (stmt.lineno, stmt.col_offset) <= point < (stmt.end_lineno, stmt.end_col_offset)
            if isinstance(stmt, ast.If):
                if inside:
                    for branch in (stmt.body, stmt.orelse):
                        if any((s.lineno, s.col_offset) <= point < (s.end_lineno, s.end_col_offset) for s in branch):
                            return self.scan(name, branch, use, scope, value)
                    break
                test = self.expr(stmt.test, scope).value
                branches = (stmt.body, stmt.orelse)
                if isinstance(test, Known) and type(test.value) is bool:
                    branches = (branches[0 if test.value else 1],)
                value = self.merge(tuple(self.scan(name, b, None, scope, value) for b in branches))
                continue
            if inside:
                if not isinstance(stmt, (ast.Assign, ast.AnnAssign, ast.Expr, ast.Return, ast.FunctionDef, ast.ClassDef)):
                    return unknown('unsupported_control_flow')
                break
            if isinstance(stmt, (ast.Assign, ast.AnnAssign)):
                targets = stmt.targets if isinstance(stmt, ast.Assign) else [stmt.target]
                target = next((t for t in targets if isinstance(t, ast.Name) and t.id == name), None)
                if target is not None and stmt.value is not None:
                    value = self.expr(stmt.value, scope).edge('ASSIGN_FLOW', location(scope.module.source_id, stmt.value), location(scope.module.source_id, target))
            elif isinstance(stmt, (ast.Import, ast.ImportFrom)):
                alias = next((a for a in stmt.names if (a.asname or (a.name.split('.')[0] if isinstance(stmt, ast.Import) else a.name)) == name), None)
                if alias:
                    base = import_base(scope.module, stmt) if isinstance(stmt, ast.ImportFrom) else None
                    value = self.imported(base + '.' + alias.name, stmt, scope) if base and self.cross else unknown('missing_module')
            elif any(isinstance(n, ast.Name) and n.id == name and isinstance(n.ctx, (ast.Store, ast.Del)) for n in ast.walk(stmt)):
                value = unknown('unsupported_control_flow')
        return value

    def imported(self, target: str, node: ast.AST, scope: Scope) -> Witness:
        choices = [m for m in self.modules.values() if m.name and target.startswith(m.name + '.')]
        if not choices:
            return unknown('missing_module')
        length = max(len(m.name) for m in choices)
        choices = [m for m in choices if len(m.name) == length]
        if len(choices) != 1 or '.' in target[length + 1:]:
            return unknown('ambiguous_module')
        value = self.lookup(target[length + 1:], None, Scope(choices[0]))
        return value.edge('IMPORT_BINDING', value.last, location(scope.module.source_id, node)) if value.last else value

    def merge(self, values: tuple[Witness, ...]) -> Witness:
        if not values:
            return unknown('missing_return')
        alternatives = {}
        incomplete = False
        for witness in values:
            if isinstance(witness.value, Known):
                alternatives[witness.value.model_dump_json()] = Alternative(value=witness.value.value)
            else:
                incomplete |= isinstance(witness.value, Unknown)
                for item in witness.value.alternatives:
                    alternatives[Known(value=item.value).model_dump_json()] = Alternative(value=item.value)
        choices = tuple(alternatives.values())
        if len(choices) > self.budgets.value_candidates:
            return unknown('value_limit')
        value = (Unknown(reason='unknown_branch', alternatives=choices) if incomplete else
                 Known(value=choices[0].value) if len(choices) == 1 else
                 Ambiguous(alternatives=choices) if choices else Unknown(reason='missing_value'))
        provenance = {(v.key_type, v.origin) for v in values}
        key_type, origin = next(iter(provenance)) if len(provenance) == 1 else (None, None)
        return Witness(value, values[-1].last, frozenset(e for v in values for e in v.edges),
                       frozenset(n for v in values for n in v.nodes), key_type, origin)

    def actuals(self, node: ast.Call) -> tuple[list, dict] | None:
        args, kwargs = [], {}
        for item in node.args:
            if isinstance(item, ast.Starred):
                if not isinstance(item.value, (ast.List, ast.Tuple)) or any(isinstance(n, ast.Starred) for n in item.value.elts):
                    return None
                args.extend(item.value.elts)
            else:
                args.append(item)
        for item in node.keywords:
            pairs = [(item.arg, item.value)] if item.arg else list(zip(item.value.keys, item.value.values)) if isinstance(item.value, ast.Dict) else None
            if pairs is None:
                return None
            for key, value in pairs:
                key = key.value if isinstance(key, ast.Constant) and type(key.value) is str else key
                if type(key) is not str or key in kwargs:
                    return None
                kwargs[key] = value
        return (args, kwargs) if len(args) + len(kwargs) <= 64 else None

    def enter(self, node: ast.Call, caller: Scope, target: str) -> Scope:
        module, function, name = self.functions[target]
        if caller.blocked or function.decorator_list or isinstance(function, ast.AsyncFunctionDef) or name.count('.') > 1:
            return Scope(module, name, blocked=True)
        if len(caller.chain) >= self.budgets.call_depth or location(caller.module.source_id, node) in caller.chain:
            return Scope(module, name, blocked=True)
        actual = self.actuals(node)
        if actual is None or function.args.vararg or function.args.kwarg:
            return Scope(module, name, blocked=True)
        args, kwargs = actual
        positional = [a.arg for a in (*function.args.posonlyargs, *function.args.args)]
        only = {a.arg for a in function.args.posonlyargs}
        names = positional + [a.arg for a in function.args.kwonlyargs]
        if len(args) > len(positional) or set(kwargs) & (only | set(positional[:len(args)])) or set(kwargs) - set(names):
            return Scope(module, name, blocked=True)
        expressions = dict(zip(positional, args)) | kwargs
        defaults = dict(zip(positional[len(positional) - len(function.args.defaults):], function.args.defaults))
        defaults.update((a.arg, d) for a, d in zip(function.args.kwonlyargs, function.args.kw_defaults) if d is not None)
        if set(names) - set(expressions) - set(defaults):
            return Scope(module, name, blocked=True)
        parameters = {a.arg: a for a in (*function.args.posonlyargs, *function.args.args, *function.args.kwonlyargs)}
        projected = []
        for parameter in names:
            if parameter not in expressions and any(isinstance(n, ast.Call) for n in ast.walk(defaults[parameter])):
                value = unknown('dynamic_default')
            else:
                value = self.expr(expressions[parameter], caller) if parameter in expressions else self.expr(defaults[parameter], Scope(module))
            source = value.last or location(caller.module.source_id, node)
            value = value.edge('CALLS', location(caller.module.source_id, node), location(module.source_id, function))
            value = value.edge('ARGUMENT_FLOW', source, location(module.source_id, parameters[parameter]))
            projected.append((parameter, value))
        cutoff = (node.lineno, node.col_offset) if caller.name == '<module>' else caller.cutoff
        return Scope(module, name, tuple(projected), (*caller.chain, location(caller.module.source_id, node)),
                     cutoff if caller.module == module else None)

    def call(self, node: ast.Call, scope: Scope) -> Witness:
        span = location(scope.module.source_id, node)
        indexed = self.calls.get(span)
        target = indexed[1].target if indexed else None
        rule = RULES.get(target)
        if rule and rule.library != 'PyJWT':
            bound = self.api_arguments(node, scope, rule.parameters, rule.optional, rule.keyword_only)
            if bound is None:
                return unknown('invalid_argument_binding')
            if rule.key_type:
                return Witness(Known(value=rule.algorithm or 'generic_key_type'), span,
                               frozenset({('KEY_TYPE_FLOW', span, span)}), frozenset({span}), rule.key_type, span)
            if target.startswith('Crypto.Signature.'):
                base = bound['key' if 'key' in bound else 'rsa_key']
                family = base.key_type.split(':')[1] if base.key_type and base.key_type.startswith('pycrypto:') else None
                scheme = target.split('.')[-2]
                if family in ({'DSA', 'ECC'} if scheme == 'DSS' else {'RSA'}):
                    if scheme == 'DSS' and (not isinstance(bound['mode'].value, Known) or bound['mode'].value.value not in ('fips-186-3', 'deterministic-rfc6979')):
                        return unknown('unsupported_signer_mode')
                    return replace(base, value=Known(value='generic_key_type'), key_type='signer:' + scheme + ':' + family).edge('KEY_TYPE_FLOW', base.origin, span)
        if isinstance(node.func, ast.Attribute) and node.func.attr in ('public_key', 'publickey') and not node.args and not node.keywords:
            base = self.expr(node.func.value, scope)
            family = base.key_type.split(':')[0] if base.key_type else None
            if family in ('RSA', 'EC', 'Ed25519', 'X25519'):
                return replace(base, key_type=family + ':public').edge('KEY_TYPE_FLOW', base.last, span)
        if target in self.functions:
            child = self.enter(node, scope, target)
            if child.blocked:
                return unknown('unsupported_function')
            function = self.functions[target][1]
            if any(isinstance(n, (ast.Yield, ast.YieldFrom)) for n in ast.walk(function)):
                return unknown('generator_return')
            value = self.returns(function.body, child)
            if isinstance(value.value, Unknown):
                return value
            origin = value.last
            return value.edge('CALLS', span, location(child.module.source_id, function)).edge('RETURN_FLOW', origin, span)
        return unknown('external_or_dynamic_return')

    def returns(self, body: list, scope: Scope) -> Witness:
        for i, stmt in enumerate(body):
            if isinstance(stmt, ast.Return):
                return self.expr(stmt.value, scope) if stmt.value else unknown('missing_return')
            if isinstance(stmt, ast.If):
                test = self.expr(stmt.test, scope).value
                arms = (stmt.body, stmt.orelse)
                if isinstance(test, Known) and type(test.value) is bool:
                    arms = (arms[0 if test.value else 1],)
                return self.merge(tuple(self.returns([*arm, *body[i + 1:]], scope) for arm in arms))
            if isinstance(stmt, (ast.For, ast.While, ast.Try, ast.With, ast.Match)):
                return unknown('unsupported_control_flow')
        return unknown('missing_return')

    def api_arguments(self, node: ast.Call, scope: Scope, parameters: tuple, optional: tuple = (), keyword_only: tuple = ()) -> dict | None:
        actual = self.actuals(node)
        if actual is None:
            return None
        args, kwargs = actual
        names = (*parameters, *optional)
        positional = tuple(n for n in names if n not in keyword_only)
        if len(args) > len(positional) or set(kwargs) & set(positional[:len(args)]) or set(kwargs) - set(names):
            return None
        expressions = dict(zip(positional, args)) | kwargs
        if set(parameters) - set(expressions):
            return None
        values = {name: self.expr(expressions[name], scope) if name in expressions else unknown('unspecified_api_parameter') for name in names}
        def project(value: Witness) -> Witness:
            if value.items is not None:
                return replace(value, items=tuple(project(v) for v in value.items))
            return value.edge('ARGUMENT_FLOW', value.last or location(scope.module.source_id, node), location(scope.module.source_id, node))
        indexed = self.calls.get(location(scope.module.source_id, node))
        return {name: project(value) for name, value in values.items()} if indexed and indexed[1].target in ('jwt.encode', 'jwt.decode') else values

    def context(self, sink: Span, chain: tuple[Span, ...]) -> Scope | None:
        indexed = self.calls.get(sink)
        if indexed is None:
            return None
        scope = Scope(indexed[0], indexed[1].scope)
        if chain:
            first = self.calls.get(chain[0])
            if not first or first[1].scope != '<module>':
                return None
            scope = Scope(first[0])
            for call_span in chain:
                entry = self.calls.get(call_span)
                if not entry or entry[0] != scope.module or entry[1].scope != scope.name or entry[1].target not in self.functions:
                    return None
                scope = self.enter(self.nodes[call_span], scope, entry[1].target)
        if scope.module != indexed[0] or scope.name != indexed[1].scope:
            return None
        if not chain and scope.name != '<module>':
            scope = replace(scope, blocked=True)
        return scope

    def lexical_conditions(self, span: Span) -> tuple[str, ...]:
        module, call = self.calls[span]
        function = self.functions.get(module.source_id + ':' + call.scope)
        body = function[1].body if function else module.tree.body
        conditions = []
        point = span.start_line, span.start_col
        while body:
            stmt = next((n for n in body if (n.lineno, n.col_offset) <= point < (n.end_lineno, n.end_col_offset)), None)
            if isinstance(stmt, ast.If):
                flag = any((n.lineno, n.col_offset) <= point < (n.end_lineno, n.end_col_offset) for n in stmt.body)
                conditions.append(stable_id('condition', [location(module.source_id, stmt.test).model_dump(mode='json'), flag]))
                body = stmt.body if flag else stmt.orelse
            else:
                break
        return tuple(conditions)

    def api_imports(self, span: Span) -> frozenset[Edge]:
        module, call = self.calls[span]
        target = call.target
        if target not in RULES:
            return frozenset()
        head = call.expression.split('.')[0]
        scope = call.scope
        while True:
            bindings = [s for s in module.symbols if s.scope == scope and s.name == head]
            if bindings:
                if len(bindings) != 1 or bindings[0].kind != 'import':
                    return frozenset()
                return frozenset({('IMPORT_BINDING', bindings[0].location, span)})
            if scope == '<module>':
                return frozenset()
            scope = scope.rsplit('.', 1)[0]
