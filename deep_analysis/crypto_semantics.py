"""Domain proposals from unverified semantic facts; no evidence grades here."""
from __future__ import annotations

from dataclasses import dataclass, replace

from deep_analysis.crypto_rules import RULES, classification, method_rule, JWT_ALGORITHMS
from deep_analysis.identity import stable_id
from deep_analysis.key_flow import mapping_field
from deep_analysis.models import Alternative, Ambiguous, Known, Unknown
from deep_analysis.semantic_models import Candidate, Fact


@dataclass(frozen=True)
class Proposal:
    candidate: Candidate
    api: str
    library: str
    operation: str
    facts: tuple[tuple[str, Fact], ...]
    family: str | None
    risk: str


def absent(reason: str) -> Fact:
    return Fact(stable_id('missing', reason), Unknown(reason=reason))


def allowed_algorithm(fact: Fact) -> Fact:
    """Do not export arbitrary source strings disguised as algorithm names."""
    values = (fact.value.value,) if isinstance(fact.value, Known) else tuple(a.value for a in fact.value.alternatives)
    allowed = set(JWT_ALGORITHMS) | {'RSA', 'EC', 'ECC', 'DSA', 'Ed25519', 'X25519'}
    if any(type(v) is not str or v not in allowed for v in values):
        return replace(fact, value=Unknown(reason='unsupported_algorithm'))
    return fact


def jwt_algorithm(candidate: Candidate) -> tuple[Fact, str]:
    operation = 'sign' if candidate.api == 'jwt.encode' else 'verify'
    arguments = dict(candidate.arguments)
    if operation == 'sign':
        fact = arguments.get('algorithm', absent('unspecified_algorithm'))
        headers = arguments.get('headers')
        header_alg = mapping_field(headers, 'alg')
        if header_alg is not None:
            fact = header_alg
        elif headers is not None and not (isinstance(headers.value, Unknown) and headers.value.reason in {'unspecified_api_parameter', 'uninstantiated_template'}) and not (isinstance(headers.value, Known) and headers.value.value is None):
            if headers.items is None:
                fact = absent('headers_algorithm_override')
    else:
        options = arguments.get('options')
        flag = mapping_field(options, 'verify_signature')
        if flag is not None and isinstance(flag.value, Known) and flag.value.value is False:
            return replace(flag, value=Unknown(reason='verification_disabled')), 'unknown'
        if options is not None and not (isinstance(options.value, Unknown) and options.value.reason == 'unspecified_api_parameter') and options.items is None and not (isinstance(options.value, Known) and options.value.value is None):
            return absent('unknown_verification_options'), 'unknown'
        if flag is not None and not (isinstance(flag.value, Known) and flag.value.value is True):
            return absent('unknown_verification_options'), 'unknown'
        fact = arguments.get('algorithms', absent('unspecified_algorithm'))
        if fact.items is not None:
            items = fact.items
            if len(items) == 1:
                fact = items[0]
            elif 1 < len(items) <= 4 and all(isinstance(item.value, Known) and type(item.value.value) is str and item.value.value in JWT_ALGORITHMS for item in items):
                unique = tuple(dict.fromkeys(item.value.value for item in items))
                value = Known(value=unique[0]) if len(unique) == 1 else Ambiguous(alternatives=tuple(Alternative(value=v) for v in unique))
                fact = replace(fact, value=value, steps=tuple(dict.fromkeys(s for item in items for s in item.steps)))
            else:
                fact = replace(fact, value=Unknown(reason='unknown_algorithm_allowlist'))
    if isinstance(fact.value, Unknown) and fact.value.reason == 'unspecified_api_parameter':
        fact = replace(fact, value=Unknown(reason='unspecified_algorithm'))
    return allowed_algorithm(fact), operation


def propose(candidate: Candidate, method: str | None = None) -> Proposal | None:
    rule = RULES.get(candidate.api)
    arguments = dict(candidate.arguments)
    if rule and rule.api.startswith('Crypto.Signature.'):
        return None  # A signer construction is not a sign/verify operation.
    if rule:
        operation, library, api = rule.operation, rule.library, rule.api
        if library == 'PyJWT':
            algorithm, operation = jwt_algorithm(candidate)
            key = arguments.get('key', absent('unknown_key_source'))
        else:
            key = arguments.get('@result', absent('unknown_key_source'))
            algorithm = replace(key, value=Known(value=rule.algorithm)) if rule.algorithm and key.key_type else replace(key, value=Unknown(reason='generic_key_type'))
        role_fact = Fact(stable_id('role', [api, operation]), Known(value=operation))
    else:
        key = arguments.get('@receiver', absent('unsupported_receiver'))
        match = method_rule(key.key_type, method or '')
        if not match:
            return None
        operation, family = match
        library = 'PyCryptodome' if key.key_type.startswith('signer:') else 'cryptography'
        api = library + '.' + key.key_type + '.' + method
        algorithm = replace(key, value=Known(value=family))
        role_fact = replace(key, value=Known(value=operation))
    family, risk = classification(algorithm.value.value) if isinstance(algorithm.value, Known) else (None, 'unknown')
    source = key.key_origin
    if source is None and isinstance(key.value, Known) and key.steps:
        source = key.steps[0].source
    key_fact = replace(key, value=Known(value=stable_id('key-source', source.model_dump(mode='json')))) if source else replace(key, value=Unknown(reason='unknown_key_source'))
    quantum = replace(algorithm, value=Known(value=risk)) if risk != 'unknown' else replace(algorithm, value=Unknown(reason='unverified_algorithm_class'))
    return Proposal(candidate, api, library, operation,
                    (('ALGORITHM', algorithm), ('OPERATION_TYPE', role_fact), ('KEY_SOURCE', key_fact), ('QUANTUM_CLASS', quantum)), family, risk)
