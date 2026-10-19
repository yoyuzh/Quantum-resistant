import { reactive, watch, onUnmounted } from 'vue';
import { request } from '../api/client.js';
import { createDeepTask } from '../utils/deepTask.js';

export function useDeepAnalysis(result, mode) {
  const state = reactive({});
  let storage;
  try { storage = globalThis.sessionStorage; } catch { /* Optional. */ }
  const task = createDeepTask({ request, storage, key: `quantum-deep-${mode}`, changed: value => Object.assign(state, value) });
  watch(result, value => {
    task.bind(value?.task_id || '', value?.deep_analysis || null);
    if (!value?.deep_analysis) task.restore();
  }, { immediate: true });
  onUnmounted(task.dispose);
  return { state, start: task.start, cancel: task.cancel };
}
