"""Static crypto closure, deliberately not yet wired into HTTP task scheduling."""
from __future__ import annotations

from typing import Callable

from deep_analysis.crypto_rules import ENGINE_VERSION, RULES_VERSION, VERIFIER_VERSION, LIBRARY_PROFILES
from deep_analysis.crypto_semantics import propose
from deep_analysis.dataflow import SEMANTICS_VERSION
from deep_analysis.engine import analyze
from deep_analysis.evidence import project
from deep_analysis.key_flow import CryptoEvaluator
from deep_analysis.models import Budgets, Claim, CryptoOperation, DeepAnalysisResult, Diagnostic, Known, Versions
from deep_analysis.snapshot import Snapshot
from deep_analysis.symbol_index import build_index
from deep_analysis.verifier import Verifier, grade_claims

CRYPTO_SEMANTICS_VERSION = SEMANTICS_VERSION + '+keys-1'


def analyze_crypto(snapshot: Snapshot, *, budgets: Budgets | None = None,
                   checkpoint: Callable[[], object] = lambda: None,
                   on_result: Callable[[DeepAnalysisResult], object] = lambda result: None) -> DeepAnalysisResult:
    budgets = budgets or Budgets()
    index = build_index(snapshot, budgets=budgets, checkpoint=checkpoint)
    versions = Versions(rules=RULES_VERSION, semantics=CRYPTO_SEMANTICS_VERSION, engine=ENGINE_VERSION,
                        verifier=VERIFIER_VERSION, host_python=index.host_python, target_python=index.target_python,
                        library_profiles=LIBRARY_PROFILES)
    semantic = analyze(snapshot, index=index, budgets=budgets, checkpoint=checkpoint,
                       semantics_version=CRYPTO_SEMANTICS_VERSION, discovery_version=RULES_VERSION,
                       evaluator_type=CryptoEvaluator)
    remaining = budgets.model_copy(update={
        'index_nodes': max(0, budgets.index_nodes - semantic.nodes_used),
        'index_edges': max(0, budgets.index_edges - semantic.edges_used),
        'structure_bytes': max(0, budgets.structure_bytes - semantic.structure_bytes),
    })
    verifier = Verifier(snapshot, versions, remaining, checkpoint)
    operations, paths, diagnostics = [], {}, list(semantic.diagnostics)
    diagnostics.append(Diagnostic(code='library_version_assumption', message='结论以记录的API规则版本为前提，目标依赖实际安装版本未核实；不证明运行或部署事实'))
    used_bytes = semantic.structure_bytes + verifier.index.structure_bytes
    used_nodes = semantic.nodes_used + verifier.index.nodes_used
    used_edges = semantic.edges_used + verifier.index.edges_used
    limited = verifier.index.coverage.partial and not semantic.coverage.partial
    diagnostics.extend(d for d in verifier.index.diagnostics if d not in diagnostics)
    for candidate in semantic.candidates:
        checkpoint()
        call = next((c for m in index.modules for c in m.calls if c.location == candidate.sink), None)
        method = call.expression.split('.')[-1] if call else None
        proposal = propose(candidate, method)
        if proposal is None:
            if candidate.api is None:
                diagnostics.append(Diagnostic(code='unproven_receiver', message='方法接收者无受支持的密钥类型证明，未认定密码操作', location=candidate.sink))
            continue
        try:
            projected = {name: project(snapshot, index, proposal, name, versions, slice_nodes=budgets.slice_nodes) for name, _ in proposal.facts}
        except OverflowError:
            diagnostics.append(Diagnostic(code='evidence_slice_limit', message='单条证据达到上限，不提交不完整路径', location=candidate.sink))
            limited = True
            continue
        claims = tuple(Claim(claim_type=name, value=fact.value, resolution_status={'known': 'resolved', 'ambiguous': 'ambiguous', 'unknown': 'unknown'}[fact.value.kind],
                             level='E1', evidence_ids=(projected[name].evidence_id,)) for name, fact in proposal.facts)
        operation = CryptoOperation(operation_id=candidate.operation_id, template_id=candidate.template_id,
                                    api=proposal.api, library=proposal.library, operation_type=proposal.operation,
                                    algorithm=claims[0].value, algorithm_family=proposal.family,
                                    resolution_status=claims[0].resolution_status,
                                    call_site=candidate.context.call_chain[0] if candidate.context.call_chain else candidate.sink if candidate.context.kind == 'invocation' else None,
                                    sink_location=candidate.sink, context=candidate.context,
                                    evidence_ids=tuple(dict.fromkeys(p.evidence_id for p in projected.values())), claims=claims, risk_category=proposal.risk)
        checked = {claim.claim_type: verifier.check(projected[claim.claim_type], operation, claim) for claim in claims}
        graded = grade_claims(claims, checked)
        algorithm = graded[0]
        quantum = graded[3]
        operation = operation.model_copy(update={'claims': graded, 'algorithm': algorithm.value,
                                                 'resolution_status': algorithm.resolution_status,
                                                 'algorithm_family': proposal.family if isinstance(algorithm.value, Known) else None,
                                                 'risk_category': quantum.value.value if isinstance(quantum.value, Known) and quantum.level == 'E3' else 'unknown'})
        new_paths = {p.evidence_id: p for p in checked.values() if p.evidence_id not in paths}
        size = len(operation.model_dump_json().encode('utf-8')) + sum(len(p.model_dump_json().encode('utf-8')) for p in new_paths.values())
        nodes = sum(len(p.nodes) for p in new_paths.values()) + 1
        edges = sum(len(p.edges) for p in new_paths.values())
        if used_bytes + size > budgets.structure_bytes or used_nodes + nodes > budgets.index_nodes or used_edges + edges > budgets.index_edges:
            diagnostics.append(Diagnostic(code='evidence_structure_limit', message='证据与语义共享结构预算耗尽，保留已核验完整操作'))
            limited = True
            break
        used_bytes, used_nodes, used_edges = used_bytes + size, used_nodes + nodes, used_edges + edges
        paths.update(new_paths)
        operations.append(operation)
        on_result(DeepAnalysisResult(status='partial', snapshot=snapshot.identity, operations=tuple(operations),
                                     evidence_paths=tuple(paths.values()), coverage=semantic.coverage,
                                     diagnostics=tuple(diagnostics[:1000]), budgets=budgets.model_copy(update={
                                         'used_nodes': used_nodes, 'used_edges': used_edges, 'used_structure_bytes': used_bytes}), versions=versions))
    coverage = semantic.coverage.model_copy(update={'partial': semantic.coverage.partial or limited,
                                                    'gaps': tuple(sorted(set(semantic.coverage.gaps) | ({'evidence_limit'} if limited else set())))[:200]})
    return DeepAnalysisResult(status='partial' if coverage.partial else 'completed' if snapshot.logical.sources else 'skipped',
                              snapshot=snapshot.identity, operations=tuple(operations), evidence_paths=tuple(paths.values()),
                              coverage=coverage, diagnostics=tuple(diagnostics[:1000]), budgets=budgets.model_copy(update={
                                         'used_nodes': used_nodes, 'used_edges': used_edges, 'used_structure_bytes': used_bytes}), versions=versions)


def revalidate(result: DeepAnalysisResult, snapshot: Snapshot | None, *, versions: Versions | None = None,
               checkpoint: Callable[[], object] = lambda: None) -> DeepAnalysisResult:
    """Preserve historical decisions; absence of raw source never counts as replay."""
    if snapshot is None:
        paths = tuple(p.model_copy(update={'replay_status': 'unavailable'}) for p in result.evidence_paths)
        return result.model_copy(update={'evidence_paths': paths})
    current = versions or result.versions
    verifier = Verifier(snapshot, current, result.budgets, checkpoint)
    original = {p.evidence_id: p for p in result.evidence_paths}
    checked, operations = {}, []
    for operation in result.operations:
        local_paths = {}
        for claim in operation.claims:
            path = original[claim.evidence_ids[0]]
            checked_path = verifier.check(path, operation, claim)
            checked[path.evidence_id] = checked_path
            local_paths[claim.claim_type] = checked_path
        claims = grade_claims(operation.claims, local_paths)
        operations.append(operation.model_copy(update={'claims': tuple(claims), 'algorithm': claims[0].value,
                                                        'resolution_status': claims[0].resolution_status,
                                                        'algorithm_family': operation.algorithm_family if claims[0].level == 'E3' else None,
                                                        'risk_category': claims[3].value.value if claims[3].level == 'E3' else 'unknown'}))
    # Keep original snapshot/version identities: a changed source needs a new analysis,
    # not a relabelled old proof. Current replay failure is recorded on those old paths.
    return result.model_copy(update={'operations': tuple(operations), 'evidence_paths': tuple(checked.values())})
