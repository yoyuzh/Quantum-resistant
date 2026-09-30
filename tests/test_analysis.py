from __future__ import annotations

import csv
import io
import unittest

from fastapi.testclient import TestClient

from backend.analysis import build_analysis
from backend.main import app
from backend.report_exports import build_csv_report
from backend.scanning import build_scan_response
from scan_quantum_vuln import analyze_source

RSA = "from cryptography.hazmat.primitives.asymmetric.rsa import generate_private_key as gen\ngen(key_size=2048)"


class EvidenceMetadataTests(unittest.TestCase):
    def test_opt_in_keeps_legacy_fields_and_counts(self):
        old, notes = analyze_source(RSA)
        new, new_notes = analyze_source(RSA, include_metadata=True)
        self.assertEqual(notes, new_notes)
        self.assertEqual(old, [{k: v for k, v in f.items() if k not in {"detection_method", "library", "resolved_api"}} for f in new])
        self.assertEqual(new[0]["detection_method"], "ast_call")
        self.assertEqual(new[0]["library"], "cryptography")
        self.assertEqual(new[0]["resolved_api"], "cryptography.hazmat.primitives.asymmetric.rsa.generate_private_key")

    def test_known_library_and_shadowing(self):
        sources = [
            ("from Crypto.PublicKey import RSA as R\nR.generate(2048)", "PyCryptodome"),
            ("import ecdsa\necdsa.SigningKey.generate()", "ecdsa"),
            ("import cryptography.hazmat.primitives.asymmetric.rsa\ncryptography.hazmat.primitives.asymmetric.rsa.generate_private_key()", "cryptography"),
        ]
        for source, library in sources:
            with self.subTest(library=library):
                self.assertEqual(analyze_source(source, include_metadata=True)[0][0]["library"], library)
        for source in ["from unrelated import rsa\nrsa.generate_private_key()", RSA.splitlines()[0] + "\ngen = helper\ngen()"]:
            self.assertEqual(analyze_source(source, include_metadata=True)[0], [])

    def test_non_ast_calls_never_claim_library_or_api(self):
        cases = [
            ('algorithm = "RS256"', "a.py", "ast_config"),
            ('algorithm: RS256', "a.yaml", "text_config"),
            ('RSA.Create();', "a.cs", "text_call"),
            ('-----BEGIN RSA PRIVATE KEY-----', "a.pem", "pem_header"),
            (RSA + "\nif :", "a.py", "text_call"),
        ]
        for source, filename, method in cases:
            with self.subTest(method=method):
                findings, _ = analyze_source(source, filename, include_metadata=True)
                self.assertEqual(findings[0]["detection_method"], method)
                self.assertIsNone(findings[0]["library"])
                self.assertIsNone(findings[0]["resolved_api"])

    def test_unknown_pem_and_comments_are_not_assets(self):
        findings, notes = analyze_source('-----BEGIN PRIVATE KEY-----\nAAAA', 'a.pem', include_metadata=True)
        self.assertEqual(findings, [])
        self.assertEqual(notes[0]["code"], "unknown_pem_algorithm")
        self.assertEqual(build_analysis(findings)["assets"], [])
        self.assertEqual(analyze_source('# algorithm = "RS256"', include_metadata=True)[0], [])


class AnalysisReportTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.result = build_scan_response([("same.py", RSA), ("same.py", RSA + "\ngen()")], "manual_upload").model_dump()

    def test_assets_keep_same_name_identities_and_score(self):
        analysis = self.result["analysis"]
        self.assertEqual(len(analysis["assets"]), 2)
        self.assertEqual(len({asset["source_id"] for asset in analysis["assets"]}), 2)
        self.assertEqual(sum(asset["finding_count"] for asset in analysis["assets"]), 3)
        self.assertEqual(analysis["migrations"][0]["affected_files"], 2)
        self.assertEqual(analysis["migrations"][0]["purpose"], "用途待确认")
        self.assertEqual(self.result["summary"]["migration_score"]["score"], 100)

    def test_migration_sort_and_purpose(self):
        template = self.result["findings"][0]
        findings = [{**template, "algorithm": algorithm, "source_id": identity}
                    for algorithm, identity in [("RSA", "a"), ("DSA", "a"), ("DSA", "b"), ("ECDH", "a")]]
        migrations = build_analysis(findings)["migrations"]
        self.assertEqual([m["algorithm"] for m in migrations], ["DSA", "ECDH", "RSA"])
        self.assertEqual(migrations[1]["targets"], ["ML-KEM"])
        self.assertEqual(migrations[0]["purpose"], "数字签名")
        self.assertEqual(len(migrations[0]["actions"]), 4)

    def test_legacy_missing_metadata_remains_unknown(self):
        legacy = [{k: v for k, v in f.items() if k not in {"detection_method", "library", "resolved_api"}}
                  for f in self.result["findings"]]
        analysis = build_analysis(legacy)
        self.assertEqual(analysis["assets"][0]["detection_methods"], ["unknown"])
        self.assertEqual(analysis["assets"][0]["resolved_apis"], [])
        response = self.client.post("/api/report/json", json={**self.result, "findings": legacy})
        self.assertEqual(response.status_code, 200)

    def test_exports_recompute_analysis_and_omit_full_source(self):
        payload = {**self.result, "analysis": {"version": 99, "assets": ["forged"]}}
        data = self.client.post("/api/report/json", json=payload)
        self.assertEqual(data.status_code, 200)
        self.assertEqual(data.json()["analysis"], self.result["analysis"])
        self.assertTrue(all("content" not in source for source in data.json()["sources"]))
        markdown = self.client.post("/api/report/markdown", json=payload)
        self.assertEqual(markdown.status_code, 200)
        for value in ["密码资产清单", "迁移待办", "AST 调用", self.result["sources"][0]["source_id"]]:
            self.assertIn(value, markdown.text)
        csv_report = self.client.post("/api/report/csv", json=payload)
        rows = list(csv.reader(io.StringIO(csv_report.text.lstrip("\ufeff"))))
        self.assertEqual(len(rows), 4)
        self.assertEqual(rows[1][5], "AST 调用")

    def test_csv_escaping_and_formula_prefix(self):
        item = {**self.result["findings"][0], "file_name": ' =HYPERLINK("bad")', "evidence": 'a,"b"\nc'}
        rows = list(csv.reader(io.StringIO(build_csv_report([item]).lstrip("\ufeff"))))
        self.assertEqual(rows[1][1], "'" + item["file_name"])
        self.assertEqual(rows[1][8], item["evidence"])

    def test_empty_and_partial_exports_keep_scope(self):
        payload = build_scan_response([("clean.py", "x = 1")], "snippet").model_dump()
        payload["coverage"]["partial"] = True
        payload["diagnostics"] = [{"code": "partial_collection", "message": "采集不完整"}]
        data = self.client.post("/api/report/json", json=payload).json()
        self.assertEqual(data["analysis"]["assets"], [])
        self.assertTrue(data["coverage"]["partial"])
        self.assertEqual(data["diagnostics"][0]["message"], "采集不完整")


if __name__ == "__main__":
    unittest.main()
