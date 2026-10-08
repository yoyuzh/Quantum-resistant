from __future__ import annotations

import re
from dataclasses import asdict
from pathlib import Path

from scanner.control import AnalysisLimit, MAX_SOURCE_BYTES, checkpoint
from scanner.config_analysis import ConfigError, scan_config
from scanner.pem_analysis import pem_material
from scanner.python_analysis import analyze_with_ast
from scanner.results import make_source_id, merge_findings
from scanner.rules import Finding
from scanner.text_analysis import scan_pem, scan_with_regex


def analyze_source(source: str, filename: str = "snippet.py", source_type: str = "snippet", source_id: str | None = None, *, include_metadata: bool = False) -> tuple[list[dict], list[dict]]:
    checkpoint()
    identity = source_id or make_source_id(filename, source)
    diagnostics: list[dict] = []
    suffix = Path(filename).suffix.lower()
    c_style = suffix in {".cs", ".java", ".js", ".jsx", ".ts", ".tsx", ".go", ".rs"}
    python_source = suffix in {".py", ".pyw", ""}
    found = []
    tree = None
    config_pem: list[tuple[int, str]] = []
    try:
        if len(source.encode("utf-8")) > MAX_SOURCE_BYTES:
            raise AnalysisLimit("源码超过单文件 2MiB 分析上限")
        if suffix in {".json", ".yaml", ".yml"}:
            found = scan_config(source, suffix, pem_values=config_pem)
        elif python_source:
            try:
                visitor = analyze_with_ast(source)
                tree = visitor.tree
                found = visitor.findings
                diagnostics.extend(dict(note, source_id=identity) for note in visitor.diagnostics)
            except (SyntaxError, IndentationError, ValueError, TypeError, RecursionError):
                diagnostics.append({"code": "syntax_fallback", "message": f"{filename} 无法完成 Python AST 分析，已使用有限的文本规则。", "source_id": identity})
                found = scan_with_regex(source, include_pem=False)
        else:
            found = scan_with_regex(source, c_style=c_style, include_pem=False)
        materials = config_pem if suffix in {'.json', '.yaml', '.yml'} else pem_material(source, suffix, tree)
        for first_line, material in materials:
            checkpoint()
            found.extend(Finding(item.line + first_line - 1, item.algorithm, item.risk_level,
                                 item.reason, item.recommendation, item.evidence, item.detection_method)
                         for item in scan_pem(material))
            if re.search(r"^-----BEGIN (?:PRIVATE|PUBLIC) KEY-----", material, re.MULTILINE):
                diagnostics.append({"code": "unknown_pem_algorithm", "message": f"{filename} 包含通用 PEM 密钥头，算法尚未识别，需要复核。", "source_id": identity})
    except (AnalysisLimit, ConfigError) as exc:
        found = []  # No incomplete file findings presented as a complete result.
        diagnostics.append({"code": "analysis_limit" if isinstance(exc, AnalysisLimit) else "config_parse_error",
                            "message": f"{filename} 未完成分析：{exc}。需要复核未覆盖内容。", "source_id": identity})
    checkpoint()
    records = []
    for item in merge_findings(found):
        checkpoint()
        record = asdict(item)
        if not include_metadata:
            for key in ("detection_method", "library", "resolved_api"):
                record.pop(key)
        records.append({**record, "source_id": identity, "file_name": filename, "source_type": source_type})
    return records, diagnostics


def scan_source_for_crypto(source: str, filename: str = "snippet.py", source_type: str = "snippet", source_id: str | None = None, *, include_metadata: bool = False) -> list[dict]:
    return analyze_source(source, filename, source_type, source_id, include_metadata=include_metadata)[0]
