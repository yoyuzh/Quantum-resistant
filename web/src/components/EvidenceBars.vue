<script setup>
import { computed } from 'vue';
import { fileLabel } from '../utils/presentation.js';
const props = defineProps({ title: String, rows: Array, peers: Array, total: Number, interactive: Boolean, hideTitle: Boolean });
defineEmits(['select']);
const max = computed(() => Math.max(1, ...(props.rows || []).map((r) => r.count)));
</script>
<template>
  <section class="evidence-bars stack" :aria-label="title">
    <div v-if="!hideTitle">
      <h3>{{ title }}</h3>
    </div>
    <p v-if="!rows?.length" class="small muted">本次没有可统计的发现。</p>
    <component
      :is="interactive ? 'button' : 'div'"
      v-for="row in rows"
      :key="row.key"
      class="evidence-bar"
      :class="{ actionable: interactive }"
      :aria-label="`${fileLabel(row, peers || rows)}：${row.count} 项`"
      @click="interactive && $emit('select', row)"
    >
      <span class="bar-name"
        >{{ fileLabel(row, peers || rows) }}</span
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
  padding: 10px;
  background: var(--bg-elevated);
  border-radius: var(--radius-lg);
}
.evidence-bars.stack { gap: 4px; }
h3 { font-size: 14px; }
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
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  padding: 2px 6px;
  min-height: 28px;
  border-radius: var(--radius);
  background: transparent;
  transition: background-color 140ms ease;
}
.actionable .bar-name {
  color: var(--accent-dim);
  text-decoration: underline;
  text-decoration-color: var(--accent-glow);
  text-underline-offset: 0.25em;
}
.actionable:hover .bar-name { text-decoration-color: currentColor; }
.actionable:hover {
  color: var(--accent);
  background: var(--control-hover);
}
.actionable:active { background: var(--control-pressed); }
@media (max-width: 600px), (pointer: coarse) {
  .actionable { min-height: 44px; }
}
</style>
