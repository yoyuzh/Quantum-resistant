import { CubicBezierCurve3, Vector3 } from 'three';
import { strokeWidth } from '../utils/repositoryGraph.js';
import { algorithmColor } from '../utils/workbenchLayout.js';

const ATLAS = ['category', 'file', 'algorithm'];
const WORKBENCH = ['file', 'algorithm', 'reference'];
const colors = { category: '#469b8e', file: '#527bb8', algorithm: '#49a79b', reference: '#9675b6' };

function grid(index, count, columns, horizontal, vertical) {
  const row = Math.floor(index / columns);
  const rowSize = Math.min(columns, count - row * columns);
  return [
    (index % columns - (rowSize - 1) / 2) * horizontal,
    (Math.ceil(count / columns) - 1) * vertical / 2 - row * vertical,
  ];
}

function shape(node, atlas, peak) {
  if (node.kind === 'category') return [47, 47, 16];
  if (node.kind === 'reference') return [32, 35, 26];
  const weight = Math.log1p(node.total || 0) / Math.log1p(peak);
  if (node.kind === 'file') {
    const thickness = atlas ? 6 + 24 * weight : 15;
    return [44, 30, thickness];
  }
  const diameter = atlas ? 22 + 34 * weight : 35;
  return [diameter, diameter, diameter];
}

function atlasPoint(node, index, count, compact, columns) {
  if (node.kind === 'category') return grid(index, count, 2, compact ? 116 : 169, compact ? 65 : 100);
  if (node.kind === 'file') return grid(index, count, columns, compact ? 117 : 133, compact ? 77 : 102);
  if (count>15) return grid(index,count,columns,84,77);
  if (index === 0) return [0, 0];
  const angle = (index - 1) * 2 * Math.PI / Math.max(count - 1, 1) - Math.PI / 2;
  return [(compact ? 99 : 158) * Math.cos(angle), 98 * Math.sin(angle)];
}

export function layeredLayout(graph, variant, compact = false) {
  const atlas = variant === 'atlas';
  const depth = atlas ? 300 : 250;
  const source = graph.nodes;
  const peak = source.reduce((max, item) => Math.max(max, item.total || 0), 1);
  const layers = (atlas ? ATLAS : WORKBENCH).map((kind, index) => {
    const data = source.filter(node => node.kind === kind);
    if (!atlas) data.sort((a,b) => (a.y || 0) - (b.y || 0) || (a.x || 0) - (b.x || 0));
    const columns = atlas && kind==='file' ? Math.max(1,Math.min(compact?2:4,Math.ceil(data.length/2)))
      : Math.max(2, Math.ceil(Math.sqrt(data.length * 1.35)));
    let width = atlas ? compact ? 264 : 420 : Math.max(310, columns * 120 + 36);
    let height = atlas ? compact ? 250 : 323 : Math.max(215, Math.ceil(data.length / columns) * 83 + 44);
    if (atlas && graph.expanded && kind==='file') {
      if (!compact) width = Math.max(width,(columns-1)*133+120);
      height = Math.max(height,Math.ceil(data.length/columns)*(compact?77:102)+38);
    }
    if (atlas && kind==='algorithm' && data.length>15) {
      width = Math.max(width,columns*84+24);
      height = Math.max(height,Math.ceil(data.length/columns)*77+36);
    }
    return { kind, index, depth: (1 - index) * depth, width, height, data, columns };
  }).filter(layer => !atlas || layer.kind !== 'file' || Boolean(graph.expanded));
  const spacing = Math.max(...layers.map(layer => layer.width));
  const nodes = new Map();
  for (const layer of layers) {
    const spread = compact ? spacing * .10 : Math.max(atlas ? 218 : 175, spacing * .42);
    layer.center = new Vector3((layer.index - 1) * spread, 0, layer.depth);
    layer.data.forEach((node, index) => {
      const point = atlas ? atlasPoint(node, index, layer.data.length, compact, layer.columns)
        : grid(index, layer.data.length, layer.columns, 120, 83);
      const position = layer.center.clone().add(new Vector3(point[0], point[1], 0));
      const size = shape(node, atlas, peak);
      const tint = atlas && node.kind === 'algorithm' ? algorithmColor(node.label) : colors[node.kind];
      nodes.set(node.id, { ...node, position, size, tint, layer: layer.index });
    });
  }
  const branches = (graph.branches || []).map(edge => ({
    ...edge, id: 'branch:' + edge.target, branch: true, status: 'pending', color: '#28ad91',
  }));
  const links = [...graph.links, ...branches].flatMap(edge => {
    const from = nodes.get(edge.source), to = nodes.get(edge.target);
    if (!from || !to) return [];
    const band = edge.branch ? 1.5 : edge.band ?? strokeWidth(edge.value || 1, graph.peak || 10, edge.status);
    return [{ ...edge, from, to, band, curve: layeredCurve(from, to) }];
  });
  return { layers, nodes, links, peak };
}

export function layeredCurve(from, to) {
  const a = from.position.clone(), b = to.position.clone();
  const direction = Math.sign(b.z - a.z);
  a.z += (direction || 1) * from.size[2] * .44;
  b.z += (-direction || 1) * to.size[2] * .44;
  const middle = (a.z + b.z) / 2 + (direction ? 0 : 62);
  return new CubicBezierCurve3(a, new Vector3(a.x, a.y, middle), new Vector3(b.x, b.y, middle), b);
}

export function spatialFocus(layout, id) {
  const nodes = new Set(id ? [id] : []);
  const edges = new Set();
  if (!id) return { nodes, edges };
  const members = new Set(layout.links.filter(e => e.branch && e.source === id).map(e => e.target));
  for (const e of layout.links) if (e.source === id || e.target === id || members.has(e.source)) {
    edges.add(e.id);
    nodes.add(e.source);
    nodes.add(e.target);
  }
  for (const e of layout.links) if (e.branch && nodes.has(e.target)) {
    edges.add(e.id);
    nodes.add(e.source);
  }
  return { nodes, edges };
}
