"""Bounded, source-free evidence projection from proposed semantic facts."""
from __future__ import annotations

import ast

from deep_analysis.crypto_rules import RULES
from deep_analysis.crypto_semantics import Proposal
from deep_analysis.identity import stable_id
from deep_analysis.models import EvidenceEdge, EvidenceNode, EvidencePath, Span, Versions
from deep_analysis.proof_replay import Edge
from deep_analysis.snapshot import Snapshot
from deep_analysis.symbol_index import Index, location


def api_bindings(index: Index, span: Span) -> set[Edge]:
    """Only the unique lexical binding, not all imports in a file."""
    module = next(m for m in index.modules if m.source_id == span.source_id)
    call = next((c for c in module.calls if c.location == span), None)
    if call is None or call.target not in RULES:
        return set()
    name, scope = call.expression.split('.')[0], call.scope
    while True:
        bindings = [s for s in module.symbols if s.name == name and s.scope == scope]
        if bindings:
            return {('IMPORT_BINDING', bindings[0].location, span)} if len(bindings) == 1 and bindings[0].kind == 'import' else set()
        if scope == '<module>':
            return set()
        scope = scope.rsplit('.', 1)[0]


def context_edges(index: Index, chain: tuple[Span, ...]) -> set[Edge]:
    result = set()
    definitions = {m.source_id + ':' + s.target: s.location for m in index.modules for s in m.symbols if s.kind == 'function' and s.target}
    for span in chain:
        call = next(c for m in index.modules for c in m.calls if c.location == span)
        if call.target in definitions:
            result.add(('CALLS', span, definitions[call.target]))
    return result


def edge_identity(kind: str, source: str, target: str, conditions: tuple[str, ...]) -> str:
    return stable_id('evidence-edge', [kind, source, target, conditions])


def path_identity(path: EvidencePath) -> str:
    return stable_id('evidence', path.model_dump(mode='json', exclude={'evidence_id', 'verification_status', 'historical_verification_status', 'replay_status', 'gaps'}))


def project(snapshot: Snapshot, index: Index, proposal: Proposal, claim_type: str,
            versions: Versions, *, slice_nodes: int = 200) -> EvidencePath:
    fact = dict(proposal.facts)[claim_type]
    candidate = proposal.candidate
    edges = api_bindings(index, candidate.sink) | context_edges(index, candidate.context.call_chain)
    positions = {candidate.sink}
    for step in fact.steps:
        positions.update((step.source, step.destination))
        if step.kind in ('CALLS', 'IMPORT_BINDING', 'ASSIGN_FLOW', 'ARGUMENT_FLOW', 'RETURN_FLOW', 'KEY_TYPE_FLOW'):
            edges.add((step.kind, step.source, step.destination))
    # Receiver types must also prove every constructor's trusted import.
    for kind, source, target in tuple(edges):
        if kind == 'KEY_TYPE_FLOW':
            edges.update(api_bindings(index, source))
            edges.update(api_bindings(index, target))
    positions.update(p for _, a, b in edges for p in (a, b))
    if len(positions) > min(200, slice_nodes) or len(edges) > min(200, slice_nodes):
        raise OverflowError('evidence_slice_limit')
    ast_nodes = {location(m.source_id, n): n for m in index.modules for n in ast.walk(m.tree)
                 if hasattr(n, 'end_lineno') and n.end_lineno is not None}
    identities = {s.source_id: s for s in snapshot.identity.sources}
    nodes = []
    for span in sorted(positions, key=lambda p: (p.source_id, p.start_line, p.start_col, p.end_line, p.end_col)):
        digest = identities[span.source_id].sha256
        # Deliberately retain syntax kinds, never source strings, identifiers, or keys.
        expression = '<' + type(ast_nodes.get(span)).__name__ + '>'
        node_id = stable_id('evidence-node', [span.model_dump(mode='json'), digest, expression])
        nodes.append(EvidenceNode(node_id=node_id, location=span, source_sha256=digest, expression=expression, redacted=True))
    by_span = {node.location: node.node_id for node in nodes}
    projected = []
    for kind, source, target in sorted(edges, key=lambda e: (e[0], by_span[e[1]], by_span[e[2]])):
        a, b = by_span[source], by_span[target]
        projected.append(EvidenceEdge(edge_id=edge_identity(kind, a, b, candidate.context.conditions), edge_type=kind,
                                      source_node=a, target_node=b, conditions=candidate.context.conditions))
    path = EvidencePath(evidence_id='pending', claim_type=claim_type, snapshot_id=snapshot.identity.snapshot_id, context=candidate.context,
                        nodes=tuple(nodes), edges=tuple(projected), versions=versions)
    return path.model_copy(update={'evidence_id': path_identity(path)})


def proof_edges(path: EvidencePath) -> frozenset[Edge]:
    nodes = {n.node_id: n.location for n in path.nodes}
    return frozenset((e.edge_type, nodes[e.source_node], nodes[e.target_node]) for e in path.edges)
