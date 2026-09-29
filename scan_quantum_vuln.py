#!/usr/bin/env python3
"""兼容的扫描 API 与命令行入口；实现位于 scanner 包。"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from scanner.rules import *  # Existing public rule names remain importable.
from scanner.python_analysis import QuantumCryptoVisitor, analyze_with_ast, scan_with_ast
from scanner.text_analysis import scan_with_regex, strip_strings_and_comments, extract_aliases_from_source
from scanner.results import merge_findings, make_source_id, build_migration_score
from scanner.engine import analyze_source, scan_source_for_crypto

def scan_code_for_crypto(file_path: str | Path) -> list[dict[str, str | int]]:
    path = Path(file_path)
    source = path.read_text(encoding="utf-8")
    return scan_source_for_crypto(source, filename=path.name, source_type="manual_upload")


def format_findings(findings: list[dict[str, str | int]]) -> str:
    if not findings:
        return "未发现量子脆弱算法。"

    lines: list[str] = []
    for finding in findings:
        lines.append(
            f"【{finding['risk_level']}】在第{finding['line']}行发现量子脆弱算法：{finding['algorithm']}"
        )
        lines.append(f"  证据：{finding['evidence']}")
        lines.append(f"  原因：{finding['reason']}")
        lines.append(f"  建议：{finding['recommendation']}")
    return "\n".join(lines)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="扫描 Python 代码中的量子脆弱密码算法。")
    parser.add_argument(
        "file",
        nargs="?",
        default="sample_rsa_code.py",
        help="待扫描的 Python 文件路径，默认扫描 sample_rsa_code.py",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="以 JSON 格式输出扫描结果。",
    )
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    try:
        path = Path(args.file)
        findings, diagnostics = analyze_source(path.read_text(encoding="utf-8-sig"), filename=path.name, source_type="manual_upload")
        for diagnostic in diagnostics:
            print(diagnostic["message"], file=sys.stderr)
    except (OSError, UnicodeError) as exc:
        print(f"扫描失败：{exc}", file=sys.stderr)
        return 1

    if args.json:
        print(json.dumps(findings, indent=2, ensure_ascii=False))
    else:
        print(format_findings(findings))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
