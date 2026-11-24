"""Safe, bounded JSON/YAML configuration trees with original scalar locations."""
from __future__ import annotations

import json
import re

import yaml
from yaml.events import AliasEvent, CollectionEndEvent, CollectionStartEvent
from yaml.nodes import MappingNode, ScalarNode, SequenceNode

from scanner.control import AnalysisLimit, MAX_DEPTH, MAX_NODES, checkpoint
from scanner.rules import sensitive_context, Finding, STRING_IDENTIFIER_RULES, VULNERABLE_ALGOS


class ConfigError(Exception):
    pass


JSON_STRING = r'"[^"\\]*(?:\\.[^"\\]*)*"'
JSON_TOKENS = re.compile(JSON_STRING + r'|[][{},]|-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?|true|false|null')
JSON_KEY = re.compile(r'[ \t\r\n]*:')
JSONC_COMMENTS = re.compile(JSON_STRING + r'|//[^\r\n]*|/\*[\s\S]*?\*/')
JSONC_TRAILING_COMMA = re.compile(JSON_STRING + r'|,(?=[ \t\r\n]*[}\]])')


class BoundedSafeLoader(yaml.SafeLoader):
    """Compose configuration nodes without constructing objects or expanding aliases."""

    def __init__(self, source: str) -> None:
        super().__init__(source)
        self.analysis_depth = 0
        self.analysis_nodes = 0
        self.active_anchors = set()

    def compose_node(self, parent, index):
        event = self.peek_event()
        anchor = getattr(event, 'anchor', None)
        if isinstance(event, AliasEvent):
            if anchor in self.active_anchors:
                raise AnalysisLimit('YAML 包含循环别名')
            return super().compose_node(parent, index)
        if anchor is None:
            return super().compose_node(parent, index)
        if anchor in self.active_anchors:
            raise ConfigError('YAML 包含重复锚点')
        self.active_anchors.add(anchor)
        try:
            return super().compose_node(parent, index)
        finally:
            self.active_anchors.remove(anchor)

    def get_event(self):
        checkpoint()
        event = super().get_event()
        if event is None:
            return event
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


def scan_config(source: str, suffix: str, *, pem_values: list[tuple[int, str]] | None = None,
                jsonc: bool = False) -> list[Finding]:
    checkpoint()
    if jsonc:
        source = JSONC_COMMENTS.sub(blank_jsonc_syntax, source)
        source = JSONC_TRAILING_COMMA.sub(blank_jsonc_syntax, source)
    if not source.strip():
        return []
    if suffix == '.json':
        return scan_json(source, pem_values)
    loader = None
    try:
        loader = BoundedSafeLoader(source)
        findings = []
        while loader.check_node():
            findings.extend(scan_config_nodes(loader.get_node(), pem_values))
        return findings
    except yaml.YAMLError as exc:
        raise ConfigError('配置格式无法解析') from exc
    finally:
        if loader:
            loader.dispose()


def reject_json_constant(value):
    raise ValueError(value)


def blank_jsonc_syntax(match: re.Match[str]) -> str:
    checkpoint()
    text = match.group()
    if text.startswith('"'):
        return text
    if text == ',':
        before = match.start() - 1
        while before >= 0 and match.string[before] in ' \t\r\n':
            before -= 1
        if before < 0 or match.string[before] in '[{,:':
            return text
    return re.sub(r'[^\r\n]', ' ', text)


def scan_json(source, pem_values):
    try:
        json.loads(source, parse_constant=reject_json_constant)
    except (ValueError, RecursionError) as exc:
        raise ConfigError('JSON 格式无法解析') from exc
    # Use the validated stream to preserve literal locations, including
    # duplicate keys and JSON whitespace that YAML rejects.
    results = []
    contexts = []
    sensitive = False
    nodes, line, cursor = 0, 1, 0
    for token in JSON_TOKENS.finditer(source):
        checkpoint()
        line += source.count('\n', cursor, token.start())
        cursor = token.end()
        value = token.group()
        if value in ('}', ']'):
            contexts.pop()
        if value in ('}', ']', ','):
            sensitive = contexts[-1] if contexts else False
            continue
        nodes += 1
        if nodes > MAX_NODES:
            raise AnalysisLimit('配置节点数超过分析上限')
        if value in ('{', '['):
            sensitive = sensitive if value == '[' else False
            contexts.append(sensitive)
            if len(contexts) > MAX_DEPTH:
                raise AnalysisLimit('配置深度超过分析上限')
        elif value.startswith('"'):
            if JSON_KEY.match(source, cursor):
                sensitive = sensitive_context(json.loads(value))
            elif sensitive:
                results.extend(scan_scalar(json.loads(value), line, pem_values))
    return results


def scan_config_nodes(root, pem_values):
    results: list[Finding] = []
    stack = [(root, False)]
    seen = set()
    while stack:
        checkpoint()
        node, sensitive = stack.pop()
        key = (node, sensitive)
        if key in seen:
            continue
        seen.add(key)
        if isinstance(node, MappingNode):
            for key, value in reversed(node.value):
                # Nested mappings establish their own key context, not prose
                # found anywhere underneath a broad "security" section.
                stack.append((value, isinstance(key, ScalarNode) and sensitive_context(key.value)))
        elif isinstance(node, SequenceNode):
            stack.extend((item, sensitive) for item in reversed(node.value))
        elif isinstance(node, ScalarNode) and sensitive and node.tag == 'tag:yaml.org,2002:str':
            line = node.start_mark.line + 1
            pem_line = line + (node.style in {'|', '>'})
            results.extend(scan_scalar(node.value, line, pem_values, pem_line=pem_line))
    return results


def scan_scalar(value, line, pem_values, *, pem_line=None):
    if value.startswith('-----BEGIN '):
        if pem_values is not None and '-----END ' in value:
            pem_values.append((pem_line or line, value))
        return
    for key, pattern, evidence in STRING_IDENTIFIER_RULES:
        match = pattern.search(value)
        if match and (pattern.fullmatch(value.strip()) or
                      match.start() == 0 and value.startswith(('ssh-', 'ecdsa-sha2-', 'rsa-sha2-'))):
            profile = VULNERABLE_ALGOS[key]
            yield Finding(line, profile.name, profile.risk_level, profile.reason, profile.recommendation,
                          f'{evidence}: {match.group()}', 'text_config')
