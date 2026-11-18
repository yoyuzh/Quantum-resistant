<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, toRaw, watch } from 'vue';
import { createLayeredRenderer } from '../utils/layeredRenderer.js';
import { statusLabel } from '../utils/verification.js';
import { strokeWidth } from '../utils/repositoryGraph.js';
import GraphLegend from './GraphLegend.vue';

const props = defineProps({
  graph: {type:Object, required:true}, selected: String, selectedEdge: String, status: String, fullscreen: Boolean,
  variant: {type:String, default:'atlas'},
});
const emit = defineEmits(['select','select-edge','stats','unavailable']);
const surface = ref(null), labels = shallowRef([]);
const review = ref(null), ready = ref(false), exportReady = ref(false);
const stats = shallowRef({nodes:0,edges:0,groups:0,drawn:0,near:false});
const toolsOpen = ref(false);
const currentNode = computed(() => props.selected || props.graph.expanded);
const directions = [
  { key:'ArrowLeft', glyph:'←', label:'向左旋转', yaw:-1, pitch:0 },
  { key:'ArrowUp', glyph:'↑', label:'抬高视角', yaw:0, pitch:1 },
  { key:'ArrowDown', glyph:'↓', label:'降低视角', yaw:0, pitch:-1 },
  { key:'ArrowRight', glyph:'→', label:'向右旋转', yaw:1, pitch:0 },
];
const layerNames = computed(() => props.variant==='atlas'
  ? ['领域分类','仓库矩阵','密码算法']
  : props.graph.mode==='calls' ? ['来源位置','密码操作','返回或关联'] : ['文件与证据','密码算法','迁移参考']);
const depth = computed(() => props.variant==='atlas' ? 300 : 250);
const layers = computed(() => layerNames.value.map((name,index)=>({ name,index,z:(1-index)*depth.value }))
  .filter(layer=>props.variant!=='atlas' || layer.index!==1 || Boolean(props.graph.expanded)));
const peak = computed(() => props.graph.peak || 1);
const scaleExamples = computed(() => [...new Set([1,Math.round(peak.value/4)||1,peak.value])]);
let stage;
function update() {
  if (review.value!==null && !layers.value.some(layer=>layer.index===review.value)) view();
  stage?.setData(toRaw(props.graph),props.selected);
  if (props.selectedEdge) stage?.selectRelation(props.selectedEdge);
}
function view(layer=null) {
  review.value = layer;
  stage?.setView(layer);
}
function pick(id,edge=false) {
  if (edge && props.variant==='workbench') stage?.selectRelation(id);
  emit(edge?'select-edge':'select',id);
}
function locate(id) { stage?.select(id); }
function reset() {
  emit('select','');
  view();
}
function turn({yaw,pitch}) {
  if (review.value===null) stage?.turn(yaw,pitch);
}
function focusSurface(event) {
  if (!event.target.closest('button')) surface.value?.focus({preventScroll:true});
}
function keyboard(event) {
  if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
  const direction = directions.find(item=>item.key===event.key);
  if (direction && review.value===null) {
    event.preventDefault();
    turn(direction);
    return;
  }
  if (['+','=','-','0'].includes(event.key)) event.preventDefault();
  if (event.key==='+' || event.key==='=') stage?.zoom(1.3);
  if (event.key==='-') stage?.zoom(1/1.3);
  if (event.key==='0') reset();
  if (event.key==='Escape' && (props.selected || props.selectedEdge) && !props.fullscreen) {
    event.preventDefault();
    emit('select','');
  }
}
function details(node) {
  if (node.group) return node.group.rows.length+' 仓';
  if (props.variant==='atlas') {
    return node.detailLines.join('');
  }
  if (node.line) return '第 '+node.line+' 行';
  return node.status ? statusLabel(node.status) : node.kindLabel || '';
}
function exportView() {
  stage?.exportPng()?.toBlob(blob=>{
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = props.variant==='atlas' ? '仓库算法全景.png' : '证据关系图.png';
    link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  },'image/png');
}
onMounted(()=>{
  try {
    stage = createLayeredRenderer(surface.value,{
      variant:props.variant,fullscreen:()=>props.fullscreen,onLabels:items=>{labels.value=items;},onPick:pick,
      onStats:data=>{stats.value=data;ready.value=true;emit('stats',data);},
      onExportReady:value=>{exportReady.value=value;},
      onLost:event=>{event.preventDefault();emit('unavailable');},
    });
    update();
  } catch (error) {
    console.warn('3D 视图切换到兼容模式',error);
    emit('unavailable');
  }
});
watch(()=>props.graph,update,{flush:'post'});
watch(()=>props.selected,locate);
watch(()=>props.selectedEdge,id=>{ if (id) stage?.selectRelation(id); else locate(props.selected); });
onBeforeUnmount(()=>stage?.dispose());
defineExpose({locate,exportView,fit:()=>view()});
</script>

<template>
  <section class="spatial-stage" :class="['spatial-'+variant, { 'spatial-fullscreen': fullscreen, 'spatial-tools-open': toolsOpen, 'spatial-has-relation': selectedEdge }]" :data-label-count="stats.groups" :data-visible-edges="stats.drawn"
    :data-lod="stats.near ? 'near' : 'far'">
    <div class="spatial-controls">
      <div class="spatial-buttons" role="group" aria-label="镜头视角">
        <button class="button secondary compact" :aria-pressed="review===null" @click="view()">空间巡航</button>
      </div>
      <div class="spatial-buttons spatial-turn" role="group" aria-label="视角方向">
        <button v-for="direction in directions" :key="direction.key" type="button"
          class="button secondary compact" :aria-label="direction.label" :aria-keyshortcuts="direction.key"
          :title="review===null ? direction.label : '返回空间巡航后调整视角'"
          :disabled="!ready || review!==null" @click="turn(direction)">{{ direction.glyph }}</button>
      </div>
      <div class="spatial-buttons spatial-actions" role="group" aria-label="镜头工具">
        <button class="button secondary compact" aria-label="缩小关系图" @click="stage?.zoom(1/1.3)">−</button>
        <button class="button secondary compact" aria-label="放大关系图" @click="stage?.zoom(1.3)">＋</button>
        <button class="button secondary compact" @click="reset">复位</button>
        <button class="button secondary compact spatial-export" :disabled="!exportReady" :title="exportReady ? undefined : '等待图形和标签排布完成'" @click="exportView">导出 PNG</button>
      </div>
      <div class="spatial-buttons spatial-extra">
        <button v-if="variant==='atlas'" type="button" class="button secondary compact spatial-tools-toggle" :aria-expanded="toolsOpen" @click="toolsOpen=!toolsOpen">视图工具</button>
        <slot name="fullscreen" />
      </div>
    </div>
    <div class="spatial-field">
      <div ref="surface" class="spatial-surface" tabindex="0"
        aria-label="三维关系图，方向键或拖动调整视角，聚焦图面后滚轮缩放，点节点或管道查看关系"
        aria-keyshortcuts="ArrowLeft ArrowUp ArrowDown ArrowRight" @pointerdown="focusSurface" @keydown="keyboard"></div>
      <div class="spatial-layers" role="group" aria-label="切面">
        <button v-for="layer in layers" :key="layer.index" type="button" :aria-pressed="review===layer.index"
          class="spatial-layer" :data-layer="layer.index" @click="view(layer.index)">
          <i aria-hidden="true"></i><span>{{ layer.name }}</span><small>Z {{ layer.z>0 ? '+' : '' }}{{ layer.z }}</small>
        </button>
      </div>
      <p v-if="!ready || !graph.nodes.length" class="spatial-empty" role="status">{{ ready ? '没有匹配的关系' : '正在构建空间图…' }}</p>
    </div>
    <div class="spatial-footer">
      <GraphLegend v-if="variant==='workbench'" :mode="graph.mode" />
      <template v-else>
        <span v-if="graph.expanded" class="spatial-branch-key"><i></i>类别归属</span>
        <div v-if="status!=='legacy'" role="group" aria-label="检出记录数与线宽" class="spatial-weight">
          <span v-for="value in scaleExamples" :key="value"><i :style="{height:strokeWidth(value,peak,status)+'px'}"></i>{{ value }} 项</span>
        </div>
        <span v-else>点线表示历史检出</span>
      </template>
      <span v-if="variant==='atlas' && selectedEdge && review===null" class="spatial-label-hint">选中关系加粗显示</span>
      <span v-if="variant==='atlas' && ready && review===null && stats.groups<stats.nodes" class="spatial-label-hint">可逐层查看，或用定位查找节点</span>
      <span v-if="stats.drawn && stats.drawn<stats.edges" class="spatial-lod">当前绘制 {{ stats.drawn }} 条主干关系</span>
    </div>
    <Teleport v-for="item in labels" :key="item.node.id" :to="item.target">
      <button type="button" class="spatial-label" :class="['label-'+item.node.kind, { 'is-current': item.node.id===currentNode }]" :data-node="item.node.id"
        :aria-label="variant==='atlas' ? [layerNames[item.node.layer],item.node.label,details(item.node)].join('，') : item.node.label" :aria-expanded="item.node.group ? Boolean(item.node.expanded) : undefined"
        :aria-pressed="item.node.group ? undefined : selected===item.node.id"
        :title="item.node.label" :style="{'--node-tint':item.node.tint}" @click="pick(item.node.id)">
        <i v-if="variant==='atlas' && item.node.kind==='algorithm'" class="label-dot" aria-hidden="true"></i>
        <span class="label-title"><template v-if="variant==='atlas' && item.node.row"><template v-for="(part,i) in item.node.label.split(/(?<=[/-])/)" :key="i"><wbr v-if="i"/>{{ part }}</template></template><template v-else>{{ variant==='atlas' ? item.node.label : (item.node.title || item.node.label) }}</template></span>
        <span v-if="item.node.group" class="label-disclosure" aria-hidden="true">{{ item.node.expanded ? '−' : '+' }}</span>
        <span v-if="details(item.node)" class="label-meta">{{ details(item.node) }}</span>
      </button>
    </Teleport>
  </section>
</template>

<style>
.spatial-stage { border:1px solid var(--border); border-radius:var(--radius-lg); background:var(--bg-elevated); overflow:hidden; min-width:0; }
.spatial-workbench { flex:1; display:flex; flex-direction:column; min-height:160px; }
.spatial-controls,.spatial-footer { display:flex; align-items:center; justify-content:space-between; gap:8px 14px; flex-wrap:wrap; position:relative; z-index:1; padding:8px 12px; background:color-mix(in srgb,var(--bg-surface) 86%,transparent); backdrop-filter:blur(12px); }
.spatial-controls { border-bottom:1px solid var(--border); }
.spatial-turn button { min-width:34px; }
.spatial-actions { margin-inline-start:auto; }
.spatial-tools-toggle { display:none; }
.spatial-buttons,.spatial-weight,.spatial-weight span,.spatial-branch-key { display:flex; align-items:center; flex-wrap:wrap; gap:5px; }
.spatial-buttons button[aria-pressed=true],.spatial-layer[aria-pressed=true] { box-shadow:inset 0 0 0 1.5px var(--accent); }
.spatial-field { min-height:0; position:relative; height:clamp(245px,68dvh,760px); }
.spatial-workbench .spatial-field { height:auto; flex:1; }
.spatial-surface { position:absolute; inset:0; overflow:hidden; touch-action:none; }
.spatial-webgl,.spatial-overlay { position:absolute; inset:0; display:block; }
.spatial-webgl { touch-action:none; cursor:grab; }
.spatial-webgl:active { cursor:grabbing; }
.spatial-atlas:not(.spatial-fullscreen) .spatial-surface { touch-action:pan-y pinch-zoom; }
.spatial-atlas:not(.spatial-fullscreen) .spatial-webgl { touch-action:pan-y pinch-zoom !important; }
.spatial-overlay,.spatial-anchor { pointer-events:none; }
.spatial-anchor.leader::before { content:''; position:absolute; left:50%; top:50%; width:var(--label-leader-length);
  border-top:1px dotted var(--text-muted); transform-origin:left; transform:rotate(var(--label-leader-angle)); }
.spatial-atlas .spatial-anchor.leader::before { border-top:1.5px solid color-mix(in srgb,var(--layer-tint) 65%,var(--text-primary)); }
.spatial-atlas .spatial-anchor.leader.focused::after { content:''; position:absolute; left:50%; top:50%; width:6px; height:6px;
  transform:translate(-50%,-50%); border-radius:50%; border:1px solid var(--bg-elevated); background:var(--layer-tint); }
.spatial-layers { position:absolute; z-index:1; top:12px; left:12px; display:flex; flex-wrap:wrap; gap:6px; max-width:calc(100% - 24px); }
.spatial-layer { display:inline-flex; align-items:center; gap:6px; padding:5px 8px; border:1px solid var(--border); color:var(--text-primary); background:color-mix(in srgb,var(--bg-surface) 90%,transparent); border-radius:6px; cursor:pointer; font-size:12px; backdrop-filter:blur(12px); }
.spatial-layer small { color:var(--text-secondary); font:10px var(--font-mono); }
.spatial-anchor[data-kind="category"],.spatial-layer[data-layer="0"] { --layer-tint:#419d8f; }
.spatial-anchor[data-kind="file"],.spatial-layer[data-layer="1"] { --layer-tint:#678dda; }
.spatial-anchor[data-kind="algorithm"],.spatial-layer[data-layer="2"] { --layer-tint:#9a75c4; }
.spatial-layer i { width:7px; height:7px; border-radius:2px; background:var(--layer-tint); }
.spatial-layer[data-layer="2"] i { border-radius:50%; }
.spatial-label { pointer-events:auto; display:grid; width:max-content; min-width:42px; max-width:112px; gap:2px; background:color-mix(in srgb,var(--bg-surface) 94%,transparent); border:1px solid color-mix(in srgb,var(--node-tint) 45%,var(--border)); color:var(--text-primary); border-radius:6px; padding:4px 6px; line-height:1.16; text-align:center; cursor:pointer; transform:translate(var(--label-shift-x,0),var(--label-shift-y,16px)); box-shadow:0 2px 6px rgb(3 11 25 / 10%); }
.spatial-label:hover,.spatial-label[aria-pressed=true],.spatial-label[aria-expanded=true] { border-color:var(--accent); box-shadow:0 0 0 1px var(--accent); }
.spatial-anchor.dimmed { opacity:.24; }
.spatial-atlas .spatial-anchor.dimmed { opacity:1; }
.spatial-atlas .spatial-anchor.dimmed:not(:focus-within,:hover) :is(.label-title,.label-meta) { opacity:.69; }
.spatial-atlas .spatial-anchor.dimmed::before { opacity:.40; }
.spatial-anchor:focus-within { opacity:1; }
.spatial-has-relation .spatial-anchor.leader::after { opacity:.45; }
.spatial-label .label-disclosure { position:absolute; inset:auto 4px 2px auto; color:var(--accent); font-weight:700; }
.spatial-label .label-title { font-size:12px; font-weight:650; overflow-wrap:anywhere; }
.spatial-label .label-meta { font-size:10px; color:var(--text-secondary); font-variant-numeric:tabular-nums; overflow-wrap:anywhere; }
.spatial-label.label-algorithm { max-width:70px; }
.spatial-atlas .spatial-label {
  background:color-mix(in srgb,var(--layer-tint) 15%,var(--bg-surface));
  border-color:color-mix(in srgb,var(--layer-tint) 48%,var(--bg-surface));
}
.spatial-atlas .spatial-label:is(:hover,[aria-pressed=true],[aria-expanded=true]) {
  background:color-mix(in srgb,var(--layer-tint) 23%,var(--bg-surface));
  border-color:color-mix(in srgb,var(--layer-tint) 65%,var(--bg-surface));
  box-shadow:0 0 9px color-mix(in srgb,var(--layer-tint) 32%,transparent);
}
.spatial-atlas .spatial-label.is-current {
  background:color-mix(in srgb,var(--layer-tint) 29%,var(--bg-surface));
  border-color:var(--layer-tint);
  box-shadow:0 3px 9px rgb(3 11 25 / 18%);
}
.spatial-atlas .label-category { border-radius:4px; border-inline-start-width:3px; }
.spatial-atlas .label-file { border-inline-start-width:3px; }
.spatial-atlas .label-file .label-title { font-weight:550; }
.spatial-atlas .label-algorithm { max-width:none; border-radius:999px; padding-inline:12px 6px; }
.spatial-atlas .label-algorithm .label-title { font-weight:750; white-space:nowrap; }
.spatial-label .label-dot { position:absolute; left:4px; top:9px; width:5px; height:5px;
  background:var(--node-tint); border-radius:50%; }
.spatial-workbench .spatial-label .label-title { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.spatial-footer { justify-content:flex-start; border-top:1px solid var(--border); color:var(--text-secondary); font-size:12px; }
.spatial-footer .graph-legend { margin:0; padding:0; background:none; }
.spatial-footer .legend-row { justify-content:flex-start; flex-wrap:wrap; }
.spatial-weight { gap:12px; }
.spatial-weight i { width:22px; background:var(--text-secondary); border-radius:2px; }
.spatial-branch-key i { width:18px; border-top:2px dashed #1ea78b; }
.spatial-lod { margin-inline-start:auto; }
.spatial-empty { position:absolute; inset:40% 0 auto; text-align:center; color:var(--text-secondary); pointer-events:none; }
@media(max-width:620px){
  .spatial-controls,.spatial-footer { padding:7px; gap:6px; }
  .spatial-controls button { padding-inline:7px; font-size:12px; }
  .spatial-atlas:not(.spatial-fullscreen) .spatial-tools-toggle { display:inline-flex; }
  .spatial-atlas:not(.spatial-fullscreen,.spatial-tools-open) :is(.spatial-turn,.spatial-actions) { display:none; }
  .spatial-atlas.spatial-tools-open .spatial-extra { margin-inline-start:auto; }
  .spatial-layers { top:8px; left:8px; max-width:calc(100% - 16px); }
  .spatial-layer { gap:4px; padding:4px 5px; font-size:11px; }
  .spatial-layer small { display:none; }
  .spatial-label { max-width:92px; padding:3px 4px; }
  .spatial-label.label-algorithm { max-width:68px; }
  .spatial-label .label-title { font-size:10.5px; }
  .spatial-label .label-meta { font-size:9px; }
}
@media(max-height:540px) and (orientation:landscape) {
  .spatial-atlas .spatial-controls,.spatial-atlas .spatial-footer { padding:4px 8px; gap:4px 8px; }
  .spatial-atlas .spatial-layers { top:6px; left:6px; }
}
</style>
