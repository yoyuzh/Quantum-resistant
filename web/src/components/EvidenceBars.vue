<script setup>
import { computed } from 'vue';
const props = defineProps({ title: String, rows: Array, total: Number, interactive: Boolean });
defineEmits(['select']);
const max = computed(() => Math.max(1, ...(props.rows || []).map((r) => r.count)));
</script>
<template>
  <section class="evidence-bars stack" :aria-label="title">
    <div>
      <h3>{{ title }}</h3>
      <p class="small muted">{{ total }} 项发现中的分布 · 数量不代表风险概率</p>
    </div>
    <p v-if="!rows?.length" class="small muted">本次没有可统计的发现。</p>
    <component
      :is="interactive ? 'button' : 'div'"
      v-for="row in rows"
      :key="row.key"
      class="evidence-bar"
      :class="{ actionable: interactive }"
      :aria-label="`${row.label}：${row.count} 项`"
      @click="interactive && $emit('select', row)"
    >
      <span class="bar-name"
        >{{ row.label }}<small v-if="row.key.startsWith('src_')">{{ row.key }}</small></span
      >
      <span class="bar-track" aria-hidden="true"
        ><i :style="{ width: `${(row.count / max) * 100}%` }"
      /></span>
      <strong>{{ row.count }}</strong>
    </component>
  </section>
</template>
<style scoped>
.evidence-bars {
  padding: 1rem;
  background: var(--bg-elevated);
  border-radius: var(--radius-lg);
}
.evidence-bar {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(50px, 1fr) 40px;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  background: transparent;
  color: var(--text-primary);
  padding: 0.4rem 0;
  text-align: left;
}
.bar-name {
  font-size: 0.8rem;
  overflow-wrap: anywhere;
}
small {
  display: block;
  color: var(--text-secondary);
  font-size: 0.65rem;
}
.bar-track {
  height: 9px;
  background: var(--accent-soft);
  border-radius: 8px;
  overflow: hidden;
}
.bar-track i {
  display: block;
  height: 100%;
  background: var(--accent);
  border-radius: inherit;
}
strong {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.actionable {
  cursor: pointer;
}
.actionable:hover {
  color: var(--accent);
}
</style>
