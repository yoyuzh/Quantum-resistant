import { escapeMarkup as esc, exportGraph } from './graphExport.js';
import { BUNDLE_LABEL_LINE, BUNDLE_LABEL_SIZE, bundleStyle } from './repositoryBundle.js';
import { layoutRepositoryOverview, OVERVIEW_FONT_SIZE, OVERVIEW_LINE_HEIGHT,
  OVERVIEW_PAGE_SIZE, OVERVIEW_WIDTH_GUIDE, overviewRadius } from './repositoryOverview.js';

function graphSvg(bounds, theme, stamp, content, overview = false) {
  const { x, y, width, height } = bounds;
  const vars = ['--bg-elevated', '--bg-surface', '--text-primary', '--text-secondary', '--accent', '--accent-dim',
    '--border', '--font-sans', '--control-bg', '--control-hover', '--workspace-dot'];
  const style = esc(vars.map(name => `${name}:${theme.getPropertyValue(name)}`).join(';'));
  return `<svg xmlns="http://www.w3.org/2000/svg" data-repository-graph="true" ${overview ? 'data-repository-overview="true"' : ''} width="${Math.ceil(width)}" height="${Math.ceil(height)}" viewBox="${x} ${y} ${width} ${height}" style="${style}"><title>仓库算法关系图（${esc(stamp)}）</title><rect x="${x}" y="${y}" width="${width}" height="${height}" fill="var(--bg-elevated)"/><g fill="var(--text-primary)" font-family="var(--font-sans)">${content}</g></svg>`;
}

function relationSvg(link, title, location, { round = false, flowing = false } = {}) {
  const { id, source, target, path, color, width, dash } = link;
  const flow = flowing ? `<path data-graph-flow="${width}" d="${path}" fill="none" stroke="color-mix(in srgb, ${esc(color)} 25%, #f7fbff)" stroke-width="${Math.min(2, width * .48)}" stroke-linecap="round" stroke-dasharray="4 29" opacity=".76" display="none" pointer-events="none"/>` : '';
  return `<g data-graph-detail="${esc(title)}" data-graph-key="${esc(id)}" data-graph-from="${esc(source)}" data-graph-to="${esc(target)}" data-graph-location="${esc(location?.label)}" data-graph-url="${esc(location?.url)}"><title>${esc(title)}</title><path d="${path}" fill="none" stroke="${esc(color)}" stroke-width="${width}" stroke-linecap="${round ? 'round' : 'butt'}" stroke-dasharray="${esc(dash)}" opacity=".44" pointer-events="none"/>${flow}<path d="${path}" fill="none" stroke="transparent" stroke-width="${Math.max(7, width)}" pointer-events="stroke"/></g>`;
}

export function repositoryBundleSvg(graph, theme, stamp, evidenceLocation) {
  const { x, y, width, height } = graph.exportBounds;
  const uses = [...new Set(graph.links.map(link => link.purpose))].map(bundleStyle);
  const columns = Math.max(1, Math.floor(width / 142));
  const legendHeight = uses.length ? Math.ceil(uses.length / columns) * 22 + 12 : 0;
  const legend = uses.map(({ color, dash, label }, index) => {
    const start = x + 14 + (index % columns) * 142;
    const top = y + height + 16 + Math.floor(index / columns) * 22;
    return `<path d="M${start} ${top}h26" stroke="${esc(color)}" stroke-dasharray="${esc(dash)}" stroke-width="2"/><text x="${start + 33}" y="${top}" dominant-baseline="central" font-size="12">${esc(label)}</text>`;
  }).join('');
  const links = graph.links.map(link => {
    const location = evidenceLocation(link);
    const title = `${link.repo} → ${link.algorithm}（${link.label}），${link.count} 项`;
    return relationSvg(link, title, location);
  }).join('');
  const nodes = graph.nodes.map(node => {
    const lines = node.labelLines.map((line, index) => `<tspan x="0" y="${(index - (node.labelLines.length - 1) / 2) * BUNDLE_LABEL_LINE}">${esc(line)}</tspan>`).join('');
    return `<g data-graph-detail="${esc(node.key + '，' + node.count + ' 项')}" data-graph-key="${esc(node.id)}"><title>${esc(node.key)}</title><line x1="${node.x}" y1="${node.y}" x2="${node.labelX}" y2="${node.labelY}" stroke="var(--border)"/><circle cx="${node.x}" cy="${node.y}" r="3" fill="${node.side === 'repo' ? 'var(--accent)' : 'var(--text-secondary)'}"/><text transform="translate(${node.labelX} ${node.labelY}) rotate(${node.rotation})" text-anchor="${node.anchor}" dominant-baseline="central" font-size="${BUNDLE_LABEL_SIZE}" font-weight="500">${lines}</text></g>`;
  }).join('');
  return graphSvg({ x, y, width, height: height + legendHeight }, theme, stamp,
    `<circle cx="${graph.center.x}" cy="${graph.center.y}" r="${graph.radius}" fill="none" stroke="var(--border)"/>${links}${nodes}${legend}`);
}

function overviewContent(graph, evidenceLocation, legacy) {
  const nodesById = new Map(graph.nodes.map(node => [node.id, node]));
  const branches = graph.branches.map(branch => relationSvg({ ...branch, id: 'membership:' + branch.target,
    color: 'var(--accent)', width: 1.5 }, nodesById.get(branch.source).label + ' → ' + branch.repo, null, { round:true })).join('');
  const links = graph.links.map(link => relationSvg(link, link.title, evidenceLocation(link), { round:true, flowing:true })).join('');
  const nodes = graph.nodes.map(node => {
    const left = node.x - node.width / 2, top = node.y - node.height / 2;
    const lines = node.labelLines.map((line, index) => `<tspan x="${node.x}" y="${top + 15 + index * OVERVIEW_LINE_HEIGHT}">${esc(line)}</tspan>`).join('');
    const surface = node.side === 'repo' ? 94.5 : 88;
    const toggle = node.side === 'category' ? `<g data-graph-toggle="" display="none" aria-hidden="true" pointer-events="none" transform="translate(${left + node.width - 10} ${top + node.height - 13})" stroke="var(--accent)" stroke-width="1.6"><path d="M-4 0H4"/><path d="M0 -4V4"/></g>` : '';
    return `<g data-graph-detail="${esc(node.label + '，' + node.summary)}" data-graph-key="${esc(node.id)}"><title>${esc(node.label)}</title><rect x="${left}" y="${top}" width="${node.width}" height="${node.height}" rx="${overviewRadius(node)}" fill="color-mix(in srgb, var(--bg-surface) ${surface}%, ${esc(node.color)})" stroke="${esc(node.color)}"/><text text-anchor="middle" dominant-baseline="central" font-size="${OVERVIEW_FONT_SIZE}" font-weight="600">${lines}</text><text x="${node.x}" y="${top + node.height - 13}" text-anchor="middle" dominant-baseline="central" font-size="12" fill="var(--text-secondary)">${esc(node.summary)}</text>${toggle}</g>`;
  }).join('');
  const hasWeights = graph.links.length && !legacy;
  const membership = graph.branches.length ? '<path d="M2 6H18" stroke="var(--accent)" stroke-width="1.5"/><text x="25" y="6">类别归属</text>' : '';
  const start = membership ? 94 : 0;
  const weights = hasWeights ? `<g transform="translate(${start} 0)"><text x="0" y="6">检出量 少</text><path transform="translate(64 0)" d="${OVERVIEW_WIDTH_GUIDE}"/><text x="103" y="6">多</text></g>` : '';
  const legend = membership || weights
    ? `<g transform="translate(18 ${graph.height + 6})" fill="var(--text-secondary)" dominant-baseline="central" font-size="12">${membership}${weights}</g>` : '';
  return { bounds:{ ...graph.exportBounds, height:graph.height + (legend ? 25 : 0) },
    content:branches + links + nodes + legend };
}

export function repositoryOverviewSvg(graph, theme, stamp, evidenceLocation, legacy = false) {
  const { bounds, content } = overviewContent(graph, evidenceLocation, legacy);
  return graphSvg(bounds, theme, stamp, content, true);
}

export function repositoryOverviewPanels(groups, flows, options) {
  const layout = { legacy:options.legacy, measure:options.measure, peak:options.peak,
    showUnlinked:options.showUnlinked, exportAspect:true, viewportWidth:1000 };
  const linked = new Set(flows.map(flow => flow.repo));
  const flowsByCategory = new Map();
  for (const flow of flows) {
    if (!flowsByCategory.has(flow.category)) flowsByCategory.set(flow.category, []);
    flowsByCategory.get(flow.category).push(flow);
  }
  const panels = [{ label:'全部类别', graph:layoutRepositoryOverview(groups, flows, layout) }];
  for (const group of groups) {
    const rows = group.rows.filter(row => layout.showUnlinked || linked.has(row.repo.full_name));
    if (!rows.length) continue;
    const pages = Math.ceil(rows.length / OVERVIEW_PAGE_SIZE);
    const perPage = Math.ceil(rows.length / pages);
    const categoryFlows = flowsByCategory.get(group.id) || [];
    for (let index = 0; index < pages; index++) {
      const members = rows.slice(index * perPage, (index + 1) * perPage);
      const names = new Set(members.map(row => row.repo.full_name));
      const detail = { ...group, rows:members };
      panels.push({ section:group.id, label:pages === 1 ? group.label : `${group.label}（${index+1}/${pages}）`,
        graph:layoutRepositoryOverview([detail], categoryFlows.filter(flow => names.has(flow.repo)), { ...layout, full:true }) });
    }
  }
  return panels;
}

export function repositoryOverviewSheet(panels, { theme, stamp, evidenceLocation, legacy }) {
  const cards = panels.map(panel => ({ label:panel.label, ...overviewContent(panel.graph, evidenceLocation, legacy) }));
  const gutter = 16, heading = 36;
  const cellWidth = Math.max(...cards.map(card => card.bounds.width));
  let grid;
  for (let columns = 1; columns <= cards.length; columns++) {
    const heights = [];
    cards.forEach((card, index) => {
      const row = Math.floor(index / columns);
      heights[row] = Math.max(heights[row] || 0, card.bounds.height + heading);
    });
    const width = columns * (cellWidth + gutter) + gutter;
    const height = heights.reduce((sum, row) => sum + row + gutter, gutter);
    const balance = Math.abs(Math.log(width / height / 1.32));
    if (!grid || balance < grid.balance) grid = { columns, heights, width, height, balance };
    if (width / height >= 1.32) break;
  }
  const rows = [gutter];
  grid.heights.forEach(height => rows.push(rows.at(-1) + height + gutter));
  const content = cards.map((card, index) => {
    const x = gutter + index % grid.columns * (cellWidth + gutter);
    const y = rows[Math.floor(index / grid.columns)];
    const dx = (cellWidth - card.bounds.width) / 2;
    return `<g transform="translate(${x} ${y})"><rect width="${cellWidth}" height="${card.bounds.height + heading}" rx="8" fill="var(--bg-surface)" stroke="var(--border)"/><text x="16" y="23" font-weight="650" font-size="16">${esc(card.label)}</text><g transform="translate(${dx} ${heading})">${card.content}</g></g>`;
  }).join('');
  return graphSvg({ x:0, y:0, width:grid.width, height:grid.height }, theme, stamp, content, true);
}

export function exportRepositoryOverview(format, groups, flows, options) {
  const panels = repositoryOverviewPanels(groups, flows, options);
  if (format === 'png') return exportGraph(format, repositoryOverviewSheet(panels, options), options.title);
  const views = panels.map(({ section, label, graph }) => ({ section, label,
    svg:repositoryOverviewSvg(graph, options.theme, options.stamp, options.evidenceLocation, options.legacy) }));
  return exportGraph(format, views[0].svg, options.title, views);
}
