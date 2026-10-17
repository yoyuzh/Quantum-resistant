from __future__ import annotations

import ast
import json
import re
from pathlib import PurePosixPath

import yaml
from yaml.nodes import MappingNode, ScalarNode, SequenceNode

from scanner.config_analysis import BoundedSafeLoader
from scanner.control import AnalysisLimit

CRYPTO = re.compile(r"crypt|cipher|encrypt|decrypt|sign|verify|rsa|ecd[hs]a|ed25519|x25519|key_exchange|kem|kyber|dilithium|ml[_-]?(?:kem|dsa)", re.I)
CONFIG_KEY = re.compile(r"^(?:alg(?:orithm)?|cipher|signature_algorithm|key_algorithm|key_exchange|encryption)$", re.I)


def independent_positions(text: str, filename: str, check) -> tuple[list[tuple[int, int, str]], list[str]]:
    """只解析文本与节点，不导入或执行输入；未知调用只是待复核线索。"""
    suffix = PurePosixPath(filename).suffix.lower()
    positions: set[tuple[int, int, str]] = set()
    try:
        if suffix == ".py":
            tree = ast.parse(text)
            for node in ast.walk(tree):
                check()
                if isinstance(node, ast.Call):
                    target = ast.unparse(node.func)
                    if CRYPTO.search(target):
                        positions.add((node.lineno, node.end_lineno or node.lineno, "python_crypto_call"))
                    elif isinstance(node.func, ast.Name) and node.func.id == "pow" and len(node.args) == 3:
                        # 纯数学 pow(a,b,c) 不足以产生候选。
                        names = " ".join(n.id for arg in node.args for n in ast.walk(arg) if isinstance(n, ast.Name))
                        if re.search(r"private|public|secret|key|cipher|modulus", names, re.I):
                            positions.add((node.lineno, node.end_lineno or node.lineno, "python_crypto_math"))
                elif isinstance(node, (ast.Import, ast.ImportFrom)):
                    modules = " ".join(alias.name for alias in node.names) + " " + (getattr(node, "module", "") or "")
                    if CRYPTO.search(modules):
                        positions.add((node.lineno, node.end_lineno or node.lineno, "python_crypto_import"))
                elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and CRYPTO.search(node.name):
                    positions.add((node.lineno, node.lineno, "python_crypto_wrapper"))
        elif suffix in {".json", ".yaml", ".yml"}:
            if suffix == ".json":
                json.loads(text, parse_constant=lambda _: (_ for _ in ()).throw(ValueError()))
            loader = BoundedSafeLoader(text)
            try:
                root = loader.get_single_node()
            finally:
                loader.dispose()
            stack = [root]
            while stack:
                check()
                node = stack.pop()
                if isinstance(node, MappingNode):
                    for key, value in node.value:
                        if isinstance(key, ScalarNode) and CONFIG_KEY.fullmatch(key.value) and isinstance(value, ScalarNode):
                            positions.add((value.start_mark.line + 1, value.end_mark.line + 1, "config_algorithm"))
                        stack.append(value)
                elif isinstance(node, SequenceNode):
                    stack.extend(node.value)
        else:
            return [], ["unsupported"]
    except (SyntaxError, ValueError, RecursionError, yaml.YAMLError, AnalysisLimit):
        return [], ["parse_failed"]
    return sorted(positions), []


def round_robin(static: list, independent: list) -> list:
    ordered = []
    for index in range(max(len(static), len(independent))):
        for items in (static, independent):
            if index < len(items):
                ordered.append(items[index])
    return ordered
