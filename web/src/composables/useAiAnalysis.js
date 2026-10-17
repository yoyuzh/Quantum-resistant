import { onMounted, onUnmounted, reactive, watch } from 'vue';
import { createAiAnalysis } from '../utils/aiAnalysis.js';

export function useAiAnalysis(sourceId, mode) {
  const state = reactive({ sourceId: sourceId.value || '', config: null, preview: null,
    result: null, taskId: '', resultTaskId: '', progress: null, busy: false, error: '', connection: '' });
  const actions = createAiAnalysis(state, { storageKey: `quantum-ai-task-${mode}` });
  watch(sourceId, (value) => actions.setSource(value || ''));
  onMounted(actions.restore);
  onUnmounted(actions.dispose);
  return { state, ...actions };
}
