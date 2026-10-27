import { onMounted, reactive } from 'vue';
import { useRemoteTask } from './useRemoteTask.js';
import { loadScanConfig } from './useScanConfig.js';
import { validateDraft } from '../utils/files.js';
import { useTaskRunner } from './useTaskRunner.js';
import { useAiAnalysis } from './useAiAnalysis.js';
import { ensureAiReady, loadAiSettings } from './useAiSettings.js';
import { fileUpload } from '../utils/pathUpload.js';
import { describeInput } from '../utils/workspace.js';

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
  const assistance = Object.fromEntries(['snippet', 'files', 'github', 'pypi'].map(kind => [kind, useAiAnalysis(kind, states[kind])]));
  onMounted(() => {
    loadAiSettings().catch(() => {});
    loadScanConfig().catch(() => {});
    for (const kind of ['snippet', 'files', 'github', 'pypi']) {
      const id = remote[kind].saved();
      if (id) {
        states[kind].restored = true;
        runner.run(kind, states[kind], (signal) => remote[kind].execute(null, signal, id)).finally(() => {
          if (!states[kind].result) states[kind].restored = false;
        });
      }
    }
  });
  const starting=new Set();
  async function start(mode, draft) {
    const state = states[mode];
    if (state.busy || starting.has(mode)) return;
    state.restored = false;
    state.error = validateDraft(mode, draft);
    if (state.error) return;
    starting.add(mode);
    const snapshot={...draft,...(draft.files?{files:[...draft.files]}:{})};
    try {
    const selection=await ensureAiReady();
    if(!selection)return;
    draft=snapshot;
    state.error=validateDraft(mode,draft);if(state.error)return;
    assistance[mode].supersede();
    state.submittedSource = describeInput(mode, draft);
    const assisted = selection.assisted;
    return await runner.run(mode, state, async signal => {
      let body, endpoint = mode;
      if (mode === 'files') ({ body, kind: endpoint } = await fileUpload(draft.files, assisted));
      else if (mode === 'snippet') body = { filename: draft.filename, content: draft.content, ai_assisted: assisted };
      else body = mode === 'github' ? { repository_url: draft.value, ai_assisted: assisted } : { package_name: draft.value, ai_assisted: assisted };
      const binding=Object.fromEntries(Object.entries(selection).filter(([key,value])=>key.startsWith('ai_profile_') && value));
      if(body instanceof FormData)for(const [key,value] of Object.entries(binding))body.append(key,value);
      else Object.assign(body,binding);
      if (signal.aborted) return;
      return remote[mode].execute(body, signal, '', endpoint);
    }, { errorMessage: e => state.result ? `本次扫描未完成，当前显示上次结果：${e.message}` : e.message });
    } finally {starting.delete(mode);}
  }
  return { states, start, cancel: (mode) => remote[mode]?.cancel() };
}
