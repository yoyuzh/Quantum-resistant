<script setup>
import { computed, ref, watch } from 'vue';
import { request } from '../api/client.js';
import { skipLabels } from '../utils/aiAnalysis.js';
import { useAiAnalysis } from '../composables/useAiAnalysis.js';
import AiOpinionList from './AiOpinionList.vue';
import AiPreview from './AiPreview.vue';
const props = defineProps({ sourceTaskId: String, mode: String, active: Boolean });
const { state, loadConfig, preview, submit, cancel } = useAiAnalysis(computed(() => props.sourceTaskId), props.mode);
const evidence = ref(null);
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
      <p>AI 意见需人工复核，引用有效只说明片段匹配，不改变静态风险数与迁移评分。</p>
      <p v-if="state.config">{{ state.config.reason }} · {{ state.config.target_origin || '未设置目标' }} {{ state.config.model }}</p>
      <p v-if="!state.sourceId && !state.busy" class="muted">请先完成普通扫描，保留源码后再生成 AI 预览。</p>
      <p v-if="state.sourceId" class="muted">来源任务：{{ state.sourceId }}</p>
      <p v-if="state.error" role="alert">{{ state.error }}{{ state.result ? '；上次有效 AI 结果已保留。' : '' }}</p>
      <p v-if="state.connection" role="status">{{ state.connection }}</p>
      <p v-if="state.busy" role="status">{{ state.progress?.stage || '本地准备 / 等待任务' }}
        · 已完成 {{ state.progress?.ai_progress?.completed ?? 0 }} / {{ state.progress?.ai_progress?.planned ?? '未知' }} 个候选</p>
      <div class="actions">
        <button type="button" class="button subtle" :disabled="state.busy || !state.sourceId || !state.config?.valid" @click="preview">生成本地脱敏预览</button>
        <button v-if="state.busy && state.taskId" type="button" class="button subtle" @click="cancel">取消后续分析</button>
        <button v-if="state.result" type="button" class="button subtle" @click="exportResult">导出 AI JSON</button>
      </div>
      <AiPreview v-if="state.preview" :preview="state.preview" :busy="state.busy" @submit="submit" />
      <div v-if="state.result" class="stack">
        <p>{{ state.result.created_at }} · {{ state.result.provider }} · {{ state.result.model }}</p>
        <p>候选检索：{{ state.result.candidate_coverage.searched_files }} / {{ state.result.candidate_coverage.source_files }} 文件；
          AI 完成：{{ state.result.ai_coverage.completed }} / {{ state.result.ai_coverage.planned }} 候选；
          调用 {{ state.result.ai_coverage.calls }} 次。{{ state.result.ai_coverage.partial ? '分析未完整结束。' : '' }}</p>
        <p>规则 {{ state.result.rule_version }} · 提示 {{ state.result.prompt_version }} · 核验 {{ state.result.validation_version }}；
          token 用量 {{ state.result.usage.total_tokens ?? '未知' }}</p>
        <ul v-if="state.result.diagnostics.length"><li v-for="(item, index) in state.result.diagnostics" :key="index">{{ item.message }}</li></ul>
        <p v-if="state.result.candidate_coverage.source_partial" class="notice">来源扫描不完整，仅保留本次可用部分。</p>
        <ul v-if="Object.keys(state.result.candidate_coverage.skip_reasons).length"><li v-for="(count, reason) in state.result.candidate_coverage.skip_reasons" :key="reason">{{ skipLabels[reason] || '其他未分析范围' }}：{{ count }}</li></ul>
        <AiOpinionList :result="state.result" @reveal="reveal" />
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
h3 { margin: 0 0 1rem; font-size: 1rem; }
.ai-body { font-size: 0.82rem; }
.actions { display: flex; flex-wrap: wrap; gap: 0.6rem; }
p { overflow-wrap: anywhere; line-height: 1.7; }
pre { max-height: 24rem; overflow: auto; font: 0.78rem/1.7 var(--font-mono); }
button { white-space: normal; height: auto; min-height: 40px; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
</style>
