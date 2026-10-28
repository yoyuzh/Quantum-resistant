"""24 additional multi-file cases, plus the unchanged 36-case frozen corpus."""
from __future__ import annotations

import unittest

from deep_analysis.pipeline import analyze_crypto
from deep_analysis.snapshot import package_roots
from tests.deep_static.helpers import snapshot
from tests.deep_static.corpus import load_catalog, anchor_span

ENCODE = 'import jwt\n'
WRAP = 'import jwt\ndef issue(alg): return jwt.encode({},key,algorithm=alg)\n'
CASES = [
 ('module_constant', {'settings.py': 'ALG="RS256"', 'main.py': ENCODE+'from settings import ALG\njwt.encode({},key,algorithm=ALG)'}, 'RS256'),
 ('keyword_call', {'wrap.py': WRAP, 'main.py': 'from wrap import issue\nissue(alg="RS256")'}, 'RS256'),
 ('positional_only', {'wrap.py': WRAP.replace('(alg)', '(alg,/)'), 'main.py': 'from wrap import issue\nissue("RS256")'}, 'RS256'),
 ('keyword_only', {'wrap.py': WRAP.replace('(alg)', '(*,alg)'), 'main.py': 'from wrap import issue\nissue(alg="RS256")'}, 'RS256'),
 ('default_argument', {'wrap.py': WRAP.replace('(alg)', '(alg="RS256")'), 'main.py': 'from wrap import issue\nissue()'}, 'RS256'),
 ('transparent_return', {'settings.py': 'def algorithm(): return "RS256"', 'main.py': ENCODE+'from settings import algorithm\njwt.encode({},key,algorithm=algorithm())'}, 'RS256'),
 ('aliased_module', {'settings.py': 'ALG="RS256"', 'main.py': ENCODE+'import settings as s\njwt.encode({},key,algorithm=s.ALG)'}, 'RS256'),
 ('same_branch_value', {'settings.py': 'ALG="RS256" if flag else "RS256"', 'main.py': ENCODE+'from settings import ALG\njwt.encode({},key,algorithm=ALG)'}, 'RS256'),
 ('different_branch_values', {'settings.py': 'ALG="RS256" if flag else "HS256"', 'main.py': ENCODE+'from settings import ALG\njwt.encode({},key,algorithm=ALG)'}, None),
 ('headers_override', {'wrap.py': 'import jwt\ndef issue(alg): return jwt.encode({},key,algorithm=alg,headers={"alg":"HS256"})', 'main.py': 'from wrap import issue\nissue("RS256")'}, 'HS256'),
 ('verification_disabled', {'wrap.py': 'import jwt\ndef read(): return jwt.decode(token,key,algorithms=["RS256"],options={"verify_signature":False})', 'main.py': 'from wrap import read\nread()'}, None),
 ('sequential_assignment', {'settings.py': 'ALG="RS256"\nALG="HS256"', 'main.py': ENCODE+'from settings import ALG\njwt.encode({},key,algorithm=ALG)'}, 'HS256'),
 ('runtime_environment', {'settings.py': 'import os\nALG=os.getenv("ALGORITHM")', 'main.py': ENCODE+'from settings import ALG\njwt.encode({},key,algorithm=ALG)'}, None),
 ('recursive_value', {'settings.py': 'def algorithm(): return algorithm()', 'main.py': ENCODE+'from settings import algorithm\njwt.encode({},key,algorithm=algorithm())'}, None),
 ('missing_module', {'marker.py': 'x=1', 'main.py': ENCODE+'from absent import ALG\njwt.encode({},key,algorithm=ALG)'}, None),
 ('uninstantiated', {'wrap.py': WRAP, 'main.py': 'x=1'}, None),
 ('shadowed_library', {'helpers.py': 'x=1', 'main.py': 'from Crypto.PublicKey import RSA\nRSA=business\nRSA.generate(2048)'}, None),
 ('local_library_collision', {'jwt.py': 'def encode(*a,**kw): return 1', 'main.py': ENCODE+'jwt.encode({},key,algorithm="RS256")'}, None),
 ('rsa_returned_key', {'keys.py': 'from cryptography.hazmat.primitives.asymmetric import rsa\ndef make(): return rsa.generate_private_key(65537,2048)', 'main.py': 'from keys import make\nk=make()\nk.sign(data,pad,hash_algorithm)'}, 'RSA'),
 ('ed25519_import', {'keys.py': 'from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey\ndef make(): return Ed25519PrivateKey.from_private_bytes(data)', 'main.py': 'from keys import make\nk=make()\nk.sign(data)'}, 'Ed25519'),
 ('x25519_exchange', {'keys.py': 'from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey\ndef make(): return X25519PrivateKey.generate()', 'main.py': 'from keys import make\nk=make()\nk.exchange(peer)'}, 'X25519'),
 ('rsa_public_derivation', {'keys.py': 'from cryptography.hazmat.primitives.asymmetric import rsa\ndef make(): return rsa.generate_private_key(65537,2048)', 'main.py': 'from keys import make\nk=make().public_key()\nk.verify(signature,data,pad,hash_algorithm)'}, 'RSA'),
 ('pycrypto_pss', {'keys.py': 'from Crypto.PublicKey import RSA\ndef make(): return RSA.generate(2048)', 'main.py': 'from keys import make\nfrom Crypto.Signature import pss\nsigner=pss.new(make())\nsigner.sign(hash_value)'}, 'RSA'),
 ('pycrypto_dss', {'keys.py': 'from Crypto.PublicKey import DSA\ndef make(): return DSA.generate(2048)', 'main.py': 'from keys import make\nfrom Crypto.Signature import DSS\nsigner=DSS.new(make(),"fips-186-3")\nsigner.sign(hash_value)'}, 'DSA'),
]


class ExtendedCasesTests(unittest.TestCase):
    def test_24_explicit_multifile_cases(self):
        self.assertEqual(len(CASES), 24)
        for name, files, expected in CASES:
            with self.subTest(case=name):
                result = analyze_crypto(snapshot(files))
                known = {c.value.value for o in result.operations for c in o.claims if c.claim_type == 'ALGORITHM' and c.level == 'E3'}
                if expected:
                    self.assertIn(expected, known)
                else:
                    self.assertFalse(known)

    def test_36_frozen_cases_do_not_gain_wrong_algorithm_proofs(self):
        cases = load_catalog()
        self.assertEqual(len(cases), 36)
        for case in cases:
            with self.subTest(case=case['id']):
                files = dict(case['files'])
                roots = package_roots(tuple(files))
                prefix = roots[0] + '/' if len(roots) == 1 and roots[0] != '.' else ''
                files[prefix + 'additional_scope_marker.py'] = 'marker = 1\n'
                self.assertGreaterEqual(len(files), 2)
                result = analyze_crypto(snapshot(files))
                for operation in result.operations:
                    claim = next(c for c in operation.claims if c.claim_type == 'ALGORITHM')
                    if claim.level != 'E3':
                        continue
                    # Identity-independent matching uses the original exact text anchors.
                    path = next(s.relative_path for s in result.snapshot.sources if s.source_id == operation.sink_location.source_id)
                    matches = [o for o in case['operations'] if o['sink'][0] == path and anchor_span(case, o['sink']).start_line == operation.sink_location.start_line]
                    self.assertTrue(any(o.get('algorithm') == claim.value.value for o in matches))
