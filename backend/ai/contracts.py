from __future__ import annotations

from typing import Literal
from pydantic import BaseModel, ConfigDict, Field


class Opinion(BaseModel):
    model_config = ConfigDict(extra='forbid', strict=True)
    candidate_id: str = Field(min_length=1, max_length=64)
    algorithm: Literal['unknown', 'RSA', 'DSA', 'DH', 'EC', 'ECC', 'ECDSA', 'ECDH', 'EdDSA', 'Ed25519',
                       'Ed448', 'X25519', 'X448', 'RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512',
                       'ES256', 'ES256K', 'ES384', 'ES512', 'HS256', 'HS384', 'HS512', 'ML-KEM', 'ML-DSA', 'SLH-DSA']
    purpose: Literal['unknown', 'configuration', 'key_generation', 'key_import', 'sign', 'verify',
                     'encrypt', 'decrypt', 'key_exchange']
    opinion_kind: Literal['supports_static', 'questions_static', 'new_candidate', 'abstain']
    rationale: str = Field(min_length=1, max_length=400)
    missing_information: list[str] = Field(default_factory=list, max_length=3)
    evidence_ids: list[str] = Field(default_factory=list, max_length=8)
    missing_symbols: list[str] = Field(default_factory=list, max_length=3)
    basis: Literal['known_api', 'parameter_flow', 'implementation', 'insufficient'] = 'insufficient'
    blocking_gaps: list[str] = Field(default_factory=list, max_length=3)
    decision: Literal['identified', 'not_crypto', 'insufficient', 'conflict'] = 'insufficient'


class Submit(BaseModel):
    model_config = ConfigDict(extra='forbid', strict=True)
    source_task_id: str = Field(min_length=1, max_length=64)
    ai_profile_id: str | None = Field(default=None,max_length=64)
    ai_profile_version: str | None = Field(default=None,max_length=64)
