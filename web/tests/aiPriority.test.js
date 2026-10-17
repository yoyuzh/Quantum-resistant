import test from 'node:test';
import assert from 'node:assert/strict';
import { opinionPriority, prioritizeOpinions, filterOpinions } from '../src/utils/aiAnalysis.js';

const opinion = (id, algorithm = 'RSA', kind = 'new_candidate', citation = 'valid') => ({
  candidate_id: id, algorithm, opinion_kind: kind, citation_status: citation,
});

test('复核优先级区分传统算法、质疑、弃答、引用失败和PQC资产', () => {
  assert.equal(opinionPriority(opinion('rsa', 'RSA-2048')).level, 'high');
  assert.equal(opinionPriority(opinion('hybrid', 'ML-KEM-768 + RSA-2048')).level, 'high');
  assert.equal(opinionPriority(opinion('rsa', 'RSA', 'questions_static')).level, 'medium');
  assert.equal(opinionPriority(opinion('rsa', 'RSA', 'abstain')).level, 'unknown');
  assert.equal(opinionPriority(opinion('rsa', 'RSA', 'new_candidate', 'invalid')).level, 'unknown');
  assert.equal(opinionPriority(opinion('rsa', 'RSA', 'new_candidate', 'absent')).level, 'unknown');
  assert.equal(opinionPriority(opinion('unknown', 'unknown')).level, 'unknown');
  for (const algorithm of ['ML-DSA-65', 'ML-KEM-768', 'SLH-DSA', 'Kyber', 'Dilithium']) {
    assert.equal(opinionPriority(opinion(algorithm, algorithm)).level, 'info');
  }
  assert.equal(opinionPriority(opinion('import'), { rules: ['python_crypto_import'] }).level, 'info');
  assert.equal(opinionPriority(opinion('call'), { rules: ['python_crypto_import', 'static_finding'] }).level, 'high');
});

test('排序优先显示高问题，保持同级顺序与原数据；筛选后仍遵守排序', () => {
  const original = [opinion('info', 'ML-DSA'), opinion('unknown', 'unknown', 'abstain'),
    opinion('medium', 'AES'), opinion('high-one'), opinion('high-two', 'ECDH')];
  assert.deepEqual(prioritizeOpinions(original).map(x => x.candidate_id),
    ['high-one', 'high-two', 'medium', 'unknown', 'info']);
  assert.deepEqual(original.map(x => x.candidate_id), ['info', 'unknown', 'medium', 'high-one', 'high-two']);
  const selected = filterOpinions(original, 'new_candidate', 'valid');
  assert.deepEqual(prioritizeOpinions(selected).map(x => x.candidate_id),
    ['high-one', 'high-two', 'medium', 'info']);
});
