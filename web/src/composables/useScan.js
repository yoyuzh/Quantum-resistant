import { onUnmounted, reactive } from 'vue';
import { scan } from '../api/client.js';
import { validateDraft } from '../utils/files.js';

export function useScan() {
  const states = reactive(
    Object.fromEntries(
      ['snippet', 'files', 'github', 'pypi'].map((mode) => [
        mode,
        { result: null, busy: false, error: '', elapsed: 0 },
      ]),
    ),
  );
  const jobs = new Map();
  let sequence = 0;

  async function start(mode, draft) {
    const state = states[mode];
    if (state.busy) return;
    state.error = validateDraft(mode, draft);
    if (state.error) return;
    const id = ++sequence;
    const controller = new AbortController();
    const started = Date.now();
    state.busy = true;
    state.elapsed = 0;
    const timer = setInterval(() => {
      state.elapsed = Math.floor((Date.now() - started) / 1000);
    }, 1000);
    jobs.set(mode, { id, controller, timer });
    try {
      const result = await scan(mode, draft, controller.signal);
      if (jobs.get(mode)?.id === id) state.result = result;
    } catch (error) {
      if (jobs.get(mode)?.id === id) state.error = error.message;
    } finally {
      clearInterval(timer);
      if (jobs.get(mode)?.id === id) {
        state.busy = false;
        jobs.delete(mode);
      }
    }
  }

  onUnmounted(() => {
    jobs.forEach(({ controller, timer }) => {
      controller.abort();
      clearInterval(timer);
    });
    jobs.clear();
  });
  return { states, start };
}
