<script setup>
import { computed } from 'vue';
import { distribution, visualizationRows, statusLabel } from '../utils/verification.js';
import { purposeLabels } from '../utils/assistance.js';
import InfoTip from './InfoTip.vue';
const props=defineProps({result:Object});
defineEmits(['select']);
const algorithms=computed(()=>distribution(props.result).slice(0,8));
const maximum=computed(()=>Math.max(1,...algorithms.value.map(r=>r.confirmed+r.ai_assessed+r.pending)));
const states=['confirmed','ai_assessed','pending'];
const purposes=computed(()=>[...new Set(visualizationRows(props.result).map(r=>r.effective_purpose_code || r.purpose_code || 'unknown'))].slice(0,7));
const counts=computed(()=>{
  const values=new Map();
  for (const row of visualizationRows(props.result)) {
    const key=JSON.stringify([row.algorithm,row.effective_purpose_code || row.purpose_code || 'unknown']);
    values.set(key,(values.get(key) || 0)+1);
  }
  return values;
});
const count=(algorithm,purpose)=>counts.value.get(JSON.stringify([algorithm,purpose])) || 0;
</script>
<template>
  <div class="analysis-visuals">
    <section class="visual-card"><div class="visual-heading"><h3>算法与判断来源</h3><InfoTip label="判断来源说明">实色为静态确认，斜纹为AI研判，点纹为证据不足。AI研判单独统计，不参与静态迁移评分。</InfoTip></div>
      <div v-for="row in algorithms" :key="row.algorithm" class="distribution-row"><strong>{{ row.algorithm }}</strong><div class="segments"><button v-for="status in states" :key="status" :class="status" :disabled="!row[status]" :style="{width:row[status]/maximum*100+'%'}" :aria-label="row.algorithm+' '+statusLabel(status)+' '+row[status]+'项'" :title="statusLabel(status)+' '+row[status]+'项'" @click="$emit('select',{algorithm:row.algorithm,status})"><span v-if="row[status]">{{ row[status] }}</span></button></div><span>{{ row.confirmed+row.ai_assessed+row.pending }}</span></div>
      <div class="chart-legend"><span v-for="status in states" :key="status"><i :class="status"></i>{{ statusLabel(status) }}</span></div>
      <p v-if="!algorithms.length" class="notice">本次没有可绘制的算法证据。</p>
    </section>
    <section class="visual-card"><div class="visual-heading"><h3>算法与用途</h3><InfoTip label="用途矩阵说明">每格表示对应算法和用途的记录数，点击筛选。展示记录数最多的8种算法；不同判断来源可在明细中继续筛选。</InfoTip></div>
      <div class="matrix-scroll"><table><thead><tr><th>算法</th><th v-for="purpose in purposes" :key="purpose">{{ purposeLabels[purpose] }}</th></tr></thead><tbody><tr v-for="row in algorithms" :key="row.algorithm"><th>{{ row.algorithm }}</th><td v-for="purpose in purposes" :key="purpose"><button :disabled="!count(row.algorithm,purpose)" :style="{background:count(row.algorithm,purpose)?'var(--accent-soft)':'transparent'}" :aria-label="row.algorithm+' '+purposeLabels[purpose]+' '+count(row.algorithm,purpose)+'项'" @click="$emit('select',{algorithm:row.algorithm,purpose})">{{ count(row.algorithm,purpose) || '—' }}</button></td></tr></tbody></table></div>
    </section>
  </div>
</template>
<style scoped>
.analysis-visuals { display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:12px;grid-column:1/-1; }.visual-card { min-width:0;padding:10px 12px;background:var(--bg-elevated);border-radius:var(--radius); }.visual-heading { display:flex;align-items:center;justify-content:space-between;margin-bottom:10px; }.visual-heading h3 { font-size:13px; }
.distribution-row { display:grid;grid-template-columns:86px minmax(0,1fr) 26px;gap:8px;align-items:center;min-height:34px;font-size:12px; }.distribution-row strong { overflow:hidden;text-overflow:ellipsis; }.distribution-row > span { text-align:right;font-variant-numeric:tabular-nums; }.segments { display:flex;align-items:center;height:24px; }.segments button { height:24px;color:var(--text-primary);padding:0;cursor:pointer;min-width:0;overflow:hidden;font-size:11px; }.segments button:disabled { width:0; }.confirmed { background:var(--accent-soft);box-shadow:inset 0 -3px var(--accent); }.ai_assessed { background:repeating-linear-gradient(135deg,var(--accent-soft) 0 4px,var(--bg-surface) 4px 7px); }.pending { background:var(--bg-surface);border-bottom:2px dotted var(--text-muted); }
.chart-legend { display:flex;gap:12px;flex-wrap:wrap;margin-top:10px;font-size:11px;color:var(--text-secondary); }.chart-legend span { display:flex;gap:5px;align-items:center; }.chart-legend i { width:16px;height:12px; }
.matrix-scroll { overflow:auto; }table { width:100%;border-collapse:collapse;font-size:12px;text-align:center; }th { font-weight:500;color:var(--text-secondary);white-space:nowrap;padding:5px; }td { padding:3px; }td button { width:100%;min-width:36px;min-height:27px;border-radius:4px;color:var(--accent-dim);cursor:pointer;font-variant-numeric:tabular-nums; }td button:disabled { color:var(--text-muted);cursor:default; }
@container results (max-width:760px) { .analysis-visuals { grid-template-columns:minmax(0,1fr); } }
.visual-card { display:flex;flex-direction:column;min-height:0;padding:10px; }.visual-heading { flex:none;margin-bottom:6px; }.visual-heading h3 { font-size:16px; }.distribution-row { flex:1;min-height:24px;font-size:14px; }.segments button { font-size:13px; }.chart-legend { font-size:13px;flex:none;margin-top:6px; }.matrix-scroll { flex:1;min-height:0; }table { height:100%;font-size:14px; }th { padding:1px;line-height:20px; }td { padding:1px; }td button { font-size:14px;min-height:20px;line-height:20px;padding:0 4px; }
</style>
