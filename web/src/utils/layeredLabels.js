import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { insideFrame, intersects, labelBox, labelSlots, repositoryLabelSlots } from './spatialReflow.js';

export function createSpatialLabels(scene, onChange) {
  const live = new Map();
  const sizes = new Map();
  const measure = document.createElement('canvas').getContext('2d');
  const font = getComputedStyle(document.documentElement).getPropertyValue('--font-sans').trim() || 'sans-serif';
  let key = '';
  function set(items) {
    const next = items.map(n=>n.id).join('\n');
    if (next===key) return false;
    key = next;
    const ids = new Set(items.map(n=>n.id));
    for (const [id,value] of live) if (!ids.has(id)) {
      value.anchor.removeFromParent();
      live.delete(id);
    }
    for (const node of items) if (!live.has(node.id)) {
      const target = document.createElement('div');
      target.className = 'spatial-anchor';
      const anchor = new CSS2DObject(target);
      scene.add(anchor);
      live.set(node.id,{node,target,anchor});
    }
    onChange(items.map(n=>live.get(n.id)));
    return true;
  }

  function size(node, compact, variant) {
    const id = variant+':'+Number(compact)+':'+node.id;
    const measured = live.get(node.id)?.target.firstElementChild;
    if (measured?.offsetWidth) {
      const value = {w:measured.offsetWidth,h:measured.offsetHeight};
      sizes.set(id,value);
      return value;
    }
    if (sizes.has(id)) return sizes.get(id);
    const title = variant==='atlas' ? node.label : (node.title || node.label);
    const max = node.kind==='algorithm' ? compact ? 68 : 70 : compact ? 92 : 112;
    const px = compact ? 10.5 : 12;
    measure.font = '650 '+px+'px '+font;
    const raw = measure.measureText(title).width;
    const w = Math.max(43,Math.min(max,raw+14));
    const wrapped = Math.max(1,Math.ceil(raw/(max-13)));
    const h = (variant==='atlas' ? wrapped : Math.min(wrapped,2))*px*1.18+22;
    const result = {w,h};
    sizes.set(id,result);
    return result;
  }

  function bodyBoxes(layout,projection,positions,review) {
    const result = [];
    for (const node of layout.nodes.values()) {
      if (review!==null && review!==node.layer) continue;
      const pos = positions.get(node.id) || node.position;
      const point = projection.point(pos.x,pos.y,pos.z,node.layer);
      if (point.z<-1 || point.z>1 || point.x < -90 || point.x > projection.width+90 ||
          point.y < -90 || point.y > projection.height+90) continue;
      result.push(projection.body(node,pos));
    }
    return result;
  }

  function update({layout, projection, positions, review, focus, near, progress, variant, bodies, hints}) {
    const {width,height} = projection;
    const compact = width < 620, hasFocus = focus.size>0;
    const candidates = [], occupied = [...bodies];
    for (const node of layout.nodes.values()) {
      if (review!==null && node.layer!==review) continue;
      if (node.parent && progress<.72) continue;
      const active = focus.has(node.id);
      if (variant!=='atlas' && !near && layout.nodes.size>72 && !active) continue;
      const position = positions.get(node.id) || node.position;
      const anchor = projection.label(node,position);
      if (anchor.z < -1 || anchor.z > 1) continue;
      const metrics = size(node,compact,variant);
      const priority = (node.row ? 3500 : 0) + (active ? 3000:0) +
        (node.group ? 500 : 0) + Math.log1p(node.total || 0)*4 -
        Math.abs(anchor.x-width/2)*.022 - Math.abs(anchor.y-height/2)*.022;
      candidates.push({node,priority,anchor,metrics,position});
    }
    candidates.sort((a,b)=>b.priority-a.priority);
    const visible = [], placements = new Map();
    for (const {node,anchor,metrics,position,priority} of candidates) {
      const current = live.get(node.id);
      const footprint = metrics;
      const slots = labelSlots(anchor,projection.body(node,position),footprint);
      if (current?.goal) slots.unshift(current.goal);
      if (hints.has(node.id)) slots.unshift(hints.get(node.id));
      if (node.row) slots.push(...repositoryLabelSlots(anchor,footprint,width));
      const goal = slots.find(([dx,dy])=>{
        const rect = labelBox(anchor.x+dx,anchor.y+dy,footprint.w,footprint.h);
        if (!insideFrame(rect,width,height,42) || occupied.some(box=>intersects(box,rect))) return false;
        occupied.push(rect);
        return true;
      });
      if (!goal) continue;
      visible.push(node);
      placements.set(node.id,{goal,metrics,priority});
      if (visible.length >= (compact ? 40 : 100)) break;
    }
    visible.sort((a,b)=>a.layer-b.layer || b.position.y-a.position.y || a.position.x-b.position.x);
    const changed = set(visible);
    for (const state of live.values()) {
      Object.assign(state, placements.get(state.node.id));
      state.offset ||= [...state.goal];
      state.target.classList.toggle('dimmed',hasFocus && !focus.has(state.node.id));
    }
    return changed;
  }

  function move({projection, positions, step, bodies}) {
    let moving = false, visible = 0;
    const {width,height} = projection;
    const occupied = [...bodies];
    for (const state of [...live.values()].sort((a,b)=>b.priority-a.priority)) {
      const {node,anchor,target,goal,offset} = state;
      for (const axis of [0,1]) {
        const delta = goal[axis]-offset[axis];
        if (Math.abs(delta)>.28 && step<1) {
          offset[axis] += delta*step;
          moving = true;
        } else offset[axis] = goal[axis];
      }
      const position = positions.get(node.id) || node.position;
      projection.placeLabel(node,position,anchor.position);
      target.style.setProperty('--label-shift-x',offset[0]+'px');
      target.style.setProperty('--label-shift-y',offset[1]+'px');
      const point = projection.label(node,position);
      if (!state.measured && target.firstElementChild?.offsetWidth) {
        state.measured = true;
        state.metrics = {w:target.firstElementChild.offsetWidth,h:target.firstElementChild.offsetHeight};
      }
      const footprint = state.metrics;
      const box = labelBox(point.x+offset[0],point.y+offset[1],footprint.w,footprint.h);
      const clear = point.z>=-1 && point.z<=1 && insideFrame(box,width,height,42) &&
        occupied.every(other=>!intersects(other,box));
      // During interpolation give the model and higher priority labels the clear path.
      target.style.visibility = clear ? 'visible' : 'hidden';
      if (clear) {
        occupied.push(box);
        visible++;
        const [x,y] = offset;
        const length = Math.hypot(x,y);
        const edge = Math.min(footprint.w/2/Math.abs(x),footprint.h/2/Math.abs(y));
        const leader = length>0 ? length*(1-edge) : 0;
        target.classList.toggle('leader',leader>22);
        if (leader>22) {
          target.style.setProperty('--label-leader-length',leader+'px');
          target.style.setProperty('--label-leader-angle',Math.atan2(y,x)+'rad');
        }
      }
    }
    return {moving,visible};
  }

  return { size, bodyBoxes, update, move, clear:()=>{sizes.clear();set([]);}, live };
}
