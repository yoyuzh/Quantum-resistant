import subprocess
import sys
import unittest
from pathlib import Path

from scan_quantum_vuln import (
    build_migration_score,
    format_findings,
    scan_code_for_crypto,
    scan_source_for_crypto,
    scan_with_regex,
)


class QuantumScannerTests(unittest.TestCase):
    def test_detects_rsa_usage_in_sample_file(self) -> None:
        findings = scan_code_for_crypto("sample_rsa_code.py")
        self.assertTrue(findings)
        self.assertEqual(findings[0]["algorithm"], "RSA")
        self.assertEqual(findings[0]["line"], 15)
        self.assertEqual(findings[0]["file_name"], "sample_rsa_code.py")
        self.assertIn("高风险", findings[0]["risk_level"])

    def test_formats_human_readable_summary(self) -> None:
        findings = scan_code_for_crypto("sample_rsa_code.py")
        summary = format_findings(findings)
        self.assertIn("发现量子脆弱算法：RSA", summary)
        self.assertIn("第15行", summary)

    def test_regex_fallback_ignores_strings_and_comments(self) -> None:
        source = "\n".join(
            [
                "# rsa.generate_private_key() should not be reported",
                'doc = "rsa.generate_private_key()"',
                "message = 'ECDH() is only text here'",
            ]
        )
        findings = scan_with_regex(source)
        self.assertEqual(findings, [])

    def test_syntax_error_fallback_still_detects_alias_usage(self) -> None:
        broken_source = "\n".join(
            [
                "from cryptography.hazmat.primitives.asymmetric import ec as curves",
                "signature = curves.ECDSA(",
            ]
        )
        findings = scan_source_for_crypto(broken_source, filename="broken_sample.py")
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0]["algorithm"], "ECDSA")
        self.assertEqual(findings[0]["line"], 2)
        self.assertEqual(findings[0]["file_name"], "broken_sample.py")

    def test_plain_method_names_do_not_trigger_false_positives(self) -> None:
        source = "\n".join(
            [
                "curve_helper.ECDH()",
                "service.rsa.generate_private_key()",
                "SigningKey.generate()",
            ]
        )
        findings = scan_source_for_crypto(source, filename="safe_sample.py")
        self.assertEqual(findings, [])

    def test_detects_modern_curve_api_usage(self) -> None:
        source = "\n".join(
            [
                "from cryptography.hazmat.primitives.asymmetric import x25519, ed25519",
                "exchange_key = x25519.X25519PrivateKey.generate()",
                "signing_key = ed25519.Ed25519PrivateKey.generate()",
            ]
        )

        findings = scan_source_for_crypto(source, filename="modern_curves.py")

        self.assertEqual([finding["algorithm"] for finding in findings], ["X25519", "Ed25519"])
        self.assertEqual([finding["line"] for finding in findings], [2, 3])

    def test_detects_protocol_algorithm_identifiers(self) -> None:
        source = "\n".join(
            [
                'jwt_algorithm = "RS256"',
                'ssh_algorithm = "ssh-rsa"',
                'ecdsa_algorithm = "ecdsa-sha2-nistp256"',
            ]
        )

        findings = scan_source_for_crypto(source, filename="protocol_config.py")

        self.assertEqual(
            [finding["algorithm"] for finding in findings],
            ["RSA", "RSA", "ECDSA"],
        )
        self.assertTrue(all("算法标识" in finding["evidence"] for finding in findings))

    def test_detects_protocol_identifier_in_dict_config(self) -> None:
        source = 'config = {"jwt_algorithm": "RS256", "ssh_host_key": "ssh-ed25519"}'

        findings = scan_source_for_crypto(source, filename="dict_config.py")

        self.assertEqual([finding["algorithm"] for finding in findings], ["Ed25519", "RSA"])

    def test_detects_dotnet_crypto_api_usage_with_regex_fallback(self) -> None:
        source = "\n".join(
            [
                "using System.Security.Cryptography;",
                "var rsa = RSA.Create();",
                "var ecdsa = ECDsa.Create();",
            ]
        )

        findings = scan_source_for_crypto(source, filename="Program.cs")

        self.assertEqual([finding["algorithm"] for finding in findings], ["RSA", "ECDSA"])

    def test_detects_pem_key_material_headers(self) -> None:
        source = "\n".join(
            [
                "-----BEGIN RSA PRIVATE KEY-----",
                "-----BEGIN EC PRIVATE KEY-----",
                "-----BEGIN DSA PRIVATE KEY-----",
            ]
        )

        findings = scan_source_for_crypto(source, filename="keys.pem")

        self.assertEqual(
            [finding["algorithm"] for finding in findings],
            ["RSA", "ECC", "DSA"],
        )
        self.assertTrue(all("PEM" in finding["evidence"] for finding in findings))

    def test_migration_score_prioritizes_high_risk_multi_file_findings(self) -> None:
        sources = [
            {"file_name": "rsa_demo.py"},
            {"file_name": "ecdsa_demo.py"},
        ]
        findings = [
            {"file_name": "rsa_demo.py", "algorithm": "RSA", "risk_level": "高风险"},
            {"file_name": "ecdsa_demo.py", "algorithm": "ECDSA", "risk_level": "高风险"},
        ]

        score = build_migration_score(sources, findings)

        self.assertEqual(score["risk_level"], "高")
        self.assertEqual(score["priority"], "立即规划迁移")
        self.assertEqual(score["high_risk_findings"], 2)
        self.assertEqual(score["affected_files"], 2)
        self.assertEqual(score["algorithm_variety"], 2)

    def test_migration_score_marks_clean_sources_low_priority(self) -> None:
        score = build_migration_score([{"file_name": "clean.py"}], [])

        self.assertEqual(score["score"], 0)
        self.assertEqual(score["risk_level"], "低")
        self.assertEqual(score["priority"], "持续观察")

    def test_human_explanation_does_not_trigger_protocol_identifier_scan(self) -> None:
        source = "\n".join(
            [
                'note = "RSA and ECDSA are discussed in this document"',
                'comment = "X25519 appears only as free text, not a configured algorithm"',
            ]
        )

        findings = scan_source_for_crypto(source, filename="notes.py")

        self.assertEqual(findings, [])

    def test_non_python_yaml_like_text_does_not_crash_and_can_still_match_algorithms(self) -> None:
        source = "\n".join(
            [
                "metadata:",
                "  id: coverage-uuid",
                "  ssh_algorithm: ssh-rsa",
            ]
        )

        findings = scan_source_for_crypto(source, filename="workflow.yml")

        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0]["algorithm"], "RSA")
        self.assertEqual(findings[0]["file_name"], "workflow.yml")

    def test_null_byte_source_falls_back_without_crashing(self) -> None:
        findings = scan_source_for_crypto(
            "from Crypto.PublicKey import RSA\nRSA.generate(2048)\x00",
            filename="null_byte.py",
        )

        self.assertEqual([finding["algorithm"] for finding in findings], ["RSA"])

    def test_missing_file_returns_non_zero_exit_code(self) -> None:
        repo_root = Path(__file__).resolve().parents[1]
        result = subprocess.run(
            [sys.executable, "-B", "scan_quantum_vuln.py", "missing_demo_file.py"],
            cwd=repo_root,
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("扫描失败", result.stderr)


if __name__ == "__main__":
    unittest.main()
