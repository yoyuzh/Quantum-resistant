<script setup>
import { computed, ref, watch } from 'vue';
import { request } from '../api/client.js';
import { skipLabels } from '../utils/aiAnalysis.js';
import { useAiAnalysis } from '../composables/useAiAnalysis.js';
import AiOpinionList from './AiOpinionList.vue';
import ScanLoading from './ScanLoading.vue';
const props = defineProps({ sourceTaskId: String, mode: String, active: Boolean });
const { state, loadConfig, preview, submit, cancel } = useAiAnalysis(computed(() => props.sourceTaskId), props.mode);
const evidence = ref(null);
const loadingProgress = computed(() => {
  const preparing = state.phase === 'preview';
  return {
    ...state.progress,
    kind: 'ai',
    ai_phase: state.phase,
    stage: preparing ? '正在生成本地脱敏预览' : state.progress?.stage || '正在提交 / 等待 AI 分析',
  };
});
watch(() => props.active, (value) => { if (value && !state.config) loadConfig(); }, { immediate: true });
let evidenceGeneration = 0;
watch(() => state.sourceId, () => { evidenceGeneration++; evidence.value = null; });
async function reveal(reference) {
  const version = ++evidenceGeneration;
  evidence.value = { ...reference, content: '', note: '正在读取源码…' };
  const sourceId = state.sourceId;
  try {
    const data = await request(`/api/tasks/${encodeURIComponent(sourceId)}/sources/${encodeURIComponent(reference.source_id)}`);
    if (version !== evidenceGeneration || sourceId !== state.sourceId) return;
    const lines = data.content.split(/\r?\n/);
    evidence.value = { ...reference, note: '来源完整源码（仅本地展示）',
      content: lines.slice(Math.max(0, reference.start_line - 4), reference.end_line + 3)
        .map((text, index) => `${Math.max(1, reference.start_line - 3) + index}  ${text}`).join('\n') };
  } catch {
    if (version === evidenceGeneration && sourceId === state.sourceId)
      evidence.value = { ...reference, content: reference.quote, note: '完整源码已过期或不可用，显示保存的脱敏引用' };
  }
}
async function startAnalysis() {
  if (state.busy || !state.sourceId || !state.config?.valid) return;
  await preview();
  if (state.preview) await submit();
}
async function exportResult() {
  try {
    const data = await request(`/api/ai/tasks/${encodeURIComponent(state.resultTaskId)}/export`);
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ai-analysis.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) { state.error = error.message; }
}
</script>
<template>
  <section class="ai-panel" aria-label="AI 分析">
    <h3>AI 分析 <span class="muted">· 独立复核意见</span></h3>
    <div class="stack ai-body">
      <p v-if="state.error" role="alert">{{ state.error }}{{ state.result ? '；上次有效 AI 结果已保留。' : '' }}</p>
      <p v-if="state.connection" role="status">{{ state.connection }}</p>
      <Transition name="ai-start-exit">
        <div v-if="!state.busy" class="ai-actions">
          <button
            type="button"
            class="button primary ai-start-button"
            :disabled="!state.sourceId || !state.config?.valid"
            @click="startAnalysis"
          >
            开始分析
          </button>
        </div>
      </Transition>
      <Transition name="content" mode="out-in">
        <ScanLoading v-if="state.busy" :key="state.phase" mode="ai" compact :progress="loadingProgress" />
        <div v-else key="ready" class="stack">
          <div v-if="state.result" class="stack">
            <p>{{ state.result.created_at }} · {{ state.result.provider }} · {{ state.result.model }}</p>
            <p>候选检索：{{ state.result.candidate_coverage.searched_files }} / {{ state.result.candidate_coverage.source_files }} 文件；
              发现 {{ state.result.candidate_coverage.discovered_candidates }} 个位置，聚合后 {{ state.result.candidate_coverage.aggregated_candidates ?? state.result.candidates.length }} 个候选；
              AI 完成 {{ state.result.ai_coverage.completed }} / {{ state.result.ai_coverage.planned }}；
              请求 {{ state.result.ai_coverage.calls }} 次，重试 {{ state.result.ai_coverage.retries ?? 0 }} 次。
              <span v-if="state.result.ai_coverage.partial">未完成 {{ state.result.ai_coverage.unfinished ?? 0 }} 个：{{ state.result.ai_coverage.stop_reason || '范围不完整' }}。</span></p>
            <p>规则 {{ state.result.rule_version }} · 提示 {{ state.result.prompt_version }} · 核验 {{ state.result.validation_version }}；
              token 用量 {{ state.result.usage.total_tokens ?? '未知' }}</p>
            <ul v-if="state.result.diagnostics.length"><li v-for="(item, index) in state.result.diagnostics" :key="index">{{ item.message }}</li></ul>
            <p v-if="state.result.candidate_coverage.source_partial" class="notice">来源扫描不完整，仅保留本次可用部分。</p>
            <ul v-if="Object.keys(state.result.candidate_coverage.skip_reasons).length"><li v-for="(count, reason) in state.result.candidate_coverage.skip_reasons" :key="reason">{{ skipLabels[reason] || '其他未分析范围' }}：{{ count }}</li></ul>
            <AiOpinionList :result="state.result" @reveal="reveal" />
          </div>
        </div>
      </Transition>
      <div v-if="(state.busy && state.phase === 'analysis' && state.taskId) || state.result" class="actions ai-secondary-actions">
        <button
          v-if="state.busy && state.phase === 'analysis' && state.taskId"
          type="button"
          class="button primary ai-cancel-button"
          @click="cancel"
        >
          取消后续分析
        </button>
        <button v-if="state.result" type="button" class="button subtle" @click="exportResult">导出 AI JSON</button>
      </div>
      <section v-if="evidence" class="stack" aria-label="AI 引用源码定位">
        <h4>{{ evidence.file_name }} · 第 {{ evidence.start_line }} 行</h4>
        <p>{{ evidence.note }}</p><pre tabindex="0">{{ evidence.content }}</pre>
      </section>
    </div>
  </section>
</template>
<style scoped>
.ai-panel { min-width: 0; }
.content-leave-active { transition: opacity 150ms ease; }
.content-leave-to { opacity: 0; }
h3 { margin: 0 0 1rem; font-size: 1rem; }
.ai-body { font-size: 0.82rem; }
.actions { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.ai-actions {
  display: grid;
  place-items: center;
  min-height: 12rem;
}
.ai-secondary-actions {
  align-items: center;
  justify-content: center;
  min-height: 0;
  margin-top: 0.85rem;
}
.ai-cancel-button { min-height: 40px; }
.ai-start-button {
  width: 9rem;
  height: 9rem;
  padding: 1rem;
  border-radius: 50%;
  box-shadow: 0 0 0 0.6rem var(--accent-soft), var(--shadow-card);
  font-size: 1rem;
  font-weight: 700;
  transition: transform 180ms ease, box-shadow 180ms ease;
}
.ai-start-exit-leave-active {
  overflow: hidden;
  max-height: 14rem;
  transition: opacity 260ms ease, transform 260ms cubic-bezier(.4, 0, .2, 1), max-height 260ms ease, min-height 260ms ease;
}
.ai-start-exit-leave-to {
  opacity: 0;
  min-height: 0;
  max-height: 0;
  transform: scale(.96) translateY(-8px);
}
.ai-start-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 0 0 0.8rem var(--accent-soft), var(--shadow-lg);
}
.ai-start-button:active:not(:disabled) { transform: translateY(0); }
p { overflow-wrap: anywhere; line-height: 1.7; }
pre { max-height: 24rem; overflow: auto; font: 0.78rem/1.7 var(--font-mono); }
button { white-space: normal; height: auto; min-height: 40px; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
</style>
