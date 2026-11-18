import {
  ACESFilmicToneMapping, AmbientLight, Color, DirectionalLight, Euler, Matrix4, OrthographicCamera, PerspectiveCamera,
  Quaternion, Raycaster, Scene, Spherical, Vector2, Vector3, WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { gsap } from 'gsap';
import { layeredLayout, spatialFocus } from '../composables/useLayered3DLayout.js';
import { createSpatialLabels } from './layeredLabels.js';
import { cameraShot, createViewSettle, followLayerAim, layerAim, layerPoses, SPATIAL_FOV } from './layeredCamera.js';
import { disposeObjects, edgePlan, makeLayers } from './layeredObjects.js';
import { createLayeredTextures } from './layeredTextures.js';
import { solveLayerSpacing, solveSpatialReflow, spatialProjection } from './spatialReflow.js';
import { endpointOffset, movePipePoint } from './spatialPipeMotion.js';

export function createLayeredRenderer(host, { variant, fullscreen, onLabels, onPick, onStats, onExportReady, onLost }) {
  const scene = new Scene();
  const renderer = new WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
  const gl = renderer.getContext();
  const debug = gl.getExtension('WEBGL_debug_renderer_info');
  const software = Boolean(debug && /swiftshader|llvmpipe|softpipe|lavapipe|software rasterizer/i.test(
    gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)));
  const textures = createLayeredTextures();
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.16;
  renderer.domElement.className = 'spatial-webgl';
  host.append(renderer.domElement);
  renderer.domElement.addEventListener('webglcontextlost', onLost);
  const overlay = new CSS2DRenderer();
  overlay.domElement.className = 'spatial-overlay';
  overlay.domElement.style.display = 'none';
  host.append(overlay.domElement);
  const labels = createSpatialLabels(scene, onLabels);

  const perspective = new PerspectiveCamera(SPATIAL_FOV,1,1,18000);
  const orthographic = new OrthographicCamera(-1,1,1,-1,1,18000);
  let camera = perspective;
  camera.position.set(620,760,1250);
  const controls = new OrbitControls(camera,renderer.domElement);
  controls.enableDamping = !software;
  controls.dampingFactor = .105;
  controls.zoomToCursor = true;
  controls.minDistance = 75;
  controls.maxDistance = 16000;
  controls.minZoom = .35;
  controls.maxZoom = 8;
  controls.maxPolarAngle = Math.PI * .95;
  const composer = new EffectComposer(renderer);
  if (variant==='atlas' && !software) {
    const supported = gl.getInternalformatParameter(gl.RENDERBUFFER,gl.RGBA16F,gl.SAMPLES);
    const samples = supported?.find(value=>value<=4) || 0;
    composer.renderTarget1.samples = composer.renderTarget2.samples = samples;
  }
  const renderPass = new RenderPass(scene,camera);
  const bloom = new UnrealBloomPass(new Vector2(1,1),.36,.46,.90);
  const output = new OutputPass();
  composer.addPass(renderPass);
  composer.addPass(bloom);
  composer.addPass(output);

  const ray = new Raycaster();
  ray.params.Line.threshold = 4;
  const pointer = new Vector2();
  let press = null;
  const unfocused = {nodes:new Set(),edges:new Set()};
  let dark = false, data, layout, objects, focus = unfocused;
  let selected = '', selectedEdge = '', review = null, width = 0, height = 0, orthoHeight = 600;
  let visible = true, frame = 0, lastLabels = -Infinity, near, tiledLabels = new Map();
  let cameraTween, motionTween, motion = {progress:1}, positions = new Map();
  let turnGoal = null, orbitStart;
  let fitOrbit = true;
  const attitude = new Quaternion();
  const angles = new Euler(0,0,0,'YXZ'), aim = new Euler(), viewNormal = new Vector3();
  const offsets = new Map(), observedView = new Matrix4(), observedProjection = new Matrix4(), origin = new Vector3();
  const paintedView = new Matrix4(), paintedProjection = new Matrix4();
  const paintedAttitude = new Quaternion(), noSpacing = new Map();
  const branchStart = new Vector3(), branchEnd = new Vector3();
  let spacing = new Map(), spacingMotion, needsNodePlan = false;
  const settle = createViewSettle();
  let desired = new Map(), hints = new Map(), lastFrame = 0, effectsUntil = 0;
  let settleTimer, arrangeUntil = 0, interacting = false, showLabels = false, exportReady = false;
  function setExportReady(value) {
    if (exportReady===value) return;
    exportReady = value;
    onExportReady(value);
  }
  let bodyLayout, bodyProgress, bodyReview, bodies = [], labelMotion = {moving:false,visible:0};
  const starts = new Map();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const allowMotion = () => !software && !reduced.matches;
  const light = new AmbientLight(variant==='atlas' ? 0xffffff : 0xc9e9ff,2.0);
  const rim = new DirectionalLight(variant==='atlas' ? 0xfff2e3 : 0xd5ffef,2.2);
  rim.position.set(170,740,1200);
  scene.add(light,rim);

  function invalidate() {
    if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw);
  }
  function playEffects() {
    setExportReady(false);
    effectsUntil = performance.now()+1000;
    invalidate();
  }
  function updateOrtho() {
    orthographic.left = -orthoHeight*width/height/2;
    orthographic.right = -orthographic.left;
    orthographic.top = orthoHeight/2;
    orthographic.bottom = -orthographic.top;
    orthographic.updateProjectionMatrix();
  }
  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h || (w===width && h===height)) return;
    const compactChanged = (width < 660)!==(w < 660);
    width = w;
    height = h;
    const preferredDpr = Math.min(devicePixelRatio || 1,width < 720 ? 1.25 : 1.6);
    const pixelBudget = software ? 650_000 : 2_500_000;
    const dpr = Math.min(preferredDpr,Math.sqrt(pixelBudget/(width*height)));
    renderer.setPixelRatio(dpr);
    renderer.setSize(width,height);
    composer.setPixelRatio(dpr);
    composer.setSize(width,height);
    overlay.setSize(width,height);
    perspective.aspect = width/height;
    perspective.updateProjectionMatrix();
    updateOrtho();
    if (layout && compactChanged) rebuild();
    else if (layout) fly(false);
  }

  function fitAtlasOrbit(direction) {
    return cameraShot(layout,{aspect:width/height,variant,review,focus:[],compact:width<660,direction});
  }

  function fly(animate = true, direction) {
    if (!layout || !width || !height) return;
    fitOrbit = true;
    playEffects();
    settle.touch(performance.now());
    const nextCamera = review===null ? perspective : orthographic;
    if (camera!==nextCamera) {
      nextCamera.position.copy(camera.position);
      nextCamera.quaternion.copy(camera.quaternion);
      nextCamera.zoom = 1;
      camera = nextCamera;
      renderPass.camera = camera;
      controls.object = camera;
    }
    const shot = direction ? fitAtlasOrbit(direction)
      : cameraShot(layout,{aspect:width/height,variant,review,focus:[...focus.nodes],compact:width<660});
    stopCamera();
    const zoom = camera.zoom;
    const from = camera.position.clone(), target = controls.target.clone(), previousHeight = orthoHeight;
    const ease = {amount:0};
    function apply() {
      camera.position.lerpVectors(from,shot.position,ease.amount);
      controls.target.lerpVectors(target,shot.target,ease.amount);
      camera.zoom = zoom + (1-zoom)*ease.amount;
      orthoHeight = previousHeight + (shot.orthoHeight-previousHeight)*ease.amount;
      updateOrtho();
      controls.update();
      invalidate();
    }
    if (animate && allowMotion()) {
      cameraTween = gsap.to(ease,{amount:1,duration:.68,ease:'power3.inOut',onUpdate:apply,onComplete:()=>{ turnGoal = null; invalidate(); }});
    } else {
      ease.amount = 1;
      apply();
    }
  }

  function rebuild(animate = false, keepView = false) {
    if (!data) return;
    const next = keepView && layout ? layout : layeredLayout(data,variant,width<660);
    starts.clear();
    if (animate && data.expanded && allowMotion()) {
      for (const edge of next.links) if (edge.branch) starts.set(edge.target,edge);
    }
    motionTween?.kill();
    motion = {progress:starts.size ? 0 : 1};
    if (starts.size) motionTween = gsap.to(motion,{progress:1,duration:.68,ease:'power2.out',onUpdate:invalidate});
    positions = new Map();
    offsets.clear();
    spacing = new Map();
    spacingMotion = null;
    needsNodePlan = false;
    desired.clear();
    hints.clear();
    settle.touch(performance.now());
    if (objects) {
      scene.remove(objects.root);
      disposeObjects(objects.root);
    }
    labels.clear();
    lastLabels = -Infinity;
    layout = next;
    objects = makeLayers(layout,{variant,dark,textures});
    scene.add(objects.root);
    bloom.enabled = !software && layout.nodes.size < 360;
    if (!selectedEdge) focus = spatialFocus(layout,layout.nodes.has(selected) ? selected : data.expanded);
    host.dataset.planes = layout.layers.map(layer=>layer.depth).join(',');
    host.dataset.repositories = String(variant==='atlas'
      ? layout.layers.find(layer=>layer.kind==='file')?.data.length ?? 0 : 0);
    near = undefined;
    setLOD();
    if (!keepView) fly(animate);
    else setExportReady(false);
    invalidate();
  }

  function setLOD() {
    const effective = camera.isOrthographicCamera ? orthoHeight/camera.zoom
      : camera.position.distanceTo(controls.target)*.63;
    const value = effective < (near ? 690 : 620);
    if (near===value) return;
    near = value;
    objects.setEdges(edgePlan(layout,focus.edges,near),focus.edges,selectedEdge);
    lastLabels = -Infinity;
  }
  function updateSpacing(now, cameraMoving) {
    const changed = (one,two,translation)=>one.elements.some((value,i)=>
      Math.abs(value-two.elements[i])>(i>=12 && i<15 ? translation : .001));
    // Subpixel changes from the damping tail should not restart the label delay.
    if (cameraMoving || changed(camera.matrixWorld,observedView,.6) ||
        changed(camera.projectionMatrix,observedProjection,.001)) {
      observedView.copy(camera.matrixWorld);
      observedProjection.copy(camera.projectionMatrix);
      settle.touch(now);
    }
    if (!interacting && settle.take(now)) {
      const base = layerPoses(layout.layers,attitude,noSpacing);
      const target = review===null ? solveLayerSpacing(layout.layers,spatialProjection(camera,width,height,base),variant==='atlas') : noSpacing;
      const movedLayers = layout.layers.filter(({index})=>(spacing.get(index) || origin)
        .distanceToSquared(target.get(index) || origin)>.01);
      spacingMotion = movedLayers.length ? {from:spacing,target,start:now,layers:movedLayers} : null;
      if (!spacingMotion) spacing = target;
      needsNodePlan = true;
    }
    if (interacting || settle.pending || !spacingMotion) return false;
    const {from,target,start,layers} = spacingMotion;
    const t = allowMotion() ? Math.min(1,(now-start)/280) : 1;
    if (t===1) {
      spacing = new Map(target);
      spacingMotion = null;
    } else {
      spacing = new Map(from);
      const eased = t*t*(3-2*t);
      for (const {index} of layers) spacing.set(index,new Vector3()
        .lerpVectors(from.get(index) || origin,target.get(index) || origin,eased));
    }
    return t<1;
  }

  function reflow(now, projection, step) {
    if (settle.pending || spacingMotion) return {moved:false,moving:false};
    if (needsNodePlan) {
      needsNodePlan = false;
      arrangeUntil = now+260;
      if (allowMotion()) step = Math.min(step,.22);
      if (review===null && layout.nodes.size<96) {
        const plan = solveSpatialReflow(layout,projection,focus,variant,labels.size);
        desired = plan.offsets;
        hints = plan.hints;
      } else {
        desired.clear();
        hints.clear();
      }
    }
    if (now>=arrangeUntil) step = 1;
    let moved = false, moving = false;
    for (const id of new Set([...offsets.keys(),...desired.keys()])) {
      const target = desired.get(id) || origin;
      const offset = offsets.get(id) || new Vector3();
      if (offset.distanceToSquared(target)>.04 && step<1) {
        offset.lerp(target,step);
        moving = true;
        moved = true;
      } else if (!offset.equals(target)) {
        offset.copy(target);
        moved = true;
      }
      if (offset.lengthSq()===0) offsets.delete(id);
      else offsets.set(id,offset);
    }
    return {moved,moving};
  }

  function setLabelsVisible(visible) {
    if (showLabels===visible) return false;
    if (!visible && overlay.domElement.contains(document.activeElement)) host.focus({preventScroll:true});
    showLabels = visible;
    overlay.domElement.style.display = visible ? '' : 'none';
    lastLabels = -Infinity;
    return true;
  }

  function draw(now) {
    frame = 0;
    if (!objects || !width || !height) return;
    const dt = Math.max(1,now-lastFrame);
    lastFrame = now;
    const step = allowMotion() ? 1-Math.exp(-dt/65) : 1;
    controls.dampingFactor = 1-Math.pow(.895,dt/(1000/60));
    const damping = controls.update();
    camera.updateMatrixWorld();
    if (review===null) layerAim(aim,viewNormal.set(0,0,1).applyQuaternion(camera.quaternion),variant==='atlas');
    else aim.set(0,0,0,'YXZ');
    const turning = followLayerAim(angles,aim,review===null && allowMotion() ? dt : Infinity);
    attitude.setFromEuler(angles);
    setLOD();
    const cameraMoving = turning || cameraTween?.isActive() || motion.progress<1;
    const separating = updateSpacing(now,cameraMoving);
    const poses = layerPoses(layout.layers,attitude,spacing);
    const projection = spatialProjection(camera,width,height,poses,attitude);
    const {moved,moving} = reflow(now,projection,step);
    const labelVisibilityChanged = setLabelsVisible(!settle.pending && !spacingMotion && !moving);
    positions.clear();
    if (motion.progress < 1) {
      let index = 0;
      for (const [id,edge] of starts) {
        const {curve,from,to} = edge;
        const t = Math.min(1,Math.max(0,motion.progress*1.24-index++*.034));
        const point = movePipePoint(curve.getPoint(t),t,endpointOffset(branchStart,curve.v0,from,poses),
          endpointOffset(branchEnd,curve.v3,to,poses));
        positions.set(id,point.applyMatrix4(poses.get(to.layer).inverse)
          .addScaledVector(branchEnd.copy(to.position).sub(curve.v3),t));
      }
    } else {
      for (const [id,offset] of offsets) positions.set(id,layout.nodes.get(id).position.clone().add(offset));
    }
    const display = review===null ? focus : unfocused;
    const effects = allowMotion() && review===null && now<effectsUntil && layout.links.length>0;
    objects.update({positions,repositioned:moved,focus:display,selected:selected || data.expanded,layer:review,progress:motion.progress,poses,now,effects});
    const poseChanged = showLabels && (labelVisibilityChanged || moved || bodyLayout!==layout || bodyProgress!==motion.progress || bodyReview!==review ||
      !paintedView.equals(camera.matrixWorld) || !paintedProjection.equals(camera.projectionMatrix) ||
      !paintedAttitude.equals(attitude));
    if (poseChanged) {
      bodies = labels.bodyBoxes(layout,projection,positions,review);
      bodyLayout = layout;
      bodyProgress = motion.progress;
      bodyReview = review;
      paintedView.copy(camera.matrixWorld);
      paintedProjection.copy(camera.projectionMatrix);
      paintedAttitude.copy(attitude);
    }
    const relabel = showLabels && (now-lastLabels > 140 || moved && !moving);
    const labelsChanged = relabel && labels.update({
      layout,projection,positions,review,focus:display.nodes,near,progress:motion.progress,variant,bodies,hints,
      selected, expanded:data.expanded,
    });
    if (showLabels && (poseChanged || relabel || labelMotion.moving)) {
      labelMotion = labels.move({projection,positions,step:labelVisibilityChanged ? 1 : step,bodies,variant});
    }
    if (relabel) {
      tiledLabels = labels.live;
      onStats({ nodes: layout.nodes.size, edges: data.links.length, groups: labelMotion.visible,
        drawn: objects.pickableEdges().length, near });
      lastLabels = labelsChanged ? -Infinity : now;
    }
    composer.render();
    if (showLabels) overlay.render(scene,camera);
    setExportReady(showLabels && !labelMotion.moving && !labelsChanged && !interacting);
    host.dataset.camera = camera.position.toArray().map(n=>n.toFixed(2)).join(',');
    host.dataset.layerShift = layout.layers.map(({index})=>(spacing.get(index) || origin).toArray().map(n=>n.toFixed(2)).join(',')).join(';');
    host.dataset.layerAttitude = attitude.toArray().map(n=>n.toFixed(4)).join(',');
    host.dataset.reflow = offsets.size;
    host.dataset.layoutState = settle.pending ? 'waiting' : separating || moving ? 'arranging' : 'ready';
    host.dataset.ready = 'true';
    const wait = settle.wait(performance.now());
    if (wait!==null && !interacting && !cameraMoving && settleTimer===undefined) {
      settleTimer = setTimeout(()=>{ settleTimer = undefined; invalidate(); },Math.max(1,wait));
    }
    if (effects || damping || cameraMoving || separating || moving || showLabels && labelMotion.moving || labelsChanged) invalidate();
  }

  function setData(graph,selection) {
    const animate = Boolean(data && graph.expanded!==data.expanded);
    data = graph;
    selected = selection || '';
    selectedEdge = '';
    rebuild(animate);
  }
  function select(id) {
    if (selected===(id || '') && !selectedEdge) return;
    selected = id || '';
    selectedEdge = '';
    if (!layout) return;
    focus = spatialFocus(layout,layout.nodes.has(selected) ? selected : data.expanded);
    near = undefined;
    settle.touch(performance.now());
    fly();
  }
  function selectRelation(id) {
    const edge = layout?.links.find(item=>item.id===id);
    if (!edge || selectedEdge===id) return;
    selectedEdge = id;
    focus = {nodes:new Set([edge.source,edge.target]),edges:new Set([id])};
    for (const branch of layout.links) if (branch.branch && focus.nodes.has(branch.target)) {
      focus.nodes.add(branch.source);
      focus.edges.add(branch.id);
    }
    near = undefined;
    settle.touch(performance.now());
    fly();
  }
  function setView(layer = null) {
    review = layer;
    settle.touch(performance.now());
    controls.enableRotate = layer===null;
    fly();
    lastLabels = -Infinity;
  }
  function stopCamera() {
    cameraTween?.kill();
    turnGoal = null;
  }
  function turn(horizontal, vertical) {
    if (!layout || review!==null) return;
    playEffects();
    settle.touch(performance.now());
    const offset = camera.position.clone().sub(controls.target);
    const angle = new Spherical().setFromVector3(offset);
    const goal = turnGoal || angle;
    const full = 2*Math.PI;
    // Keep consecutive turns continuous even when the azimuth crosses ±π.
    angle.theta += Math.round((goal.theta-angle.theta)/full)*full;
    const theta = goal.theta+horizontal*Math.PI/15;
    const phi = Math.max(Math.PI/15,Math.min(Math.PI*14/15,goal.phi-vertical*Math.PI/22.5));
    if (variant==='atlas' && fitOrbit) {
      fly(true,new Vector3().setFromSphericalCoords(1,phi,theta));
      if (allowMotion()) turnGoal = {theta,phi};
      return;
    }
    stopCamera();
    const apply = () => {
      camera.position.copy(controls.target).add(offset.setFromSpherical(angle));
      controls.update();
      invalidate();
    };
    const finish = () => {
      turnGoal = null;
      lastLabels = -Infinity;
      invalidate();
    };
    if (!allowMotion()) {
      angle.theta = theta;
      angle.phi = phi;
      apply();
      finish();
    } else {
      turnGoal = {theta,phi};
      cameraTween = gsap.to(angle,{theta,phi,duration:.31,ease:'power2.out',onUpdate:apply,onComplete:finish});
    }
  }
  function zoom(factor) {
    fitOrbit = false;
    stopCamera();
    if (camera.isOrthographicCamera) {
      camera.zoom = Math.max(controls.minZoom,Math.min(controls.maxZoom,camera.zoom*factor));
      camera.updateProjectionMatrix();
    } else {
      const delta = camera.position.clone().sub(controls.target);
      delta.setLength(Math.max(controls.minDistance,Math.min(controls.maxDistance,delta.length()/factor)));
      camera.position.copy(controls.target).add(delta);
    }
    controls.update();
    lastLabels = -Infinity;
    playEffects();
  }

  function gateWheel(event) {
    if (event.ctrlKey || event.metaKey || (!fullscreen() && !host.matches(':focus-within'))) {
      event.stopImmediatePropagation();
    }
  }
  function down(event) {
    press = event.isPrimary && event.button===0
      ? {id:event.pointerId,x:event.clientX,y:event.clientY} : null;
  }
  function cancelPress() { press = null; }
  function movePointer(event) {
    if (press?.id===event.pointerId && Math.hypot(press.x-event.clientX,press.y-event.clientY)>5) cancelPress();
  }
  function up(event) {
    movePointer(event);
    if (press?.id!==event.pointerId) return;
    cancelPress();
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX-rect.left)/rect.width*2-1,1-(event.clientY-rect.top)/rect.height*2);
    ray.setFromCamera(pointer,camera);
    const target = objects?.pick(ray);
    if (target) onPick(target.id,target.edge);
    else if (variant==='atlas') onPick('',false);
  }

  function theme() {
    dark = document.documentElement.dataset.theme==='dark';
    const background = getComputedStyle(host).getPropertyValue('--bg-elevated').trim();
    scene.background = variant==='atlas' && !dark ? new Color('#eeece9')
      : new Color(background || '#152330').multiplyScalar(dark ? 1 : 1.42);
    bloom.strength = dark ? .29 : .14;
    bloom.threshold = dark ? .94 : 1.51;
    light.intensity = dark ? 1.8 : 2.1;
    rebuild(false,true);
  }

  function exportPng() {
    if (!layout || !width || !height || !exportReady) return null;
    const scale = Math.min(2,4096/Math.max(width,height));
    const dpr = renderer.getPixelRatio();
    renderer.setPixelRatio(scale);
    renderer.setSize(width,height,false);
    composer.setPixelRatio(scale);
    composer.setSize(width,height);
    composer.render();
    const canvas = document.createElement('canvas');
    canvas.width = renderer.domElement.width;
    canvas.height = renderer.domElement.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(renderer.domElement,0,0);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width,height);
    composer.setPixelRatio(dpr);
    composer.setSize(width,height);
    const base = host.getBoundingClientRect();
    ctx.scale(canvas.width/width,canvas.height/height);
    const shown = [...tiledLabels.values()].filter(({target}) => target.firstElementChild &&
      target.style.visibility!=='hidden' && target.getClientRects().length);
    if (variant==='atlas') for (const {target} of shown) {
      if (!target.classList.contains('leader')) continue;
      const rect = target.getBoundingClientRect();
      const line = getComputedStyle(target,'::before'), dot = getComputedStyle(target,'::after');
      const x = rect.left+rect.width/2-base.left, y = rect.top+rect.height/2-base.top;
      const length = parseFloat(line.width), angle = parseFloat(target.style.getPropertyValue('--label-leader-angle'));
      const labelOpacity = Number(getComputedStyle(target).opacity);
      ctx.globalAlpha = labelOpacity*Number(line.opacity);
      ctx.strokeStyle = line.borderTopColor;
      ctx.lineWidth = parseFloat(line.borderTopWidth);
      ctx.beginPath();
      ctx.moveTo(x,y);
      ctx.lineTo(x+Math.cos(angle)*length,y+Math.sin(angle)*length);
      ctx.stroke();
      if (dot.content==='none') continue;
      ctx.globalAlpha = labelOpacity*Number(dot.opacity);
      ctx.fillStyle = dot.backgroundColor;
      ctx.beginPath();
      ctx.arc(x,y,parseFloat(dot.width)/2,0,2*Math.PI);
      ctx.fill();
    }
    for (const {target} of shown) {
      const button = target.firstElementChild;
      const rect = button.getBoundingClientRect(), style = getComputedStyle(button);
      const labelOpacity = Number(getComputedStyle(target).opacity);
      ctx.save();
      ctx.globalAlpha = labelOpacity;
      ctx.fillStyle = style.backgroundColor;
      ctx.beginPath();
      const x = rect.left-base.left, y = rect.top-base.top;
      const radius = Math.min(parseFloat(style.borderTopLeftRadius),rect.height/2);
      ctx.roundRect(x,y,rect.width,rect.height,radius);
      ctx.fill();
      if (variant==='atlas') {
        ctx.strokeStyle = style.borderTopColor;
        ctx.lineWidth = parseFloat(style.borderTopWidth);
        ctx.stroke();
        if (style.borderLeftWidth!==style.borderTopWidth) {
          ctx.save();
          ctx.clip();
          ctx.fillStyle = style.borderLeftColor;
          ctx.fillRect(x,y,parseFloat(style.borderLeftWidth),rect.height);
          ctx.restore();
        }
        const marker = button.querySelector('.label-dot');
        if (marker) {
          const box = marker.getBoundingClientRect();
          ctx.fillStyle = getComputedStyle(marker).backgroundColor;
          ctx.beginPath();
          ctx.arc(box.left+box.width/2-base.left,box.top+box.height/2-base.top,box.width/2,0,2*Math.PI);
          ctx.fill();
        }
      }
      for (const item of button.querySelectorAll('span')) {
        const box = item.getBoundingClientRect(), itemStyle = getComputedStyle(item);
        ctx.globalAlpha = labelOpacity*Number(itemStyle.opacity);
        ctx.fillStyle = itemStyle.color;
        ctx.font = itemStyle.fontWeight+' '+itemStyle.fontSize+' '+itemStyle.fontFamily;
        // Text nodes are split into the same visual lines before drawing the label.
        const range = document.createRange(), groups = new Map();
        for (const value of item.childNodes) if (value.nodeType===Node.TEXT_NODE) {
          for (let i=0;i<value.length;i++) {
            range.setStart(value,i);
            range.setEnd(value,i+1);
            const bounds = range.getBoundingClientRect();
            const key = Math.round(bounds.top*2);
            const row = groups.get(key) || {left:bounds.left,top:bounds.top,text:''};
            row.text += value.data[i];
            groups.set(key,row);
          }
        }
        ctx.textBaseline = 'top';
        for (const row of groups.values()) if (row.top<box.bottom) ctx.fillText(row.text,row.left-base.left,row.top-base.top);
      }
      ctx.restore();
    }
    invalidate();
    return canvas;
  }

  const observer = new ResizeObserver(resize);
  const intersection = new IntersectionObserver(([entry])=>{
    visible = entry.isIntersecting;
    invalidate();
  });
  const appearance = new MutationObserver(theme);
  controls.addEventListener('change',invalidate);
  controls.addEventListener('start',()=>{
    interacting = true;
    if (variant==='atlas' && fitOrbit && review===null && layout) {
      orbitStart = {target:controls.target.clone(),offset:camera.position.clone().sub(controls.target)};
    }
    stopCamera();
    playEffects();
  });
  controls.addEventListener('end',()=>{
    interacting = false;
    if (orbitStart) {
      const offset = camera.position.clone().sub(controls.target);
      const {target,offset:initial} = orbitStart;
      orbitStart = undefined;
      if (target.distanceToSquared(controls.target)>1 || Math.abs(offset.length()-initial.length())>1) fitOrbit = false;
      else if (offset.distanceToSquared(initial)>1) fly(true,offset.normalize());
    }
    if (settle.pending) settle.touch(performance.now());
    invalidate();
  });
  if (variant==='atlas') renderer.domElement.addEventListener('wheel',gateWheel,{capture:true,passive:true});
  renderer.domElement.addEventListener('pointerdown',down);
  renderer.domElement.addEventListener('pointerup',up);
  renderer.domElement.addEventListener('pointermove',movePointer);
  renderer.domElement.addEventListener('pointercancel',cancelPress);
  appearance.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  observer.observe(host);
  intersection.observe(host);
  document.addEventListener('visibilitychange',invalidate);
  reduced.addEventListener('change',theme);
  resize();
  theme();
  return {setData,select,selectRelation,setView,turn,zoom,exportPng,dispose() {
    observer.disconnect();
    intersection.disconnect();
    appearance.disconnect();
    document.removeEventListener('visibilitychange',invalidate);
    reduced.removeEventListener('change',theme);
    controls.dispose();
    stopCamera();
    motionTween?.kill();
    clearTimeout(settleTimer);
    cancelAnimationFrame(frame);
    labels.clear();
    if (objects) disposeObjects(objects.root);
    for (const {map, roughnessMap} of Object.values(textures)) {
      map.dispose();
      roughnessMap.dispose();
    }
    renderPass.dispose();
    bloom.dispose();
    output.dispose();
    composer.dispose();
    renderer.domElement.removeEventListener('wheel',gateWheel,true);
    renderer.domElement.removeEventListener('pointerdown',down);
    renderer.domElement.removeEventListener('pointerup',up);
    renderer.domElement.removeEventListener('pointermove',movePointer);
    renderer.domElement.removeEventListener('pointercancel',cancelPress);
    renderer.domElement.removeEventListener('webglcontextlost',onLost);
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
    overlay.domElement.remove();
  }};
}
