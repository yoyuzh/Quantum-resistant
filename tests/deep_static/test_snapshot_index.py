"""Production source boundaries and AST structure; never execute fixture text."""
from __future__ import annotations

import dataclasses
import json
from pathlib import Path
import unittest
from unittest.mock import patch

from backend.models import SourceRecord
from backend.temp_storage import StoredDocument, TemporaryStorage
from deep_analysis.identity import content_digest, extract_span
from deep_analysis.materialize import materialized
from deep_analysis.models import Budgets
from deep_analysis.paths import validate_paths
from deep_analysis.snapshot import build_snapshot
from deep_analysis.symbol_index import build_index


def records(files, source_type='github_repository'):
    return [SourceRecord(source_id=f'source-{i}', file_name=p, source_type=source_type, content=t,
                         line_count=len(t.splitlines()), char_count=len(t)) for i, (p, t) in enumerate(files.items())]


def snapshot(files, **kwargs):
    return build_snapshot(records(files), 'github_repository', **kwargs)


class SnapshotTests(unittest.TestCase):
    def test_stored_offsets_bom_newlines_and_immutable_copy(self):
        with TemporaryStorageContext() as storage:
            folder = storage.folder()
            storage.write_source(folder, b'not a module')
            text = '\ufeff中文 = 1\r\n'
            content = storage.write_source(folder, text.encode())
            doc = StoredDocument(None, 'pkg/a.py', content, 'original-id')
            snap = build_snapshot([doc], 'github_repository')
            source = snap.logical.sources[0]
            self.assertEqual(source.content, text)
            self.assertEqual(source.identity.sha256, content_digest(text))
            self.assertEqual(source.identity.relative_path, 'pkg/a.py')
            self.assertNotIn('sources.bin', snap.identity.model_dump_json())
            doc.name = 'changed.py'
            self.assertEqual(source.identity.relative_path, 'pkg/a.py')
            with self.assertRaises(dataclasses.FrozenInstanceError):
                snap.identity = None

    def test_order_commit_and_binding_identity(self):
        docs = records({'b.py': 'b=1\r\n', 'a.py': 'a=2\n'})
        first = build_snapshot(docs, 'github_repository')
        self.assertEqual(first.identity.snapshot_id, build_snapshot(reversed(docs), 'github_repository').identity.snapshot_id)
        self.assertIsNone(first.identity.commit)
        docs[0].file_name = 'c.py'
        self.assertNotEqual(first.identity.snapshot_id, build_snapshot(docs, 'github_repository').identity.snapshot_id)
        self.assertNotEqual(first.identity.snapshot_id, build_snapshot(records({'b.py': 'b=1\n', 'a.py': 'a=2\n'}), 'github_repository').identity.snapshot_id)

    def test_four_sources_gaps_flat_and_unknown_denominator(self):
        for kind in ('github_repository', 'pypi_package', 'manual_upload', 'snippet'):
            docs = records({'a.py': 'import jwt\njwt.encode({}, k)\n'}, kind)
            with patch('httpx.get', side_effect=AssertionError('no network')):
                snap = build_snapshot(docs, kind, coverage={'partial': True, 'skip_reasons': {'truncated': 3}})
            self.assertTrue(snap.identity.coverage.partial)
            self.assertIn('truncated', snap.identity.coverage.gaps)
            self.assertIsNone(snap.identity.coverage.collected.total)
            self.assertEqual(snap.identity.path_fidelity, 'snippet' if kind == 'snippet' else 'flat_basename' if kind == 'manual_upload' else 'relative_paths')
        flat = build_snapshot(records({'one/a.py': 'from b import f\nf()\n', 'two/b.py': 'def f(): pass\n'}), 'manual_upload')
        self.assertIsNone(build_index(flat).modules[0].calls[0].target)

    def test_unavailable_decode_and_selection_limits(self):
        docs = records({'a.py': 'pass', 'b.py': 'pass', 'x.txt': 'text'})
        docs[0].content_available = False
        result = build_snapshot(docs, 'github_repository', budgets=Budgets(python_files=0))
        self.assertEqual(result.logical.sources, ())
        self.assertEqual({d.code for d in result.diagnostics}, {'source_unavailable', 'file_limit'})
        with TemporaryStorageContext() as storage:
            folder = storage.folder()
            content = storage.write_source(folder, b'\xff')
            bad = StoredDocument(None, 'a.py', content, 'bad')
            self.assertEqual(build_snapshot([bad], 'snippet').diagnostics[0].code, 'source_unavailable')

    def test_safe_paths_and_portable_collisions(self):
        bad = ['/x.py', 'C:/x.py', '//host/x.py', '../x.py', 'x/./a.py', 'a//b.py', 'a\\b.py',
               'x\x00.py', 'NUL.py', 'com1.txt', 'LPT¹.py', 'x./a.py', 'a /x.py', 'a:b.py',
               'x/' * 20 + 'a.py', 'a' * 513, 'x?.py']
        for path in bad:
            with self.subTest(path=path), self.assertRaises(ValueError):
                validate_paths([path])
        for paths in [('A.py', 'a.py'), ('é.py', 'e\u0301.py'), ('a', 'a/b.py')]:
            with self.assertRaises(ValueError):
                validate_paths(list(paths))
        self.assertEqual(validate_paths(['e\u0301.py']), ('é.py',))


class TemporaryStorageContext:
    def __enter__(self):
        self.storage = TemporaryStorage()
        return self.storage

    def __exit__(self, *args):
        self.storage.close()


class MaterializeTests(unittest.TestCase):
    def test_view_quota_scratch_and_cleanup(self):
        snap = snapshot({'pkg/__init__.py': '', 'pkg/a.py': '中文=1\n'})
        with TemporaryStorageContext() as storage:
            with materialized(snap, storage) as view:
                folder = view.folder
                expected = sum(s.identity.size_bytes for s in snap.logical.sources)
                self.assertEqual(storage.bytes, expected)
                view.write_scratch('index.json', b'{}')
                self.assertEqual(storage.bytes, expected + 2)
                self.assertEqual((view.input / 'pkg/a.py').read_text(), '中文=1\n')
            self.assertEqual(storage.bytes, 0)
            self.assertFalse(folder.exists())

    def test_mutation_and_symlink_rejected(self):
        snap = snapshot({'pkg/__init__.py': '', 'pkg/a.py': 'a=1\n'})
        with TemporaryStorageContext() as storage:
            for attack in ('mutate', 'link', 'parent'):
                with self.subTest(attack=attack), self.assertRaises((ValueError, OSError)):
                    with materialized(snap, storage) as view:
                        target = view.input / 'pkg/a.py'
                        if attack == 'mutate':
                            target.chmod(0o600)
                            target.write_text('a=2\n')
                        elif attack == 'link':
                            target.unlink()
                            target.symlink_to('/etc/passwd')
                        else:
                            (view.input / 'pkg').rename(view.input / 'moved')
                            (view.input / 'pkg').symlink_to('/tmp')
                self.assertEqual(storage.bytes, 0)

    def test_cancel_and_storage_exhaustion_cleanup(self):
        snap = snapshot({'a.py': 'a=1'})
        with TemporaryStorageContext() as storage:
            storage.max_bytes = 2
            with self.assertRaises(RuntimeError), materialized(snap, storage):
                pass
            self.assertEqual(storage.bytes, 0)
            storage.max_bytes = 1024
            def cancelled():
                raise TimeoutError('cancelled')
            with self.assertRaises(TimeoutError), materialized(snap, storage, cancelled):
                pass
            self.assertEqual(storage.bytes, 0)


class IndexTests(unittest.TestCase):
    def calls(self, files, **kwargs):
        return build_index(snapshot(files), **kwargs)

    def test_relative_absolute_alias_and_precise_unicode_span(self):
        index = self.calls({'pkg/__init__.py': '', 'pkg/w.py': 'def sign(x): return x\n',
                            'pkg/a.py': 'from .w import sign as alias\nfrom pkg import w\n中文=1; alias(1); w.sign(2)\n'})
        module = next(m for m in index.modules if m.path == 'pkg/a.py')
        self.assertEqual([c.target for c in module.calls], ['source-1:<module>.sign'] * 2)
        text = 'from .w import sign as alias\nfrom pkg import w\n中文=1; alias(1); w.sign(2)\n'
        self.assertEqual(extract_span(text, module.calls[0].location), 'alias(1)')
        self.assertEqual(module.calls[0].location.start_col, len('中文=1; '.encode()))

    def test_shadowing_parameters_reassignment_conditional_and_wildcard(self):
        cases = ['import jwt\njwt=other\njwt.encode(x,k)\n',
                 'import jwt\ndef f(jwt):\n return jwt.encode(x,k)\n',
                 'if flag:\n import jwt\njwt.encode(x,k)\n',
                 'import jwt\nfrom other import *\njwt.encode(x,k)\n',
                 'import jwt\ndef f():\n global jwt\n jwt=other\njwt.encode(x,k)\n',
                 'import jwt\ndef f():\n jwt.encode=other\njwt.encode(x,k)\n']
        for text in cases:
            with self.subTest(text=text):
                self.assertTrue(all(c.target is None for c in self.calls({'a.py': text}).modules[0].calls))

    def test_two_same_named_packages_and_missing_modules(self):
        index = self.calls({'one/__init__.py': '', 'two/__init__.py': '', 'one/w.py': 'def f(): pass',
                            'two/w.py': 'def f(): pass', 'main.py': 'from one.w import f\nfrom two.w import f as g\nf();g()\nfrom one.missing import h\nh()'})
        calls = next(m.calls for m in index.modules if m.path == 'main.py')
        self.assertNotEqual(calls[0].target, calls[1].target)
        self.assertIsNone(calls[2].target)
        self.assertEqual(calls[2].reason, 'missing_module')

    def test_multiple_roots_disable_cross_module(self):
        snap = snapshot({'src/pkg/__init__.py': '', 'src/pkg/w.py': 'def f(): pass',
                         'main.py': 'from pkg.w import f\nf()'})
        self.assertEqual(snap.identity.package_roots, ('.', 'src'))
        self.assertIn('package_root_not_unique', snap.identity.coverage.gaps)
        self.assertIsNone(next(m for m in build_index(snap).modules if m.path == 'main.py').calls[0].target)

    def test_local_library_collision_and_decorators(self):
        index = self.calls({'jwt.py': 'def encode(): pass', 'a.py': 'import jwt\njwt.encode()\n@decorator\ndef f(): pass\nf()'})
        calls = next(m.calls for m in index.modules if m.path == 'a.py')
        self.assertEqual(calls[0].target, 'source-0:<module>.encode')
        self.assertIsNone(calls[1].target)

    def test_external_complete_target_and_calls_are_not_values(self):
        index = self.calls({'a.py': 'import jwt as j\nfrom cryptography.hazmat.primitives.asymmetric import rsa\nj.encode(x,k);rsa.generate_private_key(65537,2048)'})
        self.assertEqual([c.target for c in index.modules[0].calls], ['jwt.encode', 'cryptography.hazmat.primitives.asymmetric.rsa.generate_private_key'])
        self.assertFalse(hasattr(index, 'operations'))

    def test_parse_failure_versions_and_ast_limits(self):
        index = self.calls({'a.py': 'def broken(:', 'b.py': 'pass'})
        self.assertEqual(index.coverage.parsed.count, 1)
        self.assertEqual(index.coverage.parsed.total, 2)
        self.assertEqual(index.diagnostics[0].code, 'parse_failed')
        self.assertEqual(index.target_python, '3.10')
        for budgets in (Budgets(ast_nodes=1), Budgets(ast_depth=0), Budgets(index_nodes=0), Budgets(structure_bytes=0)):
            result = self.calls({'a.py': 'import jwt\njwt.encode(x,k)'}, budgets=budgets)
            self.assertTrue(result.coverage.partial)
            self.assertEqual(result.coverage.parsed.count, 0)
        result = self.calls({'a.py': 'import jwt\njwt.encode(x,k)'}, budgets=Budgets(index_edges=0))
        self.assertEqual(result.modules[0].calls, ())
        self.assertTrue(result.coverage.partial)
        with self.assertRaises(ValueError):
            self.calls({'a.py': 'pass'}, target_minor=99)

    def test_dynamic_binding_and_failed_local_module_never_trust_library(self):
        cases = ['import jwt\nmatch data:\n case jwt: pass\njwt.encode(x,k)',
                 'import jwt\n[(jwt:=x) for x in values]\njwt.encode(x,k)',
                 'import jwt\ndef f(x=(jwt:=other)): pass\njwt.encode(x,k)',
                 'import jwt\nexec(code)\njwt.encode(x,k)',
                 'import jwt\njwt.__dict__["encode"]=other\njwt.encode(x,k)']
        for text in cases:
            with self.subTest(text=text):
                calls = self.calls({'a.py': text}).modules[0].calls
                self.assertTrue(all(c.target is None for c in calls))
        index = self.calls({'a.py': 'import jwt\njwt.encode(x,k)', 'jwt.py': 'def broken(:'})
        self.assertIsNone(index.modules[0].calls[0].target)


    def test_checkpoint_interrupts(self):
        def stop():
            raise TimeoutError('cancelled')
        with self.assertRaises(TimeoutError):
            build_index(snapshot({'a.py': 'pass'}), checkpoint=stop)
