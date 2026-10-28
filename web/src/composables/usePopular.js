import { onMounted, reactive } from 'vue';
import { useRemoteTask } from './useRemoteTask.js';
import { ensureAiReady } from './useAiSettings.js';
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
  onMounted(async () => {
    const id=remote.saved();
    if (!id) return;
    try {
      const status=await request('/api/tasks/'+id);
      if (!['succeeded','partial','failed','cancelled'].includes(status.state))
        runner.run('popular',state,signal=>remote.execute(null,signal,id));
      else sessionStorage.removeItem('quantum-task-popular');
    } catch { sessionStorage.removeItem('quantum-task-popular'); }
  });
  let starting=false;
  async function run(refresh = false) {
    if (state.busy || state.loading || starting) return;
    if (!refresh) { state.loaded=true; return; }
    starting=true;
    try {
    const selection=await ensureAiReady();if(!selection)return;
    state.result=null;
    state.previous=null;
    state.submittedSource='热门密码学仓库 · '+state.top+' 个';
    state.retryRefresh = refresh;
    return await runner.run(
      'popular',
      state,
      (signal) => remote.execute({ top:state.top, ai_assisted:selection.assisted,...Object.fromEntries(Object.entries(selection).filter(([key,value])=>key.startsWith('ai_profile_') && value)) }, signal),
      {
        minimum: refresh ? 1500 : 0,
        flag: refresh ? 'busy' : 'loading',
        errorMessage: (error) => (error.status === 404 && !refresh ? '' : error.message),
      },
    );
    } finally {starting=false;}
  }
  return { state, run, cancel: remote.cancel };
}
