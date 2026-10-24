from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi.testclient import TestClient
from pydantic import ValidationError

from backend.ai.config import LIMITS, _read_dotenv, get_config, load_config
from backend.ai.models import (
    AiAnalysisResult, AiCoverage, CandidateCoverage, Citation, ModelOpinion,
    SubmitRequest, Usage, finding_fingerprint, stable_digest,
)
from backend.main import app


class AiConfigTests(unittest.TestCase):
    def env(self, **extra):
        return {"QUANTUM_AI_ENABLED": "true", "QUANTUM_AI_BASE_URL": "https://model.example/v1",
                "QUANTUM_AI_MODEL": "review-model", "QUANTUM_AI_API_KEY": "test-secret", **extra}

    def test_default_disabled_and_no_network(self):
        with patch("httpx.Client", side_effect=AssertionError("不能联网")):
            config = load_config({})
            self.assertFalse(config.enabled)
            self.assertFalse(config.valid)
            self.assertEqual(config.public()["budgets"], LIMITS)

    def test_dotenv_parser_reads_quotes_without_overriding_explicit_mapping(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / ".env"
            path.write_text("# comment\nexport QUANTUM_AI_ENABLED='true'\nQUANTUM_AI_MODEL=fixture\nINVALID-NAME=x\n", encoding="utf-8")
            values = _read_dotenv(path)
        self.assertEqual(values, {"QUANTUM_AI_ENABLED": "true", "QUANTUM_AI_MODEL": "fixture"})
        self.assertFalse(load_config({"QUANTUM_AI_ENABLED": "false"}).valid)

    def test_valid_urls(self):
        for url in ("https://model.example/private/path", "http://localhost:8888/v1",
                    "http://127.0.0.1/v1", "http://[::1]:8888/v1"):
            with self.subTest(url=url):
                config = load_config(self.env(QUANTUM_AI_BASE_URL=url))
                self.assertTrue(config.valid)
                self.assertNotIn("private/path", config.public()["target_origin"])

    def test_invalid_urls_never_echo_secrets(self):
        for url in ("http://model.example/v1", "https://u:test-secret@model.example/v1",
                    "https://model.example/v1?token=test-secret", "https://model.example/v1?",
                    "https://model.example/v1#", "ftp://model.example", "https://model.example:bad",
                    "https://model.example/\nsecret", "https://model.example\\evil"):
            with self.subTest(url=url):
                config = load_config(self.env(QUANTUM_AI_BASE_URL=url))
                self.assertFalse(config.valid)
                self.assertNotIn("test-secret", json.dumps(config.public()))
                self.assertNotIn(url, repr(config))

    def test_budget_validation_and_output_parameter(self):
        for field, maximum in LIMITS.items():
            for value, valid in (("1", True), (str(maximum), True), ("0", False),
                                 (str(maximum + 1), False), ("oops", False)):
                with self.subTest(field=field, value=value):
                    config = load_config(self.env(**{f"QUANTUM_AI_{field.upper()}": value}))
                    self.assertEqual(config.valid, valid)
        self.assertTrue(load_config(self.env(QUANTUM_AI_OUTPUT_PARAMETER="max_completion_tokens")).valid)
        self.assertFalse(load_config(self.env(QUANTUM_AI_OUTPUT_PARAMETER="stream")).valid)
        self.assertIsNone(load_config(self.env()).reasoning_effort)
        for effort in ("none", "low", "high", "max"):
            config = load_config(self.env(QUANTUM_AI_REASONING_EFFORT=effort))
            self.assertTrue(config.valid)
            self.assertEqual(config.public()["reasoning_effort"], effort)
        self.assertFalse(load_config(self.env(QUANTUM_AI_REASONING_EFFORT="unbounded")).valid)
        self.assertNotEqual(load_config(self.env()).internal_version(),
                            load_config(self.env(QUANTUM_AI_REASONING_EFFORT="none")).internal_version())

    def test_public_version_and_internal_credential_binding(self):
        one = load_config(self.env())
        two = load_config(self.env(QUANTUM_AI_API_KEY="another-secret"))
        self.assertEqual(one.public(), two.public())
        self.assertNotEqual(one.internal_version(), two.internal_version())
        self.assertNotIn("test-secret", json.dumps(one.public()))
        self.assertNotIn("test-secret", repr(one))

    def test_route_is_read_only_and_boundary_is_shared(self):
        config = load_config(self.env())
        client = TestClient(app)
        with patch("backend.ai.routes.get_config", return_value=config):
            response = client.get("/api/ai/config")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json(), config.public())
            self.assertEqual(response.headers["cache-control"], "no-store")
            self.assertNotIn("test-secret", response.text)
            self.assertEqual(client.get("/api/ai/config", headers={"Host": "evil.example"}).status_code, 400)
            self.assertEqual(client.post("/api/ai/config", headers={"Origin": "https://evil.example"}, json={}).status_code, 403)


class AiModelTests(unittest.TestCase):
    def opinion(self, **extra):
        return {"candidate_id": "a" * 64, "algorithm": "unknown", "purpose": "unknown",
                "opinion_kind": "abstain", "rationale": "需要调用实现", "missing_information": ["实现未知"],
                "citations": [], **extra}

    def test_unknowns_abstention_and_enums(self):
        self.assertEqual(ModelOpinion(**self.opinion()).algorithm, "unknown")
        for extra in ({"opinion_kind": "safe"}, {"rationale": "x" * 2001}, {"algorithm": ""},
                      {"confidence": 0.9}, {"candidate_id": "bad"}, {"citations": [{}]},
                      {"missing_information": ["x" * 501]}):
            with self.subTest(extra=extra), self.assertRaises(ValidationError):
                ModelOpinion(**self.opinion(**extra))

    def test_stable_fingerprints_and_source_identity(self):
        self.assertEqual(stable_digest({"a": 1, "b": 2}), stable_digest({"b": 2, "a": 1}))
        finding = {"source_id": "one", "line": 2, "algorithm": "RSA", "evidence": "rsa()"}
        self.assertEqual(finding_fingerprint(finding), finding_fingerprint({**finding, "reason": "新说明"}))
        self.assertNotEqual(finding_fingerprint(finding), finding_fingerprint({**finding, "source_id": "two"}))

    def test_ranges_consent_and_unknown_usage(self):
        with self.assertRaises(ValidationError):
            Citation(source_id="one", start_line=4, end_line=3, quote="x")
        for consent in (False, "true", 1):
            with self.assertRaises(ValidationError):
                SubmitRequest(preview_id="one", digest="a" * 64, consent=consent)
        self.assertEqual(Usage().model_dump(), {"prompt_tokens": None, "completion_tokens": None, "total_tokens": None})
        result = AiAnalysisResult(source_task_id="one", input_digest="a" * 64,
                                  created_at="2026-10-16T12:00:00+08:00", provider="https://model.example",
                                  model="review-model", candidate_coverage=CandidateCoverage(),
                                  ai_coverage=AiCoverage(planned=0), candidates=[])
        self.assertNotIn("findings", result.model_dump())
        self.assertIsNone(result.usage.total_tokens)


if __name__ == "__main__":
    unittest.main()
