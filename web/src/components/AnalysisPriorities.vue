<script setup>
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';
import { visualizationRows } from '../utils/verification.js';
const props=defineProps({result:Object});
defineEmits(['select']);
const items=computed(()=>{
  const rows=visualizationRows(props.result);
  const ordered=[...rows].sort((a,b)=>Number(!!b.review_required)-Number(!!a.review_required) || Number((b.effective_purpose_code || b.purpose_code || 'unknown')==='unknown')-Number((a.effective_purpose_code || a.purpose_code || 'unknown')==='unknown'));
  return ordered.slice(0,3).map(r=>({...r,action:r.review_required?'核对相互冲突的证据':(r.effective_purpose_code || r.purpose_code || 'unknown')==='unknown'?'确认调用用途':r.verification_status==='ai_assessed'?'查看AI研判依据':'查看调用与迁移参考'}));
});
</script>
<template>
  <section class="priorities"><h3>优先查看</h3><button v-for="row in items" :key="row.finding_id || `${row.source_id}:${row.line}:${row.algorithm}`" class="priority" @click="$emit('select',{sourceId:row.source_id,algorithm:row.algorithm})"><span class="priority-icon"><AppIcon name="code" :size="18" /></span><span><strong>{{ row.algorithm }} · {{ row.action }}</strong><small>{{ row.file_name }} · 第 {{ row.line }} 行</small></span><AppIcon name="arrow" :size="18" /></button><p v-if="!items.length" class="notice">本次没有需要查看的算法发现。</p></section>
</template>
<style scoped>
.priorities { display:flex;flex-direction:column;gap:8px;min-width:0;min-height:0;padding:14px;background:var(--bg-elevated);border-radius:var(--radius); }h3 { margin:0 0 4px;font-size:16px; }.priority { display:grid;grid-template-columns:36px minmax(0,1fr) 18px;gap:12px;align-items:center;text-align:left;padding:10px 8px;min-height:64px;border-radius:var(--radius);color:var(--text-primary);background:var(--bg-surface);cursor:pointer; }.priority>span:nth-child(2) { display:grid;gap:5px;min-width:0; }.priority:hover { background:var(--accent-soft); }.priority strong { font-size:15px; }.priority small { font-size:13px;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }.priority-icon { color:var(--accent);display:grid;place-items:center; }
</style>
