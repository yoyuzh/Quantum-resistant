<script setup>
import { computed, provide, ref, watch } from 'vue';
import { formatTime } from '../utils/results.js';
import { request } from '../api/client.js';
import { useSourceContent } from '../composables/useSourceContent.js';
import { label, originName, purposeName } from '../utils/repositoryAtlas.js';
import { selectedFindings } from '../utils/analysis.js';
import { repositoryLocation } from '../utils/repositoryEvidence.js';
import CodePreview from './CodePreview.vue';
import FindingsList from './FindingsList.vue';
import EvidenceGraph from './EvidenceGraph.vue';

const props = defineProps({ row: Object, algorithm: String, purpose: String, status: String, taskId: String });
const detail = ref(null);
const message = ref('');
const groups = computed(() => props.row.groups.filter(g => g.algorithm === props.algorithm && g.status === props.status &&
  (!props.purpose || g.purpose === props.purpose)));
const count = computed(() => groups.value.reduce((total, group) => total + group.count, 0));
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
    algorithm: props.algorithm, status: props.status === 'legacy' ? '' : props.status, purpose: props.purpose,
  });
  const ids = new Set(findings.map(f => f.finding_id).filter(Boolean));
  const assets = props.purpose ? [] : (merged?.analysis?.assets || full.analysis?.assets || []).filter(matches);
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
const selectedLocation = ref(null);
const locations = computed(() => groups.value.map(group => ({ group, location:repositoryLocation(props.row.repo, group.example) })));
const findingsByLocation = computed(() => new Map((view.value?.findings || []).map(finding => [
  `${finding.source_id}:${finding.line}`, finding,
])));
const preview = computed(() => {
  const location = selectedLocation.value;
  if (location) return findingsByLocation.value.get(`${location.source_id}:${location.line}`) || null;
  return view.value?.findings?.[0];
});
watch([() => props.row, () => props.algorithm, () => props.purpose, () => props.status], () => { selectedLocation.value = null; });
function canLocate(location) {
  return location && findingsByLocation.value.has(`${location.source_id}:${location.line}`);
}
</script>
<template>
  <section class="atlas-evidence" aria-label="选中分组证据">
    <h3>{{ row.repo.full_name }} / {{ algorithm }}<template v-if="purpose">（{{ purposeName({ purpose }) }}）</template></h3>
    <p>{{ label(status) }}<template v-if="status !== 'legacy'"> {{ count }} 项</template></p>
    <p v-if="row.repo.scanned_at">{{ formatTime(row.repo.scanned_at) }}（北京时间），规则 {{ row.repo.rules_version }}，提交 {{ row.repo.revision || '未记录' }}</p>
    <p v-if="message" role="status">{{ message }}</p>
    <p v-if="status === 'legacy' && row.historicalPositions.has(algorithm)">历史位置 {{ row.historicalPositions.get(algorithm) }}</p>
    <section v-if="locations.length" class="evidence-locations" aria-label="证据定位">
      <h4>{{ view ? '证据定位' : '代表位置' }}</h4>
      <ul><li v-for="{ group, location } in locations" :key="group.purpose + group.origin">
        <span class="small muted">{{ purposeName(group) }}（{{ originName(group) }}） {{ group.count }} 项</span>
        <button v-if="canLocate(location)" class="button text-action compact" @click="selectedLocation = location">{{ location.label }}</button>
        <a v-else-if="location?.url" :href="location.url" target="_blank" rel="noopener noreferrer" :title="'打开固定提交的源码行'">{{ location.label }}</a>
        <code v-else-if="location">{{ location.label }}</code>
        <span v-else class="small muted">未记录位置</span>
      </li></ul>
    </section>
    <template v-if="view">
      <div v-if="preview" class="located-source">
        <p>{{ preview.file_name }} 第 {{ preview.line }} 行</p>
        <CodePreview :sources="view.sources" :finding="preview" :load-source="loadSource" />
      </div>
      <EvidenceGraph v-if="view.assets.length" :result="view" :assets="view.assets" :load-source="loadSource" active />
      <FindingsList :findings="view.findings" :sources="view.sources" :load-source="loadSource" hide-filters />
    </template>
  </section>
</template>
<style scoped>
.atlas-evidence { display:grid; gap:10px; overflow-wrap:anywhere; }
.atlas-evidence h3,.atlas-evidence p { margin:0; }
.atlas-evidence ul { margin:0; padding-inline-start:1.3em; }
.evidence-locations h4 { margin:0 0 4px; font-size:14px; }
.evidence-locations ul { display:grid; gap:5px; list-style:none; padding:0; }
.evidence-locations li { display:grid; justify-items:start; }
.evidence-locations .button { text-align:start; white-space:normal; padding-inline:0; }
.located-source > p { margin-bottom:4px; font-size:13px; }
.atlas-evidence :deep(.findings-list) { height: min(390px, 65dvh); overflow:auto; }
</style>
