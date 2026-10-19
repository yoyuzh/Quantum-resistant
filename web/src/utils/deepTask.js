import { followTask } from './remoteTasks.js';
import { createRequestId } from './requestId.js';

// No I/O until start/restore is explicitly called. Source identity gates every callback.
export function createDeepTask({ request, storage, key, changed = () => {} }) {
  let generation = 0;
  let controller;
  let pending;
  const state = { sourceTaskId: '', taskId: '', resultTaskId: '', result: null, busy: false, progress: null, error: '', connection: '', cancelling: false };
  const publish = patch => { Object.assign(state, patch); changed({ ...state }); };
  const save = value => { try { value ? storage?.setItem(key, JSON.stringify(value)) : storage?.removeItem(key); } catch { /* Storage optional. */ } };
  function saved() {
    try {
      const value = JSON.parse(storage?.getItem(key) || 'null');
      return value && typeof value.sourceTaskId === 'string' && typeof value.taskId === 'string' ? value : null;
    } catch { return null; }
  }
  function bind(sourceTaskId, result = null) {
    generation++;
    controller?.abort();
    pending = null;
    publish({ sourceTaskId, taskId: result ? sourceTaskId : '', resultTaskId: result ? sourceTaskId : '', result, busy: false, progress: null, error: '', connection: '', cancelling: false });
  }
  async function run(id = '') {
    if (state.busy || !state.sourceTaskId) return;
    const token = ++generation;
    const sourceTaskId = state.sourceTaskId;
    controller = new AbortController();
    const signal = controller.signal;
    const active = () => generation === token && !signal.aborted;
    if (!id) pending ||= createRequestId();
    publish({ busy: true, error: '', connection: '', progress: null });
    try {
      const { result, status } = await followTask({ request, kind: 'deep-analysis', body: { source_task_id: sourceTaskId },
        id, requestId: pending, signal, includeContent: false,
        onId: taskId => { if (active()) { pending = null; publish({ taskId }); save({ sourceTaskId, taskId }); } },
        onProgress: progress => { if (active()) publish({ progress }); },
        onConnection: connection => { if (active()) publish({ connection }); },
      });
      if (!active()) return;
      const taskId = status.id || id || state.taskId;
      publish({ taskId, ...(result.deep_analysis ? { result: result.deep_analysis, resultTaskId: taskId } : {}),
        error: !result.deep_analysis ? (status.error || '深度分析未保存完整证据；基础结果已保留。') : '' });
      save({ sourceTaskId, taskId });
    } catch (error) {
      if (active()) {
        publish({ error: error.status === 404 ? '来源或任务已过期，请重新扫描；基础结果已保留。' : error.message });
        if (error.status === 404) save(null);
      }
    } finally { if (active()) publish({ busy: false, connection: '' }); }
  }
  function restore() {
    const value = saved();
    if (value?.sourceTaskId !== state.sourceTaskId) return;
    publish({ taskId: value.taskId });
    return run(value.taskId);
  }
  async function cancel() {
    if (!state.busy || !state.taskId || state.cancelling) return;
    const token = generation;
    publish({ cancelling: true });
    try {
      const progress = await request(`/api/tasks/${encodeURIComponent(state.taskId)}/cancel`, { method: 'POST', signal: controller.signal });
      if (token === generation) publish({ progress });
    } catch (error) { if (token === generation) publish({ error: `取消未确认：${error.message}，可重试。` }); }
    finally { if (token === generation) publish({ cancelling: false }); }
  }
  return { state, bind, start: () => run(), restore, cancel, dispose: () => { generation++; controller?.abort(); } };
}
