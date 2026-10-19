<script setup>
import { computed, nextTick, onUnmounted, reactive, ref, watch } from 'vue';
import { request } from '../api/client.js';
import { useDeepAnalysis } from '../composables/useDeepAnalysis.js';
import { useSourceContent } from '../composables/useSourceContent.js';
import { abstractText, operationPage, operationLabels, riskLabels, resolutionLabels, sourceLimit, sourceTree } from '../utils/deepAnalysis.js';
import DeepSource from './DeepSource.vue';
import DeepFileTree from './DeepFileTree.vue';
import DeepEvidence from './DeepEvidence.vue';
import DeepProgress from './DeepProgress.vue';
import AppIcon from './AppIcon.vue';
const props = defineProps({ result: Object, mode: String });
const result = computed(() => props.result);
const { state, start, cancel } = useDeepAnalysis(result, props.mode);
const sourceResult = computed(() => ({ task_id: state.resultTaskId || props.result.task_id, sources: props.result.sources }));
const loadSource = useSourceContent(sourceResult);
const filters = reactive({ algorithm: '', resolution: '', risk: '', type: '', level: '', sourceId: '', query: '' });
const page = ref(1);
const selectedId = ref('');
const located = ref(null);
const unavailableSources = reactive(new Set());
const evidencePaths = computed(() => (state.result?.evidence_paths || []).map(path => ({ ...path,
  replay_status: path.nodes.some(node => unavailableSources.has(node.location.source_id)) ? 'unavailable' : path.replay_status,
})));
const sourcePane = ref(null);
const exportError = ref('');
const exporting = ref(false);
let exportSequence = 0;
let exportController;
function stopExport() { exportSequence++; exportController?.abort(); exporting.value = false; }
onUnmounted(stopExport);
watch(() => props.result.task_id, stopExport);
const operations = computed(() => state.result?.operations || []);
const pagination = computed(() => operationPage(operations.value, filters, page.value));
const selected = computed(() => pagination.value.items.find(op => op.operation_id === selectedId.value) || pagination.value.items[0]);
const sources = computed(() => state.result?.snapshot.sources || props.result.sources.map(source => ({ ...source, relative_path: source.relative_path || source.file_name })));
const algorithms = computed(() => [...new Set(operations.value.map(op => abstractText(op.algorithm)))]);
const templates = computed(() => operations.value.filter(op => op.context.kind === 'uninstantiated_template').length);
const limit = computed(() => unavailableSources.size ? '部分源码已过期或不可读取；保留历史证据，当前无法重放，请重新扫描来源。' : sourceLimit(props.result));
const callSpan = computed(() => located.value || selected.value?.call_site);
watch(filters, () => { page.value = 1; selectedId.value = ''; located.value = null; });
watch(() => selected.value?.operation_id, () => { located.value = null; });
watch(() => state.resultTaskId, () => unavailableSources.clear());
watch(() => state.result, () => { page.value = 1; selectedId.value = ''; exportError.value = ''; });
function label(span) {
  const source = sources.value.find(item => item.source_id === span?.source_id);
  return span ? `${source?.relative_path || span.source_id}:${span.start_line}` : '未实例化模板';
}
function select(op) { selectedId.value = op.operation_id; located.value = null; }
async function locate(span) {
  located.value = span;
  await nextTick();
  sourcePane.value?.focus();
}
function chooseFile(source) {
  filters.sourceId = source.source_id;
  nextTick(() => { located.value = { source_id: source.source_id, start_line: 1, start_col: 0, end_line: 1, end_col: 1 }; });
}
async function exportResult() {
  if (exporting.value) return;
  stopExport();
  const sequence = exportSequence;
  exportController = new AbortController();
  exportError.value = '';
  exporting.value = true;
  try {
    const data = await request(`/api/tasks/${encodeURIComponent(state.resultTaskId)}/deep-analysis/export`, { text: true, timeout: 60000, signal: exportController.signal });
    if (sequence !== exportSequence) return;
    const blob = new Blob([data], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'deep-analysis.json';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) { if (sequence === exportSequence) exportError.value = error.message; }
  finally { if (sequence === exportSequence) exporting.value = false; }
}
</script>
<template>
  <section class="deep-workspace" aria-label="Python 深度分析源码对照台">
    <div class="deep-intro"><p>{{ limit }}</p><span>Python · 本地静态 · 无需模型</span></div>
    <div class="deep-grid">
      <aside class="source-tree" aria-label="相对路径文件列表">
        <h3>源码对照台</h3>
        <p class="small muted">{{ sources.length }} 个来源文件</p>
        <button class="button file-choice" :class="{ active: !filters.sourceId }" @click="filters.sourceId = ''"><AppIcon name="file" :size="17" />全部文件</button>
        <DeepFileTree :nodes="sourceTree(sources)" :selected="callSpan?.source_id" @select="chooseFile" />
        <p v-if="state.result" class="tree-footer small muted">路径：{{ state.result.snapshot.path_fidelity }}<br />仓库 commit：{{ state.result.snapshot.commit || '未知' }}</p>
      </aside>
      <section class="context-panel" aria-label="操作上下文与源码">
        <div class="toolbar context-heading"><h3>操作上下文</h3><span class="small muted">{{ pagination.total }} / {{ operations.length }} 个匹配 · 未实例化模板 {{ templates }}</span></div>
        <details class="deep-filters"><summary>筛选操作</summary>
          <div class="filter-grid">
            <label>算法<select v-model="filters.algorithm"><option value="">全部算法</option><option v-for="algorithm in algorithms" :key="algorithm">{{ algorithm }}</option></select></label>
            <label>解析状态<select v-model="filters.resolution"><option value="">全部状态</option><option v-for="(label, value) in resolutionLabels" :key="value" :value="value">{{ label }}</option></select></label>
            <label>风险类别<select v-model="filters.risk"><option value="">全部风险</option><option v-for="(label, value) in riskLabels" :key="value" :value="value">{{ label }}</option></select></label>
            <label>操作类型<select v-model="filters.type"><option value="">全部类型</option><option v-for="(label, value) in operationLabels" :key="value" :value="value">{{ label }}</option></select></label>
            <label>任一结论等级<select v-model="filters.level"><option value="">全部等级</option><option v-for="level in ['E0', 'E1', 'E2', 'E3']" :key="level">{{ level }}</option></select></label>
            <label>搜索<input v-model="filters.query" placeholder="API、条件或未知原因" /></label>
          </div>
          <button class="button text-action compact" @click="Object.keys(filters).forEach(key => filters[key] = '')">清除全部筛选</button>
        </details>
        <div v-if="pagination.items.length" class="operation-cards" aria-label="独立操作上下文">
          <button v-for="op in pagination.items" :key="op.operation_id" class="operation-card"
            :class="{ active: selected?.operation_id === op.operation_id }" :aria-pressed="selected?.operation_id === op.operation_id" @click="select(op)">
            <span class="context-dot"><AppIcon name="code" :size="19" /></span>
            <span><strong>{{ abstractText(op.algorithm) }} · {{ op.algorithm_family || '未知家族' }} · {{ operationLabels[op.operation_type] }}</strong>
              <span class="context-meta">{{ riskLabels[op.risk_category] }} · {{ resolutionLabels[op.resolution_status] }}</span>
              <span class="context-location">{{ label(op.call_site) }} → {{ label(op.sink_location) }}</span>
              <span v-if="op.context.kind === 'uninstantiated_template'" class="small template-label">未实例化模板 · 不计为实际调用</span>
            </span>
          </button>
        </div>
        <p v-else class="deep-empty">{{ state.result ? '当前筛选范围没有操作。可清除筛选，或查看预算与诊断。' : '先完成基础扫描，再显式启动深度分析。每个调用上下文将单独展示。' }}</p>
        <div v-if="pagination.pages > 1" class="toolbar small">
          <button class="button secondary compact" :disabled="pagination.current <= 1" @click="page = pagination.current - 1">上一页</button>
          <span>{{ pagination.current }} / {{ pagination.pages }} · 每页 8 个上下文</span>
          <button class="button secondary compact" :disabled="pagination.current >= pagination.pages" @click="page = pagination.current + 1">下一页</button>
        </div>
        <DeepSource v-if="selected || located" ref="sourcePane" :span="callSpan" :sources="sources" :load-source="loadSource" @unavailable="unavailableSources.add($event)" :title="located ? '证据定位' : '调用点'" />
        <DeepSource v-if="selected" :span="selected.sink_location" :sources="sources" :load-source="loadSource" @unavailable="unavailableSources.add($event)" title="底层调用" />
      </section>
      <DeepEvidence :operation="selected" :paths="evidencePaths" :sources="sources" @locate="locate" @return-source="located = null" />
    </div>
    <p v-if="exportError" class="notice error" role="alert">{{ exportError }}</p>
    <p v-if="exporting" role="status" class="small muted">正在读取服务端保存的独立报告…</p>
    <DeepProgress :state="state" @start="start" @cancel="cancel" @export="exportResult" />
  </section>
</template>
<style scoped>
.deep-workspace { display: flex; flex-direction: column; gap: .65rem; min-height: 0; }
.deep-intro { display: flex; justify-content: space-between; flex-wrap: wrap; gap: .4rem; padding: .6rem 1rem; font-size: .75rem; color: var(--text-secondary); }
.deep-intro span { color: var(--accent-dim); white-space: nowrap; }
.deep-grid { display: grid; grid-template-columns: minmax(150px, .7fr) minmax(0, 2fr) minmax(270px, 1.15fr); gap: .65rem; align-items: start; }
.source-tree, .context-panel { min-width: 0; padding: 1rem; background: var(--bg-surface); border-radius: var(--radius); }
.source-tree { display: flex; flex-direction: column; gap: .6rem; align-self: stretch; }
h3 { font-size: 1rem; }
.file-choice { justify-content: flex-start; align-items: flex-start; text-align: left; background: transparent; color: var(--text-secondary); font-size: .78rem; }
.file-choice svg { flex-shrink: 0; margin-top: .15rem; }
.file-choice span { min-width: 0; overflow-wrap: anywhere; }
.file-choice.active { color: var(--accent-dim); background: var(--accent-soft); }
.tree-footer { margin-top: auto; padding-top: 2rem; overflow-wrap: anywhere; }
.context-panel { display: flex; flex-direction: column; gap: .75rem; }
.context-panel > * { flex-shrink: 0; }
.context-heading { justify-content: space-between; }
.deep-filters { border-bottom: 1px solid var(--border); padding-bottom: .3rem; }
.filter-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .65rem; padding-bottom: .5rem; }
.operation-cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .6rem; }
.operation-card { display: flex; gap: .65rem; padding: .8rem; text-align: left; border: 1px solid var(--border); background: var(--bg-input); color: var(--text-primary); border-radius: var(--radius); cursor: pointer; min-width: 0; }
.operation-card.active { border-color: var(--accent-dim); background: var(--accent-soft); }
.context-dot { color: var(--accent-dim); padding-top: .15rem; }
.operation-card > span:last-child { min-width: 0; overflow-wrap: anywhere; }
.operation-card strong { font-size: .8rem; }
.context-meta, .context-location { display: block; font-size: .73rem; margin-top: .3rem; color: var(--text-secondary); }
.operation-card .small { display: block; font-size: .68rem; margin-top: .3rem; color: var(--accent-dim); }
.operation-card .template-label { color: var(--text-secondary); }
.deep-empty { padding: 2rem 1rem; color: var(--text-secondary); font-size: .85rem; }
@media (min-width: 1100px) { .source-tree, .context-panel, .deep-grid > :last-child { max-height: 66vh; overflow-y: auto; scrollbar-gutter: stable; } }
@media (max-width: 1099px) { .deep-grid { grid-template-columns: minmax(140px, .6fr) minmax(0, 2fr); } .deep-grid > :last-child { grid-column: 1 / -1; } }
@media (max-width: 600px) {
  .deep-grid { grid-template-columns: minmax(0, 1fr); }
  .source-tree { max-height: 220px; overflow-y: auto; }
  .source-tree, .context-panel { padding: .8rem; }
  .tree-footer { margin-top: 0; padding-top: .3rem; }
  .operation-cards, .filter-grid { grid-template-columns: minmax(0, 1fr); }
}
</style>
