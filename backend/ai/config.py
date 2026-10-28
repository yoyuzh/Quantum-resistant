from __future__ import annotations

import hashlib
import ipaddress
import json
import os
import secrets
from dataclasses import dataclass, field, replace
from threading import RLock
from urllib.parse import urlsplit, urlunsplit

from pydantic import BaseModel, ConfigDict, Field

BUDGETS = dict(search_files=5000, search_bytes=100 * 1024 * 1024, groups=1024, calls=384,
               seconds=900, request_seconds=45, request_bytes=128 * 1024, output_tokens=8192,
               total_request_bytes=32 * 1024 * 1024, response_bytes=512 * 1024, batch=12, repair_batch=4, concurrency=2)
POLICY = 'redacted-evidence-3'


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False, separators=(',', ':')).encode()).hexdigest()


def endpoint(value):
    if any(ord(c) <= 32 or ord(c) == 127 for c in value) or '\\' in value:
        raise ValueError('模型地址格式无效')
    parts = urlsplit(value)
    if parts.username is not None or parts.password is not None or '?' in value or '#' in value or not parts.hostname:
        raise ValueError('模型地址不能包含凭据、参数或片段')
    host = parts.hostname
    try:
        local = ipaddress.ip_address(host).is_loopback
    except ValueError:
        local = host == 'localhost'
    if parts.scheme != 'https' and not (parts.scheme == 'http' and local):
        raise ValueError('模型地址需使用HTTPS；HTTP仅允许本机回环地址')
    _ = parts.port
    return urlunsplit((parts.scheme, parts.netloc, parts.path.rstrip('/') + '/', '', ''))


class Settings(BaseModel):
    model_config = ConfigDict(extra='forbid', strict=True)
    preset: str = Field(default='deepseek', min_length=1, max_length=32)
    base_url: str = Field(default='https://api.deepseek.com/v1', max_length=2048)
    model: str = Field(default='deepseek-flash', min_length=1, max_length=120)
    api_key: str = Field(default='', max_length=8192, repr=False)
    consent: bool = False
    json_mode: bool = True
    output_parameter: str = Field(default='max_tokens', pattern='^(max_tokens|max_completion_tokens)$')
    reasoning_disabled: bool = True
    remember: bool = False
    protocol: str = Field(default='', pattern='^(|chat|responses|anthropic|gemini)$')
    auth_mode: str = Field(default='', pattern='^(|bearer|api-key|x-api-key|x-goog-api-key|none)$')
    output_mode: str = Field(default='', pattern='^(|schema|json|prompt)$')
    region: str = Field(default='', max_length=32)


@dataclass(frozen=True)
class Config:
    base_url: str = ''
    model: str = ''
    api_key: str = field(default='', repr=False)
    consent: bool = False
    preset: str = 'deepseek'
    json_mode: bool = True
    output_parameter: str = 'max_tokens'
    reasoning_disabled: bool = True
    version: str = field(default_factory=lambda: secrets.token_hex(16))
    protocol: str = 'chat'
    auth_mode: str = 'bearer'
    output_mode: str = 'json'
    region: str = ''
    profile_id: str = ''
    profile_name: str = ''

    @property
    def ready(self):
        return bool(self.base_url and self.model and self.consent and (self.auth_mode == 'none' or self.api_key))

    def public(self):
        return {k: getattr(self, k) for k in ('base_url', 'model', 'consent', 'preset', 'json_mode',
                'output_parameter', 'reasoning_disabled', 'version', 'protocol', 'auth_mode', 'output_mode', 'region', 'profile_id', 'profile_name')} | {
                    'configured': bool(self.base_url and self.model), 'has_key': bool(self.api_key),
                    'ready': self.ready, 'policy_version': POLICY, 'budgets': BUDGETS}


class ConfigStore:
    def __init__(self):
        self.lock = RLock()
        self.value = Config()
        env = os.environ
        if env.get('QUANTUM_AI_ENABLED', '').lower() in ('true', '1'):
            try:
                self.update(Settings(base_url=env.get('QUANTUM_AI_BASE_URL', 'https://api.deepseek.com/v1'),
                    model=env.get('QUANTUM_AI_MODEL', 'deepseek-flash'), api_key=env.get('QUANTUM_AI_API_KEY', ''),
                    consent=env.get('QUANTUM_AI_CONSENT', '').lower() in ('true', '1')))
            except ValueError:
                pass

    def get(self):
        with self.lock:
            return self.value

    def update(self, request):
        from backend.ai.providers import defaults
        provider = defaults(request.preset)
        url = endpoint(request.base_url)
        protocol=request.protocol or provider['protocol']
        output=request.output_mode or (provider['output_mode'] if request.json_mode else 'prompt')
        if protocol=='anthropic' and output=='json':
            raise ValueError('Anthropic请使用JSON Schema或提示约束JSON')
        if any(ord(c) < 32 or ord(c) == 127 for c in request.model) or not request.api_key.isascii():
            raise ValueError('模型名称或凭据格式无效')
        if any(ord(c) < 32 or ord(c) == 127 for c in request.api_key):
            raise ValueError('凭据格式无效')
        with self.lock:
            old = self.value
            key = request.api_key or (old.api_key if url == old.base_url else '')
            updated = Config(url, request.model, key, request.consent, request.preset, request.json_mode,
                             request.output_parameter, request.reasoning_disabled, version=old.version,
                             protocol=request.protocol or provider['protocol'], auth_mode=request.auth_mode or provider['auth_mode'],
                             output_mode=request.output_mode or (provider['output_mode'] if request.json_mode else 'prompt'), region=request.region,
                             profile_id=old.profile_id, profile_name=old.profile_name)
            self.value = replace(updated, version=secrets.token_hex(16)) if updated != old else old
            return self.value

    def clear_key(self):
        with self.lock:
            self.value = replace(self.value, api_key='', consent=False, version=secrets.token_hex(16))
