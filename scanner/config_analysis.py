"""Safe, bounded JSON/YAML configuration trees with original scalar locations."""
from __future__ import annotations

import json

import yaml
from yaml.events import AliasEvent, CollectionEndEvent, CollectionStartEvent
from yaml.nodes import MappingNode, ScalarNode, SequenceNode

from scanner.control import AnalysisLimit, MAX_DEPTH, MAX_NODES, checkpoint
from scanner.rules import Finding, SENSITIVE_STRING_CONTEXT_RE, STRING_IDENTIFIER_RULES, VULNERABLE_ALGOS


class ConfigError(Exception):
    pass


class BoundedSafeLoader(yaml.SafeLoader):
    """Reject graphs/tags and bound work before recursive node composition."""

    def __init__(self, source: str) -> None:
        super().__init__(source)
        self.analysis_depth = 0
        self.analysis_nodes = 0

    def get_event(self):
        checkpoint()
        event = super().get_event()
        if event is None:
            return event
        if isinstance(event, AliasEvent) or getattr(event, 'anchor', None):
            raise AnalysisLimit('YAML 锚点和别名未纳入支持范围，未展开或推断')
        tag = getattr(event, 'tag', None)
        if tag and tag not in {'tag:yaml.org,2002:' + name for name in ('str', 'int', 'float', 'bool', 'null', 'seq', 'map')}:
            raise AnalysisLimit('YAML 自定义标签未纳入支持范围')
        if isinstance(event, CollectionStartEvent):
            self.analysis_depth += 1
        elif isinstance(event, CollectionEndEvent):
            self.analysis_depth -= 1
        self.analysis_nodes += 1
        if self.analysis_depth > MAX_DEPTH or self.analysis_nodes > MAX_NODES:
            raise AnalysisLimit('配置深度或节点数超过分析上限')
        return event


def scan_config(source: str, suffix: str, *, pem_values: list[tuple[int, str]] | None = None) -> list[Finding]:
    checkpoint()
    if suffix == '.json':
        try:
            # Validate JSON syntax first; YAML alone accepts non-JSON syntax.
            json.loads(source, parse_constant=lambda value: (_ for _ in ()).throw(ValueError(value)))
        except (ValueError, RecursionError) as exc:
            raise ConfigError('JSON 格式无法解析') from exc
    loader = BoundedSafeLoader(source)
    try:
        root = loader.get_single_node()  # Compose nodes only; never construct objects.
    except yaml.YAMLError as exc:
        raise ConfigError('配置格式无法解析') from exc
    finally:
        loader.dispose()
    results: list[Finding] = []
    stack = [(root, False)]
    while stack:
        checkpoint()
        node, sensitive = stack.pop()
        if isinstance(node, MappingNode):
            for key, value in reversed(node.value):
                if not isinstance(key, ScalarNode):
                    raise AnalysisLimit('复杂配置键未纳入支持范围')
                # Nested mappings establish their own key context, not prose
                # found anywhere underneath a broad "security" section.
                stack.append((value, bool(SENSITIVE_STRING_CONTEXT_RE.search(key.value))))
        elif isinstance(node, SequenceNode):
            stack.extend((item, sensitive) for item in reversed(node.value))
        elif isinstance(node, ScalarNode) and sensitive and node.tag == 'tag:yaml.org,2002:str':
            if pem_values is not None and node.value.startswith('-----BEGIN ') and '-----END ' in node.value:
                line = node.start_mark.line + (2 if node.style in {'|', '>'} else 1)
                pem_values.append((line, node.value))
            if node.value.startswith('-----BEGIN '):
                continue
            for key, pattern, evidence in STRING_IDENTIFIER_RULES:
                match = pattern.search(node.value)
                if match and (pattern.fullmatch(node.value.strip()) or
                              match.start() == 0 and node.value.startswith(('ssh-', 'ecdsa-sha2-', 'rsa-sha2-'))):
                    profile = VULNERABLE_ALGOS[key]
                    results.append(Finding(node.start_mark.line + 1, profile.name, profile.risk_level,
                                           profile.reason, profile.recommendation,
                                           f'{evidence}: {match.group()}', 'text_config'))
    return results
