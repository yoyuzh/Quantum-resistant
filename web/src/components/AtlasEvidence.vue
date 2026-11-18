<script setup>
import { computed, provide, ref, watch } from 'vue';
import { formatTime } from '../utils/results.js';
import { request } from '../api/client.js';
import { useSourceContent } from '../composables/useSourceContent.js';
import { label, originName, purposeName } from '../utils/repositoryAtlas.js';
import { selectedFindings } from '../utils/analysis.js';
import FindingsList from './FindingsList.vue';
import EvidenceGraph from './EvidenceGraph.vue';

const props = defineProps({ row: Object, algorithm: String, status: String, taskId: String });
const detail = ref(null);
const message = ref('');
const groups = computed(() => props.row.groups.filter(g => g.algorithm === props.algorithm && g.status === props.status));
watch(() => [props.row.repo, props.taskId], async ([repo, taskId], _, cleanup) => {
  detail.value = null;
  if (!taskId || !repo.repository_id) {
    message.value = repo.scanned_at ? '资料库保存分组计数和代表位置。' : '详细证据不可用或已过期，可核对摘要中的位置。';
    return;
  }
  const controller = new AbortController();
  cleanup(() => controller.abort());
  message.value = '正在读取仓库详情…';
  try {
    const value = await request('/api/tasks/' + encodeURIComponent(taskId) + '/repositories/' + encodeURIComponent(repo.repository_id), { signal: controller.signal });
    if (controller.signal.aborted) return;
    detail.value = value;
    message.value = '';
  } catch (error) {
    if (!controller.signal.aborted) message.value = error.status === 404 ? '详细证据已过期，已保留摘要位置。' : error.message;
  }
}, { immediate: true });
const view = computed(() => {
  if (!detail.value) return null;
  const full = detail.value;
  const merged = props.status === 'legacy' ? null : full.integrated_analysis;
  const matches = item => item.algorithm === props.algorithm && (props.status === 'legacy' || (item.verification_status || 'confirmed') === props.status);
  const findings = selectedFindings({ findings: merged?.findings || full.findings }, {
    algorithm: props.algorithm, status: props.status === 'legacy' ? '' : props.status,
  });
  const ids = new Set(findings.map(f => f.finding_id).filter(Boolean));
  const assets = (merged?.analysis?.assets || full.analysis?.assets || []).filter(matches);
  const operationIds = new Set(findings.flatMap(f => f.operation_ids || []));
  const operations = (full.deep_analysis?.operations || []).filter(op => operationIds.has(op.operation_id));
  const evidenceIds = new Set(operations.flatMap(op => op.evidence_ids || []));
  const paths = (full.deep_analysis?.evidence_paths || []).filter(p => evidenceIds.has(p.evidence_id));
  return { task_id: full.task_id, sources: full.sources, findings, assets,
    deep_analysis: { operations, evidence_paths: paths },
    integrated_analysis: { findings, calls: (merged?.calls || []).filter(c => ids.has(c.finding_id)) } };
});
const loadSource = useSourceContent(view);
provide('assistedResult', view);
</script>
<template>
  <section class="atlas-evidence" aria-label="选中分组证据">
    <h3>{{ row.repo.full_name }} · {{ algorithm }} · {{ label(status) }}<template v-if="status !== 'legacy'"> · {{ row.count(algorithm,status) }} 项</template></h3>
    <p v-if="row.repo.scanned_at">扫描于 {{ formatTime(row.repo.scanned_at) }}（北京时间） · {{ row.repo.rules_version }} · 提交 {{ row.repo.revision || '未记录' }}</p>
    <p v-if="message" role="status">{{ message }}</p>
    <p v-if="status === 'legacy' && row.historicalPositions.has(algorithm)">历史明细示例 · {{ row.historicalPositions.get(algorithm) }}</p>
    <ul v-if="groups.length"><li v-for="g in groups" :key="g.purpose + g.origin">
      {{ purposeName(g) }}（{{ originName(g) }}） · {{ g.count }} 项 ·
      {{ g.example ? g.example.path + ':' + g.example.line : '位置不可用' }}
    </li></ul>
    <template v-if="view">
      <EvidenceGraph v-if="view.assets.length" :result="view" :assets="view.assets" :load-source="loadSource" active />
      <FindingsList :findings="view.findings" :sources="view.sources" :load-source="loadSource" hide-filters />
    </template>
  </section>
</template>
<style scoped>
.atlas-evidence { display:grid; gap:10px; overflow-wrap:anywhere; }
.atlas-evidence h3,.atlas-evidence p { margin:0; }
.atlas-evidence ul { margin:0; padding-inline-start:1.3em; }
.atlas-evidence :deep(.findings-list) { height: min(390px, 65dvh); overflow:auto; }
</style>
