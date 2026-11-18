import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { repositoryAtlas } from '../src/utils/repositoryAtlas.js';
import { categoryScale, repositoryCategories } from '../src/utils/repositoryCategories.js';
import { arrangeNeighborhood, groupedRepositoryGraph, relationPath, repositoryGraph, sideLimits, strokeWidth } from '../src/utils/repositoryGraph.js';

const seed = JSON.parse(readFileSync(new URL('../repository-seed.json', import.meta.url)));
const atlas = repositoryAtlas(seed);

test('六类汇总无重复，展开按仓库拆分并保持全库线宽刻度', () => {
  const groups = repositoryCategories(atlas.rows);
  assert.deepEqual(groups.map(group => group.rows.length), [8, 7, 5, 5, 3, 2]);
  const status = 'confirmed';
  const peak = categoryScale(groups, status);
  const graph = (id, filter = '', data = groups) =>
    groupedRepositoryGraph(data, id, 1, atlas.rankings.confirmed, status, 900, filter, peak);
  const initial = graph('');
  const expanded = graph('category:identity');
  assert.equal(initial.links.length, 41);
  assert.equal(initial.nodes.filter(n => n.group).length, 6);
  assert.equal(initial.nodes.filter(n => n.row).length, 0);
  const repos = expanded.nodes.filter(n => n.row);
  assert.equal(repos.length, 7);
  assert.ok(repos.every(n => n.parent === 'category:identity' && n.lines.join('') === n.label));
  assert.equal(initial.branches.length, 0);
  assert.deepEqual(expanded.branches.map(e => [e.source,e.target]), repos.map(n => ['category:identity',n.id]));
  for (const width of [220,264,680,1440]) {
    const view = groupedRepositoryGraph(groups, 'category:identity', 1, atlas.rankings.confirmed, status, width, '', peak);
    const lanes = {category:[0,.30], file:[.30,.66], algorithm:[.66,1]};
    for (const focus of ['',view.expanded,'algorithm:RSA']) {
      const layout = focus ? arrangeNeighborhood(view, focus) : view.home;
      for (const n of view.nodes) {
        const {x,y} = layout.get(n.id), [left,right] = lanes[n.kind];
        assert.ok(x-n.width/2 >= width*left && x+n.width/2 <= width*right);
        assert.ok(y-n.height/2 >= 0 && y+n.height/2 <= view.height);
      }
    }
  }
  assert.equal(expanded.nodes.find(n => n.id === 'category:identity').edges.length, 0);
  assert.equal(initial.nodes.find(n => n.id === 'algorithm:RSA').total, expanded.nodes.find(n => n.id === 'algorithm:RSA').total);
  const summary = initial.links.find(e => e.source === 'category:identity' && e.algorithm === 'RSA');
  const expectedRsa = groups.find(group => group.id === 'category:identity').rows
    .flatMap(row => row.repo.algorithm_inventory.groups)
    .filter(group => group.algorithm === 'RSA' && group.status === status)
    .reduce((sum, group) => sum + group.count, 0);
  assert.equal(summary.value, expectedRsa);
  assert.equal(expanded.links.filter(e => e.source.startsWith('repo:') && e.algorithm === 'RSA').reduce((sum,e) => sum+e.value,0), expectedRsa);
  for (const edge of [...initial.links, ...expanded.links, ...graph('', 'RSA').links]) {
    assert.equal(edge.band, strokeWidth(edge.value, peak, status));
  }
});

test('待分类分页保留仓库，历史及未评估数据沿用原有计数', () => {
  const repos = Array.from({length:31}, (_, i) => ({full_name:'imported/repo-'+i, algorithms:['RSA','RSA']}));
  const batch = repositoryAtlas({repos});
  const groups = repositoryCategories(batch.rows);
  assert.equal(groups[0].label, '待分类');
  const graph = (id, page, status) => groupedRepositoryGraph(groups, id, page, batch.rankings[status], status, 260, '', 31);
  assert.equal(graph('',1,'legacy').links[0].value, 31);
  assert.equal(graph(groups[0].id,1,'legacy').nodes.filter(n=>n.row).length, 30);
  assert.equal(graph(groups[0].id,2,'legacy').links[0].source, 'repo:imported/repo-30');
  assert.equal(graph(groups[0].id,1,'confirmed').links.length, 0);
});

test('关系只来自实际检出，分组总数与全库清单一致', () => {
  const g = repositoryGraph(atlas.rows, atlas.rankings.confirmed, 'confirmed', 1000);
  const total = seed.repos.flatMap(r => r.algorithm_inventory.groups)
    .filter(group => group.status === 'confirmed').reduce((sum,group) => sum+group.count,0);
  assert.equal(g.links.reduce((sum,e) => sum+e.value,0), total);
  assert.equal(g.nodes.filter(n => n.row).length, 30);
  for (const edge of g.links) {
    const repo = g.nodes.find(n=>n.id===edge.source);
    assert.equal(edge.value,repo.row.count(edge.algorithm,'confirmed'));
    const target = g.nodes.find(n => n.id === edge.target);
    const start = g.home.get(repo.id);
    const end = g.home.get(target.id);
    const path = relationPath(start, end, edge);
    assert.ok(path.startsWith(`M${start.x + repo.width / 2 - repo.radius},${start.y + edge.from.y} H`));
    assert.ok(path.endsWith(`H${end.x - target.width / 2 + target.radius}`));
    assert.ok(Math.abs(edge.to.y) + edge.band / 2 < target.height / 2);
  }
});

test('窄屏及桌面节点分列，标签有空间，端口没有越界', () => {
  for (const width of [264,350,680,1100]) {
    const graph = repositoryGraph(atlas.rows,atlas.rankings.confirmed,'confirmed',width);
    for (const focus of ['', ...graph.nodes.map(n=>n.id)]) {
      const positions=focus ? arrangeNeighborhood(graph,focus) : graph.home;
      for (const n of graph.nodes) {
        if (n.row) assert.equal(n.lines.join(''), n.row.repo.full_name);
        const p=positions.get(n.id),[lo,hi]=sideLimits(graph,n);
        assert.ok(p.x>=lo && p.x<=hi && p.y-n.height/2>=0 && p.y+n.height/2<=graph.height);
        const peers=graph.nodes.filter(m=>m.kind===n.kind && m.id!==n.id);
        for(const peer of peers) assert.ok(Math.abs(p.y-positions.get(peer.id).y)>=(n.height+peer.height)/2+8);
      }
    }
  }
});

test('窄屏分类分行保留全名，避免只留一个尾字', () => {
  const groups = repositoryCategories(atlas.rows);
  const graph = groupedRepositoryGraph(groups, '', 1, atlas.rankings.confirmed, 'confirmed', 350, '');
  const categories = graph.nodes.filter(node => node.group);
  assert.ok(categories.some(node => node.lines.length === 2));
  for (const node of categories) {
    assert.equal(node.lines.join(''), node.label);
    if (node.lines.length === 2) assert.ok(node.lines[1].length >= 2);
  }
});

test('长仓库名在最窄图幅上仍保留完整 owner/repo', () => {
  const name = 'owner-' + 'w'.repeat(33) + '/repo-' + 'W'.repeat(95);
  const sample = repositoryAtlas({repos: [{...seed.repos[0], full_name: name}]});
  const graph = repositoryGraph(sample.rows, sample.rankings.confirmed, 'confirmed', 220);
  assert.equal(graph.nodes[0].lines.join(''), name);
});

test('区分历史检出、未评估和筛选后的关系', () => {
  const mixed = repositoryAtlas({repos:[{full_name:'old/repo',algorithms:['RSA']},...seed.repos]});
  assert.equal(repositoryGraph(mixed.rows,mixed.rankings.legacy,'legacy',900).links.length,1);
  assert.equal(repositoryGraph(mixed.rows,mixed.rankings.ai_assessed,'ai_assessed',900).links.length,0);
  const filtered = repositoryGraph(atlas.rows,atlas.rankings.confirmed,'confirmed',900,'RSA');
  assert.equal(filtered.nodes.filter(n=>n.kind==='algorithm').length,1);
  assert.equal(filtered.links.length,atlas.rankings.confirmed.find(r=>r.algorithm==='RSA').hits);
  const max=Math.max(...atlas.rows.flatMap(r=>r.algorithms.map(a=>r.count(a,'confirmed'))));
  const all=repositoryGraph(atlas.rows,atlas.rankings.confirmed,'confirmed',900,'',max);
  const only=repositoryGraph(atlas.rows,atlas.rankings.confirmed,'confirmed',900,'RSA',max);
  for(const e of only.links)assert.equal(e.band,all.links.find(l=>l.id===e.id).band);
  assert.equal(strokeWidth(4,max,'confirmed')-1,2*(strokeWidth(2,max,'confirmed')-1));
});
