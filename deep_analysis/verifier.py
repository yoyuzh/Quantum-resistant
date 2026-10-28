"""Independent source/AST/context/edge validation and per-claim grades."""
from __future__ import annotations

from dataclasses import replace
from typing import Callable

from deep_analysis.crypto_rules import RULES, RULES_VERSION, ENGINE_VERSION, VERIFIER_VERSION, LIBRARY_PROFILES, classification, method_rule, method_parameters
from deep_analysis.dataflow import SEMANTICS_VERSION
from deep_analysis.evidence import edge_identity, path_identity, proof_edges
from deep_analysis.identity import content_digest, extract_span, stable_id, operation_id, template_id, snapshot_id
from deep_analysis.models import Budgets, Claim, CryptoOperation, EvidencePath, Known, Unknown, Versions
from deep_analysis.proof_replay import Replay, Witness, unknown
from deep_analysis.snapshot import Snapshot
from deep_analysis.symbol_index import build_index, location


def field(value: Witness | None, name: str) -> Witness | None:
    if value is None or value.items is None or not isinstance(value.value, Unknown) or value.value.reason != 'literal_mapping':
        return None
    return next((v for k, v in zip(value.items[::2], value.items[1::2]) if isinstance(k.value, Known) and k.value.value == name), None)


class Verifier:
    def __init__(self, snapshot: Snapshot, versions: Versions, budgets: Budgets | None = None,
                 checkpoint: Callable[[], object] = lambda: None):
        self.snapshot, self.versions = snapshot, versions
        self.budgets, self.checkpoint = budgets or Budgets(), checkpoint
        # Rebuild the index from source; never accept the producer's index/facts/cache.
        self.index = build_index(snapshot, budgets=self.budgets, checkpoint=checkpoint)
        self.replay = Replay(self.index, self.budgets, checkpoint)
        self.sources = {s.identity.source_id: s for s in snapshot.logical.sources}
        self.identities = {s.source_id: s for s in snapshot.identity.sources}
        self.cache = {}

    def assertions(self, operation: CryptoOperation) -> tuple[dict, set, str | None]:
        key = (operation.operation_id, operation.api, operation.library, operation.operation_type,
               operation.context.model_dump_json(), operation.sink_location.model_dump_json())
        if key in self.cache:
            return self.cache[key]
        replay = self.replay
        scope = replay.context(operation.sink_location, operation.context.call_chain)
        if scope is None:
            return {}, set(), 'context_mismatch'
        module, call = replay.calls[operation.sink_location]
        node = replay.nodes[operation.sink_location]
        rule = RULES.get(call.target)
        required = set(replay.api_imports(operation.sink_location))
        for span in operation.context.call_chain:
            m, caller = replay.calls[span]
            if caller.target not in replay.functions:
                return {}, set(), 'context_mismatch'
            required.add(('CALLS', span, location(replay.functions[caller.target][0].source_id, replay.functions[caller.target][1])))
        if rule and rule.library == 'PyJWT':
            if rule.api == 'jwt.encode':
                args = replay.api_arguments(node, scope, ('payload', 'key'), ('algorithm', 'headers', 'json_encoder', 'sort_headers'))
                role = 'sign'
                algorithm = args.get('algorithm', unknown('unspecified_algorithm')) if args else unknown('invalid_argument_binding')
                if args:
                    headers = args['headers']
                    override = field(headers, 'alg')
                    if override:
                        algorithm = override
                    elif not (isinstance(headers.value, Unknown) and headers.value.reason == 'unspecified_api_parameter') and not (isinstance(headers.value, Known) and headers.value.value is None) and headers.items is None:
                        algorithm = unknown('headers_algorithm_override')
            else:
                args = replay.api_arguments(node, scope, ('jwt',), ('key', 'algorithms', 'options', 'verify', 'detached_payload', 'audience', 'subject', 'issuer', 'leeway'))
                role = 'verify'
                algorithm = args.get('algorithms', unknown('unspecified_algorithm')) if args else unknown('invalid_argument_binding')
                if algorithm.items is not None:
                    algorithm = replay.merge(algorithm.items)
                if args:
                    options = args['options']
                    flag = field(options, 'verify_signature')
                    if flag is not None and isinstance(flag.value, Known) and flag.value.value is False:
                        role, algorithm = 'unknown', replace(flag, value=Unknown(reason='verification_disabled'))
                    elif flag is not None and not (isinstance(flag.value, Known) and flag.value.value is True):
                        role, algorithm = 'unknown', unknown('unknown_verification_options')
                    elif options.items is None and not (isinstance(options.value, Unknown) and options.value.reason == 'unspecified_api_parameter') and not (isinstance(options.value, Known) and options.value.value is None):
                        role, algorithm = 'unknown', unknown('unknown_verification_options')
            key_fact = args.get('key', unknown('unknown_key_source')) if args else unknown('unknown_key_source')
            api, library = rule.api, rule.library
            role_fact = Witness(Known(value=role))
        elif rule:
            role, api, library = rule.operation, rule.api, rule.library
            key_fact = replay.call(node, scope)
            algorithm = replace(key_fact, value=Known(value=rule.algorithm)) if rule.algorithm and key_fact.key_type else replace(key_fact, value=Unknown(reason='generic_key_type'))
            role_fact = Witness(Known(value=role))
        else:
            if not hasattr(node.func, 'value'):
                return {}, required, 'unsupported_api'
            key_fact = replay.expr(node.func.value, scope)
            match = method_rule(key_fact.key_type, node.func.attr)
            if not match:
                return {}, required, 'unsupported_receiver'
            if replay.api_arguments(node, scope, method_parameters(key_fact.key_type, node.func.attr)) is None:
                return {}, required, 'invalid_method_binding'
            key_fact = key_fact.edge('KEY_TYPE_FLOW', key_fact.last, operation.sink_location)
            role, family = match
            library = 'PyCryptodome' if key_fact.key_type.startswith('signer:') else 'ecdsa' if key_fact.key_type.startswith('ECDSA:') else 'cryptography'
            api = library + '.' + key_fact.key_type + '.' + node.func.attr
            algorithm, role_fact = replace(key_fact, value=Known(value=family)), replace(key_fact, value=Known(value=role))
        if operation.api != api or operation.library != library or operation.operation_type != role:
            return {}, required, 'domain_mismatch'
        origin = key_fact.origin
        if origin is None and isinstance(key_fact.value, Known) and key_fact.nodes:
            # Literal scalar provenance is a static source, never the exported key value.
            literals = [p for p in key_fact.nodes if type(replay.nodes.get(p)).__name__ == 'Constant']
            if len(literals) == 1:
                origin = literals[0]
        source = replace(key_fact, value=Known(value=stable_id('key-source', origin.model_dump(mode='json')))) if origin else replace(key_fact, value=Unknown(reason='unknown_key_source'))
        family, risk = classification(algorithm.value.value) if isinstance(algorithm.value, Known) and type(algorithm.value.value) is str else (None, 'unknown')
        quantum = replace(algorithm, value=Known(value=risk)) if risk != 'unknown' else replace(algorithm, value=Unknown(reason='unverified_algorithm_class'))
        result = {'ALGORITHM': algorithm, 'OPERATION_TYPE': role_fact, 'KEY_SOURCE': source, 'QUANTUM_CLASS': quantum}
        answer = result, required, None
        self.cache[key] = answer
        return answer

    def check(self, path: EvidencePath, operation: CryptoOperation, claim: Claim) -> EvidencePath:
        self.checkpoint()
        gaps = []
        if (path.versions != self.versions or self.versions.rules != RULES_VERSION or self.versions.verifier != VERIFIER_VERSION
                or self.versions.engine != ENGINE_VERSION or self.versions.semantics != SEMANTICS_VERSION + '+keys-1'
                or self.versions.library_profiles != LIBRARY_PROFILES
                or self.versions.host_python != self.index.host_python or self.versions.target_python != self.index.target_python):
            gaps.append('version_mismatch')
        if path.claim_type != claim.claim_type:
            gaps.append('claim_path_mismatch')
        if path.snapshot_id != self.snapshot.identity.snapshot_id or path.context != operation.context:
            gaps.append('context_or_snapshot_mismatch')
        if path.evidence_id != path_identity(path):
            gaps.append('path_identity_mismatch')
        if snapshot_id(self.snapshot.identity) != self.snapshot.identity.snapshot_id:
            gaps.append('snapshot_identity_mismatch')
        if (operation.operation_id != operation_id(path.snapshot_id, operation.sink_location, operation.context, path.versions.rules, path.versions.semantics)
                or operation.template_id != template_id(path.snapshot_id, operation.sink_location, path.versions.rules)):
            gaps.append('operation_identity_mismatch')
        call_site = operation.context.call_chain[0] if operation.context.call_chain else operation.sink_location if operation.context.kind == 'invocation' else None
        if operation.call_site != call_site:
            gaps.append('call_site_mismatch')
        indexed_sink = self.replay.calls.get(operation.sink_location)
        if indexed_sink and not operation.context.call_chain and (operation.context.kind == 'invocation') != (indexed_sink[1].scope == '<module>'):
            gaps.append('context_kind_mismatch')
        for node in path.nodes:
            source = self.sources.get(node.location.source_id)
            identity = self.identities.get(node.location.source_id)
            if source is None or identity is None or content_digest(source.content) != node.source_sha256 or identity.sha256 != node.source_sha256:
                gaps.append('source_digest_mismatch')
                continue
            try:
                extract_span(source.content, node.location)
                syntax = self.replay.nodes.get(node.location)
                expression = '<' + type(syntax).__name__ + '>'
                expected_id = stable_id('evidence-node', [node.location.model_dump(mode='json'), node.source_sha256, expression])
                if syntax is None or not node.redacted or node.expression != expression or node.node_id != expected_id:
                    gaps.append('ast_or_redaction_mismatch')
            except (ValueError, UnicodeError):
                gaps.append('span_mismatch')
        for edge in path.edges:
            if edge.conditions != path.context.conditions or edge.edge_id != edge_identity(edge.edge_type, edge.source_node, edge.target_node, edge.conditions):
                gaps.append('edge_identity_or_condition_mismatch')
        if operation.sink_location in self.replay.calls:
            conditions = tuple(c for span in (*operation.context.call_chain, operation.sink_location)
                               if span in self.replay.calls for c in self.replay.lexical_conditions(span))
            if operation.context.conditions != conditions:
                gaps.append('lexical_condition_mismatch')
        expected, required, error = self.assertions(operation)
        if error:
            gaps.append(error)
        else:
            witness = expected[claim.claim_type]
            complete = required | set(witness.edges)
            for kind, source, target in tuple(complete):
                if kind == 'KEY_TYPE_FLOW':
                    if source in self.replay.calls:
                        complete.update(self.replay.api_imports(source))
                    if target in self.replay.calls:
                        complete.update(self.replay.api_imports(target))
            positions = {node.location for node in path.nodes}
            if witness.nodes - positions or operation.sink_location not in positions:
                gaps.append('missing_required_node')
            actual = proof_edges(path)
            if complete - actual:
                gaps.append('missing_required_edge')
                gaps.extend('missing_' + kind for kind in sorted({e[0] for e in complete - actual}))
            if actual - complete:
                gaps.append('unproven_edge')
            if isinstance(claim.value, Known) and (not isinstance(witness.value, Known) or witness.value != claim.value):
                gaps.append('claim_value_not_proven')
            # Imports must precede their uses in the relevant module execution context.
            for kind, source, target in complete:
                if kind == 'IMPORT_BINDING' and source.source_id == target.source_id:
                    caller_cutoff = next((s for s in operation.context.call_chain if s.source_id == source.source_id), target)
                    if (source.start_line, source.start_col) >= (caller_cutoff.start_line, caller_cutoff.start_col):
                        gaps.append('import_after_use')
        gaps = list(dict.fromkeys(gaps))[:32]
        return path.model_copy(update={'verification_status': 'invalid' if gaps else 'valid',
                                       'historical_verification_status': path.historical_verification_status or ('valid' if not gaps else 'invalid'),
                                       'replay_status': 'requires_revalidation' if 'version_mismatch' in gaps else 'available', 'gaps': tuple(gaps)})


def grade(value, path: EvidencePath, claim_type: str) -> Claim:
    valid = path.verification_status == 'valid' and not path.gaps
    status = {'known': 'resolved', 'ambiguous': 'ambiguous', 'unknown': 'unknown'}[value.kind]
    if not valid and isinstance(value, Known):
        value, status = Unknown(reason='verification_failed'), 'unknown'
    level = 'E3' if valid and isinstance(value, Known) else 'E2' if path.edges else 'E1' if path.nodes else 'E0'
    return Claim(claim_type=claim_type, value=value, resolution_status=status, level=level,
                 evidence_ids=(path.evidence_id,), missing_edges=tuple(kind for kind in ('CALLS', 'IMPORT_BINDING', 'ASSIGN_FLOW', 'ARGUMENT_FLOW', 'RETURN_FLOW', 'KEY_TYPE_FLOW') if 'missing_' + kind in path.gaps), reasons=path.gaps if not valid else (() if isinstance(value, Known) else (getattr(value, 'reason', 'multiple_values'),)))


def grade_claims(claims: tuple[Claim, ...], checked: dict[str, EvidencePath]) -> tuple[Claim, ...]:
    by_type = {claim.claim_type: claim for claim in claims}
    order = ('ALGORITHM', 'OPERATION_TYPE', 'KEY_SOURCE', 'QUANTUM_CLASS')
    graded = tuple(grade(by_type[name].value, checked[name], name) for name in order)
    if graded[0].level != 'E3' and graded[3].level == 'E3':
        quantum = graded[3].model_copy(update={'value': Unknown(reason='algorithm_not_E3'),
                                              'resolution_status': 'unknown', 'level': 'E2', 'reasons': ('algorithm_not_E3',)})
        graded = (*graded[:3], quantum)
    return graded
