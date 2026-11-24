import { wrapDiagramText } from './flowPacking.js';
import { algorithmColor } from './workbenchLayout.js';

const format = new Intl.NumberFormat('zh-CN');
const lanes = { category: [0, .30], repo: [.30, .66], algorithm: [.66, 1] };
const nodeWidths = { category: 200, repo: 214, algorithm: 164 };
const compactWidths = { category: 134, repo: 174, algorithm: 112 };
const padding = 16;
const spacing = 14;
const categoryGap = 24;
export const OVERVIEW_PAGE_SIZE = 14;
export const OVERVIEW_FONT_SIZE = 14;
export const OVERVIEW_LINE_HEIGHT = 22;
export const OVERVIEW_WIDTH_GUIDE = 'M2 5.3 C12 5.3 21 3 30 2 Q34 2 34 6 Q34 10 30 10 C21 9 12 6.7 2 6.7 Q.6 6 2 5.3Z';

function card(side, key, label, count, summary, width, measure) {
  const labelLines = wrapDiagramText(label, width - 32, Infinity, OVERVIEW_FONT_SIZE, measure);
  return {
    id: side === 'category' ? key : side + ':' + key,
    side, key, label, count, summary, labelLines, width,
    height: 30 + labelLines.length * OVERVIEW_LINE_HEIGHT,
    color: side === 'algorithm' ? algorithmColor(key) : side === 'category' ? 'var(--accent)' : '#627ec7',
  };
}

function sizeColumn(nodes, gap = spacing) {
  return nodes.reduce((total, node) => total + node.height, 0) + Math.max(0, nodes.length - 1) * gap;
}

export function overviewPath(link, positions) {
  const source = positions.get(link.source), target = positions.get(link.target);
  const x = source.x + link.from, y = source.y + link.start;
  const tx = target.x - link.to, ty = target.y + link.end;
  const bend = x + (tx - x) * .52;
  return `M${x - link.sourceInset},${y} H${x} C${bend},${y} ${bend},${ty} ${tx},${ty} H${tx + link.targetInset}`;
}

function distributePorts(links, nodes, from) {
  const groups = new Map();
  for (const link of links) {
    const key = from ? link.source : link.target;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(link);
  }
  for (const [key, edges] of groups) {
    const other = edge => nodes.get(from ? edge.target : edge.source).y;
    edges.sort((a, b) => other(a) - other(b));
    const total = edges.reduce((sum, edge) => sum + edge.width + 1.5, 0);
    const span = Math.min(total, nodes.get(key).height - 24);
    let used = 0;
    for (const edge of edges) {
      const width = edge.width + 1.5;
      edge[from ? 'start' : 'end'] = ((used + width / 2) / total - .5) * span;
      used += width;
    }
  }
}

export function overviewScale(flows) {
  const counts = new Map();
  let peak = 1;
  for (const flow of flows) {
    const key = JSON.stringify([flow.category, flow.algorithm]);
    const count = (counts.get(key) || 0) + flow.count;
    counts.set(key, count);
    peak = Math.max(peak, count);
  }
  return peak;
}

export function overviewBand(count, peak, legacy) {
  if (legacy) return 1.7;
  const fraction = Math.min(1, Math.log1p(Math.max(0, count) / 6) / Math.log1p(Math.max(1, peak) / 6));
  return 1.5 + 6.5 * fraction;
}
export const overviewRadius = node => node.side === 'algorithm' ? node.height / 2 : 8;

function portEdge(node, offset) {
  const radius = Math.min(overviewRadius(node), node.width / 2);
  const corner = Math.max(0, Math.abs(offset) - (node.height / 2 - radius));
  return node.width / 2 - radius + Math.sqrt(Math.max(0, radius ** 2 - corner ** 2));
}

export function overviewLane(graph, node) {
  const [start, end] = lanes[node.side];
  const inset = node.width / 2 + 5;
  return [graph.width * start + inset, graph.width * end - inset];
}

export function overviewFocus(graph, expanded, focus, selectedEdge) {
  const { repo, algorithm, category } = focus;
  const selected = repo ? 'repo:' + repo : algorithm ? 'algorithm:' + algorithm : '';
  const id = selected || expanded;
  const edges = new Set(), nodes = new Set([id]);
  for (const link of graph.links) {
    const active = selectedEdge ? link.id === selectedEdge
      : selected ? (repo ? link.repo === repo : link.algorithm === algorithm && (!category || link.category === category))
        : expanded && link.category === expanded;
    if (!active) continue;
    edges.add(link.id);
    nodes.add(link.source);
    nodes.add(link.target);
  }
  for (const branch of graph.branches) {
    if (!selected && !selectedEdge && branch.source === expanded) nodes.add(branch.target);
    if (nodes.has(branch.target)) nodes.add(branch.source);
  }
  return { id, selected, edges, nodes };
}

export function arrangeOverview(graph, focusId = '', neighbors = new Set()) {
  const positions = new Map();
  const chosen = graph.nodes.find(node => node.id === focusId);
  for (const side of Object.keys(lanes)) {
    const column = graph.nodes.filter(node => node.side === side);
    if (!column.length) continue;
    const category = side === 'category';
    const used = sizeColumn(column, 0);
    const gap = category ? categoryGap : chosen ? 9 : column.length === 1 ? spacing
      : Math.max(spacing, (graph.height - 2 * padding - used) / (column.length - 1));
    let ordered = column;
    if (chosen && !category && !chosen.expanded) {
      const members = column.filter(node => neighbors.has(node.id));
      const others = column.filter(node => !neighbors.has(node.id));
      const middle = sizeColumn(others, gap) / 2;
      let before = 0, above = 0;
      while (before < others.length && above + (others[before].height + gap) / 2 <= middle) {
        above += others[before++].height + gap;
      }
      ordered = [...others.slice(0, before), ...members, ...others.slice(before)];
    }
    let top = (graph.height - sizeColumn(ordered, gap)) / 2;
    for (const node of ordered) {
      const [lo, hi] = overviewLane(graph, node);
      const inward = chosen ? neighbors.has(node.id) ? .9 : .14 : .5;
      positions.set(node.id, { x: side === 'algorithm' ? hi - (hi - lo) * inward : lo + (hi - lo) * inward,
        y: top + node.height / 2 });
      top += node.height + gap;
    }
  }
  return positions;
}

// In the overview a closed category represents all its repositories. Opening a
// category replaces its aggregate links with the visible repositories' links.
export function layoutRepositoryOverview(groups, flows, { expanded, visibleNames, full = false, legacy = false,
  viewportWidth = 0, measure, peak = overviewScale(flows), showUnlinked = false, exportAspect = false } = {}) {
  const categories = [], repos = [], algorithms = new Map(), links = new Map();
  const compact = viewportWidth > 0 && viewportWidth < 640;
  const widths = compact ? compactWidths : nodeWidths;
  const visible = new Set(visibleNames);
  const byCategory = new Map();
  for (const flow of flows) {
    if (!byCategory.has(flow.category)) byCategory.set(flow.category, new Map());
    const members = byCategory.get(flow.category);
    if (!members.has(flow.repo)) members.set(flow.repo, []);
    members.get(flow.repo).push(flow);
  }
  const unit = legacy ? ' 条关联' : ' 项检出';
  for (const group of groups) {
    const members = byCategory.get(group.id) || new Map();
    const repositoryCount = showUnlinked ? group.rows.length : members.size;
    if (!repositoryCount) continue;
    const open = full || expanded === group.id;
    const category = card('category', group.id, group.label, repositoryCount, format.format(repositoryCount) + ' 仓', widths.category, measure);
    category.expanded = open;
    categories.push(category);
    for (const { repo: { full_name: name } } of group.rows) {
      const records = members.get(name) || [];
      if ((!showUnlinked && !records.length) || (open && !full && !visible.has(name))) continue;
      let source = category;
      if (open) {
        const count = records.reduce((sum, flow) => sum + flow.count, 0);
        const summary = count ? format.format(count) + unit : '无检出关系';
        source = card('repo', name, name, count, summary, widths.repo, measure);
        source.category = group.id;
        repos.push(source);
      }
      for (const flow of records) {
        const { algorithm, purpose, count } = flow;
        const target = 'algorithm:' + algorithm;
        const id = JSON.stringify([source.id, algorithm]);
        const link = links.get(id) || { id, source: source.id, target, category: group.id,
          repo: open ? name : undefined, algorithm, purpose: open ? purpose : undefined, count: 0 };
        if (link.purpose !== purpose) link.purpose = undefined;
        link.count += count;
        links.set(id, link);
        algorithms.set(algorithm, (algorithms.get(algorithm) || 0) + count);
      }
    }
  }
  const targets = [...algorithms].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => card('algorithm', name, name, count, format.format(count) + unit, widths.algorithm, measure));
  const height = Math.max(270, sizeColumn(categories, categoryGap), sizeColumn(repos), sizeColumn(targets)) + 2 * padding;
  const width = Math.max(compact ? 540 : 785, viewportWidth, exportAspect ? Math.ceil(height * 1.14) : 0);
  const nodes = [...categories, ...repos, ...targets];
  const graph = { width, height, nodes, peak };
  const home = arrangeOverview(graph);
  if (full) {
    const spans = new Map();
    for (const repo of repos) {
      const { y } = home.get(repo.id);
      const ends = spans.get(repo.category) || [y, y];
      ends[1] = y;
      spans.set(repo.category, ends);
    }
    for (const category of categories) {
      const [first, last] = spans.get(category.id);
      home.get(category.id).y = (first + last) / 2;
    }
  }
  for (const node of nodes) Object.assign(node, home.get(node.id));
  const byId = new Map(nodes.map(node => [node.id, node]));
  const relationLinks = [...links.values()];
  for (const link of relationLinks) link.width = overviewBand(link.count, peak, legacy);
  distributePorts(relationLinks, byId, true);
  distributePorts(relationLinks, byId, false);
  function attachPorts(link) {
    const source = byId.get(link.source), target = byId.get(link.target);
    link.from = portEdge(source, link.start);
    link.to = portEdge(target, link.end);
    link.sourceInset = link.targetInset = Math.max(1.4, link.width / 2 + 1);
    link.path = overviewPath(link, home);
  }
  for (const link of relationLinks) {
    attachPorts(link);
    link.color = byId.get(link.target).color;
    link.title = `${byId.get(link.source).label} → ${link.algorithm}，${format.format(link.count)}${unit}`;
  }
  const branches = repos.map(node => ({ source: node.category, target: node.id, repo: node.key,
    id: node.id, width: 1.45, start: 0, end: 0 }));
  distributePorts(branches, byId, true);
  branches.forEach(attachPorts);
  return { ...graph, home, links: relationLinks, branches, exportBounds: { x: 0, y: 0, width, height } };
}
