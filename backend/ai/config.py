from __future__ import annotations

import hashlib
import hmac
import ipaddress
import os
import secrets
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path
import re
from typing import Mapping
from urllib.parse import urlsplit, urlunsplit

from backend.ai.models import stable_digest

# 首版硬上限；环境配置只允许下调。
LIMITS = {
    "preview_files": 20, "preview_candidates": 40, "context_bytes": 128 * 1024,
    "candidate_bytes": 8 * 1024, "search_files": 200, "search_bytes": 8 * 1024 * 1024,
    "prepare_seconds": 30, "batch_candidates": 5, "request_bytes": 32 * 1024,
    "max_calls": 8, "task_seconds": 120, "request_seconds": 30,
    "response_bytes": 256 * 1024, "output_tokens": 2048, "model_concurrency": 1,
}
_VERSION_KEY = secrets.token_bytes(32)
_ENV_NAME = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")


def _read_dotenv(path: Path) -> dict[str, str]:
    values = {}
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError:
        return values
    for line in lines:
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if stripped.startswith("export "):
            stripped = stripped[7:].lstrip()
        name, separator, value = stripped.partition("=")
        if not separator or not _ENV_NAME.fullmatch(name.strip()):
            continue
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]
        values[name.strip()] = value
    return values


def _runtime_environment() -> dict[str, str]:
    values = _read_dotenv(Path(__file__).resolve().parents[2] / ".env")
    values.update(os.environ)
    return values


@dataclass(frozen=True, repr=False)
class AiConfig:
    enabled: bool = False
    valid: bool = False
    reason: str = "AI 分析默认关闭，静态扫描继续可用"
    base_url: str = field(default="", repr=False)
    model: str = ""
    api_key: str = field(default="", repr=False)
    target_origin: str = ""
    output_parameter: str = "max_tokens"
    budgets: dict[str, int] = field(default_factory=lambda: dict(LIMITS))
    reasoning_effort: str | None = None

    def public(self) -> dict:
        status = {"enabled": self.enabled, "valid": self.valid, "reason": self.reason,
                  "target_origin": self.target_origin, "model": self.model,
                  "budgets": dict(self.budgets), "output_parameter": self.output_parameter,
                  "reasoning_effort": self.reasoning_effort}
        return {**status, "config_version": stable_digest(status)}

    def internal_version(self) -> str:
        # 带进程随机密钥的 HMAC 只用于服务端绑定；不能公开可猜测凭据摘要。
        material = stable_digest({**self.public(), "base_url": self.base_url, "api_key": self.api_key})
        return hmac.new(_VERSION_KEY, material.encode(), hashlib.sha256).hexdigest()


def trusted_base_url(value: str) -> tuple[str, str]:
    if not value or any(ord(c) <= 32 or ord(c) == 127 for c in value) or "\\" in value:
        raise ValueError("模型地址格式无效")
    parts = urlsplit(value)
    if parts.username is not None or parts.password is not None or "?" in value or "#" in value:
        raise ValueError("模型地址不能包含凭据、查询参数或片段")
    host, port = parts.hostname, parts.port
    if not host or parts.scheme not in {"http", "https"}:
        raise ValueError("模型地址需使用 HTTPS，HTTP 仅允许本机回环地址")
    try:
        loopback = ipaddress.ip_address(host).is_loopback
    except ValueError:
        loopback = host.lower() == "localhost"
    if parts.scheme == "http" and not loopback:
        raise ValueError("HTTP 模型地址仅允许本机回环地址")
    host_part = f"[{host}]" if ":" in host else host
    authority = host_part + (f":{port}" if port is not None else "")
    origin = f"{parts.scheme}://{authority}"
    return urlunsplit((parts.scheme, authority, parts.path.rstrip("/") + "/", "", "")), origin


def load_config(environ: Mapping[str, str] | None = None) -> AiConfig:
    env = _runtime_environment() if environ is None else environ
    enabled = env.get("QUANTUM_AI_ENABLED", "").lower() in {"1", "true", "yes"}
    if not enabled:
        return AiConfig()
    budgets = dict(LIMITS)
    try:
        for name, maximum in LIMITS.items():
            raw = env.get(f"QUANTUM_AI_{name.upper()}")
            if raw is not None:
                number = int(raw)
                if not 1 <= number <= maximum:
                    raise ValueError("AI 预算必须为正整数且不能超过首版硬上限")
                budgets[name] = number
        base, origin = trusted_base_url(env.get("QUANTUM_AI_BASE_URL", ""))
        model = env.get("QUANTUM_AI_MODEL", "").strip()
        key = env.get("QUANTUM_AI_API_KEY", "")
        if not model or len(model) > 120 or any(ord(c) < 32 or ord(c) == 127 for c in model):
            raise ValueError("请配置有效的模型名称")
        if not key.isascii() or len(key) > 8192 or any(ord(c) < 32 or ord(c) == 127 for c in key):
            raise ValueError("模型凭据格式无效")
        reasoning_effort = env.get("QUANTUM_AI_REASONING_EFFORT", "").strip() or None
        if reasoning_effort not in {None, "none", "low", "high", "max"}:
            raise ValueError("思考强度只支持 none、low、high 或 max")
        parameter = env.get("QUANTUM_AI_OUTPUT_PARAMETER", "max_tokens")
        if parameter not in {"max_tokens", "max_completion_tokens"}:
            raise ValueError("输出参数只支持 max_tokens 或 max_completion_tokens")
    except (ValueError, UnicodeError):
        # 不反射 URL、凭据、环境变量值或底层异常。
        return AiConfig(enabled=True, reason="AI 配置无效，请检查服务端模型地址、名称、凭据格式及预算")
    return AiConfig(True, True, "配置有效，尚未验证模型连通性", base, model, key, origin,
                    parameter, budgets, reasoning_effort)


@lru_cache(maxsize=1)
def get_config() -> AiConfig:
    """进程内固定配置；修改环境后重启生效，读取不联网。"""
    return load_config()
