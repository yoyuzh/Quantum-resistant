const indexes = new WeakMap();
function indexGraph(graph) {
  if (indexes.has(graph)) return indexes.get(graph);
  const nodes = new Map(graph.nodes.map(n => [n.id, n])), edges = new Map(), groups = new Map(), adjacent = new Map();
  for (const edge of graph.links) {
    edges.set(edge.id, edge);
    if (!groups.has(edge.groupKey)) groups.set(edge.groupKey, []);
    groups.get(edge.groupKey).push(edge);
    for (const id of [edge.source, edge.target]) {
      if (!adjacent.has(id)) adjacent.set(id, []);
      adjacent.get(id).push(edge);
    }
  }
  const index = { nodes, edges, groups, adjacent };
  indexes.set(graph, index);
  return index;
}
export function highlightedRelations(graph, ids) {
  const index = indexGraph(graph), edges = new Set(), nodes = new Set(ids.filter(id => index.nodes.has(id)));
  function add(edge) {
    edges.add(edge.id); nodes.add(edge.source); nodes.add(edge.target);
  }
  function expand(edge) {
    add(edge);
    const group = index.groups.get(edge.groupKey) || [];
    if (graph.mode === 'calls') { group.forEach(add); return; }
    // A left edge selects only its own input. A right edge collects its inputs.
    if (index.nodes.get(edge.target)?.kind === 'algorithm') {
      group.filter(e => e.source === edge.target).forEach(add);
    } else if (index.nodes.get(edge.source)?.kind === 'algorithm') {
      group.filter(e => e.target === edge.source).forEach(add);
    }
  }
  for (const id of ids) {
    const edge = index.edges.get(id);
    if (edge) expand(edge);
    else (index.adjacent.get(id) || []).forEach(expand);
  }
  return { dim: ids.length ? 1 : 0, edges: new Map([...edges].map(id => [id, 1])), nodes: new Map([...nodes].map(id => [id, 1])) };
}
export function sceneFocus(graph, scene, hover, selected) {
  const node = scene.nodes.find(n => n.id === hover), edge = scene.edges.find(e => e.id === hover);
  const ids = node?.members || edge?.members || (selected ? [selected] : []);
  return highlightedRelations(graph, ids);
}
function blendMap(from, to, progress) {
  const values = new Map();
  for (const id of new Set([...from.keys(), ...to.keys()])) {
    const value = (from.get(id) || 0) * (1 - progress) + (to.get(id) || 0) * progress;
    if (value > .0001) values.set(id, value);
  }
  return values;
}
export function createFocusMotion(duration = 160) {
  const empty = () => ({ dim: 0, edges: new Map(), nodes: new Map() });
  let from = empty(), to = empty(), start = -Infinity;
  function sample(now, reduced = false) {
    const t = reduced ? 1 : Math.max(0, Math.min(1, (now - start) / duration));
    const p = t * t * (3 - 2 * t);
    if (t === 1) return { ...to, running: false };
    return { dim: from.dim * (1 - p) + to.dim * p, edges: blendMap(from.edges, to.edges, p),
      nodes: blendMap(from.nodes, to.nodes, p), running: true };
  }
  return { sample, set(target, now) { from = sample(now); to = target; start = now; } };
}
