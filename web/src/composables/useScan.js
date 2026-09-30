import { reactive } from 'vue';
import { scan } from '../api/client.js';
import { validateDraft } from '../utils/files.js';
import { useTaskRunner } from './useTaskRunner.js';

export function useScan() {
  const states = reactive(
    Object.fromEntries(
      ['snippet', 'files', 'github', 'pypi'].map((mode) => [
        mode,
        { result: null, busy: false, error: '', elapsed: 0 },
      ]),
    ),
  );
  const runner = useTaskRunner();
  function start(mode, draft) {
    const state = states[mode];
    if (state.busy) return;
    state.error = validateDraft(mode, draft);
    if (state.error) return;
    return runner.run(mode, state, (signal) => scan(mode, draft, signal));
  }
  return { states, start };
}
