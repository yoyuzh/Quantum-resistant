import { onUnmounted, reactive } from 'vue';
import { request } from '../api/client.js';

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
  let controller;
  let timer;
  let sequence = 0;
  async function run(refresh = false) {
    if (state.busy || state.loading) return;
    const id = ++sequence;
    state.retryRefresh = refresh;
    controller = new AbortController();
    state.error = '';
    state.busy = refresh;
    state.loading = !refresh;
    state.elapsed = 0;
    const started = Date.now();
    timer = setInterval(() => {
      state.elapsed = Math.floor((Date.now() - started) / 1000);
    }, 1000);
    try {
      const result = await request(`/api/popular/${refresh ? 'scan' : 'results'}`, {
        method: refresh ? 'POST' : 'GET',
        body: refresh ? { top: state.top } : undefined,
        timeout: refresh ? 70000 : 15000,
        signal: controller.signal,
      });
      if (sequence === id) state.result = result;
    } catch (error) {
      if (sequence === id && !(error.status === 404 && !refresh)) state.error = error.message;
    } finally {
      clearInterval(timer);
      if (sequence === id) {
        state.busy = false;
        state.loading = false;
        state.loaded = true;
      }
    }
  }
  onUnmounted(() => {
    sequence++;
    controller?.abort();
    clearInterval(timer);
  });
  return { state, run };
}
