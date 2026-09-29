from __future__ import annotations

import unittest

from scan_quantum_vuln import analyze_source, build_migration_score, scan_source_for_crypto


class ScannerRegressionTests(unittest.TestCase):
    def test_methods_skip_class_namespace(self):
        prefix = "from cryptography.hazmat.primitives.asymmetric import rsa\n"
        self.assertEqual(self.algorithms(prefix + "class A:\n    rsa = object()\n    def method(self):\n        rsa.generate_private_key()"), ["RSA"])
        self.assertEqual(self.algorithms("class A:\n    from cryptography.hazmat.primitives.asymmetric import rsa\n    def method(self):\n        rsa.generate_private_key()"), [])

    def test_comprehension_target_does_not_shadow_enclosing_function(self):
        source = "from cryptography.hazmat.primitives.asymmetric import rsa\ndef f():\n    [rsa for rsa in values]\n    rsa.generate_private_key()"
        self.assertEqual(self.algorithms(source), ["RSA"])

    def test_lambda_default_is_scanned_in_enclosing_scope(self):
        source = "from cryptography.hazmat.primitives.asymmetric import rsa\nf = lambda key=rsa.generate_private_key(): key"
        self.assertEqual(self.algorithms(source), ["RSA"])

    def algorithms(self, source, filename="test.py"):
        return [f["algorithm"] for f in scan_source_for_crypto(source, filename)]

    def test_direct_function_alias(self):
        self.assertEqual(self.algorithms("from cryptography.hazmat.primitives.asymmetric.rsa import generate_private_key as gen\ngen(public_exponent=65537, key_size=2048)"), ["RSA"])

    def test_direct_class_aliases(self):
        for module, cls, algorithm in [("ed25519", "Ed25519", "Ed25519"), ("x448", "X448", "X448"), ("x25519", "X25519", "X25519"), ("ed448", "Ed448", "Ed448")]:
            with self.subTest(module=module):
                self.assertEqual(self.algorithms(f"from cryptography.hazmat.primitives.asymmetric.{module} import {cls}PrivateKey as K\nK.generate()"), [algorithm])

    def test_full_module_import(self):
        self.assertEqual(self.algorithms("import cryptography.hazmat.primitives.asymmetric.rsa\ncryptography.hazmat.primitives.asymmetric.rsa.generate_private_key()"), ["RSA"])

    def test_pycryptodome_ecc(self):
        self.assertEqual(self.algorithms("from Crypto.PublicKey import ECC\nECC.generate(curve='P-256')"), ["ECC"])

    def test_unrelated_import_is_not_crypto(self):
        self.assertEqual(self.algorithms("from my_business import rsa\nrsa.generate()"), [])

    def test_comment_cannot_create_identifier_finding(self):
        self.assertEqual(self.algorithms('algorithm = "HS256" # previously RS256'), [])
        self.assertEqual(self.algorithms('algorithm: HS256 # previously RS256', 'test.yaml'), [])

    def test_list_config_and_json(self):
        self.assertEqual(self.algorithms('jwt.decode(data, algorithms=["RS256", "ES256"])'), ["ECDSA", "RSA"])
        self.assertEqual(self.algorithms('{"algorithms": ["RS256", "ES256"]}', 'test.json'), ["ECDSA", "RSA"])

    def test_shadowing_and_reassignment(self):
        prefix = "from cryptography.hazmat.primitives.asymmetric import rsa\n"
        for body in ["rsa = helper\nrsa.generate_private_key()", "def f(rsa):\n    rsa.generate_private_key()", "def f():\n    rsa.generate_private_key()\n    rsa = helper", "[rsa.generate_private_key() for rsa in helpers]", "for rsa in helpers:\n    rsa.generate_private_key()", "f = lambda rsa: rsa.generate_private_key()"]:
            with self.subTest(body=body):
                self.assertEqual(self.algorithms(prefix + body), [])

    def test_function_imports_do_not_leak(self):
        source = "def f():\n    from cryptography.hazmat.primitives.asymmetric import rsa\n    rsa.generate_private_key()\nrsa.generate_private_key()"
        self.assertEqual(len(self.algorithms(source)), 1)

    def test_csharp_comments_and_literals(self):
        source = '// RSA.Create();\n/* ECDsa.Create(); */\nvar s = "RSA.Create()";\nvar key = RSA.Create();'
        self.assertEqual(self.algorithms(source, "Program.cs"), ["RSA"])

    def test_unknown_pem_is_diagnostic_only(self):
        findings, diagnostics = analyze_source("-----BEGIN PRIVATE KEY-----\nAAAA\n-----END PRIVATE KEY-----", "test.pem")
        self.assertEqual(findings, [])
        self.assertEqual(diagnostics[0]["code"], "unknown_pem_algorithm")

    def test_deep_source_does_not_crash(self):
        findings, diagnostics = analyze_source("x = " + "[" * 500 + "]" * 500)
        self.assertEqual(findings, [])
        self.assertEqual(diagnostics[0]["code"], "syntax_fallback")

    def test_same_name_files_count_independently(self):
        findings = [{"source_id": identity, "file_name": "same.py", "algorithm": "RSA", "risk_level": "高风险"} for identity in ("a", "b")]
        self.assertEqual(build_migration_score([], findings)["affected_files"], 2)
