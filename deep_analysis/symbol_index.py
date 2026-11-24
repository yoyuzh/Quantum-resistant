"""Bounded AST structure index. CALLS targets are not value-flow proofs."""
from __future__ import annotations

import ast
from collections import defaultdict
from dataclasses import dataclass, field, replace
from functools import cached_property
import json
import sys
from typing import Callable, Iterable

from deep_analysis.models import Budgets, Coverage, CoverageCount, Diagnostic, Span
from deep_analysis.paths import path_names
from deep_analysis.snapshot import Snapshot
from deep_analysis.lazy_ast import AstCache
from scanner.parsing import ParserInputLimit


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
    tree_ref: object = field(repr=False, compare=False)
    node_ref: Callable[[Span], ast.AST] | None = field(default=None, repr=False, compare=False)
    package_root: str | None = None

    @property
    def tree(self):
        return self.tree_ref() if callable(self.tree_ref) else self.tree_ref

    def node_at(self, span):
        if self.node_ref is not None:
            return self.node_ref(span)
        found = None
        for node in ast.walk(self.tree):
            if getattr(node, "end_lineno", None) is not None and location(self.source_id, node) == span:
                found = node
        if found is None:
            raise KeyError(span)
        return found

    @cached_property
    def bindings(self):
        values = defaultdict(list)
        for symbol in self.symbols:
            values[symbol.scope, symbol.name].append(symbol)
        return dict(values)

    @cached_property
    def global_taints(self):
        return {s.name for s in self.symbols if s.kind == 'global_taint'}

    @cached_property
    def dynamic_namespace(self):
        return any(s.kind == 'dynamic_namespace' for s in self.symbols)


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
    cross_module: bool = False

    @cached_property
    def names(self):
        return ModuleNames(self.modules)

    @cached_property
    def calls(self):
        return {c.location: (m, c) for m in self.modules for c in m.calls}

    @cached_property
    def definitions(self):
        return {m.source_id + ':' + s.target: s.location for m in self.modules
                for s in m.symbols if s.kind == 'function' and s.target}


class ModuleNames:
    def __init__(self, modules: Iterable[Module]):
        self.by_name = defaultdict(list)
        self.tops = set()
        paths = []
        for module in modules:
            paths.append(module.path)
            if module.name:
                self.by_name[module.name].append(module)
                self.tops.add(module.name.split('.')[0])
        self.path_names = path_names(paths)

    def longest(self, target: str, *, allow_exact: bool = True):
        prefix = target if allow_exact else target.rpartition('.')[0]
        while prefix:
            if prefix in self.by_name:
                return self.by_name[prefix], target[len(prefix):].lstrip('.')
            prefix = prefix.rpartition('.')[0]
        return (), ''


def location(source_id: str, node: ast.AST) -> Span:
    return Span(source_id=source_id, start_line=getattr(node, 'lineno'), start_col=getattr(node, 'col_offset'),
                end_line=getattr(node, 'end_lineno'), end_col=getattr(node, 'end_col_offset'))


def module_name(path: str, root: str) -> str | None:
    prefix = '' if root == '.' else root + '/'
    if not path.startswith(prefix):
        return None
    parts = path[len(prefix):].rsplit('.', 1)[0].split('/')
    if parts[-1] == '__init__':
        parts.pop()
    if not parts or any(not p.isidentifier() for p in parts):
        return None
    return '.'.join(parts)


def owning_root(path: str, roots: set[str]) -> str | None:
    parent = path.rpartition('/')[0]
    while parent:
        if parent in roots:
            return parent
        parent = parent.rpartition('/')[0]
    return '.' if '.' in roots else None


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


def resolve(name: str | None, scope: str, module: Module, modules: ModuleNames | Iterable[Module], cross_module: bool,
            seen: tuple[tuple[str, str], ...] = ()) -> tuple[str | None, str | None]:
    if module.dynamic_namespace:
        return None, 'dynamic_namespace'
    if not name:
        return None, 'dynamic_call'
    head, *rest = name.split('.')
    if head in module.global_taints:
        return None, 'dynamic_scope_write'
    current = scope
    while True:
        if (current, '*') in module.bindings:
            return None, 'wildcard_import'
        bindings = module.bindings.get((current, head), ())
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
            table = modules if isinstance(modules, ModuleNames) else ModuleNames(modules)
            selected, suffix = table.longest(target)
            if selected:
                if not cross_module:
                    return None, 'cross_module_disabled'
                if len(selected) != 1:
                    return None, 'ambiguous_module'
                other = selected[0]
                if module.package_root != other.package_root:
                    return None, 'cross_root_import'
                key = (other.source_id, suffix)
                if not suffix or key in seen or len(seen) >= 20:
                    return None, 'module_or_import_cycle'
                target, reason = resolve(suffix, '<module>', other, table, cross_module, (*seen, key))
                return target, 'missing_module' if reason == 'unbound_name' else reason
            # A collected package of this name takes precedence over installed libraries.
            top = target.split('.')[0]
            if top in table.tops:
                return None, 'missing_module'
            if top in table.path_names:
                return None, 'local_library_collision'
            if top in ('jwt', 'cryptography', 'Crypto', 'ecdsa'):
                return target, None
            return None, 'missing_module'
        if current == '<module>':
            return None, 'unbound_name'
        current = current.rsplit('.', 1)[0]


def index_calls(module: Module, checkpoint: Callable[[], object]) -> tuple[Call, ...]:
    calls: list[Call] = []
    pending: list[tuple[ast.AST, str]] = [(module.tree, '<module>')]
    while pending:
        checkpoint()
        node, scope = pending.pop()
        if isinstance(node, ast.Call):
            expression = dotted(node.func)
            calls.append(Call(scope, expression or '<dynamic>', location(module.source_id, node), None, None))
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
                target_minor: int = sys.version_info.minor, checkpoint: Callable[[], object] = lambda: None) -> Index:
    budgets = budgets or Budgets()
    if not 10 <= target_minor <= sys.version_info.minor:
        raise ValueError('目标语法必须为3.10至宿主版本')
    cache = getattr(snapshot, "ast_cache", None) if target_minor == sys.version_info.minor else None
    cache = cache or AstCache(snapshot.logical.sources, checkpoint, target_minor=target_minor)
    modules, diagnostics = [], list(snapshot.diagnostics)
    roots = set(snapshot.identity.package_roots)
    cross = snapshot.identity.path_fidelity == 'relative_paths' and bool(roots)
    nodes = edges = size = 0
    for source in snapshot.logical.sources:
        checkpoint()
        identity = source.identity
        try:
            tree = cache.get(identity.source_id)[0]
            stack: list[tuple[ast.AST, int]] = [(tree, 0)]
            count = 0
            while stack:
                checkpoint()
                node, depth = stack.pop()
                count += 1
                if count > budgets.ast_nodes or depth > budgets.ast_depth:
                    raise OverflowError('ast_limit')
                stack.extend((child, depth + 1) for child in ast.iter_child_nodes(node))
        except (OSError, SyntaxError, ValueError, RecursionError, OverflowError) as exc:
            code = ('source_unavailable' if isinstance(exc, OSError) else
                    'ast_limit' if isinstance(exc, (RecursionError, OverflowError, ParserInputLimit)) else 'parse_failed')
            reason = {'source_unavailable': '源码不可读取', 'ast_limit': '达到单文件语法树上限', 'parse_failed': 'Python 语法解析失败'}
            detail = reason[code]
            file_name = identity.relative_path
            file_width = 511 - len(detail)
            if len(file_name) > file_width:
                file_name = '…' + file_name[-(file_width - 1):]
            diagnostics.append(Diagnostic(code=code, message=f'{file_name}：{detail}',
                                          location=Span(source_id=identity.source_id, start_line=max(1, getattr(exc, 'lineno', 1) or 1), start_col=0,
                                                        end_line=max(1, getattr(exc, 'lineno', 1) or 1), end_col=1)))
            continue
        root = owning_root(identity.relative_path, roots) if cross else None
        name = module_name(identity.relative_path, root) if root is not None else None
        symbols = collect_symbols(identity.source_id, tree, checkpoint)
        module = Module(identity.source_id, name, identity.relative_path, symbols, (), tree, package_root=root)
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
        # Store raw call spans now. Resolution after all modules are indexed does
        # not need a second parse of every file.
        module = replace(module, calls=index_calls(module, checkpoint))
        encoded = len(json.dumps([(s.name, s.kind, s.scope, s.target, s.location.model_dump()) for s in mapped], ensure_ascii=False).encode('utf-8'))
        if nodes + count > budgets.index_nodes or size + encoded > budgets.structure_bytes:
            diagnostics.append(Diagnostic(code='index_limit', message='索引节点或结构体积达到上限'))
            break
        nodes += count
        size += encoded
        modules.append(replace(module, tree_ref=lambda identity=identity.source_id: cache.get(identity)[0], node_ref=cache.node))
    output = []
    names = ModuleNames(modules)
    collected_names = path_names(s.relative_path for s in snapshot.identity.sources) | set(snapshot.identity.unavailable_imports)
    for module in modules:
        calls = []
        for call in module.calls:
            checkpoint()
            target, reason = resolve(call.expression, call.scope, module, names, cross)
            calls.append(replace(call, target=target, reason=reason))
        # Failed/excluded local modules still shadow an installed library of the same name.
        calls = tuple(replace(c, target=None, reason='unavailable_or_ambiguous_local')
                      if c.target and ':' not in c.target and c.target.split('.')[0] in collected_names else c for c in calls)
        encoded = len(json.dumps([(c.scope, c.expression, c.target, c.reason, c.location.model_dump()) for c in calls], ensure_ascii=False).encode('utf-8'))
        if edges + len(calls) > budgets.index_edges or size + encoded > budgets.structure_bytes:
            diagnostics.append(Diagnostic(code='index_limit', message='调用边或结构体积达到上限'))
            # Retain complete symbol facts but publish no half call set for this module.
            break
        edges += len(calls)
        size += encoded
        output.append(replace(module, calls=calls))
    coverage = snapshot.identity.coverage.model_copy(update={
        'parsed': CoverageCount(count=len(modules), total=len(snapshot.logical.sources)),
        'analyzed': CoverageCount(count=len(output), total=len(snapshot.logical.sources)),
        'partial': snapshot.identity.coverage.partial or bool(diagnostics),
        'gaps': tuple(sorted(set(snapshot.identity.coverage.gaps) | {d.code for d in diagnostics}))[:200],
    })
    if hasattr(cache, 'summarize'):
        for module in output:
            checkpoint()
            cache.summarize(module)
    return Index(tuple(output), tuple(diagnostics[:200]), coverage, sys.version.split()[0], f'3.{target_minor}',
                 nodes_used=nodes, edges_used=edges, structure_bytes=size, cross_module=cross)
