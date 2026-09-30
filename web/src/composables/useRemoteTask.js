import { onUnmounted } from 'vue';
import { request } from '../api/client.js';
import { followTask } from '../utils/remoteTasks.js';
import { uploadRequest } from '../api/upload.js';

export function useRemoteTask(kind, state) {
  const key = `quantum-task-${kind}`;
  let cancelController;
  let disposed = false;
  let pendingSubmission = null;
  let submissionController;
  function saved() {
    try {
      return sessionStorage.getItem(key) || '';
    } catch {
      return '';
    }
  }
  function save(id) {
    try {
      id ? sessionStorage.setItem(key, id) : sessionStorage.removeItem(key);
    } catch {
      /* Session storage may be disabled. */
    }
  }
  async function execute(body, signal, resumeId = '') {
    const signature = body instanceof FormData
      ? JSON.stringify([...body.entries()].map(([name, file]) => [name, file.name, file.size, file.lastModified]))
      : JSON.stringify(body);
    if (!resumeId && pendingSubmission?.signature !== signature)
      pendingSubmission = { signature, requestId: crypto.randomUUID() };
    state.progress = null;
    state.connection = '';
    state.taskNote = '';
    state.taskId = resumeId;
    submissionController = new AbortController();
    const stop = () => submissionController.abort();
    signal.addEventListener('abort', stop, { once: true });
    try {
      const { result, status } = await followTask({
        request: (path, args) => args?.body instanceof FormData
          ? uploadRequest(path, { ...args, signal: submissionController.signal, timeout: 600000,
              onProgress: (progress) => { if (!signal.aborted) state.progress = progress; } })
          : request(path, args),
        kind,
        body,
        signal: submissionController.signal,
        id: resumeId,
        requestId: pendingSubmission?.requestId,
        includeContent: false,
        onId: (id) => {
          pendingSubmission = null;
          state.taskId = id;
          save(id);
        },
        onProgress: (progress) => {
          if (!signal.aborted) state.progress = progress;
        },
        onConnection: (value) => {
          if (!signal.aborted) state.connection = value;
        },
      });
      if (
        kind === 'popular'
          ? !Array.isArray(result?.repos)
          : !Array.isArray(result?.findings) || !result?.summary
      )
        throw new Error('任务结果格式不完整，请重新扫描');
      state.taskNote =
        status.state === 'partial'
          ? '本次为部分结果，仅包含完整分析的文件；请结合采集范围和诊断查看。'
          : '';
      if (
        kind === 'popular' &&
        result.meta?.incomplete &&
        state.result &&
        !state.result.meta?.incomplete
      )
        state.previous = state.result;
      save('');
      result.task_id = status.id || state.taskId;
      return result;
    } catch (error) {
      if (!signal.aborted) save('');
      throw error;
    } finally {
      signal.removeEventListener('abort', stop);
      if (!signal.aborted) {
        state.taskId = '';
        state.connection = '';
      }
    }
  }
  async function cancel() {
    if (!state.taskId && kind === 'files') {
      submissionController?.abort();
      return;
    }
    if (!state.taskId || state.cancelling) return;
    state.cancelling = true;
    cancelController = new AbortController();
    try {
      const progress = await request(`/api/tasks/${state.taskId}/cancel`, {
        method: 'POST',
        signal: cancelController.signal,
        timeout: 10000,
      });
      if (!disposed) state.progress = progress;
    } catch (error) {
      if (!disposed) state.connection = `取消请求未确认：${error.message}。可再次点击取消。`;
    } finally {
      if (!disposed) state.cancelling = false;
    }
  }
  onUnmounted(() => {
    disposed = true;
    cancelController?.abort();
  });
  return { execute, saved, cancel };
}
