<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, toRef, watch } from 'vue';
import { selectedFindings } from '../utils/analysis.js';
import { findingKey } from '../utils/results.js';
import { useFindingPagination } from '../composables/useFindingPagination.js';
import { useListViewport } from '../composables/useListViewport.js';
import FindingRow from './FindingRow.vue';
import FindingInspector from './FindingInspector.vue';
import FindingsFilters from './FindingsFilters.vue';
const props = defineProps({ findings: Array, sources: { type: Array, default: () => [] },
  filters: Object, matching: Array, selectedKey: String, loadSource: Function, hideFilters: Boolean,
  identityPeers: Array, active: { type: Boolean, default: true } });
const emit = defineEmits(['update:filters']);
const local = reactive({ algorithm: '', sourceId: '', query: '', method: '', target: '', status: '' });
const currentFilters = computed(() => props.filters || local);
const filtered = computed(() => props.matching || selectedFindings({ findings: props.findings }, currentFilters.value));
const { size, pagination, activeKey, active, choose, changePage, measure } =
  useFindingPagination(filtered, toRef(props, 'selectedKey'));
const root = ref(null);
const viewport = ref(null);
const wide = ref(false);
const opened = ref(false);
let opener;
let observer;
useListViewport(viewport, measure);
onMounted(() => {
  observer = new ResizeObserver(() => {
    if (root.value.getClientRects().length) wide.value = root.value.clientWidth >= 1000;
  });
  observer.observe(root.value);
});
onUnmounted(() => observer?.disconnect());
function updateFilters(value) {
  opened.value = false;
  if (props.filters) emit('update:filters', value);
  else Object.assign(local, value);
}
function select(item, event) {
  choose(item);
  if (!wide.value) {
    opener = event?.currentTarget || document.activeElement;
    opened.value = true;
  }
}
async function closeDetail() {
  opened.value = false;
  await nextTick();
  const target = opener?.isConnected ? opener : viewport.value?.querySelector('.selected');
  target?.focus({ preventScroll: true });
}
function moveSelection(event) {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  const rows = pagination.value.items;
  const index = rows.findIndex(item => findingKey(item) === activeKey.value);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? rows.length - 1 :
    Math.max(0, Math.min(rows.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)));
  event.preventDefault();
  choose(rows[next]);
  nextTick(() => viewport.value?.querySelector('.selected')?.focus({ preventScroll: true }));
}
watch([() => props.selectedKey, () => props.active], async ([key, isActive]) => {
  if (!key || !isActive) return;
  await nextTick();
  if (key !== props.selectedKey || !props.active || !root.value?.getClientRects().length) return;
  wide.value = root.value.clientWidth >= 1000;
  if (!wide.value) {
    opener = viewport.value?.querySelector('.selected') || document.activeElement;
    opened.value = true;
  }
}, { flush: 'post', immediate: true });
watch(() => props.findings, () => { opened.value = false; });
watch(wide, value => { if (value) opened.value = false; });
</script>
<template>
  <section ref="root" class="findings-list" tabindex="-1" aria-label="风险发现明细">
    <FindingsFilters v-if="!hideFilters" :findings="findings" :sources="sources" :filters="currentFilters" @update="updateFilters" />
    <div class="findings-split" :class="{ wide }">
      <div class="findings-master">
        <div class="list-caption"><strong>发现明细 <span>{{ filtered.length }} / {{ findings.length }} 项</span></strong>
        </div>
        <div ref="viewport" class="findings-viewport" @keydown="moveSelection">
          <p v-if="!filtered.length" class="notice">
            {{ findings.length ? '没有符合筛选条件的发现。' : '当前没有确认风险或待复核线索。请核对扫描范围；零发现不代表安全。' }}
          </p>
          <FindingRow v-for="finding in pagination.items" :key="findingKey(finding)" :finding="finding"
            :peers="identityPeers || sources" :selected="findingKey(finding) === activeKey" @select="select" />
        </div>
        <div class="findings-pagination" aria-label="发现分页">
          <span>{{ pagination.current }} / {{ pagination.pages }} 页 · 每页 {{ size }} 项</span>
          <div class="toolbar">
            <button class="button secondary compact" :disabled="pagination.current <= 1" @click="changePage(-1)">上一页</button>
            <button class="button secondary compact" :disabled="pagination.current >= pagination.pages" @click="changePage(1)">下一页</button>
          </div>
        </div>
      </div>
      <FindingInspector :finding="active" :sources="sources" :peers="identityPeers || sources" :load-source="loadSource"
        :wide="wide" :opened="opened" @close="closeDetail" />
    </div>
  </section>
</template>
<style scoped>
.findings-list { display: flex; flex-direction: column; min-width: 0; min-height: 0;
  container: results / inline-size; }
.findings-split { display: grid; grid-template-columns: minmax(0, 1fr); min-height: 0; flex: 1; }
.findings-split.wide { grid-template-columns: clamp(420px, 44%, 720px) minmax(0, 1fr); }
.findings-master { display: flex; flex-direction: column; min-height: 0; min-width: 0; }
.list-caption { display: flex; align-items: center; justify-content: space-between; gap: 8px;
  min-height: 30px; flex-shrink: 0; padding: 4px var(--workspace-gutter); background: var(--bg-elevated); font-size: 12px; color: var(--text-secondary); }
.list-caption strong { font-size: 12px; color: var(--text-primary); }
.list-caption strong span { color: var(--text-secondary); font-weight: 400; margin-left: 6px; }
.findings-viewport { min-height: 0; background: var(--bg-surface); }
.findings-pagination { display: flex; justify-content: space-between; align-items: center; gap: 8px;
  padding: 6px var(--workspace-gutter); min-height: 40px; flex-shrink: 0; font-size: 12px; }
.findings-pagination .toolbar { gap: 4px; }
@media (min-width: 1024px) and (min-height: 600px) {
  .findings-viewport { flex: 1; overflow-y: auto; }
}
@media (max-width: 600px) {
  .list-caption > span { display: none; }
  .findings-pagination { flex-wrap: wrap; }
}
</style>
