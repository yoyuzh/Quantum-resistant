import { request as defaultRequest } from '../api/client.js';
import { followTask } from './remoteTasks.js';
import { createRequestId } from './requestId.js';

export const opinionLabels = {
  supports_static: '支持原发现', questions_static: '质疑原发现',
  new_candidate: '新候选', abstain: '无法判定',
};
export const originLabels = { static: '静态复核', independent: '独立检索', pem_diagnostic: 'PEM 待复核' };
export const skipLabels = { unsupported: '不支持独立语义检索', source_missing: '源码缺失',
  search_file_limit: '检索文件预算', search_byte_limit: '检索字节预算', parse_failed: '解析失败',
  candidate_limit: '候选预算', preview_file_limit: '预览文件预算', line_too_large: '核心行过长', context_byte_limit: '上下文字节预算' };
export const citationLabels = { valid: '引用有效', invalid: '引用无效', absent: '无引用' };
export const displayUnknown = (value) => value === 'unknown' ? '未知' : value;
// 展示用复核优先级；不能把算法标签或模型意见当作确认风险。
export function opinionPriority(item, candidate) {
  if (item.citation_status !== 'valid' || item.opinion_kind === 'abstain')
    return { level: 'unknown', label: '待确认', rank: 2 };
  if (item.opinion_kind === 'questions_static')
    return { level: 'medium', label: '中优先级', rank: 1 };
  const algorithm = item.algorithm || '';
  const importOnly = candidate?.rules?.length > 0
    && candidate.rules.every((rule) => rule === 'python_crypto_import');
  if (importOnly) return { level: 'info', label: '信息', rank: 3 };
  const pqc = /\b(?:ML[-_ ]?KEM|ML[-_ ]?DSA|SLH[-_ ]?DSA|Kyber|Dilithium|SPHINCS|Falcon)\b/gi;
  const classical = algorithm.replace(pqc, '');
  if (/\b(?:RSA|ECDSA|ECDH|ECC|DSA|DH|Ed25519|Ed448|X25519|X448|MD5|SHA[-_ ]?1|DES|3DES|RC4)\b/i.test(classical))
    return { level: 'high', label: '高优先级', rank: 0 };
  if (classical !== algorithm) return { level: 'info', label: '信息', rank: 3 };
  if (!algorithm || algorithm === 'unknown')
    return { level: 'unknown', label: '待确认', rank: 2 };
  return { level: 'medium', label: '中优先级', rank: 1 };
}

export function prioritizeOpinions(opinions, candidates = []) {
  const byId = new Map(candidates.map((item) => [item.candidate_id, item]));
  return [...opinions].sort((a, b) => opinionPriority(a, byId.get(a.candidate_id)).rank
    - opinionPriority(b, byId.get(b.candidate_id)).rank);
}

export function filterOpinions(opinions, kind = '', citation = '') {
  return opinions.filter((item) => (!kind || item.opinion_kind === kind)
    && (!citation || item.citation_status === citation));
}

export function createAiAnalysis(state, {
  request = defaultRequest, follow = followTask, storage,
  storageKey = 'quantum-ai-task', makeId = createRequestId,
} = {}) {
  if (storage === undefined) {
    try { storage = globalThis.sessionStorage; } catch { storage = null; }
  }
  let controller = new AbortController();
  let generation = 0;
  let disposed = false;
  let submission = null;
  const records = new Map();
  const active = (version) => !disposed && version === generation;
  function save(id) {
    try { id ? storage?.setItem(storageKey, id) : storage?.removeItem(storageKey); } catch { /* 可禁用存储。 */ }
  }
  function setSource(sourceId) {
    if (state.sourceId === sourceId) return;
    records.set(state.sourceId, { result: state.result, taskId: state.taskId, resultTaskId: state.resultTaskId });
    controller.abort();
    controller = new AbortController();
    generation += 1;
    submission = null;
    Object.assign(state, { sourceId, preview: null, error: '', connection: '', busy: false,
      taskId: '', resultTaskId: '', progress: null, phase: '', result: null, ...records.get(sourceId) });
  }
  async function loadConfig() {
    const version = generation;
    try {
      const config = await request('/api/ai/config', { signal: controller.signal });
      if (active(version)) state.config = config;
    } catch (error) { if (active(version)) state.error = error.message; }
  }
  async function preview() {
    if (!state.sourceId || state.busy) return;
    const version = generation;
    state.busy = true;
    state.phase = 'preview';
    state.progress = null;
    state.connection = '';
    state.error = '';
    state.preview = null;
    submission = null;
    try {
      const value = await request('/api/ai/previews', { method: 'POST',
        body: { source_task_id: state.sourceId }, signal: controller.signal, timeout: 45000 });
      if (active(version)) state.preview = value;
    } catch (error) { if (active(version)) state.error = error.message; }
    finally { if (active(version)) state.busy = false; }
  }
  async function execute(id = '', { preserveSaved = false } = {}) {
    if (state.busy) return;
    const selected = state.preview;
    if (!id && !selected) return;
    if (!id && Date.parse(selected.expires_at) <= Date.now()) {
      state.preview = null;
      state.error = '预览已过期，请重新生成';
      return;
    }
    if (!id && submission?.previewId !== selected.preview_id)
      submission = { previewId: selected.preview_id, requestId: makeId() };
    const version = generation;
    state.busy = true;
    state.phase = 'analysis';
    state.progress = null;
    state.connection = '';
    state.taskId = id;
    state.error = '';
    try {
      const { result, status } = await follow({ request, kind: 'ai', id, signal: controller.signal,
        requestId: submission?.requestId, includeContent: false,
        body: id ? undefined : { preview_id: selected.preview_id, digest: selected.digest, consent: true },
        onId: (identity) => { if (active(version)) { state.taskId = identity; save(identity); } },
        onProgress: (value) => { if (active(version)) state.progress = value; },
        onConnection: (value) => { if (active(version)) state.connection = value; },
      });
      if (!active(version)) return;
      if (state.sourceId && result.source_task_id !== state.sourceId)
        throw new Error('此 AI 任务属于其他来源，请重新分析当前扫描');
      if (state.result?.source_task_id && state.result.source_task_id !== result.source_task_id) {
        state.result = null;
        state.resultTaskId = '';
      }
      state.sourceId = result.source_task_id;
      state.taskId = status.id || state.taskId || id;
      state.progress = status;
      // 无完整意见的失败不覆盖上次有效结果；诊断仍显示在错误中。
      if (status.state === 'failed' || status.state === 'cancelled') {
        state.error = result.diagnostics?.map((item) => item.message).join('；') || status.error || 'AI 分析未完成';
      } else {
        state.result = result;
        state.resultTaskId = state.taskId;
        try { storage?.setItem(`${storageKey}-result`, state.taskId); } catch { /* 只保存任务 ID。 */ }
      }
      state.preview = null;
      if (!preserveSaved) save(state.taskId);
    } catch (error) {
      if (active(version)) {
        state.error = error.status === 404 ? 'AI 任务或预览已过期，请重新生成分析预览' : error.message;
        if ([404, 409].includes(error.status)) {
          state.preview = null;
          if (!preserveSaved) save('');
        }
      }
    } finally { if (active(version)) { state.busy = false; state.connection = ''; } }
  }
  async function restore() {
    let id, previousId;
    try {
      id = storage?.getItem(storageKey);
      previousId = storage?.getItem(`${storageKey}-result`);
    } catch { return; }
    const version = generation;
    const boundSource = state.sourceId;
    if (previousId && previousId !== id) {
      state.taskId = previousId;
      await execute(previousId, { preserveSaved: true });
    }
    if (!active(version)) return;
    if (id) {
      state.sourceId = boundSource;
      state.taskId = id;
      await execute(id);
      if (active(version) && !state.sourceId && state.result?.source_task_id)
        state.sourceId = state.result.source_task_id;
    }
  }
  async function cancel() {
    if (!state.taskId || !state.busy) return;
    const version = generation;
    try {
      const value = await request(`/api/tasks/${state.taskId}/cancel`, { method: 'POST', signal: controller.signal });
      if (active(version)) state.progress = value;
    } catch (error) { if (active(version)) state.error = error.message; }
  }
  return { setSource, loadConfig, preview, submit: () => execute(), restore, cancel,
    dispose() { disposed = true; generation += 1; controller.abort(); } };
}
