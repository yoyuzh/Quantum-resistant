import { algorithmColor } from './workbenchLayout.js';
import { wrapDiagramText } from './flowPacking.js';
import { categoryCounts, REPOSITORY_PAGE_SIZE } from './repositoryCategories.js';

const OVERVIEW_GAP = 24;
const LANES = { category: [0, .30], file: [.30, .66], algorithm: [.66, 1] };

function node(id, kind, label, width) {
  return { id, kind, label, width, total: 0, edges: [], lines: [], detailLines: [] };
}

export function repositoryGraph(rows, rankings, status, width, filter = '', scaleMax) {
  return buildGraph(rows.map(row => ({ row })), rankings, status, width, filter, scaleMax);
}

export function groupedRepositoryGraph(groups, expanded, page, rankings, status, width, filter, scaleMax) {
  const sources = groups.flatMap(group => {
    const open = group.id === expanded;
    const category = { group, expanded: open };
    if (!open) return [category];
    const members = group.rows.slice((page - 1) * REPOSITORY_PAGE_SIZE, page * REPOSITORY_PAGE_SIZE);
    return [category, ...members.map(row => ({ row, parent: group.id }))];
  });
  return buildGraph(sources, rankings, status, width, filter, scaleMax, expanded);
}

function buildGraph(sources, rankings, status, width, filter, scaleMax, expanded) {
  const compact = width < 590;
  const ctx = globalThis.document?.createElement('canvas').getContext('2d');
  const family = (ctx && getComputedStyle(document.documentElement).getPropertyValue('--font-sans').trim()) || 'sans-serif';
  function lines(text, available, font, weight, limit) {
    if (ctx) ctx.font = weight + ' ' + font + 'px ' + family;
    const measure = value => ctx ? ctx.measureText(value).width : Array.from(value).reduce((sum, char) =>
      sum + font * (/^[a-z0-9]$/.test(char) ? .68 : 1), 0);
    return wrapDiagramText(text, available, limit, font, measure);
  }
  const left = [], right = new Map(), links = [], unlinked = [];
  const grouped = expanded !== undefined;
  const unit = status === 'legacy' ? ' 种' : ' 项';
  const leftWidth = Math.min(214, grouped ? width*.36-12 : width*(compact ? .44 : .23));
  const categoryWidth = Math.min(200, width*.30-12);
  const rightWidth = Math.min(164, grouped ? width*.34-12 : width*(compact ? .30 : .19));
  for (const entry of sources) {
    const { row, group } = entry;
    const name = row?.repo.full_name ?? group.label;
    const source = Object.assign(node(group?.id ?? 'repo:' + name, group ? 'category' : 'file', name,
      group ? categoryWidth : leftWidth), entry);
    const totals = group && categoryCounts(group.rows, status);
    for (const ranking of rankings) {
      const algorithm = ranking.algorithm;
      if (filter && filter !== algorithm) continue;
      const value = row ? row.count(algorithm, status) : totals.get(algorithm);
      if (!(value > 0)) continue;
      source.total += value;
      if (entry.expanded) continue;
      if (!right.has(algorithm)) {
        const target = node('algorithm:' + algorithm, 'algorithm', algorithm, rightWidth);
        target.ranking = ranking;
        right.set(algorithm, target);
      }
      const target = right.get(algorithm);
      const edge = { id: JSON.stringify([source.id, algorithm]), source: source.id, sourceLabel: name, target: target.id,
        groupKey: target.id, value, status, algorithm, color: algorithmColor(algorithm) };
      source.edges.push(edge);
      target.edges.push(edge);
      links.push(edge);
      target.total += value;
    }
    if (group || source.total || !filter) left.push(source);
    if (row && !source.total) unlinked.push(row);
  }
  const descending = (a,b) => b.total-a.total || a.label.localeCompare(b.label);
  if (expanded === undefined) left.sort(descending);
  const targets = [...right.values()].sort(descending);
  const nodes = [...left, ...targets];
  const peak = scaleMax || Math.max(1, ...links.map(e => e.value));
  for (const edge of links) edge.band = strokeWidth(edge.value,peak,status);
  for (const n of nodes) {
    const repo = Boolean(n.row);
    n.fontSize = compact ? 13 : 14;
    n.padding = compact ? 5 : 8;
    const space = n.width - 2*n.padding - 2;
    const wrapTitle = title => lines(title, space, n.fontSize, 600, repo || n.group ? Infinity : 2);
    n.lines = wrapTitle(n.label);
    if (repo && n.lines.length > 1) {
      const slash = n.label.indexOf('/') + 1;
      n.lines = [...wrapTitle(n.label.slice(0, slash)), ...wrapTitle(n.label.slice(slash))];
    }
    const count = n.total || (repo ? n.row.count(rankings[0]?.algorithm, status) : 0);
    const description = n.group ? n.group.rows.length + ' 仓'
      : repo ? (count === null ? '无分组数据' : count + unit) + (n.row.repo.coverage?.partial ? ' · 部分' : '')
      : status === 'legacy' ? n.total + ' 仓' : n.total + ' 项';
    n.detailLines = lines(description, space - (n.group ? 12 : 0), 12.5, 400, 3);
    n.height = n.lines.length*22 + n.detailLines.length*20 + 10;
    n.radius = n.kind === 'algorithm' ? n.height/2 : 8;
    n.color = n.group ? 'var(--accent)' : repo ? '#627ec7' : algorithmColor(n.label);
  }
  const gap = compact ? 13 : 14;
  const extent = (col, spacing = gap) => col.reduce((h,n)=>h+n.height+spacing,0);
  const categories = left.filter(n => n.group);
  const repos = left.filter(n => n.row);
  const height = Math.max(270,extent(categories, OVERVIEW_GAP),extent(repos),extent(targets))+16;
  const graph = {width,height,nodes,links,unlinked,peak,gap,expanded,grouped,fontFamily:family};
  graph.home = arrangeNeighborhood(graph);
  const bearing = new Map(nodes.map(n=>[n.id,graph.home.get(n.id).y]));
  for(const n of nodes){
    const outgoing=n.kind!=='algorithm', other=outgoing?'target':'source';
    n.edges.sort((a,b)=>bearing.get(a[other])-bearing.get(b[other]));
    const total=n.edges.reduce((sum,e)=>sum+e.band+1.5,0);
    let used=0;
    for(const edge of n.edges){
      const offset=((used+(edge.band+1.5)/2)/total-.5)*Math.min(total,n.height-24);
      if(outgoing){edge.from={x:n.width/2,y:offset,inset:n.radius};}
      else{edge.to={x:-n.width/2,y:offset,inset:n.radius};}
      used+=edge.band+1.5;
    }
  }
  const category = categories.find(n => n.expanded);
  graph.branches = category ? repos.map((repo,i) => ({
    source: category.id,
    target: repo.id,
    from: { x: category.width/2, y: (category.height-22)*((i+.5)/repos.length-.5), inset: category.radius },
    to: { x: -repo.width/2, y: 0, inset: repo.radius },
  })) : [];
  return graph;
}

export function strokeWidth(count,maximum,status) {
  return status === 'legacy' ? 2 : 1 + 19*count/Math.max(1,maximum);
}

export function sideLimits(graph,n) {
  const pad=n.width/2+5;
  if (graph.grouped) {
    const [left,right] = LANES[n.kind];
    return [graph.width*left+pad, graph.width*right-pad];
  }
  return n.kind==='file' ? [pad,graph.width/2-pad] : [graph.width/2+pad,graph.width-pad];
}

export function arrangeNeighborhood(graph, selected = '') {
  const positions = new Map(), chosen = graph.nodes.find(n=>n.id===selected);
  const neighbors = new Set([selected]);
  for (const e of chosen?.edges || []) {neighbors.add(e.source);neighbors.add(e.target);}
  if (chosen?.expanded) {
    for (const n of graph.nodes) {
      if (n.parent !== chosen.id) continue;
      neighbors.add(n.id);
      for (const edge of n.edges) neighbors.add(edge.target);
    }
  }
  for (const branch of graph.branches || []) if (neighbors.has(branch.target)) neighbors.add(branch.source);
  for(const kind of ['category','file','algorithm']){
    const col=graph.nodes.filter(n=>n.kind===kind);
    if(!col.length) continue;
    const members=col.filter(n=>neighbors.has(n.id));
    const others=col.filter(n=>!neighbors.has(n.id));
    const columnHeight=col.reduce((sum,n)=>sum+n.height,0);
    const categoryColumn = kind === 'category';
    const reorder = chosen && !categoryColumn && !chosen.expanded;
    const gap=categoryColumn ? OVERVIEW_GAP : chosen ? 9 : col.length===1 ? graph.gap
      : Math.max(graph.gap,(graph.height-16-graph.gap-columnHeight)/(col.length-1));
    const extent=list=>list.reduce((sum,n)=>sum+n.height+gap,0);
    // Center the selected neighborhood vertically; keep its internal rank order.
    let before=0, above=0;
    if(reorder && members.length){
      const half=extent(others)/2;
      while(before<others.length && above+(others[before].height+gap)/2<=half) above+=others[before++].height+gap;
    }
    const ordered=reorder ? [...others.slice(0,before),...members,...others.slice(before)] : col;
    let y=(graph.height-extent(ordered)+gap)/2;
    if (categoryColumn) {
      const margin = (16+graph.gap)/2;
      const openIndex = col.findIndex(n=>n.expanded);
      const offset = openIndex < 0 ? 0 : extent(col.slice(0,openIndex)) + col[openIndex].height/2;
      y = openIndex < 0 ? margin : Math.max(margin,Math.min(graph.height/2-offset, 2*y-margin));
    }
    for(const [i,n] of ordered.entries()){
      const [lo,hi]=sideLimits(graph,n);
      const wave=.39+.21*Math.sin(i*1.33+.4)+.12*Math.cos(i*.68);
      const home = n.group ? .25 + wave / 4 : wave;
      const inward=chosen ? neighbors.has(n.id) ? .88+.05*Math.sin(i*.8) : .12 : home;
      positions.set(n.id,{x:kind==='algorithm'?hi-(hi-lo)*inward:lo+(hi-lo)*inward,y:y+n.height/2});
      y+=n.height+gap;
    }
  }
  return positions;
}

export function relationPath(a,b,edge) {
  const x=a.x+edge.from.x, y=a.y+edge.from.y, endX=b.x+edge.to.x, endY=b.y+edge.to.y;
  const bend=(endX-x)*.54;
  // The straight ends run under the filled nodes to meet the entire rounded outline.
  return `M${x-edge.from.inset},${y} H${x} C${x+bend},${y} ${endX-bend},${endY} ${endX},${endY} H${endX+edge.to.inset}`;
}
