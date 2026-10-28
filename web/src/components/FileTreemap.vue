<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { visualizationRows } from '../utils/verification.js';
import InfoTip from './InfoTip.vue';
import AppIcon from './AppIcon.vue';
import FileMapCanvas from './FileMapCanvas.vue';
import FileMapDialog from './FileMapDialog.vue';
const props=defineProps({result:Object});
const emit=defineEmits(['select']);
const root=ref(null),width=ref(600),height=ref(240),expanded=ref(false),trigger=ref(null);
const files=computed(()=>{
  const values=new Map();
  const sources=new Map((props.result.sources || []).map(s=>[s.source_id,s.file_name]));
  for (const row of visualizationRows(props.result)) {
    const file=values.get(row.source_id) || {id:row.source_id,name:row.file_name || sources.get(row.source_id) || row.source_id,count:0,ai:0,pending:0};
    file.count++;file.ai+=row.verification_status==='ai_assessed';file.pending+=row.verification_status==='pending';values.set(file.id,file);
  }
  return [...values.values()].sort((a,b)=>b.count-a.count || a.name.localeCompare(b.name));
});
watch(()=>props.result,()=>{expanded.value=false;});
let observer;
onMounted(()=>{observer=new ResizeObserver(()=>{width.value=Math.max(200,root.value.clientWidth);height.value=Math.max(180,root.value.clientHeight);});observer.observe(root.value);});
onBeforeUnmount(()=>observer?.disconnect());
function select(value) { expanded.value=false;emit('select',value); }
</script>
<template>
  <section class="file-map-card"><header><h3>文件中的算法发现</h3><div class="map-actions"><InfoTip label="文件分布说明">矩形按发现数量分配，极小分组保留可读空间。小图合并末尾文件；展开可查看全部文件并按名称查找。</InfoTip><button ref="trigger" class="button secondary compact" :disabled="!files.length" @click="expanded=true"><AppIcon name="expand" :size="16" />展开</button></div></header>
    <div ref="root" class="file-map-canvas"><FileMapCanvas v-if="files.length" :files="files" :width="width" :height="height" @select="select" @expand="expanded=true" /><p v-else class="notice">本次没有算法发现。</p></div>
    <FileMapDialog :files="files" :open="expanded" :trigger="trigger" @close="expanded=false" @select="select" />
  </section>
</template>
<style scoped>
.file-map-card { display:flex;flex-direction:column;gap:10px;min-height:0;min-width:0;padding:14px;background:var(--bg-elevated);border-radius:var(--radius); }header,.map-actions { display:flex;align-items:center;justify-content:space-between;gap:8px;flex:none; }h3 { font-size:16px;margin:0; }.file-map-canvas { flex:1;min-height:180px; }
</style>
