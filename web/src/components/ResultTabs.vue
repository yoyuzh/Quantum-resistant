<script setup>
import AppIcon from './AppIcon.vue';
import { resultViews } from '../utils/resultViews.js';
defineProps({ tab: String });
const emit = defineEmits(['select']);
function tabKeys(event, index) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? resultViews.length - 1 :
    (index + (event.key === 'ArrowRight' ? 1 : -1) + resultViews.length) % resultViews.length;
  emit('select', resultViews[next][0]);
  event.currentTarget.parentElement.children[next].focus();
}
</script>
<template>
  <div class="view-tabs" role="tablist" aria-label="分析视图">
    <button v-for="([value, label, icon], index) in resultViews" :id="`tab-${value}`" :key="value"
      class="button" role="tab" :aria-selected="tab === value" aria-controls="result-panel"
      :tabindex="tab === value ? 0 : -1" @click="$emit('select', value)" @keydown="tabKeys($event, index)">
      <AppIcon :name="icon" :size="16" />{{ label }}
    </button>
  </div>
</template>
<style scoped>
.view-tabs { display: flex; justify-content: center; flex-wrap: wrap; gap: 2px 8px;
  width: fit-content; max-width: 100%; margin: 0 auto; }
.button { position: relative; min-height: 32px; padding: 4px 10px; border-radius: 4px 4px 0 0;
  background: transparent; color: var(--text-secondary); font-size: 13px; white-space: nowrap; }
.button[aria-selected='true'] { color: var(--accent-dim); font-weight: 600; }
.button[aria-selected='true']::after { content: ''; position: absolute; height: 2px;
  inset: auto 10px 0; background: var(--accent); border-radius: 2px; }
.button:hover { color: var(--accent-dim); background: var(--accent-soft); }
@media (max-width: 600px) {
  .view-tabs { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); width: 100%; gap: 0; }
  .button { grid-column: span 2; padding-inline: 4px; }
  .button:nth-child(4) { grid-column: 2 / span 2; }
  .button:nth-child(5) { grid-column: 4 / span 2; }
}
@media (max-width: 600px), (pointer: coarse) {
  .button { min-height: 44px; }
}
@media (forced-colors: active) {
  .button[aria-selected='true'] { border-bottom: 2px solid Highlight; }
}
</style>
