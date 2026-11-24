<script setup>
import { computed, nextTick, ref, useId, watch } from 'vue';
import { batchScope, label, repositoryAtlas } from '../utils/repositoryAtlas.js';
import { inventoryFilename, inventoryMarkdown } from '../utils/repositoryInventory.js';
import { formatTime } from '../utils/results.js';
import RepositoryGraphRelations from './RepositoryGraphRelations.vue';
import AtlasEvidence from './AtlasEvidence.vue';
import GraphPreview from './GraphPreview.vue';
import GraphExportMenu from './GraphExportMenu.vue';
import InfoTip from './InfoTip.vue';

const props = defineProps({ result: Object });
const titleId = useId();
const atlas = computed(() => repositoryAtlas(props.result));
const dialog = ref(null);
const popupLayer = ref(null);
const trigger = ref(null);
const active = ref(false);
const mode = ref('confirmed');
const overview = ref(false);
const filter = ref('');
const filtersOpen = ref(false);
const selected = ref(null);
const evidence = ref(null);
const relations = ref(null);
let evidenceTrigger;
const rankings = computed(() => atlas.value.rankings[mode.value] || []);
function reset() {
  filter.value = '';
  selected.value = null;
}
watch(() => props.result, () => {
  reset();
  mode.value = atlas.value.rows.length && atlas.value.rows.every(row => row.legacy) ? 'legacy' : 'confirmed';
}, { immediate: true });
async function open() {
  if (dialog.value?.open) return;
  trigger.value = document.activeElement;
  active.value = true;
  filtersOpen.value = false;
  await nextTick();
  dialog.value?.showModal();
}
function close() {
  dialog.value?.close();
  active.value = false;
  selected.value = null;
  trigger.value?.focus({ preventScroll: true });
}
function dismiss() {
  if (selected.value) closeEvidence();
  else if (!relations.value?.dismissDetails?.()) close();
}
watch(filter, () => { selected.value = null; });
async function select(row, algorithm, purpose, opener) {
  if (!evidence.value?.contains(document.activeElement)) evidenceTrigger = opener || document.activeElement;
  selected.value = { row, algorithm, purpose };
  await nextTick();
  evidence.value?.focus();
}
async function closeEvidence() {
  selected.value = null;
  await nextTick();
  evidenceTrigger?.focus({ preventScroll: true });
}
function download() {
  const url = URL.createObjectURL(new Blob([inventoryMarkdown(atlas.value)], { type: 'text/markdown;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = inventoryFilename(props.result.scanned_at);
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>
<template>
  <div class="atlas-preview">
    <div class="preview-summary">
      <p>{{ batchScope(atlas) }}</p>
    </div>
    <GraphPreview label="打开仓库关系图" @open="open" />
  </div>
  <Teleport to="body">
    <dialog ref="dialog" class="graph-dialog atlas-dialog"
      :aria-labelledby="titleId" @cancel.prevent="dismiss">
    <div ref="popupLayer" />
    <template v-if="active">
      <header class="atlas-header">
        <h2 :id="titleId">仓库算法与用途关系图</h2>
        <div class="segmented-group" role="group" aria-label="仓库关系图类型">
          <button class="button secondary compact" :aria-pressed="!overview" @click="overview=false">边捆绑图</button>
          <button class="button secondary compact" :aria-pressed="overview" @click="overview=true">二维全景图</button>
        </div>
        <div class="atlas-actions">
          <button class="button secondary compact" :aria-expanded="filtersOpen" @click="filtersOpen=!filtersOpen">{{ filter || relations?.filtered ? '筛选中' : '筛选' }}</button>
          <GraphExportMenu :key="overview" :export-view="format => relations?.download(format)" :export-list="download" :disabled="!relations?.canExport" />
          <button class="button secondary compact" autofocus @click="close">关闭</button>
        </div>
      </header>
      <div class="atlas-body" role="region" aria-label="关系图与扫描范围" tabindex="0">
        <RepositoryGraphRelations ref="relations" :rows="atlas.rows" :evidence-open="Boolean(selected)" :evidence-panel="evidence" :overview="overview"
          :rankings="rankings" :status="mode" :filter="filter" :filters-open="filtersOpen" :popup-target="popupLayer"
          :stamp="formatTime(result.scanned_at)+'（北京时间）'" @filter="filter=$event" @select="select" @clear-evidence="selected=null">
          <template #scope>{{ batchScope(atlas) }}（{{ label(mode) }}）</template>
          <template #help>
            <InfoTip label="图形操作与扫描范围" :popup-target="popupLayer">
              <p v-if="overview">点击类别展开仓库，拖动节点调整位置。</p>
              <p>点击连线查看证据。滚轮缩放，拖动画布平移。</p>
              <p>完整核验：所有候选文件完成扫描和适用的跨文件核验。</p>
            </InfoTip>
          </template>
          <template #evidence>
            <aside v-if="selected" ref="evidence" class="graph-detail-overlay atlas-evidence-hud" aria-label="仓库关系证据" tabindex="-1" @keydown.esc.stop.prevent="closeEvidence">
              <button class="button secondary compact close-evidence" @click="closeEvidence">收起证据</button>
              <AtlasEvidence :row="selected.row" :algorithm="selected.algorithm" :purpose="selected.purpose"
                :status="mode" :task-id="result.task_id" />
            </aside>
          </template>
        </RepositoryGraphRelations>
        <details v-if="atlas.failures.length" class="atlas-failures">
          <summary>失败或未完成仓库（{{ atlas.failed }}）</summary>
          <p v-for="f in atlas.failures" :key="f.full_name">{{ f.full_name }}：{{ f.error }}</p>
        </details>
      </div>
    </template>
    </dialog>
  </Teleport>
</template>
<style scoped>
.atlas-actions,.preview-summary { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.preview-summary { justify-content:space-between; }
.atlas-header { display:grid; grid-template-columns:auto minmax(0,1fr) auto; align-items:center; gap:5px 10px; }
.atlas-header .atlas-actions { align-self:start; justify-content:flex-end; }
.atlas-dialog[open] { gap:4px; }
.atlas-body { flex:1; display:flex; flex-direction:column; gap:8px; min-height:0; overflow:auto; overscroll-behavior:contain; }
.atlas-preview { display:flex; flex:1; flex-direction:column; gap:8px; min-height:0; }
.atlas-preview :deep(.graph-preview) { min-height:120px; }
.preview-summary p { margin:0; color:var(--text-secondary); font-size:13px; }
.atlas-dialog h2 { margin:0; font-size:18px; }
.atlas-failures { flex-shrink:0; max-height:110px; overflow:auto; font-size:13px; overflow-wrap:anywhere; }
.atlas-failures summary { cursor:pointer; }
.close-evidence { margin-bottom:8px; }
@media(max-width:760px) {
  .atlas-header { grid-template-columns:minmax(0,1fr) auto; }
  .atlas-header > .segmented-group { grid-row:2; grid-column:1/-1; }
  .atlas-actions { grid-row:1; grid-column:2; }
  .atlas-dialog h2 { font-size:16px; }
}
@media(max-width:520px) {
  .atlas-header .atlas-actions { flex-wrap:nowrap; }
  .atlas-header .button { padding-inline:7px; }
}
@media(max-height:540px) and (orientation:landscape) {
  .atlas-dialog { padding:8px; }
  .atlas-header { gap:4px 8px; }
  .atlas-evidence-hud :deep(.findings-list) { height:auto; overflow:visible; }
}
</style>
