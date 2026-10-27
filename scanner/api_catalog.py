"""Shared imported API and JWT algorithm identities; no library execution."""
from __future__ import annotations

RULES_VERSION = "crypto-rules-3"

# Only exact, imported public targets establish an algorithm.
_PREFIX = "cryptography.hazmat.primitives.asymmetric."
API_ALGORITHMS = {
    _PREFIX + "rsa.generate_private_key": "rsa",
    _PREFIX + "dsa.generate_private_key": "dsa",
    _PREFIX + "dh.generate_parameters": "dh",
    _PREFIX + "ec.generate_private_key": "ecc",
    _PREFIX + "ec.ECDH": "ecdh",
    _PREFIX + "ec.ECDSA": "ecdsa",
    _PREFIX + "ec.derive_private_key": "ecc",
    _PREFIX + "ec.EllipticCurvePublicKey.from_encoded_point": "ecc",
    "ecdsa.SigningKey.generate": "ecdsa",
}
# Explicit number/point/byte constructors have a known algorithm, unlike PEM/DER loaders.
for _module, _algorithm in (("RSA", "rsa"), ("DSA", "dsa"), ("ECC", "ecc")):
    for _method in ("generate", "import_key", "construct"):
        API_ALGORITHMS[f"Crypto.PublicKey.{_module}.{_method}"] = _algorithm
    if _module in {"RSA", "DSA"}:
        API_ALGORITHMS[f"Crypto.PublicKey.{_module}.importKey"] = _algorithm
for _curve, _cls in (("x25519", "X25519"), ("x448", "X448"), ("ed25519", "Ed25519"), ("ed448", "Ed448")):
    API_ALGORITHMS[f"{_PREFIX}{_curve}.{_cls}PrivateKey.generate"] = _curve
    API_ALGORITHMS[f"{_PREFIX}{_curve}.{_cls}PrivateKey.from_private_bytes"] = _curve
    API_ALGORITHMS[f"{_PREFIX}{_curve}.{_cls}PublicKey.from_public_bytes"] = _curve
for _algorithm, _module, _private, _public in (
    ("rsa", "rsa", "RSAPrivateNumbers", "RSAPublicNumbers"),
    ("dsa", "dsa", "DSAPrivateNumbers", "DSAPublicNumbers"),
    ("dh", "dh", "DHPrivateNumbers", "DHPublicNumbers"),
    ("ecc", "ec", "EllipticCurvePrivateNumbers", "EllipticCurvePublicNumbers"),
):
    API_ALGORITHMS[f"{_PREFIX}{_module}.{_private}"] = _algorithm
    API_ALGORITHMS[f"{_PREFIX}{_module}.{_public}"] = _algorithm

JWT_ALGORITHMS = {
    **{a: ('RSA', 'quantum_vulnerable') for a in ('RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512')},
    **{a: ('EC', 'quantum_vulnerable') for a in ('ES256', 'ES384', 'ES512', 'ES256K')},
    **{a: ('HMAC-SHA' + a[2:], 'symmetric') for a in ('HS256', 'HS384', 'HS512')},
    'EdDSA': ('EdDSA', 'quantum_vulnerable'),
}

def api_algorithm(api: str) -> str | None:
    name = API_ALGORITHMS.get(api)
    if name == 'ecc':
        return 'ECC' if api.startswith('Crypto.') else 'EC'
    return {'ed25519': 'Ed25519', 'ed448': 'Ed448', 'eddsa': 'EdDSA'}.get(name, name.upper() if name else None)
