import { onMounted, reactive } from 'vue';
import { useRemoteTask } from './useRemoteTask.js';
import { loadScanConfig } from './useScanConfig.js';
import { validateDraft } from '../utils/files.js';
import { useTaskRunner } from './useTaskRunner.js';

import { uploadBody } from '../utils/pathUpload.js';

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
  function start(mode, draft, analysisMode = 'basic') {
    const state = states[mode];
    if (state.busy) return;
    state.restored = false;
    state.error = validateDraft(mode, draft);
    if (state.error) return;
    return runner.run(mode, state, async (signal) => {
      let body;
      if (mode === 'files') body = await uploadBody(draft.files, analysisMode);
      else if (mode === 'snippet') body = { filename: draft.filename, content: draft.content, analysis_mode: analysisMode };
      else body = { ...(mode === 'github' ? { repository_url: draft.value } : { package_name: draft.value }), analysis_mode: analysisMode };
      if (signal.aborted) throw new Error('提交已取消');
      const result = await remote[mode].execute(body, signal);
      if (mode === 'files') result.path_preserved = body.has('manifest');
      return result;
    });
  }
  function cancel(mode) {
    if (mode === 'files' && states[mode].busy && !states[mode].taskId) {
      runner.cancel(mode);
      states[mode].error = '上传准备或传输已取消；上次结果已保留';
      return;
    }
    return remote[mode]?.cancel();
  }
  return { states, start, cancel };
}
