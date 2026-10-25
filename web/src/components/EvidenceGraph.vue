<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, toRef, useId, watch } from 'vue';
import { useGraphInspection } from '../composables/useGraphInspection.js';
import { useGraphPagination } from '../composables/useGraphPagination.js';
import { useGraphLayout } from '../composables/useGraphLayout.js';
import { focusDestination } from '../utils/navigation.js';
import CollectionPager from './CollectionPager.vue';
import GraphCanvas from './GraphCanvas.vue';
import GraphRelations from './GraphRelations.vue';
const props = defineProps({ assets: { type: Array, default: () => [] }, active: Boolean,
  available: { type: Boolean, default: true } });
const emit = defineEmits(['select']);
const query = ref('');
const root = ref(null);
const tools = ref(null);
const viewport = ref(null);
const width = ref(800);
const height = ref(0);
const { graph, size, measure: fit, changePage } = useGraphPagination(toRef(props, 'assets'), query);
const layout = useGraphLayout(graph, width, height);
const wide = computed(() => width.value >= 760 && layout.value.fits);
const tooltipId = useId();
const { inspection, tooltip, position, inspectPointer, inspectFocus, blurNode,
  retainPointer, hidePointer, clearInspection } = useGraphInspection(graph);
let observer;
let media;
function measure() {
  if (!root.value?.getClientRects().length) return;
  width.value = Math.max(1, root.value.clientWidth);
  const control = parseFloat(getComputedStyle(root.value).getPropertyValue('--compact-control-height')) || 32;
  // A stable full-workspace budget, independent of the diagram's intrinsic size
  // and whether this particular page needs a visible pager.
  const budget = root.value.clientHeight - (tools.value?.offsetHeight || 0) - control - 46;
  height.value = media.matches ? Math.max(0, budget - 26) : 0;
  fit(budget, media.matches, width.value >= 760);
}
function select(value) {
  clearInspection();
  emit('select', value);
}
async function turn(delta) {
  changePage(delta);
  await nextTick();
  viewport.value.scrollTop = 0;
  if (!media.matches) focusDestination(viewport.value, viewport.value.closest('.panel-body'),
    viewport.value.closest('.result-layout')?.querySelector('.result-sticky'));
}
watch(() => props.active, active => { if (!active) clearInspection(); }, { flush: 'sync' });
watch(wide, clearInspection);
onMounted(() => {
  media = window.matchMedia('(min-width: 1024px) and (min-height: 600px)');
  observer = new ResizeObserver(measure);
  observer.observe(root.value);
  if (tools.value) observer.observe(tools.value);
  media.addEventListener('change', measure);
  measure();
});
onUnmounted(() => {
  observer?.disconnect();
  media?.removeEventListener('change', measure);
});
</script>
<template>
  <section ref="root" class="evidence-graph" aria-label="证据关系图" @keydown.esc.stop="clearInspection">
    <div v-if="available" ref="tools" class="graph-tools">
      <label>查找图中文件<input v-model="query" type="search" placeholder="文件路径或身份编号" /></label>
      <p class="small muted">实线：命中证据 · 虚线：迁移参考，需按用途复核</p>
    </div>
    <div ref="viewport" class="graph-viewport workspace-surface" tabindex="-1" aria-label="当前页证据关系">
      <p v-if="!available" class="notice">此历史结果未记录资产分析，请重新扫描以生成证据关系图。</p>
      <template v-else-if="graph.files.length">
        <GraphCanvas v-if="wide" :graph="graph" :layout="layout" :inspection="inspection" :tooltip-id="tooltipId"
          @select="select" @inspect-pointer="inspectPointer"
          @inspect-focus="inspectFocus" @blur-node="blurNode" @hide-pointer="hidePointer" />
        <GraphRelations v-else :graph="graph" @select="select" />
      </template>
      <p v-else class="notice">{{ assets.length ? '没有匹配的文件。' : '本次未发现可绘制的算法证据。' }}</p>
    </div>
    <div v-if="available" class="graph-pagination">
      <span class="small muted">当前 {{ graph.files.length }} / {{ graph.totalFiles }} 个命中文件 · 匹配 {{ graph.matchedFiles }} 个</span>
      <CollectionPager v-if="graph.pagination.pages > 1" :pagination="graph.pagination" :size="size" @change="turn" />
    </div>
    <Teleport to="body">
      <div v-if="active && inspection" :id="tooltipId" ref="tooltip" class="graph-inspection" role="tooltip"
        :style="position" @pointerenter="retainPointer" @pointerleave="hidePointer" @keydown.esc="clearInspection">
        <strong>{{ inspection.title }}</strong><span>{{ inspection.detail }}</span>
      </div>
    </Teleport>
  </section>
</template>
<style scoped>
.evidence-graph { display: flex; flex-direction: column; min-height: 0; min-width: 0; width: 100%; gap: 8px; }
.graph-viewport { background: var(--bg-elevated); border-radius: var(--radius-lg); }
.graph-viewport::before { opacity: 0.4; }
.graph-tools { display: flex; align-items: end; justify-content: space-between; flex-wrap: wrap; gap: 8px 16px; flex-shrink: 0; }
.graph-tools label { flex: 1; min-width: 180px; max-width: 260px; font-size: 12px; gap: 2px; }
.graph-tools input { min-height: 32px; padding: 4px 8px; }
.graph-tools p { min-width: 220px; padding-bottom: 6px; font-size: 12px; }
.graph-pagination { display: grid; align-content: start; gap: 6px; flex-shrink: 0;
  min-height: calc(var(--compact-control-height) + 28px); }
.graph-inspection { position: fixed; z-index: 110; max-width: min(420px, calc(100vw - 16px));
  max-height: min(240px, 50vh); overflow-y: auto; padding: 10px 12px; border-radius: var(--radius);
  background: var(--bg-surface); color: var(--text-primary); box-shadow: var(--shadow-lg);
  display: grid; gap: 2px; font-size: 13px; overflow-wrap: anywhere; }
.graph-inspection span { color: var(--text-secondary); }
@media (min-width: 1024px) and (min-height: 600px) {
  .graph-viewport { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
}
@media (max-width: 600px) {
  .graph-tools { flex-direction: column; align-items: stretch; }
  .graph-tools label { max-width: none; }
  .graph-tools input { font-size: 16px; min-height: 44px; }
}
@media (pointer: coarse) { .graph-tools input { min-height: 44px; } }
</style>
