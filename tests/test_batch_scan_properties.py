from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from hypothesis import given, settings, strategies as st

from backend.popular import BatchResult, RepoInfo, scan_single_repo
from backend.storage import write_results
from scan_quantum_vuln import build_migration_score, scan_source_for_crypto


class ScannerPropertyTests(unittest.TestCase):
    @settings(max_examples=100, deadline=None)
    @given(st.lists(st.integers(min_value=1, max_value=10000), max_size=80))
    def test_actual_batch_detail_cap(self, lines):
        findings = [{"line": line, "algorithm": "RSA", "file_name": "a.py", "risk_level": "高风险"} for line in lines]
        with patch("backend.popular.collect_github_sources", return_value=[("origin", "a.py", "pass")]), patch("backend.popular.analyze_source", return_value=(findings, [])):
            result = scan_single_repo(RepoInfo("a/b", "https://github.com/a/b", 1))
        self.assertEqual(result.finding_count, len(lines))
        self.assertEqual([f["line"] for f in result.findings], sorted(lines)[:20])

    @settings(max_examples=80, deadline=None)
    @given(st.lists(st.tuples(st.sampled_from(["RSA", "ECDSA", "DH"]), st.integers(1, 8)), max_size=50))
    def test_score_bounds_and_identity_counts(self, pairs):
        findings = [{"algorithm": a, "source_id": str(i), "file_name": "same.py", "risk_level": "高风险"} for a, i in pairs]
        score = build_migration_score([], findings)
        self.assertEqual(score["affected_files"], len({i for _, i in pairs}))
        self.assertEqual(score["algorithm_variety"], len({a for a, _ in pairs}))
        self.assertGreaterEqual(score["score"], 0)
        self.assertLessEqual(score["score"], 100)
        self.assertEqual(score["score"] == 0, not pairs)

    @settings(max_examples=60, deadline=None)
    @given(st.text(alphabet=st.characters(blacklist_categories=("Cs",)), max_size=100))
    def test_json_roundtrip(self, name):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "popular.json"
            write_results(BatchResult("now", [{"full_name": name}]), path)
            self.assertEqual(json.loads(path.read_text(encoding="utf-8"))["repos"][0]["full_name"], name)

    @settings(max_examples=100, deadline=None)
    @given(st.text(alphabet=st.characters(blacklist_categories=("Cs",)), max_size=300))
    def test_arbitrary_text_is_not_executed_or_crashing(self, source):
        result = scan_source_for_crypto(source)
        self.assertIsInstance(result, list)
