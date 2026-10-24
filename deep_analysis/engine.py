"""Independent bounded semantic discovery. No legacy scan results or E3 claims."""
from __future__ import annotations

from dataclasses import replace
from typing import Callable, Iterator

from deep_analysis.abstract_values import SemanticLimit
from deep_analysis.dataflow import Evaluator, Frame, SEMANTICS_VERSION, SliceLimit, contains
from deep_analysis.discovery import CallSite, Discovery, DISCOVERY_VERSION
from deep_analysis.identity import operation_id, template_id, stable_id
from deep_analysis.models import ArgumentFact, Budgets, CallContext, CoverageCount, Diagnostic, Unknown
from deep_analysis.semantic_models import Candidate, SemanticResult
from deep_analysis.snapshot import Snapshot
from deep_analysis.symbol_index import Index, build_index, is_class_method
import ast


def context_plans(discovery: Discovery, site: CallSite, budgets: Budgets,
                  checkpoint: Callable[[], object]) -> Iterator[tuple[tuple[CallSite, ...], str | None]]:
    """Walk only callers of a sink's scope; bound even a dense or cyclic call graph."""
    pending = [(site.module.source_id + ':' + site.call.scope, (), ())]
    visited = 0
    delivered = 0
    while pending:
        checkpoint()
        function, chain, seen = pending.pop()
        visited += 1
        if visited > budgets.index_nodes:
            yield (), 'context_graph_limit'
            return
        if function.endswith(':<module>'):
            yield chain, None
            delivered += 1
        elif function in seen:
            yield chain[:budgets.call_depth], 'recursive_call'
            delivered += 1
        else:
            incoming = discovery.incoming.get(function, [])
            if not incoming:
                yield (), 'uninstantiated_template'
                delivered += 1
            elif len(chain) >= budgets.call_depth:
                yield chain, 'call_depth_limit'
                delivered += 1
            else:
                for caller in reversed(incoming[:max(1, budgets.contexts_per_function + 1)]):
                    pending.append((caller.module.source_id + ':' + caller.call.scope, (caller, *chain), (*seen, function)))
        if delivered >= max(1, budgets.contexts_per_function):
            if pending:
                yield (), 'context_limit'
            return


def at_site(evaluator: Evaluator, frame: Frame, site: CallSite) -> Frame:
    """Attach lexical branch conditions; unsupported surrounding control blocks inference."""
    function = evaluator.function(frame)
    body = function.node.body if function else frame.module.tree.body
    point = site.span.start_line, site.span.start_col
    while body:
        enclosing = next((s for s in body if contains(s, point)), None)
        if isinstance(enclosing, ast.If):
            flag = any(contains(s, point) for s in enclosing.body)
            frame = evaluator.branch(frame, enclosing.test, flag)
            body = enclosing.body if flag else enclosing.orelse
        elif isinstance(enclosing, (ast.For, ast.AsyncFor, ast.While, ast.Try, ast.With, ast.AsyncWith, ast.Match)):
            return replace(frame, blocked='unsupported_control_flow')
        else:
            break
    return frame


def analyze(snapshot: Snapshot, *, index: Index | None = None, budgets: Budgets | None = None,
            checkpoint: Callable[[], object] = lambda: None, semantics_version: str = SEMANTICS_VERSION,
            discovery_version: str = DISCOVERY_VERSION,
            evaluator_type: type[Evaluator] = Evaluator) -> SemanticResult:
    budgets = budgets or Budgets()
    index = index or build_index(snapshot, budgets=budgets, checkpoint=checkpoint)
    discovery = Discovery(index, checkpoint)
    evaluator = evaluator_type(snapshot, discovery, budgets, checkpoint, semantics_version, discovery_version)
    candidates: dict[str, Candidate] = {}
    diagnostics = list(index.diagnostics)
    partial = index.coverage.partial
    limited = False
    try:
        for sink in discovery.sinks:
            checkpoint()
            for chain, reason in context_plans(discovery, sink, budgets, checkpoint):
                evaluator.touched.clear()
                arguments = {}
                frame = Frame(sink.module, sink.call.scope)
                try:
                    if chain and reason is None:
                        frame = Frame(chain[0].module, chain[0].call.scope)
                        for caller in chain:
                            frame = at_site(evaluator, frame, caller)
                            function = discovery.functions.get(caller.call.target)
                            if function is None:
                                frame = replace(frame, blocked='missing_callee')
                                break
                            frame = evaluator.bind(caller, function, frame)
                    else:
                        blocked = None if reason == 'uninstantiated_template' and is_class_method(sink.module, sink.call.scope) else reason
                        frame = Frame(sink.module, sink.call.scope, blocked=blocked)
                    frame = at_site(evaluator, frame, sink)
                    function = evaluator.function(frame)
                    if function and (function.node.decorator_list or isinstance(function.node, ast.AsyncFunctionDef)):
                        frame = replace(frame, blocked='unsupported_function')
                    arguments, binding_reason = evaluator.sink_arguments(sink, frame)
                    template_reason = None if reason == 'uninstantiated_template' and is_class_method(sink.module, sink.call.scope) else reason
                    reason = frame.blocked or binding_reason or template_reason
                    if reason:
                        arguments = {name: evaluator.store.unknown(reason) for name in arguments}
                except SliceLimit as exc:
                    reason = str(exc)
                    arguments = {'algorithm': evaluator.store.unknown(reason)}
                limit_reasons = {'slice_limit', 'evaluation_depth_limit', 'context_limit', 'call_depth_limit',
                                 'context_graph_limit', 'value_limit', 'condition_limit', 'argument_limit',
                                 'container_limit', 'literal_limit'}
                # Limits may also arise in an individual abstract value, without an exception.
                value_limits = sorted({f.value.reason for f in arguments.values()
                                       if isinstance(f.value, Unknown) and f.value.reason in limit_reasons})
                if reason is None and value_limits:
                    reason = value_limits[0]
                if reason in limit_reasons:
                    partial = True
                    diagnostics.append(Diagnostic(code=reason, message='语义分析达到限定范围，保留完整候选并明确未知', location=sink.span))
                conditions = frame.conditions[:16]
                context = CallContext(kind='invocation' if chain or sink.call.scope == '<module>' else 'uninstantiated_template',
                                      call_chain=tuple(c.span for c in chain), conditions=conditions,
                                      arguments=tuple(ArgumentFact(parameter=name, fact_id=fact.fact_id) for name, fact in sorted(arguments.items())))
                identity = operation_id(snapshot.identity.snapshot_id, sink.span, context, discovery_version, semantics_version)
                candidate = Candidate(identity, template_id(snapshot.identity.snapshot_id, sink.span, discovery_version),
                                      sink.call.target, sink.span, context, tuple(sorted(arguments.items())), reason)
                if identity not in candidates:
                    evaluator.store.charge([identity, candidate.template_id, context.model_dump(mode='json')], node=True)
                    candidates[identity] = candidate
    except SemanticLimit as exc:
        limited = partial = True
        diagnostics.append(Diagnostic(code=str(exc), message='共享语义结构达到上限，已完成候选保留'))
    coverage = index.coverage.model_copy(update={
        'analyzed': CoverageCount(count=0 if limited else len(index.modules), total=len(snapshot.logical.sources)),
        'partial': partial,
        'gaps': tuple(sorted(set(index.coverage.gaps) | {d.code for d in diagnostics}))[:200],
    })
    return SemanticResult(snapshot.identity.snapshot_id, tuple(candidates.values()), tuple(diagnostics[:200]), coverage,
                          semantics_version, discovery_version, len(evaluator.cache), evaluator.hits,
                          len(evaluator.store.facts), len(evaluator.store.steps), evaluator.store.structure_bytes,
                          evaluator.store.nodes_used, evaluator.store.edges_used)
