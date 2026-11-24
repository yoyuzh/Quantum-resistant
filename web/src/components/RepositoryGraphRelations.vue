<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import AppIcon from './AppIcon.vue';
import RepositoryGraphCanvas from './RepositoryGraphCanvas.vue';
import SelectControl from './SelectControl.vue';
import { coverageName, fullyVerifiedRepository, stageText } from '../utils/repositoryAtlas.js';
import { repositoryCategories, REPOSITORY_PAGE_SIZE } from '../utils/repositoryCategories.js';
import { bundlePurposeLabel, matchesBundleFocus, repositoryBundleFlows } from '../utils/repositoryBundle.js';
import { repositoryLocation } from '../utils/repositoryEvidence.js';
import { overviewScale } from '../utils/repositoryOverview.js';

const props = defineProps({ rows: Array, rankings: Array, status: String, filter: String, stamp: String,
  popupTarget: Object, evidenceOpen: Boolean, evidencePanel: Object, filtersOpen: Boolean, overview: Boolean });
const emit = defineEmits(['filter', 'select', 'clear-evidence']);
const focus = ref({});
const category = ref('');
const expanded = ref('');
const selectedEdge = ref('');
const details = ref(null);
const canvas = ref(null);
const query = ref('');
let detailTrigger;
const page = ref(1);
const purposeFilter = ref('');
const coverageFilter = ref('');
const coverageOptions = [{ value:'', label:'全部扫描范围' }, { value:'verified', label:'已完整核验' }];
const legacy = computed(() => props.status === 'legacy');
const groups = computed(() => repositoryCategories(props.rows));
const verified = computed(() => new Set(props.rows.filter(row => fullyVerifiedRepository(row.repo)).map(row => row.repo.full_name)));
const keyword = computed(() => query.value.trim().toLowerCase());
const matchesRepository = name => (!coverageFilter.value || verified.value.has(name)) &&
  (!keyword.value || name.toLowerCase().includes(keyword.value));
const overviewGroups = computed(() => groups.value.filter(group => !category.value || category.value === group.id)
  .map(group => ({ ...group, rows:group.rows.filter(row => matchesRepository(row.repo.full_name)) }))
  .filter(group => group.rows.length));
const showUnlinked = computed(() => props.overview && !props.filter && !purposeFilter.value);
const allFlows = computed(() => repositoryBundleFlows(groups.value, props.status));
const algorithmFlows = computed(() => props.filter
  ? allFlows.value.filter(flow => flow.algorithm === props.filter) : allFlows.value);
const overviewPeak = computed(() => overviewScale(allFlows.value));
const purposeOptions = computed(() => [
  { value: '', label: '全部用途' },
  ...[...new Set(algorithmFlows.value.map(flow => flow.purpose))].map(purpose => ({
    value: purpose, label: bundlePurposeLabel(purpose),
  })),
]);
const flows = computed(() => {
  const filter = { category:category.value, purpose:purposeFilter.value };
  return algorithmFlows.value.filter(flow => matchesBundleFocus(flow, filter) && matchesRepository(flow.repo));
});
const linkedCount = computed(() => new Set(flows.value.map(flow => flow.repo)).size);
const count = computed(() => flows.value.reduce((sum, flow) => sum + flow.count, 0));
const format = new Intl.NumberFormat('zh-CN');
const algorithmOptions = computed(() => [
  { value: '', label: '全部算法' },
  ...props.rankings.filter(entry => entry.hits).map(entry => ({
    value: entry.algorithm, label: `${entry.algorithm}（${entry.hits}/${entry.eligible} 仓）`,
  })),
]);
const locationOptions = computed(() => [
  { value: '', label: '全部类别' },
  ...groups.value.map(group => ({ value: group.id, label: group.label })),
]);
const rowsByName = computed(() => new Map(props.rows.map(row => [row.repo.full_name, row])));
const focusLabel = computed(() => focus.value.repo || focus.value.algorithm);
const focusedRow = computed(() => focus.value.repo && rowsByName.value.get(focus.value.repo));
const hasGraph = computed(() => Boolean(flows.value.length || (showUnlinked.value && overviewGroups.value.length)));
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
  selectedEdge.value = '';
  page.value = 1;
  emit('clear-evidence');
}
watch([() => props.status, () => props.rows], () => {
  if (!locationOptions.value.some(option => option.value === category.value)) category.value = '';
  setFocus({});
});
watch([() => props.filter, purposeFilter, coverageFilter, category, query, () => props.overview], () => setFocus({}));
watch(() => props.evidenceOpen, open => { if (!open) selectedEdge.value = ''; });
watch([flows, showUnlinked, overviewGroups], ([items, unlinked, categories]) => {
  if (props.overview && expanded.value && !(unlinked ? categories.some(group => group.id === expanded.value)
    : items.some(flow => flow.category === expanded.value))) expanded.value = '';
});
watch(purposeOptions, options => {
  if (!options.some(option => option.value === purposeFilter.value)) purposeFilter.value = '';
});
async function chooseNode(node, trigger) {
  if (node.side === 'category') {
    expanded.value = expanded.value === node.key ? '' : node.key;
    setFocus({});
    return;
  }
  if (focus.value[node.side] === node.key) return dismissDetails();
  detailTrigger = trigger;
  setFocus({ [node.side]: node.key });
  await nextTick();
  details.value?.focus({ preventScroll: true });
}
async function openLink(link, trigger) {
  if (!link.repo) {
    expanded.value = link.category;
    detailTrigger = trigger;
    setFocus({ category:link.category, algorithm:link.algorithm });
    await nextTick();
    details.value?.focus({ preventScroll:true });
    return;
  }
  if (!focusLabel.value || !matchesBundleFocus(link, focus.value)) {
    detailTrigger = trigger;
    setFocus({ repo: link.repo });
  }
  const row = rowsByName.value.get(link.repo);
  if (row) {
    if (props.overview) {
      if (expanded.value !== link.category) {
        expanded.value = link.category;
        setFocus({ repo:link.repo });
        await nextTick();
      }
      canvas.value?.showRepository(link.repo);
      selectedEdge.value = JSON.stringify(['repo:' + link.repo, link.algorithm]);
    }
    emit('select', row, link.algorithm, legacy.value ? undefined : link.purpose, trigger);
  }
}
function dismissDetails() {
  if (!focusLabel.value) return false;
  setFocus({});
  if (detailTrigger?.isConnected) detailTrigger.focus({ preventScroll: true });
  else canvas.value?.focusViewport();
  return true;
}
function evidenceLocation(flow) {
  const row = rowsByName.value.get(flow.repo);
  const group = row?.groups.find(entry => entry.algorithm === flow.algorithm &&
    (!flow.purpose || entry.purpose === flow.purpose) && entry.status === props.status && entry.example);
  const location = group && repositoryLocation(row.repo, group.example);
  const historical = row?.historicalPositions.get(flow.algorithm);
  return location || (historical ? { label:historical, url:'' } : null);
}
defineExpose({ dismissDetails, download: format => canvas.value?.download(format),
  canExport: hasGraph, filtered: computed(() => Boolean(category.value || purposeFilter.value || coverageFilter.value || keyword.value)) });
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
      <SelectControl v-model="coverageFilter" label="扫描范围" :options="coverageOptions" :popup-target="popupTarget" />
    </div>
    <div class="summary">
      <p role="status"><slot name="scope" />，完整核验 {{ verified.size }} 仓。{{ showUnlinked ? '当前有检出关系' : '当前图中' }}
        {{ linkedCount }} 仓、{{ format.format(count) }} {{ legacy ? '条历史关联' : '条检出记录' }}</p>
      <slot name="help" />
    </div>
    <p v-if="!hasGraph" class="notice" role="status">{{ emptyReason }}</p>
    <div v-else class="graph-content">
      <RepositoryGraphCanvas ref="canvas" :groups="overview ? overviewGroups : groups" :flows="flows" :focus="focus" :legacy="legacy" :stamp="stamp"
        :overview="overview" :expanded="expanded" :overview-peak="overviewPeak" :selected-edge="selectedEdge"
        :show-unlinked="showUnlinked" :evidence-location="evidenceLocation" :overlay="evidenceOpen ? evidencePanel : details"
        @node="chooseNode" @link="openLink" @reset="setFocus({})" />
      <aside v-if="focusLabel" v-show="!evidenceOpen" ref="details" class="graph-detail-overlay bundle-node-detail"
        aria-label="图节点详情" tabindex="-1" @keydown.esc.stop.prevent="dismissDetails">
        <header class="detail-heading"><strong>{{ focusLabel }}</strong><button class="button text-action compact" @click="dismissDetails">收起</button></header>
        <p v-if="focusedRow && !repoOptions.length" class="small muted">{{ coverageName(focusedRow.repo) }}。当前范围无检出关系，{{ stageText(focusedRow, status) }}。</p>
        <p v-else class="small muted"><template v-if="focusedRow">{{ coverageName(focusedRow.repo) }}，</template>
          <template v-else>{{ repoOptions.length }} 个关联仓库，</template>{{ format.format(focusedCount) }} {{ legacy ? '条关联' : '项检出' }}</p>
        <div v-if="visibleRepos.length" class="detail-body">
          <ul class="detail-list" aria-label="查看关系证据">
            <li v-for="entry in visibleRepos" :key="entry.name">
              <h3 v-if="!focus.repo">{{ entry.name }}</h3>
              <button v-for="flow in entry.flows" :key="JSON.stringify([flow.algorithm, flow.purpose])"
                type="button" class="button secondary detail-action" @click="openLink(flow, $event.currentTarget)">
                <span>{{ focus.repo ? flow.algorithm + ' / ' : '' }}{{ bundlePurposeLabel(flow.purpose) }}</span>
                <span v-if="!legacy" class="action-count">{{ format.format(flow.count) }} 项</span>
                <AppIcon name="chevron" :size="15" />
              </button>
            </li>
          </ul>
        </div>
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
.pickers { display:grid; grid-template-columns:minmax(0,1.25fr) repeat(4,minmax(0,1fr)); gap:8px; }
.summary,.detail-heading,.pagination { display:flex; align-items:center; gap:8px; }
.summary { justify-content:space-between; }
.summary p,.bundle-node-detail p { margin:0; }
.summary p,.pagination span { color:var(--text-secondary); font-size:13px; }
.graph-content { position:relative; display:flex; flex:1; min-height:250px; }
.detail-heading { justify-content:space-between; align-items:start; }
.detail-heading button { flex:none; }
.graph-content :deep(.graph-detail-overlay) { width:min(360px, 42%); max-height:min(62%, calc(100% - 72px));
  background:var(--bg-surface); backdrop-filter:none; }
.bundle-node-detail { display:flex; flex-direction:column; overflow:hidden; overflow-wrap:anywhere; }
.detail-body { overflow:auto; overscroll-behavior:contain; margin-top:8px; }
.detail-list { list-style:none; display:grid; gap:8px; padding:0; margin:0; }
.detail-list li { display:grid; gap:4px; }
.detail-list li + li { border-top:1px solid var(--border-light); padding-top:8px; }
.detail-list h3 { font-size:14px; margin:0 0 2px; }
.detail-action { width:100%; display:grid; grid-template-columns:minmax(0,1fr) auto auto; min-height:34px;
  padding:4px 8px; gap:6px; align-items:center; text-align:start; white-space:normal; }
.detail-action :deep(svg) { grid-column:3; color:var(--accent-dim); }
.detail-action:hover { background:var(--control-hover); color:var(--accent-dim); }
.action-count { font-size:12px; color:var(--text-secondary); white-space:nowrap; }
.pagination { padding-top:8px; }
@media(max-width:760px) {
  .graph-content :deep(.graph-detail-overlay) { inset:8px 8px auto; width:auto; max-height:min(40%, 240px); }
}
@media(max-width:520px) {
  .pickers { grid-template-columns:repeat(2,minmax(0,1fr)); }
  .pickers > label { grid-column:1/-1; }
}
</style>
