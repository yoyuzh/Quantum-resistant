<script setup>
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';
import ExportMenu from './ExportMenu.vue';
import { formatTime } from '../utils/results.js';
import { fileLabel } from '../utils/presentation.js';
import { methodLabel } from '../utils/analysis.js';
const props = defineProps({ result: Object, tab: String, filters: Object, origin: Object, announcement: String });
const emit = defineEmits(['select-tab', 'back', 'reset']);
const tabs = [
  ['overview', '分析概览', 'graph'], ['assets', '资产清单', 'file'],
  ['findings', '发现明细', 'code'], ['migration', '迁移待办', 'list'],
];
const originLabel = computed(() => tabs.find(([value]) => value === props.origin?.tab)?.[1]);
const hasFilters = computed(() => ['assets', 'findings'].includes(props.tab) && Object.values(props.filters).some(Boolean));
const context = computed(() => {
  if (props.announcement) return props.announcement.replace(/^发现明细 · /, '');
  if (!hasFilters.value) return '';
  const f = props.filters;
  return [f.algorithm, f.sourceId && fileLabel(props.result.sources.find(s => s.source_id === f.sourceId) ||
    { file_name: f.sourceId }, props.result.sources), f.target, f.method && methodLabel(f.method), f.query]
    .filter(Boolean).join(' · ');
});
function tabKeys(event, index) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 :
    (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  emit('select-tab', tabs[next][0]);
  event.currentTarget.parentElement.children[next].focus();
}
</script>
<template>
  <div class="panel-heading">
    <div class="result-heading">
      <div>
        <h2>密码资产与迁移分析</h2>
        <p class="small muted">{{ formatTime(result.scanned_at) }} · 北京时间</p>
      </div>
      <ExportMenu :result="result" />
    </div>
    <div class="result-tabs" role="tablist" aria-label="分析视图">
      <button v-for="([value, label, icon], index) in tabs" :id="`tab-${value}`" :key="value"
        class="button" :class="{ active: tab === value }" role="tab" :aria-selected="tab === value"
        aria-controls="result-panel" :tabindex="tab === value ? 0 : -1"
        @click="$emit('select-tab', value)" @keydown="tabKeys($event, index)">
        <AppIcon :name="icon" :size="17" />{{ label }}
      </button>
    </div>
    <div v-if="origin || context" class="result-context">
      <button v-if="origin" class="button text-action compact return-button" @click="$emit('back')">
        <AppIcon name="back" :size="16" />返回{{ originLabel }}
      </button>
      <p class="small" role="status" aria-live="polite">{{ context }}</p>
      <button v-if="hasFilters" class="button text-action subtle compact clear-filters" title="清除筛选" @click="$emit('reset')">
        <AppIcon name="close" :size="14" /><span class="clear-label">清除筛选</span>
      </button>
    </div>
  </div>
</template>
<style scoped>
.result-heading { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
.result-context {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.result-context p { grid-column: 2; min-width: 0; overflow-wrap: anywhere; color: var(--text-secondary); }
.return-button { grid-column: 1; grid-row: 1; }
.clear-filters { grid-column: 3; grid-row: 1; }
.result-context .button { white-space: nowrap; }
@media (max-width: 600px) {
  .clear-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
}
</style>
