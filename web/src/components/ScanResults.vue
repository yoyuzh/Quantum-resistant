<script setup>
import { onUnmounted, ref, watch } from 'vue';
import { request } from '../api/client.js';
import { formatTime } from '../utils/results.js';
import CoverageNotice from './CoverageNotice.vue';
import ScanSummary from './ScanSummary.vue';
import FindingsList from './FindingsList.vue';
import KnowledgePanel from './KnowledgePanel.vue';
const props = defineProps({ result: Object });
const exporting = ref(false);
const exportError = ref('');
const downloadUrl = ref('');
function clearDownload() {
  if (downloadUrl.value) URL.revokeObjectURL(downloadUrl.value);
  downloadUrl.value = '';
}
watch(() => props.result, clearDownload);
onUnmounted(clearDownload);
async function exportReport() {
  if (exporting.value) return;
  exporting.value = true;
  exportError.value = '';
  try {
    const content = await request('/api/report/markdown', {
      method: 'POST',
      body: props.result,
      text: true,
    });
    clearDownload();
    const url = URL.createObjectURL(new Blob([content], { type: 'text/markdown;charset=utf-8' }));
    downloadUrl.value = url;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'quantum-scan-report.md';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  } catch (error) {
    exportError.value = error.message;
  } finally {
    exporting.value = false;
  }
}
</script>

<template>
  <div class="stack">
    <p class="sr-only" role="status">扫描完成，共 {{ result.summary.finding_count }} 项发现。</p>
    <div class="result-heading">
      <div>
        <h2>扫描结果</h2>
        <p class="small muted">{{ formatTime(result.scanned_at) }} · 北京时间</p>
      </div>
      <button class="button secondary" :disabled="exporting" @click="exportReport">
        {{ exporting ? '正在导出…' : '导出 Markdown' }}
      </button>
    </div>
    <p v-if="exportError" class="notice error" role="alert">{{ exportError }}</p>
    <p v-if="downloadUrl" class="notice" role="status">
      报告已生成。如未自动下载，可
      <a :href="downloadUrl" download="quantum-scan-report.md">保存 Markdown 报告</a>。
    </p>
    <ScanSummary :summary="result.summary" />
    <CoverageNotice :coverage="result.coverage" :diagnostics="result.diagnostics" />
    <FindingsList :findings="result.findings" :sources="result.sources" />
    <KnowledgePanel />
  </div>
</template>

<style scoped>
.result-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
}
</style>
