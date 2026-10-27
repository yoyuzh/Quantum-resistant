import { onUnmounted, ref, watch } from 'vue';
import { notify, dismissNotice } from './useNotice.js';
import { request } from '../api/client.js';

export function useExport(result) {
  const exporting = ref(false);
  const error = ref('');
  const download = ref(null);
  let sequence = 0;
  let controller,noticeId;
  function clear() {
    sequence++;
    if (noticeId != null) dismissNotice(noticeId);
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
      const content = await request(result.value.task_id ? `/api/tasks/${result.value.task_id}/report/${format}${result.value.repository_id ? '?repository_id='+encodeURIComponent(result.value.repository_id) : ''}` : `/api/report/${format}`, {
        method: result.value.task_id ? 'GET' : 'POST',
        ...(!result.value.task_id ? { body: { ...result.value, sources: result.value.sources.map((source) => ({ ...source, content: '' })) } } : {}),
        text: true,
        signal: controller.signal,
      });
      if (id !== sequence) return;
      const mime = {
        html: 'text/html',
        markdown: 'text/markdown',
        json: 'application/json',
        csv: 'text/csv',
      }[format];
      const url = URL.createObjectURL(new Blob([content], { type: `${mime};charset=utf-8` }));
      const stamp = new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
        .format(new Date())
        .replace(/[^0-9]/g, '');
      const source = result.value.source_type || 'scan';
      const filename = `quantum-${source}-${stamp}.${extension}`;
      download.value = { url, filename };
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      noticeId=notify('报告已生成','success',{action:download.value});
    } catch (err) {
      if (id === sequence) { error.value = err.message; noticeId=notify(err.message,'error'); }
    } finally {
      if (id === sequence) exporting.value = false;
    }
  }
  return { exporting, error, download, exportReport };
}
