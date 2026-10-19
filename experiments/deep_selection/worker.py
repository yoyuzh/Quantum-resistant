"""Trusted child adapter. Target files are only read/parsed, never imported.

Run through runner.py, which applies the OS sandbox before Python starts.
No vendor rendering, CLI, plugin discovery, or package inference is called.
"""
from __future__ import annotations

import ast
from argparse import Namespace
import errno
import hashlib
import json
from pathlib import Path
import resource
import os
import subprocess
import socket
import sys
import traceback


def position(source_id: str, node: ast.AST) -> dict | None:
    fields = ("lineno", "col_offset", "end_lineno", "end_col_offset")
    if not all(getattr(node, field, None) is not None for field in fields):
        return None
    return dict(source_id=source_id, start_line=node.lineno, start_col=node.col_offset,
                end_line=node.end_lineno, end_col=node.end_col_offset)


def guard(input_root: Path) -> list:
    """Supplement OS restrictions: reject any attempt to execute target/dynamic code."""
    blocked = []
    def audit(event, arguments):
        if event == "exec":
            filename = arguments[0].co_filename
            if filename.startswith("<") or Path(filename).is_relative_to(input_root):
                blocked.append("target_or_dynamic_execution")
                raise PermissionError("input execution forbidden")
    sys.addaudithook(audit)
    return blocked


def ast_facts(sources: list[dict]) -> dict:
    calls, imports, definitions, failures = [], [], [], []
    for source in sources:
        try:
            tree = ast.parse(source["content"], filename=source["path"], feature_version=(3, 10))
            for node in ast.walk(tree):
                if isinstance(node, ast.Call):
                    calls.append(position(source["source_id"], node))
                elif isinstance(node, (ast.Import, ast.ImportFrom)):
                    imports.append(position(source["source_id"], node))
                elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                    definitions.append(position(source["source_id"], node))
        except (SyntaxError, ValueError) as exc:
            failures.append({"source_id": source["source_id"], "error": type(exc).__name__})
    return dict(calls=calls, imports=imports, definitions=definitions, failures=failures,
                value_proof="not_implemented", target_grammar="3.10")


def scalpel_facts(sources: list[dict]) -> dict:
    from scalpel.cfg import CFGBuilder
    from scalpel.SSA.const import SSA
    from scalpel.duc import DUC
    calls, definitions, references, constants, failures = [], [], [], [], []
    for source in sources:
        try:
            root = CFGBuilder().build_from_src(source["source_id"], source["content"])
            pending = [root]
            while pending:
                cfg = pending.pop()
                pending.extend(cfg.functioncfgs.values())
                pending.extend(cfg.class_cfgs.values())
                for block in cfg.get_all_blocks():
                    for statement in block.statements:
                        for node in ast.walk(statement):
                            if isinstance(node, ast.Call):
                                span = position(source["source_id"], node)
                                if span is not None:
                                    calls.append(span)
                _, values = SSA().compute_SSA(cfg)
                for (name, counter), node in values.items():
                    constants.append({"source_id": source["source_id"], "cfg": cfg.name,
                                      "name": name, "counter": counter,
                                      "value": node.value if isinstance(node, ast.Constant) and
                                      node.value in ("RS256", "HS256") else None,
                                      "node_type": type(node).__name__, "location": position(source["source_id"], node)})
            duc = DUC(root)
            for scope in duc.get_lexical_scopes():
                for definition in duc.get_all_definitions(scope):
                    definitions.append({"source_id": source["source_id"], "name": definition.name,
                                        "location": position(source["source_id"], definition.ast_node)})
                for reference in duc.get_all_references(scope):
                    references.append({"source_id": source["source_id"], "name": reference.name.name,
                                       "location": position(source["source_id"], duc.ast_node_for_reference(reference, scope))})
        except Exception as exc:
            failures.append({"source_id": source["source_id"], "error": type(exc).__name__,
                             "message": str(exc)[:240],
                             "frames": [(frame.name, Path(frame.filename).name, frame.lineno)
                                        for frame in traceback.extract_tb(exc.__traceback__)]})
    return dict(calls=calls, definitions=definitions, references=references, constants=constants,
                failures=failures, value_proof="intraprocedural_only_no_argument_return_context_proof")


def codegraph_facts(input_root: Path, readonly_adapter: bool = False) -> dict:
    import codegraph.core as core
    if readonly_adapter:
        # Experimental one-function IO adapter; upstream source stays untouched.
        core.read_file_content = lambda path: Path(path).read_text(encoding="utf-8")
    graph = core.CodeGraph(Namespace(paths=str(input_root)))
    metadata = graph.get_entity_metadata()
    usage = graph.usage_graph()
    # File paths remain relative and no raw source is copied into the report.
    def relative(value):
        if isinstance(value, dict):
            return {str(key).replace(str(input_root) + "/", ""): relative(item) for key, item in value.items()}
        if isinstance(value, (list, tuple)):
            return [relative(item) for item in value]
        return value.replace(str(input_root) + "/", "") if isinstance(value, str) else value
    return dict(metadata=relative(metadata), usage=relative(usage), calls=[], failures=[],
                value_proof="dependency_graph_only_no_callsite_spans_or_value_proof")


def restrictions_probe(input_root: Path, scratch: Path, outside: Path) -> dict:
    result = {}
    def check(name, action):
        try:
            action()
            result[name] = "unexpectedly_allowed"
        except PermissionError:
            result[name] = "denied"
        except OSError as exc:
            result[name] = "denied" if exc.errno in (errno.EPERM, errno.EACCES) else f"inconclusive_errno_{exc.errno}"
    check("external_read", lambda: outside.read_bytes())
    check("external_write", lambda: outside.write_text("changed"))
    first = next(input_root.rglob("*.py"))
    check("snapshot_write", lambda: first.write_text("changed"))
    check("snapshot_chmod", lambda: first.chmod(0o600))
    check("spawn", lambda: subprocess.run(["/usr/bin/true"], check=True))
    def fork():
        child = os.fork()
        if child == 0:
            os._exit(0)
        os.waitpid(child, 0)
    check("fork", fork)
    def network():
        with socket.socket() as connection:
            connection.settimeout(.1)
            connection.connect(("127.0.0.1", 9))
    check("network", network)
    check("target_exec", lambda: exec(compile("raise RuntimeError('not executed')", str(first), "exec")))
    check("dynamic_eval", lambda: eval("1 + 1"))
    (scratch / "allowed-output.txt").write_text("scratch-only")
    result["scratch_write"] = "allowed"
    return result


def main() -> None:
    mode, root, scratch, vendor, dependencies, outside = sys.argv[1:]
    root, scratch, vendor, dependencies, outside = map(Path, (root, scratch, vendor, dependencies, outside))
    resource.setrlimit(resource.RLIMIT_CPU, (3, 3))
    resource.setrlimit(resource.RLIMIT_FSIZE, (4 * 1024 * 1024, 4 * 1024 * 1024))
    resource.setrlimit(resource.RLIMIT_NOFILE, (64, 64))
    sys.path[:0] = [str(vendor / "scalpel" / "src"), str(vendor / "codegraph"), str(dependencies)]
    # Preload only trusted tool modules before banning dynamic code generation.
    # None of their modules sees target paths until after guard is installed.
    if mode == "scalpel":
        from scalpel.cfg import CFGBuilder
        from scalpel.SSA.const import SSA
        from scalpel.duc import DUC
        # Precompile trusted networkx decorators on an empty trusted CFG only.
        SSA().compute_SSA(CFGBuilder().build_from_src("trusted-empty", ""))
    elif mode in ("codegraph", "codegraph_readonly"):
        from codegraph.core import CodeGraph
    blocked = guard(root)
    manifest = json.loads((scratch / "manifest.json").read_text())
    sources = []
    for entry in manifest:
        path = root / entry["relative_path"]
        content = path.read_text(encoding="utf-8", newline="")
        if hashlib.sha256(content.encode()).hexdigest() != entry["sha256"]:
            raise ValueError("input digest changed")
        if path.suffix == ".py":
            sources.append(dict(source_id=entry["source_id"], path=entry["relative_path"], content=content))
    if mode == "probe":
        facts = restrictions_probe(root, scratch, outside)
    elif mode == "stall":
        while True:
            pass
    else:
        facts = ast_facts(sources) if mode == "ast" else scalpel_facts(sources) if mode == "scalpel" else codegraph_facts(root, mode == "codegraph_readonly")
    print(json.dumps({"mode": mode, "facts": facts, "blocked": blocked, "host_python": sys.version.split()[0]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
