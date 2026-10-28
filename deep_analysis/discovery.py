"""Independent structural discovery: library names are not verified crypto semantics."""
from __future__ import annotations

import ast
from dataclasses import dataclass
from typing import Callable

from scanner.python_analysis import KNOWN_CALLS
from deep_analysis.crypto_rules import RULES
from deep_analysis.models import Span
from deep_analysis.symbol_index import Call, Index, Module, location

DISCOVERY_VERSION = 'api-candidates-1'
# Reuse only exact public target names, never the old algorithm guesses or findings.
SUPPORTED_APIS = frozenset(RULES) | frozenset(api for api in KNOWN_CALLS if api.startswith(('Crypto.', 'cryptography.'))) | frozenset({
    'jwt.encode', 'jwt.decode', 'cryptography.hazmat.primitives.serialization.load_pem_private_key',
    'cryptography.hazmat.primitives.serialization.load_pem_public_key',
    'Crypto.Signature.pkcs1_15.new', 'Crypto.Signature.pss.new', 'Crypto.Signature.DSS.new',
})
METHOD_HINTS = frozenset({'encode', 'decode', 'sign', 'verify', 'exchange', 'encrypt', 'decrypt'})


@dataclass(frozen=True)
class CallSite:
    module: Module
    call: Call
    @property
    def node(self):
        return self.module.node_at(self.call.location)

    @property
    def span(self) -> Span:
        return self.call.location


@dataclass(frozen=True)
class Function:
    module: Module
    scope: str
    span: Span

    @property
    def node(self):
        return self.module.node_at(self.span)

    @property
    def identity(self) -> str:
        return self.module.source_id + ':' + self.scope


class Discovery:
    def __init__(self, index: Index, checkpoint: Callable[[], object] = lambda: None):
        self.index = index
        self.functions: dict[str, Function] = {}
        self.calls: dict[Span, CallSite] = {}
        self.incoming: dict[str, list[CallSite]] = {}
        self.sinks: list[CallSite] = []
        library_hint = any(s.kind == 'import' and s.target and s.target.split('.')[0] in ('jwt', 'Crypto', 'cryptography', 'ecdsa')
                           for module in index.modules for s in module.symbols)
        for module in index.modules:
            for symbol in module.symbols:
                checkpoint()
                if symbol.kind == 'function':
                    scope = symbol.scope + '.' + symbol.name
                    function = Function(module, scope, symbol.location)
                    self.functions[function.identity] = function
            for call in module.calls:
                checkpoint()
                site = CallSite(module, call)
                self.calls[site.span] = site
                if call.target and ':' in call.target:
                    self.incoming.setdefault(call.target, []).append(site)
                if call.target in SUPPORTED_APIS or (call.target is None and library_hint and call.expression.split('.')[-1] in METHOD_HINTS):
                    self.sinks.append(site)
        for callers in self.incoming.values():
            callers.sort(key=lambda s: (s.module.path, s.span.start_line, s.span.start_col))
        self.sinks.sort(key=lambda s: (s.module.path, s.span.start_line, s.span.start_col))
