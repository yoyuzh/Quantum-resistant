"""Adopt model judgments explicitly, without assigning static evidence grades."""
from __future__ import annotations
import ast
import io
import re
import tokenize

ALIASES = {'EC': 'ECC', **{a: 'RSA' for a in ('RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512')},
           **{a: 'ECDSA' for a in ('ES256', 'ES256K', 'ES384', 'ES512')}}


def scope_check(opinion):
    """Reject known generic interfaces without an algorithm binding in supplied code.

    This is an adoption restriction, not a new trusted API or static proof.
    """
    location = opinion.get('candidate_location', {})
    focus = []
    for citation in opinion.get('citations', []):
        offset = location.get('line', 0) - citation.get('start_line', 0)
        lines = citation.get('text', '').splitlines()
        if citation.get('source_id') == location.get('source_id') and 0 <= offset < len(lines):
            focus.append(lines[offset])
    generic = re.search(r'\b(?:JsonWebEncryption|JsonWebSignature)\s*\(|\bjwt\.(?:encode|decode)\s*\(', '\n'.join(focus))
    if not generic:
        return True, ''
    if 'JsonWeb' in generic.group() and opinion.get('purpose') not in ('configuration', 'unknown'):
        return False, 'operation_not_at_focus'
    algorithm = ALIASES.get(opinion['algorithm'], opinion['algorithm'])
    for citation in opinion.get('citations', []):
        try:
            for token in tokenize.generate_tokens(io.StringIO(citation.get('text','')).readline):
                if token.type != tokenize.STRING or len(token.string) > 160:
                    continue
                try:
                    value = ast.literal_eval(token.string)
                except (ValueError, SyntaxError):
                    continue
                if isinstance(value,str) and (ALIASES.get(value,value)==algorithm or algorithm=='ECDH' and value.startswith('ECDH-')):
                    return True, ''
        except (tokenize.TokenError, IndentationError):
            pass
    return False, 'algorithm_binding_missing'


def assess(opinion, row):
    scoped, reason = scope_check(opinion)
    if not scoped:
        return False, reason
    algorithm = ALIASES.get(opinion['algorithm'], opinion['algorithm'])
    existing = ALIASES.get(row['algorithm'], row['algorithm'])
    conflict = opinion['opinion_kind'] == 'questions_static' or opinion.get('decision') == 'conflict' or (
        existing not in ('unknown', '算法待确认') and algorithm != 'unknown' and existing != algorithm)
    if conflict:
        return False, 'conflicting_evidence'
    if opinion.get('blocking_gaps'):
        return False, 'missing_implementation'
    if algorithm == 'unknown':
        return False, 'algorithm_unknown'
    location = opinion.get('candidate_location', {})
    anchored = any(c.get('source_id') == location.get('source_id')
                   and c.get('start_line', 0) <= location.get('line', -1) <= c.get('end_line', 0)
                   for c in opinion.get('citations', []))
    if opinion.get('citation_status') != 'valid' or not anchored:
        return False, 'evidence_not_anchored'
    if opinion.get('basis') not in ('known_api', 'parameter_flow', 'implementation'):
        return False, 'insufficient_basis'
    return True, 'evidence_based_ai_judgment'
