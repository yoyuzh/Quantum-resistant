import test from 'node:test';
import assert from 'node:assert/strict';
import { graphData } from '../src/utils/analysis.js';
import { layoutGraph, truncateGraphLabel } from '../src/utils/graphLayout.js';

const measure = (text, size = 13) => [...text].reduce((sum, char) => sum + (char.charCodeAt(0) > 255 ? size : size / 2), 0);
const asset = (source_id, file_name, algorithm = 'RSA', targets = ['ML-KEM']) => ({
  source_id, file_name, algorithm, targets, finding_count: 1,
});

test('short filenames stay compact while the canvas fills the available workspace', () => {
  const graph = graphData([asset('short', 'a.py'), asset('long', 'very_long_filename_with_many_characters.py')]);
  const layout = layoutGraph(graph, 1800, 700, measure);
  assert.equal(layout.files.get('short').width, 140);
  assert.ok(layout.files.get('long').width > 250);
  assert.equal(layout.width, 1800);
  assert.equal(layout.height, 700);
  assert.ok(layout.columns.target.x + layout.columns.target.width >= 1750);
  for (const node of layout.files.values()) {
    assert.ok(node.y - 22 >= 0 && node.y + 22 <= layout.height);
    assert.equal(node.right, node.x + node.width);
    assert.ok(measure(node.label) <= node.width - 24);
  }
});

test('column gaps compress before long filenames, narrow geometry requests the relation list', () => {
  const graph = graphData([asset('path', '中文目录/'.repeat(20) + '加密算法.py', 'ECDSA', ['SLH-DSA'])]);
  const wide = layoutGraph(graph, 1200, 400, measure);
  const medium = layoutGraph(graph, 700, 400, measure);
  const narrow = layoutGraph(graph, 560, 400, measure);
  assert.equal(wide.columns.file.width, 320);
  assert.equal(medium.columns.file.width, 320);
  assert.ok(medium.columns.algorithm.x - medium.columns.file.x - 320 < 112);
  assert.ok(narrow.columns.file.width < 320);
  assert.ok(narrow.columns.algorithm.x - narrow.columns.file.x - narrow.columns.file.width >= 64);
  assert.equal(layoutGraph(graph, 400, 400, measure).fits, false);
  assert.ok(measure(narrow.files.get('path').label) <= narrow.files.get('path').width - 24);
  assert.ok(narrow.files.get('path').label.endsWith('加密算法.py'));
});

test('all edges keep exact node anchors and same filenames retain separate nodes', () => {
  const graph = graphData([
    asset('first', 'same.py', 'RSA', ['ML-KEM', 'ML-DSA']),
    asset('first', 'same.py', 'DSA', ['ML-DSA']),
    asset('second', 'same.py', 'ECDSA', ['SLH-DSA']),
  ]);
  const layout = layoutGraph(graph, 900, 0, measure);
  assert.equal(layout.files.size, 2);
  assert.notEqual(layout.files.get('first').y, layout.files.get('second').y);
  assert.equal(layout.height, 3 * 56 + 20);
  for (const edge of graph.evidenceEdges) {
    assert.ok(layout.files.get(edge.sourceId).right < layout.algorithms.get(edge.algorithm).x);
  }
  for (const edge of graph.recommendationEdges) {
    assert.ok(layout.algorithms.get(edge.algorithm).right < layout.targets.get(edge.target).x);
  }
  const ys = [...layout.algorithms.values()].map(node => node.y);
  assert.equal(ys[1] - ys[0], 56, '44px targets retain a 12px vertical gap');
});

test('single nodes stay centered and overcrowded columns keep every node with local scrolling', () => {
  const single = layoutGraph(graphData([asset('one', 'short.py')]), 1920, 600, measure);
  assert.equal(single.height, 600);
  assert.equal(single.width, 1920);
  assert.equal(single.files.get('one').y, 300);
  const crowded = layoutGraph(graphData([asset('one', 'short.py', 'RSA', Array.from({ length: 15 }, (_, i) => `target-${i}`))]), 1200, 300, measure);
  assert.equal(crowded.targets.size, 15);
  assert.equal(crowded.height, 15 * 56 + 20);
  const empty = layoutGraph(graphData([]), 800, 0, measure);
  assert.equal(empty.height, 76);
  assert.equal(empty.files.size, 0);
  assert.equal(truncateGraphLabel('short.py', 116, measure), 'short.py');
  const text = truncateGraphLabel('目录/'.repeat(30) + 'rsa_config.py', 140, measure);
  assert.ok(text.includes('…'));
  assert.ok(text.endsWith('rsa_config.py'));
  assert.ok(measure(text) <= 140);
});
