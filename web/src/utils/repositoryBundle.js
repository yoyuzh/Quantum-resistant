import { hierarchy } from 'd3-hierarchy';
import { purposeName } from './repositoryAtlas.js';

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
  const spans = labels.map(column => [...column.values()].reduce((sum, block) => sum + block.height + labelGap, 0));
  const total = spans[0] + spans[1];
  const gap = total ? Math.min(28, .75 * total / (selectedNames.size + algorithms.length)) : 0;
  const radians = 2 * Math.PI / Math.max(1, total + 2 * gap);
  const radius = Math.max(165, 1.07 / radians, Math.min(viewportWidth, viewportHeight) / 3.15);
  const center = { x:0, y:0 };
  let left = -radius, right = radius, top = -radius, bottom = radius;
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
    const repo = branch.data.side === 'repo';
    const leaves = branch.leaves().filter(leaf => leaf.data.id);
    const column = repo ? 0 : 1;
    let start = (repo ? spans[1] / 2 + gap : -spans[1] / 2) * radians;
    for (const leaf of leaves) {
      leaf.block = labels[column].get(leaf.data.key);
      const step = (leaf.block.height + labelGap) * radians;
      leaf.angle = start + step / 2;
      start += step;
      leaf.point = ringPoint(leaf.angle);
      leaf.anchor = ringPoint(leaf.angle, 1 + 13 / radius);
      const cos = Math.cos(leaf.angle), sin = Math.sin(leaf.angle);
      leaf.flipped = cos < 0;
      for (const length of [0, leaf.block.width + 4]) {
        for (const offset of [-leaf.block.height / 2, leaf.block.height / 2]) {
          const x = leaf.anchor.x + length * cos - offset * sin;
          const y = leaf.anchor.y + length * sin + offset * cos;
          left = Math.min(left,x); right = Math.max(right,x);
          top = Math.min(top,y); bottom = Math.max(bottom,y);
        }
      }
      endpoints.set(leaf.data.id, leaf);
    }
    branch.eachAfter(node => {
      if (!node.children) return;
      node.angle = node.children.reduce((total, child) => total + child.angle, 0) / node.children.length;
      node.point = ringPoint(node.angle, node.depth === 1 ? .21 : .62);
    });
  }
  const inset = 18;
  const width = Math.max(viewportWidth, right - left + 2 * inset);
  const height = Math.max(viewportHeight, bottom - top + 2 * inset);
  center.x = (width - left - right) / 2;
  center.y = (height - top - bottom) / 2;
  tree.each(node => {
    if (node.point) node.point = { x:node.point.x + center.x, y:node.point.y + center.y };
  });
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
    return { ...flow, id: JSON.stringify([flow.repo, flow.algorithm, flow.purpose]), source: source.data.id,
      target: target.data.id, path: smoothPath(points),
      width: Math.min(5.5, 1 + Math.log2(1 + flow.count) * .43), ...bundleStyle(flow.purpose) };
  });
  const nodes = [...endpoints.values()].map(leaf => ({
    ...leaf.data, ...leaf.point, labelX:leaf.anchor.x + center.x, labelY:leaf.anchor.y + center.y,
    anchor:leaf.flipped ? 'end' : 'start', rotation:(leaf.angle * 180 / Math.PI + (leaf.flipped ? 180 : 0)) % 360,
    labelLines:leaf.block.lines,
    count:counts.get(leaf.data.id) || 0,
  }));
  const exportBounds = { x:center.x + left - inset, y:center.y + top - inset,
    width:right - left + 2 * inset, height:bottom - top + 2 * inset };
  return { width, height, center, radius, exportBounds, nodes, links };
}
