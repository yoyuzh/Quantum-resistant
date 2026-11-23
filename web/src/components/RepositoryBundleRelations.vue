<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import RepositoryBundleCanvas from './RepositoryBundleCanvas.vue';
import SelectControl from './SelectControl.vue';
import { coverageName } from '../utils/repositoryAtlas.js';
import { repositoryCategories, REPOSITORY_PAGE_SIZE } from '../utils/repositoryCategories.js';
import { bundlePurposeLabel, matchesBundleFocus, repositoryBundleFlows } from '../utils/repositoryBundle.js';
import { repositoryLocation } from '../utils/repositoryEvidence.js';

const props = defineProps({ rows: Array, rankings: Array, status: String, filter: String, stamp: String,
  popupTarget: Object, evidenceOpen: Boolean, filtersOpen: Boolean });
const emit = defineEmits(['filter', 'select', 'clear-evidence']);
const focus = ref({});
const category = ref('');
const details = ref(null);
const canvas = ref(null);
const query = ref('');
let detailTrigger;
const page = ref(1);
const purposeFilter = ref('');
const legacy = computed(() => props.status === 'legacy');
const groups = computed(() => repositoryCategories(props.rows));
const algorithmFlows = computed(() => repositoryBundleFlows(groups.value, props.status, props.filter));
const purposeOptions = computed(() => [
  { value: '', label: '全部用途' },
  ...[...new Set(algorithmFlows.value.map(flow => flow.purpose))].map(purpose => ({
    value: purpose, label: bundlePurposeLabel(purpose),
  })),
]);
const flows = computed(() => {
  const keyword = query.value.trim().toLowerCase();
  const filter = { category:category.value, purpose:purposeFilter.value };
  return algorithmFlows.value.filter(flow => matchesBundleFocus(flow, filter) && (!keyword || flow.repo.toLowerCase().includes(keyword)));
});
const linkedCount = computed(() => new Set(flows.value.map(flow => flow.repo)).size);
const count = computed(() => flows.value.reduce((sum, flow) => sum + flow.count, 0));
const format = new Intl.NumberFormat('zh-CN');
const algorithmOptions = computed(() => [
  { value: '', label: '全部算法' },
  ...props.rankings.filter(entry => entry.hits).map(entry => ({
    value: entry.algorithm, label: `${entry.algorithm} · ${entry.hits}/${entry.eligible} 仓`,
  })),
]);
const locationOptions = computed(() => [
  { value: '', label: '全部类别' },
  ...groups.value.map(group => ({ value: group.id, label: group.label })),
]);
const rowsByName = computed(() => new Map(props.rows.map(row => [row.repo.full_name, row])));
const focusLabel = computed(() => focus.value.repo || focus.value.algorithm);
const repoOptions = computed(() => {
  if (!focusLabel.value) return [];
  const entries = new Map();
  for (const flow of flows.value) {
    if (!matchesBundleFocus(flow, focus.value)) continue;
    const entry = entries.get(flow.repo) || { name: flow.repo, row: rowsByName.value.get(flow.repo), count: 0, flows: [] };
    entry.count += flow.count;
    entry.flows.push(flow);
    entries.set(flow.repo, entry);
  }
  return [...entries.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
});
const pages = computed(() => Math.ceil(repoOptions.value.length / REPOSITORY_PAGE_SIZE));
const visibleRepos = computed(() => repoOptions.value.slice((page.value - 1) * REPOSITORY_PAGE_SIZE, page.value * REPOSITORY_PAGE_SIZE));
const focusedCount = computed(() => repoOptions.value.reduce((total, entry) => total + entry.count, 0));
const emptyReason = computed(() => {
  if (!props.rows.length) return '当前范围内没有可用仓库。';
  if (props.rows.every(row => legacy.value ? !row.legacy : !row.repo.algorithm_inventory?.stages[props.status])) {
    return '当前仓库没有可用于此判断来源的数据。';
  }
  return '当前筛选没有匹配的仓库与算法关系。';
});

function setFocus(next) {
  focus.value = next;
  page.value = 1;
  emit('clear-evidence');
}
watch([() => props.status, () => props.rows], () => {
  if (!locationOptions.value.some(option => option.value === category.value)) category.value = '';
  setFocus({});
});
watch([() => props.filter, purposeFilter, category, query], () => setFocus({}));
watch(purposeOptions, options => {
  if (!options.some(option => option.value === purposeFilter.value)) purposeFilter.value = '';
});
async function chooseBundleNode(node, trigger) {
  if (focus.value[node.side] === node.key) return dismissDetails();
  detailTrigger = trigger;
  setFocus({ [node.side]: node.key });
  await nextTick();
  details.value?.focus({ preventScroll: true });
}
function openBundleLink(link, trigger) {
  if (!focusLabel.value || !matchesBundleFocus(link, focus.value)) {
    detailTrigger = trigger;
    setFocus({ repo: link.repo });
  }
  const row = rowsByName.value.get(link.repo);
  if (row) emit('select', row, link.algorithm, legacy.value ? undefined : link.purpose, trigger);
}
function dismissDetails() {
  if (!focusLabel.value) return false;
  setFocus({});
  detailTrigger?.focus({ preventScroll: true });
  return true;
}
function evidenceLocation(flow) {
  const row = rowsByName.value.get(flow.repo);
  const group = row?.groups.find(entry => entry.algorithm === flow.algorithm && entry.purpose === flow.purpose && entry.status === props.status && entry.example);
  const location = group && repositoryLocation(row.repo, group.example);
  const historical = row?.historicalPositions.get(flow.algorithm);
  return location || (historical ? { label:historical, url:'' } : null);
}
defineExpose({ dismissDetails, download: format => canvas.value?.download(format),
  canExport: computed(() => Boolean(flows.value.length)), filtered: computed(() => Boolean(category.value || purposeFilter.value || query.value.trim())) });
</script>

<template>
  <section class="bundle-relations" aria-label="仓库与算法关系图">
    <div v-show="filtersOpen" class="pickers" role="group" aria-label="筛选与定位">
      <label>搜索仓库<input v-model="query" type="search" placeholder="仓库名称" /></label>
      <SelectControl label="算法" :model-value="filter" :options="algorithmOptions" :popup-target="popupTarget"
        :disabled="algorithmOptions.length === 1" @update:model-value="emit('filter', $event)" />
      <SelectControl v-model="category" label="类别" :options="locationOptions" :popup-target="popupTarget"
        :disabled="locationOptions.length === 1" />
      <SelectControl v-model="purposeFilter" label="用途" :options="purposeOptions" :popup-target="popupTarget"
        :disabled="purposeOptions.length === 1" />
    </div>
    <div class="summary">
      <p role="status"><slot name="scope" /> · 当前 {{ linkedCount }} 仓 · {{ format.format(count) }} {{ legacy ? '条历史关联' : '条检出记录' }}</p>
      <slot name="help" />
    </div>
    <p v-if="!flows.length" class="notice" role="status">{{ emptyReason }}</p>
    <div v-else class="graph-content" :class="{ 'with-detail': focusLabel }">
      <RepositoryBundleCanvas ref="canvas" :groups="groups" :flows="flows" :focus="focus" :legacy="legacy" :stamp="stamp" :evidence-location="evidenceLocation"
        @node="chooseBundleNode" @link="openBundleLink" @reset="setFocus({})" />
      <aside v-if="focusLabel" v-show="!evidenceOpen" ref="details" class="graph-detail-overlay bundle-node-detail"
        aria-label="图节点详情" tabindex="-1" @keydown.esc.stop.prevent="dismissDetails">
        <header class="detail-heading"><strong>{{ focusLabel }}</strong><button class="button text-action compact" @click="dismissDetails">收起</button></header>
        <p class="small muted"><template v-if="focus.repo && repoOptions[0]">{{ coverageName(repoOptions[0].row.repo) }} · </template>
          <template v-else>{{ repoOptions.length }} 个关联仓库 · </template>{{ format.format(focusedCount) }} {{ legacy ? '条关联' : '项检出' }}</p>
        <ul class="detail-list">
          <li v-for="entry in visibleRepos" :key="entry.name">
            <h3 v-if="!focus.repo">{{ entry.name }}</h3>
            <button v-for="flow in entry.flows" :key="JSON.stringify([flow.algorithm, flow.purpose])" class="button secondary compact"
              @click="openBundleLink(flow, $event.currentTarget)">
              {{ focus.repo ? flow.algorithm + ' · ' : '' }}{{ bundlePurposeLabel(flow.purpose) }}<template v-if="!legacy"> · {{ format.format(flow.count) }} 项</template>
            </button>
          </li>
        </ul>
        <div v-if="pages > 1" class="pagination">
          <button class="button secondary compact" :disabled="page === 1" @click="page--">上一页</button>
          <span>第 {{ page }} / {{ pages }} 页</span>
          <button class="button secondary compact" :disabled="page === pages" @click="page++">下一页</button>
        </div>
      </aside>
      <slot name="evidence" />
    </div>
  </section>
</template>

<style scoped>
.bundle-relations { display:flex; flex:1; flex-direction:column; gap:4px; min-width:0; min-height:0; }
.bundle-relations > :not(.graph-content) { flex-shrink:0; }
.pickers { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px; }
.summary,.detail-heading,.pagination { display:flex; align-items:center; gap:8px; }
.summary { justify-content:space-between; }
.summary p,.bundle-node-detail p { margin:0; }
.summary p,.pagination span { color:var(--text-secondary); font-size:13px; }
.graph-content { position:relative; display:flex; flex:1; min-height:250px; }
.detail-heading { justify-content:space-between; align-items:start; }
.detail-heading button { flex:none; }
.bundle-node-detail { overflow-wrap:anywhere; }
.detail-list { list-style:none; display:grid; gap:8px; padding:0; margin:8px 0 0; }
.detail-list li + li { border-top:1px solid var(--border-light); padding-top:8px; }
.detail-list h3 { font-size:14px; margin:0 0 4px; }
.detail-list .button { margin:0 4px 4px 0; white-space:normal; text-align:start; }
.pagination { padding-top:8px; }
@media(min-width:1024px) {
  .with-detail :deep(.bundle-viewport) { margin-inline-end:calc(var(--graph-detail-width) + 24px); }
}
@media(max-width:1023px) {
  .with-detail { --detail-height:clamp(105px, 30dvh, 220px); }
  .with-detail :deep(.bundle-viewport) { margin-top:calc(var(--detail-height) + 16px); }
  .with-detail :deep(.graph-detail-overlay) { inset:8px 8px auto; width:auto; max-height:var(--detail-height); }
}
@media(max-width:520px) {
  .pickers { grid-template-columns:repeat(2,minmax(0,1fr)); }
}
</style>
