from __future__ import annotations

import json
import subprocess
import sys
import unittest

from scanner.engine import analyze_source


PREFIX = 'from cryptography.hazmat.primitives.asymmetric import rsa\n'


class ScannerRepairTests(unittest.TestCase):
    def algorithms(self, source, filename='test.py'):
        return [item['algorithm'] for item in analyze_source(source, filename)[0]]

    def test_late_module_import_and_known_call_order(self):
        function = 'def make_key():\n    return rsa.generate_private_key()\n'
        self.assertEqual(self.algorithms(function + PREFIX + 'make_key()'), ['RSA'])
        self.assertEqual(self.algorithms(function + 'make_key()\n' + PREFIX), [])
        self.assertEqual(self.algorithms('rsa.generate_private_key()\n' + PREFIX), [])

    def test_constant_branch_and_branch_conflict(self):
        self.assertEqual(self.algorithms(PREFIX + 'if False:\n    rsa = None\nrsa.generate_private_key()'), ['RSA'])
        source = PREFIX + 'if flag:\n    rsa = None\nrsa.generate_private_key()'
        findings, notes = analyze_source(source)
        self.assertEqual(findings, [])
        self.assertIn('binding_unresolved', [item['code'] for item in notes])

    def test_global_and_nonlocal_do_not_create_lexical_locals(self):
        self.assertEqual(self.algorithms(PREFIX + 'def f():\n    global rsa\n    rsa.generate_private_key()\n    rsa = None'), ['RSA'])
        self.assertEqual(self.algorithms('def outer():\n    ' + PREFIX + '    def inner():\n        nonlocal rsa\n        rsa.generate_private_key()\n        rsa = None'), ['RSA'])
        self.assertEqual(self.algorithms(PREFIX + 'def f():\n    global rsa\n    rsa = None\n    rsa.generate_private_key()'), [])

    def test_binding_snapshots_and_parameter_conflicts(self):
        source = PREFIX + 'def f():\n    global rsa\n    rsa.generate_private_key()\nf()\nrsa = business'
        self.assertEqual(self.algorithms(source), ['RSA'])
        source = PREFIX + 'if flag:\n    rsa = None\ndef f(rsa):\n    rsa.generate_private_key()'
        self.assertEqual(analyze_source(source), ([], []))
        source = PREFIX + 'if flag:\n    rsa = None\n' + PREFIX + 'rsa.generate_private_key()'
        findings, notes = analyze_source(source)
        self.assertEqual([item['algorithm'] for item in findings], ['RSA'])
        self.assertEqual(notes, [])

    def test_key_import_apis_and_aliases(self):
        for module, algorithm in [('RSA', 'RSA'), ('DSA', 'DSA'), ('ECC', 'ECC')]:
            for method in (['import_key', 'importKey', 'construct'] if module in {'RSA', 'DSA'} else ['import_key', 'construct']):
                with self.subTest(module=module, method=method):
                    self.assertEqual(self.algorithms(f'from Crypto.PublicKey import {module} as K\nK.{method}(data)'), [algorithm])
        for curve, cls, algorithm in [('ed25519', 'Ed25519', 'Ed25519'), ('ed448', 'Ed448', 'Ed448'), ('x25519', 'X25519', 'X25519'), ('x448', 'X448', 'X448')]:
            for kind, method in [('Private', 'from_private_bytes'), ('Public', 'from_public_bytes')]:
                with self.subTest(curve=curve, kind=kind):
                    source = f'from cryptography.hazmat.primitives.asymmetric.{curve} import {cls}{kind}Key as K\nK.{method}(data)'
                    self.assertEqual(self.algorithms(source), [algorithm])
        self.assertEqual(self.algorithms('from Crypto.PublicKey.RSA import import_key as load\nload(data)'), ['RSA'])
        for module, algorithm, classes in [('rsa', 'RSA', ['RSAPrivateNumbers', 'RSAPublicNumbers']), ('dsa', 'DSA', ['DSAPrivateNumbers', 'DSAPublicNumbers']), ('dh', 'DH', ['DHPrivateNumbers', 'DHPublicNumbers']), ('ec', 'ECC', ['EllipticCurvePrivateNumbers', 'EllipticCurvePublicNumbers'])]:
            for cls in classes:
                with self.subTest(cls=cls):
                    self.assertEqual(self.algorithms(f'from cryptography.hazmat.primitives.asymmetric.{module} import {cls} as N\nN(data)'), [algorithm])
        for api in ['derive_private_key', 'EllipticCurvePublicKey.from_encoded_point']:
            with self.subTest(api=api):
                self.assertEqual(self.algorithms(f'from cryptography.hazmat.primitives.asymmetric import ec as E\nE.{api}(data, curve)'), ['ECC'])

    def test_unknown_imports_and_keys_are_not_guessed(self):
        for source in ['from business import RSA\nRSA.import_key(data)', 'from Crypto.PublicKey import RSA\nRSA = other\nRSA.import_key(data)', 'from cryptography.hazmat.primitives.serialization import load_pem_private_key\nkey=load_pem_private_key(data,None)\nkey.sign(data)', 'key.sign(data)', 'from Crypto.PublicKey import ECC\nECC.importKey(data)', 'from business import Ed25519PrivateKey\nEd25519PrivateKey.from_private_bytes(data)']:
            with self.subTest(source=source):
                self.assertEqual(self.algorithms(source), [])

    def test_template_literals_and_interpolations(self):
        for source in ['const note = `RSA.generate(2048)`;', 'const note = `escaped \\` RSA.generate()\n still text`;', 'const note = `unterminated RSA.generate()', 'const note = `x ${"RSA.generate()"} y`;', 'const note = `x ${`RSA.generate()`} y`;']:
            with self.subTest(source=source):
                self.assertEqual(self.algorithms(source, 'test.ts'), [])
        source = 'const note = `text\n${RSA.generate(2048)}\n${`nested ${DSA.generate()}`}`;'
        findings, _ = analyze_source(source, 'test.js')
        self.assertEqual([(item['line'], item['algorithm']) for item in findings], [(2, 'RSA'), (3, 'DSA')])

    def test_pem_comments_and_documentation(self):
        header = '-----BEGIN RSA PRIVATE KEY-----'
        for filename, source in [('test.py', '# documentation: ' + header), ('test.js', '// ' + header), ('test.ts', '/*\n' + header + '\n*/'), ('test.py', 'note = "documentation: ' + header + '"'), ('test.py', '"""' + header + '\nAAAA\n-----END RSA PRIVATE KEY-----\n"""')]:
            with self.subTest(filename=filename, source=source):
                self.assertEqual(self.algorithms(source, filename), [])
        self.assertEqual(self.algorithms(header, 'key.pem'), ['RSA'])
        self.assertEqual(self.algorithms('key = """' + header + '\nAAAA\n-----END RSA PRIVATE KEY-----\n"""'), ['RSA'])
        self.assertEqual(analyze_source('# -----BEGIN PRIVATE KEY-----')[1], [])

    def test_eddsa_is_a_family(self):
        self.assertEqual(self.algorithms('jwt_algorithm = "EdDSA"'), ['EdDSA'])
        self.assertEqual(self.algorithms('algorithms = ["Ed25519", "Ed448"]'), ['Ed25519', 'Ed448'])

    def test_structured_lists_and_locations(self):
        for filename, source, expected in [
            ('test.yaml', 'security:\n  algorithms:\n    - RS256\n    - ES256\nnotes: RS256\n', [(3, 'RSA'), (4, 'ECDSA')]),
            ('test.json', '{"enabled":true,\n"algorithms": [\n"RS256",\n"ES256"]}', [(3, 'RSA'), (4, 'ECDSA')]),
            ('test.yaml', 'algorithms: [RS256, ES256] # EdDSA\n', [(1, 'ECDSA'), (1, 'RSA')]),
        ]:
            with self.subTest(filename=filename):
                findings, notes = analyze_source(source, filename)
                self.assertEqual([(item['line'], item['algorithm']) for item in findings], expected)
                self.assertEqual(notes, [])
        self.assertEqual(self.algorithms('notes:\n - RS256\n # algorithms: ES256', 'test.yaml'), [])

    def test_structured_limits_and_invalid_documents_are_visible(self):
        for source in ['algorithms: [RS256', 'algorithms: &a [*a]', 'algorithms: !!python/object/apply:os.system [bad]', 'algorithms: ' + '[' * 80 + 'RS256' + ']' * 80]:
            with self.subTest(source=source):
                findings, notes = analyze_source(source, 'test.yaml')
                self.assertEqual(findings, [])
                self.assertTrue(notes)

    def test_ast_and_config_resource_boundaries(self):
        for source, filename in [('x = ' + '[' * 65 + '0' + ']' * 65, 'x.py'),
                                 ('algorithms: [' + ','.join('RS256' for _ in range(50001)) + ']', 'x.yaml'),
                                 ('x' * (2 * 1024 * 1024 + 1), 'x.txt')]:
            with self.subTest(filename=filename):
                findings, notes = analyze_source(source, filename)
                self.assertEqual(findings, [])
                self.assertIn('analysis_limit', [note['code'] for note in notes])

    def test_config_prose_and_pem_are_not_double_counted(self):
        self.assertEqual(self.algorithms('algorithms: "Documentation mentions RS256"', 'x.yaml'), [])
        material = '-----BEGIN DSA PRIVATE KEY-----\nAAAA\n-----END DSA PRIVATE KEY-----'
        for filename, source, expected_line in [
            ('x.py', 'private_key = """\n' + material + '\n"""', 2),
            ('x.yaml', 'private_key: |\n  ' + material.replace('\n', '\n  '), 2),
            ('x.js', 'const key = `' + material + '`;', 1),
        ]:
            with self.subTest(filename=filename):
                findings, notes = analyze_source(source, filename)
                self.assertEqual([(item['line'], item['algorithm']) for item in findings], [(expected_line, 'DSA')])
                self.assertEqual(notes, [])

    def test_fallback_export_and_unicode_boundary(self):
        from scan_quantum_vuln import scan_with_regex
        self.assertEqual([item.algorithm for item in scan_with_regex('-----BEGIN RSA PRIVATE KEY-----')], ['RSA'])
        self.assertEqual(analyze_source('\r\x80')[0], [])

    def test_eddsa_report_and_knowledge_purpose(self):
        from backend.analysis import migration_direction
        from backend.knowledge import knowledge_graph
        from backend.scanning import build_scan_response
        from backend.report_exports import build_json_report, build_csv_report
        findings, notes = analyze_source('jwt_algorithm="EdDSA"')
        self.assertEqual(migration_direction('EdDSA')['purpose'], '数字签名')
        self.assertIn('algorithm:EdDSA', [node['id'] for node in knowledge_graph()['nodes']])
        response = build_scan_response([('x.py', 'jwt_algorithm="EdDSA"')], 'snippet')
        data = response.model_dump()
        report = json.dumps(build_json_report(data['sources'], data['findings'], 'snippet'), ensure_ascii=False)
        self.assertIn('EdDSA', report)
        self.assertIn('数字签名', report)
        self.assertIn('EdDSA', build_csv_report(data['findings']))
        self.assertNotIn('Ed25519', [item['algorithm'] for item in findings])

    def test_dotted_chain_performance_in_external_process(self):
        probe = '''import json,time
from scanner.engine import analyze_source
rows=[]
for n in (8000,16000,32000,64000):
    start=time.perf_counter()
    assert analyze_source('a.'*n+'a', 'probe.txt')[0] == []
    rows.append(time.perf_counter()-start)
print(json.dumps(rows))
'''
        result = subprocess.run([sys.executable, '-B', '-c', probe], capture_output=True, text=True, timeout=8, check=True)
        times = json.loads(result.stdout)
        self.assertLess(max(times), 2)
        self.assertLess(times[-1], times[0] * 14 + .1)


if __name__ == '__main__':
    unittest.main()
