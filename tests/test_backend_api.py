import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient

from backend.main import app


class BackendApiTests(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_scan_snippet_returns_file_line_and_finding_metadata(self) -> None:
        source = "\n".join(
            [
                "from cryptography.hazmat.primitives.asymmetric import rsa",
                "key = rsa.generate_private_key(public_exponent=65537, key_size=2048)",
            ]
        )
        response = self.client.post(
            "/api/scan/snippet",
            json={"filename": "demo.py", "content": source},
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["summary"]["finding_count"], 1)
        self.assertEqual(payload["sources"][0]["file_name"], "demo.py")
        self.assertEqual(payload["findings"][0]["file_name"], "demo.py")
        self.assertEqual(payload["findings"][0]["line"], 2)
        self.assertEqual(payload["findings"][0]["algorithm"], "RSA")
        self.assertTrue(payload["scanned_at"].endswith("+08:00"))
        self.assertEqual(payload["summary"]["migration_score"]["risk_level"], "高")
        self.assertEqual(payload["summary"]["migration_score"]["priority"], "立即规划迁移")
        self.assertEqual(payload["summary"]["migration_score"]["high_risk_findings"], 1)

    def test_root_serves_web_app(self) -> None:
        response = self.client.get("/")

        self.assertEqual(response.status_code, 200)
        self.assertIn("抗量子迁移风险扫描平台", response.text)
        self.assertIn("/static/assets/", response.text)

    def test_scan_files_accepts_multiple_uploaded_sources(self) -> None:
        rsa_source = "\n".join(
            [
                "from cryptography.hazmat.primitives.asymmetric import rsa",
                "key = rsa.generate_private_key(public_exponent=65537, key_size=2048)",
            ]
        ).encode("utf-8")
        ecdsa_source = "\n".join(
            [
                "from cryptography.hazmat.primitives.asymmetric import ec",
                "signature = ec.ECDSA()",
            ]
        ).encode("utf-8")

        response = self.client.post(
            "/api/scan/files",
            files=[
                ("files", ("rsa_demo.py", rsa_source, "text/x-python")),
                ("files", ("ecdsa_demo.py", ecdsa_source, "text/x-python")),
            ],
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["summary"]["source_count"], 2)
        self.assertEqual(payload["summary"]["finding_count"], 2)
        self.assertEqual(payload["summary"]["algorithm_counts"], {"ECDSA": 1, "RSA": 1})
        self.assertEqual(payload["summary"]["migration_score"]["affected_files"], 2)
        self.assertEqual(payload["summary"]["migration_score"]["algorithm_variety"], 2)

    def test_scan_github_validates_repository_url(self) -> None:
        response = self.client.post("/api/scan/github", json={"repository_url": "https://example.com/demo"})

        self.assertEqual(response.status_code, 422)

    def test_scan_github_uses_collected_sources(self) -> None:
        with patch(
            "backend.main.collect_github_sources",
            return_value=[
                (
                    "https://github.com/example/demo",
                    "crypto_demo.py",
                    "from cryptography.hazmat.primitives.asymmetric import rsa\n"
                    "key = rsa.generate_private_key(public_exponent=65537, key_size=2048)",
                )
            ],
        ):
            response = self.client.post(
                "/api/scan/github",
                json={"repository_url": "https://github.com/example/demo"},
            )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["source_type"], "github_repository")
        self.assertEqual(payload["sources"][0]["origin"], "https://github.com/example/demo")
        self.assertEqual(payload["findings"][0]["algorithm"], "RSA")

    def test_scan_pypi_validates_package_name(self) -> None:
        response = self.client.post("/api/scan/pypi", json={"package_name": "../bad"})

        self.assertEqual(response.status_code, 422)

    def test_scan_pypi_uses_collected_sources(self) -> None:
        with patch(
            "backend.main.collect_pypi_sources",
            return_value=[
                (
                    "pypi:demo-package",
                    "jwt_config.py",
                    'jwt_algorithm = "RS256"',
                )
            ],
        ):
            response = self.client.post("/api/scan/pypi", json={"package_name": "demo-package"})

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["source_type"], "pypi_package")
        self.assertEqual(payload["sources"][0]["origin"], "pypi:demo-package")
        self.assertEqual(payload["findings"][0]["algorithm"], "RSA")

    def test_knowledge_graph_returns_algorithm_recommendation_edges(self) -> None:
        response = self.client.get("/api/knowledge/graph")

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        node_ids = {node["id"] for node in payload["nodes"]}
        edge_pairs = {(edge["source"], edge["target"]) for edge in payload["edges"]}
        self.assertIn("algorithm:RSA", node_ids)
        self.assertIn("pqc:ML-KEM", node_ids)
        self.assertIn(("algorithm:RSA", "math:integer-factorization"), edge_pairs)
        self.assertIn(("algorithm:ECDSA", "pqc:ML-DSA"), edge_pairs)

    def test_markdown_report_contains_summary_and_details(self) -> None:
        scan_response = self.client.post(
            "/api/scan/snippet",
            json={
                "filename": "report_demo.py",
                "content": "\n".join(
                    [
                        "from cryptography.hazmat.primitives.asymmetric import rsa",
                        "key = rsa.generate_private_key(public_exponent=65537, key_size=2048)",
                    ]
                ),
            },
        )
        response = self.client.post("/api/report/markdown", json=scan_response.json())

        self.assertEqual(response.status_code, 200)
        self.assertIn("# 量子脆弱密码算法扫描报告", response.text)
        self.assertIn("report_demo.py", response.text)
        self.assertIn("RSA", response.text)
        self.assertIn("风险发现总数：1", response.text)
        self.assertIn("迁移优先级：立即规划迁移", response.text)
        self.assertIn("+08:00", response.text)

    def test_markdown_report_handles_clean_sources(self) -> None:
        scan_response = self.client.post(
            "/api/scan/snippet",
            json={"filename": "clean.py", "content": "print('hello')"},
        )
        response = self.client.post("/api/report/markdown", json=scan_response.json())

        self.assertEqual(response.status_code, 200)
        self.assertIn("风险发现总数：0", response.text)
        self.assertIn("未发现已知量子脆弱公钥算法用法", response.text)


if __name__ == "__main__":
    unittest.main()
