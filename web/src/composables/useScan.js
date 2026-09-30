import { onMounted, reactive } from 'vue';
import { useRemoteTask } from './useRemoteTask.js';
import { loadScanConfig } from './useScanConfig.js';
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
    ['snippet', 'files', 'github', 'pypi'].map((kind) => [kind, useRemoteTask(kind, states[kind])]),
  );
  onMounted(() => {
    loadScanConfig().catch(() => {});
    for (const kind of ['snippet', 'files', 'github', 'pypi']) {
      const id = remote[kind].saved();
      if (id) {
        states[kind].restored = true;
        runner.run(kind, states[kind], (signal) => remote[kind].execute(null, signal, id));
      }
    }
  });
  function start(mode, draft) {
    const state = states[mode];
    if (state.busy) return;
    state.restored = false;
    state.error = validateDraft(mode, draft);
    if (state.error) return;
    let body;
    if (mode === 'files') {
      body = new FormData();
      draft.files.forEach((file) => body.append('files', file));
    } else if (mode === 'snippet') body = { filename: draft.filename, content: draft.content };
    else body = mode === 'github' ? { repository_url: draft.value } : { package_name: draft.value };
    return runner.run(mode, state, (signal) => remote[mode].execute(body, signal));
  }
  return { states, start, cancel: (mode) => remote[mode]?.cancel() };
}
