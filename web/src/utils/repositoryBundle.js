import { hierarchy } from 'd3-hierarchy';
import { purposeName } from './repositoryAtlas.js';

export const BUNDLE_PAGE_SIZE = 48;
export const bundlePurposeLabel = purpose => purpose === 'unrecorded' ? '历史用途未记录' : purposeName({ purpose });

export function linkedRepositoryNames(groups, flows) {
  const linked = new Set(flows.map(flow => flow.repo));
  return groups.flatMap(group => group.rows.map(row => row.repo.full_name).filter(name => linked.has(name)));
}

export function matchesBundleFocus(flow, focus) {
  return (!focus.category || flow.category === focus.category) &&
    (!focus.repo || flow.repo === focus.repo) &&
    (!focus.algorithm || flow.algorithm === focus.algorithm) &&
    (!focus.purpose || flow.purpose === focus.purpose);
}

export function repositoryBundleFlows(categories, status, algorithm = '') {
  const flows = [];
  for (const category of categories) {
    for (const row of category.rows) {
      const groups = status === 'legacy' && row.legacy
        ? row.algorithms.map(value => ({ algorithm: value, purpose: 'unrecorded', count: 1, status }))
        : row.groups;
      const grouped = new Map();
      for (const group of groups) {
        if (group.status !== status || (algorithm && group.algorithm !== algorithm) || !(group.count > 0)) continue;
        const key = JSON.stringify([group.algorithm, group.purpose]);
        const flow = grouped.get(key) || { category: category.id, repo: row.repo.full_name,
          algorithm: group.algorithm, purpose: group.purpose, count: 0 };
        flow.count += group.count;
        grouped.set(key, flow);
      }
      flows.push(...grouped.values());
    }
  }
  return flows;
}

const styles = {
  key_generation: ['#087e71', ''],
  key_import: ['#4268bd', '8 3'],
  key_material: ['#8b5796', '3 3'],
  key_exchange: ['#327387', '9 3 2 3'],
  configuration: ['#a16a16', '2 4'],
  sign: ['#a94d70', '13 4'],
  verify: ['#557d42', '6 2 2 2'],
  encrypt: ['#a55d46', '11 3 3 3'],
  decrypt: ['#546597', '3 2 3 6'],
  unknown: ['var(--text-secondary)', '1 5'],
  unrecorded: ['var(--text-secondary)', '5 6'],
};
const purposeOrder = Object.keys(styles);
export const BUNDLE_LABEL_SIZE = 12;
export const BUNDLE_LABEL_LINE = 15;
const labelGap = 4;

function labelBlock(name, measure) {
  const lines = [''];
  for (const char of name) {
    const index = lines.length - 1;
    if (lines[index] && measure(lines[index] + char) > 274) lines.push(char);
    else lines[index] += char;
  }
  return { lines, width:Math.ceil(Math.max(...lines.map(measure))), height:lines.length * BUNDLE_LABEL_LINE };
}

export function bundleStyle(purpose) {
  const [color, dash] = styles[purpose] || styles.unknown;
  return { color, dash, label: bundlePurposeLabel(purpose) };
}

const middle = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
function smoothPath(points) {
  const [first, ...rest] = points;
  return rest.slice(0, -1).reduce((path, point, index) => {
    const next = middle(point, rest[index + 1]);
    return path + `Q${point.x},${point.y} ${next.x},${next.y}`;
  }, `M${first.x},${first.y}`) + `L${rest.at(-1).x},${rest.at(-1).y}`;
}

export function layoutRepositoryBundle(groups, flows, names, viewportWidth, viewportHeight, measure = text => [...text].length * BUNDLE_LABEL_SIZE) {
  const requested = new Set(names);
  const selectedNames = new Set(linkedRepositoryNames(groups, flows).filter(name => requested.has(name)));
  const active = flows.filter(flow => selectedNames.has(flow.repo));
  const algorithms = [...new Set(active.map(flow => flow.algorithm))].sort();
  const labels = [Array.from(selectedNames), algorithms].map(keys => new Map(keys.map(name => [name, labelBlock(name, measure)])));
  const columnWidths = labels.map(column => Math.max(24, ...[...column.values()].map(block => block.width)));
  const columnHeights = labels.map(column => [...column.values()].reduce((sum, block) => sum + block.height + labelGap, 0));
  const arcHeight = 1.72;
  const naturalRadius = Math.max(160, Math.max(...columnHeights) / arcHeight);
  const width = Math.max(650, viewportWidth, columnWidths[0] + columnWidths[1] + 56 + 2 * naturalRadius);
  const radius = Math.min(Math.max(naturalRadius, (viewportHeight - 36) / 2), (width - columnWidths[0] - columnWidths[1] - 56) / 2);
  const height = Math.max(viewportHeight, 2 * radius + 36, ...columnHeights.map(h => h + 36));
  const center = { x:(width + columnWidths[0] - columnWidths[1]) / 2, y:height / 2 };
  let leftEdge = center.x - radius, rightEdge = center.x + radius;
  const ringPoint = (angle, depth = 1) => ({
    x:center.x + radius * depth * Math.cos(angle), y:center.y + radius * depth * Math.sin(angle),
  });
  const tree = hierarchy({ children: [
    { side: 'repo', children: groups.map(group => ({
      children: group.rows.filter(row => selectedNames.has(row.repo.full_name)).map(row => ({
        id: 'repo:' + row.repo.full_name, key: row.repo.full_name, side: 'repo', category: group.id,
      })),
    })).filter(group => group.children.length) },
    { side: 'algorithm', children: algorithms.map(algorithm => ({
      id: 'algorithm:' + algorithm, key: algorithm, side: 'algorithm',
    })) },
  ] });
  const endpoints = new Map();
  for (const branch of tree.children) {
    const left = branch.data.side === 'repo';
    const leaves = branch.leaves().filter(leaf => leaf.data.id);
    const column = left ? 0 : 1;
    const extent = columnHeights[column] - labelGap;
    const extra = leaves.length > 1 ? Math.max(0, radius * arcHeight - extent) / (leaves.length - 1) : 0;
    let top = center.y - (extent + Math.max(0, leaves.length - 1) * extra) / 2;
    for (const leaf of leaves) {
      leaf.block = labels[column].get(leaf.data.key);
      leaf.labelY = top + leaf.block.height / 2;
      const dy = leaf.labelY - center.y;
      const angle = Math.asin(dy / radius);
      leaf.angle = left ? Math.PI - angle : angle;
      leaf.point = ringPoint(leaf.angle);
      const closest = Math.max(0, Math.abs(dy) - leaf.block.height / 2);
      const outside = Math.sqrt(radius ** 2 - closest ** 2) + 13;
      leaf.labelX = center.x + (left ? -outside : outside);
      if (left) leftEdge = Math.min(leftEdge, leaf.labelX - leaf.block.width);
      else rightEdge = Math.max(rightEdge, leaf.labelX + leaf.block.width);
      top += leaf.block.height + labelGap + extra;
      endpoints.set(leaf.data.id, leaf);
    }
    branch.eachAfter(node => {
      if (!node.children) return;
      node.angle = node.children.reduce((total, child) => total + child.angle, 0) / node.children.length;
      node.point = ringPoint(node.angle, node.depth === 1 ? .21 : .62);
    });
  }
  tree.point = center;
  const counts = new Map();
  const links = active.map(flow => {
    const source = endpoints.get('repo:' + flow.repo);
    const target = endpoints.get('algorithm:' + flow.algorithm);
    for (const end of [source, target]) counts.set(end.data.id, (counts.get(end.data.id) || 0) + flow.count);
    // Adjacent purposes share a hierarchical route, with a small offset at the central junction.
    const lane = purposeOrder.indexOf(flow.purpose);
    const route = source.path(target);
    const bundling = .68;
    const points = route.map((node, index) => {
      // Keep part of the direct route so the bundles can be followed across the center.
      const t = index / (route.length - 1);
      const offset = node === tree && lane >= 0 ? (lane - 5) * Math.min(5, radius / 48) : 0;
      return {
        x: bundling * node.point.x + (1 - bundling) * (source.point.x + t * (target.point.x - source.point.x)),
        y: bundling * node.point.y + (1 - bundling) * (source.point.y + t * (target.point.y - source.point.y)) + offset,
      };
    });
    return { ...flow, id: JSON.stringify([flow.repo, flow.algorithm, flow.purpose]), path: smoothPath(points),
      width: Math.min(5.5, 1 + Math.log2(1 + flow.count) * .43), ...bundleStyle(flow.purpose) };
  });
  const nodes = [...endpoints.values()].map(leaf => ({
    ...leaf.data, ...leaf.point, labelY:leaf.labelY, labelX:leaf.labelX, labelLines:leaf.block.lines,
    count:counts.get(leaf.data.id) || 0,
  }));
  const exportBounds = { x:leftEdge - 12, y:center.y - radius - 16,
    width:rightEdge - leftEdge + 24, height:2 * radius + 32 };
  return { width, height, center, radius, exportBounds, nodes, links };
}
