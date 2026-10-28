"""Crypto behavior and adversarial proof tests; source is parsed, never run."""
from __future__ import annotations

import socket
import unittest
from unittest.mock import patch

from deep_analysis.crypto_rules import RULES
from deep_analysis.evidence import path_identity, edge_identity
from deep_analysis.models import Budgets, Known, Unknown, DeepAnalysisResult
from deep_analysis.pipeline import analyze_crypto, revalidate
from deep_analysis.verifier import Verifier
from tests.deep_static.helpers import snapshot


def run(text, **kwargs):
    return analyze_crypto(snapshot({'app.py': text}), **kwargs)


def claim(operation, name='ALGORITHM'):
    return next(c for c in operation.claims if c.claim_type == name)


class CryptoRulesTests(unittest.TestCase):
    def test_ecdsa_default_curve_cross_file_sign_verify_and_unknown_custom_curve(self):
        result = analyze_crypto(snapshot({
            'keys.py': 'from ecdsa import SigningKey\ndef make_key():\n return SigningKey.generate()\n',
            'app.py': 'from keys import make_key\nk=make_key()\ns=k.sign(data)\nv=k.get_verifying_key()\nv.verify(s,data)\n',
        }))
        for purpose in ('key_generation', 'sign', 'verify'):
            rows = [o for o in result.operations if o.operation_type == purpose]
            self.assertTrue(rows, purpose)
            self.assertTrue(all(o.algorithm == Known(value='ECDSA') and claim(o).level == 'E3' for o in rows))
            self.assertTrue(all(o.library == 'ecdsa' for o in rows))
        for curve in ('ecdsa.Ed25519', 'runtime_curve'):
            text = f'import ecdsa\nk=ecdsa.SigningKey.generate(curve={curve})\nk.sign(data)\n'
            self.assertFalse(any(o.algorithm == Known(value='ECDSA') for o in run(text).operations))
            from scanner.engine import analyze_source
            self.assertEqual(analyze_source(text)[0], [])

    def test_rsa_encrypt_decrypt_and_ec_exchange_preserve_receiver_roles(self):
        result = run('from cryptography.hazmat.primitives.asymmetric import rsa,ec\n'
                     'k=rsa.generate_private_key(65537,2048)\np=k.public_key()\n'
                     'p.encrypt(data,padding)\nk.decrypt(data,padding)\n'
                     'k.encrypt(data,padding)\np.decrypt(data,padding)\n'
                     'e=ec.generate_private_key(curve)\ne.exchange(protocol,peer)\n')
        for purpose in ('encrypt', 'decrypt', 'key_exchange'):
            rows = [o for o in result.operations if o.operation_type == purpose]
            self.assertEqual(len(rows), 1, purpose)
            self.assertEqual(claim(rows[0]).level, 'E3')
        self.assertFalse(any(o.sink_location.start_line in (6, 7) for o in result.operations))

    def test_shared_api_algorithm_identity_and_rule_version(self):
        from scanner.api_catalog import api_algorithm, RULES_VERSION
        for api, rule in RULES.items():
            if api_algorithm(api):
                self.assertEqual(rule.algorithm, api_algorithm(api))
        from scanner.engine import analyze_source
        finding = analyze_source('import ecdsa\necdsa.SigningKey.generate()', include_metadata=True)[0][0]
        self.assertEqual(finding['rule_version'], RULES_VERSION)

    def test_every_declared_non_jwt_api_has_an_individual_case(self):
        for api, rule in RULES.items():
            if rule.library == 'PyJWT':
                continue
            with self.subTest(api=api):
                arguments = ', '.join(f'{n}=value' for n in rule.parameters)
                text = f'import {api.split(".")[0]}\nx={api}({arguments})\n'
                result = run(text)
                if api.startswith('Crypto.Signature.'):
                    self.assertEqual(result.operations, ())
                else:
                    self.assertEqual(len(result.operations), 1)
                    self.assertEqual(result.operations[0].operation_type, rule.operation)
                    self.assertEqual(result.operations[0].algorithm, Known(value=rule.algorithm) if rule.algorithm else Unknown(reason='generic_key_type'))

    def test_jwt_rsa_and_hmac_have_independent_risk_and_key_claims(self):
        result = run('import jwt\na=jwt.encode({}, runtime_key, algorithm="RS256")\nb=jwt.encode({}, runtime_key, algorithm="HS256")\n')
        a, b = result.operations
        self.assertEqual((a.algorithm_family, b.algorithm_family), ('RSA', 'HMAC-SHA256'))
        self.assertEqual((a.risk_category, b.risk_category), ('quantum_vulnerable', 'symmetric'))
        self.assertEqual((claim(a).level, claim(b).level), ('E3', 'E3'))
        self.assertNotEqual(claim(a, 'KEY_SOURCE').level, 'E3')

    def test_jwt_no_algorithm_unknown_and_untrusted_alg_strings_are_redacted(self):
        for argument, reason in (('', 'unspecified_algorithm'), (', algorithm=runtime', 'unbound_name'), (', algorithm="private-secret-value"', 'unsupported_algorithm')):
            result = run('import jwt\na=jwt.encode({}, key' + argument + ')\n')
            self.assertEqual(result.operations[0].algorithm.reason, reason)
            self.assertNotIn('private-secret-value', result.model_dump_json())

    def test_decode_single_multiple_and_verification_disabled(self):
        result = run('import jwt\na=jwt.decode(token,key,algorithms=["RS256"])\nb=jwt.decode(token,key,algorithms=["RS256","HS256"])\nc=jwt.decode(token,options={"verify_signature":False})\n')
        self.assertEqual(result.operations[0].algorithm, Known(value='RS256'))
        self.assertEqual(result.operations[1].algorithm.kind, 'ambiguous')
        self.assertNotEqual(claim(result.operations[1]).level, 'E3')
        self.assertEqual(result.operations[2].operation_type, 'unknown')
        self.assertEqual(result.operations[2].algorithm.reason, 'verification_disabled')

    def test_pyjwt2_headers_override_and_verify_legacy_parameter(self):
        result = run('import jwt\na=jwt.encode({},key,algorithm="RS256",headers={"alg":"HS256"})\nb=jwt.decode(token,key,algorithms=["RS256"],verify=False)\nc=jwt.decode(token,key,algorithms=["RS256"],options=runtime)\n')
        self.assertEqual(result.operations[0].algorithm, Known(value='HS256'))
        self.assertEqual(result.operations[1].operation_type, 'verify')
        self.assertEqual(result.operations[2].operation_type, 'unknown')

    def test_pyca_two_receivers_generic_loader_and_fake_string(self):
        result = run('from cryptography.hazmat.primitives.asymmetric import rsa\nfrom cryptography.hazmat.primitives.serialization import load_pem_private_key\nk=rsa.generate_private_key(65537,2048)\na=k.sign(data,padding,hash_algorithm)\nb=other.sign(data,padding,hash_algorithm)\ng=load_pem_private_key(blob,password=None)\nc=g.sign(data)\nfake="RSA:private"\nd=fake.sign(data)\n')
        self.assertEqual([o.operation_type for o in result.operations], ['key_generation', 'sign', 'key_import'])
        self.assertEqual(result.operations[1].algorithm, Known(value='RSA'))
        self.assertEqual(claim(result.operations[1]).level, 'E3')
        self.assertEqual(result.operations[2].algorithm.reason, 'generic_key_type')
        self.assertEqual(sum(d.code == 'unproven_receiver' for d in result.diagnostics), 3)

    def test_pyca_ec_ed25519_x25519_public_keys_and_wrong_receiver_roles(self):
        for module, constructor, algorithm, args in (
            ('ec', 'ec.generate_private_key(curve)', 'EC', 'data,signature_algorithm'),
            ('ed25519', 'ed25519.Ed25519PrivateKey.generate()', 'Ed25519', 'data'),
        ):
            result = run(f'from cryptography.hazmat.primitives.asymmetric import {module}\nk={constructor}\ns=k.sign({args})\np=k.public_key()\nv=p.verify(signature,{args})\nbad=p.sign({args})\n')
            self.assertEqual([o.operation_type for o in result.operations], ['key_generation', 'sign', 'verify'])
            self.assertTrue(all(o.algorithm == Known(value=algorithm) for o in result.operations))
        result = run('from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey\nk=X25519PrivateKey.generate()\ns=k.exchange(peer)\n')
        self.assertEqual([o.operation_type for o in result.operations], ['key_generation', 'key_exchange'])

    def test_pycrypto_generation_import_signer_and_unsupported_methods(self):
        for family, scheme, extra in (('RSA', 'pkcs1_15', ''), ('RSA', 'pss', ''), ('DSA', 'DSS', ', "fips-186-3"'), ('ECC', 'DSS', ', "deterministic-rfc6979"')):
            gen = 'curve="P-256"' if family == 'ECC' else '2048'
            result = run(f'from Crypto.PublicKey import {family}\nfrom Crypto.Signature import {scheme}\nk={family}.generate({gen})\nsigner={scheme}.new(k{extra})\na=signer.sign(digest)\nb=signer.verify(digest,signature)\nbad=k.sign(digest)\n')
            self.assertEqual([o.operation_type for o in result.operations], ['key_generation', 'sign', 'verify'])
            self.assertTrue(all(o.algorithm == Known(value=family) for o in result.operations))
            self.assertTrue(all(claim(o).level == 'E3' for o in result.operations))

    def test_import_only_shadowing_local_library_and_getattr_do_not_make_operations(self):
        for text in ('from Crypto.PublicKey import RSA\n', 'import jwt\ndef f(jwt):\n return jwt.encode({},key,algorithm="RS256")\n', 'import jwt\nf=getattr(jwt,name)\nf({},key,algorithm="RS256")\n'):
            self.assertEqual(run(text).operations, ())
        result = analyze_crypto(snapshot({'jwt.py': 'def encode(*a,**k): pass\n', 'app.py': 'import jwt\nx=jwt.encode({},key,algorithm="RS256")\n'}))
        self.assertEqual(result.operations, ())

    def test_equal_distinct_unknown_branches_returns_and_recursion_are_conservative(self):
        for right, kind, level in (('\"RS256\"', 'known', 'E3'), ('\"HS256\"', 'ambiguous', 'E2'), ('external', 'unknown', 'E2')):
            result = run('import jwt\nif condition:\n algorithm=\"RS256\"\nelse:\n algorithm=' + right + '\nx=jwt.encode({},key,algorithm=algorithm)\n')
            self.assertEqual(result.operations[0].algorithm.kind, kind)
            self.assertEqual(claim(result.operations[0]).level, level)
        for body in ('pass', 'return choose()', 'return value.lower()'):
            result = run('import jwt\ndef choose(value=\"RS256\"):\n ' + body + '\nx=jwt.encode({},key,algorithm=choose())\n')
            self.assertEqual(result.operations[0].algorithm.kind, 'unknown')
            self.assertNotEqual(claim(result.operations[0]).level, 'E3')

    def test_cross_file_typed_key_return_and_consumer_proofs(self):
        result = analyze_crypto(snapshot({'keys.py': 'from cryptography.hazmat.primitives.asymmetric import rsa\ndef make():\n return rsa.generate_private_key(65537,2048)\n',
                                           'app.py': 'from keys import make\nk=make()\ns=k.sign(data,padding,algorithm)\n'}))
        self.assertEqual([o.operation_type for o in result.operations], ['sign', 'key_generation'])
        self.assertTrue(all(o.algorithm == Known(value='RSA') and claim(o).level == 'E3' for o in result.operations))

    def test_bad_method_signature_cannot_inherit_receiver_algorithm(self):
        result = run('from cryptography.hazmat.primitives.asymmetric import rsa\nk=rsa.generate_private_key(65537,2048)\ns=k.sign(data)\n')
        self.assertEqual([o.operation_type for o in result.operations], ['key_generation'])

    def test_use_before_import_and_lexical_conditions_cannot_be_E3_by_omission(self):
        result = run('x=jwt.encode({},key,algorithm=\"RS256\")\nimport jwt\n')
        self.assertNotEqual(claim(result.operations[0]).level, 'E3')
        conditional = run('import jwt\nif enabled:\n x=jwt.encode({},key,algorithm=\"RS256\")\n')
        self.assertEqual(claim(conditional.operations[0]).level, 'E3')
        self.assertEqual(len(conditional.operations[0].context.conditions), 1)


class IndependentEvidenceTests(unittest.TestCase):
    def setUp(self):
        self.source = snapshot({'wrap.py': 'import jwt\ndef issue(algorithm):\n return jwt.encode({},key,algorithm=algorithm)\n',
                                'app.py': 'from wrap import issue\na=issue("RS256")\nb=issue("HS256")\n'})
        self.result = analyze_crypto(self.source)
        self.operation = self.result.operations[0]
        self.claim = claim(self.operation)
        self.path = next(p for p in self.result.evidence_paths if p.evidence_id == self.claim.evidence_ids[0])
        self.verifier = Verifier(self.source, self.result.versions)

    def test_two_contexts_share_template_but_keep_values_and_edges(self):
        a, b = self.result.operations
        self.assertEqual(a.template_id, b.template_id)
        self.assertNotEqual(a.operation_id, b.operation_id)
        self.assertEqual((a.algorithm, b.algorithm), (Known(value='RS256'), Known(value='HS256')))
        self.assertTrue(all(claim(o).level == 'E3' for o in (a, b)))
        DeepAnalysisResult.model_validate_json(self.result.model_dump_json())

    def test_removing_each_required_edge_is_rejected_even_after_rehash(self):
        self.assertEqual(self.path.verification_status, 'valid')
        for edge in self.path.edges:
            path = self.path.model_copy(update={'edges': tuple(e for e in self.path.edges if e != edge)})
            path = path.model_copy(update={'evidence_id': path_identity(path)})
            checked = self.verifier.check(path, self.operation, self.claim)
            self.assertEqual(checked.verification_status, 'invalid', edge.edge_type)
            self.assertIn('missing_required_edge', checked.gaps)

    def test_wrong_digest_ast_span_quote_edge_condition_and_context_fail(self):
        cases = [
            self.path.model_copy(update={'nodes': (self.path.nodes[0].model_copy(update={'source_sha256': '0' * 64}), *self.path.nodes[1:])}),
            self.path.model_copy(update={'nodes': (self.path.nodes[0].model_copy(update={'expression': 'secret'}), *self.path.nodes[1:])}),
            self.path.model_copy(update={'context': self.result.operations[1].context}),
            self.path.model_copy(update={'edges': (self.path.edges[0].model_copy(update={'conditions': ('forged',)}), *self.path.edges[1:])}),
        ]
        for path in cases:
            self.assertEqual(self.verifier.check(path, self.operation, self.claim).verification_status, 'invalid')

    def test_other_calls_proof_cannot_be_spliced_even_with_new_identity(self):
        other = claim(self.result.operations[1])
        path = next(p for p in self.result.evidence_paths if p.evidence_id == other.evidence_ids[0])
        path = path.model_copy(update={'context': self.operation.context})
        path = path.model_copy(update={'evidence_id': path_identity(path)})
        checked = self.verifier.check(path, self.operation, self.claim)
        self.assertEqual(checked.verification_status, 'invalid')

    def test_verifier_never_calls_producer_and_catches_false_known_value(self):
        with patch('deep_analysis.engine.analyze', side_effect=AssertionError), patch('deep_analysis.dataflow.Evaluator.expression', side_effect=AssertionError):
            verifier = Verifier(self.source, self.result.versions)
            self.assertEqual(verifier.check(self.path, self.operation, self.claim).verification_status, 'valid')
            forged = self.claim.model_copy(update={'value': Known(value='HS256')})
            self.assertIn('claim_value_not_proven', verifier.check(self.path, self.operation, forged).gaps)

    def test_expiry_preserves_history_but_never_fakes_replay(self):
        expired = revalidate(self.result, None)
        self.assertTrue(all(p.replay_status == 'unavailable' for p in expired.evidence_paths))
        self.assertEqual(expired.operations, self.result.operations)
        self.assertTrue(all(p.verification_status == 'valid' for p in expired.evidence_paths if not p.gaps))
        changed = self.result.versions.model_copy(update={'rules': 'changed-rules'})
        invalid = revalidate(self.result, self.source, versions=changed)
        self.assertTrue(all(claim(o).level != 'E3' for o in invalid.operations))

    def test_no_secrets_full_source_host_path_network_import_or_execution(self):
        text = 'import jwt\npassword="SENSITIVE-PASSWORD-1234"\nsecret="SENSITIVE-KEY-9876"\na=jwt.encode({"private":"PRIVATE-PAYLOAD"},secret,algorithm="RS256")\n'
        with patch.object(socket, 'socket', side_effect=AssertionError('network')), patch('builtins.exec', side_effect=AssertionError('input execution')):
            # ast.parse uses compile(..., PyCF_ONLY_AST), never exec.
            result = run(text)
        output = result.model_dump_json()
        for secret in ('SENSITIVE-PASSWORD-1234', 'SENSITIVE-KEY-9876', 'PRIVATE-PAYLOAD', '/Users/mac', text):
            self.assertNotIn(secret, output)
        self.assertTrue(all(n.redacted for p in result.evidence_paths for n in p.nodes))

    def test_limits_and_cancellation_do_not_submit_half_proofs(self):
        result = run('import jwt\na=jwt.encode({},key,algorithm="RS256")\n', budgets=Budgets(slice_nodes=1))
        self.assertEqual(result.status, 'partial')
        self.assertEqual(result.evidence_paths, ())
        class Cancelled(Exception):
            pass
        def cancel():
            raise Cancelled()
        with self.assertRaises(Cancelled):
            run('import jwt\na=jwt.encode({},key,algorithm="RS256")\n', checkpoint=cancel)

    def test_key_type_and_return_edges_are_independently_required(self):
        source = snapshot({'app.py': 'from cryptography.hazmat.primitives.asymmetric import rsa\ndef make():\n return rsa.generate_private_key(65537,2048)\nk=make()\ns=k.sign(data,padding,algorithm)\n'})
        result = analyze_crypto(source)
        operation = next(o for o in result.operations if o.operation_type == 'sign')
        assertion = claim(operation)
        path = next(p for p in result.evidence_paths if p.evidence_id == assertion.evidence_ids[0])
        self.assertEqual(assertion.level, 'E3')
        verifier = Verifier(source, result.versions)
        for kind in ('KEY_TYPE_FLOW', 'RETURN_FLOW', 'ASSIGN_FLOW', 'IMPORT_BINDING'):
            modified = path.model_copy(update={'edges': tuple(e for e in path.edges if e.edge_type != kind)})
            modified = modified.model_copy(update={'evidence_id': path_identity(modified)})
            self.assertIn('missing_' + kind, verifier.check(modified, operation, assertion).gaps)

    def test_missing_literal_forged_conditions_and_api_do_not_pass_with_new_hashes(self):
        removed = self.path.model_copy(update={'nodes': tuple(n for n in self.path.nodes if n.expression != '<Constant>')})
        # Keep references valid by removing incident edges; then recompute identity.
        ids = {n.node_id for n in removed.nodes}
        removed = removed.model_copy(update={'edges': tuple(e for e in removed.edges if e.source_node in ids and e.target_node in ids)})
        removed = removed.model_copy(update={'evidence_id': path_identity(removed)})
        self.assertIn('missing_required_node', self.verifier.check(removed, self.operation, self.claim).gaps)
        forged_api = self.operation.model_copy(update={'api': 'jwt.hallucinated'})
        self.verifier.check(self.path, self.operation, self.claim)  # Prime cache first.
        self.assertIn('domain_mismatch', self.verifier.check(self.path, forged_api, self.claim).gaps)
        context = self.path.context.model_copy(update={'conditions': ('invented-condition',)})
        edges = tuple(e.model_copy(update={'conditions': context.conditions, 'edge_id': edge_identity(e.edge_type, e.source_node, e.target_node, context.conditions)}) for e in self.path.edges)
        path = self.path.model_copy(update={'context': context, 'edges': edges})
        path = path.model_copy(update={'evidence_id': path_identity(path)})
        operation = self.operation.model_copy(update={'context': context})
        self.assertIn('lexical_condition_mismatch', self.verifier.check(path, operation, self.claim).gaps)

    def test_changed_source_preserves_historical_verdict_and_downgrades_current_claims(self):
        changed = snapshot({'wrap.py': 'import jwt\ndef issue(algorithm):\n return jwt.encode({},key,algorithm=algorithm)\n',
                            'app.py': 'from wrap import issue\na=issue(\"HS256\")\nb=issue(\"HS256\")\n'})
        result = revalidate(self.result, changed)
        self.assertTrue(all(claim(o).level != 'E3' for o in result.operations))
        self.assertTrue(any(p.historical_verification_status == 'valid' and p.verification_status == 'invalid' for p in result.evidence_paths))
        self.assertEqual(result.snapshot, self.result.snapshot)
        DeepAnalysisResult.model_validate_json(result.model_dump_json())

    def test_utf8_byte_columns_and_wrong_source_location_are_checked(self):
        source = snapshot({'中文/入口.py': 'import jwt\n说明=\"测试\"; token=jwt.encode({},key,algorithm=\"HS256\")\n',
                           'app.py': 'import 中文.入口\n'})
        result = analyze_crypto(source)
        operation = result.operations[0]
        assertion = claim(operation)
        self.assertEqual(assertion.level, 'E3')
        self.assertEqual(operation.sink_location.start_col, len('说明=\"测试\"; token='.encode('utf-8')))
        path = next(p for p in result.evidence_paths if p.evidence_id == assertion.evidence_ids[0])
        node = path.nodes[-1]
        bad_span = node.location.model_copy(update={'start_col': node.location.start_col + 1})
        bad = path.model_copy(update={'nodes': (*path.nodes[:-1], node.model_copy(update={'location': bad_span}))})
        bad = bad.model_copy(update={'evidence_id': path_identity(bad)})
        self.assertEqual(Verifier(source, result.versions).check(bad, operation, assertion).verification_status, 'invalid')
