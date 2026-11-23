import { escapeMarkup as esc } from './graphExport.js';
import { BUNDLE_LABEL_LINE, BUNDLE_LABEL_SIZE, bundleStyle } from './repositoryBundle.js';

export function repositoryBundleSvg(graph, theme, stamp, evidenceLocation) {
  const { x, y, width, height } = graph.exportBounds;
  const uses = [...new Set(graph.links.map(link => link.purpose))].map(bundleStyle);
  const columns = Math.max(1, Math.floor(width / 142));
  const legendHeight = uses.length ? Math.ceil(uses.length / columns) * 22 + 12 : 0;
  const vars = ['--bg-elevated', '--text-primary', '--text-secondary', '--accent', '--accent-dim', '--border', '--font-sans'];
  const style = esc(vars.map(name => `${name}:${theme.getPropertyValue(name)}`).join(';'));
  const legend = uses.map(({ color, dash, label }, index) => {
    const start = x + 14 + (index % columns) * 142;
    const top = y + height + 16 + Math.floor(index / columns) * 22;
    return `<path d="M${start} ${top}h26" stroke="${esc(color)}" stroke-dasharray="${esc(dash)}" stroke-width="2"/><text x="${start + 33}" y="${top}" dominant-baseline="central" font-size="12">${esc(label)}</text>`;
  }).join('');
  const links = graph.links.map(link => {
    const location = evidenceLocation(link);
    const title = `${link.repo} → ${link.algorithm} · ${link.label} · ${link.count} 项`;
    return `<g data-graph-detail="${esc(title)}" data-graph-key="${esc(link.id)}" data-graph-from="${esc('repo:' + link.repo)}" data-graph-to="${esc('algorithm:' + link.algorithm)}" data-graph-location="${esc(location?.label)}" data-graph-url="${esc(location?.url)}"><title>${esc(title)}</title><path d="${link.path}" fill="none" stroke="${esc(link.color)}" stroke-width="${link.width}" stroke-dasharray="${esc(link.dash)}" opacity=".44"/><path d="${link.path}" fill="none" stroke="transparent" stroke-width="${Math.max(7,link.width)}"/></g>`;
  }).join('');
  const nodes = graph.nodes.map(node => {
    const left = node.side === 'repo';
    const lines = node.labelLines.map((line, index) => `<tspan x="${node.labelX}" y="${node.labelY + (index - (node.labelLines.length - 1) / 2) * BUNDLE_LABEL_LINE}">${esc(line)}</tspan>`).join('');
    return `<g data-graph-detail="${esc(node.key + ' · ' + node.count + ' 项')}" data-graph-key="${esc(node.id)}"><title>${esc(node.key)}</title><line x1="${node.x}" y1="${node.y}" x2="${node.labelX + (left ? 4 : -4)}" y2="${node.labelY}" stroke="var(--border)"/><circle cx="${node.x}" cy="${node.y}" r="3" fill="${left ? 'var(--accent)' : 'var(--text-secondary)'}"/><text x="${node.labelX}" text-anchor="${left ? 'end' : 'start'}" dominant-baseline="central" font-size="${BUNDLE_LABEL_SIZE}" font-weight="500">${lines}</text></g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(width)}" height="${Math.ceil(height + legendHeight)}" viewBox="${x} ${y} ${width} ${height + legendHeight}" style="${style}"><title>仓库算法与用途边捆绑图 · ${esc(stamp)}</title><rect x="${x}" y="${y}" width="${width}" height="${height + legendHeight}" fill="var(--bg-elevated)"/><g fill="var(--text-primary)" font-family="var(--font-sans)"><circle cx="${graph.center.x}" cy="${graph.center.y}" r="${graph.radius}" fill="none" stroke="var(--border)"/>${links}${nodes}${legend}</g></svg>`;
}
