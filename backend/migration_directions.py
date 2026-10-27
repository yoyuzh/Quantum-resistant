"""Versioned reference directions; never assert drop-in API compatibility."""
from __future__ import annotations

PURPOSES = {'sign': '数字签名', 'verify': '验签', 'key_exchange': '密钥建立',
            'key_generation': '密钥生成', 'key_import': '密钥导入', 'configuration': '算法配置',
            'encrypt': '加密', 'decrypt': '解密', 'unknown': '用途待确认'}


def effective_purpose(row: dict) -> str:
    return row.get('effective_purpose_code', row.get('purpose_code', 'unknown'))


def direction(algorithm: str, purpose: str) -> dict:
    from backend.analysis import STANDARD_URL
    targets = ['ML-DSA', 'SLH-DSA'] if purpose in ('sign', 'verify') else ['ML-KEM'] if purpose == 'key_exchange' else []
    references = []
    if targets:
        references.append({'label': ' / '.join(targets), 'targets': targets, 'kind': 'purpose_reference',
                           'condition': '核对协议、格式及参与方兼容性'})
    else:
        if algorithm in ('RSA', 'ECC', 'ECDSA', 'DSA', 'EdDSA', 'Ed25519', 'Ed448'):
            references.append({'label': '签名场景：ML-DSA / SLH-DSA', 'targets': ['ML-DSA', 'SLH-DSA'],
                               'kind': 'conditional', 'condition': '仅在用于签名或验签时适用'})
        if algorithm in ('RSA', 'ECC', 'ECDH', 'DH', 'X25519', 'X448'):
            references.append({'label': '密钥建立场景：ML-KEM', 'targets': ['ML-KEM'],
                               'kind': 'conditional', 'condition': '需确认密钥建立或混合加密协议设计，不能直接替换加解密API'})
    return {'purpose': PURPOSES.get(purpose, PURPOSES['unknown']), 'purpose_code': purpose,
            'targets': targets, 'migration_references': references, 'reference_url': STANDARD_URL,
            'reference_version': 'nist-fips-203-204-205-v1'}
