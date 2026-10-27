"""Local declarative API subset. No vendored CBOMkit code or library imports."""
from __future__ import annotations

from dataclasses import dataclass

from scanner.api_catalog import RULES_VERSION, JWT_ALGORITHMS, api_algorithm
ENGINE_VERSION = 'deep-ast-2'
VERIFIER_VERSION = 'ast-witness-2'
LIBRARY_PROFILES = ('PyJWT 2.10.1', 'cryptography 45 API subset', 'PyCryptodome 3.23.0', 'python-ecdsa default-curve subset')
PYCA = 'cryptography.hazmat.primitives.'


@dataclass(frozen=True)
class Rule:
    api: str
    library: str
    operation: str
    algorithm: str | None
    key_type: str | None = None
    required: tuple[str, ...] = ('IMPORT_BINDING',)
    # Explicit signature subset; omitted optional arguments do not imply defaults.
    parameters: tuple[str, ...] = ()
    optional: tuple[str, ...] = ()
    keyword_only: tuple[str, ...] = ()


def _rules() -> tuple[Rule, ...]:
    rules = [Rule('jwt.encode', 'PyJWT', 'sign', None), Rule('jwt.decode', 'PyJWT', 'verify', None)]
    rules.append(Rule('ecdsa.SigningKey.generate', 'ecdsa', 'key_generation', 'ECDSA', 'ECDSA:private',
                      optional=('curve', 'entropy', 'hashfunc')))
    for suffix, algorithm, parameters in (
        ('rsa.generate_private_key', 'RSA', ('public_exponent', 'key_size')),
        ('ec.generate_private_key', 'EC', ('curve',)),
        ('ed25519.Ed25519PrivateKey.generate', 'Ed25519', ()),
        ('x25519.X25519PrivateKey.generate', 'X25519', ()),
    ):
        rules.append(Rule(PYCA + 'asymmetric.' + suffix, 'cryptography', 'key_generation', algorithm,
                          algorithm + ':private', parameters=parameters, optional=('backend',)))
    for algorithm in ('ed25519', 'x25519'):
        for role in ('Private', 'Public'):
            family = algorithm.title().replace('Ed', 'Ed').replace('X', 'X')
            api = PYCA + f'asymmetric.{algorithm}.{family}{role}Key.from_{role.lower()}_bytes'
            rules.append(Rule(api, 'cryptography', 'key_import', family,
                              family + ':' + role.lower(), parameters=('data',)))
    for role in ('private', 'public'):
        rules.append(Rule(PYCA + 'serialization.load_pem_' + role + '_key', 'cryptography', 'key_import', None,
                          'generic:' + role, parameters=('data', 'password') if role == 'private' else ('data',),
                          optional=('backend',)))
    for family in ('RSA', 'ECC', 'DSA'):
        for method in ('generate', 'import_key', 'importKey'):
            generating = method == 'generate'
            parameters = (('curve',) if family == 'ECC' else ('bits',)) if generating else ('extern_key',)
            if generating:
                optional = {'RSA': ('randfunc', 'e'), 'ECC': ('randfunc',), 'DSA': ('randfunc', 'domain')}[family]
            else:
                parameters = ('encoded',) if family == 'ECC' else ('extern_key',)
                optional = ('passphrase', 'curve_name') if family == 'ECC' else ('passphrase',)
            if family == 'ECC' and method == 'importKey':
                continue
            rules.append(Rule(f'Crypto.PublicKey.{family}.{method}', 'PyCryptodome',
                              'key_generation' if generating else 'key_import', family, 'pycrypto:' + family + ':either',
                              parameters=parameters, optional=tuple(p for p in optional if p not in parameters),
                              keyword_only=(*parameters, *optional) if family == 'ECC' and generating else ()))
    for scheme in ('pkcs1_15', 'pss', 'DSS'):
        rules.append(Rule(f'Crypto.Signature.{scheme}.new', 'PyCryptodome', 'unknown', None,
                          parameters=('key', 'mode') if scheme == 'DSS' else ('rsa_key',),
                          optional=('encoding', 'randfunc') if scheme == 'DSS' else ('mask_func', 'salt_bytes', 'rand_func') if scheme == 'pss' else (),
                          keyword_only=('mask_func', 'salt_bytes', 'rand_func') if scheme == 'pss' else ()))
    return tuple(Rule(**{**rule.__dict__, 'algorithm': api_algorithm(rule.api) or rule.algorithm}) for rule in rules)


RULES = {rule.api: rule for rule in _rules()}

KEY_FAMILIES = frozenset({'RSA', 'EC', 'ECC', 'DSA', 'ECDSA', 'Ed25519', 'X25519'})


def method_rule(key_type: str | None, method: str) -> tuple[str, str] | None:
    if key_type is None:
        return None
    parts = key_type.split(':')
    family, role = parts[:2]
    if family == 'signer':
        return (method, parts[2]) if method in ('sign', 'verify') else None
    if family == 'X25519':
        return ('key_exchange', family) if method == 'exchange' and role == 'private' else None
    if family == 'EC' and method == 'exchange' and role == 'private':
        return 'key_exchange', family
    if family == 'RSA' and ((method == 'encrypt' and role == 'public') or (method == 'decrypt' and role == 'private')):
        return method, family
    if family in ('RSA', 'EC', 'Ed25519', 'ECDSA'):
        if method == 'sign' and role in ('private', 'either'):
            return method, family
        if method == 'verify' and role in ('public', 'either'):
            return method, family
    return None


def method_parameters(key_type: str, method: str) -> tuple[str, ...]:
    if key_type.startswith('signer:'):
        return ('msg_hash',) if method == 'sign' else ('msg_hash', 'signature')
    family = key_type.split(':')[0]
    if method == 'exchange':
        return ('algorithm', 'peer_public_key') if family == 'EC' else ('peer_public_key',)
    if method in ('encrypt', 'decrypt'):
        return ('plaintext' if method == 'encrypt' else 'ciphertext', 'padding')
    data = ('data',) if method == 'sign' else ('signature', 'data')
    if family == 'RSA':
        return (*data, 'padding', 'algorithm')
    if family == 'EC':
        return (*data, 'signature_algorithm')
    return data


def classification(algorithm: str) -> tuple[str | None, str]:
    if algorithm in JWT_ALGORITHMS:
        return JWT_ALGORITHMS[algorithm]
    if algorithm in KEY_FAMILIES:
        return algorithm, 'quantum_vulnerable'
    return None, 'unknown'
