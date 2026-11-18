<script setup>
import { computed, defineAsyncComponent, nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import AppIcon from './AppIcon.vue';
import RepositoryVector from './RepositoryVector.vue';
import { groupedRepositoryGraph } from '../utils/repositoryGraph.js';
import { repositoryCategories, REPOSITORY_PAGE_SIZE } from '../utils/repositoryCategories.js';
import { coverageName, label, stageText } from '../utils/repositoryAtlas.js';

const props = defineProps({ rows:Array, rankings:Array, status:String, filter:String, stamp:String, scaleMax:Number, evidenceOpen:Boolean });
const emit = defineEmits(['select','filter','clear-evidence']);
const initialWidth = 920;
const root = ref(null), inlineWidth = ref(initialWidth), fullWidth = ref(initialWidth), pinned = ref(''), pinnedEdge = ref('');
const graphDialog = ref(null), fullscreenButton = ref(null), exitButton = ref(null);
const fullscreen = ref(false);
let scrollTop = 0;
const Stage3DCanvas = defineAsyncComponent(() => import('./Stage3DCanvas.vue'));
const unavailable3D = ref(false), viewMode = ref('2d');
const expanded = ref(''), page = ref(1);
let observer;
onMounted(() => {
  observer = new ResizeObserver(entries => {
    for (const entry of entries) {
      const measured = entry.target===root.value ? inlineWidth : fullWidth;
      if (entry.contentRect.width) measured.value = Math.max(220,Math.floor(entry.contentRect.width)-2);
    }
  });
  observer.observe(root.value);
  observer.observe(graphDialog.value);
});
onBeforeUnmount(() => observer?.disconnect());
const showPickers = ref(false);
const groups = computed(() => repositoryCategories(props.rows));
const openGroup = computed(() => groups.value.find(group => group.id === expanded.value));
const pages = computed(() => Math.ceil((openGroup.value?.rows.length || 0) / REPOSITORY_PAGE_SIZE));
// The 3D renderer fits its own viewport. Resizing it need not rebuild the relation data.
const graphWidth = computed(() => viewMode.value === '3d' ? initialWidth : fullscreen.value ? fullWidth.value : inlineWidth.value);
const graph = computed(() => groupedRepositoryGraph(groups.value, expanded.value, page.value,
  props.rankings, props.status, graphWidth.value, props.filter, props.scaleMax));
const active = computed(() => graph.value.nodes.find(n => n.id === pinned.value));
const location = computed({
  get:()=>pinned.value || expanded.value,
  set:id=>chooseNode(id, true),
});
const legacy = computed(() => props.status === 'legacy');
const sum = computed(() => graph.value.links.reduce((total,e) => total + e.value, 0));
const unavailable = computed(() => props.rows.every(r =>
  !r.repo.algorithm_inventory?.stages?.[props.status] && !(legacy.value && r.legacy)));
watch([groups, () => props.status], () => {
  changePage(1);
  if (!openGroup.value) expanded.value = '';
});
function changePage(value) {
  page.value = value;
  pinned.value = '';
  pinnedEdge.value = '';
  emit('clear-evidence');
}
function chooseNode(id, locate = false) {
  pinnedEdge.value = '';
  if (locate && !id) {
    expanded.value = '';
    changePage(1);
    return;
  }
  if (!id) emit('clear-evidence');
  if (id.startsWith('category:')) {
    if (locate && expanded.value === id) { pinned.value = ''; return; }
    expanded.value = expanded.value === id ? '' : id;
    changePage(1);
  } else {
    if (id.startsWith('repo:') && !graph.value.nodes.some(node=>node.id===id)) {
      for (const group of groups.value) {
        const index = group.rows.findIndex(row=>'repo:'+row.repo.full_name===id);
        if (index<0) continue;
        expanded.value = group.id;
        changePage(Math.floor(index/REPOSITORY_PAGE_SIZE)+1);
        break;
      }
    }
    pinned.value = id;
  }
}
function openEdge(id) {
  const edge = graph.value.links.find(e => e.id === id);
  if (!edge) return;
  const source = graph.value.nodes.find(n => n.id === edge.source);
  if (source.group) {
    chooseNode(source.id);
    pinned.value = edge.target;
  } else {
    pinnedEdge.value = edge.id;
    emit('select', source.row, edge.algorithm);
  }
}
function relationText(edge) {
  const name = active.value.kind === 'file' ? edge.algorithm : edge.sourceLabel;
  return legacy.value ? name : name + ' · ' + edge.value + ' 项';
}
async function toggleFullscreen() {
  const dialog = graphDialog.value;
  const scroller = dialog.closest('.library,.atlas-dialog');
  if (fullscreen.value) {
    dialog.close();
  } else {
    scrollTop = scroller?.scrollTop ?? 0;
    dialog.showModal();
  }
  fullscreen.value = !fullscreen.value;
  await nextTick();
  if (!fullscreen.value && scroller) scroller.scrollTop = scrollTop;
  (fullscreen.value ? exitButton : fullscreenButton).value?.focus({ preventScroll: true });
}
function exitFullscreen(event) {
  if (!fullscreen.value || event.defaultPrevented) return;
  event.preventDefault();
  event.stopPropagation();
  if (props.evidenceOpen || pinned.value || pinnedEdge.value) {
    if (props.evidenceOpen) emit('clear-evidence');
    else { pinned.value = ''; pinnedEdge.value = ''; }
    exitButton.value?.focus({preventScroll:true});
    return;
  }
  toggleFullscreen();
}
function fallback() {
  unavailable3D.value = true;
  viewMode.value = '2d';
}
</script>
<template>
  <section ref="root" class="relations" aria-label="仓库与算法关系图">
    <dialog ref="graphDialog" class="graph-fullscreen" aria-label="仓库算法关系图" @cancel="exitFullscreen" @keydown.esc="exitFullscreen"></dialog>
    <Teleport :to="graphDialog" :disabled="!fullscreen">
    <div class="figure-heading">
      <div class="figure-title"><strong v-if="fullscreen">{{ openGroup?.label || '仓库全景' }}</strong><p v-if="groups.length">{{ groups.length }} 类<span v-if="graph.links.length"> · {{ graph.links.length }} 组关系<span v-if="!legacy"> · {{ sum.toLocaleString('zh-CN') }} 条记录</span></span> · {{ expanded ? '细绿线表示类别归属' : '点击分类展开' }}</p></div>
      <div class="segmented-group" role="group" aria-label="图形视图">
        <button class="button secondary compact" :aria-pressed="viewMode==='2d'" @click="viewMode='2d'">2D</button>
        <button class="button secondary compact" :aria-pressed="viewMode==='3d'" :disabled="unavailable3D"
          :title="unavailable3D ? '3D 不可用，当前使用 2D' : undefined" @click="viewMode='3d'">3D</button>
      </div>
      <button v-if="fullscreen" ref="exitButton" type="button" class="button secondary compact fullscreen-exit" @click="toggleFullscreen">退出全屏</button>
      <button v-if="graph.nodes.length" class="button secondary compact picker-toggle" :aria-expanded="showPickers" @click="showPickers=!showPickers">筛选与定位</button>
      <div class="pickers" :class="{expanded:showPickers}"><label v-if="rankings.length">算法
        <select :value="filter" aria-label="算法范围" @change="emit('filter',$event.target.value)">
          <option value="">全部算法</option><option v-for="entry in rankings" :key="entry.algorithm" :disabled="!entry.hits" :value="entry.algorithm">{{ entry.algorithm }} · {{ entry.hits }}/{{ entry.eligible }} 仓</option>
        </select></label>
      <label v-if="graph.nodes.length">定位
        <select v-model="location" aria-label="查看关系节点"><option value="">全部关系</option>
          <option v-for="n in graph.nodes" :key="n.id" :value="n.id">{{ n.label }}</option>
        </select></label>
      </div>
    </div>
    <p v-if="unavailable3D" class="graph-empty" role="status">当前环境无法显示 3D，已切换到 2D。</p>
    <p v-if="!graph.links.length" class="graph-empty" role="status">{{ !rows.length ? '当前范围内没有可用仓库。' : unavailable ? '当前仓库没有可用于此判断来源的数据。' : '当前范围没有形成此来源的检出关系。' }}</p>
    <div v-if="pages > 1" class="category-pages">
      <span>{{ openGroup.label }} · 第 {{ page }} / {{ pages }} 页</span>
      <button class="button secondary compact" :disabled="page === 1" @click="changePage(page - 1)">上一页</button>
      <button class="button secondary compact" :disabled="page === pages" @click="changePage(page + 1)">下一页</button>
    </div>
    <div class="graph-content" :class="{ 'graph-with-evidence': evidenceOpen }">
      <component :is="viewMode==='3d' ? Stage3DCanvas : RepositoryVector" v-if="graph.nodes.length"
        :graph="graph" :selected="pinned" :selected-edge="pinnedEdge" :status="status" :fullscreen="fullscreen"
        v-bind="viewMode==='3d' ? { onUnavailable: fallback } : { stamp }" @select="chooseNode" @select-edge="openEdge">
        <template #fullscreen>
          <button v-if="!fullscreen" ref="fullscreenButton" type="button" class="button secondary compact fullscreen-trigger"
            aria-label="网页全屏" title="网页全屏" @click="toggleFullscreen">
            <AppIcon name="expand" :size="17" />
          </button>
        </template>
      </component>
      <slot name="evidence" :fullscreen="fullscreen" />
    </div>
    <section v-if="active" class="node-detail" aria-label="所选节点的检出关系">
      <div><strong>{{ active.label }}</strong><span>{{ active.row ? coverageName(active.row.repo) : '覆盖 ' + active.ranking.hits + ' / ' + active.ranking.eligible + ' 仓，其中部分扫描 ' + active.ranking.partial + ' 仓' }}</span></div>
      <p v-if="active.edges.length">{{ active.row ? '选择一组关系查看' + label(status) + '依据' : '选择类别展开仓库，或选择仓库查看依据' }}</p>
      <p v-else>当前来源未形成检出关系 · {{ stageText(active.row, status) }}</p>
      <button v-for="e in active.edges" :key="e.id" class="button secondary compact" @click="openEdge(e.id)">{{ relationText(e) }}</button>
    </section>
    <details v-if="graph.unlinked.length" class="unlinked">
      <summary>本页未形成连线的仓库 · {{ graph.unlinked.length }}</summary>
      <ul><li v-for="row in graph.unlinked" :key="row.repo.full_name">{{ row.repo.full_name }} · {{ coverageName(row.repo) }} · {{ stageText(row,status) }}</li></ul>
    </details>
    </Teleport>
  </section>
</template>
<style scoped>
.relations { min-width:0; margin-top:12px; }
.graph-fullscreen { position:fixed; inset:0; width:100%; height:100dvh; max-width:none; max-height:none;
  margin:0; padding:12px; border:0; overflow:auto; overscroll-behavior:contain; background:var(--bg-elevated); color:inherit; }
.fullscreen-trigger { inline-size:34px; padding-inline:0; justify-content:center; }
.fullscreen-exit { margin-inline-start:auto; }
.graph-fullscreen .figure-heading { position:sticky; top:0; z-index:4; padding-block-end:8px; background:var(--bg-elevated); }
.graph-fullscreen :deep(.vector-stage),.graph-fullscreen :deep(.spatial-stage) { display:flex; flex-direction:column; min-height:55dvh; }
.graph-fullscreen :deep(.network-frame),.graph-fullscreen :deep(.spatial-field) { flex:1; min-height:0; }
.graph-fullscreen :deep(.network) { height:100%; }
.graph-fullscreen :deep(.vector-stage),.graph-fullscreen :deep(.spatial-stage) { height:calc(100dvh - 112px); }
.figure-heading { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:8px; margin-bottom:10px; }
.figure-title strong { display:block; font-size:15px; line-height:1.15; }
.figure-heading p,.node-detail p,.category-pages { margin:4px 0; font-size:13px; color:var(--text-secondary); }
.category-pages { display:flex; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px; }
.picker-toggle { display:none; }
.pickers { display:flex; align-items:center; gap:12px; flex-wrap:wrap; max-width:100%; }
label { white-space:nowrap; display:inline-flex;align-items:center;gap:6px;color:var(--text-secondary);font-size:13px; }
select { width:auto; min-width:0; max-width:min(180px,33vw); min-height:34px; background:var(--bg-input); color:var(--text-primary); border:1px solid var(--border); border-radius:6px; padding:4px 8px; }
.node-detail,.graph-empty { padding:12px; background:var(--bg-elevated); border-radius:var(--radius); margin:8px 0; overflow-wrap:anywhere; }
.node-detail span { color:var(--text-secondary); margin-inline-start:8px; font-size:13px; }
.node-detail button { margin:2px 5px 2px 0; }
.unlinked { margin:10px 0; font-size:13px; color:var(--text-secondary); }
.unlinked summary { cursor:pointer; }
.unlinked li { overflow-wrap:anywhere; }
@media(max-width:600px), (max-height:540px) and (orientation:landscape) { .relations { margin-top:8px; } .picker-toggle { display:inline-flex; } .pickers { gap:8px; width:100%; } .pickers:not(.expanded) { display:none; }
  .figure-heading { flex-wrap:wrap; } .figure-heading > div:first-child { flex:1; min-width:125px; }
  :deep(.spatial-controls > .spatial-buttons:last-child) { margin-inline-start:auto; } }
@media(min-width:650px) and (orientation:landscape) {
  .graph-fullscreen .graph-with-evidence { display:grid; grid-template-columns:minmax(0,1fr) minmax(230px,33%); align-items:start; gap:12px; }
}
@media(max-height:540px) and (orientation:landscape) {
  .relations { margin-top:2px; }
  .graph-fullscreen { padding:6px; }
  .figure-heading { margin-bottom:3px; }
  .graph-fullscreen :deep(.vector-stage),.graph-fullscreen :deep(.spatial-stage) { height:calc(100dvh - 66px); }
}
</style>
