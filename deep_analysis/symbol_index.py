"""Bounded AST structure index. CALLS targets are not value-flow proofs."""
from __future__ import annotations

import ast
from dataclasses import dataclass, field, replace
import json
import sys
from typing import Callable

from deep_analysis.models import Budgets, Coverage, CoverageCount, Diagnostic, Span
from deep_analysis.snapshot import Snapshot


@dataclass(frozen=True)
class Symbol:
    name: str
    kind: str
    scope: str
    location: Span
    target: str | None = None


@dataclass(frozen=True)
class Call:
    scope: str
    expression: str
    location: Span
    target: str | None
    reason: str | None


@dataclass(frozen=True)
class Module:
    source_id: str
    name: str | None
    path: str
    symbols: tuple[Symbol, ...]
    calls: tuple[Call, ...]
    tree: ast.Module = field(repr=False, compare=False)


@dataclass(frozen=True)
class Index:
    modules: tuple[Module, ...]
    diagnostics: tuple[Diagnostic, ...]
    coverage: Coverage
    host_python: str
    target_python: str
    version: str = 'ast-index-1'
    nodes_used: int = 0
    edges_used: int = 0
    structure_bytes: int = 0


def location(source_id: str, node: ast.AST) -> Span:
    return Span(source_id=source_id, start_line=getattr(node, 'lineno'), start_col=getattr(node, 'col_offset'),
                end_line=getattr(node, 'end_lineno'), end_col=getattr(node, 'end_col_offset'))


def module_name(path: str, root: str) -> str | None:
    prefix = '' if root == '.' else root + '/'
    if not path.startswith(prefix):
        return None
    parts = path[len(prefix):-3].split('/')
    if parts[-1] == '__init__':
        parts.pop()
    if not parts or any(not p.isidentifier() for p in parts):
        return None
    return '.'.join(parts)


def dotted(node: ast.AST) -> str | None:
    parts = []
    while isinstance(node, ast.Attribute):
        parts.append(node.attr)
        node = node.value
    if not isinstance(node, ast.Name):
        return None
    return '.'.join([node.id, *reversed(parts)])


def import_base(module: Module, node: ast.ImportFrom) -> str | None:
    if not node.level:
        return node.module or ''
    if module.name is None:
        return None
    package = module.name.split('.') if module.path.endswith('/__init__.py') else module.name.split('.')[:-1]
    if node.level > len(package):
        return None
    return '.'.join(package[:len(package) - node.level + 1] + ([node.module] if node.module else []))


def collect_symbols(source_id: str, tree: ast.Module, checkpoint: Callable[[], object]) -> tuple[Symbol, ...]:
    symbols: list[Symbol] = []
    pending: list[tuple[ast.AST, str, bool]] = [(tree, '<module>', False)]
    while pending:
        checkpoint()
        node, scope, conditional = pending.pop()
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            kind = 'class' if isinstance(node, ast.ClassDef) else 'function'
            target = None if conditional or node.decorator_list else scope + '.' + node.name
            symbols.append(Symbol(node.name, kind, scope, location(source_id, node), target))
            inner = scope + '.' + node.name
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                args = [*node.args.posonlyargs, *node.args.args, *node.args.kwonlyargs]
                args += [a for a in (node.args.vararg, node.args.kwarg) if a]
                for arg in args:
                    symbols.append(Symbol(arg.arg, 'parameter', inner, location(source_id, arg)))
            pending.extend((child, inner, False) for child in reversed(node.body))
            extras = list(node.decorator_list)
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                extras += [*node.args.defaults, *[d for d in node.args.kw_defaults if d]]
            else:
                extras += node.bases + [k.value for k in node.keywords]
            pending.extend((child, scope, True) for child in reversed(extras))
            continue
        if isinstance(node, (ast.Import, ast.ImportFrom)):
            for alias in node.names:
                name = alias.asname or (alias.name.split('.')[0] if isinstance(node, ast.Import) else alias.name)
                symbols.append(Symbol(name, 'import', scope, location(source_id, node), None if conditional else (alias.name.split('.')[0] if isinstance(node, ast.Import) and not alias.asname else alias.name)))
        if isinstance(node, ast.Name) and isinstance(node.ctx, (ast.Store, ast.Del)):
            symbols.append(Symbol(node.id, 'write', scope, location(source_id, node)))
        if isinstance(node, ast.Attribute) and isinstance(node.ctx, (ast.Store, ast.Del)):
            name = dotted(node)
            if name:
                symbols.append(Symbol(name.split('.')[0], 'write', scope, location(source_id, node)))
                symbols.append(Symbol(name.split('.')[0], 'global_taint', '<module>', location(source_id, node)))
        if isinstance(node, ast.ExceptHandler) and node.name:
            symbols.append(Symbol(node.name, 'write', scope, location(source_id, node)))
        if isinstance(node, (ast.Global, ast.Nonlocal)):
            for name in node.names:
                symbols.append(Symbol(name, 'dynamic_scope', scope, location(source_id, node)))
                symbols.append(Symbol(name, 'global_taint', '<module>', location(source_id, node)))
        if isinstance(node, ast.Call) and dotted(node.func) in ('exec', 'eval', 'globals', 'locals', 'setattr', 'delattr', 'vars'):
            symbols.append(Symbol('*', 'dynamic_namespace', scope, location(source_id, node)))
        if isinstance(node, (ast.MatchAs, ast.MatchStar)) and node.name:
            symbols.append(Symbol(node.name, 'write', scope, location(source_id, node)))
        if isinstance(node, ast.MatchMapping) and node.rest:
            symbols.append(Symbol(node.rest, 'write', scope, location(source_id, node)))
        if isinstance(node, ast.Subscript) and isinstance(node.ctx, (ast.Store, ast.Del)):
            base = node.value
            while isinstance(base, (ast.Subscript, ast.Attribute)):
                base = base.value
            if isinstance(base, ast.Name):
                symbols.append(Symbol(base.id, 'global_taint', '<module>', location(source_id, node)))
        if isinstance(node, (ast.Lambda, ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)):
            for child in ast.walk(node):
                if isinstance(child, ast.NamedExpr) and isinstance(child.target, ast.Name):
                    symbols.append(Symbol(child.target.id, 'write', scope, location(source_id, child)))
            continue  # Separate unsupported scopes must never borrow a module binding.
        branch = conditional or isinstance(node, (ast.If, ast.Try, ast.For, ast.AsyncFor, ast.While, ast.Match, ast.With, ast.AsyncWith))
        pending.extend((child, scope, branch) for child in reversed(list(ast.iter_child_nodes(node))))
    return tuple(symbols)


def resolve(name: str | None, scope: str, module: Module, modules: list[Module], cross_module: bool,
            seen: tuple[tuple[str, str], ...] = ()) -> tuple[str | None, str | None]:
    if any(s.kind == 'dynamic_namespace' for s in module.symbols):
        return None, 'dynamic_namespace'
    if not name:
        return None, 'dynamic_call'
    head, *rest = name.split('.')
    if any(s.name == head and s.kind == 'global_taint' for s in module.symbols):
        return None, 'dynamic_scope_write'
    current = scope
    while True:
        if any(s.name == '*' and s.scope == current for s in module.symbols):
            return None, 'wildcard_import'
        bindings = [s for s in module.symbols if s.scope == current and s.name == head]
        if bindings:
            if len(bindings) != 1 or bindings[0].target is None:
                return None, 'shadowed_or_dynamic_binding'
            binding = bindings[0]
            binding_target = binding.target
            if binding_target is None:
                return None, 'shadowed_or_dynamic_binding'
            if binding.kind == 'function' and not rest:
                return module.source_id + ':' + binding_target, None
            if binding.kind != 'import':
                return None, 'unsupported_receiver'
            target = '.'.join([binding_target, *rest])
            local = [m for m in modules if m.name and (target == m.name or target.startswith(m.name + '.'))]
            if local:
                if not cross_module:
                    return None, 'cross_module_disabled'
                best = max(len(m.name or '') for m in local)
                selected = [m for m in local if len(m.name or '') == best]
                if len(selected) != 1:
                    return None, 'ambiguous_module'
                other = selected[0]
                suffix = target[len(other.name or ''):].lstrip('.')
                key = (other.source_id, suffix)
                if not suffix or key in seen or len(seen) >= 20:
                    return None, 'module_or_import_cycle'
                target, reason = resolve(suffix, '<module>', other, modules, cross_module, (*seen, key))
                return target, 'missing_module' if reason == 'unbound_name' else reason
            if head == '*' or any(s.name == '*' and s.scope == current for s in module.symbols):
                return None, 'wildcard_import'
            # A collected package of this name takes precedence over installed libraries.
            top = target.split('.')[0]
            if any(m.name and m.name.split('.')[0] == top for m in modules):
                return None, 'missing_module'
            if any(m.path.split('/')[-1] == top + '.py' or top in m.path.split('/')[:-1] for m in modules):
                return None, 'local_library_collision'
            if top in ('jwt', 'cryptography', 'Crypto'):
                return target, None
            return None, 'missing_module'
        if any(s.name == '*' and s.scope == current for s in module.symbols):
            return None, 'wildcard_import'
        if current == '<module>':
            return None, 'unbound_name'
        current = current.rsplit('.', 1)[0]


def index_calls(module: Module, modules: list[Module], cross_module: bool,
                checkpoint: Callable[[], object]) -> tuple[Call, ...]:
    calls: list[Call] = []
    pending: list[tuple[ast.AST, str]] = [(module.tree, '<module>')]
    while pending:
        checkpoint()
        node, scope = pending.pop()
        if isinstance(node, ast.Call):
            expression = dotted(node.func)
            target, reason = resolve(expression, scope, module, modules, cross_module)
            calls.append(Call(scope, expression or '<dynamic>', location(module.source_id, node), target, reason))
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            inner = scope + '.' + node.name
            if isinstance(node, ast.ClassDef):
                continue  # Class/method dispatch is indexed as symbols; calls need later receiver proof.
            pending.extend((child, inner) for child in reversed(node.body))
            continue
        if isinstance(node, (ast.Lambda, ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)):
            continue
        pending.extend((child, scope) for child in reversed(list(ast.iter_child_nodes(node))))
    return tuple(calls)


def build_index(snapshot: Snapshot, *, budgets: Budgets | None = None,
                target_minor: int = 10, checkpoint: Callable[[], object] = lambda: None) -> Index:
    budgets = budgets or Budgets()
    if not 10 <= target_minor <= sys.version_info.minor:
        raise ValueError('目标语法必须为3.10至宿主版本')
    modules, diagnostics = [], list(snapshot.diagnostics)
    roots = snapshot.identity.package_roots
    cross = snapshot.identity.path_fidelity == 'relative_paths' and len(roots) == 1
    nodes = edges = size = 0
    for source in snapshot.logical.sources:
        checkpoint()
        identity = source.identity
        try:
            tree = ast.parse(source.content, filename=identity.relative_path, feature_version=(3, target_minor))
            stack: list[tuple[ast.AST, int]] = [(tree, 0)]
            count = 0
            while stack:
                checkpoint()
                node, depth = stack.pop()
                count += 1
                if count > budgets.ast_nodes or depth > budgets.ast_depth:
                    raise OverflowError('ast_limit')
                stack.extend((child, depth + 1) for child in ast.iter_child_nodes(node))
        except (SyntaxError, ValueError, RecursionError, OverflowError) as exc:
            code = 'ast_limit' if isinstance(exc, (RecursionError, OverflowError)) else 'parse_failed'
            diagnostics.append(Diagnostic(code=code, message='模块解析失败或达到语法树上限',
                                          location=Span(source_id=identity.source_id, start_line=max(1, getattr(exc, 'lineno', 1) or 1), start_col=0,
                                                        end_line=max(1, getattr(exc, 'lineno', 1) or 1), end_col=1)))
            continue
        name = module_name(identity.relative_path, roots[0]) if cross else None
        symbols = collect_symbols(identity.source_id, tree, checkpoint)
        module = Module(identity.source_id, name, identity.relative_path, symbols, (), tree)
        # Resolve relative import strings only against a proved package identity.
        imports = {location(identity.source_id, n): n for n in ast.walk(tree) if isinstance(n, (ast.Import, ast.ImportFrom))}
        mapped = []
        for symbol in symbols:
            node = imports.get(symbol.location)
            target = symbol.target
            if isinstance(node, ast.ImportFrom) and target is not None:
                base = import_base(module, node)
                target = '.'.join([base, target]) if base else None
            mapped.append(replace(symbol, target=target))
        module = replace(module, symbols=tuple(mapped))
        ast_bytes = len(ast.dump(tree, include_attributes=True).encode('utf-8'))
        encoded = ast_bytes + len(json.dumps([(s.name, s.kind, s.scope, s.target, s.location.model_dump()) for s in mapped], ensure_ascii=False).encode('utf-8'))
        if nodes + count > budgets.index_nodes or size + encoded + len(source.content.encode('utf-8')) > budgets.structure_bytes:
            diagnostics.append(Diagnostic(code='index_limit', message='索引节点或结构体积达到上限'))
            break
        nodes += count
        size += encoded + len(source.content.encode('utf-8'))
        modules.append(module)
    output = []
    for module in modules:
        calls = index_calls(module, modules, cross, checkpoint)
        # Failed/excluded local modules still shadow an installed library of the same name.
        calls = tuple(replace(c, target=None, reason='unavailable_or_ambiguous_local')
                      if c.target and ':' not in c.target and any(
                          s.relative_path.split('/')[-1] == c.target.split('.')[0] + '.py'
                          or c.target.split('.')[0] in s.relative_path.split('/')[:-1]
                          for s in snapshot.identity.sources) else c for c in calls)
        encoded = len(json.dumps([(c.scope, c.expression, c.target, c.reason, c.location.model_dump()) for c in calls], ensure_ascii=False).encode('utf-8'))
        if edges + len(calls) > budgets.index_edges or size + encoded > budgets.structure_bytes:
            diagnostics.append(Diagnostic(code='index_limit', message='调用边或结构体积达到上限'))
            # Retain complete symbol facts but publish no half call set for this module.
            output.extend(modules[len(output):])
            break
        edges += len(calls)
        size += encoded
        output.append(replace(module, calls=calls))
    coverage = snapshot.identity.coverage.model_copy(update={
        'parsed': CoverageCount(count=len(modules), total=len(snapshot.logical.sources)),
        'partial': snapshot.identity.coverage.partial or bool(diagnostics),
        'gaps': tuple(sorted(set(snapshot.identity.coverage.gaps) | {d.code for d in diagnostics}))[:200],
    })
    return Index(tuple(output), tuple(diagnostics[:200]), coverage, sys.version.split()[0], f'3.{target_minor}',
                 nodes_used=nodes, edges_used=edges, structure_bytes=size)
