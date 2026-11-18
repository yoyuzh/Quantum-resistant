<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch } from 'vue';
import { arrangeNeighborhood, relationPath, sideLimits, strokeWidth } from '../utils/repositoryGraph.js';
import { wrapDiagramText } from '../utils/flowPacking.js';
import { label } from '../utils/repositoryAtlas.js';
import { clamp, zoomView } from '../utils/workbenchScene.js';

const props = defineProps({graph:Object, selected:String, status:String, stamp:String});
const emit = defineEmits(['select','select-edge']);
const svg = ref(null), pattern = useId()+'-grid';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const floating = ref(!reduced.matches), toolsOpen = ref(false);
const camera = shallowRef({x:0,y:0,scale:1});
const poses = shallowRef(new Map());
let goal = camera.value, elapsed = 0, last = 0, frame = 0, visible = true, observer;
let resting = new Map(), overrides = new Map();
const homeEdits = new Map(), pointers = new Map();
let gesture = null, layoutProgress = 1;
const hover = ref('');
const MIN_SCALE = .65, MAX_SCALE = 8;
const scaleSamples = computed(() => {
  const max=props.graph.peak;
  return [...new Set([1, Math.max(1,Math.round(max/4)), max])];
});
function moveNode(id,x,y,settle=false) {
  const g=props.graph,n=g.nodes.find(n=>n.id===id),[lo,hi]=sideLimits(g,n);
  x=clamp(x,lo,hi);
  y=clamp(y,n.height/2+6,g.height-n.height/2-6);
  if(settle) {
    const blockers=g.nodes.filter(other=>other.kind===n.kind && other.id!==id).map(other=>{
      const p=overrides.get(other.id)||resting.get(other.id);
      return {x:p.x,y:p.y,dx:(other.width+n.width)/2+9,dy:(other.height+n.height)/2+9};
    }).filter(other=>Math.abs(other.x-x)<other.dx);
    const candidates=[y,...blockers.flatMap(b=>[b.y-b.dy,b.y+b.dy])].filter(value=>
      value>=n.height/2+5 && value<=g.height-n.height/2-5 && blockers.every(b=>Math.abs(b.y-value)>=b.dy-.01));
    if(candidates.length) y=candidates.sort((a,b)=>Math.abs(a-y)-Math.abs(b-y))[0];
    else {overrides.delete(id);invalidate();return;}
  }
  overrides.set(id,{x,y});invalidate();
}
const focusId = computed(() => props.selected || props.graph.expanded);
const members = computed(() => new Set(props.graph.branches.map(edge => edge.target)));
const activeEdges = computed(() => new Set(props.graph.links.filter(e =>
  e.source===focusId.value || e.target===focusId.value ||
  (focusId.value===props.graph.expanded && members.value.has(e.source))).map(e=>e.id)));
const activeNodes = computed(() => {
  const ids = new Set([focusId.value]);
  if (focusId.value===props.graph.expanded) for (const id of members.value) ids.add(id);
  for (const edge of props.graph.links) if (activeEdges.value.has(edge.id)) {ids.add(edge.source);ids.add(edge.target);}
  for (const branch of props.graph.branches) if (ids.has(branch.target)) ids.add(branch.source);
  return ids;
});
const remainingMotion = t => (1-t)**2*(1+2*t);
function invalidate() {
  if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw);
}
function draw(now) {
  frame = 0;
  const before = layoutProgress;
  const animateFloat = floating.value && before===1;
  if (animateFloat && !gesture && last && now-last<30) {invalidate();return;}
  const dt = last ? Math.min(32,now-last) : 0;
  last=now;
  if (animateFloat) elapsed+=dt;
  layoutProgress = Math.min(1,before+dt/420);
  const easing = reduced.matches ? 1 : before<1
    ? 1-remainingMotion(layoutProgress)/remainingMotion(before) : 1-Math.exp(-dt/105);
  let moving=false;
  const step=(a,b)=>{ if(Math.abs(b-a)<.025)return b; moving=true;return a+(b-a)*easing; };
  const next=new Map();
  props.graph.nodes.forEach((n,i)=>{
    const fixed=overrides.get(n.id), target=fixed || resting.get(n.id);
    if (!target) return;
    const previous=poses.value.get(n.id);
    const floats = animateFloat && !fixed && n.id!==props.selected;
    if (floats && previous && (n.id===hover.value || gesture?.kind==='press' && n.id===gesture.id)) {
      next.set(n.id,previous);
      return;
    }
    const x=target.x+(floats ? 2.4*Math.sin(elapsed/1420+i*2.3) : 0);
    const y=target.y+(floats ? 3.2*Math.cos(elapsed/1640+i*1.7) : 0);
    next.set(n.id, !previous || gesture?.dragged===n.id ? {x,y} : {x:step(previous.x,x),y:step(previous.y,y)});
  });
  poses.value=next;
  const c=camera.value;
  const scale=Math.abs(c.scale-goal.scale)<.0005 ? goal.scale : c.scale+(goal.scale-c.scale)*easing;
  camera.value=boundedCamera({x:step(c.x,goal.x),y:step(c.y,goal.y),scale});
  if(moving || floating.value || layoutProgress<1 || camera.value.scale!==goal.scale) invalidate();
  else last=0;
}
function boundedCamera({x,y,scale}) {
  const dx=props.graph.width*(1-scale),dy=props.graph.height*(1-scale);
  return {scale,x:clamp(x,Math.min(0,dx),Math.max(0,dx)),y:clamp(y,Math.min(0,dy),Math.max(0,dy))};
}
function focusCamera() {
  const g=props.graph;
  if (!focusId.value || !svg.value) {goal={x:0,y:0,scale:1};return;}
  const connected=g.nodes.filter(n=>activeNodes.value.has(n.id));
  if (!connected.length) return;
  const left=Math.min(...connected.map(n=>resting.get(n.id).x-n.width/2)), right=Math.max(...connected.map(n=>resting.get(n.id).x+n.width/2));
  const top=Math.min(...connected.map(n=>resting.get(n.id).y-n.height/2)), bottom=Math.max(...connected.map(n=>resting.get(n.id).y+n.height/2));
  const rect=svg.value.getBoundingClientRect(), clip=svg.value.closest('.graph-fullscreen,.library,.atlas-dialog')?.getBoundingClientRect();
  const {d:unit,f:origin}=svg.value.getScreenCTM();
  const y0=Math.max(0,(Math.max(0,rect.top,clip?.top ?? 0)-origin)/unit);
  const y1=Math.min(g.height,(Math.min(innerHeight,clip?.bottom ?? innerHeight)-origin)/unit);
  const height=y1>y0+80 ? y1-y0 : g.height;
  const centerY=y1>y0+80 ? (y1+y0)/2 : g.height/2;
  const groupFocus = !props.selected;
  const minimum = groupFocus ? (g.width < 590 ? .95 : .84) : MIN_SCALE;
  const outerLeft = Math.min(...g.nodes.map(n => resting.get(n.id).x - n.width/2));
  const outerRight = Math.max(...g.nodes.map(n => resting.get(n.id).x + n.width/2));
  const maximum = groupFocus ? Math.min(1.18, (g.width-12)/(outerRight-outerLeft)) : 1.65;
  const scale=clamp(Math.min((g.width-24)/(right-left+20),(height-18)/(bottom-top+20)),minimum,maximum);
  const x = g.width/2-(left+right)*scale/2;
  const y = groupFocus && (bottom-top)*scale > height-18 ? y0+9-top*scale : centerY-(top+bottom)*scale/2;
  const lowY = 5-top*scale, highY = g.height-5-bottom*scale;
  goal=boundedCamera({scale,x:groupFocus ? clamp(x,6-outerLeft*scale,g.width-6-outerRight*scale) : x,
    y:groupFocus && lowY <= highY ? clamp(y,lowY,highY) : y});
}
function layout() {
  resting=focusId.value ? arrangeNeighborhood(props.graph,focusId.value) : props.graph.home;
  overrides=props.selected ? new Map() : homeEdits;
  layoutProgress=svg.value && !reduced.matches ? 0 : 1;
  last=0;focusCamera();invalidate();
}
watch(()=>props.graph,(graph,previous)=>{
  homeEdits.clear();
  hover.value='';
  const changingGroup = !reduced.matches && previous?.width===graph.width && previous.expanded!==graph.expanded;
  const lastPoses = poses.value;
  poses.value = new Map(graph.nodes.map(n => {
    const home = graph.home.get(n.id), parent = changingGroup && lastPoses.get(n.parent);
    const start = changingGroup && lastPoses.get(n.id);
    return [n.id, start || (parent ? {x:home.x,y:parent.y} : home)];
  }));
  layout();
},{immediate:true,flush:'post'});
watch(()=>props.selected,layout,{flush:'post'});
function reset() {
  homeEdits.clear();overrides.clear();hover.value='';emit('select','');goal={x:0,y:0,scale:1};invalidate();
}
function point(event) {
  return new DOMPoint(event.clientX,event.clientY).matrixTransform(svg.value.getScreenCTM().inverse());
}
function zoom(factor, p = {x:props.graph.width/2,y:props.graph.height/2}) {
  const scale=clamp(goal.scale*factor,MIN_SCALE,MAX_SCALE);
  if(scale===goal.scale)return;
  goal=boundedCamera(zoomView(goal,scale/goal.scale,p.x,p.y));invalidate();
}
function wheel(e) {zoom(Math.exp(-clamp(e.deltaY,-160,160)*.0025),point(e));}
function begin(e) {
  if(e.button!==0 || pointers.size>=2)return;
  const p=point(e);
  pointers.set(e.pointerId,p);svg.value.setPointerCapture(e.pointerId);
  if(pointers.size===2) {
    const [a,b]=pointers.values();
    gesture={kind:'pinch',camera:camera.value,mid:{x:(a.x+b.x)/2,y:(a.y+b.y)/2},dist:Math.hypot(a.x-b.x,a.y-b.y)};
    return;
  }
  const id=e.target.closest('[data-node]')?.dataset.node;
  gesture={kind:'press',p,id,edge:e.target.closest('[data-edge]')?.dataset.edge,start:poses.value.get(id),
    camera:camera.value,clientX:e.clientX,clientY:e.clientY};
}
function pressMoved(e) {
  return Math.hypot(e.clientX-gesture.clientX,e.clientY-gesture.clientY)>=4;
}
function move(e) {
  if(!pointers.has(e.pointerId) || !gesture)return;
  const p=point(e);pointers.set(e.pointerId,p);
  if(gesture.kind==='pinch' && pointers.size===2){
    const [a,b]=pointers.values(), mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2};
    const c=gesture.camera,s=clamp(c.scale*Math.hypot(a.x-b.x,a.y-b.y)/Math.max(1,gesture.dist),MIN_SCALE,MAX_SCALE);
    goal=boundedCamera({scale:s,x:mid.x-(gesture.mid.x-c.x)*s/c.scale,y:mid.y-(gesture.mid.y-c.y)*s/c.scale});
    camera.value=goal;invalidate();return;
  }
  const dx=p.x-gesture.p.x,dy=p.y-gesture.p.y;
  if (gesture.kind==='press' && !pressMoved(e))return;
  gesture.kind='drag';
  if(gesture.id) {
    gesture.dragged=gesture.id;
    moveNode(gesture.id,gesture.start.x+dx/camera.value.scale,gesture.start.y+dy/camera.value.scale);
  } else {
    goal=boundedCamera({...gesture.camera,x:gesture.camera.x+dx,y:gesture.camera.y+dy});camera.value=goal;
  }
  invalidate();
}
function finish(e,cancel=false) {
  if(!pointers.has(e.pointerId))return;
  pointers.delete(e.pointerId);
  if(svg.value.hasPointerCapture(e.pointerId))svg.value.releasePointerCapture(e.pointerId);
  if(gesture?.dragged){
    const p=overrides.get(gesture.dragged);if(p)moveNode(gesture.dragged,p.x,p.y,true);
  }
  if(!cancel && gesture?.kind==='press' && !pressMoved(e)){
    if(gesture.id) emit('select',props.selected===gesture.id ? '' : gesture.id);
    else if(gesture.edge)emit('select-edge',gesture.edge);
    else emit('select','');
  }
  gesture=null;
}
function key(e) {
  if(e.key==='Escape' && focusId.value){e.preventDefault();emit('select',props.selected ? '' : props.graph.expanded);return;}
  if(['+','=','-','0'].includes(e.key)){e.preventDefault();if(e.key==='0') reset();else zoom(e.key==='-'?1/1.3:1.3);}
  if(e.key.startsWith('Arrow')){
    e.preventDefault();const dx=({ArrowLeft:-1,ArrowRight:1})[e.key]||0,dy=({ArrowUp:-1,ArrowDown:1})[e.key]||0;
    const id=e.target.closest('[data-node]')?.dataset.node;
    if(id && e.shiftKey){const p=poses.value.get(id);moveNode(id,p.x+dx*12,p.y+dy*12,true);}
    else goal=boundedCamera({...goal,x:goal.x-dx*40,y:goal.y-dy*40});
    invalidate();
  }
}
function visibility(){if(!document.hidden){last=0;invalidate();}}
function motionPreference(){floating.value=!reduced.matches;invalidate();}
onMounted(()=>{
  observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting; if(visible){last=0;invalidate();}else {cancelAnimationFrame(frame);frame=0;}});
  observer.observe(svg.value); reduced.addEventListener('change',motionPreference);document.addEventListener('visibilitychange',visibility);invalidate();
});
onBeforeUnmount(()=>{visible=false;cancelAnimationFrame(frame);observer?.disconnect();reduced.removeEventListener('change',motionPreference);document.removeEventListener('visibilitychange',visibility);});
function position(n){return poses.value.get(n.id)||props.graph.home.get(n.id);}
function path(e){return relationPath(poses.value.get(e.source)||props.graph.home.get(e.source),poses.value.get(e.target)||props.graph.home.get(e.target),e);}
const linkPaths = computed(() => new Map(props.graph.links.map(edge => [edge.id,path(edge)])));
function exportGraph(){
  const g=props.graph, copy=svg.value.cloneNode(true), style=getComputedStyle(svg.value);
  const settled = id => overrides.get(id) || resting.get(id);
  const pts=g.nodes.map(n=>({...settled(n.id),w:n.width,h:n.height}));
  const x=Math.min(0,...pts.map(p=>p.x-p.w/2-12)),y=Math.min(0,...pts.map(p=>p.y-p.h/2-12));
  const right=Math.max(g.width,...pts.map(p=>p.x+p.w/2+12)),bottom=Math.max(g.height,...pts.map(p=>p.y+p.h/2+12));
  const w=Math.max(620,right-x+30);
  const foot=g.unlinked.length ? wrapDiagramText('未形成连线：'+g.unlinked.map(row=>row.repo.full_name).join('、'),w-44,50,13) : [];
  const legendHeight=props.status==='legacy' ? 0 : 32;
  const h=bottom-y+130+legendHeight+foot.length*18;
  copy.setAttribute('xmlns','http://www.w3.org/2000/svg');copy.setAttribute('width',w);copy.setAttribute('height',h);copy.setAttribute('viewBox',`0 0 ${w} ${h}`);
  copy.setAttribute('style',['--bg-surface','--bg-elevated','--text-primary','--text-secondary','--border','--workspace-dot','--accent'].map(k=>k+':'+style.getPropertyValue(k)).join(';'));
  copy.querySelector('[data-camera]').setAttribute('transform',`translate(${(w-(right-x))/2-x} ${76+legendHeight-y})`);
  copy.querySelectorAll('[data-node]').forEach((el,i)=>{
    const {x,y}=pts[i];
    el.setAttribute('transform',`translate(${x} ${y})`);
  });
  for (const [selector,edges] of [['[data-edge]',g.links],['[data-branch]',g.branches]]) {
    copy.querySelectorAll(selector).forEach((el,i)=>{
      const edge=edges[i], line=el.matches('path') ? el : el.querySelector('path');
      line.setAttribute('d',relationPath(settled(edge.source),settled(edge.target),edge));
    });
  }
  copy.querySelectorAll('[tabindex]').forEach(el=>el.removeAttribute('tabindex'));
  copy.querySelectorAll('[data-hit]').forEach(el=>el.remove());
  function text(value,baseline,size,weight='400',left=18){
    const t=document.createElementNS('http://www.w3.org/2000/svg','text');
    for(const [k,v] of Object.entries({x:left,y:baseline,'font-family':'sans-serif','font-size':size,'font-weight':weight,fill:'var(--text-primary)'}))t.setAttribute(k,String(v));
    t.textContent=value;copy.appendChild(t);
  }
  text('多仓库密码算法关系图',31,23,'700');
  const scope=g.nodes.find(n=>n.expanded)?.label;
  text([props.stamp,label(props.status),scope ? '已展开 '+scope : '按仓库用途汇总',g.links.length+' 组检出关系'].join(' · '),57,14);
  if(legendHeight) {
    scaleSamples.value.forEach((value,i)=>{
      const x=20+i*120, line=document.createElementNS('http://www.w3.org/2000/svg','path');
      line.setAttribute('d',`M${x} 85h30`);line.setAttribute('stroke',style.getPropertyValue('--text-secondary'));
      line.setAttribute('stroke-width',strokeWidth(value,g.peak,props.status));copy.appendChild(line);
      text(value+' 项',90,13,'400',x+37);
    });
  }
  const note = props.status==='legacy' ? '历史数据仅表示检出。' : '检出线宽按记录数计算，最大单组 '+g.peak+' 项。';
  text('左侧类别 · 中间仓库 · 右侧算法。'+(scope ? '细绿线表示类别归属。' : '')+note,h-20-foot.length*18,13);
  foot.forEach((line,i)=>text(line,h-18-(foot.length-1-i)*18,13));
  const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)],{type:'image/svg+xml'}));
  const link=document.createElement('a');link.href=url;link.download='仓库算法关系图.svg';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
</script>
<template>
  <section class="vector-stage">
    <div class="graph-tools" :class="{expanded:toolsOpen}"><div class="legends"><span class="graph-key"><i/>类别 <i class="repo-key"/>仓库 <b/>算法</span>
      <span v-if="status!=='legacy'" class="weight-key" aria-label="记录数线宽图例">
        <span v-for="v in scaleSamples" :key="v"><svg width="26" height="22" aria-hidden="true"><path d="M1 11H25" stroke="currentColor" :stroke-width="strokeWidth(v,graph.peak,status)"/></svg>{{ v }} 项</span>
      </span></div>
      <div class="actions">
        <button class="button secondary compact tools-toggle" :aria-expanded="toolsOpen" @click="toolsOpen=!toolsOpen">视图工具</button>
        <div class="view-actions"><button class="button secondary compact" aria-label="缩小关系图" @click="zoom(1/1.3)">−</button>
        <output>{{ Math.round(camera.scale*100) }}%</output><button class="button secondary compact" aria-label="放大关系图" @click="zoom(1.3)">＋</button>
        <button class="button secondary compact" @click="reset">复位</button>
        <button class="button secondary compact" :aria-pressed="floating" @click="floating=!floating;invalidate()">浮动</button>
        <button class="button secondary compact" @click="exportGraph">导出 SVG</button></div>
        <slot name="fullscreen" />
      </div>
    </div>
    <svg ref="svg" class="network" role="group" aria-label="仓库算法关系图，点击分类展开，点击仓库或算法聚焦，拖动节点调整位置，滚轮或双指缩放" tabindex="0"
      :viewBox="`0 0 ${graph.width} ${graph.height}`" :font-family="graph.fontFamily" @wheel.prevent="wheel" @pointerdown="begin" @pointermove="move"
      @pointerup="finish($event)" @pointercancel="finish($event,true)" @lostpointercapture="finish($event,true)" @keydown="key">
      <defs><pattern :id="pattern" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="var(--workspace-dot)"/></pattern></defs>
      <rect width="100%" height="100%" fill="var(--bg-elevated)"/><rect width="100%" height="100%" :fill="'url(#'+pattern+')'"/>
      <g data-camera :transform="`translate(${camera.x} ${camera.y}) scale(${camera.scale})`">
        <g v-for="e in graph.links" :key="e.id" :data-edge="e.id" class="edge" :opacity="activeEdges.has(e.id) ? 1 : .68">
          <title>{{ e.sourceLabel }} → {{ e.algorithm }} · {{ status==='legacy'?'基础检出':e.value+' 项' }}</title>
          <path :d="linkPaths.get(e.id)" fill="none" :stroke="e.color" :stroke-width="e.band" :stroke-dasharray="status==='ai_assessed'?'8 4':status==='pending'?'3 4':undefined"/>
          <path data-hit :d="linkPaths.get(e.id)" fill="none" stroke="transparent" stroke-width="12"/>
        </g>
        <path v-for="branch in graph.branches" :key="branch.target" :data-branch="branch.target" class="membership"
          :d="path(branch)" pathLength="1" stroke-dasharray="1" fill="none" stroke="var(--accent)" stroke-width="1.45"
          :stroke-opacity="activeNodes.has(branch.target) ? .68 : .16" pointer-events="none"/>
        <g v-for="n in graph.nodes" :key="n.id" role="button" tabindex="0" class="vertex" :class="{member:n.parent,hovered:hover===n.id}" :data-node="n.id" :aria-label="n.label"
          :aria-pressed="n.group ? undefined : selected===n.id" :aria-expanded="n.group ? n.expanded : undefined"
          :transform="`translate(${position(n).x} ${position(n).y})`"
          @pointerenter="hover=n.id" @pointerleave="hover=''"
          @keydown.enter.stop.prevent="emit('select',selected===n.id?'':n.id)" @keydown.space.stop.prevent="emit('select',selected===n.id?'':n.id)">
          <title>{{ n.label }} · {{ n.detailLines.join('') }}</title>
          <rect v-if="selected===n.id || n.expanded" :x="-n.width/2-5" :y="-n.height/2-5" :width="n.width+10" :height="n.height+10" :rx="n.radius+5" :fill="n.color" opacity=".2"/>
          <rect :x="-n.width/2" :y="-n.height/2" :width="n.width" :height="n.height" :rx="n.radius"
            class="node-base" fill="var(--bg-surface)" :stroke="selected===n.id?'var(--accent)':n.color" :stroke-width="selected===n.id?2.7:1.35"/>
          <g class="node-content" text-anchor="middle" pointer-events="none">
            <rect :x="-n.width/2" :y="-n.height/2" :width="n.width" :height="n.height" :rx="n.radius" :fill="n.color" :opacity="n.row ? .055 : .12"/>
            <path v-if="n.group" :d="n.expanded ? 'M-3 0H3' : 'M-3 0H3 M0 -3V3'" :transform="`translate(${n.width/2-9} ${n.height/2-14})`"
              stroke="var(--accent)" stroke-width="1.7" stroke-linecap="round" />
            <text v-for="(line,i) in n.lines" :key="'t'+i" :y="-(n.lines.length*22+n.detailLines.length*20)/2+16+i*22" :font-size="n.fontSize" font-weight="600" fill="var(--text-primary)">{{ line }}</text>
            <text v-for="(line,i) in n.detailLines" :key="'d'+i" :x="n.group ? -5 : 0" :y="-(n.lines.length*22+n.detailLines.length*20)/2+16+n.lines.length*22+i*20" font-size="12.5" fill="var(--text-secondary)">{{ line }}</text>
          </g>
        </g>
      </g>
    </svg>
  </section>
</template>
<style scoped>
.vector-stage { overflow:hidden; border:1px solid var(--border); border-radius:var(--radius); background:var(--bg-elevated); }
.network { display:block; width:100%; touch-action:none; cursor:grab; user-select:none; }
.network:active,.vertex:active { cursor:grabbing; }
.vertex,.edge { cursor:pointer; }
.edge { transition:opacity 180ms ease; }
.membership { animation:draw-branch 440ms ease-out both; transition:stroke-opacity 240ms ease; }
.vertex.member { animation:reveal-repository 220ms ease-out both; }
@keyframes draw-branch { from { stroke-dashoffset:1; } to { stroke-dashoffset:0; } }
@keyframes reveal-repository { from { opacity:0; } to { opacity:1; } }
.vertex:focus-visible { outline:none; }
.vertex:is(.hovered,:focus-visible) .node-base { stroke:var(--accent); stroke-width:3; stroke-opacity:1; }
.graph-tools,.actions,.view-actions,.graph-key,.legends,.weight-key,.weight-key span { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.legends { gap:14px; }.weight-key { font-size:12px; color:var(--text-secondary); gap:10px; }.weight-key span { gap:3px; }
.graph-tools { justify-content:space-between; padding:7px 10px; background:var(--bg-surface); }
.actions { margin-inline-start:auto; justify-content:flex-end; }
.graph-key,output { font-size:12px; color:var(--text-secondary); } output { min-width:4ch; text-align:center; font-variant-numeric:tabular-nums; }
.graph-key i,.graph-key b { width:14px;height:12px;border:1.5px solid var(--accent);border-radius:3px; } .graph-key b { border-color:#16877f;border-radius:50%;margin-left:6px; }
.graph-key .repo-key { border-color:#627ec7; margin-left:6px; }
.tools-toggle { display:none; }
@media(max-width:600px){
  .tools-toggle { display:inline-flex; }
  .graph-tools:not(.expanded) .view-actions,.graph-tools:not(.expanded) .weight-key { display:none; }
  .graph-tools.expanded .actions { flex-basis:100%; }
}
@media(prefers-reduced-motion:reduce){
  .edge,.membership,.vertex.member { animation:none; transition:none; }
}
</style>
