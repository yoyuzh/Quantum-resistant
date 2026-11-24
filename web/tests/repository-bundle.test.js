import test from 'node:test';
import assert from 'node:assert/strict';
import { fullyVerifiedRepository, repositoryAtlas } from '../src/utils/repositoryAtlas.js';
import { repositoryCategories } from '../src/utils/repositoryCategories.js';
import { repositoryLocation } from '../src/utils/repositoryEvidence.js';
import { BUNDLE_LABEL_LINE, bundleStyle, layoutRepositoryBundle, linkedRepositoryNames, matchesBundleFocus,
  repositoryBundleFlows } from '../src/utils/repositoryBundle.js';
import { arrangeOverview, layoutRepositoryOverview, overviewBand, overviewFocus, overviewLane,
  overviewRadius, overviewScale } from '../src/utils/repositoryOverview.js';
import { repositoryOverviewPanels, repositoryOverviewSheet, repositoryOverviewSvg } from '../src/utils/repositorySvgExport.js';

const row = full_name => ({ repo: { full_name } });
const groups = [
  { id: 'crypto', label: '密码算法与基础库', rows: [row('a/one'), row('a/two'), row('a/unlinked')] },
  { id: 'auth', label: '身份认证与令牌', rows: [row('b/other')] },
];
const makeFlow = (repo, algorithm, purpose, count, category = 'crypto') => ({ repo, algorithm, purpose, count, category });
const flows = [
  makeFlow('a/one', 'RSA', 'key_material', 7),
  makeFlow('a/one', 'RSA', 'key_generation', 3),
  makeFlow('a/two', 'ECC', 'unknown', 1),
  makeFlow('b/other', 'ECDSA', 'sign', 4, 'auth'),
];

test('资料库完整核验筛选同时检查已知覆盖、无降级和跨文件完成状态', () => {
  const coverage = { scanned_files:5, candidate_files:5, skipped_files:0, partial:false };
  const inventory = { basis:'integrated', stages:{ confirmed:'completed', pending:'completed' } };
  const repo = { coverage, algorithm_inventory:inventory };
  assert.ok(fullyVerifiedRepository(repo));
  for (const change of [{ candidate_files:null }, { partial:true }, { skipped_files:1 }, { degraded_files:1 }]) {
    assert.equal(fullyVerifiedRepository({ ...repo, coverage:{ ...coverage, ...change } }), false);
  }
  assert.equal(fullyVerifiedRepository({ ...repo, algorithm_inventory:{ ...inventory, stages:{ pending:'partial' } } }), false);
  assert.equal(fullyVerifiedRepository({ ...repo, algorithm_inventory:{ ...inventory, basis:'base' } }), false);
});

test('仓库在单一圆环上占用上下弧段，仓库与算法之间只有两个略宽的间隙', () => {
  const names = Array.from({ length:44 }, (_, index) => 'owner/repo-' + index);
  const edges = names.map((name, index) => makeFlow(name, 'Algorithm-' + index % 11, 'sign', 1));
  const graph = layoutRepositoryBundle([{ id:'crypto', rows:names.map(row) }], edges, names, 1440, 830);
  assert.equal(graph.nodes.length, 55);
  assert.ok(graph.nodes.some(n => n.side === 'repo' && n.x > graph.center.x && n.y > graph.center.y));
  assert.ok(graph.nodes.some(n => n.side === 'repo' && n.x > graph.center.x && n.y < graph.center.y));
  const ring = graph.nodes.map(n => ({
    side:n.side, angle:Math.atan2(n.y - graph.center.y, n.x - graph.center.x),
  })).sort((a,b) => a.angle - b.angle);
  const gaps = ring.map((n, index) => {
    const next = ring[(index + 1) % ring.length];
    return { boundary:n.side !== next.side, gap:next.angle - n.angle + (index === ring.length - 1 ? 2 * Math.PI : 0) };
  });
  assert.equal(gaps.filter(n => n.boundary).length, 2);
  assert.ok(gaps.filter(n => n.boundary).every(n => n.gap > .14 && n.gap < .25));
  assert.ok(gaps.filter(n => !n.boundary).every(n => n.gap < .14));
});

test('仓库和算法沿同一环形排列，复合用途保留独立且可区分的连线', () => {
  const graph = layoutRepositoryBundle(groups, flows, ['a/one', 'a/two', 'b/other'], 1100, 650);
  assert.equal(graph.nodes.length, 6);
  for (const node of graph.nodes) {
    assert.ok(Math.abs(Math.hypot(node.x - graph.center.x, node.y - graph.center.y) - graph.radius) < 1e-8);
    assert.equal(node.labelLines.join(''), node.key);
    assert.ok(Math.hypot(node.labelX - graph.center.x, node.labelY - graph.center.y) > graph.radius);
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

test('二维全景汇总类别，展开只显示本页有检出关系的仓库', () => {
  const overview = layoutRepositoryOverview(groups, flows);
  assert.equal(overview.nodes.filter(node => node.side === 'category').length, 2);
  assert.ok(overview.nodes.every(node => node.side !== 'repo'));
  assert.equal(overview.links.find(link => link.source === 'crypto' && link.algorithm === 'RSA').count, 10);
  const expanded = layoutRepositoryOverview(groups, flows, { expanded:'crypto', visibleNames:['a/one', 'a/unlinked'] });
  assert.deepEqual(expanded.branches.map(branch => [branch.source, branch.target]), [['crypto', 'repo:a/one']]);
  assert.deepEqual(expanded.links.map(link => [link.source, link.algorithm, link.count]), [
    ['repo:a/one', 'RSA', 10], ['auth', 'ECDSA', 4],
  ]);
  assert.equal(expanded.links[0].purpose, undefined);
  assert.ok(expanded.links.every(link => !/NaN|Infinity/.test(link.path)));
});

test('二维全景的完整导出包含所有匹配仓库、类别归属和证据位置', () => {
  const graph = layoutRepositoryOverview(groups, flows, { full:true, visibleNames:['a/one'] });
  assert.deepEqual(graph.branches.map(branch => branch.repo), ['a/one', 'a/two', 'b/other']);
  assert.equal(graph.links.reduce((total, link) => total + link.count, 0), 15);
  assert.ok(graph.nodes.every(node => node.y - node.height / 2 >= 0 && node.y + node.height / 2 <= graph.height));
  const svg = repositoryOverviewSvg(graph, { getPropertyValue: () => '' }, '2026-11-24',
    link => link.repo === 'a/two' ? { label:'src/ecc.py:17', url:'' } : null);
  assert.match(svg, /data-graph-from="crypto" data-graph-to="repo:a\/two"/);
  assert.match(svg, /data-graph-location="src\/ecc.py:17"/);
  assert.match(svg, /检出量 少/);
  assert.match(svg, /data-graph-flow="[^"]+"[^>]+display="none"/);
  assert.doesNotMatch(svg, /a\/unlinked/);
});

test('二维全景对数线宽渐进，曲线贴合圆角端口并延伸到边框内侧', () => {
  const widths = [1, 5, 20, 100, 400, 828].map(count => overviewBand(count, 828));
  assert.ok(widths[0] >= 1.5 && widths.at(-1) <= 8);
  assert.ok(widths.every((width, index) => !index || width > widths[index - 1] && width - widths[index - 1] < 2.1));
  const graph = layoutRepositoryOverview(groups, [...flows, makeFlow('b/other', 'RSA', 'sign', 40, 'auth')], { full:true });
  const target = graph.nodes.find(node => node.key === 'RSA');
  const radius = overviewRadius(target);
  for (const link of graph.links.filter(link => link.target === target.id)) {
    assert.ok(link.to < target.width / 2);
    const horizontal = link.to - target.width / 2 + radius;
    assert.ok(Math.abs(Math.hypot(horizontal, link.end) - radius) < 1e-8);
    assert.ok(link.targetInset > link.width / 2);
    assert.ok(link.path.endsWith(`H${target.x - link.to + link.targetInset}`));
  }
});

test('二维全景聚焦重排有关节点，不改变类别归属或全库线宽刻度', () => {
  const peak = overviewScale(flows);
  const graph = layoutRepositoryOverview(groups, flows, {
    expanded:'crypto', visibleNames:['a/one', 'a/two', 'a/unlinked'], showUnlinked:true, viewportWidth:1200, peak,
  });
  assert.equal(graph.nodes.find(node => node.key === 'a/unlinked').summary, '无检出关系');
  const focus = overviewFocus(graph, 'crypto', { repo:'a/one' });
  assert.deepEqual([...focus.nodes].sort(), ['algorithm:RSA', 'crypto', 'repo:a/one']);
  const positions = arrangeOverview(graph, focus.id, focus.nodes);
  assert.ok(positions.get('repo:a/one').x > graph.home.get('repo:a/one').x);
  assert.ok(positions.get('algorithm:RSA').x < graph.home.get('algorithm:RSA').x);
  for (const node of graph.nodes) {
    const [left,right] = overviewLane(graph, node);
    assert.ok(positions.get(node.id).x >= left && positions.get(node.id).x <= right);
  }
  const filtered = layoutRepositoryOverview(groups, flows.filter(flow => flow.algorithm === 'ECC'), { peak });
  const full = layoutRepositoryOverview(groups, flows, { peak });
  assert.equal(filtered.links[0].width, full.links.find(link => link.algorithm === 'ECC').width);
});

test('边捆绑完整图容纳长名称，文字旋转后仍在导出边界内', () => {
  const names = Array.from({ length:100 }, (_, index) => `owner/repository-${'long'.repeat(12)}-${index}`);
  const group = { id:'crypto', rows:names.map(row) };
  const edges = names.map(name => makeFlow(name, 'RSA', 'sign', 1));
  const graph = layoutRepositoryBundle([group], edges, names, 0, 0);
  assert.equal(graph.links.length, 100);
  assert.equal(graph.nodes.length, 101);
  const repoNodes = graph.nodes.filter(node => node.side === 'repo');
  assert.ok(graph.radius > layoutRepositoryBundle([group], edges, names.slice(0, 15), 0, 0).radius);
  for (const [index, node] of repoNodes.entries()) {
    assert.equal(node.labelLines.join(''), names[index]);
    assert.ok(node.labelLines.length > 1);
    const w = Math.max(...node.labelLines.map(line => line.length * 12)) * (node.anchor === 'end' ? -1 : 1);
    const h = node.labelLines.length * BUNDLE_LABEL_LINE / 2;
    const angle = node.rotation * Math.PI / 180;
    for (const [u,v] of [[w,h],[w,-h],[0,h],[0,-h]]) {
      const x = node.labelX + u * Math.cos(angle) - v * Math.sin(angle);
      const y = node.labelY + u * Math.sin(angle) + v * Math.cos(angle);
      const bounds = graph.exportBounds;
      assert.ok(x >= bounds.x && x <= bounds.x + bounds.width);
      assert.ok(y >= bounds.y && y <= bounds.y + bounds.height);
    }
  }
});

test('筛选后只渲染匹配仓库的边，窄屏和空关系使用有限坐标', () => {
  const page = layoutRepositoryBundle(groups, flows, ['a/one', 'b/other'], 390, 300);
  assert.equal(page.links.length, 3);
  assert.ok(page.width >= 390);
  for (const link of page.links) assert.doesNotMatch(link.path, /NaN|Infinity/);
  assert.deepEqual(linkedRepositoryNames(groups, flows.filter(flow => flow.algorithm === 'RSA')), ['a/one']);
  const filtered = layoutRepositoryBundle(groups, flows.filter(flow => flow.algorithm === 'RSA'), ['a/one', 'a/two', 'a/unlinked'], 390, 300);
  assert.deepEqual(filtered.nodes.map(node => node.key), ['a/one', 'RSA']);
  const empty = layoutRepositoryBundle(groups, [], ['b/other'], 390, 300);
  assert.equal(empty.links.length, 0);
  assert.equal(empty.nodes.length, 0);
  assert.equal(bundleStyle('unrecorded').label, '历史用途未记录');
});

test('二维列的上下边距对称，完整导出按类别分块并限制画幅比例', () => {
  const names = Array.from({ length:91 }, (_, index) => 'owner/project-' + index);
  const scope = [{ id:'category:test', label:'样本类别', rows:names.map(row) }];
  const edges = names.flatMap((repo, index) => [makeFlow(repo, 'Algorithm-' + index % 9, 'sign', 1, scope[0].id)]);
  const panels = repositoryOverviewPanels(scope, edges, { showUnlinked:true });
  assert.deepEqual(panels.slice(1).flatMap(panel => panel.graph.nodes.filter(n => n.side === 'repo').map(n => n.key)), names);
  for (const { graph } of panels) {
    assert.ok(graph.height / graph.width < 1);
    for (const side of ['category','repo','algorithm']) {
      const nodes = graph.nodes.filter(node => node.side === side);
      if (!nodes.length) continue;
      const top = Math.min(...nodes.map(node => node.y - node.height / 2));
      const bottom = Math.max(...nodes.map(node => node.y + node.height / 2));
      assert.ok(Math.abs(top + bottom - graph.height) < 1e-7);
    }
  }
  const svg = repositoryOverviewSheet(panels, { theme:{ getPropertyValue: () => '' }, stamp:'2026-11-24', evidenceLocation:() => null });
  const [,width,height] = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  assert.ok(width / height > .8 && width / height < 1.9);
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
