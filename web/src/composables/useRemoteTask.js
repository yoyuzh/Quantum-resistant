import { onUnmounted } from 'vue';
import { request } from '../api/client.js';
import { followTask } from '../utils/remoteTasks.js';
import { uploadRequest } from '../api/upload.js';
import { createRequestId } from '../utils/requestId.js';
import { presentScanCompletion } from './useTaskRunner.js';

export function useRemoteTask(kind, state, storageKey = kind) {
  const key = `quantum-task-${storageKey}`;
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
  async function execute(body, signal, resumeId = '', endpointKind = kind) {
    const signature = body instanceof FormData
      ? JSON.stringify([...body.entries()].map(([name, file]) => [name, typeof file === 'string' ? file : file.name, file.size, file.lastModified]))
      : JSON.stringify(body);
    if (!resumeId && pendingSubmission?.signature !== signature)
      pendingSubmission = { signature, requestId: createRequestId() };
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
        kind: endpointKind,
        body,
        signal: submissionController.signal,
        id: resumeId,
        requestId: pendingSubmission?.requestId,
        includeContent: false,
        readCheckpoints: false,
        onCheckpoint: value => { if (!signal.aborted) state.checkpoint = value; },
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
          ? status.error || (status.cancel_requested ? '扫描已取消，已保留部分结果。' : '扫描部分完成。')
          : '';
      if (
        kind === 'popular' &&
        result.meta?.incomplete &&
        state.result &&
        !state.result.meta?.incomplete
      )
        state.previous = state.result;
      if (kind === 'popular') save('');
      result.task_id = status.id || state.taskId;
      await presentScanCompletion(state, status, result, signal);
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
      const progress = await request(`/api/tasks/${state.taskId}/${state.progress?.ai_running ? 'stop-ai' : 'cancel'}`, {
        method: 'POST',
        signal: cancelController.signal,
        timeout: 10000,
      });
      if (!disposed) state.progress = progress;
    } catch (error) {
      if (!disposed) state.connection = `取消状态未确认，请重试（${error.message}）`;
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
