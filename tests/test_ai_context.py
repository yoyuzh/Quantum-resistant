from __future__ import annotations

import unittest

from backend.ai.candidates import independent_positions
from backend.ai.config import LIMITS
from backend.ai.context import build_context, redact
from backend.ai.models import Candidate, EvidenceLine
from pydantic import ValidationError


class AiContextTests(unittest.TestCase):
    def build(self, texts, findings=(), **limits):
        sources = [{"source_id": key, "file_name": name, "content_available": True}
                   for key, (name, _) in texts.items()]
        return build_context({"sources": sources, "findings": list(findings)}, lambda key: texts[key][1],
                             {**LIMITS, **limits}, lambda: None)

    def test_reassignment_and_branch_confidence_boundaries(self):
        text = """
from cryptography import rsa
def sample(key, payload, flag):
    value = key.sign(payload)
    value = key.decrypt(payload)
    if flag:
        return key.sign(payload)
    return key.decrypt(payload)
"""
        candidates, coverage = self.build({"a": ("a.py", text)})
        by_line = {item.start_line: item.semantic_evidence for item in candidates}
        self.assertTrue(any(item.confidence == "possible" and item.reassigned for item in by_line.values()))
        self.assertTrue(any(item.confidence == "unknown" and item.branch_sensitive for item in by_line.values()))
        self.assertTrue(all(item.member_locations for item in candidates))
        self.assertGreaterEqual(coverage.discovered_candidates, coverage.aggregated_candidates)

    def test_zero_static_unknown_calls_wrappers_math_negative(self):
        text = "from unknown_crypto import build\ndef encrypt_message(data):\n    return service.encrypt(data)\npow(a, b, c)\nvalue = 'RSA'\n# encrypt(data)"
        candidates, coverage = self.build({"one": ("a.py", text)})
        self.assertTrue(candidates)
        self.assertTrue(all(item.origins == ["independent"] for item in candidates))
        self.assertNotIn(4, [item.start_line for item in candidates])
        self.assertNotIn(5, [item.start_line for item in candidates])
        self.assertEqual(coverage.searched_files, 1)
        self.assertEqual(independent_positions("pow(x,y,z)", "math.py", lambda: None), ([], []))
        self.assertTrue(independent_positions("pow(message, private_key, modulus)", "a.py", lambda: None)[0])

    def test_structured_config_and_parse_failure(self):
        for name, text in (("a.json", '{"algorithm": "custom-kem"}'), ("a.yaml", "algorithm: custom-kem\n# alg: RSA")):
            self.assertEqual(len(self.build({"one": (name, text)})[0]), 1)
        for name, text in (("a.py", "encrypt("), ("a.json", "alg: rsa"), ("a.yml", "x: &a {alg: rsa}\ny: *a")):
            candidates, coverage = self.build({"one": (name, text)})
            self.assertFalse(candidates)
            self.assertIn("parse_failed", coverage.skip_reasons)

    def test_round_robin_and_merge_static_fingerprint(self):
        text = "rsa()\nrsa()\nrsa()"
        findings = [{"source_id": "a", "line": i, "algorithm": "RSA"} for i in (1, 2, 3)]
        candidates, _ = self.build({"a": ("a.py", text), "b": ("b.py", "encrypt()")}, findings,
                                   preview_candidates=2)
        self.assertEqual(candidates[0].origins, ["independent", "static"])
        self.assertEqual(len(candidates[0].static_finding_refs), 1)
        # 两路交替，重合位置合并，不占两个名额。
        self.assertEqual(len(candidates), 2)

    def test_same_name_stable_order_and_ids(self):
        texts = {"b": ("same.py", "encrypt(b)"), "a": ("same.py", "encrypt(a)")}
        one, _ = self.build(texts)
        two, _ = self.build(dict(reversed(list(texts.items()))))
        self.assertEqual(one, two)
        self.assertEqual([item.source_id for item in one], ["a", "b"])
        self.assertNotEqual(one[0].candidate_id, one[1].candidate_id)

    def test_bounded_search_preview_and_long_line(self):
        texts = {str(i).zfill(3): ("a.py", "encrypt()") for i in range(201)}
        candidates, coverage = self.build(texts)
        self.assertEqual(coverage.searched_files, 200)
        self.assertEqual(coverage.selected_files, 20)
        self.assertEqual(coverage.skip_reasons["search_file_limit"], 1)
        self.assertEqual(coverage.skip_reasons["preview_file_limit"], 180)
        candidates, coverage = self.build({"a": ("a.py", "encrypt()\n" * 45)})
        self.assertEqual(len(candidates), 1)
        self.assertEqual(coverage.discovered_candidates, 45)
        self.assertEqual(coverage.aggregated_candidates, 1)
        self.assertEqual(len(candidates[0].member_locations), 45)
        self.assertLessEqual(coverage.context_bytes, 128 * 1024)
        candidates, coverage = self.build({"a": ("a.py", "encrypt('" + "x" * 9000 + "')")})
        self.assertFalse(candidates)
        self.assertEqual(coverage.skip_reasons["line_too_large"], 1)
        _, coverage = self.build({"a": ("a.py", "encrypt()")}, search_bytes=1)
        self.assertEqual(coverage.searched_bytes, 0)
        self.assertEqual(coverage.skip_reasons["search_byte_limit"], 1)
        _, coverage = self.build({"a": ("a.py", "encrypt()")}, context_bytes=1)
        self.assertEqual(coverage.selected_candidates, 0)
        self.assertEqual(coverage.skip_reasons["context_byte_limit"], 1)

    def test_redaction_and_original_line_mapping(self):
        text = '\n'.join(['import crypto', 'password = "SENSITIVE_PASSWORD"', 'token = "sk-abcdefgh123456"',
                          'key = "-----BEGIN RSA PRIVATE KEY-----', 'SENSITIVE_BODY',
                          '-----END RSA PRIVATE KEY-----"', 'encrypt(key)'])
        redacted = redact(text)
        self.assertEqual(len(redacted), 7)
        self.assertNotIn("SENSITIVE", "\n".join(redacted))
        self.assertNotIn("sk-abcdefgh", "\n".join(redacted))
        candidates, _ = self.build({"a": ("a.py", text)})
        # 无效 Python 不作语义猜测；静态复核仍可构建脱敏片段。
        candidates, _ = self.build({"a": ("a.py", text)}, [{"source_id": "a", "line": 7, "algorithm": "unknown"}])
        lines = {line.line: line.text for line in candidates[0].lines}
        self.assertEqual(lines[7], "encrypt(key)")
        self.assertNotIn("SENSITIVE", str(lines))

    def test_candidate_rejects_bad_ranges_and_context_bytes(self):
        base = dict(candidate_id="a" * 64, source_id="one", file_name="a.py", start_line=2,
                    end_line=2, origins=["independent"], rules=["call"], input_digest="b" * 64)
        for lines in ([EvidenceLine(line=2, text="x"), EvidenceLine(line=1, text="y")],
                      [EvidenceLine(line=2, text="中" * 3000)]):
            with self.assertRaises(ValidationError):
                Candidate(**base, lines=lines)


    def test_multiline_secret_blocks_and_pem_public_body_are_masked(self):
        yaml = 'password: |\n  PRIVATE_BLOCK\nalgorithm: rsa\n'
        output = redact(yaml)
        self.assertNotIn("PRIVATE_BLOCK", str(output))
        self.assertEqual(output[2], "algorithm: rsa")
        python = 'secret = """\nSENSITIVE_BLOCK\n"""\nencrypt(data)'
        self.assertNotIn("SENSITIVE_BLOCK", str(redact(python)))
        pem = "-----BEGIN PUBLIC KEY-----\nPUBLIC_BODY\n-----END PUBLIC KEY-----"
        self.assertNotIn("PUBLIC_BODY", str(redact(pem)))


if __name__ == "__main__":
    unittest.main()
