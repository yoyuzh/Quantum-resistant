import { sankey } from 'd3-sankey';
import { wrapDiagramText } from './flowPacking.js';

export const graphColors = ['#16877f', '#627ec7', '#9a6dc1', '#ac8128', '#4e916b', '#be6d5b', '#488faa', '#ac648a'];
const known = ['DH', 'RSA', 'DSA', 'ECC', 'ECDH', 'ECDSA', 'X25519', 'Ed25519'];
export function algorithmColor(value = '') {
  const index = known.indexOf(value);
  return graphColors[index < 0 ? [...value].reduce((n, c) => n + c.charCodeAt(0), 0) % graphColors.length : index];
}
function sizeNode(node, mode) {
  const filename = node.label.split(/[\\/]/).at(-1);
  node.title = mode === 'calls' && node.role === 'operation' ? node.algorithm + (node.api?' · '+node.api.split('.').at(-1):'') : node.kind === 'file' ? filename : node.label;
  node.badge = mode === 'calls' ? node.kindLabel + (node.status === 'ai_assessed' ? ' · AI研判' : node.status === 'pending' ? ' · 证据不足' : '') : '';
  const status = node.status === 'ai_assessed' ? 'AI研判 · ' : node.status === 'pending' ? '证据不足 · ' : '';
  node.description = mode === 'calls' && node.role === 'operation'
    ? [filename + ' · 第 ' + node.line + ' 行', node.purpose].filter(Boolean).join(' · ')
    : status + (node.detail || '');
  node.inlineBadge=mode==='calls';
  if(node.inlineBadge)node.description=node.badge+' · '+node.description;
  const max = node.kind === 'algorithm' ? (mode === 'calls' ? 340 : 250) : node.kind === 'reference' ? 370 : 310;
  const estimate = [...node.title].reduce((n, c) => n + (/[^\u0000-\u00ff]/.test(c) ? 15 : 9.4), 0);
  node.width = Math.min(max, Math.max(mode==='calls' && node.role==='operation'?340:node.kind==='algorithm'?156:210, estimate+32));
  node.horizontal=mode==='migration' && node.kind==='algorithm';
  if(node.horizontal)node.width=250;
  node.lines = wrapDiagramText(node.title, node.width - 32, 4, 15);
  node.detailLines = wrapDiagramText(node.description, node.horizontal?130:node.width - 32, mode === 'calls' ? 4 : 4, 13);
  node.height = 18 + node.lines.length * 20 + (node.description ? 6 + node.detailLines.length * 17 : 0) + (node.badge && !node.inlineBadge ? 22 : 0);
  if(node.horizontal)node.height=Math.max(48,16+node.detailLines.length*17);
  node.watermark = node.kind === 'algorithm' ? node.algorithm || node.title : '';
}
function columnPositions(graph) {
  const kinds = ['file', 'algorithm', 'reference'];
  const columns = kinds.map(kind => graph.nodes.filter(n => n.kind === kind));
  const heights = columns.map(nodes => nodes.reduce((n, item) => n + item.height + 12, 0));
  const height = Math.max(180, ...heights) + 64;
  let left = 32;
  graph.columns = [];
  columns.forEach((nodes, index) => {
    if (!nodes.length) return;
    const width = nodes.reduce((max,n)=>Math.max(max,n.width),0);
    let top = (height - heights[index]) / 2;
    for (const node of nodes) { node.x = left; node.y = top; top += node.height + 12; }
    graph.columns.push({ x: left, width, title: ['文件与发现', '算法与用途', '迁移参考'][index] });
    left += width + 180;
  });
  return { width: left - 148, height };
}
function callPositions(graph) {
  const groups = new Map();
  for (const node of graph.nodes) {
    if (!groups.has(node.callId)) groups.set(node.callId, []);
    groups.get(node.callId).push(node);
  }
  const widths = ['file', 'algorithm', 'reference'].map(kind => graph.nodes.reduce((max,n)=>n.kind===kind?Math.max(max,n.width):max,180));
  const xs = [32, 32 + widths[0] + 160, 32 + widths[0] + widths[1] + 320];
  let top = 52, width = 0;
  for (const nodes of groups.values()) {
    const bottoms = [top, top, top];
    for (const node of nodes) {
      const column = ['file', 'algorithm', 'reference'].indexOf(node.kind);
      node.x = xs[column]; node.y = bottoms[column];
      bottoms[column] += node.height + 16;
      width = Math.max(width, node.x + node.width + 32);
    }
    top = Math.max(...bottoms) + 12;
  }
  graph.columns = xs.map((x, i) => ({ x, width: widths[i], title: ['导入、调用或参数来源', '密码操作或定义', '返回或关联位置'][i] }))
    .filter((_, i) => graph.nodes.some(n => ['file', 'algorithm', 'reference'][i] === n.kind));
  return { width, height: Math.max(220, top) };
}
export function placeGraph(graph) {
  if (!graph.nodes.length) return { ...graph, width: 800, height: 500, columns: [] };
  if (graph.mode === 'migration' && graph.links.length) {
    const order = sankey().nodeId(n => n.id).nodeWidth(1).nodePadding(12).iterations(4).extent([[0, 0], [1000, 1000]])({
      nodes: graph.nodes.map(n => ({ ...n })), links: graph.links.map(l => ({ ...l })),
    });
    const ranks = new Map(order.nodes.map(n => [n.id, n.y0]));
    graph.nodes.sort((a, b) => ranks.get(a.id) - ranks.get(b.id));
  }
  graph.nodes.forEach(n => sizeNode(n, graph.mode));
  const bounds = graph.mode === 'calls' ? callPositions(graph) : columnPositions(graph);
  const nodes = new Map(graph.nodes.map(n => [n.id, n]));
  graph.links = graph.links.map((link, i) => {
    const a = nodes.get(link.source), b = nodes.get(link.target);
    const algorithmNode = a.kind === 'algorithm' ? a : b.kind === 'algorithm' ? b : null;
    return { ...link, id: 'edge-' + i, groupKey: link.groupKey || algorithmNode?.id || link.source,
      color: algorithmColor(link.algorithm || algorithmNode?.algorithm), a: [a.x + a.width, a.y + a.height / 2], b: [b.x, b.y + b.height / 2] };
  });
  const ports = new Map();
  for (const link of graph.links) {
    const a = nodes.get(link.source), b = nodes.get(link.target);
    const sameColumn = a.x === b.x;
    link.targetSide = sameColumn ? 'right' : b.x < a.x ? 'right' : 'left';
    link.sourceSide = b.x < a.x ? 'left' : 'right';
    for (const [id, side, end] of [[link.source, link.sourceSide, 'a'], [link.target, link.targetSide, 'b']]) {
      const key = JSON.stringify([id, side]);
      if (!ports.has(key)) ports.set(key, { node: nodes.get(id), side, links: [] });
      ports.get(key).links.push({ link, end });
    }
  }
  for (const { node, side, links } of ports.values()) {
    links.sort((a, b) => nodes.get(a.end === 'a' ? a.link.target : a.link.source).y - nodes.get(b.end === 'a' ? b.link.target : b.link.source).y);
    links.forEach(({ link, end }, i) => { link[end] = [node.x + (side === 'right' ? node.width : 0), node.y + 12 + (node.height - 24) * (i + 1) / (links.length + 1)]; });
  }
  const callTops=new Map();
  for(const node of graph.nodes)callTops.set(node.callId,Math.min(callTops.get(node.callId) ?? Infinity,node.y));
  const columnFor=node=>graph.columns.find(column=>column.x===node.x);
  graph.links.forEach((link, i) => {
    const a = nodes.get(link.source), b = nodes.get(link.target);
    const ac=columnFor(a),bc=columnFor(b);
    if (a.x === b.x) {
      const lane = ac.x + ac.width + 22 + (i % 5) * 12;
      link.points = [link.a, [lane, link.a[1]], [lane, link.b[1]], link.b];
    } else if(Math.abs(graph.columns.indexOf(ac)-graph.columns.indexOf(bc))>1) {
      const left=ac.x+ac.width+24,right=bc.x-24,top=(callTops.get(a.callId) || 52)-18;
      link.points=[link.a,[left,link.a[1]],[left,top],[right,top],[right,link.b[1]],link.b];
    } else {
      const min = a.x < b.x ? ac.x+ac.width : bc.x+bc.width;
      const max = a.x < b.x ? bc.x : ac.x;
      const lane = min + 20 + (max - min - 40) * (.14 + (i % 7) * .12);
      link.points = [link.a, [lane, link.a[1]], [lane, link.b[1]], link.b];
    }
  });
  for(const link of graph.links)for(const point of link.points)bounds.width=Math.max(bounds.width,point[0]+32);
  return { ...graph, ...bounds };
}
