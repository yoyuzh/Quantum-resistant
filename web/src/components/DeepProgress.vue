<script setup>
import { computed } from 'vue';
import { coverageText, deepStatus } from '../utils/deepAnalysis.js';
const props = defineProps({ state: Object });
defineEmits(['start', 'cancel', 'export']);
const progress = computed(() => props.state.progress || {});
const result = computed(() => props.state.result);
const coverage = computed(() => result.value?.coverage || progress.value.deep_coverage);
const budgets = computed(() => result.value?.budgets || progress.value.deep_budgets);
const status = computed(() => props.state.busy ? progress.value.state || 'queued' : result.value?.status);
const stages = [['collected', '采集'], ['available', '可用 Python'], ['selected', '已选'], ['parsed', '已解析'], ['analyzed', '已分析']];
</script>
<template>
  <section class="deep-progress" aria-label="深度分析范围与任务状态">
    <div class="toolbar" role="status" aria-live="polite">
      <strong>{{ deepStatus[status] || '尚未启动' }}</strong>
      <span class="small muted">{{ progress.stage || '本地静态 · 无需模型' }}</span>
      <span v-if="state.busy" class="small">{{ progress.elapsed ?? 0 }} 秒</span>
    </div>
    <div v-if="coverage" class="coverage-strip">
      <span v-for="[key, label] in stages" :key="key">{{ label }} <strong>{{ coverageText(coverage[key]) }}</strong></span>
    </div>
    <p v-if="state.connection" class="notice small" role="status">{{ state.connection }}</p>
    <p v-if="state.error" class="notice error" role="alert">{{ state.error }}</p>
    <p v-if="status === 'partial' || status === 'cancelled' || status === 'failed'" class="notice small">已保留基础结果和完成的证据路径。未完成范围不代表没有风险。</p>
    <div class="toolbar deep-actions">
    <details v-if="budgets || coverage?.gaps?.length || result?.diagnostics?.length">
      <summary>预算、截断与诊断</summary>
      <p v-if="budgets" class="small muted">文件上限 {{ budgets.python_files }} · 源码 {{ budgets.source_bytes }} 字节 · 有效预算 {{ budgets.effective_seconds }} 秒 · 排队 {{ budgets.queue_seconds.toFixed(2) }} 秒 · 等待计算 {{ budgets.cpu_wait_seconds.toFixed(2) }} 秒 · 分析 {{ budgets.analysis_seconds.toFixed(2) }} 秒</p>
      <p v-if="budgets" class="small muted">已用节点 {{ budgets.used_nodes }} / {{ budgets.index_nodes }} · 边 {{ budgets.used_edges }} / {{ budgets.index_edges }} · 结构 {{ budgets.used_structure_bytes }} / {{ budgets.structure_bytes }} 字节</p>
      <p v-for="gap in coverage?.gaps" :key="gap" class="small">{{ gap }}</p>
      <p v-for="(item, index) in result?.diagnostics" :key="index" class="small">{{ item.message }} <span class="muted">{{ item.code }}</span></p>
    </details>
      <span class="small muted">基础结果独立保留 · 源码仅按需读取</span>
      <button v-if="state.busy" class="button secondary" :disabled="state.cancelling || !state.taskId" @click="$emit('cancel')">{{ state.cancelling ? '正在取消…' : '取消深度分析' }}</button>
      <button v-else class="button primary" :disabled="!state.sourceTaskId" @click="$emit('start')">{{ result ? '重新分析' : '开始深度分析' }}</button>
      <button class="button secondary" :disabled="state.busy || !result || !state.taskId" @click="$emit('export')">导出深度 JSON</button>
    </div>
  </section>
</template>
<style scoped>
.deep-progress { padding: .9rem 1rem; background: var(--bg-surface); border-radius: var(--radius); display: grid; gap: .65rem; }
.coverage-strip { display: flex; gap: .5rem 1rem; flex-wrap: wrap; font-size: .75rem; color: var(--text-secondary); }
.coverage-strip strong { color: var(--text-primary); font-weight: 500; }
.deep-actions > span { margin-right: auto; }
@media (max-width: 600px) { .deep-actions .button { flex: 1; } .deep-actions > span { flex-basis: 100%; } }
</style>
