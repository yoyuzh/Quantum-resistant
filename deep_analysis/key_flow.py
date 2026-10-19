"""Typed key propagation layered on the bounded scalar evaluator."""
from __future__ import annotations

import ast

from deep_analysis.argument_binding import Signature, bind_arguments
from deep_analysis.crypto_rules import RULES, method_rule, method_parameters
from deep_analysis.dataflow import Evaluator, Frame
from deep_analysis.discovery import CallSite
from deep_analysis.models import Known, Unknown
from deep_analysis.semantic_models import Fact
from deep_analysis.symbol_index import location


class CryptoEvaluator(Evaluator):
    def _expression(self, node: ast.expr, frame: Frame, static_default: bool) -> Fact:
        if isinstance(node, ast.Dict) and not frame.blocked:
            if len(node.keys) > 32 or any(k is None or not isinstance(k, ast.Constant) or type(k.value) is not str for k in node.keys):
                return self.store.unknown('dynamic_mapping')
            names = [k.value for k in node.keys]
            if len(set(names)) != len(names):
                return self.store.unknown('duplicate_mapping_key')
            items = tuple(f for key, value in zip(node.keys, node.values)
                          for f in (self.expression(key, frame), self.expression(value, frame)))
            return self.store.fact(Unknown(reason='literal_mapping'), items=items)
        return super()._expression(node, frame, static_default)

    def call_result(self, node: ast.Call, frame: Frame) -> Fact:
        site = self.discovery.calls.get(location(frame.module.source_id, node))
        rule = RULES.get(site.call.target) if site else None
        if rule and rule.library != 'PyJWT':
            arguments, reason = self.rule_arguments(site, frame)
            if reason:
                return self.store.unknown(reason)
            key_type = rule.key_type
            origin = site.span
            base = None
            if rule.api.startswith('Crypto.Signature.'):
                base = arguments['key' if 'key' in arguments else 'rsa_key']
                family = base.key_type.split(':')[1] if base.key_type and base.key_type.startswith('pycrypto:') else None
                scheme = rule.api.split('.')[-2]
                if family not in ({'DSA', 'ECC'} if scheme == 'DSS' else {'RSA'}):
                    return self.store.unknown('unsupported_signer_key')
                mode = arguments.get('mode')
                if scheme == 'DSS' and (not isinstance(mode.value, Known) or mode.value.value not in ('fips-186-3', 'deterministic-rfc6979')):
                    return self.store.unknown('unsupported_signer_mode')
                key_type, origin = 'signer:' + scheme + ':' + family, base.key_origin
            if key_type:
                fact = self.store.fact(Known(value=rule.algorithm or 'generic_key_type'),
                                       base.steps if base else (), frame.conditions,
                                       key_type=key_type, key_origin=origin)
                return self.edge(fact, 'KEY_TYPE_FLOW', origin or site.span, site.span, frame)
        if site and site.call.target is None and isinstance(node.func, ast.Attribute) and node.func.attr in ('public_key', 'publickey'):
            receiver = self.expression(node.func.value, frame)
            if receiver.key_type and receiver.key_type.split(':')[0] in ('RSA', 'EC', 'Ed25519', 'X25519') and not node.args and not node.keywords:
                family = receiver.key_type.split(':')[0]
                fact = self.store.fact(receiver.value, receiver.steps, receiver.conditions,
                                       key_type=family + ':public', key_origin=receiver.key_origin)
                return self.edge(fact, 'KEY_TYPE_FLOW', receiver.steps[-1].destination, site.span, frame)
        return super().call_result(node, frame)

    def rule_arguments(self, site: CallSite, frame: Frame) -> tuple[dict[str, Fact], str | None]:
        rule = RULES[site.call.target]
        signature = Signature(tuple(n for n in (*rule.parameters, *rule.optional) if n not in rule.keyword_only),
                              keyword_only=rule.keyword_only, defaults=tuple((n, self.store.unknown('unspecified_api_parameter')) for n in rule.optional))
        return bind_arguments(site.node, signature, self.store, lambda n: self.expression(n, frame),
                              lambda n: self.expression(n, frame, static_default=True))

    def sink_arguments(self, site: CallSite, frame: Frame) -> tuple[dict[str, Fact], str | None]:
        if frame.blocked:
            return {'algorithm': self.store.unknown(frame.blocked)}, frame.blocked
        if site.call.target in RULES and RULES[site.call.target].library != 'PyJWT':
            arguments, reason = self.rule_arguments(site, frame)
            arguments['@result'] = self.call_result(site.node, frame)
            return arguments, reason
        arguments, reason = super().sink_arguments(site, frame)
        if site.call.target in ('jwt.encode', 'jwt.decode'):
            def project(fact: Fact) -> Fact:
                if fact.items is not None:
                    return self.store.fact(fact.value, fact.steps, fact.conditions,
                                           items=tuple(project(f) for f in fact.items),
                                           key_type=fact.key_type, key_origin=fact.key_origin)
                origin = fact.steps[-1].destination if fact.steps else site.span
                return self.edge(fact, 'ARGUMENT_FLOW', origin, site.span, frame)
            return {name: project(fact) for name, fact in arguments.items()}, reason
        if isinstance(site.node.func, ast.Attribute):
            arguments['@receiver'] = self.expression(site.node.func.value, frame)
            receiver = arguments['@receiver']
            if method_rule(receiver.key_type, site.node.func.attr):
                signature = Signature(method_parameters(receiver.key_type, site.node.func.attr))
                bound, invalid = bind_arguments(site.node, signature, self.store, lambda n: self.expression(n, frame),
                                                lambda n: self.expression(n, frame, static_default=True))
                if invalid:
                    return arguments, invalid
                arguments['@receiver'] = self.edge(receiver, 'KEY_TYPE_FLOW', receiver.steps[-1].destination, site.span, frame)
                return arguments, None
        return arguments, reason


def mapping_field(fact: Fact | None, name: str) -> Fact | None:
    if fact is None or fact.items is None or not isinstance(fact.value, Unknown) or fact.value.reason != 'literal_mapping':
        return None
    for key, value in zip(fact.items[::2], fact.items[1::2]):
        if isinstance(key.value, Known) and key.value.value == name:
            return value
    return None
