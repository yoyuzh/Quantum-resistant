import { graphRecords } from './workbenchRecords.js';
import { placeGraph } from './workbenchLayout.js';
export { graphRecords } from './workbenchRecords.js';

export function layoutWorkbench(data, mode, filter = {}) {
  return placeGraph(graphRecords(data, mode, filter));
}

export function visibleGraph(graph, view, width, height) {
  const box = { x: -view.x / view.scale, y: -view.y / view.scale, w: width / view.scale, h: height / view.scale };
  const nodes = graph.nodes.filter(n => n.x + n.width >= box.x && n.x <= box.x + box.w && n.y + n.height >= box.y && n.y <= box.y + box.h);
  const ids = new Set(nodes.map(n => n.id));
  const links = graph.links.filter(l => ids.has(l.source) || ids.has(l.target));
  return { nodes, links, box };
}
