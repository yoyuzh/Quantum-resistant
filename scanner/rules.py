from __future__ import annotations

import re
from dataclasses import dataclass

@dataclass(frozen=True)
class AlgorithmProfile:
    name: str
    risk_level: str
    reason: str
    recommendation: str


@dataclass(frozen=True)
class Finding:
    line: int
    algorithm: str
    risk_level: str
    reason: str
    recommendation: str
    evidence: str
    detection_method: str | None = None
    library: str | None = None
    resolved_api: str | None = None


VULNERABLE_ALGOS: dict[str, AlgorithmProfile] = {
    "rsa": AlgorithmProfile(
        name="RSA",
        risk_level="高风险",
        reason="RSA 依赖大整数分解，Shor 算法可在容错量子计算环境下高效破解。",
        recommendation="密钥建立迁移到 FIPS 203 ML-KEM；签名迁移到 FIPS 204 ML-DSA。",
    ),
    "dsa": AlgorithmProfile(
        name="DSA",
        risk_level="高风险",
        reason="DSA 依赖离散对数难题，面向量子攻击时不再安全。",
        recommendation="使用 FIPS 204 ML-DSA 或其他后量子签名方案替代。",
    ),
    "dh": AlgorithmProfile(
        name="DH",
        risk_level="高风险",
        reason="Diffie-Hellman 依赖离散对数难题，Shor 算法可显著削弱其安全性。",
        recommendation="密钥交换迁移到 FIPS 203 ML-KEM。",
    ),
    "ecdh": AlgorithmProfile(
        name="ECDH",
        risk_level="高风险",
        reason="ECDH 建立在椭圆曲线离散对数问题之上，量子计算可高效求解。",
        recommendation="密钥交换迁移到 FIPS 203 ML-KEM。",
    ),
    "ecdsa": AlgorithmProfile(
        name="ECDSA",
        risk_level="高风险",
        reason="ECDSA 的安全性依赖椭圆曲线离散对数问题，量子攻击下存在根本风险。",
        recommendation="签名迁移到 FIPS 204 ML-DSA。",
    ),
    "ecc": AlgorithmProfile(
        name="ECC",
        risk_level="高风险",
        reason="ECC 家族依赖椭圆曲线离散对数问题，量子算法可系统性破坏其安全假设。",
        recommendation="按用途迁移到 FIPS 203 ML-KEM 或 FIPS 204 ML-DSA。",
    ),
    "x25519": AlgorithmProfile(
        name="X25519",
        risk_level="高风险",
        reason="X25519 属于椭圆曲线 Diffie-Hellman 密钥交换，量子计算可高效求解其离散对数基础。",
        recommendation="密钥交换迁移到 FIPS 203 ML-KEM，或在过渡期使用经评估的混合密钥交换。",
    ),
    "x448": AlgorithmProfile(
        name="X448",
        risk_level="高风险",
        reason="X448 属于椭圆曲线 Diffie-Hellman 密钥交换，量子计算可高效求解其离散对数基础。",
        recommendation="密钥交换迁移到 FIPS 203 ML-KEM，或在过渡期使用经评估的混合密钥交换。",
    ),
    "eddsa": AlgorithmProfile(
        name="EdDSA",
        risk_level="高风险",
        reason="EdDSA 是椭圆曲线签名家族，曲线尚未确认（可为 Ed25519 或 Ed448）；量子攻击可破坏其离散对数基础。",
        recommendation="签名迁移到 FIPS 204 ML-DSA；长期归档可评估 FIPS 205 SLH-DSA。",
    ),
    "ed25519": AlgorithmProfile(
        name="Ed25519",
        risk_level="高风险",
        reason="Ed25519 属于椭圆曲线签名算法，量子攻击下其离散对数安全假设不再成立。",
        recommendation="签名迁移到 FIPS 204 ML-DSA；长期归档或高安全等级场景可评估 FIPS 205 SLH-DSA。",
    ),
    "ed448": AlgorithmProfile(
        name="Ed448",
        risk_level="高风险",
        reason="Ed448 属于椭圆曲线签名算法，量子攻击下其离散对数安全假设不再成立。",
        recommendation="签名迁移到 FIPS 204 ML-DSA；长期归档或高安全等级场景可评估 FIPS 205 SLH-DSA。",
    ),
}


DIRECT_REGEX_RULES: tuple[tuple[str, re.Pattern[str], str], ...] = (
    (
        "rsa",
        re.compile(r"\bcryptography\.hazmat\.primitives\.asymmetric\.rsa\.generate_private_key\s*\("),
        "cryptography.hazmat.primitives.asymmetric.rsa.generate_private_key",
    ),
    ("rsa", re.compile(r"\bRSA\.generate\s*\("), "RSA.generate"),
    (
        "rsa",
        re.compile(r"\b(?:RSA\.Create|RSACryptoServiceProvider|RSAOpenSsl|RSACng)\s*\("),
        ".NET RSA API",
    ),
    ("dsa", re.compile(r"\bDSA\.generate\s*\("), "DSA.generate"),
    (
        "dsa",
        re.compile(r"\b(?:DSA\.Create|DSACryptoServiceProvider|DSACng)\s*\("),
        ".NET DSA API",
    ),
    (
        "dh",
        re.compile(r"\bcryptography\.hazmat\.primitives\.asymmetric\.dh\.generate_parameters\s*\("),
        "cryptography.hazmat.primitives.asymmetric.dh.generate_parameters",
    ),
    (
        "ecc",
        re.compile(r"\bcryptography\.hazmat\.primitives\.asymmetric\.ec\.generate_private_key\s*\("),
        "cryptography.hazmat.primitives.asymmetric.ec.generate_private_key",
    ),
    (
        "ecdh",
        re.compile(r"\bcryptography\.hazmat\.primitives\.asymmetric\.ec\.ECDH\s*\("),
        "cryptography.hazmat.primitives.asymmetric.ec.ECDH",
    ),
    (
        "ecdsa",
        re.compile(r"\bcryptography\.hazmat\.primitives\.asymmetric\.ec\.ECDSA\s*\("),
        "cryptography.hazmat.primitives.asymmetric.ec.ECDSA",
    ),
    ("ecdsa", re.compile(r"\becdsa\.SigningKey\.generate\s*\("), "ecdsa.SigningKey.generate"),
    (
        "ecdh",
        re.compile(r"\b(?:ECDiffieHellman\.Create|ECDiffieHellmanCng|ECDiffieHellmanOpenSsl)\s*\("),
        ".NET ECDiffieHellman API",
    ),
    (
        "ecdsa",
        re.compile(r"\b(?:ECDsa\.Create|ECDsaCng|ECDsaOpenSsl)\s*\("),
        ".NET ECDsa API",
    ),
    (
        "x25519",
        re.compile(
            r"\bcryptography\.hazmat\.primitives\.asymmetric\.x25519\.X25519PrivateKey\.generate\s*\("
        ),
        "cryptography.hazmat.primitives.asymmetric.x25519.X25519PrivateKey.generate",
    ),
    (
        "x448",
        re.compile(
            r"\bcryptography\.hazmat\.primitives\.asymmetric\.x448\.X448PrivateKey\.generate\s*\("
        ),
        "cryptography.hazmat.primitives.asymmetric.x448.X448PrivateKey.generate",
    ),
    (
        "ed25519",
        re.compile(
            r"\bcryptography\.hazmat\.primitives\.asymmetric\.ed25519\.Ed25519PrivateKey\.generate\s*\("
        ),
        "cryptography.hazmat.primitives.asymmetric.ed25519.Ed25519PrivateKey.generate",
    ),
    (
        "ed448",
        re.compile(
            r"\bcryptography\.hazmat\.primitives\.asymmetric\.ed448\.Ed448PrivateKey\.generate\s*\("
        ),
        "cryptography.hazmat.primitives.asymmetric.ed448.Ed448PrivateKey.generate",
    ),
)


SENSITIVE_STRING_CONTEXT_RE = re.compile(
    r"(algorithm|alg|jwt|ssh|tls|ssl|cipher|signature|key|pem|cert|certificate)",
    re.IGNORECASE,
)


STRING_IDENTIFIER_RULES: tuple[tuple[str, re.Pattern[str], str], ...] = (
    ("rsa", re.compile(r"\b(?:RS(?:256|384|512)|PS(?:256|384|512)|ssh-rsa|rsa-sha2-\d+)\b"), "算法标识"),
    ("dsa", re.compile(r"\b(?:ssh-dss|DSA)\b"), "算法标识"),
    ("ecdsa", re.compile(r"\b(?:ES(?:256|384|512)|ecdsa-sha2-[A-Za-z0-9_-]+)\b"), "算法标识"),
    ("eddsa", re.compile(r"\bEdDSA\b"), "算法标识（曲线未确认）"),
    ("ed25519", re.compile(r"\b(?:Ed25519|ssh-ed25519)\b"), "算法标识"),
    ("ed448", re.compile(r"\b(?:Ed448)\b"), "算法标识"),
    ("x25519", re.compile(r"\b(?:X25519|x25519)\b"), "算法标识"),
    ("x448", re.compile(r"\b(?:X448|x448)\b"), "算法标识"),
)


PEM_HEADER_RULES: tuple[tuple[str, re.Pattern[str], str], ...] = (
    ("rsa", re.compile(r"-----BEGIN RSA (?:PRIVATE|PUBLIC) KEY-----"), "PEM RSA key header"),
    ("dsa", re.compile(r"-----BEGIN DSA (?:PRIVATE|PUBLIC) KEY-----"), "PEM DSA key header"),
    ("ecc", re.compile(r"-----BEGIN EC (?:PRIVATE|PUBLIC) KEY-----"), "PEM EC key header"),
)


ALIAS_REGEX_RULES: dict[str, tuple[tuple[str, str, str], ...]] = {
    "rsa": (
        ("rsa", r"\b{alias}\.generate_private_key\s*\(", "{alias}.generate_private_key"),
        ("rsa", r"\b{alias}\.generate\s*\(", "{alias}.generate"),
    ),
    "dsa": (
        ("dsa", r"\b{alias}\.generate_private_key\s*\(", "{alias}.generate_private_key"),
        ("dsa", r"\b{alias}\.generate\s*\(", "{alias}.generate"),
    ),
    "dh": (
        ("dh", r"\b{alias}\.generate_parameters\s*\(", "{alias}.generate_parameters"),
        ("dh", r"\b{alias}\.generate_private_key\s*\(", "{alias}.generate_private_key"),
    ),
    "ecc": (
        ("ecc", r"\b{alias}\.generate_private_key\s*\(", "{alias}.generate_private_key"),
        ("ecdh", r"\b{alias}\.ECDH\s*\(", "{alias}.ECDH"),
        ("ecdsa", r"\b{alias}\.ECDSA\s*\(", "{alias}.ECDSA"),
    ),
    "ecdh": (
        ("ecdh", r"\b{alias}\s*\(", "{alias}"),
    ),
    "ecdsa": (
        ("ecdsa", r"\b{alias}\s*\(", "{alias}"),
        ("ecdsa", r"\b{alias}\.generate\s*\(", "{alias}.generate"),
    ),
    "x25519": (
        ("x25519", r"\b{alias}\.X25519PrivateKey\.generate\s*\(", "{alias}.X25519PrivateKey.generate"),
    ),
    "x448": (
        ("x448", r"\b{alias}\.X448PrivateKey\.generate\s*\(", "{alias}.X448PrivateKey.generate"),
    ),
    "ed25519": (
        ("ed25519", r"\b{alias}\.Ed25519PrivateKey\.generate\s*\(", "{alias}.Ed25519PrivateKey.generate"),
    ),
    "ed448": (
        ("ed448", r"\b{alias}\.Ed448PrivateKey\.generate\s*\(", "{alias}.Ed448PrivateKey.generate"),
    ),
}


MODULE_HINTS: tuple[tuple[str, str], ...] = (
    ("cryptography.hazmat.primitives.asymmetric.rsa", "rsa"),
    ("cryptography.hazmat.primitives.asymmetric.dsa", "dsa"),
    ("cryptography.hazmat.primitives.asymmetric.dh", "dh"),
    ("cryptography.hazmat.primitives.asymmetric.ec", "ecc"),
    ("cryptography.hazmat.primitives.asymmetric.x25519", "x25519"),
    ("cryptography.hazmat.primitives.asymmetric.x448", "x448"),
    ("cryptography.hazmat.primitives.asymmetric.ed25519", "ed25519"),
    ("cryptography.hazmat.primitives.asymmetric.ed448", "ed448"),
    ("Crypto.PublicKey.RSA", "rsa"),
    ("Crypto.PublicKey.DSA", "dsa"),
    ("Crypto.PublicKey.ECC", "ecc"),
    ("ecdsa", "ecdsa"),
)


NAME_HINTS: dict[str, str] = {
    "rsa": "rsa",
    "dsa": "dsa",
    "dh": "dh",
    "ecdh": "ecdh",
    "ecdsa": "ecdsa",
    "ecc": "ecc",
    "ec": "ecc",
    "ellipticcurve": "ecc",
    "x25519": "x25519",
    "x448": "x448",
    "ed25519": "ed25519",
    "ed448": "ed448",
}
