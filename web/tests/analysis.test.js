import test from 'node:test';
import assert from 'node:assert/strict';
import { methodLabel, selectedFindings } from '../src/utils/analysis.js';
import { findingKey } from '../src/utils/results.js';
import { filterFindings } from '../src/utils/results.js';

test('search includes exact library/API metadata and never invents absent values', () => {
  const items = [
    {
      source_id: 'a',
      file_name: 'x.py',
      library: 'cryptography',
      resolved_api: 'cryptography.rsa.generate_private_key',
    },
    { source_id: 'b', file_name: 'x.py' },
  ];
  assert.deepEqual(filterFindings(items, { query: 'cryptography.rsa' }), [items[0]]);
  assert.deepEqual(filterFindings(items, { query: 'undefined' }), []);
});
test('selection: migration target intersects file, algorithm and query', () => {
  const findings = ['RSA', 'DSA'].map((algorithm, i) => ({
    source_id: `s${i}`,
    file_name: 'same.py',
    algorithm,
    line: 2,
    evidence: 'gen()',
    recommendation: 'review',
  }));
  const result = {
    findings,
    analysis: {
      migrations: [
        { algorithm: 'RSA', targets: ['ML-KEM', 'ML-DSA'] },
        { algorithm: 'DSA', targets: ['ML-DSA'] },
      ],
    },
  };
  assert.deepEqual(selectedFindings(result, { target: 'ML-KEM' }), [findings[0]]);
  assert.deepEqual(selectedFindings(result, { sourceId: 's1', target: 'ML-KEM' }), []);
  assert.deepEqual(selectedFindings(result, { sourceId: 's1', query: 'gen' }), [findings[1]]);
  assert.deepEqual(selectedFindings({ findings }, {}), findings);
  assert.notEqual(findingKey(findings[0]), findingKey({ ...findings[0], source_id: 'different' }));
  assert.equal(methodLabel(null), '未记录');
});
