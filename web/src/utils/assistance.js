export const purposeLabels = {
  unknown: '用途待确认', configuration: '算法配置', key_generation: '密钥生成', key_import: '密钥导入',
  sign: '签名', verify: '验签', encrypt: '加密', decrypt: '解密', key_exchange: '密钥建立',
};
export const opinionLabels = { supports_static: '复核依据', questions_static: '存在冲突', new_candidate: 'AI分析依据', abstain: '信息不足' };
export const analysisLabels = { completed: '已完成', partial: '部分完成', failed: '未完成', cancelled: '已停止', skipped: '未运行' };
export function confirmedOperations(result) {
  return (result?.deep_analysis?.operations || []).filter(o => o.claims?.some(c => c.claim_type === 'ALGORITHM' && c.level === 'E3') && o.risk_category === 'quantum_vulnerable');
}
export function assistanceAction(result) {
  const ai = result?.ai_analysis;
  if (!ai || ai.status === 'skipped') return '补做 AI 分析';
  if (ai.execution?.remaining === 0 || ai.coverage?.remaining === 0) return '';
  if (ai.execution?.retryable === 0) return '';
  if (ai.coverage?.remaining > 0) return ai.status === 'partial' ? '继续 AI 分析' : '重试未完成项';
  return ai.status === 'completed' ? '' : '重试未完成项';
}
export function readAiPreference(storage) {
  try { return (storage ?? globalThis.localStorage)?.getItem('quantum-ai-assisted') !== 'false'; } catch { return true; }
}
export function saveAiPreference(value, storage) {
  try { (storage ?? globalThis.localStorage)?.setItem('quantum-ai-assisted', String(value)); } catch { /* Optional preference. */ }
}
export function migrationTasks(result) {
  const tasks = new Map();
  for (const operation of confirmedOperations(result)) {
    const algorithm = operation.algorithm?.value || operation.algorithm_family || '算法待确认';
    const purpose = operation.operation_type;
    const key = `${operation.template_id}:${algorithm}:${purpose}`;
    if (!tasks.has(key)) tasks.set(key, { key, algorithm, purpose, files: new Set(), operations: 0,
      direction: ['sign', 'verify'].includes(purpose) ? '评估 ML-DSA / SLH-DSA；核对签名格式、密钥存储和验证方兼容性。'
        : purpose === 'key_exchange' ? '评估 ML-KEM；核对协议、通信双方、共享密钥派生及回退策略。'
          : '先确认实际用途和协议约束，再选择迁移方案；不能直接替换任意密码 API。' });
    const task = tasks.get(key);
    task.operations++;
    for (const span of [operation.sink_location, ...operation.context.call_chain]) task.files.add(span.source_id);
  }
  return [...tasks.values()].map(t => ({ ...t, files: t.files.size }));
}
