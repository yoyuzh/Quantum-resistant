import { onUnmounted } from 'vue';
import { request } from '../api/client.js';
import { followTask } from '../utils/remoteTasks.js';
import { createRequestId } from '../utils/requestId.js';
import { ensureAiReady } from './useAiSettings.js';

export function useAiAnalysis(mode, state) {
  const key = `quantum-task-${mode}`;
  let controller, disposed = false;
  function saved(value) {
    try {
      if (value === undefined) return sessionStorage.getItem(key) || '';
      value ? sessionStorage.setItem(key, value) : sessionStorage.removeItem(key);
    } catch { return ''; }
  }
  async function start(resume = '') {
    if (state.aiBusy || state.busy) return;
    const selection=resume?{}:await ensureAiReady(true);
    if(!selection || selection.assisted===false)return;
    if (!resume && !state.result?.task_id) return;
    const current = new AbortController(); controller = current;
    state.aiBusy = true; state.aiError = ''; state.aiProgress = null;
    const active = () => !disposed && controller === current && !current.signal.aborted;
    try {
      const { result, status } = await followTask({ request, kind: 'ai', body: { source_task_id: state.result?.task_id,...Object.fromEntries(Object.entries(selection).filter(([key,value])=>key.startsWith('ai_profile_') && value)) },
        id: resume, requestId: createRequestId(), signal: current.signal, includeContent: false, readCheckpoints: false,
        onId: id => { if (active()) { state.aiTaskId = id; saved(id); } },
        onProgress: value => { if (active()) state.aiProgress = value; },
        onCheckpoint: value => { if (active()) state.checkpoint = value; },
      });
      if (active()) { state.result = { ...result, task_id: status.id }; state.aiError = status.error || ''; }
    } catch (e) {
      if (active()) { state.aiError = e.message; if (e.status === 404) saved(''); }
    } finally { if (controller === current) { state.aiBusy = false; state.aiTaskId = ''; } }
  }
  async function stop() {
    const id = state.aiTaskId || state.taskId;
    if (!id) return;
    try { await request(`/api/tasks/${id}/stop-ai`, { method: 'POST' }); }
    catch (e) { if (!disposed) state.aiError = e.message; }
  }
  function supersede() {
    const id = state.aiTaskId;
    controller?.abort(); controller = null; state.aiBusy = false; state.aiTaskId = ''; state.aiProgress = null; saved('');
    if (id) request(`/api/tasks/${id}/stop-ai`, { method: 'POST' }).catch(() => {});
  }
  state.assist = () => start(); state.stopAi = stop;
  onUnmounted(() => { disposed = true; controller?.abort(); });
  return { supersede };
}
