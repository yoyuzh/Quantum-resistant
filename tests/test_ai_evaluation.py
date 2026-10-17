from __future__ import annotations

import copy
import json
import unittest
from pathlib import Path

from scripts.evaluate_ai import evaluate, load_dataset

FIXTURES = Path(__file__).parent / "fixtures/ai"


class AiEvaluationTests(unittest.TestCase):
    def setUp(self):
        self.manifest = load_dataset(FIXTURES / "manifest.json")
        self.predictions = json.loads((FIXTURES / "saved_predictions.json").read_text())

    def test_reproducible_and_known_baseline(self):
        first = evaluate(self.manifest, self.predictions)
        self.assertEqual(first, evaluate(self.manifest, self.predictions))
        self.assertEqual(set(first["groups"]), {"static", "model_only", "static_review", "hybrid"})
        self.assertEqual(first["positive_count"], 2)
        for group in first["groups"].values():
            self.assertIsNone(group["total_tokens"])

    def test_duplicate_matching_and_abstention_recall_denominator(self):
        predictions = copy.deepcopy(self.predictions)
        row = predictions["groups"]["hybrid"][0]
        row["opinions"] *= 2
        first = evaluate(self.manifest, self.predictions)["groups"]["hybrid"]
        second = evaluate(self.manifest, predictions)["groups"]["hybrid"]
        self.assertEqual(first["prediction_count"], second["prediction_count"])
        self.assertEqual(first["true_positive"], second["true_positive"])
        for rows in predictions["groups"].values():
            for record in rows:
                for opinion in record["opinions"]:
                    opinion["opinion_kind"] = "abstain"
        report = evaluate(self.manifest, predictions)
        self.assertEqual(report["groups"]["hybrid"]["recall"], 0)
        self.assertEqual(report["groups"]["hybrid"]["false_negative"], 2)

    def test_unknown_labels_zero_denominator_and_split_leak(self):
        bad = copy.deepcopy(self.manifest)
        bad["samples"][0]["labels"][0]["category"] = "unknown-label"
        with self.assertRaises(ValueError):
            evaluate(bad, self.predictions)
        bad = copy.deepcopy(self.manifest)
        bad["samples"][-1]["project_family"] = bad["samples"][0]["project_family"]
        with self.assertRaises(ValueError):
            evaluate(bad, self.predictions)
        report = evaluate(self.manifest, {"groups": {}})
        self.assertIsNone(report["groups"]["static"]["precision"])
        self.assertIsNone(report["groups"]["static"]["recall"])
        empty = copy.deepcopy(self.manifest)
        for sample in empty["samples"]:
            sample["labels"] = []
        self.assertIsNone(evaluate(empty, {"groups": {}})["groups"]["hybrid"]["f1"])


if __name__ == "__main__":
    unittest.main()
