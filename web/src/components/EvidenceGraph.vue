<script setup>
import { computed, ref, watch } from 'vue';
import GraphPreview from './GraphPreview.vue';
import GraphWorkbench from './GraphWorkbench.vue';
import { visualizationRows } from '../utils/verification.js';
import { callRows } from '../utils/callGraph.js';
const props=defineProps({assets:{type:Array,default:()=>[]},active:Boolean,available:{type:Boolean,default:true},result:Object,loadSource:Function});
const root=ref(null),mode=ref('migration'),opened=ref(false),focusId=ref(''),trigger=ref(null);
const data=computed(()=>({assets:props.assets,calls:callRows(props.result),sources:props.result?.sources || [],findings:visualizationRows(props.result).map(f=>({finding_id:f.finding_id,origins:f.origins})),evidencePaths:(mode.value==='calls'?props.result?.deep_analysis?.evidence_paths || []:[]).map(p=>({evidence_id:p.evidence_id,nodes:p.nodes.map(n=>({node_id:n.node_id,location:n.location})),edges:p.edges}))}));
function open(id) {focusId.value=id;trigger.value=root.value?.querySelector('.preview-open');opened.value=true;}
watch([()=>props.active,()=>props.result],()=>{opened.value=false;});
</script>
<template>
  <section ref="root" class="evidence-graph" aria-label="证据关系图"><div class="segmented-group"><button class="button secondary" :aria-pressed="mode==='migration'" @click="mode='migration'">迁移关系</button><button class="button secondary" :aria-pressed="mode==='calls'" @click="mode='calls'">调用与证据</button></div>
    <GraphPreview v-if="available" :data="data" :mode="mode" @open="open" /><p v-else class="notice">此历史结果未记录资产分析，重新扫描可生成关系图。</p>
    <GraphWorkbench :open="opened" :mode="mode" :data="data" :result="result" :focus-id="focusId" :trigger="trigger" :load-source="loadSource" @close="opened=false" @mode="mode=$event" />
  </section>
</template>
<style scoped>
.evidence-graph { flex:1;display:flex;flex-direction:column;gap:12px;min-width:0;min-height:0; }
</style>
