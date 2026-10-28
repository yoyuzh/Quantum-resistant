"""Demand-driven, finite backward evaluation over the collected AST index."""
from __future__ import annotations

import ast
from dataclasses import dataclass, replace
from typing import Callable

from original_a.deep_analysis.abstract_values import FactStore, SemanticLimit
from original_a.deep_analysis.argument_binding import Signature, actuals, bind_arguments, function_signature
from original_a.deep_analysis.discovery import CallSite, Discovery, Function
from original_a.deep_analysis.identity import stable_id
from original_a.deep_analysis.models import Budgets, Known, Span, Unknown
from original_a.deep_analysis.semantic_models import Fact
from original_a.deep_analysis.snapshot import Snapshot
from original_a.deep_analysis.symbol_index import Module, dotted, has_dynamic_namespace, import_base, location

SEMANTICS_VERSION = 'bounded-backward-1'


class SliceLimit(Exception):
    pass


@dataclass(frozen=True)
class Frame:
    module: Module
    scope: str = '<module>'
    parameters: tuple[tuple[str, Fact], ...] = ()
    chain: tuple[Span, ...] = ()
    conditions: tuple[str, ...] = ()
    blocked: str | None = None
    global_cutoff: tuple[int, int] | None = None
    parameter_identity: tuple[tuple[str, str], ...] | None = None


def position(node: ast.AST) -> tuple[int, int]:
    return getattr(node, 'lineno'), getattr(node, 'col_offset')


def contains(node: ast.AST, point: tuple[int, int]) -> bool:
    return position(node) <= point < (getattr(node, 'end_lineno'), getattr(node, 'end_col_offset'))


def assigned_names(node: ast.AST) -> set[str]:
    names, pending = set(), [node]
    while pending:
        current = pending.pop()
        if isinstance(current, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            names.add(current.name)
            continue
        if isinstance(current, ast.Name) and isinstance(current.ctx, (ast.Store, ast.Del)):
            names.add(current.id)
        if isinstance(current, (ast.Import, ast.ImportFrom)):
            names.update(a.asname or (a.name.split('.')[0] if isinstance(current, ast.Import) else a.name) for a in current.names)
        if isinstance(current, (ast.Global, ast.Nonlocal)):
            names.update(current.names)
        if isinstance(current, (ast.MatchAs, ast.MatchStar)) and current.name:
            names.add(current.name)
        if isinstance(current, ast.MatchMapping) and current.rest:
            names.add(current.rest)
        if isinstance(current, ast.ExceptHandler) and current.name:
            names.add(current.name)
        pending.extend(ast.iter_child_nodes(current))
    return names


class Evaluator:
    def __init__(self, snapshot: Snapshot, discovery: Discovery, budgets: Budgets,
                 checkpoint: Callable[[], object], semantics: str = SEMANTICS_VERSION, rules: str = 'api-candidates-1'):
        self.snapshot, self.discovery, self.budgets = snapshot, discovery, budgets
        self.checkpoint, self.semantics = checkpoint, semantics
        self.versions = (semantics, rules, discovery.index.version, discovery.index.host_python, discovery.index.target_python)
        self.store = FactStore(budgets)
        self.store.nodes_used = discovery.index.nodes_used
        self.store.edges_used = discovery.index.edges_used
        self.store.structure_bytes = discovery.index.structure_bytes
        self.cache: dict[str, Fact] = {}
        self.active: set[str] = set()
        self.touched: set[str] = set()
        self.hits = 0
        self.contexts: dict[str, set[str]] = {}
        self.modules = {m.source_id: m for m in discovery.index.modules}
        self.cross = snapshot.identity.path_fidelity == 'relative_paths' and len(snapshot.identity.package_roots) == 1

    def frame_key(self, frame: Frame) -> str:
        return stable_id('frame', [self.snapshot.identity.snapshot_id, self.versions, frame.module.source_id, frame.scope,
                                   [s.model_dump(mode='json') for s in frame.chain],
                                   frame.parameter_identity if frame.parameter_identity is not None else [(n, f.fact_id) for n, f in frame.parameters],
                                   frame.conditions, frame.blocked, frame.global_cutoff])

    def touch(self, key: str) -> None:
        self.checkpoint()
        self.touched.add(key)
        if len(self.touched) > self.budgets.slice_nodes:
            raise SliceLimit('slice_limit')

    def memo(self, key: str, compute: Callable[[], Fact]) -> Fact:
        self.touch(key)
        if key in self.active:
            return self.store.unknown('recursive_value')
        if key in self.cache:
            self.hits += 1
            return self.cache[key]
        if len(self.active) >= self.budgets.ast_depth:
            raise SliceLimit('evaluation_depth_limit')
        self.active.add(key)
        try:
            fact = compute()
            # Cache entries are separately metered references, not unbounded hidden storage.
            if len(self.cache) >= self.budgets.index_nodes:
                raise SemanticLimit('summary_limit')
            self.store.charge([key, fact.fact_id], node=True)
            self.cache[key] = fact
            return fact
        finally:
            self.active.remove(key)

    def edge(self, fact: Fact, kind: str, source: ast.AST | Span, destination: ast.AST | Span,
             frame: Frame, parameter: str | None = None) -> Fact:
        origin = source if isinstance(source, Span) else location(frame.module.source_id, source)
        target = destination if isinstance(destination, Span) else location(frame.module.source_id, destination)
        return self.store.flow(fact, kind, origin, target, self.frame_key(frame), parameter)

    def expression(self, node: ast.expr, frame: Frame, *, static_default: bool = False) -> Fact:
        span = location(frame.module.source_id, node)
        key = stable_id('expression', [self.frame_key(frame), span.model_dump(mode='json'), static_default])
        return self.memo(key, lambda: self._expression(node, frame, static_default))

    def _expression(self, node: ast.expr, frame: Frame, static_default: bool) -> Fact:
        if frame.blocked:
            return self.store.unknown(frame.blocked, conditions=frame.conditions)
        if has_dynamic_namespace(frame.module, frame.scope):
            return self.store.unknown('dynamic_namespace')
        if any(s.kind == 'import' and s.name == '*' for s in frame.module.symbols):
            return self.store.unknown('wildcard_import')
        if isinstance(node, ast.Constant):
            fact = self.store.literal(node.value, frame.conditions)
            return self.edge(fact, 'LITERAL', node, node, frame)
        if isinstance(node, ast.Name):
            return self.lookup(node.id, frame, node, static_default=static_default)
        if isinstance(node, ast.Attribute):
            return self.imported_attribute(node, frame, static_default)
        if isinstance(node, ast.IfExp):
            truth = self.truth(node.test, frame)
            options = [(node.body, True), (node.orelse, False)] if truth is None else [(node.body if truth else node.orelse, truth)]
            return self.store.merge(self.expression(expr, self.branch(frame, node.test, flag), static_default=static_default) for expr, flag in options)
        if isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.UAdd, ast.USub)) and isinstance(node.operand, ast.Constant) and type(node.operand.value) in (int, float):
            value = node.operand.value if isinstance(node.op, ast.UAdd) else -node.operand.value
            return self.edge(self.store.literal(value, frame.conditions), 'LITERAL', node, node, frame)
        if isinstance(node, (ast.List, ast.Tuple)):
            if len(node.elts) > 64 or any(isinstance(e, ast.Starred) for e in node.elts):
                return self.store.unknown('container_limit')
            items = tuple(self.expression(n, frame, static_default=static_default) for n in node.elts)
            return self.store.fact(Unknown(reason='literal_container'), conditions=frame.conditions, items=items)
        if isinstance(node, ast.Call):
            if static_default:
                return self.store.unknown('dynamic_default')
            return self.call_result(node, frame)
        # Arithmetic, concatenation and arbitrary transforms are derived, not equal to inputs.
        return self.edge(self.store.unknown('unsupported_transform', conditions=frame.conditions), 'DERIVED', node, node, frame)

    def branch(self, frame: Frame, test: ast.expr, truth: bool) -> Frame:
        condition = stable_id(f'condition:{str(truth).lower()}', [location(frame.module.source_id, test).model_dump(mode='json')])
        if len(frame.conditions) >= 16:
            return replace(frame, blocked='condition_limit')
        return replace(frame, conditions=(*frame.conditions, condition))

    def truth(self, node: ast.expr, frame: Frame) -> bool | None:
        fact = self.expression(node, frame)
        return fact.value.value if isinstance(fact.value, Known) and type(fact.value.value) is bool else None

    def function(self, frame: Frame) -> Function | None:
        return self.discovery.functions.get(frame.module.source_id + ':' + frame.scope)

    def lookup(self, name: str, frame: Frame, before: ast.AST | None,
               *, static_default: bool = False) -> Fact:
        cutoff = position(before) if before else None
        key = stable_id('lookup', [self.frame_key(frame), name, cutoff, static_default])
        return self.memo(key, lambda: self._lookup(name, frame, before, static_default))

    def _lookup(self, name: str, frame: Frame, before: ast.AST | None, static_default: bool) -> Fact:
        if frame.blocked:
            return self.store.unknown(frame.blocked)
        if any(s.name == name and s.kind == 'global_taint' for s in frame.module.symbols):
            return self.store.unknown('dynamic_scope_write')
        function = self.function(frame)
        body = function.node.body if function else frame.module.tree.body
        parameters = dict(frame.parameters)
        if name in parameters:
            initial = self.store.conditioned(parameters[name], frame.conditions)
        elif function and any(name in assigned_names(s) for s in body):
            initial = self.store.unknown('unbound_local', conditions=frame.conditions)
        elif function:
            global_frame = Frame(frame.module, conditions=frame.conditions)
            global_before = None
            if frame.global_cutoff:
                global_before = ast.Pass(lineno=frame.global_cutoff[0], col_offset=frame.global_cutoff[1],
                                         end_lineno=frame.global_cutoff[0], end_col_offset=frame.global_cutoff[1] + 1)
            return self.lookup(name, global_frame, global_before, static_default=static_default)
        else:
            initial = self.store.unknown('unbound_name', conditions=frame.conditions)
        fact = self.scan(name, body, frame, before, initial, static_default)
        if before is not None and isinstance(before, ast.Name):
            fact = self.edge(fact, 'ASSIGN_FLOW', fact.steps[-1].destination if fact.steps else before, before, frame, name)
        return fact

    def scan(self, name: str, body: list[ast.stmt], frame: Frame, before: ast.AST | None,
             initial: Fact, static_default: bool) -> Fact:
        current = initial
        point = position(before) if before else None
        for statement in body:
            self.checkpoint()
            if point is not None and position(statement) >= point:
                break
            inside = point is not None and contains(statement, point)
            if isinstance(statement, ast.If):
                if inside:
                    for branch, flag in ((statement.body, True), (statement.orelse, False)):
                        if any(contains(s, point) for s in branch):
                            return self.scan(name, branch, self.branch(frame, statement.test, flag), before, current, static_default)
                    break  # The point is inside the condition, before either body.
                truth = self.truth(statement.test, frame)
                options = [(statement.body, True), (statement.orelse, False)] if truth is None else [(statement.body if truth else statement.orelse, truth)]
                current = self.store.merge(self.scan(name, branch, self.branch(frame, statement.test, flag), None,
                                                     self.store.conditioned(current, self.branch(frame, statement.test, flag).conditions), static_default)
                                           for branch, flag in options)
                continue
            if inside:
                # The RHS is evaluated before this statement binds its targets.
                if isinstance(statement, (ast.Assign, ast.AnnAssign, ast.AugAssign, ast.Expr, ast.Return, ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                    break
                return self.store.unknown('unsupported_control_flow')
            if isinstance(statement, (ast.Assign, ast.AnnAssign)):
                targets = statement.targets if isinstance(statement, ast.Assign) else [statement.target]
                if any(isinstance(t, ast.Name) and t.id == name for t in targets):
                    current = self.expression(statement.value, frame, static_default=static_default) if statement.value is not None else self.store.unknown('missing_value')
                    target = next(t for t in targets if isinstance(t, ast.Name) and t.id == name)
                    current = self.edge(current, 'ASSIGN_FLOW', statement.value or statement, target, frame, name)
                elif name in assigned_names(statement):
                    current = self.store.unknown('unsupported_assignment')
            elif isinstance(statement, (ast.Import, ast.ImportFrom)):
                if name in assigned_names(statement):
                    current = self.imported_name(name, statement, frame, static_default)
            elif isinstance(statement, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                if name == statement.name:
                    current = self.store.unknown('definition_is_not_scalar')
            elif name in assigned_names(statement):
                current = self.store.unknown('unsupported_control_flow')
        return current

    def imported_name(self, name: str, node: ast.Import | ast.ImportFrom, frame: Frame, static_default: bool) -> Fact:
        if not self.cross or not isinstance(node, ast.ImportFrom):
            return self.store.unknown('cross_module_disabled' if not self.cross else 'module_is_not_scalar')
        base = import_base(frame.module, node)
        alias = next(a for a in node.names if (a.asname or a.name) == name)
        target = '.'.join((base, alias.name)) if base else None
        return self.imported_value(target, frame, node, static_default)

    def imported_attribute(self, node: ast.Attribute, frame: Frame, static_default: bool) -> Fact:
        expression = dotted(node)
        if not expression or not self.cross:
            return self.store.unknown('unsupported_attribute')
        head, suffix = expression.split('.', 1)
        if any(s.kind == 'global_taint' and s.name == head for s in frame.module.symbols):
            return self.store.unknown('dynamic_scope_write')
        scope = frame.scope
        while True:
            bindings = [s for s in frame.module.symbols if s.scope == scope and s.name == head]
            if bindings:
                if (len(bindings) == 1 and bindings[0].kind == 'import' and bindings[0].target
                        and (bindings[0].location.start_line, bindings[0].location.start_col) < (frame.global_cutoff if scope == '<module>' and frame.global_cutoff else position(node))):
                    return self.imported_value(bindings[0].target + '.' + suffix, frame, node, static_default)
                break
            if scope == '<module>':
                break
            scope = scope.rsplit('.', 1)[0]
        return self.store.unknown('unsupported_attribute')

    def imported_value(self, target: str | None, frame: Frame, node: ast.AST, static_default: bool) -> Fact:
        selected = [m for m in self.modules.values() if m.name and target and target.startswith(m.name + '.')]
        if not selected:
            return self.store.unknown('missing_module')
        length = max(len(m.name or '') for m in selected)
        selected = [m for m in selected if len(m.name or '') == length]
        if len(selected) != 1:
            return self.store.unknown('ambiguous_module')
        module = selected[0]
        name = target[length + 1:]
        if '.' in name:
            return self.store.unknown('unsupported_attribute')
        fact = self.lookup(name, Frame(module), None, static_default=static_default)
        if not fact.steps and not module.tree.body:
            return fact
        origin = fact.steps[-1].destination if fact.steps else location(module.source_id, module.tree.body[0])
        return self.edge(fact, 'IMPORT_BINDING', origin, node, frame, name)

    def bind(self, site: CallSite, function: Function, caller: Frame) -> Frame:
        signature = function_signature(function.node)
        default_frame = Frame(function.module, conditions=caller.conditions)
        bound, reason = bind_arguments(site.node, signature, self.store,
                                       lambda node: self.expression(node, caller),
                                       lambda node: self.expression(node, default_frame, static_default=True))
        chain = (*caller.chain, site.span)
        if len(chain) > self.budgets.call_depth:
            reason = 'call_depth_limit'
            chain = chain[:self.budgets.call_depth]
        if function.node.decorator_list or isinstance(function.node, ast.AsyncFunctionDef):
            reason = 'unsupported_function'
        if function.scope.count('.') > 1:
            reason = 'unsupported_closure'
        cutoff = None
        if caller.module == function.module:
            cutoff = position(site.node) if caller.scope == '<module>' else caller.global_cutoff
        frame = Frame(function.module, function.scope, tuple(sorted(bound.items())), chain, caller.conditions,
                      caller.blocked or reason, cutoff, tuple((n, f.fact_id) for n, f in sorted(bound.items())))
        context_key = self.frame_key(frame)
        contexts = self.contexts.setdefault(function.identity, set())
        if context_key not in contexts:
            if len(contexts) >= self.budgets.contexts_per_function:
                frame = replace(frame, blocked='context_limit')
            else:
                self.store.charge([function.identity, context_key])
                contexts.add(context_key)
        params = {a.arg: a for a in (*function.node.args.posonlyargs, *function.node.args.args, *function.node.args.kwonlyargs)}
        projected = []
        for name, fact in frame.parameters:
            if frame.blocked:
                fact = self.store.unknown(frame.blocked)
            else:
                origin = fact.steps[-1].destination if fact.steps else site.span
                fact = self.edge(fact, 'CALLS', site.span, location(function.module.source_id, function.node), frame)
                fact = self.edge(fact, 'ARGUMENT_FLOW', origin, location(function.module.source_id, params[name]), frame, name)
            projected.append((name, fact))
        return replace(frame, parameters=tuple(projected))

    def call_result(self, node: ast.Call, frame: Frame) -> Fact:
        site = self.discovery.calls.get(location(frame.module.source_id, node))
        function = self.discovery.functions.get(site.call.target) if site and site.call.target else None
        if not function:
            return self.edge(self.store.unknown(site.call.reason or 'external_or_dynamic_return' if site else 'dynamic_call'), 'CALLS', node, node, frame)
        if any(span == site.span for span in frame.chain):
            return self.store.unknown('recursive_call')
        child = self.bind(site, function, frame)
        if child.blocked:
            return self.store.unknown(child.blocked)
        # A generator's return value is not its call result.
        pending = list(function.node.body)
        while pending:
            item = pending.pop()
            if isinstance(item, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef, ast.Lambda)):
                continue
            if isinstance(item, (ast.Yield, ast.YieldFrom)):
                return self.store.unknown('generator_return')
            pending.extend(ast.iter_child_nodes(item))
        facts = self.return_paths(function.node.body, child)
        fact = self.store.merge(facts)
        fact = self.edge(fact, 'CALLS', site.span, location(function.module.source_id, function.node), child)
        if any(isinstance(f.value, Unknown) and f.value.reason == 'missing_return' for f in facts):
            return fact
        origin = fact.steps[-2].destination if len(fact.steps) > 1 else location(function.module.source_id, function.node)
        return self.edge(fact, 'RETURN_FLOW', origin, site.span, child)

    def return_paths(self, body: list[ast.stmt], frame: Frame) -> list[Fact]:
        for i, statement in enumerate(body):
            self.touch(stable_id('return-node', [self.frame_key(frame), location(frame.module.source_id, statement).model_dump(mode='json')]))
            if isinstance(statement, ast.Return):
                if statement.value is None:
                    return [self.store.unknown('missing_return')]
                return [self.expression(statement.value, frame)]
            if isinstance(statement, ast.If):
                truth = self.truth(statement.test, frame)
                options = [(statement.body, True), (statement.orelse, False)] if truth is None else [(statement.body if truth else statement.orelse, truth)]
                result = []
                for branch, flag in options:
                    result.extend(self.return_paths([*branch, *body[i + 1:]], self.branch(frame, statement.test, flag)))
                    if len(result) > max(1, self.budgets.value_candidates):
                        return [self.store.unknown('value_limit')]
                return result
            if isinstance(statement, (ast.For, ast.AsyncFor, ast.While, ast.Try, ast.With, ast.AsyncWith, ast.Match, ast.Raise)):
                return [self.store.unknown('unsupported_control_flow')]
        return [self.store.unknown('missing_return')]

    def sink_arguments(self, site: CallSite, frame: Frame) -> tuple[dict[str, Fact], str | None]:
        if site.call.target == 'jwt.encode':
            optional = ('algorithm', 'headers', 'json_encoder', 'sort_headers')
            signature = Signature(('payload', 'key', *optional), defaults=tuple((n, self.store.unknown('unspecified_api_parameter')) for n in optional))
        elif site.call.target == 'jwt.decode':
            optional = ('key', 'algorithms', 'options', 'verify', 'detached_payload', 'audience', 'subject', 'issuer', 'leeway')
            signature = Signature(('jwt', *optional), defaults=tuple((n, self.store.unknown('unspecified_api_parameter')) for n in optional))
        else:
            positional, keywords, reason = actuals(site.node)
            if reason:
                return {'algorithm': self.store.unknown(reason)}, reason
            arguments = {f'arg{i}': self.expression(n, frame) for i, n in enumerate(positional)}
            arguments.update((name, self.expression(node, frame)) for name, node in keywords.items())
            return arguments, site.call.reason
        return bind_arguments(site.node, signature, self.store, lambda node: self.expression(node, frame),
                              lambda node: self.expression(node, frame, static_default=True))
