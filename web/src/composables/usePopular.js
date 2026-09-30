import { onMounted, reactive } from 'vue';
import { useRemoteTask } from './useRemoteTask.js';
import { request } from '../api/client.js';
import { useTaskRunner } from './useTaskRunner.js';

export function usePopular() {
  const state = reactive({
    result: null,
    busy: false,
    loading: false,
    error: '',
    elapsed: 0,
    top: 8,
    loaded: false,
    retryRefresh: false,
  });
  const runner = useTaskRunner();
  const remote = useRemoteTask('popular', state);
  async function readSnapshot(signal) {
    const snapshot = await request('/api/popular/results', { signal, timeout: 15000 });
    if (state.result?.meta?.incomplete) {
      state.previous = snapshot;
      return state.result;
    }
    state.taskNote = '';
    return snapshot;
  }
  onMounted(() => {
    const id = remote.saved();
    if (id) runner.run('popular', state, (signal) => remote.execute(null, signal, id));
  });
  function run(refresh = false) {
    if (state.busy || state.loading) return;
    state.retryRefresh = refresh;
    return runner.run(
      'popular',
      state,
      (signal) => (refresh ? remote.execute({ top: state.top }, signal) : readSnapshot(signal)),
      {
        minimum: refresh ? 1500 : 0,
        flag: refresh ? 'busy' : 'loading',
        errorMessage: (error) => (error.status === 404 && !refresh ? '' : error.message),
      },
    );
  }
  return { state, run, cancel: remote.cancel };
}
