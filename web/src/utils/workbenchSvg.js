import { graphScene, roundedCommands } from './workbenchScene.js';
import { nodeShape, textRows } from './workbenchRender.js';
import { nodeDecoration, kindColors } from './graphDecoration.js';
import { escapeMarkup as escape } from './graphExport.js';
export function fullWorkbenchSvg(graph, colors) {
  let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
  function add(x, y) { left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); }
  for (const node of graph.nodes) { add(node.x, node.y); add(node.x + node.width, node.y + node.height); }
  for (const edge of graph.links) for (const point of edge.points || [edge.a, edge.b]) add(...point);
  if (!Number.isFinite(left)) return workbenchSvg(graph, { x:0, y:0, scale:1 }, { width:320, height:180 }, colors);
  const pad = 24;
  return workbenchSvg(graph, { x:pad - left, y:pad - top, scale:1 },
    { width:Math.ceil(right - left + pad * 2), height:Math.ceil(bottom - top + pad * 2) }, colors, false);
}
export function workbenchSvg(graph, view, size, colors, aggregate = true) {
  const scene = graphScene(graph, view, size, aggregate);
  const labels = new Map(graph.nodes.map(node => [node.id, node.label || node.lines?.[0]]));
  const edges = scene.edges.map(edge => {
    const d = roundedCommands(edge.points).map(command => command.join(' ')).join(' ');
    const dash = edge.status === 'ai_assessed' ? '8 4' : edge.status === 'pending' || edge.label === '关联' ? '3 5' : '';
    const end=edge.points.at(-1),previous=edge.points.at(-2),direction=Math.sign(end[0]-previous[0]) || 1;
    const arrow=`<path d="M${end[0]} ${end[1]}L${end[0]-direction*6} ${end[1]-3}L${end[0]-direction*6} ${end[1]+3}Z" fill="${escape(edge.color)}"/>`;
    const label=edge.label && !scene.aggregated && scene.edges.length<35?`<text x="${edge.points[1][0]+5}" y="${(edge.points[1][1]+edge.points[2][1])/2-5}" fill="${escape(edge.color)}" font-size="12">${escape(edge.label)}</text>`:'';
    const detail = `${labels.get(edge.source) || ''} → ${labels.get(edge.target) || ''}${edge.label ? '（' + edge.label + '）' : ''}`;
    return `<g data-graph-detail="${escape(detail)}" data-graph-key="${escape(edge.id)}" data-graph-from="${escape(edge.source)}" data-graph-to="${escape(edge.target)}"><path d="${d}" stroke="${escape(edge.color)}" stroke-dasharray="${dash}" stroke-width="1.5" fill="none"/><path d="${d}" fill="none" stroke="transparent" stroke-width="9"/>${arrow}${label}</g>`;
  }).join('');
  const nodes = scene.nodes.map((node, i) => {
    const shape = nodeShape(node), clip = `node-${i}`;
    const decor = nodeDecoration(node);
    const watermark = !decor ? '' : decor.text
      ? `<text x="${decor.x}" y="${decor.y}" text-anchor="middle" dominant-baseline="central" font-weight="800" font-size="${decor.size}" fill="${decor.color}" opacity="${decor.opacity}">${escape(decor.text)}</text>`
      : `<path d="${decor.path}" transform="translate(${decor.x} ${decor.y}) scale(${decor.size})" fill="none" stroke="${decor.color}" stroke-width="3" opacity="${decor.opacity}"/>`;
    const text = textRows(node).map(row => `<text x="${row.x}" y="${row.y}" font-size="${row.size}" font-weight="${row.secondary?400:600}" fill="${escape(row.secondary?colors.secondary:colors.text)}">${escape(row.text)}</text>`).join('');
    const detail = [node.label || node.lines?.[0], node.detail, node.line ? `第 ${node.line} 行` : ''].filter(Boolean).join('\n');
    return `<g data-graph-detail="${escape(detail)}" data-graph-key="${escape(node.id)}"><clipPath id="${clip}"><path d="${shape}"/></clipPath><path d="${shape}" fill="${escape(colors.surface)}" stroke="${escape(colors.border)}"/><path d="${shape}" fill="${kindColors[node.kind]}" opacity=".045"/><g clip-path="url(#${clip})">${watermark}${text}</g></g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}"><rect width="100%" height="100%" fill="${escape(colors.background)}"/><g font-family="sans-serif">${edges}${nodes}</g></svg>`;
}
