import test from 'node:test';
import assert from 'node:assert/strict';
import { createAiAnalysis, filterOpinions, displayUnknown, opinionLabels } from '../src/utils/aiAnalysis.js';

const preview = { preview_id: 'preview-one', digest: 'a'.repeat(64), expires_at: '2099-01-01T00:00:00+08:00' };
const initial = () => ({ sourceId: 'source-one', busy: false, preview: null, result: null, taskId: '', resultTaskId: '', error: '' });
function memory() {
  const values = new Map();
  return { values, getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
}

test('预览与配置不提交模型；显式提交后才跟踪任务', async () => {
  const calls = [];
  const state = initial();
  const storage = memory();
  const actions = createAiAnalysis(state, { storage, request: async (path) => { calls.push(path); return path.endsWith('previews') ? preview : { valid: true }; },
    follow: async (args) => { calls.push('submit'); assert.equal(args.body.consent, true); args.onId('ai-task');
      return { result: { source_task_id: 'source-one' }, status: { id: 'ai-task', state: 'succeeded' } }; } });
  await actions.loadConfig();
  await actions.preview();
  assert.deepEqual(calls, ['/api/ai/config', '/api/ai/previews']);
  await actions.submit();
  assert.equal(calls.at(-1), 'submit');
  assert.equal(state.result.source_task_id, 'source-one');
  assert.deepEqual([...storage.values.values()], ['ai-task', 'ai-task']);
  actions.dispose();
});

test('提交失败保留预览与请求标识，重试复用，失败保留上次结果', async () => {
  const state = { ...initial(), preview, result: { previous: true }, resultTaskId: 'previous-task' };
  const ids = [];
  const actions = createAiAnalysis(state, { storage: memory(), makeId: () => 'same-request',
    follow: async (args) => { ids.push(args.requestId); throw new Error('network'); } });
  await actions.submit();
  await actions.submit();
  assert.deepEqual(ids, ['same-request', 'same-request']);
  assert.deepEqual(state.result, { previous: true });
  assert.equal(state.resultTaskId, 'previous-task');
  actions.dispose();
});

test('切换来源丢弃迟到响应；切回恢复所属结果', async () => {
  let resolve;
  const state = { ...initial(), preview, result: { previous: true } };
  const actions = createAiAnalysis(state, { storage: memory(), follow: () => new Promise((done) => { resolve = done; }) });
  const pending = actions.submit();
  actions.setSource('source-two');
  resolve({ result: { source_task_id: 'source-one' }, status: { state: 'succeeded' } });
  await pending;
  assert.equal(state.sourceId, 'source-two');
  assert.equal(state.result, null);
  assert.equal(state.busy, false);
  actions.setSource('source-one');
  assert.deepEqual(state.result, { previous: true });
  actions.dispose();
});

test('过期预览拒绝发送，服务器404清理任务标识，刷新从ID恢复', async () => {
  let calls = 0;
  const state = { ...initial(), preview: { ...preview, expires_at: '2000-01-01' } };
  const storage = memory();
  const actions = createAiAnalysis(state, { storage, follow: async () => { calls += 1; throw Object.assign(new Error('expired'), { status: 404 }); } });
  await actions.submit();
  assert.equal(calls, 0);
  assert.equal(state.preview, null);
  storage.setItem('quantum-ai-task', 'expired-task');
  await actions.restore();
  assert.equal(calls, 1);
  assert.match(state.error, /已过期，请重新生成分析预览/);
  assert.equal(storage.getItem('quantum-ai-task'), undefined);
  actions.dispose();
});

test('恢复与取消使用同一任务，失败结果不覆盖上次有效意见', async () => {
  const state = { ...initial(), sourceId: '', result: { previous: true }, resultTaskId: 'old' };
  const storage = memory();
  storage.setItem('quantum-ai-task', 'restored');
  let release;
  const requests = [];
  const actions = createAiAnalysis(state, { storage, request: async (path) => { requests.push(path); return {}; },
    follow: (args) => { assert.equal(args.id, 'restored'); return new Promise((done) => { release = done; }); } });
  const pending = actions.restore();
  await actions.cancel();
  assert.deepEqual(requests, ['/api/tasks/restored/cancel']);
  release({ result: { source_task_id: 'source-one', diagnostics: [{ message: '失败原因' }] }, status: { state: 'failed', id: 'restored' } });
  await pending;
  assert.equal(state.resultTaskId, 'old');
  assert.deepEqual(state.result, { previous: true });
  assert.match(state.error, /失败原因/);
  actions.dispose();
});

test('意见筛选覆盖四类、引用与未知显示，不混合静态风险', () => {
  const opinions = Object.keys(opinionLabels).map((kind, index) => ({ opinion_kind: kind, citation_status: index ? 'invalid' : 'valid' }));
  assert.equal(filterOpinions(opinions).length, 4);
  assert.equal(filterOpinions(opinions, 'new_candidate').length, 1);
  assert.equal(filterOpinions(opinions, '', 'valid').length, 1);
  assert.equal(displayUnknown('unknown'), '未知');
  assert.equal(displayUnknown('RSA'), 'RSA');
});

test('刷新先恢复上次有效任务，最新失败任务保留相同来源的意见与导出ID', async () => {
  const state = { ...initial(), sourceId: '' };
  const storage = memory();
  storage.setItem('quantum-ai-task', 'failed-task');
  storage.setItem('quantum-ai-task-result', 'valid-task');
  const calls = [];
  const actions = createAiAnalysis(state, { storage, follow: async ({ id }) => {
    calls.push(id);
    return { result: { source_task_id: 'source-one', diagnostics: [{ message: '模型失败' }] },
      status: { id, state: id === 'valid-task' ? 'succeeded' : 'failed' } };
  } });
  await actions.restore();
  assert.deepEqual(calls, ['valid-task', 'failed-task']);
  assert.equal(state.result.source_task_id, 'source-one');
  assert.equal(state.resultTaskId, 'valid-task');
  assert.match(state.error, /模型失败/);
  assert.ok([...storage.values.values()].every((value) => value.endsWith('-task')));
  actions.dispose();
});
test('新预览和重新提交清除旧进度；新任务标识到达前不能取消旧任务', async () => {
  const oldProgress = { ai_progress: { completed: 4, planned: 4 } };
  const state = { ...initial(), taskId: 'old-task', progress: oldProgress, connection: '旧连接状态' };
  let releasePreview, releaseTask, taskArgs;
  const requests = [];
  const actions = createAiAnalysis(state, { storage: memory(),
    request: (path) => { requests.push(path); return new Promise(resolve => { releasePreview = resolve; }); },
    follow: args => { taskArgs = args; return new Promise(resolve => { releaseTask = resolve; }); },
  });
  const preparing = actions.preview();
  assert.equal(state.phase, 'preview');
  assert.equal(state.busy, true);
  assert.equal(state.progress, null);
  assert.equal(state.connection, '');
  releasePreview(preview);
  await preparing;
  state.progress = oldProgress;
  const analyzing = actions.submit();
  assert.equal(state.phase, 'analysis');
  assert.equal(state.progress, null);
  assert.equal(state.taskId, '');
  await actions.cancel();
  assert.deepEqual(requests, ['/api/ai/previews']);
  taskArgs.onId('new-task');
  taskArgs.onProgress({ ai_progress: { completed: 1, planned: 4 } });
  assert.equal(state.progress.ai_progress.completed, 1);
  releaseTask({ result: { source_task_id: 'source-one' }, status: { id: 'new-task', state: 'succeeded' } });
  await analyzing;
  assert.equal(state.busy, false);
  assert.equal(state.resultTaskId, 'new-task');
  actions.dispose();
});
