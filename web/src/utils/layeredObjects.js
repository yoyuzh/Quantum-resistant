import {
  BoxGeometry, BufferGeometry, CanvasTexture, CapsuleGeometry, Color, CylinderGeometry, DoubleSide, ExtrudeGeometry, Group, IcosahedronGeometry,
  InstancedMesh, Line, LineBasicMaterial, LineDashedMaterial, LineSegments, Mesh, MeshBasicMaterial, MeshPhysicalMaterial,
  MeshStandardMaterial, Object3D, OctahedronGeometry, PlaneGeometry, ShaderMaterial,
  Shape, SphereGeometry, SRGBColorSpace, TubeGeometry, Vector3,
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
    object.userData.ownedTexture?.dispose();
    if (object.isInstancedMesh) object.dispose();
  });
  for (const item of geometry) item.dispose();
  for (const item of materials) item.dispose();
  root.clear();
}

function atlasPlate({width,height,center,index,caption:label}, ink, dark) {
  const sheet = new Group();
  sheet.position.copy(center);
  sheet.position.z -= 1;
  const faceColor = dark ? ['#163d3b','#1c3454','#352845'][index] : ['#b7ddd2','#c5dcf3','#d8caed'][index];
  const face = new MeshBasicMaterial({
    color:faceColor, transparent:true, opacity:1, depthWrite:false, toneMapped:false,
  });
  const side = new MeshBasicMaterial({ color:new Color(faceColor).lerp(new Color(ink),.56),
    transparent:true, depthWrite:false, toneMapped:false });
  const slab = new Mesh(new BoxGeometry(width,height,23),[side,side,side,side,face,face]);
  slab.position.z = -11.5;
  slab.renderOrder = -3;
  sheet.add(slab);

  const canvas = document.createElement('canvas');
  canvas.width = 280;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.font = 'bold 45px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = dark ? '#f3edf8' : ['#164e44','#284a74','#51336f'][index];
  ctx.fillText(['领域分类','仓库矩阵','密码算法'][index],140,32);
  const map = new CanvasTexture(canvas);
  map.colorSpace = SRGBColorSpace;
  const caption = new Mesh(new PlaneGeometry(label.size[0],label.size[1]),new MeshBasicMaterial({
    map, transparent:true, depthWrite:false, toneMapped:false,
  }));
  caption.position.copy(label.position).sub(sheet.position);
  caption.renderOrder = -1;
  caption.userData.ownedTexture = map;
  sheet.add(caption);
  return {sheet,slab};
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

function beamMaterial(edge, ink, dashed) {
  if (!dashed && edge.status !== 'ai_assessed') {
    return new MeshBasicMaterial({ color: ink, transparent: true, depthWrite: false });
  }
  return new ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { ink: { value: ink }, opacity: { value: 1 }, time: { value: 0 },
      dashCount: { value: edge.branch ? 12 : 17 },
      duty: { value: edge.status==='pending' && !edge.branch ? .37 : .66 } },
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
      uniform float dashCount;
      uniform float duty;
      void main() {
        float dash = fract(progress * dashCount - time);
        if (dash > duty) discard;
        gl_FragColor = vec4(ink, opacity);
      }
    `,
  });
}

function makePipe(edge, dark, atlas, strength) {
  const color = new Color(atlas && edge.branch ? (dark ? '#69cbb4' : '#20836d') : edge.color || '#4b846d');
  if (dark) color.lerp(new Color('#bdd4ff'), .20);
  else if (atlas && strength) color.lerp(new Color('#263f58'), strength===2 ? .22 : .10);
  const dashed = edge.branch || edge.status === 'pending' || edge.label === '关联' || edge.status === 'legacy';
  const line = dashed && !strength;
  const radius = strength===2 ? Math.max(3.6,edge.band*.78) : strength ? Math.max(1.8,edge.band*.61)
    : atlas ? Math.max(.92,edge.band/2) : edge.band/2;
  const object = line
    ? new Line(new BufferGeometry().setFromPoints(edge.curve.getPoints(36)),
      new LineDashedMaterial({ color, dashSize: edge.branch ? 13 : 6, gapSize: edge.branch ? 6 : 5,
        transparent: true, depthWrite: false }))
    : new Mesh(new TubeGeometry(edge.curve,24,radius,5,false),beamMaterial(edge,color.clone(),dashed));
  object.renderOrder = strength;
  if (line) object.computeLineDistances();
  object.userData.edge = edge;
  return { edge, object, color, line, strength, motion:pipeMotion(object.geometry,edge.curve,line) };
}

const MAX_DRAWN_EDGES = 420;

export function edgePlan(layout, focus, near) {
  const direct = [], rest = [];
  for (const edge of layout.links) (focus.has(edge.id) || edge.branch ? direct : rest).push(edge);
  const budget = near ? MAX_DRAWN_EDGES : 180;
  // The remaining relationships stay in the Worker graph and resolve when their node is selected.
  rest.sort((a,b) => b.band - a.band);
  return [...direct, ...rest].slice(0, budget);
}

export function pickSpatialTarget(ray, surfaces, edges = []) {
  const hit = ray.intersectObjects(surfaces,false)[0];
  const id = hit?.object.userData.ids?.[hit.instanceId];
  if (id) return {id,edge:false};
  const relation = hit?.object.userData.edge ?? ray.intersectObjects(edges,false)[0]?.object.userData.edge;
  return relation ? {id:relation.id,edge:true} : null;
}

export function makeLayers(layout, { variant, dark, textures }) {
  const root = new Group();
  const atlas = variant==='atlas';
  const planeColors = atlas ? (dark ? ['#5ab4a2','#82a5ed','#b99adb'] : ['#277767','#456ab3','#8053a8'])
    : ['#3d9b8d','#668ace','#8e71b0'];
  const quietBase = new Color(dark ? '#445664' : '#778e97');
  const padColors = dark ? ['#31605b','#3a587e','#68547d'] : ['#8dbdab','#99b9d7','#b5a0d6'];
  const plates = layout.layers.map(layer => {
    const ink = planeColors[layer.index];
    const {sheet,slab} = atlas ? atlasPlate(layer,ink,dark) : {sheet:plate(layer,ink,dark)};
    const group = new Group();
    group.matrixAutoUpdate = false;
    group.add(sheet);
    const materials = [...new Set(sheet.children.flatMap(object=>[object.material].flat()))];
    return { layer, sheet, slab, group, paints: materials.map(material=>[material,material.opacity]) };
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
    const detail = atlas && layer.kind==='algorithm' ? {} : (textures[layer.kind] ?? textures.algorithm);
    const surface = new MeshStandardMaterial({
      ...detail,
      color: 0xffffff, metalness: atlas ? .10 : .27, roughness: .86, emissive: 0x263c40, emissiveIntensity: .08,
    });
    const twoSidedFinish = layer.kind === 'category' || layer.kind === 'file';
    const finish = twoSidedFinish && !atlas ? [surface, new MeshStandardMaterial({
      color: 0x85949e, metalness: .32, roughness: .47,
    })] : surface;
    // A single material batches the muted instances in one pass.
    const active = new InstancedMesh(geometry, finish, nodes.length);
    const quiet = new InstancedMesh(geometry, new MeshStandardMaterial({
      color: 0xffffff, metalness: .08, roughness: .65,
      transparent: !atlas, opacity: atlas ? 1 : .17, depthWrite: atlas,
    }), nodes.length);
    const current = atlas ? new InstancedMesh(geometry,new MeshPhysicalMaterial({
      ...detail,
      roughness: dark ? .54 : .43, metalness: .12, clearcoat: .42, clearcoatRoughness: .36,
      emissiveIntensity: dark ? .14 : .04,
    }),1) : null;
    const meshes = current ? [active,quiet,current] : [active,quiet];
    for (const mesh of meshes) {
      mesh.count = 0;
      mesh.frustumCulled = false;
      mesh.userData.ids = [];
      groups.get(layer.index).add(mesh);
    }
    let pads;
    if (atlas) {
      const padGeometry = layer.kind==='file' ? new RoundedBoxGeometry(1,1,1,2,.13)
        : new CylinderGeometry(.48,.5,1,layer.kind==='category' ? 6 : 32).rotateX(Math.PI/2);
      if (layer.kind==='category') padGeometry.rotateZ(Math.PI/6);
      pads = new InstancedMesh(padGeometry,new MeshBasicMaterial({
        side:DoubleSide, toneMapped:false,
      }),nodes.length);
      pads.count = 0;
      pads.frustumCulled = false;
      pads.userData.ids = [];
      groups.get(layer.index).add(pads);
    }
    const padInk = atlas ? new Color(padColors[layer.index]) : null;
    const currentPadInk = padInk?.clone().lerp(new Color(planeColors[layer.index]),.36);
    pools.set(layer.index,{nodes,active,quiet,current,meshes,pads,padInk,currentPadInk});
  }
  const particles = new InstancedMesh(new IcosahedronGeometry(2.6,0),new MeshBasicMaterial({
    color: new Color('#b4fff0').multiplyScalar(1.55), transparent: true, opacity: dark ? .93 : .78,
  }), 100);
  particles.frustumCulled = false;
  particles.count = 0;
  root.add(particles);
  const ports = atlas && new InstancedMesh(new SphereGeometry(1,12,8),new MeshBasicMaterial({
    transparent:true, opacity:.9, depthTest:false, depthWrite:false, toneMapped:false,
  }),2*MAX_DRAWN_EDGES);
  const portTips = ports && new InstancedMesh(ports.geometry,new MeshBasicMaterial({
    color:'#f2f8fc', transparent:true, opacity:.98, depthTest:false, depthWrite:false, toneMapped:false,
  }),2*MAX_DRAWN_EDGES);
  if (ports) {
    for (const mesh of [ports,portTips]) {
      mesh.count = 0;
      mesh.frustumCulled = false;
    }
    ports.renderOrder = 3;
    portTips.renderOrder = 4;
    root.add(ports,portTips);
  }
  const portNodes = new Set(), portInk = new Color();
  const portShade = new Color(dark ? '#bef4e8' : '#123d46');
  let pipes = [];
  let lastFocus, lastSelected, lastLayer, lastProgress;
  const from = new Vector3(), to = new Vector3();

  function setEdges(plan, focus, selectedEdge) {
    disposeObjects(pipeGroup);
    pipes = plan.map(edge=>makePipe(edge,dark,atlas,
      atlas && focus.has(edge.id) ? (edge.id===selectedEdge ? 2 : 1) : 0));
    if (pipes.length) pipeGroup.add(...pipes.map(p=>p.object));
  }
  function update({ positions, repositioned, focus, selected, layer, progress, poses, now, effects }) {
    const hasFocus = focus.nodes.size > 0;
    const changed = lastFocus!==focus || lastSelected!==selected || lastLayer!==layer || lastProgress!==progress || repositioned;
    for (const [index,group] of groups) {
      group.matrix.copy(poses.get(index).matrix);
      group.matrixWorldNeedsUpdate = true;
    }
    lastFocus = focus;
    lastSelected = selected;
    lastLayer = layer;
    lastProgress = progress;
    if (changed) {
      for (const {nodes,active,quiet,current,meshes,pads,padInk,currentPadInk} of pools.values()) {
        if (pads) {
          pads.count = 0;
          pads.userData.ids.length = 0;
        }
        for (const mesh of meshes) {
          mesh.count = 0;
          mesh.userData.ids.length = 0;
        }
        for (const node of nodes) {
          if (layer!==null && node.layer!==layer) continue;
          const live = !hasFocus || focus.nodes.has(node.id);
          const isCurrent = current && node.id===selected;
          const mesh = isCurrent ? current : live ? active : quiet;
          const idx = mesh.count++;
          const position = positions.get(node.id) ?? node.position;
          const scale = node.parent && layer===null ? Math.max(.32, progress) : 1;
          obj.position.copy(position);
          obj.scale.fromArray(node.size).multiplyScalar(scale);
          obj.updateMatrix();
          mesh.setMatrixAt(idx,obj.matrix);
          const c = new Color(node.tint);
          if (atlas && !live && !isCurrent) c.lerp(quietBase,.42);
          if (node.row && !node.total) {
            if (atlas) c.lerp(quietBase,.75);
            else c.multiplyScalar(.38);
          }
          if (isCurrent) {
            c.multiplyScalar(dark ? 1.24 : .48);
            current.material.emissive.copy(c);
          }
          mesh.setColorAt(idx,c);
          mesh.userData.ids.push(node.id);
          if (pads && (!node.parent || progress===1 || layer!==null)) {
            obj.position.z = node.position.z+.15;
            obj.scale.set(node.size[0]*1.15,node.size[1]*1.15,2.3);
            obj.updateMatrix();
            pads.setMatrixAt(pads.count,obj.matrix);
            pads.setColorAt(pads.count++,isCurrent ? currentPadInk : padInk);
            pads.userData.ids.push(node.id);
          }
        }
        if (pads) {
          pads.instanceMatrix.needsUpdate = true;
          if (pads.instanceColor) pads.instanceColor.needsUpdate = true;
          pads.boundingSphere = null;
        }
        for (const mesh of meshes) {
          mesh.instanceMatrix.needsUpdate = true;
          if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
          // The buffers are repacked for each focus state, so cached ray bounds are obsolete.
          mesh.boundingSphere = null;
        }
      }
    }

    particles.count = 0;
    if (ports) { ports.count = portTips.count = 0; portNodes.clear(); }
    for (const {edge,object,color,line,strength,motion} of pipes) {
      object.visible = layer===null || (edge.from.layer===layer && edge.to.layer===layer);
      if (!object.visible) continue;
      const branchEnd = edge.branch && progress<1 ? undefined : positions.get(edge.target);
      motion.update(endpointOffset(from,edge.curve.v0,edge.from,poses,positions.get(edge.source)),
        endpointOffset(to,edge.curve.v3,edge.to,poses,branchEnd));
      const active = focus.edges.has(edge.id);
      const arriving = edge.from.parent || edge.to.parent;
      const alpha = hasFocus ? (active ? (strength ? 1 : .9) : (atlas ? .09 : .08))
        : edge.branch ? .72 : dark ? .53 : .62;
      const phase = arriving && !edge.branch ? Math.max(0,(progress-.65)/.35) : 1;
      const ink = color.clone().multiplyScalar(active ? (atlas ? 1.12 : 1.72) : 1);
      if (object.material.uniforms) {
        object.material.uniforms.opacity.value = alpha * phase;
        if (effects && edge.status==='ai_assessed') object.material.uniforms.time.value = now / 840;
        object.material.uniforms.ink.value.copy(ink);
      } else {
        object.material.opacity = alpha * phase;
        object.material.color.copy(ink);
      }
      if (edge.branch) {
        const total = object.geometry.index?.count;
        object.geometry.setDrawRange(0,total ? Math.floor(total*progress/3)*3 : Math.floor(37*progress));
      }
      if (ports && strength && active && progress===1) {
        const mark = (node,end,point,offset) => {
          const key = node.id + end;
          if (portNodes.has(key)) return;
          portNodes.add(key);
          obj.position.copy(point).add(offset);
          obj.scale.setScalar(strength===2 ? 9.4 : 5.5);
          obj.updateMatrix();
          ports.setMatrixAt(ports.count,obj.matrix);
          ports.setColorAt(ports.count++,portInk.copy(color).lerp(portShade,.32));
          obj.scale.multiplyScalar(.43);
          obj.updateMatrix();
          portTips.setMatrixAt(portTips.count++,obj.matrix);
        };
        mark(edge.from,'start',edge.curve.v0,motion.from);
        mark(edge.to,'end',edge.curve.v3,motion.to);
      }
      if (effects && !line && !edge.branch && edge.status!=='ai_assessed' && phase>.36 &&
          (!hasFocus || active) && particles.count<100) {
        const t = (now / 1250 + particles.count * .183) % 1;
        movePipePoint(edge.curve.getPoint(t,obj.position),t,motion.from,motion.to);
        obj.scale.setScalar(1);
        obj.updateMatrix();
        particles.setMatrixAt(particles.count++,obj.matrix);
      }
    }
    if (ports?.count) {
      ports.instanceMatrix.needsUpdate = true;
      ports.instanceColor.needsUpdate = true;
      portTips.instanceMatrix.needsUpdate = true;
    }
    if (particles.count) particles.instanceMatrix.needsUpdate = true;
    for (const {sheet, layer: board, paints} of plates) {
      sheet.visible = layer===null || board.index===layer;
      const fade = variant==='atlas' && board.kind==='file' ? Math.min(1, progress*1.85) : 1;
      for (const [material,opacity] of paints) material.opacity = opacity*fade;
    }
  }

  const nodeMeshes = [...pools.values()].flatMap(({meshes,pads})=>pads ? [...meshes,pads] : meshes);
  const pickableEdges = () => pipes.filter(p=>p.object.visible && !p.edge.branch).map(p=>p.object);
  function pick(ray) {
    const edges = pickableEdges();
    if (!atlas) return pickSpatialTarget(ray,[...nodeMeshes,...edges]);
    // Atlas slabs can hide rear nodes even though relation lines are drawn over the slabs.
    const slabs = plates.filter(({sheet})=>sheet.visible).map(({slab})=>slab);
    return pickSpatialTarget(ray,[...nodeMeshes,...slabs],edges);
  }
  return { root, setEdges, update, pickableEdges, pick };
}
