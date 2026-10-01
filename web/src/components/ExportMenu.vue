<script setup>
import { computed, ref } from 'vue';
import { useExport } from '../composables/useExport.js';
import AppIcon from './AppIcon.vue';
const props = defineProps({ result: Object });
const menu = ref(null);
const { exporting, error, download, exportReport } = useExport(computed(() => props.result));
function save(format) {
  menu.value.open = false;
  exportReport(format);
}
</script>
<template>
  <div class="export-control">
    <details ref="menu" @keydown.esc="menu.open = false">
      <summary class="button secondary">
        <AppIcon name="download" :size="17" />{{ exporting ? '正在导出…' : '导出报告' }}
      </summary>
      <div class="export-options">
        <button class="button secondary" :disabled="exporting" @click="save('html')">
          HTML · 阅读 / 打印
        </button>
        <button class="button secondary" :disabled="exporting" @click="save('markdown')">
          Markdown · 编辑
        </button>
        <button class="button secondary" :disabled="exporting" @click="save('json')">
          JSON · 完整数据
        </button>
        <button class="button secondary" :disabled="exporting" @click="save('csv')">
          CSV · 发现表格
        </button>
      </div>
    </details>
    <p v-if="error" class="notice error" role="alert">{{ error }}</p>
    <p v-if="download" class="small muted" role="status">
      已生成，<a :href="download.url" :download="download.filename">再次下载</a>
    </p>
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
.export-options {
  position: absolute;
  z-index: 5;
  right: 0;
  display: grid;
  gap: 0.4rem;
  width: 220px;
  padding: 0.6rem;
  background: var(--bg-surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
}
.export-options p {
  padding: 0.2rem 0.5rem;
}
.export-control > p {
  margin-top: 0.4rem;
  max-width: 240px;
}
</style>
