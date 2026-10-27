import { visibleGraph } from './workbenchGraph.js';

export const MIN_ZOOM = .000001;
export const MAX_ZOOM = 16;
export const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
export function fitGraph(graph, size, widthOnly = false) {
  const availableHeight = Math.max(100, size.height - (size.bottomInset ?? 88));
  const scale = clamp(Math.min((size.width - 64) / Math.max(1, graph.width), widthOnly ? 1.3 : availableHeight / Math.max(1, graph.height)), MIN_ZOOM, 1.3);
  return { scale, x: (size.width - graph.width * scale) / 2,
    y: widthOnly ? 40 : 28 + (availableHeight - graph.height * scale) / 2 };
}
export function zoomView(view, factor, x, y) {
  const scale = clamp(view.scale * factor, MIN_ZOOM, MAX_ZOOM), ratio = scale / view.scale;
  return { scale, x: x - (x - view.x) * ratio, y: y - (y - view.y) * ratio };
}
export function nearestEdge(edges, point, tolerance = 7) {
  let best, distance = tolerance;
  for (const edge of edges) for (let i = 1; i < edge.points.length; i++) {
    const a = edge.points[i - 1], b = edge.points[i], dx = b[0] - a[0], dy = b[1] - a[1];
    const t = clamp(((point.x - a[0]) * dx + (point.y - a[1]) * dy) / (dx * dx + dy * dy || 1), 0, 1);
    const d = Math.hypot(point.x - a[0] - t * dx, point.y - a[1] - t * dy);
    if (d < distance) { best = edge; distance = d; }
  }
  return best;
}
export function roundedCommands(points, radius = 10) {
  const commands = [['M', ...points[0]]];
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i - 1], b = points[i], c = points[i + 1];
    const before = Math.hypot(b[0] - a[0], b[1] - a[1]), after = Math.hypot(c[0] - b[0], c[1] - b[1]);
    const r = Math.min(radius, before / 2, after / 2);
    commands.push(['L', b[0] - (b[0] - a[0]) / (before || 1) * r, b[1] - (b[1] - a[1]) / (before || 1) * r]);
    commands.push(['Q', ...b, b[0] + (c[0] - b[0]) / (after || 1) * r, b[1] + (c[1] - b[1]) / (after || 1) * r]);
  }
  commands.push(['L', ...points.at(-1)]);
  return commands;
}
export function graphScene(graph, view, size) {
  const visible = visibleGraph(graph, view, size.width, size.height), low = view.scale < .48;
  const screen = point => [point[0] * view.scale + view.x, point[1] * view.scale + view.y];
  const nodes = [], mapping = new Map(), groups = new Map();
  for (const node of visible.nodes) {
    const [x, y] = screen([node.x, node.y]);
    if (!low) {
      nodes.push({ ...node, x, y, width: node.width * view.scale, height: node.height * view.scale,
        scale: view.scale, members: [node.id] });
      continue;
    }
    const column = ['file', 'algorithm', 'reference'].indexOf(node.kind), row = Math.floor(y / 64);
    const key = column + ':' + row;
    if (!groups.has(key)) {
      const span = Math.min(720, size.width - 48), width = Math.max(86, Math.min(156, span / 3 - 18));
      groups.set(key, { ...node, id: 'group:' + key, x: size.width / 2 + (column - 1) * span / 3 - width / 2,
        y: row * 64, width, height: 52, scale: 1, members: [], aggregated: true, horizontal: false, badge: '', detailLines: [] });
    }
    groups.get(key).members.push(node.id);
    mapping.set(node.id, groups.get(key));
  }
  for (const node of groups.values()) {
    node.lines = [node.members.length + ' 项', {file:'证据位置',algorithm:'算法操作',reference:graph.mode==='calls'?'返回位置':'迁移参考'}[node.kind]];
    node.watermark = ''; nodes.push(node);
  }
  const edges = new Map();
  for (const link of visible.links) {
    let points = (link.points || [link.a, link.b]).map(screen);
    const a = mapping.get(link.source), b = mapping.get(link.target);
    if (low) {
      if (!a || !b || a.id === b.id) continue;
      const start = [a.x + a.width, a.y + a.height / 2], end = [b.x, b.y + b.height / 2];
      const lane = (start[0] + end[0]) / 2;
      points = [start, [lane, start[1]], [lane, end[1]], end];
    }
    const key = low ? [a.id, b.id, link.color, link.status].join(':') : visible.links.length > 1400
      ? [Math.round(points[0][1] / 18), Math.round(points.at(-1)[1] / 18), link.color, link.status].join(':') : link.id;
    if (!edges.has(key)) edges.set(key, { ...link, points, members: [], groupKeys: new Set(), count: 0 });
    const edge = edges.get(key);
    edge.members.push(link.id); edge.groupKeys.add(link.groupKey); edge.count += link.value || 1;
  }
  return { nodes, edges: [...edges.values()], visibleNodes: visible.nodes.length, visibleEdges: visible.links.length, aggregated: low };
}
