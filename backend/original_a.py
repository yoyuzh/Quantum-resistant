"""Transport and lifecycle boundary for the immutable, namespaced A engine.

No main rule or semantic result is used to augment A's static conclusions.
Module facts below are retrieval hints only, never evidence or verifier input.
"""
from __future__ import annotations

import ast
from copy import deepcopy
from dataclasses import dataclass
import hashlib
from pathlib import PurePosixPath

from original_a.deep_analysis.pipeline import analyze_crypto, CRYPTO_SEMANTICS_VERSION
from original_a.deep_analysis.snapshot import build_snapshot
from original_a.deep_analysis.crypto_rules import RULES_VERSION, ENGINE_VERSION, VERIFIER_VERSION, LIBRARY_PROFILES

ENGINE_IDENTITY = 'original-a:d8e07c903d5cd15e19142613491bb7dbae69699d'
ADAPTER_VERSION = 'original-a-transport-1'


@dataclass(frozen=True)
class DiskDocument:
    file_name: str
    source_id: str
    path: object | None

    @property
    def content_available(self):
        return self.path is not None

    @property
    def size_bytes(self):
        if self.path is None:
            return 0
        size = getattr(self.path, 'size', None)
        return size if size is not None else self.path.stat().st_size

    @property
    def content(self):
        return self.path.read_text(encoding='utf-8')


def documents(base, control):
    paths = getattr(control, 'source_paths', {})
    return [DiskDocument(s['file_name'], s['source_id'], paths.get(s['source_id'])) for s in base['sources']]


def source_snapshot(base, control, deadline):
    relative = getattr(control, 'path_fidelity', base['source_type'] in ('github_repository', 'pypi_package'))
    snapshot = build_snapshot(documents(base, control), base['source_type'], relative_paths=relative,
                              coverage=base.get('coverage') or {}, checkpoint=deadline.remaining)
    control.storage.write_json(control.folder, {'snapshot': snapshot.identity.model_dump(mode='json'),
                                               'engine_identity': ENGINE_IDENTITY})
    return snapshot


def adapt_result(raw):
    """Add presentation scope without rewriting claims, IDs, proofs or versions."""
    result = deepcopy(raw)
    for operation in result['operations']:
        operation['evidence_scope'] = ('algorithm_policy' if operation['api'] == 'jwt.decode'
                                       else 'definition_template' if operation['context']['kind'] == 'uninstantiated_template'
                                       else 'static_call')
    return result


def summary_facts(text, filename, sha256, check, module_root='.'):
    """Read-only syntax locations; a hint is never a static proof."""
    from scanner.parsing import parse_python
    tree = parse_python(text, filename, check)
    logical_path = filename.removeprefix(module_root + '/') if module_root != '.' else filename
    imports, functions, calls = [], [], []
    top = {id(n) for n in tree.body}
    for node in ast.walk(tree):
        check()
        if isinstance(node, ast.Import):
            imports.extend({'line': node.lineno, 'target': alias.name} for alias in node.names)
        elif isinstance(node, ast.ImportFrom):
            parent = list(PurePosixPath(logical_path).parent.parts)
            prefix = parent[:len(parent) - node.level + 1] if node.level else []
            module = '.'.join([*prefix, *([node.module] if node.module else [])])
            imports.extend({'line': node.lineno, 'target': '.'.join(filter(None, (module, alias.name)))} for alias in node.names)
        elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            functions.append({'name': node.name, 'line': node.lineno, 'end': node.end_lineno,
                              'scope': '<module>' if id(node) in top else '<definition>'})
        elif isinstance(node, ast.Call):
            calls.append({'name': ast.unparse(node.func)[:2048], 'line': node.lineno, 'end': node.end_lineno,
                          'col': node.col_offset, 'end_col': node.end_col_offset})
    module = logical_path.removesuffix('.py').removesuffix('.pyw').replace('/', '.')
    if module.endswith('.__init__'):
        module = module[:-9]
    return {'sha256': sha256, 'module': module, 'imports': imports, 'functions': functions, 'calls': calls}


def summarize_sources(base, control, deadline, snapshot=None):
    """Stream all collected Python sources independently of A's selected subset."""
    import json
    from backend.source_facts import SummaryStore
    from scanner.control import AnalysisLimit
    store = SummaryStore(control, ())
    used, parsed, notes = 0, 0, []
    rows = [d for d in documents(base, control) if d.file_name.endswith(('.py', '.pyw'))]
    from original_a.deep_analysis.snapshot import package_roots
    roots = package_roots(tuple(d.file_name for d in rows))
    relative = getattr(control, 'path_fidelity', base['source_type'] in ('github_repository', 'pypi_package'))
    module_root = roots[0] if relative and len(roots) == 1 else '.'
    expected = {s.source_id: s.sha256 for s in snapshot.identity.sources} if snapshot else {}
    for document in sorted(rows, key=lambda d: (d.file_name, d.source_id)):
        deadline.remaining()
        if not document.content_available:
            notes.append('source_unavailable')
            continue
        try:
            text = document.content
            sha256 = hashlib.sha256(text.encode()).hexdigest()
            if document.source_id in expected and expected[document.source_id] != sha256:
                notes.append('source_digest_mismatch')
                continue
            facts = summary_facts(text, document.file_name, sha256, deadline.remaining, module_root)
            encoded = json.dumps(facts, ensure_ascii=False, separators=(',', ':')).encode()
            if used + len(encoded) > 32 * 1024 * 1024:
                notes.append('summary_structure_limit')
                break
            store.write_value(document.source_id, encoded)
            used += len(encoded)
            parsed += 1
        except (OSError, UnicodeError, SyntaxError, ValueError, OverflowError, RecursionError, AnalysisLimit):
            notes.append('summary_unavailable')
        control.emit(activity={'action': '建立AI只读模块摘要', 'files': [document.file_name],
                               'completed': parsed, 'total': len(rows)})
    return {'purpose': 'ai_retrieval_only', 'parsed': parsed, 'total': len(rows), 'bytes': used,
            'partial': bool(notes), 'gaps': sorted(set(notes)), 'max_ast_files': 1}
