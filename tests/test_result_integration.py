from __future__ import annotations

import json
from pathlib import Path
import tempfile
import unittest

from backend.ai.config import Config, ConfigStore, Settings, POLICY
from backend.ai.preferences import Preferences
from backend.integration import integrate
from tests.deep_static.helpers import snapshot
from deep_analysis.pipeline import analyze_crypto


class IntegrationTests(unittest.TestCase):
    def test_mixed_key_generation_and_signing_keep_the_proven_migration_relation(self):
        source=snapshot({'use.py':'from cryptography.hazmat.primitives.asymmetric import rsa,padding\nfrom cryptography.hazmat.primitives import hashes\nk=rsa.generate_private_key(65537,2048)\ns=k.sign(data,padding.PKCS1v15(),hashes.SHA256())\n'})
        base={'sources':[{'source_id':s.identity.source_id,'source_type':'manual_upload','file_name':s.identity.relative_path,'content':'','line_count':4,'char_count':0} for s in source.logical.sources],
              'findings':[], 'deep_analysis':analyze_crypto(source).model_dump(mode='json')}
        result=integrate(base)
        asset=next(a for a in result['analysis']['assets'] if a['algorithm']=='RSA')
        self.assertEqual(set(asset['targets']),{'ML-DSA','SLH-DSA'})
        signing=next(m for m in result['analysis']['migrations'] if m['targets'])
        self.assertEqual(len(signing['finding_ids']),1)
        self.assertEqual(next(f['line'] for f in result['findings'] if f['finding_id']==signing['finding_ids'][0]),4)

    def base(self):
        source = snapshot({'wrapper.py': 'import jwt\ndef issue(alg):\n return jwt.encode({}, key, algorithm=alg)\n',
                           'app.py': 'from wrapper import issue\nissue("RS256")\nissue("HS256")\n'})
        deep = analyze_crypto(source).model_dump(mode='json')
        return {'source_type':'github_repository', 'scanned_at':'2026-10-25T00:00:00+08:00', 'findings':[],
                'sources':[{'source_id':s.identity.source_id,'file_name':s.identity.relative_path,'source_type':'github_repository', 'content':'', 'line_count':3,'char_count':0} for s in source.logical.sources],
                'deep_analysis':deep}

    def test_cross_file_risk_and_symmetric_policy_have_distinct_counts(self):
        base = self.base()
        result = integrate(base)
        self.assertEqual(result['changes']['new_confirmed'], 1)
        self.assertEqual(result['summary']['finding_count'], 1)
        self.assertEqual(len(result['calls']), 2)
        self.assertEqual(result['findings'][0]['algorithm'], 'RSA')
        self.assertEqual(result['analysis']['migrations'][0]['targets'], ['ML-DSA','SLH-DSA'])
        self.assertEqual(base['findings'], [])

    def test_model_cannot_promote_or_change_score_by_citing_valid_evidence(self):
        base = self.base()
        before = integrate(base)
        s = base['sources'][0]
        opinion = {'candidate_id':'candidate','algorithm':'DSA','purpose':'sign','opinion_kind':'new_candidate',
                   'rationale':'模型建议', 'static_refs':[], 'citations':[], 'candidate_location':{'source_id':s['source_id'],'line':1,'context_id':None}}
        base['ai_analysis']={'opinions':[opinion]}
        after = integrate(base)
        self.assertEqual(after['summary'], before['summary'])
        self.assertEqual(after['changes']['pending'], before['changes']['pending']+1)
        self.assertEqual(after['analysis']['assets'][-1]['targets'], [])

    def test_symmetric_operation_review_is_not_a_new_pending_quantum_risk(self):
        base = self.base()
        operation = next(o for o in base['deep_analysis']['operations'] if o['algorithm'].get('value')=='HS256')
        base['ai_analysis']={'opinions':[{'candidate_id':'symmetric','algorithm':'unknown','purpose':'unknown',
            'opinion_kind':'supports_static','rationale':'已核验', 'static_refs':[operation['operation_id']],
            'candidate_location':{'source_id':operation['sink_location']['source_id'],'line':3}}]}
        self.assertEqual(integrate(base)['changes']['pending'],0)


class MemoryCredentials:
    def __init__(self): self.values = {}; self.fail = False
    def write(self, identity, value):
        if self.fail: raise RuntimeError('unavailable')
        self.values[identity] = value
    def read(self, identity): return self.values.get(identity)
    def delete(self, identity): self.values.pop(identity, None)


class PreferencesTests(unittest.TestCase):
    def test_restart_restores_config_without_plaintext_and_deletion_is_durable(self):
        with tempfile.TemporaryDirectory() as root:
            store = MemoryCredentials()
            preferences = Preferences(Path(root), store)
            config = Config(base_url='https://model.invalid/',model='fixture',api_key='test-only-private-value',consent=True)
            self.assertTrue(preferences.save(config))
            self.assertNotIn(config.api_key, (Path(root)/'ai-settings.json').read_text())
            restored = Preferences(Path(root), store).load()
            self.assertEqual(restored.api_key, config.api_key)
            self.assertTrue(restored.consent)
            preferences.clear()
            self.assertIsNone(Preferences(Path(root), store).load())
            self.assertEqual(store.values, {})

    def test_failed_save_preserves_old_profile_and_policy_change_needs_consent(self):
        with tempfile.TemporaryDirectory() as root:
            credentials = MemoryCredentials()
            preferences = Preferences(Path(root), credentials)
            config = Config(base_url='https://model.invalid/',model='fixture',api_key='test-only-value',consent=True)
            preferences.save(config)
            old = (Path(root)/'ai-settings.json').read_bytes()
            credentials.fail = True
            self.assertFalse(preferences.save(config))
            self.assertEqual((Path(root)/'ai-settings.json').read_bytes(), old)
            record = json.loads(old)
            record['policy'] = POLICY+'-old'
            (Path(root)/'ai-settings.json').write_text(json.dumps(record))
            self.assertFalse(preferences.load().consent)

    def test_identical_settings_preserve_version_and_empty_key(self):
        store = ConfigStore()
        value = Settings(base_url='https://model.invalid/v1',model='fixture',api_key='test-value',consent=True)
        first = store.update(value)
        second = store.update(value.model_copy(update={'api_key':''}))
        self.assertEqual(first.version,second.version)
        self.assertEqual(second.api_key,'test-value')
