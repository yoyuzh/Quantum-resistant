"""Independent semantic examples; text is parsed, never executed or imported."""
from __future__ import annotations

import dataclasses
import unittest
from unittest.mock import patch

from deep_analysis.abstract_values import FactStore
from deep_analysis.engine import analyze
from deep_analysis.models import Ambiguous, Budgets, Known, Unknown
from tests.deep_static.helpers import snapshot


def run_files(files, **kwargs):
    return analyze(snapshot(files), **kwargs)


def jwt_candidates(result):
    return [c for c in result.candidates if c.api == 'jwt.encode']


def algorithm(candidate):
    return candidate.argument('algorithm').value


def module_case(body):
    return {'main.py': 'import jwt\n' + body}


class DiscoveryTests(unittest.TestCase):
    def test_independent_discovery_with_empty_legacy_hits(self):
        with patch('scanner.python_analysis.scan_with_ast', side_effect=AssertionError('legacy scanner must not run')):
            result = run_files(module_case('jwt.encode({}, key, algorithm="HS256")'))
        self.assertEqual(len(jwt_candidates(result)), 1)
        self.assertEqual(algorithm(result.candidates[0]), Known(value='HS256'))
        self.assertFalse(hasattr(result.candidates[0], 'claims'))

    def test_import_only_and_handwritten_are_not_operations(self):
        for files in ({'a.py': 'from Crypto.PublicKey import RSA'},
                      {'a.py': 'def transform(x,n): return pow(x,65537,n)\ntransform(2,3)'},
                      {'a.py': 'class Thing:\n def sign(self): pass\nx=Thing()\nx.sign()'}):
            with self.subTest(files=files):
                self.assertEqual(run_files(files).candidates, ())

    def test_three_library_structural_targets_are_not_algorithm_guesses(self):
        result = run_files({'a.py': 'from Crypto.PublicKey import RSA\nRSA.generate(2048)\n',
                            'b.py': 'from cryptography.hazmat.primitives.asymmetric import ec\nec.generate_private_key(curve)\n'})
        self.assertEqual({c.api for c in result.candidates}, {'Crypto.PublicKey.RSA.generate', 'cryptography.hazmat.primitives.asymmetric.ec.generate_private_key'})
        self.assertTrue(all(not hasattr(c, 'risk_category') for c in result.candidates))

    def test_unknown_receiver_does_not_guess_rsa(self):
        result = run_files(module_case('key.sign(data)\nother.sign(data)'))
        self.assertEqual(len(result.candidates), 2)
        self.assertTrue(all(c.api is None for c in result.candidates))


class BindingTests(unittest.TestCase):
    def wrappers(self, signature, calls, body='return jwt.encode(payload, key, algorithm=algorithm)'):
        return run_files({'pkg/__init__.py': '', 'pkg/wrap.py': f'import jwt\ndef issue({signature}):\n {body}\n',
                          'main.py': 'from pkg.wrap import issue\n' + calls})

    def test_same_sink_two_calls_keep_values_provenance_and_ids_separate(self):
        result = self.wrappers('payload,key,algorithm', 'a=issue({},k,"RS256")\nb=issue({},k,"HS256")')
        candidates = jwt_candidates(result)
        self.assertEqual([algorithm(c) for c in candidates], [Known(value='RS256'), Known(value='HS256')])
        self.assertEqual(len({c.operation_id for c in candidates}), 2)
        self.assertEqual(len({c.template_id for c in candidates}), 1)
        self.assertTrue(all(len(c.context.call_chain) == 1 for c in candidates))
        a, b = [c.argument('algorithm') for c in candidates]
        self.assertNotEqual(a.fact_id, b.fact_id)
        for fact in (a, b):
            self.assertIn('ARGUMENT_FLOW', {s.kind for s in fact.steps})
            self.assertIn('CALLS', {s.kind for s in fact.steps})

    def test_position_keyword_only_default_and_unpack(self):
        cases = [('payload,key,algorithm', 'issue(algorithm="HS256",key=k,payload={})', 'HS256'),
                 ('payload,/,*,key,algorithm', 'issue({},key=k,algorithm="RS256")', 'RS256'),
                 ('payload,key,algorithm="HS256"', 'issue({},k)', 'HS256'),
                 ('payload,key,*,algorithm="RS256"', 'issue({},k)', 'RS256'),
                 ('payload,key,algorithm', 'issue(*({},k),**{"algorithm":"HS256"})', 'HS256'),
                 ('payload,key,algorithm', 'issue(*[{},k,"RS256"])', 'RS256')]
        for signature, call, value in cases:
            with self.subTest(signature=signature, call=call):
                candidate, = jwt_candidates(self.wrappers(signature, call))
                self.assertEqual(algorithm(candidate), Known(value=value))

    def test_invalid_missing_and_unknown_expansion_never_bind_known_values(self):
        cases = [('payload,key,algorithm', 'issue({},k)', 'missing_argument'),
                 ('payload,key,algorithm', 'issue({},k,"RS256",algorithm="HS256")', 'invalid_argument_binding'),
                 ('payload,/,key,algorithm', 'issue(payload={},key=k,algorithm="RS256")', 'invalid_argument_binding'),
                 ('payload,key,algorithm', 'issue(*args,**kwargs)', 'dynamic_unpack'),
                 ('payload,key,algorithm', 'issue({},k,"RS256",extra=1)', 'invalid_argument_binding'),
                 ('payload,key,algorithm', 'issue({},k,**{"algorithm":"RS256", "algorithm":"HS256"})', 'invalid_argument_binding')]
        for signature, call, reason in cases:
            with self.subTest(call=call):
                candidate, = jwt_candidates(self.wrappers(signature, call))
                self.assertIsInstance(algorithm(candidate), Unknown)
                self.assertEqual(algorithm(candidate).reason, reason)

    def test_default_global_is_captured_at_definition_not_at_call(self):
        result = run_files({'wrap.py': 'import jwt\nALG="RS256"\ndef issue(payload,key,algorithm=ALG):\n return jwt.encode(payload,key,algorithm=algorithm)\nALG="HS256"\n',
                            'app.py': 'from wrap import issue\nissue({},k)'})
        candidate, = jwt_candidates(result)
        self.assertEqual(algorithm(candidate), Known(value='RS256'))

    def test_dynamic_default_is_unknown(self):
        candidate, = jwt_candidates(self.wrappers('payload,key,algorithm=choose()', 'issue({},k)'))
        self.assertEqual(algorithm(candidate).reason, 'dynamic_default')

    def test_unspecified_library_algorithm_not_filled_from_library_defaults(self):
        candidate, = jwt_candidates(run_files(module_case('jwt.encode({},key)')))
        self.assertEqual(algorithm(candidate), Unknown(reason='unspecified_api_parameter'))

    def test_decode_literal_list_remains_a_container(self):
        result = run_files(module_case('jwt.decode(token,key,algorithms=["RS256","HS256"])'))
        candidate, = result.candidates
        fact = candidate.argument('algorithms')
        self.assertEqual([f.value.value for f in fact.items], ['RS256', 'HS256'])
        self.assertIsInstance(fact.value, Unknown)


class FlowTests(unittest.TestCase):
    def one(self, body):
        candidate, = jwt_candidates(run_files(module_case(body)))
        return candidate.argument('algorithm')

    def test_sequential_assignments_not_last_write_everywhere(self):
        result = run_files(module_case('alg="RS256"\njwt.encode({},k,algorithm=alg)\nalg="HS256"\njwt.encode({},k,algorithm=alg)'))
        self.assertEqual([algorithm(c).value for c in jwt_candidates(result)], ['RS256', 'HS256'])

    def test_parameter_reassignment_and_local_unbound(self):
        for prefix, expected in [('algorithm="HS256"\n ', Known(value='HS256')),
                                 ('before=algorithm\n algorithm="HS256"\n ', Known(value='RS256'))]:
            name = 'before' if 'before=' in prefix else 'algorithm'
            result = run_files({'wrap.py': 'import jwt\ndef issue(algorithm):\n ' + prefix + f'return jwt.encode({{}},key,algorithm={name})',
                                'app.py': 'from wrap import issue\nissue("RS256")'})
            self.assertEqual(algorithm(jwt_candidates(result)[0]), expected)
        result = run_files({'a.py': 'import jwt\nalg="RS256"\ndef f():\n jwt.encode({},k,algorithm=alg)\n alg="HS256"\nf()'})
        self.assertEqual(algorithm(jwt_candidates(result)[0]).reason, 'unbound_local')

    def test_branches_same_distinct_unknown_and_missing_arm(self):
        cases = [('"RS256"', '"RS256"', Known), ('"RS256"', '"HS256"', Ambiguous),
                 ('"RS256"', 'runtime()', Unknown)]
        for left, right, expected in cases:
            fact = self.one(f'if flag:\n alg={left}\nelse:\n alg={right}\njwt.encode({{}},k,algorithm=alg)')
            self.assertIsInstance(fact.value, expected)
            if isinstance(fact.value, (Ambiguous, Unknown)):
                self.assertIn('RS256', [a.value for a in fact.value.alternatives])
        fact = self.one('if flag:\n alg="RS256"\njwt.encode({},k,algorithm=alg)')
        self.assertIsInstance(fact.value, Unknown)
        self.assertEqual([a.value for a in fact.value.alternatives], ['RS256'])

    def test_known_condition_ignores_dead_unknown_value(self):
        fact = self.one('if True:\n alg="RS256"\nelse:\n alg=runtime()\njwt.encode({},k,algorithm=alg)')
        self.assertEqual(fact.value, Known(value='RS256'))

    def test_absolute_relative_and_module_alias_constants(self):
        for use in ['from .config import ALG as A\nvalue=A', 'from pkg.config import ALG\nvalue=ALG', 'import pkg.config as config\nvalue=config.ALG']:
            with self.subTest(use=use):
                result = run_files({'pkg/__init__.py': '', 'pkg/config.py': 'ALG="HS256"',
                                    'pkg/app.py': 'import jwt\n' + use + '\njwt.encode({},k,algorithm=value)'})
                fact = jwt_candidates(result)[0].argument('algorithm')
                self.assertEqual(fact.value, Known(value='HS256'))
                self.assertIn('IMPORT_BINDING', {s.kind for s in fact.steps})

    def test_transparent_return_and_consumed_call_result_have_return_flow(self):
        result = run_files({'config.py': 'def choose(algorithm):\n selected=algorithm\n return selected',
                            'main.py': 'import jwt\nfrom config import choose\nalg=choose("HS256")\njwt.encode({},key,algorithm=alg)'})
        fact = jwt_candidates(result)[0].argument('algorithm')
        self.assertEqual(fact.value, Known(value='HS256'))
        self.assertTrue({'CALLS', 'ARGUMENT_FLOW', 'ASSIGN_FLOW', 'RETURN_FLOW'} <= {s.kind for s in fact.steps})

    def test_calls_without_return_do_not_get_return_flow_or_algorithm(self):
        result = run_files({'config.py': 'def choose():\n alg="RS256"',
                            'main.py': 'import jwt\nfrom config import choose\nalg=choose()\njwt.encode({},key,algorithm=alg)'})
        fact = jwt_candidates(result)[0].argument('algorithm')
        self.assertIsInstance(fact.value, Unknown)
        self.assertIn('CALLS', {s.kind for s in fact.steps})
        self.assertNotIn('RETURN_FLOW', {s.kind for s in fact.steps})

    def test_derived_expression_does_not_equal_input(self):
        fact = self.one('alg="RS256"\nalg=alg+suffix\njwt.encode({},k,algorithm=alg)')
        self.assertEqual(fact.value.reason, 'unsupported_transform')
        self.assertIn('DERIVED', {s.kind for s in fact.steps})

    def test_branch_return_and_unknown_return_arm(self):
        for right, expected in [('"HS256"', Ambiguous), ('runtime()', Unknown)]:
            result = run_files({'config.py': f'def choose(flag):\n if flag:\n  return "RS256"\n return {right}',
                                'app.py': 'import jwt\nfrom config import choose\njwt.encode({},key,algorithm=choose(flag))'})
            self.assertIsInstance(algorithm(jwt_candidates(result)[0]), expected)

    def test_missing_module_and_flat_input_do_not_join_values(self):
        from deep_analysis.snapshot import build_snapshot
        from tests.deep_static.helpers import records
        files = {'config.py': 'ALG="RS256"', 'app.py': 'import jwt\nfrom config import ALG\njwt.encode({},k,algorithm=ALG)'}
        flat = build_snapshot(records(files), 'manual_upload')
        self.assertEqual(algorithm(jwt_candidates(analyze(flat))[0]).reason, 'cross_module_disabled')


class IdentityAndLimitTests(unittest.TestCase):
    def test_identity_versions_snapshot_conditions_and_template_isolation(self):
        files = {'wrap.py': 'import jwt\ndef issue(algorithm):\n return jwt.encode({},k,algorithm=algorithm)',
                 'main.py': 'from wrap import issue\nissue("RS256");issue("HS256")'}
        first = run_files(files)
        repeat = run_files(files)
        self.assertEqual([c.operation_id for c in first.candidates], [c.operation_id for c in repeat.candidates])
        changed = run_files(files, semantics_version='bounded-backward-test')
        self.assertTrue(set(c.operation_id for c in first.candidates).isdisjoint(c.operation_id for c in changed.candidates))
        template = run_files({'wrap.py': files['wrap.py']})
        candidate, = template.candidates
        self.assertEqual(candidate.context.kind, 'uninstantiated_template')
        self.assertEqual(algorithm(candidate).reason, 'uninstantiated_template')
        self.assertNotIn(candidate.operation_id, {c.operation_id for c in first.candidates})

    def test_same_names_different_modules_and_return_context_cache(self):
        result = run_files({'one.py': 'def choose(x): return x', 'two.py': 'def choose(x): return x',
                            'main.py': 'import jwt\nfrom one import choose\nfrom two import choose as other\na=choose("RS256")\nb=other("HS256")\njwt.encode({},k,algorithm=a);jwt.encode({},k,algorithm=b)'})
        self.assertEqual([algorithm(c).value for c in jwt_candidates(result)], ['RS256', 'HS256'])
        self.assertGreater(result.cache_entries, 0)

    def test_recursion_dynamic_reflection_decorator_and_global_write_unknown(self):
        sources = [
            {'a.py': 'import jwt\ndef f(x):\n return f(x)\njwt.encode({},k,algorithm=f("RS256"))'},
            module_case('alg=getattr(config,"ALG")\njwt.encode({},k,algorithm=alg)'),
            module_case('alg=__import__("config").ALG\njwt.encode({},k,algorithm=alg)'),
            {'a.py': 'import jwt\n@decorator\ndef f(algorithm):\n return jwt.encode({},k,algorithm=algorithm)\nf("RS256")'},
            {'a.py': 'import jwt\nALG="RS256"\ndef change():\n global ALG\n ALG=runtime()\njwt.encode({},k,algorithm=ALG)'},
        ]
        for files in sources:
            with self.subTest(files=files):
                candidates = jwt_candidates(run_files(files))
                self.assertTrue(candidates)
                self.assertTrue(all(isinstance(algorithm(c), Unknown) for c in candidates))

    def test_call_depth_context_value_slice_and_structure_limits(self):
        files = {'w.py': 'import jwt\ndef issue(a): return jwt.encode({},k,algorithm=a)',
                 'main.py': 'from w import issue\nissue("RS256");issue("HS256");issue("ES256")'}
        for budgets, reason in [(Budgets(call_depth=0), 'call_depth_limit'),
                                 (Budgets(contexts_per_function=1), 'context_limit'),
                                 (Budgets(slice_nodes=1), 'slice_limit')]:
            result = run_files(files, budgets=budgets)
            self.assertTrue(any(d.code == reason for d in result.diagnostics), (reason, result))
            self.assertTrue(result.coverage.partial)
        result = run_files(module_case('if flag:\n a="RS256"\nelse:\n a="HS256"\njwt.encode({},k,algorithm=a)'), budgets=Budgets(value_candidates=1))
        self.assertEqual(algorithm(jwt_candidates(result)[0]).reason, 'value_limit')
        self.assertTrue(result.coverage.partial)
        self.assertTrue(any(d.code == 'value_limit' for d in result.diagnostics))
        result = run_files(files, budgets=Budgets(structure_bytes=100))
        self.assertTrue(result.coverage.partial)
        self.assertFalse(any(isinstance(algorithm(c), Known) for c in jwt_candidates(result)))

    def test_checkpoint_and_no_network_or_execution(self):
        text = 'import jwt\nraise RuntimeError("NEVER_EXECUTE")\njwt.encode({},k,algorithm="RS256")'
        with patch('httpx.Client.send', side_effect=AssertionError('network forbidden')):
            result = run_files({'a.py': text})
        self.assertEqual(len(result.candidates), 1)
        def stop():
            raise TimeoutError('cancelled')
        with self.assertRaises(TimeoutError):
            run_files(module_case('jwt.encode({},k,algorithm="RS256")'), checkpoint=stop)

    def test_unknown_union_does_not_turn_known_and_bool_is_not_int(self):
        store = FactStore(Budgets())
        merged = store.merge([store.literal('RS256'), store.unknown('runtime')])
        self.assertIsInstance(merged.value, Unknown)
        self.assertEqual([a.value for a in merged.value.alternatives], ['RS256'])
        self.assertIsInstance(store.merge([store.literal(True), store.literal(1)]).value, Ambiguous)

    def test_template_and_invocation_in_same_snapshot_stay_separate(self):
        result = run_files({'a.py': 'import jwt\ndef inner(a): return jwt.encode({},k,algorithm=a)\ndef unused(a): return inner(a)\ninner("RS256")'})
        candidates = jwt_candidates(result)
        self.assertEqual(len(candidates), 2)
        self.assertEqual(len({c.operation_id for c in candidates}), 2)
        self.assertEqual(sum(isinstance(algorithm(c), Known) for c in candidates), 1)
        self.assertEqual(sum(isinstance(algorithm(c), Unknown) for c in candidates), 1)

    def test_nested_wrapper_keeps_original_global_cutoff(self):
        result = run_files({'a.py': 'import jwt\nALG="RS256"\ndef inner(): return jwt.encode({},k,algorithm=ALG)\ndef outer(): return inner()\nouter()\nALG="HS256"'})
        self.assertEqual([algorithm(c).value for c in jwt_candidates(result)], ['RS256'])
        self.assertEqual(len(jwt_candidates(result)[0].context.call_chain), 2)

    def test_imported_attribute_mutation_and_access_before_import_are_unknown(self):
        for body in ('import config\nconfig.ALG=runtime()\njwt.encode({},k,algorithm=config.ALG)',
                     'jwt.encode({},k,algorithm=config.ALG)\nimport config'):
            result = run_files({'config.py': 'ALG="RS256"', 'main.py': 'import jwt\n' + body})
            self.assertIsInstance(algorithm(jwt_candidates(result)[0]), Unknown)

    def test_dependency_depth_stops_without_python_recursion_error(self):
        body = ['import jwt', 'a0="RS256"']
        body.extend(f'a{i}=a{i-1}' for i in range(1, 100))
        body.append('jwt.encode({},k,algorithm=a99)')
        result = run_files({'a.py': '\n'.join(body)})
        self.assertEqual(algorithm(jwt_candidates(result)[0]).reason, 'evaluation_depth_limit')
        self.assertTrue(result.coverage.partial)

    def test_shared_structure_limit_keeps_completed_candidates(self):
        files = module_case('jwt.encode({},k,algorithm="RS256")\njwt.encode({},k,algorithm="HS256")')
        full = run_files(files)
        partial = run_files(files, budgets=Budgets(structure_bytes=full.structure_bytes - 1))
        self.assertTrue(partial.coverage.partial)
        self.assertEqual(len(partial.candidates), 1)
        self.assertEqual(algorithm(partial.candidates[0]).value, 'RS256')
