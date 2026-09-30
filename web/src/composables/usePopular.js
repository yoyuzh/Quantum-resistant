import { reactive } from 'vue';
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
  function run(refresh = false) {
    if (state.busy || state.loading) return;
    state.retryRefresh = refresh;
    return runner.run(
      'popular',
      state,
      (signal) =>
        request(`/api/popular/${refresh ? 'scan' : 'results'}`, {
          method: refresh ? 'POST' : 'GET',
          body: refresh ? { top: state.top } : undefined,
          timeout: refresh ? 70000 : 15000,
          signal,
        }),
      {
        minimum: refresh ? 1500 : 0,
        flag: refresh ? 'busy' : 'loading',
        errorMessage: (error) => (error.status === 404 && !refresh ? '' : error.message),
      },
    );
  }
  return { state, run };
}
