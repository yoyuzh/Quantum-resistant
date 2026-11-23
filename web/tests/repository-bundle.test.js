import test from 'node:test';
import assert from 'node:assert/strict';
import { repositoryAtlas } from '../src/utils/repositoryAtlas.js';
import { repositoryCategories } from '../src/utils/repositoryCategories.js';
import { repositoryLocation } from '../src/utils/repositoryEvidence.js';
import { BUNDLE_LABEL_LINE, bundleStyle, layoutRepositoryBundle, linkedRepositoryNames, matchesBundleFocus, repositoryBundleFlows } from '../src/utils/repositoryBundle.js';

const row = full_name => ({ repo: { full_name } });
const groups = [
  { id: 'crypto', rows: [row('a/one'), row('a/two'), row('a/unlinked')] },
  { id: 'auth', rows: [row('b/other')] },
];
const makeFlow = (repo, algorithm, purpose, count, category = 'crypto') => ({ repo, algorithm, purpose, count, category });
const flows = [
  makeFlow('a/one', 'RSA', 'key_material', 7),
  makeFlow('a/one', 'RSA', 'key_generation', 3),
  makeFlow('a/two', 'ECC', 'unknown', 1),
  makeFlow('b/other', 'ECDSA', 'sign', 4, 'auth'),
];

test('仓库和算法沿同一环形排列，复合用途保留独立且可区分的连线', () => {
  const graph = layoutRepositoryBundle(groups, flows, ['a/one', 'a/two', 'b/other'], 1100, 650);
  assert.equal(graph.nodes.length, 6);
  for (const node of graph.nodes) {
    assert.equal(node.x < graph.center.x, node.side === 'repo');
    assert.ok(Math.abs(Math.hypot(node.x - graph.center.x, node.y - graph.center.y) - graph.radius) < 1e-8);
    assert.equal(node.labelLines.join(''), node.key);
    assert.ok(Math.abs(node.labelX - graph.center.x) > Math.abs(node.x - graph.center.x));
    assert.equal(Math.round(node.labelY), Math.round(node.y));
  }
  assert.equal(graph.links.length, 4);
  assert.equal(new Set(graph.links.map(link => link.id)).size, 4);
  assert.equal(new Set(graph.links.map(link => link.dash)).size, 4);
  assert.notEqual(graph.links[0].path, graph.links[1].path);
  assert.equal(graph.nodes.find(node => node.key === 'RSA').count, 10);
  assert.equal(bundleStyle('key_material').label, '密钥材料');
});

test('证据定位编码文件路径并使用固定提交，缺少提交时仍保留行号', () => {
  const repo = { full_name:'a/one', revision:'a'.repeat(40) };
  const example = { path:'src/a #b.py', line:17 };
  assert.equal(repositoryLocation(repo, example).url, `https://github.com/a/one/blob/${repo.revision}/src/a%20%23b.py#L17`);
  assert.deepEqual(repositoryLocation({ full_name:'a/one' }, example), { ...example, url:'', label:'src/a #b.py:17' });
  assert.equal(repositoryLocation(repo, { path:'../out.py', line:17 }).url, '');
  assert.equal(repositoryLocation(repo, { ...example, line:0 }), null);
});

test('完整图导出跨越分页并容纳多行名称，不随屏幕尺寸增加留白', () => {
  const names = Array.from({ length:100 }, (_, index) => `owner/repository-${'long'.repeat(12)}-${index}`);
  const group = { id:'crypto', rows:names.map(row) };
  const edges = names.map(name => makeFlow(name, 'RSA', 'sign', 1));
  const graph = layoutRepositoryBundle([group], edges, names, 0, 0);
  assert.equal(graph.links.length, 100);
  assert.equal(graph.nodes.length, 101);
  const repoNodes = graph.nodes.filter(node => node.side === 'repo');
  assert.ok(repoNodes[0].labelX > repoNodes[50].labelX);
  assert.ok(graph.radius > layoutRepositoryBundle([group], edges, names.slice(0, 15), 0, 0).radius);
  for (const [index, node] of repoNodes.entries()) {
    assert.equal(node.labelLines.join(''), names[index]);
    assert.ok(node.labelLines.length > 1);
    assert.ok(node.labelX - Math.max(...node.labelLines.map(line => line.length * 12)) > graph.exportBounds.x);
    if (index) {
      const previous = repoNodes[index - 1];
      assert.ok(node.labelY - previous.labelY > (node.labelLines.length + previous.labelLines.length) * BUNDLE_LABEL_LINE / 2);
    }
  }
});

test('分页只绘制可见仓库的边，窄屏和空关系使用有限坐标', () => {
  const page = layoutRepositoryBundle(groups, flows, ['a/one', 'b/other'], 390, 300);
  assert.equal(page.links.length, 3);
  assert.ok(page.width > 390);
  for (const link of page.links) assert.doesNotMatch(link.path, /NaN|Infinity/);
  assert.deepEqual(linkedRepositoryNames(groups, flows.filter(flow => flow.algorithm === 'RSA')), ['a/one']);
  const filtered = layoutRepositoryBundle(groups, flows.filter(flow => flow.algorithm === 'RSA'), ['a/one', 'a/two', 'a/unlinked'], 390, 300);
  assert.deepEqual(filtered.nodes.map(node => node.key), ['a/one', 'RSA']);
  const empty = layoutRepositoryBundle(groups, [], ['b/other'], 390, 300);
  assert.equal(empty.links.length, 0);
  assert.equal(empty.nodes.length, 0);
  assert.equal(bundleStyle('unrecorded').label, '历史用途未记录');
});

test('关系按仓库、算法和用途计数，并区分判断来源和历史摘要', () => {
  const entry = (algorithm, purpose, count, status = 'confirmed', origin = 'static') =>
    ({ algorithm, purpose, status, origin, count });
  const categories = repositoryCategories(repositoryAtlas({ repos: [{
    full_name: 'pyca/cryptography', algorithm_inventory: {
      basis: 'integrated', stages: { confirmed: 'completed', ai_assessed: 'completed' },
      groups: [entry('RSA', 'sign', 3), entry('RSA', 'sign', 2, 'confirmed', 'ai'),
        entry('RSA', 'verify', 2), entry('ECC', 'verify', 8, 'ai_assessed')],
    },
  }, { full_name: 'other/old', algorithms: ['RSA', 'RSA'], finding_count: 99 }] }).rows);
  const confirmed = repositoryBundleFlows(categories, 'confirmed');
  assert.deepEqual(confirmed.map(({ purpose, count }) => [purpose, count]), [['sign', 5], ['verify', 2]]);
  assert.equal(confirmed.filter(flow => matchesBundleFocus(flow, {
    repo: 'pyca/cryptography', algorithm: 'RSA', purpose: 'sign',
  })).length, 1);
  assert.equal(repositoryBundleFlows(categories, 'confirmed', 'ECC').length, 0);
  assert.equal(repositoryBundleFlows(categories, 'ai_assessed', 'ECC')[0].count, 8);
  const [history] = repositoryBundleFlows(categories, 'legacy');
  assert.deepEqual([history.repo, history.algorithm, history.purpose, history.count], ['other/old', 'RSA', 'unrecorded', 1]);
});
