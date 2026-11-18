import {
  BufferGeometry, CapsuleGeometry, Color, DoubleSide, EdgesGeometry, ExtrudeGeometry, Group, IcosahedronGeometry,
  InstancedMesh, Line, LineBasicMaterial, LineDashedMaterial, LineSegments, Mesh, MeshBasicMaterial,
  MeshStandardMaterial, Object3D, OctahedronGeometry, PlaneGeometry, ShaderMaterial, Shape, TorusGeometry,
  TubeGeometry, Vector3,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { endpointOffset, movePipePoint, pipeMotion } from './spatialPipeMotion.js';

function facingUV(geometry) {
  const position = geometry.getAttribute('position'), uv = geometry.getAttribute('uv');
  for (let i = 0; i < position.count; i++) uv.setXY(i, position.getX(i) + .5, position.getY(i) + .5);
  return geometry;
}

function badgeGeometry() {
  const outline = new Shape();
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3;
    outline[i ? 'lineTo' : 'moveTo'](.428 * Math.cos(angle), .428 * Math.sin(angle));
  }
  outline.closePath();
  return facingUV(new ExtrudeGeometry(outline, {
    depth: .84, bevelEnabled: true, bevelThickness: .08, bevelSize: .066, bevelSegments: 3,
  }).translate(0, 0, -.42));
}

function repositoryGeometry() {
  const geometry = new RoundedBoxGeometry(1, 1, 1, 3, .18);
  // Keep the top cap polished and the sidewalls in a darker finish.
  for (const face of geometry.groups) face.materialIndex = face.materialIndex === 4 ? 0 : 1;
  return geometry;
}

const kinds = {
  category: badgeGeometry,
  file: repositoryGeometry,
  algorithm: () => facingUV(new IcosahedronGeometry(.5, 3)),
  reference: () => facingUV(new OctahedronGeometry(.5, 1)),
};

export function disposeObjects(root) {
  const geometry = new Set(), materials = new Set();
  root.traverse(object => {
    if (object.geometry) geometry.add(object.geometry);
    if (Array.isArray(object.material)) object.material.forEach(item => materials.add(item));
    else if (object.material) materials.add(object.material);
    if (object.isInstancedMesh) object.dispose();
  });
  for (const item of geometry) item.dispose();
  for (const item of materials) item.dispose();
  root.clear();
}

function plate(layer, ink, dark) {
  const sheet = new Group();
  const { width, height } = layer;
  sheet.position.copy(layer.center);
  sheet.position.z -= 1;
  const face = new Mesh(new PlaneGeometry(width, height), new MeshBasicMaterial({
    color: ink, side: DoubleSide, transparent: true, opacity: dark ? .055 : .073, depthWrite: false,
  }));
  face.renderOrder = -3;
  sheet.add(face);
  const hw = width / 2, hh = height / 2, points = [];
  for (let x = -hw + 22; x < hw; x += 32) points.push(new Vector3(x, -hh, 0), new Vector3(x, hh, 0));
  for (let y = -hh + 22; y < hh; y += 32) points.push(new Vector3(-hw, y, 0), new Vector3(hw, y, 0));
  sheet.add(new LineSegments(new BufferGeometry().setFromPoints(points),
    new LineBasicMaterial({ color: ink, transparent: true, opacity: dark ? .12 : .16, depthWrite: false })));
  const border = [[-hw,-hh], [hw,-hh], [hw,hh], [-hw,hh], [-hw,-hh]];
  sheet.add(new Line(new BufferGeometry().setFromPoints(border.map(([x,y]) => new Vector3(x,y,0))),
    new LineBasicMaterial({ color: ink, transparent: true, opacity: dark ? .52 : .48 })));
  return sheet;
}

function beamMaterial(edge, ink) {
  if (edge.status !== 'ai_assessed') {
    return new MeshBasicMaterial({ color: ink, transparent: true, depthWrite: false });
  }
  return new ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { ink: { value: ink }, opacity: { value: 1 }, time: { value: 0 } },
    vertexShader: `
      varying float progress;
      void main() {
        progress = uv.x;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying float progress;
      uniform vec3 ink;
      uniform float opacity;
      uniform float time;
      void main() {
        float dash = fract(progress * 17.0 - time);
        if (dash > .66) discard;
        gl_FragColor = vec4(ink, opacity);
      }
    `,
  });
}

function makePipe(edge, dark) {
  const color = new Color(edge.color || '#4b846d');
  if (dark) color.lerp(new Color('#bdd4ff'), .20);
  const line = edge.branch || edge.status === 'pending' || edge.label === '关联' || edge.status === 'legacy';
  const object = line
    ? new Line(new BufferGeometry().setFromPoints(edge.curve.getPoints(36)),
      new LineDashedMaterial({ color, dashSize: edge.branch ? 13 : 6, gapSize: edge.branch ? 6 : 5,
        transparent: true, depthWrite: false }))
    : new Mesh(new TubeGeometry(edge.curve, 24, edge.band / 2, 5, false), beamMaterial(edge, color.clone()));
  if (line) object.computeLineDistances();
  object.userData.edge = edge;
  return { edge, object, color, line, motion:pipeMotion(object.geometry,edge.curve,line) };
}

export function edgePlan(layout, focus, near) {
  const direct = [], rest = [];
  for (const edge of layout.links) (focus.has(edge.id) || edge.branch ? direct : rest).push(edge);
  const budget = near ? 420 : 180;
  // The remaining relationships stay in the Worker graph and resolve when their node is selected.
  rest.sort((a,b) => b.band - a.band);
  return [...direct, ...rest].slice(0, budget);
}

export function makeLayers(layout, { variant, dark, textures }) {
  const root = new Group();
  const planeColors = ['#3d9b8d','#668ace','#8e71b0'];
  const plates = layout.layers.map(layer => {
    const sheet = plate(layer, planeColors[layer.index], dark);
    const group = new Group();
    group.matrixAutoUpdate = false;
    group.add(sheet);
    return { layer, sheet, group, opacities: sheet.children.map(object => object.material.opacity) };
  });
  root.add(...plates.map(item => item.group));
  const groups = new Map(plates.map(item=>[item.layer.index,item.group]));
  const pipeGroup = new Group();
  root.add(pipeGroup);
  const pools = new Map();
  const obj = new Object3D();
  for (const layer of layout.layers) {
    const nodes = [...layout.nodes.values()].filter(node=>node.layer===layer.index);
    if (!nodes.length) continue;
    const geometry = variant !== 'atlas' && layer.kind === 'algorithm'
      ? facingUV(new CapsuleGeometry(.28,.45,6,16).rotateZ(Math.PI/2)) : kinds[layer.kind]();
    const surface = new MeshStandardMaterial({
      ...(textures[layer.kind] ?? textures.algorithm),
      color: 0xffffff, metalness: .27, roughness: .86, emissive: 0x263c40, emissiveIntensity: .08,
    });
    const twoSidedFinish = layer.kind === 'category' || layer.kind === 'file';
    const finish = twoSidedFinish ? [surface, new MeshStandardMaterial({
      color: 0x85949e, metalness: .32, roughness: .47,
    })] : surface;
    // A single material batches the muted instances in one pass.
    const active = new InstancedMesh(geometry, finish, nodes.length);
    const quiet = new InstancedMesh(geometry, new MeshStandardMaterial({
      color: 0xffffff, metalness: .08, roughness: .65, transparent: true, opacity: .17, depthWrite: false,
    }), nodes.length);
    for (const mesh of [active,quiet]) {
      mesh.count = 0;
      mesh.frustumCulled = false;
      mesh.userData.ids = [];
      groups.get(layer.index).add(mesh);
    }
    pools.set(layer.index,{nodes,active,quiet});
  }
  const rings = new Map(), outlines = new Map();
  if (variant === 'atlas') {
    const geometry = new TorusGeometry(.68, .014, 5, 36);
    const rounded = new RoundedBoxGeometry(1,1,1,3,.14);
    const border = new EdgesGeometry(rounded,26);
    rounded.dispose();
    for (const node of layout.nodes.values()) if (node.kind === 'algorithm') {
      const ring = new Mesh(geometry, new MeshBasicMaterial({ color: new Color(node.tint).multiplyScalar(1.6),
        transparent: true, opacity: .8, depthWrite: false }));
      ring.rotation.x = .58;
      ring.rotation.y = -.29;
      groups.get(node.layer).add(ring);
      rings.set(node.id,ring);
    }
    if (!rings.size) geometry.dispose();
    for (const node of layout.nodes.values()) if (node.row) {
      const score = Math.max(0,Math.min(100,Number(node.row.repo.migration_score) || 0));
      const outline = new LineSegments(border,new LineBasicMaterial({
        color:new Color('#a8c9ee').multiplyScalar(1 + score/110), transparent:true, opacity:.12+score*.005,
        depthWrite:false,
      }));
      groups.get(node.layer).add(outline);
      outlines.set(node.id,outline);
    }
    if (!outlines.size) border.dispose();
  }
  const particles = new InstancedMesh(new IcosahedronGeometry(2.6,0),new MeshBasicMaterial({
    color: new Color('#b4fff0').multiplyScalar(1.55), transparent: true, opacity: dark ? .93 : .78,
  }), 100);
  particles.frustumCulled = false;
  particles.count = 0;
  root.add(particles);
  let pipes = [];
  let lastFocus, lastLayer, lastProgress;
  const from = new Vector3(), to = new Vector3();

  function setEdges(plan) {
    disposeObjects(pipeGroup);
    pipes = plan.map(edge=>makePipe(edge,dark));
    if (pipes.length) pipeGroup.add(...pipes.map(p=>p.object));
  }
  function update({ positions, repositioned, focus, layer, progress, poses, now, effects }) {
    const hasFocus = focus.nodes.size > 0;
    const changed = lastFocus!==focus || lastLayer!==layer || lastProgress!==progress || repositioned;
    for (const [index,group] of groups) {
      group.matrix.copy(poses.get(index).matrix);
      group.matrixWorldNeedsUpdate = true;
    }
    lastFocus = focus;
    lastLayer = layer;
    lastProgress = progress;
    if (changed) {
      for (const {nodes,active,quiet} of pools.values()) {
        for (const mesh of [active,quiet]) {
          mesh.count = 0;
          mesh.userData.ids.length = 0;
        }
        for (const node of nodes) {
          if (layer!==null && node.layer!==layer) continue;
          const live = !hasFocus || focus.nodes.has(node.id);
          const mesh = live ? active : quiet;
          const idx = mesh.count++;
          const position = positions.get(node.id) ?? node.position;
          const scale = node.parent && layer===null ? Math.max(.32, progress) : 1;
          obj.position.copy(position);
          obj.scale.fromArray(node.size).multiplyScalar(scale);
          obj.updateMatrix();
          mesh.setMatrixAt(idx,obj.matrix);
          const c = new Color(node.tint);
          if (node.row && !node.total) c.multiplyScalar(.38);
          mesh.setColorAt(idx,c);
          mesh.userData.ids.push(node.id);
        }
        for (const mesh of [active,quiet]) {
          mesh.instanceMatrix.needsUpdate = true;
          if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
          // The buffers are repacked for each focus state, so cached ray bounds are obsolete.
          mesh.boundingSphere = null;
        }
      }
      for (const [id,outline] of outlines) {
        const node = layout.nodes.get(id);
        outline.visible = (layer===null || layer===node.layer) && (!hasFocus || focus.nodes.has(id));
        outline.position.copy(positions.get(id) || node.position);
        outline.scale.fromArray(node.size).multiplyScalar(1.024*Math.max(.32,progress));
      }
    }
    for (const [id,ring] of rings) {
      const node = layout.nodes.get(id);
      ring.position.copy(positions.get(id) || node.position);
      if (effects) ring.rotation.z = now * .00022;
      ring.scale.setScalar(node.size[0]);
      const active = focus.nodes.has(id);
      ring.visible = (layer===null || node.layer===layer) && active;
      ring.material.opacity = .63;
    }

    particles.count = 0;
    for (const {edge,object,color,line,motion} of pipes) {
      object.visible = layer===null || (edge.from.layer===layer && edge.to.layer===layer);
      if (!object.visible) continue;
      const branchEnd = edge.branch && progress<1 ? undefined : positions.get(edge.target);
      motion.update(endpointOffset(from,edge.curve.v0,edge.from,poses,positions.get(edge.source)),
        endpointOffset(to,edge.curve.v3,edge.to,poses,branchEnd));
      const active = focus.edges.has(edge.id);
      const arriving = edge.from.parent || edge.to.parent;
      const alpha = hasFocus ? active ? .9 : .08 : edge.branch ? .72 : dark ? .53 : .62;
      const phase = arriving && !edge.branch ? Math.max(0,(progress-.65)/.35) : 1;
      const ink = color.clone().multiplyScalar(active ? 1.72 : 1);
      if (object.material.uniforms) {
        object.material.uniforms.opacity.value = alpha * phase;
        if (effects) object.material.uniforms.time.value = now / 840;
        object.material.uniforms.ink.value.copy(ink);
      } else {
        object.material.opacity = alpha * phase;
        object.material.color.copy(ink);
      }
      if (edge.branch) object.geometry.setDrawRange(0,Math.max(0,Math.floor(37*progress)));
      if (effects && !line && edge.status!=='ai_assessed' && phase>.36 &&
          (!hasFocus || active) && particles.count<100) {
        const t = (now / 1250 + particles.count * .183) % 1;
        movePipePoint(edge.curve.getPoint(t,obj.position),t,motion.from,motion.to);
        obj.scale.setScalar(1);
        obj.updateMatrix();
        particles.setMatrixAt(particles.count++,obj.matrix);
      }
    }
    if (particles.count) particles.instanceMatrix.needsUpdate = true;
    for (const {sheet, layer: board, opacities} of plates) {
      sheet.visible = layer===null || board.index===layer;
      const fade = variant==='atlas' && board.kind==='file' ? Math.min(1, progress*1.85) : 1;
      sheet.children.forEach((object, i) => { object.material.opacity = opacities[i]*fade; });
    }
  }

  return { root, setEdges, update, pickables:()=>[...[...pools.values()].flatMap(({active,quiet})=>[active,quiet]),
    ...pipes.filter(p=>p.object.visible && !p.edge.branch).map(p=>p.object)] };
}
