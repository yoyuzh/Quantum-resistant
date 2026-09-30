import { onUnmounted, ref, watch } from 'vue';
import { request } from '../api/client.js';

export function useExport(result) {
  const exporting = ref(false);
  const error = ref('');
  const download = ref(null);
  let sequence = 0;
  let controller;
  function clear() {
    sequence++;
    controller?.abort();
    if (download.value) URL.revokeObjectURL(download.value.url);
    download.value = null;
    error.value = '';
    exporting.value = false;
  }
  watch(result, clear);
  onUnmounted(clear);
  async function exportReport(format) {
    if (exporting.value) return;
    clear();
    const id = sequence;
    controller = new AbortController();
    exporting.value = true;
    const extension = format === 'markdown' ? 'md' : format;
    try {
      const content = await request(`/api/report/${format}`, {
        method: 'POST',
        body: result.value,
        text: true,
        signal: controller.signal,
      });
      if (id !== sequence) return;
      const mime = { markdown: 'text/markdown', json: 'application/json', csv: 'text/csv' }[format];
      const url = URL.createObjectURL(new Blob([content], { type: `${mime};charset=utf-8` }));
      const filename = `quantum-scan-report.${extension}`;
      download.value = { url, filename };
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch (err) {
      if (id === sequence) error.value = err.message;
    } finally {
      if (id === sequence) exporting.value = false;
    }
  }
  return { exporting, error, download, exportReport };
}
