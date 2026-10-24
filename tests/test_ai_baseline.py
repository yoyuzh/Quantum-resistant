from __future__ import annotations

import json
import unittest
from pathlib import Path

from backend.ai.context import build_context
from backend.ai.metrics import throughput_metrics

FIXTURE = Path(__file__).parent / "fixtures/ai/baseline/throughput_cases.py"


class AiBaselineTests(unittest.TestCase):
    def test_fixed_counterexample_is_reproducible(self):
        text = FIXTURE.read_text(encoding="utf-8")
        result = {
            "sources": [{"source_id": "baseline", "file_name": FIXTURE.name,
                          "content_available": True}],
            "findings": [], "diagnostics": [], "coverage": {"partial": False},
        }
        budgets = {"search_files": 10, "search_bytes": 100_000, "preview_candidates": 40,
                   "preview_files": 10, "candidate_bytes": 4096, "context_bytes": 100_000}
        first, first_coverage = build_context(result, lambda _: text, budgets, lambda: None)
        second, second_coverage = build_context(result, lambda _: text, budgets, lambda: None)
        self.assertEqual([item.model_dump() for item in first], [item.model_dump() for item in second])
        self.assertEqual(first_coverage.model_dump(), second_coverage.model_dump())
        self.assertGreaterEqual(first_coverage.discovered_candidates, 8)
        self.assertEqual(first_coverage.selected_candidates, len(first))
        self.assertTrue(any(item.start_line == 5 for item in first))
        self.assertTrue(any(item.start_line == 16 for item in first))
        self.assertTrue(any(item.start_line == 24 for item in first))
        self.assertTrue(any(item.start_line == 16 for item in first))

    def test_metrics_are_explicit_and_position_safe(self):
        report = throughput_metrics(discovered=10, aggregated=6, positions=10,
                                    retained_positions=10, semantic_errors=0,
                                    valid_opinions=4, opinions=6, elapsed_seconds=1.5,
                                    completed=4, requests=2)
        self.assertEqual(report["aggregation_compression_rate"], 0.4)
        self.assertEqual(report["position_retention_rate"], 1.0)
        self.assertEqual(report["semantic_error_merges"], 0)
        self.assertAlmostEqual(report["valid_opinion_coverage"], 2 / 3)
        self.assertIsNone(throughput_metrics(discovered=0, aggregated=0, positions=0,
                                             retained_positions=0, semantic_errors=0,
                                             valid_opinions=0, opinions=0, elapsed_seconds=0,
                                             completed=0, requests=0)["position_retention_rate"])


if __name__ == "__main__":
    unittest.main()
