import { Quaternion, Vector3 } from 'three';

const gap = 4;
const zero = new Vector3();
const corners = [-1, 1].flatMap(x=>[-1, 1].flatMap(y=>[-1, 1].map(z=>[x,y,z])));
const shifts = [[0,0], ...[20,38,58,78].flatMap(n=>[
  [0,n], [0,-n], [n,0], [-n,0], [n,n*.67], [-n,n*.67], [n,-n*.67], [-n,-n*.67],
  [n,n*.4], [-n,n*.4], [n,-n*.4], [-n,-n*.4],
])];

export function intersects(a,b) {
  return a.left<b.right && a.right>b.left && a.top<b.bottom && a.bottom>b.top;
}

export function spatialProjection(camera, width, height, poses = new Map(), attitude = new Quaternion()) {
  const projected = new Vector3();
  const face = new Vector3(0,0,1).applyQuaternion(attitude);
  function screen() {
    projected.project(camera);
    return {x:(projected.x+1)*width/2,y:(1-projected.y)*height/2,z:projected.z};
  }
  function point(x,y,z,layer,raise=0,offset) {
    projected.set(x,y,z);
    if (poses.has(layer)) projected.applyMatrix4(poses.get(layer).matrix);
    projected.addScaledVector(face,raise);
    if (offset) projected.add(offset);
    return screen();
  }
  function label(node,p) {
    const raise = node.size[2]*.55;
    return point(p.x,p.y,p.z,node.layer,raise);
  }
  function placeLabel(node,p,target) {
    target.copy(p).applyMatrix4(poses.get(node.layer).matrix).addScaledVector(face,node.size[2]*.55);
  }
  function body(node,p) {
    const [sx,sy,sz] = node.size;
    const center = projected.copy(p);
    if (poses.has(node.layer)) center.applyMatrix4(poses.get(node.layer).matrix);
    const cx = center.x, cy = center.y, cz = center.z;
    const box = {left:Infinity,top:Infinity,right:-Infinity,bottom:-Infinity};
    for (const [x,y,z] of corners) {
      projected.set(x*sx/2,y*sy/2,z*sz/2).applyQuaternion(attitude);
      projected.x += cx;
      projected.y += cy;
      projected.z += cz;
      const q = screen();
      box.left = Math.min(box.left,q.x);
      box.right = Math.max(box.right,q.x);
      box.top = Math.min(box.top,q.y);
      box.bottom = Math.max(box.bottom,q.y);
    }
    return box;
  }
  function world(x,y,z,layer) {
    const nx = x/width*2-1, ny = 1-y/height*2;
    const start = new Vector3(nx,ny,-1).unproject(camera);
    const delta = new Vector3(nx,ny,1).unproject(camera);
    if (poses.has(layer)) {
      const {inverse} = poses.get(layer);
      start.applyMatrix4(inverse);
      delta.applyMatrix4(inverse);
    }
    delta.sub(start);
    if (Math.abs(delta.z)<1e-7) return null;
    const hit = (z-start.z)/delta.z;
    return hit>=0 && hit<=1 ? start.addScaledVector(delta,hit) : null;
  }
  return { point, label, placeLabel, body, world, width, height };
}

export function labelBox(x,y,w,h) {
  return {left:x-w/2-2,right:x+w/2+2,top:y-h/2-2,bottom:y+h/2+2};
}

export function labelSlots(anchor, body, {w,h}) {
  const below = Math.max(15,body.bottom-anchor.y+h/2+gap);
  const above = Math.min(-15,body.top-anchor.y-h/2-gap);
  const left = body.left-anchor.x-w/2-gap-2;
  const right = body.right-anchor.x+w/2+gap+2;
  return [
    [0,below],[0,above],[left,0],[right,0],
    [24,above],[-24,above],[26,below],[-26,below],[0,below+17],[0,above-17],
    [left,20],[right,20],[left,-20],[right,-20],
    [52,below],[-52,below],[52,above],[-52,above],[0,below+37],[0,above-37],
  ];
}

export function peripheralLabelSlots(anchor, {w}, width) {
  const sides = [w/2+7,width-w/2-7].sort((a,b)=>Math.abs(a-anchor.x)-Math.abs(b-anchor.x));
  return [
    ...[66,88,112,142,174].flatMap(n=>[[0,n],[0,-n],[n,0],[-n,0],
      [n*.6,n*.8],[-n*.6,n*.8],[n*.6,-n*.8],[-n*.6,-n*.8]]),
    ...[0,24,-24,46,-46,70,-70,94,-94,118,-118].flatMap(y=>
      sides.filter(x=>Math.hypot(x-anchor.x,y)<162).map(x=>[x-anchor.x,y])),
  ];
}

export function insideFrame(box,width,height,inset=0) {
  return box.left>=3 && box.right<=width-3 && box.top>=inset && box.bottom<=height-3;
}

function signedArea(points) {
  return points.reduce((area,a,i)=>{
    const b = points[(i+1)%points.length];
    return area+a.x*b.y-a.y*b.x;
  },0)/2;
}

function clipPolygon(points, border) {
  for (let i=0;i<border.length && points.length;i++) {
    const a = border[i], b = border[(i+1)%border.length];
    const side = p=>(b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x);
    const clipped = [];
    let previous = points.at(-1), before = side(previous);
    for (const point of points) {
      const after = side(point);
      if ((before>=0)!==(after>=0)) {
        const t = before/(before-after);
        clipped.push({x:previous.x+(point.x-previous.x)*t,y:previous.y+(point.y-previous.y)*t});
      }
      if (after>=0) clipped.push(point);
      previous = point;
      before = after;
    }
    points = clipped;
  }
  return points;
}

export function solveLayerSpacing(layers, projection, atlas = false) {
  const {width,height} = projection;
  const frame = [{x:0,y:0},{x:width,y:0},{x:width,y:height},{x:0,y:height}];
  const boards = layers.filter(layer=>layer.data.length).flatMap(layer=>{
    const {x,y,z} = layer.center;
    const at = projection.point(x,y,z,layer.index);
    if (at.z<-1 || at.z>1) return [];
    const inset = atlas ? .5 : .38;
    function measure(offset) {
      const outline = [[-1,1],[1,1],[1,-1],[-1,-1]].map(([sx,sy])=>
        projection.point(x+sx*layer.width*inset,y+sy*layer.height*inset,z,layer.index,0,offset));
      const area = signedArea(outline);
      if (Math.abs(area)<1 || outline.some(p=>p.z<-1 || p.z>1)) return {area:0,visible:0,polygon:[]};
      if (area<0) outline.reverse();
      const polygon = clipPolygon(outline,frame);
      return {area:Math.abs(area),visible:Math.abs(signedArea(polygon)),polygon};
    }
    const home = measure();
    return home.visible>=1 ? [{layer,at,measure,home}] : [];
  });
  const overlap = (a,b)=>Math.abs(signedArea(clipPolygon(a.polygon,b.polygon)))/Math.max(1,Math.min(a.area,b.area));
  function score(placed) {
    let value = 0;
    for (const [i,first] of placed.entries()) {
      value += first.cost;
      for (const other of placed.slice(i+1)) value += Math.max(0,overlap(first.shape,other.shape)-(atlas ? .06 : .16));
    }
    return value;
  }
  let best = boards.map(board=>({shape:board.home,cost:0}));
  let bestScore = score(best);
  if (!bestScore) return new Map();
  for (const axis of ['x','y']) {
    const distance = Math.min(atlas ? 154 : 96,(axis==='x' ? width : height)*(atlas ? .20 : .17));
    const ordered = boards.slice().sort((a,b)=>a.at[axis]-b.at[axis]);
    const options = ordered.map(board=>{
      const list = [{board,shape:board.home,at:board.at[axis],cost:0}];
      for (const step of [-1,-.5,.5,1]) {
        const pos = {...board.at,[axis]:board.at[axis]+distance*step};
        const offset = projection.world(pos.x,pos.y,board.layer.depth)?.sub(board.layer.center);
        if (!offset) continue;
        offset.z = 0;
        offset.clampLength(0,atlas ? board.layer.width*.55 : Math.min(110,board.layer.width*.35));
        const shape = board.measure(offset);
        if (shape.visible < board.home.visible*.93) continue;
        const {x,y,z} = board.layer.center;
        const at = projection.point(x,y,z,board.layer.index,0,offset)[axis];
        list.push({board,shape,offset,at,cost:offset.length()*.00055});
      }
      return list;
    });
    function choose(placed) {
      if (placed.length===options.length) {
        const value = score(placed);
        if (value<bestScore-1e-6) { best = placed; bestScore = value; }
        return;
      }
      for (const candidate of options[placed.length]) {
        if (!placed.length || candidate.at>=placed.at(-1).at-2) choose([...placed,candidate]);
      }
    }
    choose([]);
  }
  return new Map(best.filter(item=>item.offset).map(item=>[item.board.layer.index,item.offset]));
}

export function solveSpatialReflow(layout, projection, focus, variant, size) {
  const offsets = new Map(), hints = new Map(), bodies = [], reserved = [];
  const {width,height} = projection;
  const layers = new Map(layout.layers.map(l=>[l.index,l]));
  const rank = n => (n.row ? 200 : 0)+(focus.nodes.has(n.id) ? 120 : 0)+(n.group ? 28 : 0);
  const ordered = [...layout.nodes.values()].sort((a,b)=>rank(b)-rank(a));
  const compact = width<620;
  const footprint = variant==='atlas' ? .66 : .5;
  for (const node of ordered) {
    const base = node.position;
    const center = projection.point(base.x,base.y,base.z,node.layer);
    if (center.z<-1 || center.z>1 || center.x < -18 || center.x > width+18 ||
        center.y < -18 || center.y > height+18) continue;
    const layer = layers.get(node.layer);
    const [nx,ny] = node.size;
    const max = node.row ? 107 : 68;
    let nearest = null;
    const needLabel = variant==='atlas' && node.row;
    const measured = needLabel ? size(node,compact,variant) : null;
    for (const [x,y] of shifts) {
      const pos = x || y ? projection.world(center.x+x,center.y+y,base.z,node.layer) : base;
      if (!pos) continue;
      pos.z = base.z;
      if (pos.distanceToSquared(base) > max*max ||
          Math.abs(pos.x-layer.center.x)+nx*footprint>layer.width/2 ||
          Math.abs(pos.y-layer.center.y)+ny*footprint>layer.height/2 ||
          (variant==='atlas' && pos.y-ny*footprint<layer.center.y-layer.height/2+26)) continue;
      const body = projection.body(node,pos);
      const pad = {left:body.left-gap,right:body.right+gap,top:body.top-gap,bottom:body.bottom+gap};
      if (!insideFrame(pad,width,height,0) || bodies.some(b=>intersects(b,pad)) ||
          reserved.some(r=>intersects(r,pad))) continue;
      if (!nearest) nearest = {pos,body};
      if (!needLabel) break;
      const anchor = projection.label(node,pos);
      const metrics = measured;
      const slots = [...labelSlots(anchor,body,metrics),...peripheralLabelSlots(anchor,metrics,width)];
      const hint = slots.find(([dx,dy])=>{
        const box = labelBox(anchor.x+dx,anchor.y+dy,metrics.w,metrics.h);
        if (!insideFrame(box,width,height,43) || intersects(box,body) ||
           bodies.some(b=>intersects(b,box)) || reserved.some(r=>intersects(r,box))) return false;
        reserved.push(box);
        return true;
      });
      if (!hint) continue;
      hints.set(node.id,hint);
      nearest = {pos,body};
      break;
    }
    const pos = nearest?.pos || base;
    bodies.push(nearest?.body || projection.body(node,base));
    if (pos!==base) {
      const delta = pos.clone().sub(base);
      if (delta.distanceToSquared(zero)>.02) offsets.set(node.id,delta);
    }
  }
  return {offsets,hints};
}
