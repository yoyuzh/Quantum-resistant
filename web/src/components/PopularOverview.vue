<script setup>
import { computed } from 'vue';
const props = defineProps({ result: Object });
defineEmits(['select']);
const rows = computed(() =>
  (props.result?.repos || [])
    .map((r) => ({ key: r.full_name, label: r.full_name, count: (r.analysis_summary?.confirmed ?? r.finding_count)+(r.analysis_summary?.ai_assessed || 0), static:r.analysis_summary?.confirmed ?? r.finding_count, assessed:r.analysis_summary?.ai_assessed || 0 }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key)),
);
const partial = computed(
  () => (props.result?.repos || []).filter((r) => r.coverage?.partial).length,
);
const total = computed(() => rows.value.reduce((sum, row) => sum + row.count, 0));
const maximum=computed(()=>Math.max(1,...rows.value.map(row=>row.count)));
</script>
<template>
  <details class="popular-overview">
    <summary>本次批次概览 · {{ rows.length }} 个可用仓库</summary>
    <p class="small muted">
      可用 {{ rows.length }} 个 · 部分扫描 {{ partial }} 个 · 失败/未完成
      {{ result.failures?.length || 0 }} 个
    </p>
    <div class="repository-comparison" aria-label="仓库静态确认与AI研判对比"><button v-for="row in rows" :key="row.key" @click="$emit('select',row.key)"><strong>{{ row.label }}</strong><span class="comparison-track"><i class="static" :style="{width:row.static/maximum*100+'%'}"></i><i class="assessed" :style="{width:row.assessed/maximum*100+'%'}"></i></span><small>静态 {{ row.static }} / AI {{ row.assessed }}</small></button></div>
  </details>
</template>
<style scoped>
summary {
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--accent);
}
.popular-overview {
  padding: 8px 10px;
  background: var(--bg-elevated);
  border-radius: var(--radius);
}
.popular-overview :deep(.evidence-bars) {
  padding: 0;
  background: transparent;
}
p {
  margin: 6px 0;
}
.repository-comparison { display:grid;gap:8px;margin-top:8px; }.repository-comparison button { display:grid;gap:3px;text-align:left;background:transparent;color:var(--text-primary);cursor:pointer; }.repository-comparison strong { font-size:12px;overflow-wrap:anywhere; }.repository-comparison small { font-size:11px;color:var(--text-secondary); }.comparison-track { display:flex;height:8px; }.comparison-track i { display:block; }.static { background:var(--accent); }.assessed { background:repeating-linear-gradient(135deg,var(--accent-soft) 0 3px,var(--accent) 3px 5px); }
</style>
