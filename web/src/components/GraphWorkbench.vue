<script setup>
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue';
import SelectControl from './SelectControl.vue';
import WorkbenchCanvas from './WorkbenchCanvas.vue';
import GraphEvidenceDetail from './GraphEvidenceDetail.vue';
import InfoTip from './InfoTip.vue';
import GraphExportMenu from './GraphExportMenu.vue';
import { statusOptions } from '../utils/verification.js';
import { purposeLabels } from '../utils/assistance.js';
const props=defineProps({open:Boolean,data:Object,result:Object,mode:String,focusId:String,trigger:Object,loadSource:Function});
const emit=defineEmits(['close','mode']);
const titleId = useId();
const dialog=ref(null),canvas=ref(null),selected=ref(''),graph=ref({nodes:[],links:[],width:800,height:500}),busy=ref(false),error=ref('');
const query=ref(''),algorithm=ref(''),purpose=ref(''),status=ref(''),source=ref('');
const filtersOpen=ref(false);
const filtered=computed(()=>Boolean(query.value || algorithm.value || purpose.value || status.value || source.value));
const renderStats=ref({nodes:0,edges:0,groups:0}),layoutMs=ref(0);
const current=computed(()=>graph.value.nodes.find(n=>n.id===selected.value));
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
  dialog.value?.close();
  emit('close');
  await nextTick();
  if (props.trigger?.isConnected) props.trigger.focus({ preventScroll:true });
}
function trap(event) {
  const items=[...dialog.value.querySelectorAll('button:not(:disabled),input,summary,[tabindex="0"]')].filter(e=>e.getClientRects().length);
  if(event.shiftKey && document.activeElement===items[0]){event.preventDefault();items.at(-1)?.focus();}
  else if(!event.shiftKey && document.activeElement===items.at(-1)){event.preventDefault();items[0]?.focus();}
}
function inspectNode(id) {
  selected.value = id;
  canvas.value?.locate(id);
}
function dismiss() {
  if (current.value) inspectNode('');
  else close();
}
watch(()=>props.open,async open=>{
  await nextTick();
  if(open){pendingFocus=props.focusId;selected.value='';query.value='';algorithm.value='';purpose.value='';status.value='';source.value='';filtersOpen.value=false;dialog.value.showModal();layout();}
  else {disposeLayout();dialog.value?.close();}
});
watch([()=>props.mode,()=>props.data,query,algorithm,purpose,status,source],()=>{selected.value='';layout();});
onBeforeUnmount(()=>{disposeLayout();dialog.value?.close();});
</script>
<template>
  <Teleport to="body"><dialog ref="dialog" class="graph-dialog graph-workbench" :data-layout-ms="layoutMs" :data-rendered-cards="renderStats.groups" :data-visible-nodes="renderStats.nodes" :aria-labelledby="titleId" @cancel.prevent="dismiss" @keydown.tab="trap">
    <header>
      <h2 :id="titleId">证据关系图</h2>
      <div class="segmented-group">
        <button class="button secondary compact" :aria-pressed="mode==='migration'" @click="$emit('mode','migration')">迁移关系</button>
        <button class="button secondary compact" :aria-pressed="mode==='calls'" @click="$emit('mode','calls')">调用与证据</button>
      </div>
      <div class="workbench-actions">
        <button class="button secondary compact" :aria-expanded="filtersOpen" @click="filtersOpen=!filtersOpen">{{ filtered ? '筛选中' : '筛选' }}</button>
        <GraphExportMenu :export-view="format => canvas?.exportView(format)" :disabled="busy || !graph.nodes.length" />
        <button class="button secondary compact" autofocus @click="close">关闭</button>
      </div>
    </header>
    <div v-show="filtersOpen" class="workbench-filters"><label>搜索文件／API<input v-model="query" type="search" placeholder="文件路径、API或算法" /></label><SelectControl v-model="algorithm" label="算法" :options="algorithms" :popup-target="dialog" /><SelectControl v-model="purpose" label="用途" :options="purposes" :popup-target="dialog" /><SelectControl v-model="status" label="状态" :options="statusOptions" :popup-target="dialog" /><SelectControl v-model="source" label="来源" :options="sources" :popup-target="dialog" /></div>
    <div class="workbench-summary"><span role="status">{{ busy?'正在生成关系图…':`${graph.files || 0} 个文件、${graph.nodes.length} 个节点、${graph.links.length} 条关系` }}</span><InfoTip label="关系图操作">滚轮缩放，拖动画布平移。搜索覆盖全部记录。线型含义见图例。</InfoTip></div>
    <p v-if="error" class="notice error" role="alert">{{ error }}<button class="button secondary compact" @click="layout">重试布局</button></p>
    <div v-if="open" class="workbench-body" :aria-busy="busy" :inert="busy || undefined">
      <WorkbenchCanvas ref="canvas" :graph="graph" :selected="selected" @select="inspectNode" @stats="renderStats=$event" />
      <GraphEvidenceDetail v-if="current" :node="current" :result="result" :load-source="loadSource" @close="inspectNode('')" />
    </div>
  </dialog></Teleport>
</template>
<style scoped>
.graph-workbench[open] { gap:4px; }
header { display:grid; grid-template-columns:auto minmax(0,1fr) auto; align-items:center; gap:5px 10px; }
h2 { margin:0; font-size:18px; }
.workbench-actions { display:flex; align-items:center; gap:6px; }
.workbench-filters { display:grid; grid-template-columns:minmax(180px,1.4fr) repeat(4,minmax(100px,1fr)); gap:10px; }
.workbench-filters label { font-size:13px; }
.workbench-summary { display:flex; align-items:center; justify-content:space-between; gap:8px; font-size:13px; }
.workbench-body { position:relative; display:flex; flex:1; gap:12px; min-height:0; }
.workbench-body :deep(.graph-evidence-detail) { position:absolute; z-index:2; inset:58px 12px 12px auto; border-radius:var(--radius-lg);
  border:1px solid var(--border); box-shadow:var(--shadow-lg); background:color-mix(in srgb,var(--bg-surface) 94%,transparent); backdrop-filter:blur(12px); }
@media(max-width:760px) {
  header { grid-template-columns:minmax(0,1fr) auto; }
  header > .segmented-group { grid-row:2; grid-column:1/-1; }
  .workbench-actions { grid-row:1; grid-column:2; }
  h2 { font-size:16px; }
  .workbench-filters { grid-template-columns:repeat(2,minmax(0,1fr)); }
  .workbench-filters > label { grid-column:1/-1; }
  .workbench-summary { font-size:12px; }
  .workbench-body { flex-direction:column; }
  .workbench-body > :first-child { min-height:120px; }
  .workbench-body :deep(.graph-evidence-detail) { inset:auto 6px 6px; width:auto; max-height:54%; min-height:0; }
}
</style>
