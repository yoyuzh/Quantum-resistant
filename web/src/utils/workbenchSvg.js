import { graphScene, roundedCommands } from './workbenchScene.js';
import { nodeShape, textRows } from './workbenchRender.js';
import { nodeDecoration, kindColors } from './graphDecoration.js';
const escape = value => String(value ?? '').replace(/[&<>"']/g,
  char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));
export function workbenchSvg(graph, view, size, colors) {
  const scene = graphScene(graph, view, size);
  const edges = scene.edges.map(edge => {
    const d = roundedCommands(edge.points).map(command => command.join(' ')).join(' ');
    const dash = edge.status === 'ai_assessed' ? '8 4' : edge.status === 'pending' || edge.label === '关联' ? '3 5' : '';
    const end=edge.points.at(-1),previous=edge.points.at(-2),direction=Math.sign(end[0]-previous[0]) || 1;
    const arrow=`<path d="M${end[0]} ${end[1]}L${end[0]-direction*6} ${end[1]-3}L${end[0]-direction*6} ${end[1]+3}Z" fill="${escape(edge.color)}"/>`;
    const label=edge.label && !scene.aggregated && scene.edges.length<35?`<text x="${edge.points[1][0]+5}" y="${(edge.points[1][1]+edge.points[2][1])/2-5}" fill="${escape(edge.color)}" font-size="12">${escape(edge.label)}</text>`:'';
    return `<path d="${d}" stroke="${escape(edge.color)}" stroke-dasharray="${dash}" stroke-width="1.5" fill="none"/>${arrow}${label}`;
  }).join('');
  const nodes = scene.nodes.map((node, i) => {
    const shape = nodeShape(node), clip = `node-${i}`;
    const decor = nodeDecoration(node);
    const watermark = !decor ? '' : decor.text
      ? `<text x="${decor.x}" y="${decor.y}" text-anchor="middle" dominant-baseline="central" font-weight="800" font-size="${decor.size}" fill="${decor.color}" opacity="${decor.opacity}">${escape(decor.text)}</text>`
      : `<path d="${decor.path}" transform="translate(${decor.x} ${decor.y}) scale(${decor.size})" fill="none" stroke="${decor.color}" stroke-width="3" opacity="${decor.opacity}"/>`;
    const text = textRows(node).map(row => `<text x="${row.x}" y="${row.y}" font-size="${row.size}" font-weight="${row.secondary?400:600}" fill="${escape(row.secondary?colors.secondary:colors.text)}">${escape(row.text)}</text>`).join('');
    return `<g><clipPath id="${clip}"><path d="${shape}"/></clipPath><path d="${shape}" fill="${escape(colors.surface)}" stroke="${escape(colors.border)}"/><path d="${shape}" fill="${kindColors[node.kind]}" opacity=".045"/><g clip-path="url(#${clip})">${watermark}${text}</g></g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}"><rect width="100%" height="100%" fill="${escape(colors.background)}"/><g font-family="sans-serif">${edges}${nodes}</g></svg>`;
}
