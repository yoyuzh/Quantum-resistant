import test from 'node:test';
import assert from 'node:assert/strict';
import { graphData, methodLabel, selectedFindings } from '../src/utils/analysis.js';
import { findingKey } from '../src/utils/results.js';
import { filterFindings } from '../src/utils/results.js';

const assets = Array.from({ length: 15 }, (_, i) => ({
  source_id: `s${i}`,
  file_name: 'same.py',
  algorithm: 'RSA',
  finding_count: i + 1,
  targets: ['ML-KEM', 'ML-DSA'],
}));
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
test('graph: stable pagination, source identities, evidence counts and unique reference edges', () => {
  const graph = graphData(assets);
  assert.equal(graph.files.length, 12);
  assert.equal(graph.totalFiles, 15);
  assert.equal(graph.evidenceEdges.length, 12);
  assert.equal(graph.recommendationEdges.length, 2);
  assert.equal(
    graph.evidenceEdges.reduce((sum, edge) => sum + edge.count, 0),
    78,
  );
  assert.equal(graphData(assets, '', 2).files[0].id, 's12');
  assert.equal(graphData(assets, 's14').files[0].id, 's14');
  assert.equal(graphData(assets, 'missing').files.length, 0);
  assert.deepEqual(graphData([]).algorithms, []);
});
test('graph: same file multiple algorithms creates separate edges, one file node', () => {
  const graph = graphData([assets[0], { ...assets[0], algorithm: 'ECDSA', targets: ['ML-DSA'] }]);
  assert.equal(graph.files.length, 1);
  assert.equal(graph.files[0].count, 2);
  assert.equal(graph.evidenceEdges.length, 2);
  assert.equal(graph.recommendationEdges.length, 3);
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
