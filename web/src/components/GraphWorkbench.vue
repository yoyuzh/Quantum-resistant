<script setup>
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import SelectControl from './SelectControl.vue';
import WorkbenchCanvas from './WorkbenchCanvas.vue';
import GraphEvidenceDetail from './GraphEvidenceDetail.vue';
import InfoTip from './InfoTip.vue';
import { statusOptions } from '../utils/verification.js';
import { purposeLabels } from '../utils/assistance.js';
const props=defineProps({open:Boolean,data:Object,result:Object,mode:String,focusId:String,trigger:Object,loadSource:Function});
const emit=defineEmits(['close','mode']);
const Stage3DCanvas = defineAsyncComponent(() => import('./Stage3DCanvas.vue'));
const unavailable3D = ref(false), viewMode = ref('2d');
const dialog=ref(null),canvas=ref(null),selected=ref(''),graph=ref({nodes:[],links:[],width:800,height:500}),busy=ref(false),error=ref(''),maximized=ref(false);
const query=ref(''),algorithm=ref(''),purpose=ref(''),status=ref(''),source=ref('');
const renderStats=ref({nodes:0,edges:0,groups:0}),layoutMs=ref(0);
const edgeEvidence = ref('');
const current=computed(()=>graph.value.nodes.find(n=>n.id===(edgeEvidence.value || selected.value)));
const algorithms=computed(()=>[{value:'',label:'全部算法'},...[...new Set([...(props.data?.assets || []),...(props.data?.calls || [])].map(a=>a.algorithm))].filter(Boolean).sort().map(value=>({value,label:value}))]);
const purposes=[{value:'',label:'全部用途'},...Object.entries(purposeLabels).map(([value,label])=>({value,label}))];
const sources=[{value:'',label:'全部来源'},{value:'rule',label:'规则发现'},{value:'cross_file',label:'跨文件核验'},{value:'ai',label:'AI参与'}];
let worker,timer,ticket=0,pendingFocus='',workerData;
function disposeLayout() {
  ticket++;
  clearTimeout(timer);
  worker?.terminate();
  worker = workerData = undefined;
}
function layout() {
  clearTimeout(timer);
  const sequence=++ticket;
  if(!props.open)return;
  busy.value=true;
  error.value='';
  timer=setTimeout(()=>{
    if(!worker) {
      worker=new Worker(new URL('../workers/graphLayout.js',import.meta.url),{type:'module'});
      worker.onmessage=async ({data})=>{
        if(data.ticket!==ticket)return;
        busy.value=false;
        if(data.error) {error.value=data.error;return;}
        graph.value=data.graph;
        layoutMs.value=data.duration_ms;
        await nextTick();
        if(data.ticket!==ticket)return;
        if(pendingFocus && graph.value.nodes.some(n=>n.id===pendingFocus)) {
          selected.value=pendingFocus;
          canvas.value?.locate(pendingFocus);
        }
        pendingFocus='';
      };
      worker.onerror=()=>{
        disposeLayout();
        busy.value=false;
        error.value='图布局未完成，请重试。';
      };
    }
    const data = props.data===workerData ? undefined : JSON.parse(JSON.stringify(props.data ?? {}));
    worker.postMessage({ticket:sequence,data,mode:props.mode,
      filter:{query:query.value,algorithm:algorithm.value,purpose:purpose.value,status:status.value,source:source.value}});
    workerData=props.data;
  },120);
}
async function close() {
  if(document.fullscreenElement===dialog.value) await document.exitFullscreen().catch(()=>{});
  dialog.value?.close();emit('close');await nextTick();props.trigger?.isConnected && props.trigger.focus({preventScroll:true});
}
async function full() {
  if(document.fullscreenElement===dialog.value) {await document.exitFullscreen();return;}
  if(dialog.value.requestFullscreen) {try {await dialog.value.requestFullscreen();return;}catch{}}
  maximized.value=!maximized.value;
}
function trap(event) {
  const items=[...dialog.value.querySelectorAll('button:not(:disabled),input,[tabindex="0"]')].filter(e=>e.getClientRects().length);
  if(event.shiftKey && document.activeElement===items[0]){event.preventDefault();items.at(-1)?.focus();}
  else if(!event.shiftKey && document.activeElement===items.at(-1)){event.preventDefault();items[0]?.focus();}
}
function inspectEdge(id) {
  const edge = graph.value.links.find(link=>link.id===id);
  if (!edge) return;
  const target = graph.value.nodes.find(node=>node.id===edge.target);
  edgeEvidence.value = target?.sourceId && target.line ? edge.target : edge.source;
}
function inspectNode(id) {
  edgeEvidence.value = '';
  selected.value = id;
  canvas.value?.locate(id);
}
function fallback() {
  unavailable3D.value = true;
  viewMode.value = '2d';
}
function openSpatial() {
  if (edgeEvidence.value) selected.value = edgeEvidence.value;
  viewMode.value = '3d';
}
watch(()=>props.open,async open=>{
  await nextTick();
  if(open){pendingFocus=props.focusId;selected.value='';edgeEvidence.value='';query.value='';algorithm.value='';purpose.value='';status.value='';source.value='';dialog.value.showModal();layout();}
  else {disposeLayout();dialog.value?.close();}
});
watch([()=>props.mode,()=>props.data,query,algorithm,purpose,status,source],()=>{selected.value='';edgeEvidence.value='';layout();});
onBeforeUnmount(()=>{disposeLayout();dialog.value?.close();});
</script>
<template>
  <Teleport to="body"><dialog ref="dialog" class="graph-workbench" :class="{maximized}" :data-layout-ms="layoutMs" :data-rendered-cards="renderStats.groups" :data-visible-nodes="renderStats.nodes" aria-labelledby="graph-workbench-title" @cancel.prevent="close" @keydown.tab="trap">
    <header>
      <h2 id="graph-workbench-title">证据关系图</h2>
      <div class="segmented-group">
        <button class="button secondary compact" :aria-pressed="mode==='migration'" @click="$emit('mode','migration')">迁移关系</button>
        <button class="button secondary compact" :aria-pressed="mode==='calls'" @click="$emit('mode','calls')">调用与证据</button>
      </div>
      <div class="segmented-group" aria-label="图形视图">
        <button class="button secondary compact" :aria-pressed="viewMode==='2d'" @click="viewMode='2d'">2D</button>
        <button class="button secondary compact" :aria-pressed="viewMode==='3d'" :disabled="unavailable3D"
          :title="unavailable3D ? '3D 不可用，当前使用 2D' : undefined" @click="openSpatial">3D</button>
      </div>
      <div class="window-actions">
        <button class="button secondary compact" @click="full">全屏／还原</button>
        <button class="button secondary compact" autofocus @click="close">关闭</button>
      </div>
    </header>
    <div class="workbench-filters"><label>搜索文件／API<input v-model="query" type="search" placeholder="文件路径、API或算法" /></label><SelectControl v-model="algorithm" label="算法" :options="algorithms" :popup-target="dialog" /><SelectControl v-model="purpose" label="用途" :options="purposes" :popup-target="dialog" /><SelectControl v-model="status" label="状态" :options="statusOptions" :popup-target="dialog" /><SelectControl v-model="source" label="来源" :options="sources" :popup-target="dialog" /></div>
    <div class="workbench-summary"><span role="status">{{ busy?'正在布局…':`${graph.files || 0} 个文件 · ${graph.nodes.length} 个节点 · ${graph.links.length} 条关系` }}</span><InfoTip label="图形操作与状态说明">滚轮缩放，复位返回总览。远景简化标签和关系，搜索覆盖全部记录。实线为静态关系，长虚线为 AI 研判，点线为关联或条件参考。当前显示 {{ renderStats.groups }} 个标签。</InfoTip></div>
    <p v-if="unavailable3D" class="notice" role="status">当前环境无法显示 3D，已切换到 2D。</p>
    <p v-if="error" class="notice error" role="alert">{{ error }}<button class="button secondary compact" @click="layout">重试布局</button></p>
    <div v-if="open" class="workbench-body" :aria-busy="busy" :inert="busy || undefined">
      <Stage3DCanvas v-if="viewMode==='3d'" ref="canvas" variant="workbench" :graph="graph" :selected="selected"
        @select="inspectNode" @select-edge="inspectEdge" @stats="renderStats=$event" @unavailable="fallback" />
      <WorkbenchCanvas v-else ref="canvas" :graph="graph" :selected="edgeEvidence || selected" @select="inspectNode" @stats="renderStats=$event" />
      <GraphEvidenceDetail v-if="current" :node="current" :result="result" :load-source="loadSource" @close="inspectNode('')" />
    </div>
  </dialog></Teleport>
</template>
<style scoped>
.graph-workbench { width:95vw;height:95dvh;max-width:none;max-height:none;padding:16px;margin:auto;border:0;border-radius:var(--radius-lg);background:var(--bg-surface);color:var(--text-primary); }.graph-workbench[open] { display:flex;flex-direction:column;gap:12px; }.graph-workbench::backdrop { background:rgb(8 18 28 / 42%); }.graph-workbench:fullscreen,.graph-workbench.maximized { width:100vw;height:100dvh;border-radius:0;margin:0; }header { display:flex;align-items:center;gap:16px;flex-wrap:wrap; }h2 { margin:0;font-size:20px; }.window-actions { margin-left:auto;display:flex;gap:8px; }.workbench-filters { display:grid;grid-template-columns:minmax(180px,1.4fr) repeat(4,minmax(100px,1fr));gap:10px; }.workbench-filters label { font-size:13px; }.workbench-summary { display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:14px; }.workbench-body { min-height:0;flex:1;display:flex;gap:12px; }@media(max-width:760px) { .graph-workbench { width:100%;height:100dvh;padding:12px;margin:0;border-radius:0; }.workbench-filters { grid-template-columns:repeat(2,minmax(0,1fr)); }.workbench-filters>label { grid-column:1/-1; }.workbench-body { flex-direction:column; }.workbench-body>:first-child { min-height:120px; }.workbench-body>.graph-evidence-detail { flex:0 1 45%;max-height:45%;min-height:0; }header { gap:8px; }h2 { font-size:18px; }.window-actions { gap:4px; }.workbench-summary { font-size:12px; } }
</style>

<style scoped>
.workbench-body { position:relative; }
.workbench-body :deep(.graph-evidence-detail) { position:absolute; z-index:2; inset:58px 12px 12px auto; border-radius:var(--radius-lg);
  border:1px solid var(--border); box-shadow:var(--shadow-lg); background:color-mix(in srgb,var(--bg-surface) 94%,transparent); backdrop-filter:blur(12px); }
@media(max-width:760px) { .workbench-body :deep(.graph-evidence-detail) { inset:auto 6px 6px; width:auto; max-height:54%; } }
</style>
