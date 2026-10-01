from __future__ import annotations

import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient

from backend.collection_common import CollectedSources, CollectionTimeout
from backend.main import app


class ApiBoundaryTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_upload_field_name(self):
        self.assertEqual(self.client.post("/api/scan/files", files=[("wrong", ("a.py", b"x=1"))]).status_code, 400)

    def test_encoding_suffix_and_count(self):
        for files, status in [([("files", ("a.py", b"\xff"))], 400), ([("files", ("a.exe", b"x"))], 400), ([("files", ("a.py", b"x"))] * 81, 200), ([("files", ("a.py", b"x"))] * 5001, 413)]:
            self.assertEqual(self.client.post("/api/scan/files", files=files).status_code, status)

    def test_upload_size_limits(self):
        with patch("backend.upload_stream.MAX_UPLOAD_BYTES", 10):
            response = self.client.post("/api/scan/files", content=iter([b"x" * 6, b"y" * 6]), headers={"Content-Type": "multipart/form-data; boundary=x"})
            self.assertEqual(response.status_code, 413)
        with patch("backend.upload_stream.MAX_COLLECTED_FILE_BYTES", 2):
            self.assertEqual(self.client.post("/api/scan/files", files=[("files", ("a.py", b"xxx"))]).status_code, 413)

    def test_snippet_byte_limit_and_empty(self):
        self.assertEqual(self.client.post("/api/scan/snippet", json={"content": " "}).status_code, 400)
        with patch("backend.scanning.MAX_SOURCE_BYTES", 5):
            self.assertEqual(self.client.post("/api/scan/snippet", json={"content": "中文"}).status_code, 413)

    def test_same_name_sources_and_report_diagnostics(self):
        response = self.client.post("/api/scan/files", files=[("files", ("same.py", b'algorithm = "RS256"')), ("files", ("same.py", b'algorithm = "ES256"'))])
        data = response.json()
        self.assertEqual(len({s["source_id"] for s in data["sources"]}), 2)
        self.assertEqual(data["summary"]["migration_score"]["affected_files"], 2)
        data["diagnostics"] = [{"code": "test", "message": "需要复核"}]
        report = self.client.post("/api/report/markdown", json=data)
        self.assertEqual(report.status_code, 200)
        self.assertIn("需要复核", report.text)
        self.assertIn("| 已分析文件 | 2 |", report.text)

    @patch("backend.main.collect_github_sources")
    def test_partial_collection_and_timeout(self, collect):
        collect.return_value = CollectedSources([("url", "a.py", "x=1")], candidates=3, skipped=2, partial=True)
        data = self.client.post("/api/scan/github", json={"repository_url": "https://github.com/a/b"}).json()
        self.assertTrue(data["coverage"]["partial"])
        self.assertEqual(data["coverage"]["skipped_files"], 2)
        collect.side_effect = CollectionTimeout("超时")
        self.assertEqual(self.client.post("/api/scan/github", json={"repository_url": "https://github.com/a/b"}).status_code, 504)

    def test_unknown_pem_diagnostic(self):
        data = self.client.post("/api/scan/snippet", json={"filename": "key.pem", "content": "-----BEGIN PRIVATE KEY-----"}).json()
        self.assertEqual(data["findings"], [])
        self.assertEqual(data["diagnostics"][0]["code"], "unknown_pem_algorithm")
