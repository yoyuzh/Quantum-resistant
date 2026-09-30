import { onMounted, reactive } from 'vue';
import { useRemoteTask } from './useRemoteTask.js';
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
  const remote = Object.fromEntries(
    ['github', 'pypi'].map((kind) => [kind, useRemoteTask(kind, states[kind])]),
  );
  onMounted(() => {
    for (const kind of ['github', 'pypi']) {
      const id = remote[kind].saved();
      if (id) runner.run(kind, states[kind], (signal) => remote[kind].execute(null, signal, id));
    }
  });
  function start(mode, draft) {
    const state = states[mode];
    if (state.busy) return;
    state.error = validateDraft(mode, draft);
    if (state.error) return;
    return runner.run(mode, state, (signal) =>
      remote[mode]
        ? remote[mode].execute(
            mode === 'github' ? { repository_url: draft.value } : { package_name: draft.value },
            signal,
          )
        : scan(mode, draft, signal),
    );
  }
  return { states, start, cancel: (mode) => remote[mode]?.cancel() };
}
