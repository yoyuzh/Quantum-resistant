<script setup>
import { computed, ref } from 'vue';
import { useExport } from '../composables/useExport.js';
import AppIcon from './AppIcon.vue';
const props = defineProps({ result: Object });
const menu = ref(null);
const { exporting, exportReport } = useExport(computed(() => props.result));
function close() {
  menu.value.open = false;
  menu.value.querySelector('summary')?.focus({ preventScroll: true });
}
function save(format) {
  close();
  exportReport(format);
}
</script>
<template>
  <div class="export-control">
    <details ref="menu" @keydown.esc.prevent="close">
      <summary class="button text-action">
        <AppIcon name="download" :size="17" />{{ exporting ? '正在导出…' : '导出报告' }}
      </summary>
      <div class="export-options">
        <button class="button export-option" :disabled="exporting" @click="save('html')">
          HTML · 阅读 / 打印
        </button>
        <button class="button export-option" :disabled="exporting" @click="save('markdown')">
          Markdown · 编辑
        </button>
        <button class="button export-option" :disabled="exporting" @click="save('json')">
          JSON · 完整数据
        </button>
        <button class="button export-option" :disabled="exporting" @click="save('csv')">
          CSV · 发现表格
        </button>
      </div>
    </details>
  </div>
</template>
<style scoped>
.export-control {
  position: relative;
  max-width: 100%;
}
summary {
  list-style: none;
}
summary::-webkit-details-marker {
  display: none;
}
summary::before { display: none; }
.export-options {
  position: absolute;
  z-index: 5;
  right: 0;
  display: grid;
  gap: 0.1rem;
  width: 220px;
  padding: 0.6rem;
  border: 1px solid var(--border);
  background: var(--bg-surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
}
.export-option {
  width: 100%;
  justify-content: flex-start;
  background: transparent;
  color: var(--text-primary);
}
.export-option:hover:not(:disabled) { background: var(--control-hover); }
.export-option:active:not(:disabled) { background: var(--control-pressed); }
.export-options p {
  padding: 0.2rem 0.5rem;
}
.export-control > p {
  margin-top: 0.4rem;
  max-width: 240px;
}
</style>
