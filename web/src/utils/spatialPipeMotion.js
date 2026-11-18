import { Vector3 } from 'three';

const zero = new Vector3();
const ease = t => t*t*(3-2*t);

export function movePipePoint(point,t,from,to) {
  const weight = ease(t);
  return point.addScaledVector(from,1-weight).addScaledVector(to,weight);
}

export function pipeMotion(geometry,curve,line) {
  const vertices = geometry.getAttribute('position'), uv = geometry.getAttribute('uv');
  const original = vertices.array.slice();
  const weights = new Float32Array(vertices.count);
  const cached = new Map();
  for (let i = 0; i < vertices.count; i++) {
    const u = line ? i/(vertices.count-1) : uv.getX(i);
    if (!cached.has(u)) cached.set(u,ease(line ? u : curve.getUtoTmapping(u)));
    weights[i] = cached.get(u);
  }
  return {
    from:new Vector3(),to:new Vector3(),
    update(a=zero,b=zero) {
      if (a.equals(this.from) && b.equals(this.to)) return;
      this.from.copy(a);
      this.to.copy(b);
      for (let i=0;i<vertices.count;i++) {
        const j=i*3, t=weights[i];
        // Translate each cross section as a unit. Its diameter is still the original data band.
        vertices.array[j] = original[j]+a.x+(b.x-a.x)*t;
        vertices.array[j+1] = original[j+1]+a.y+(b.y-a.y)*t;
        vertices.array[j+2] = original[j+2]+a.z+(b.z-a.z)*t;
      }
      vertices.needsUpdate = true;
      geometry.boundingSphere = null;
      geometry.boundingBox = null;
    },
  };
}

export function endpointOffset(out,endpoint,node,poses,position=node.position) {
  return out.copy(endpoint).add(position).sub(node.position)
    .applyMatrix4(poses.get(node.layer).matrix).sub(endpoint);
}
