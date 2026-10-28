<script setup>
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';
import ExportMenu from './ExportMenu.vue';
import { formatTime } from '../utils/results.js';
import { fileLabel } from '../utils/presentation.js';
import { methodLabel } from '../utils/analysis.js';
import { resultViews } from '../utils/resultViews.js';
import SourceBar from './SourceBar.vue';
const props = defineProps({ result: Object, tab: String, filters: Object, origin: Object, announcement: String, state: Object, input: Object });
defineEmits(['back', 'reset', 'toggle-input', 'rescan']);
const originLabel = computed(() => resultViews.find(([value]) => value === props.origin?.tab)?.[1]);
const hasFilters = computed(() => ['assets', 'findings'].includes(props.tab) && Object.values(props.filters).some(Boolean));
const context = computed(() => {
  if (props.announcement) return props.announcement.replace(/^发现明细 · /, '');
  if (!hasFilters.value) return '';
  const f = props.filters;
  return [f.algorithm, f.sourceId && fileLabel(props.result.sources.find(s => s.source_id === f.sourceId) ||
    { file_name: f.sourceId }, props.result.sources), f.target, f.method && methodLabel(f.method), f.query]
    .filter(Boolean).join(' · ');
});
</script>
<template>
  <div class="result-header">
    <div class="result-title" :title="`${formatTime(result.scanned_at)} · 北京时间`">
      <h2>扫描结果</h2>
      <span>{{ formatTime(result.scanned_at) }}</span>
    </div>
    <div v-if="state.readOnly" class="result-source small">{{ input.source }}</div>
    <SourceBar v-else class="result-source" :source="input.source" :collapsed="input.collapsed"
      :busy="state.busy" :restored="state.restored" :note="state.taskNote"
      @toggle="$emit('toggle-input')" @rescan="$emit('rescan')" />
    <ExportMenu class="result-export" :result="result" />
    <div v-if="origin || context" class="result-context">
      <button v-if="origin" class="button text-action compact return-button" @click="$emit('back')">
        <AppIcon name="back" :size="16" />返回{{ originLabel }}
      </button>
      <p class="small" role="status" aria-live="polite" :title="context">{{ context }}</p>
      <button v-if="hasFilters" class="button text-action subtle compact clear-filters" title="清除筛选" @click="$emit('reset')">
        <AppIcon name="close" :size="14" /><span class="clear-label">清除筛选</span>
      </button>
    </div>
  </div>
</template>
<style scoped>
.result-header { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center;
  gap: 0 12px; padding: 8px var(--workspace-gutter); min-height: 48px; }
.result-title h2 { font-size: 14px; line-height: 19px; }
.result-title span { display: block; font-size: 11px; line-height: 16px; color: var(--text-secondary); }
.result-title { min-width: 0; }
.result-source { min-width: 0; }
.result-export { justify-self: end; grid-column: 3; grid-row: 1; }
.result-context {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  grid-column: 1 / -1;
}
.result-context p { grid-column: 2; min-width: 0; overflow-wrap: anywhere; color: var(--text-secondary);
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
.return-button { grid-column: 1; grid-row: 1; }
.clear-filters { grid-column: 3; grid-row: 1; }
.result-context .button { white-space: nowrap; }
@container results (max-width: 760px) {
  .result-header { grid-template-columns: minmax(0, 1fr) auto; gap: 6px; padding: 8px var(--workspace-gutter); }
  .result-source { grid-column: 1 / -1; grid-row: 2; }
  .result-export { grid-column: 2; grid-row: 1; }
  .clear-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
}
</style>
