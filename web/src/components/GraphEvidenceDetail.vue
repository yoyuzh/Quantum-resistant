<script setup>
import { computed } from 'vue';
import FindingDetail from './FindingDetail.vue';
import CodePreview from './CodePreview.vue';
import { visualizationRows,statusLabel } from '../utils/verification.js';
const props=defineProps({node:Object,result:Object,loadSource:Function});
defineEmits(['close']);
const file=computed(()=>props.result.sources?.find(s=>s.source_id===props.node?.sourceId)?.file_name || '');
const call=computed(()=>props.result.integrated_analysis?.calls?.find(c=>c.id===props.node?.callId));
const rows=computed(()=>visualizationRows(props.result).filter(f=>(!call.value?.finding_id || f.finding_id===call.value.finding_id) && (!props.node?.sourceId || f.source_id===props.node.sourceId) && (!props.node?.algorithm || f.algorithm===props.node.algorithm) && (!props.node?.line || f.line===props.node.line)));
const current=computed(()=>rows.value[0]);
</script>
<template>
  <aside class="graph-evidence-detail" aria-label="图节点依据与源码"><header><strong>{{ node.label }}</strong><button class="button text-action compact" @click="$emit('close')">收起</button></header><span class="tag">{{ node.referenceLabel!==undefined?'迁移参考':statusLabel(node.status) }}</span>
    <p v-if="node.detail">{{ node.detail }}</p><FindingDetail v-if="current" :finding="current" :sources="result.sources" :load-source="loadSource" compact />
    <CodePreview v-if="current || (node.sourceId && node.line)" :sources="result.sources" :finding="current || {source_id:node.sourceId,line:node.line,file_name:file}" :load-source="loadSource" />
    <div v-else><p v-if="node.kind==='reference'">此项为迁移参考，须结合已确认用途评估协议和库的兼容性。</p><p>{{ rows.length }} 项关联发现</p><ul><li v-for="row in rows.slice(0,30)" :key="row.finding_id">{{ row.file_name }} · 第 {{ row.line }} 行 · {{ row.algorithm }}</li></ul></div>
  </aside>
</template>
<style scoped>
.graph-evidence-detail { width:clamp(300px,32%,460px);flex:none;min-width:0;overflow:auto;overscroll-behavior:contain;padding:14px;background:var(--bg-elevated);font-size:14px;overflow-wrap:anywhere; }header { display:flex;align-items:start;justify-content:space-between;gap:10px; }header strong { min-width:0; }header button { flex:none; }.graph-evidence-detail :deep(.finding-detail) { padding:8px 0; }.graph-evidence-detail>p { margin-block:10px; }@media(max-width:760px) { .graph-evidence-detail { width:100%;max-height:42dvh; } }
</style>
