<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { batchScope, label, repositoryAtlas } from '../utils/repositoryAtlas.js';
import { inventoryFilename, inventoryMarkdown } from '../utils/repositoryInventory.js';
import { categoryScale, repositoryCategories } from '../utils/repositoryCategories.js';
import { formatTime } from '../utils/results.js';
import RepositoryRelations from './RepositoryRelations.vue';
import AtlasEvidence from './AtlasEvidence.vue';

const props = defineProps({ result: Object, inline: Boolean });
const atlas = computed(() => repositoryAtlas(props.result));
const dialog = ref(null);
const trigger = ref(null);
const active = ref(false);
const mode = ref('confirmed');
const filter = ref('');
const selected = ref(null);
const evidence = ref(null);
let evidenceTrigger;
const rankings = computed(() => atlas.value.rankings[mode.value] || []);
const rows = computed(() => atlas.value.rows.filter(row => !filter.value || row.count(filter.value, mode.value) > 0));
const groups = computed(() => repositoryCategories(atlas.value.rows));
const scaleMax = computed(() => categoryScale(groups.value, mode.value));
function reset() {
  filter.value = '';
  selected.value = null;
}
watch(() => props.result, () => {
  reset();
  mode.value = atlas.value.rows.length && atlas.value.rows.every(row => row.legacy) ? 'legacy' : 'confirmed';
}, { immediate: true });
function open() {
  active.value = true;
  dialog.value.showModal();
}
function close() {
  active.value = false;
  selected.value = null;
  trigger.value?.focus();
}
function chooseMode(value) {
  mode.value = value;
  reset();
}
watch(filter, () => { selected.value = null; });
async function select(row, algorithm) {
  if (!evidence.value?.contains(document.activeElement)) evidenceTrigger = document.activeElement;
  selected.value = { row, algorithm };
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
  <div v-if="!inline" class="atlas-actions">
    <button ref="trigger" class="button secondary compact" @click="open">多仓库算法全景图</button>
    <button class="button text-action compact" @click="download">导出批次清单</button>
  </div>
  <component :is="inline ? 'section' : 'dialog'" ref="dialog" :class="inline ? 'atlas-inline' : 'atlas-dialog'" aria-labelledby="atlas-title" @close="close">
    <template v-if="active || inline">
      <header class="atlas-header">
        <div><h2 id="atlas-title">多仓库密码算法全景图</h2>
          <p>{{ batchScope(atlas) }} <strong v-if="result.meta?.incomplete"> · 本批未完整结束</strong></p></div>
        <div class="atlas-actions"><slot name="actions" /><button class="button secondary compact" @click="download">{{ inline ? '导出清单' : '导出批次清单' }}</button>
          <button v-if="!inline" class="button secondary compact" @click="dialog.close()">关闭</button></div>
        <div class="atlas-filters"><div class="atlas-actions" role="group" aria-label="判断来源">
        <button v-for="s in atlas.modes" :key="s" class="button secondary compact" :aria-pressed="s === mode" @click="chooseMode(s)">{{ label(s) }}</button>
        </div>
        </div>
      </header>
      <div class="atlas-scene">
        <RepositoryRelations :rows="rows" :rankings="rankings" :scale-max="scaleMax" :status="mode" :filter="filter" :evidence-open="Boolean(selected)"
          :stamp="formatTime(result.scanned_at)+'（北京时间）'" @filter="filter=$event" @select="select" @clear-evidence="selected=null">
          <template #evidence="{ fullscreen }">
            <aside v-if="selected" ref="evidence" class="atlas-evidence-hud" :class="{ 'fullscreen-evidence': fullscreen }" aria-label="仓库关系证据" tabindex="-1" @keydown.esc.stop.prevent="closeEvidence">
              <button class="button secondary compact close-evidence" @click="closeEvidence">收起证据</button>
              <AtlasEvidence :row="selected.row" :algorithm="selected.algorithm" :status="mode" :task-id="result.task_id" />
            </aside>
          </template>
        </RepositoryRelations>
      </div>
      <details class="scope-note"><summary>扫描时间与样本范围</summary>
        <p>{{ formatTime(result.scanned_at) }}（北京时间） · {{ result.meta?.query || '样本条件未知' }}</p>
      </details>
      <details v-if="atlas.failures.length"><summary>失败或未完成仓库（{{ atlas.failed }}）</summary>
        <p v-for="f in atlas.failures" :key="f.full_name">{{ f.full_name }} · {{ f.error }}</p></details>
    </template>
  </component>
</template>
<style scoped>
.atlas-actions,.atlas-header,.title { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.atlas-header,.title { justify-content:space-between; }
.atlas-dialog { box-sizing:border-box; width:min(1100px,96vw); max-height:90dvh; margin:auto; padding:clamp(14px,3vw,30px);
  background:var(--bg-surface); color:var(--text-primary); border:1px solid var(--border); border-radius:var(--radius); }
.atlas-inline { padding:clamp(12px,2.5vw,32px); background:var(--bg-surface); }
.atlas-dialog::backdrop { background:rgb(10 17 30 / 55%); }
.atlas-dialog h2,.atlas-dialog h3 { margin:0; }
.atlas-header { margin-bottom:12px; }
.atlas-header p { margin:4px 0; color:var(--text-secondary); }
.scope-note { margin-block:12px; font-size:13px; color:var(--text-secondary); }
.scope-note summary { cursor:pointer; }
.atlas-filters { flex-basis:100%; display:flex; align-items:center; flex-wrap:wrap; }
button[aria-pressed=true] { box-shadow:inset 0 0 0 2px var(--accent); }
.atlas-inline h2 { margin:0; font-size:clamp(21px,2.2vw,32px); }
.atlas-scene { position:relative; }
.atlas-evidence-hud { position:absolute; z-index:3; right:12px; top:105px; width:min(460px,46%); max-height:min(58dvh,calc(100% - 120px));
  overflow:auto; overscroll-behavior:contain; border:1px solid var(--border); padding:12px; border-radius:var(--radius-lg);
  background:color-mix(in srgb,var(--bg-surface) 94%,transparent); backdrop-filter:blur(12px); box-shadow:var(--shadow-lg); }
.close-evidence { margin-bottom:8px; }
@media(max-width:700px) { .atlas-evidence-hud { top:auto; bottom:10px; left:8px; right:8px; width:auto; max-height:48dvh; } }
@media(max-width:600px) { .atlas-inline { padding:8px 2px; } .atlas-inline h2 { font-size:19px; } .atlas-header .button { padding-inline:7px; font-size:12px; } }
.atlas-evidence-hud.fullscreen-evidence { position:fixed; inset:auto 12px 12px; margin-inline-start:auto; max-height:55dvh; }
@media(min-width:650px) and (orientation:landscape) {
  .atlas-evidence-hud.fullscreen-evidence { position:static; margin:0; width:auto; max-height:calc(100dvh - 112px); }
}
@media(max-height:540px) and (orientation:landscape) {
  .atlas-inline { padding:6px 2px; }
  .atlas-inline h2 { font-size:16px; line-height:1.15; }
  .atlas-header { margin-bottom:4px; gap:4px 8px; }
  .atlas-header p { margin-block:2px; font-size:12px; line-height:1.3; }
  .atlas-header .button { padding-inline:7px; font-size:12px; }
  .atlas-filters { flex-basis:auto; }
  .atlas-filters .atlas-actions { gap:4px; }
  .atlas-evidence-hud.fullscreen-evidence { max-height:calc(100dvh - 70px); }
  .atlas-evidence-hud :deep(.findings-list) { height:auto; overflow:visible; }
}
</style>
