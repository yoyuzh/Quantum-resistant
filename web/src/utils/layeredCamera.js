import { Box3, Euler, MathUtils, Matrix4, Vector3 } from 'three';

const cruise = new Vector3(.68, .85, 1).normalize();
const narrowCruise = new Vector3(.11, 1.12, 1).normalize();
const atlasCruise = new Vector3(.48, .62, 1).normalize();
const shortAtlasCruise = new Vector3(.56, .20, 1).normalize();
const straight = new Vector3(0, 0, 1);
const up = new Vector3(0, 1, 0);
export const SPATIAL_FOV = 35;
const maxYaw = 38*Math.PI/180;
const maxPitch = 26*Math.PI/180;

export function layerAim(out, forward, atlas = false) {
  const horizontal = Math.hypot(forward.x,forward.z);
  // Use the sine of the viewing angle so the aim eases into its limits and crosses the rear seam continuously.
  const yaw = horizontal ? maxYaw*(atlas ? .66 : 1)*forward.x/horizontal : 0;
  return out.set(-maxPitch*(atlas ? .49 : 1)*forward.y,yaw,0,'YXZ');
}

export function followLayerAim(current,target,elapsed) {
  const delta = Math.max(Math.abs(current.x-target.x),Math.abs(current.y-target.y));
  if (delta<=.004 || elapsed===Infinity) {
    current.copy(target);
    return false;
  }
  current.x = MathUtils.damp(current.x,target.x,1/.09,elapsed/1000);
  current.y = MathUtils.damp(current.y,target.y,1/.09,elapsed/1000);
  return true;
}

export function layerPoses(layers, attitude, offsets) {
  return new Map(layers.map(({index,center})=>{
    const pivot = center.clone().applyQuaternion(attitude).negate().add(center);
    const offset = offsets.get(index);
    if (offset) pivot.add(offset);
    const matrix = new Matrix4().makeRotationFromQuaternion(attitude).setPosition(pivot);
    return [index,{matrix,inverse:matrix.clone().invert()}];
  }));
}

export function createViewSettle(delay = 220) {
  let deadline = null;
  return {
    touch(now) { deadline = now + delay; },
    wait(now) { return deadline===null ? null : Math.max(0,deadline-now); },
    take(now) {
      if (deadline===null || now<deadline) return false;
      deadline = null;
      return true;
    },
    get pending() { return deadline!==null; },
  };
}

export function cameraShot(layout, { aspect, variant, review, focus, compact = false, direction }) {
  const layer = layout.layers.find(item => item.index===review);
  const home = variant==='atlas' ? (aspect > 2.7 ? shortAtlasCruise : atlasCruise) : cruise;
  const forward = layer ? straight : direction ?? (compact ? narrowCruise : home);
  const side = up.clone().cross(forward).normalize();
  const rise = forward.clone().cross(side);
  const aim = layerAim(new Euler(),forward,variant==='atlas');
  const panelRight = new Vector3(1,0,0).applyEuler(aim);
  const panelUp = up.clone().applyEuler(aim);
  const panelNormal = straight.clone().applyEuler(aim);
  const limits = (layer ? [layer] : layout.layers).flatMap(({center,width,height})=>
    [-1,1].flatMap(x=>[-1,1].map(y=>center.clone().addScaledVector(panelRight,x*width/2)
      .addScaledVector(panelUp,y*height/2).addScaledVector(panelNormal,18))));
  const bounds = new Box3().setFromPoints(limits);
  const world = bounds.getCenter(new Vector3());
  const chosen = focus.map(id=>layout.nodes.get(id)).filter(Boolean);
  const points = variant!=='atlas' && chosen.length && review===null ? chosen.flatMap(node => {
    const [width,height,depth] = node.size;
    const center = layout.layers.find(item=>item.index===node.layer).center;
    const p = center.clone().addScaledVector(panelRight,node.position.x-center.x)
      .addScaledVector(panelUp,node.position.y-center.y);
    return [-1,1].map(sign=>p.clone().addScaledVector(side,sign*(width/2+36))
      .addScaledVector(rise,sign*(height/2+40)).addScaledVector(forward,sign*depth/2));
  }) : limits;
  const target = new Box3().setFromPoints(points).getCenter(new Vector3());
  const fov = Math.tan(SPATIAL_FOV * Math.PI / 360);
  const margin = compact || direction ? .79 : .86;
  const fit = (list, center) => list.reduce((max,point)=>{
    const p = point.clone().sub(center);
    const sideways = Math.max(Math.abs(p.dot(side))/aspect, Math.abs(p.dot(rise)));
    return Math.max(max, sideways/(fov*margin)+p.dot(forward));
  }, 1);
  const normalDistance = fit(limits,world);
  let distance = Math.max(fit(points,target), chosen.length && review===null ? normalDistance*.46 : 100);
  if (layer) {
    const orthoHeight = Math.max(bounds.max.y-bounds.min.y,(bounds.max.x-bounds.min.x)/aspect)/margin;
    distance = Math.max(1400,normalDistance);
    return {target:world, position:world.clone().addScaledVector(forward,distance), orthoHeight};
  }
  return {target, position:target.clone().addScaledVector(forward,distance), orthoHeight:2*distance*fov};
}
