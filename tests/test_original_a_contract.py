"""Product boundary contracts; source strings are parsed, never executed."""
from __future__ import annotations

import json
import hashlib
from pathlib import Path
import subprocess
import unittest
import tempfile
from types import SimpleNamespace
import time
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
A_SHA = 'd8e07c903d5cd15e19142613491bb7dbae69699d'


class OriginalAContractTests(unittest.TestCase):
    def test_vendored_sources_are_only_namespace_relocated(self):
        manifest = json.loads((ROOT / 'original_a/manifest.json').read_text())
        self.assertEqual(manifest['commit'], A_SHA)
        for name in manifest['files']:
            original = subprocess.check_output(['git', 'show', f'{A_SHA}:{name}'], cwd=ROOT).decode()
            expected = original.replace('from deep_analysis', 'from original_a.deep_analysis').replace('from scanner', 'from original_a.scanner')
            self.assertEqual((ROOT / 'original_a' / name).read_text(), expected, name)

    def test_producer_and_verifier_are_both_original_a(self):
        from backend.original_a import analyze_crypto
        from original_a.deep_analysis.pipeline import analyze_crypto as producer
        from original_a.deep_analysis.verifier import Verifier
        self.assertIs(analyze_crypto, producer)
        self.assertTrue(Verifier.__module__.startswith('original_a.'))

    def test_scope_is_transport_only_and_evidence_is_unchanged(self):
        from backend.original_a import adapt_result, analyze_crypto, build_snapshot
        from types import SimpleNamespace
        text = 'import jwt\nclass Tokens:\n def read(self,t): return jwt.decode(t,key,algorithms=["RS256"])\n'
        snapshot = build_snapshot([SimpleNamespace(file_name='main.py', source_id='one', content=text, content_available=True)], 'snippet')
        original = analyze_crypto(snapshot).model_dump(mode='json')
        adapted = adapt_result(original)
        self.assertEqual(adapted['evidence_paths'], original['evidence_paths'])
        for before, after in zip(original['operations'], adapted['operations']):
            self.assertEqual(after['evidence_scope'], 'algorithm_policy')
            self.assertEqual(before, {k:v for k,v in after.items() if k != 'evidence_scope'})
        self.assertEqual(adapted['versions'], original['versions'])

    def test_basic_runtime_does_not_call_main_static_rules(self):
        from scanner.engine import analyze_source
        from original_a.scanner.engine import analyze_source as original
        text = 'import jwt\njwt.encode({},key,algorithm="RS256")\n'
        with patch('scanner.python_analysis.analyze_with_ast', side_effect=AssertionError('main engine called')):
            self.assertEqual(analyze_source(text), original(text))

    def test_basic_cancellation_crosses_namespace_boundary(self):
        from scanner.engine import analyze_source
        from scanner.control import analysis_control
        calls = []
        def checkpoint():
            calls.append(1)
            if len(calls) > 2:
                raise RuntimeError('cancelled')
        with self.assertRaisesRegex(RuntimeError, 'cancelled'):
            with analysis_control(checkpoint):
                analyze_source('import jwt\njwt.encode({},key,algorithm="RS256")\n')

    def boundary(self, files):
        from backend.collection_common import Deadline
        from backend.temp_storage import TemporaryStorage
        storage = TemporaryStorage()
        self.addCleanup(storage.close)
        control = Deadline.after().control
        control.storage, control.folder = storage, storage.folder()
        control.source_paths = {f's{i}': storage.write_source(control.folder, text.encode()) for i, (_, text) in enumerate(files)}
        control.path_fidelity = True
        control.source_facts = {}
        base = {'source_type': 'manual_upload', 'sources': [dict(source_id=f's{i}', file_name=name, source_type='manual_upload') for i, (name, _) in enumerate(files)]}
        return base, control

    def test_file_limit_and_retrieval_index_have_separate_coverage(self):
        from backend.collection_common import Deadline
        from backend.deep_scanning import run_deep
        files = [(f'm{i:03d}.py', 'import jwt\ndef issue(): return jwt.encode({},key,algorithm="RS256")\n') for i in range(201)]
        base, control = self.boundary(files)
        with patch('deep_analysis.pipeline.analyze_crypto', side_effect=AssertionError('main producer called')):
            result = run_deep(base, Deadline(time.monotonic() + 120, control))['deep_analysis']
        self.assertEqual(result['status'], 'partial')
        self.assertEqual(result['coverage']['selected'], {'count': 200, 'total': 201})
        self.assertIn('file_limit', result['coverage']['gaps'])
        self.assertEqual(result['retrieval_index']['parsed'], 201)
        self.assertEqual(len(control.source_facts), 201)
        facts = json.loads(control.source_facts['s200'].read_text())
        self.assertEqual(facts['sha256'], hashlib.sha256(files[200][1].encode()).hexdigest())
        self.assertEqual(facts['functions'][0]['name'], 'issue')
        self.assertEqual(facts['calls'][0]['line'], 2)

    def test_source_byte_limit_is_not_expanded(self):
        from backend.original_a import source_snapshot
        from backend.collection_common import Deadline
        files = [(f'm{i}.py', '# ' + 'x' * (2 * 1024 * 1024 - 3) + '\n') for i in range(5)]
        base, control = self.boundary(files)
        snapshot = source_snapshot(base, control, Deadline(time.monotonic() + 120, control))
        self.assertEqual(len(snapshot.logical.sources), 4)
        self.assertEqual(snapshot.identity.coverage.selected.total, 5)
        self.assertIn('source_limit', snapshot.identity.coverage.gaps)
        self.assertTrue(snapshot.identity.coverage.partial)

    def test_candidate_cache_binds_entire_snapshot_and_static_versions(self):
        from backend.ai.context import catalog
        files = [('main.py', 'def encrypt(x): return runtime_encrypt(x)\nencrypt(data)\n'), ('dependency.py', 'v=1\n')]
        base, control = self.boundary(files)
        first = catalog(base, control, lambda: None)
        control.source_paths['s1'] = control.storage.write_source(control.folder, b'v=2\n')
        second = catalog(base, control, lambda: None)
        self.assertNotEqual(first['snapshot'], second['snapshot'])
        self.assertNotEqual(first['candidates'][0]['candidate_id'], second['candidates'][0]['candidate_id'])
        base['deep_analysis'] = {'versions': {'engine': 'incompatible'}}
        third = catalog(base, control, lambda: None)
        self.assertNotEqual(second['candidates'][0]['candidate_id'], third['candidates'][0]['candidate_id'])

    def test_same_name_sources_do_not_share_candidate_identity(self):
        from backend.ai.context import catalog
        base, control = self.boundary([('same.py', 'encrypt(data)\n'), ('same.py', 'encrypt(data)\n')])
        value = catalog(base, control, lambda: None)
        self.assertEqual(len(value['candidates']), 2)
        self.assertEqual(len({c['candidate_id'] for c in value['candidates']}), 2)

    def test_summary_preserves_unique_source_package_root(self):
        from backend.original_a import summarize_sources
        from backend.collection_common import Deadline
        files = [('src/pkg/__init__.py', ''), ('src/pkg/keys.py', 'from .other import issue\ndef key_factory(): return issue()\n'),
                 ('src/pkg/other.py', 'def issue(): return runtime_key\n')]
        base, control = self.boundary(files)
        summarize_sources(base, control, Deadline(time.monotonic() + 120, control))
        facts = json.loads(control.source_facts['s1'].read_text())
        self.assertEqual(facts['module'], 'pkg.keys')
        self.assertEqual(facts['imports'][0]['target'], 'pkg.other.issue')

    def test_missing_summary_cannot_bypass_static_snapshot_digest(self):
        from backend.ai.context import catalog
        base, control = self.boundary([('main.py', 'encrypt(data)\n')])
        base['deep_analysis'] = {'snapshot': {'sources': [{'source_id': 's0', 'sha256': hashlib.sha256(b'old_source').hexdigest()}]}}
        value = catalog(base, control, lambda: None)
        self.assertEqual(value['candidates'], [])
        self.assertIn('source_digest_mismatch', value['diagnostics'])
        self.assertTrue(value['partial'])

    def test_verifier_replay_keeps_original_versions_and_rejects_changed_source(self):
        from backend.original_a import build_snapshot, analyze_crypto
        from original_a.deep_analysis.pipeline import revalidate
        from original_a.deep_analysis.verifier import Verifier
        text = 'import jwt\njwt.encode({},key,algorithm="RS256")\n'
        docs = [SimpleNamespace(file_name='main.py', source_id='one', content=text, content_available=True)]
        source = build_snapshot(docs, 'snippet')
        with patch('deep_analysis.verifier.Verifier.check', side_effect=AssertionError('main verifier used')):
            result = analyze_crypto(source)
        expired = revalidate(result, None)
        self.assertTrue(all(p.replay_status == 'unavailable' for p in expired.evidence_paths))
        changed = build_snapshot([SimpleNamespace(file_name='main.py', source_id='one', content=text.replace('RS256','HS256'), content_available=True)], 'snippet')
        invalid = revalidate(result, changed)
        self.assertEqual(invalid.versions, result.versions)
        self.assertEqual(invalid.snapshot, result.snapshot)
        self.assertTrue(all(p.verification_status == 'invalid' for p in invalid.evidence_paths))


if __name__ == '__main__':
    unittest.main()
