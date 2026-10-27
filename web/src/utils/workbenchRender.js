import { roundedCommands } from './workbenchScene.js';
import { nodeDecoration, kindColors } from './graphDecoration.js';

export function nodeShape(node) {
  const { x, y, width: w, height: h } = node;
  if (node.kind === 'reference') {
    const c = Math.min(10 * node.scale, h / 4);
    return `M${x + c},${y}H${x + w - c}L${x + w},${y + c}V${y + h - c}L${x + w - c},${y + h}H${x + c}L${x},${y + h - c}V${y + c}Z`;
  }
  const r = Math.min((node.kind === 'algorithm' ? 18 : 7) * node.scale, h / 3);
  return `M${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x + r}Q${x},${y + h} ${x},${y + h - r}V${y + r}Q${x},${y} ${x + r},${y}Z`;
}
export function textRows(node) {
  const scale = node.scale || 1, x = node.x + 16 * scale;
  const rows = [];
  if(node.horizontal){
    rows.push({x,y:node.y+node.height/2+5*scale,text:node.title,size:15*scale});
    const top=node.y+(node.height-(node.detailLines.length-1)*17*scale)/2+4*scale;
    node.detailLines.forEach((text,i)=>rows.push({x:node.x+104*scale,y:top+i*17*scale,text,size:13*scale,secondary:true}));
    return rows;
  }
  let y = node.y + 25 * scale;
  if (node.badge && !node.inlineBadge) {
    rows.push({ x, y: node.y + 19 * scale, text: node.badge, size: 11 * scale, secondary: true });
    y += 22 * scale;
  }
  (node.lines || [node.label]).forEach(text => { rows.push({ x, y, text, size: (node.aggregated?13:15) * scale }); y += 20 * scale; });
  y += 3 * scale;
  const prefix = node.status === 'ai_assessed' ? 'AI研判 · ' : node.status === 'pending' ? '证据不足 · ' : '';
  const detail = node.detailLines || (node.detail ? [prefix + node.detail] : []);
  detail.forEach(text => { rows.push({ x, y, text, size: 13 * scale, secondary: true }); y += 17 * scale; });
  return rows;
}
function trace(ctx, commands) {
  ctx.beginPath();
  for (const [command, ...args] of commands) {
    if (command === 'M') ctx.moveTo(...args);
    else if (command === 'L') ctx.lineTo(...args);
    else ctx.quadraticCurveTo(...args);
  }
}
export function renderScene(ctx, scene, colors, focus) {
  for (const edge of scene.edges) {
    const active = edge.members.reduce((max, id) => Math.max(max, focus.edges.get(id) || 0), 0);
    trace(ctx, roundedCommands(edge.points));
    ctx.strokeStyle = edge.color;
    ctx.globalAlpha = .68 - focus.dim * .56 + active * .88;
    ctx.lineWidth = 1.5 + active * 1.3;
    ctx.setLineDash(edge.status === 'ai_assessed' ? [8, 4] : edge.status === 'pending' || edge.label === '关联' ? [3, 5] : []);
    ctx.stroke(); ctx.setLineDash([]);
    const b = edge.points.at(-1), a = edge.points.at(-2), direction = Math.sign(b[0] - a[0]) || 1;
    ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(b[0] - direction * 6, b[1] - 3); ctx.lineTo(b[0] - direction * 6, b[1] + 3);
    ctx.closePath(); ctx.fillStyle = edge.color; ctx.fill();
    if (edge.label && (active > .01 || scene.edges.length < 35) && !scene.aggregated) {
      const p = edge.points[1], q = edge.points[2], x = p[0], y = (p[1] + q[1]) / 2;
      ctx.font = '12px ' + colors.font;
      const width = ctx.measureText(edge.label).width + 10;
      ctx.globalAlpha = scene.edges.length < 35 ? .68 - focus.dim * .56 + active * .88 : active;
      ctx.fillStyle = colors.surface; ctx.fillRect(x - width / 2, y - 9, width, 18);
      ctx.fillStyle = edge.color; ctx.fillText(edge.label, x - width / 2 + 5, y + 4);
    }
  }
  ctx.globalAlpha = 1;
  for (const node of scene.nodes) {
    const active = node.members.reduce((max, id) => Math.max(max, focus.nodes.get(id) || 0), 0);
    const shape = new Path2D(nodeShape(node));
    ctx.fillStyle = colors.surface; ctx.fill(shape);
    ctx.globalAlpha = .045 + active * .075;
    ctx.fillStyle = kindColors[node.kind];
    ctx.fill(shape); ctx.globalAlpha = 1;
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 1;
    ctx.setLineDash(node.status === 'ai_assessed' ? [8, 4] : node.status === 'pending' ? [3, 4] : []);
    ctx.stroke(shape);
    ctx.globalAlpha = active; ctx.strokeStyle = colors.accent; ctx.lineWidth = 1.8; ctx.stroke(shape);
    ctx.globalAlpha = 1; ctx.setLineDash([]);
    ctx.save(); ctx.clip(shape);
    const decoration = nodeDecoration(node);
    if (decoration) {
      ctx.save(); ctx.globalAlpha = decoration.opacity;
      ctx.fillStyle = decoration.color; ctx.strokeStyle = decoration.color;
      if (decoration.text) {
        ctx.font = `800 ${decoration.size}px ${colors.font}`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(decoration.text, decoration.x, decoration.y);
      } else {
        ctx.translate(decoration.x, decoration.y); ctx.scale(decoration.size, decoration.size);
        ctx.lineWidth = 3; ctx.stroke(new Path2D(decoration.path));
      }
      ctx.restore();
    }
    for (const row of textRows(node)) {
      ctx.font = `${row.secondary ? 400 : 600} ${row.size}px ${colors.font}`;
      ctx.fillStyle = row.secondary ? colors.secondary : colors.text;
      ctx.fillText(row.text, row.x, row.y);
    }
    ctx.restore();
  }
}
