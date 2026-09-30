import { onUnmounted } from 'vue';
import { request } from '../api/client.js';
import { followTask } from '../utils/remoteTasks.js';

export function useRemoteTask(kind, state) {
  const key = `quantum-task-${kind}`;
  let cancelController;
  let disposed = false;
  let pendingSubmission = null;
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
    const signature = JSON.stringify(body);
    if (!resumeId && pendingSubmission?.signature !== signature)
      pendingSubmission = { signature, requestId: crypto.randomUUID() };
    state.progress = null;
    state.connection = '';
    state.taskNote = '';
    state.taskId = resumeId;
    try {
      const { result, status } = await followTask({
        request,
        kind,
        body,
        signal,
        id: resumeId,
        requestId: pendingSubmission?.requestId,
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
      return result;
    } catch (error) {
      if (!signal.aborted) save('');
      throw error;
    } finally {
      if (!signal.aborted) {
        state.taskId = '';
        state.connection = '';
      }
    }
  }
  async function cancel() {
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
