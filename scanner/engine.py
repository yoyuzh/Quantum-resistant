from __future__ import annotations

import re
from dataclasses import asdict
from pathlib import Path

from scanner.python_analysis import scan_with_ast
from scanner.results import make_source_id, merge_findings
from scanner.text_analysis import scan_pem, scan_with_regex


def analyze_source(source: str, filename: str = "snippet.py", source_type: str = "snippet", source_id: str | None = None) -> tuple[list[dict], list[dict]]:
    identity = source_id or make_source_id(filename, source)
    diagnostics: list[dict] = []
    suffix = Path(filename).suffix.lower()
    c_style = suffix in {".cs", ".java", ".js", ".jsx", ".ts", ".tsx", ".go", ".rs"}
    python_source = suffix in {".py", ".pyw", ".json", ""}
    try:
        if python_source:
            found = [*scan_with_ast(source), *scan_pem(source)]
        else:
            found = scan_with_regex(source, c_style=c_style)
    except (SyntaxError, IndentationError, ValueError, TypeError, RecursionError):
        diagnostics.append({"code": "syntax_fallback", "message": f"{filename} 无法完成 Python AST 分析，已使用有限的文本规则。", "source_id": identity})
        found = scan_with_regex(source)
    if re.search(r"-----BEGIN (?:PRIVATE|PUBLIC) KEY-----", source):
        diagnostics.append({"code": "unknown_pem_algorithm", "message": f"{filename} 包含通用 PEM 密钥头，算法尚未识别，需要复核。", "source_id": identity})
    return ([{**asdict(f), "source_id": identity, "file_name": filename, "source_type": source_type}
             for f in merge_findings(found)], diagnostics)


def scan_source_for_crypto(source: str, filename: str = "snippet.py", source_type: str = "snippet", source_id: str | None = None) -> list[dict]:
    return analyze_source(source, filename, source_type, source_id)[0]
