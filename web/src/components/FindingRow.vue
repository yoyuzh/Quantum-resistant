<script setup>
import AppIcon from './AppIcon.vue';
import { fileLabel } from '../utils/presentation.js';
import { findingKey } from '../utils/results.js';
defineProps({ finding: Object, peers: Array, selected: Boolean });
defineEmits(['select']);
</script>
<template>
  <button class="finding-row" :class="{ selected }" :aria-pressed="selected"
    :data-finding-key="findingKey(finding)"
    :aria-label="`${finding.algorithm} · ${finding.risk_level} · ${fileLabel(finding, peers)} · 第 ${finding.line} 行，查看详情与源码`"
    @click="$emit('select', finding, $event)">
    <span class="finding-algorithm"><strong>{{ finding.algorithm }}</strong><small>{{ finding.risk_level }}</small></span>
    <span class="finding-location"><strong>{{ fileLabel(finding, peers) }}</strong><small>第 {{ finding.line }} 行</small></span>
    <code>{{ finding.evidence }}</code>
    <AppIcon class="row-arrow" name="chevron" :size="14" />
  </button>
</template>
<style scoped>
.finding-row {
  width: 100%; height: 52px; min-height: 52px; padding: 6px var(--workspace-gutter);
  display: grid; grid-template-columns: 68px minmax(110px, 1fr) minmax(100px, 1.1fr) 12px;
  gap: 8px; align-items: center; text-align: left; cursor: pointer;
  color: var(--text-primary); background: var(--bg-surface);
  border-radius: 0;
}
.finding-row + .finding-row { border-top: 1px solid var(--border-light); }
.finding-row:hover { background: var(--control-hover); }
.finding-row:active { background: var(--control-pressed); }
.finding-row.selected { background: var(--control-selected); box-shadow: inset 3px 0 var(--accent); }
.finding-row:focus-visible { outline-offset: -3px; }
.finding-row > span { min-width: 0; }
strong, small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
strong { font-size: 13px; font-weight: 500; line-height: 19px; }
small { color: var(--text-secondary); font-size: 11px; line-height: 16px; }
.finding-algorithm strong { color: var(--accent-dim); font-weight: 600; }
.finding-algorithm small { color: var(--danger); }
code { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font: 12px/1.5 var(--font-mono); color: var(--text-secondary); }
.row-arrow { color: var(--accent-dim); }
@media (forced-colors: active) {
  .finding-row + .finding-row { border-top-color: CanvasText; }
  .finding-row.selected { outline: 2px solid Highlight; outline-offset: -2px; }
}
@media (max-width: 600px) {
  .finding-row { grid-template-columns: 65px minmax(0, 1fr) 12px; gap: 8px; height: auto; min-height: 68px; }
  code { grid-column: 2; grid-row: 2; }
  .finding-algorithm { grid-row: 1 / 3; }
  .row-arrow { grid-column: 3; grid-row: 1 / 3; }
}
</style>
