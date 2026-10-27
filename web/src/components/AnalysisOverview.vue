<script setup>
import { computed, defineAsyncComponent, ref } from 'vue';
import AnalysisVisualization from './AnalysisVisualization.vue';
import { conciseInsights } from '../utils/presentation.js';
import AnalysisPriorities from './AnalysisPriorities.vue';
const FileTreemap=defineAsyncComponent(()=>import('./FileTreemap.vue'));
const view=ref('algorithms');
const props = defineProps({ result: Object });
defineEmits(['select']);
const conclusions = computed(() => conciseInsights(props.result));
</script>
<template>
  <div class="overview-grid">
    <section v-if="conclusions.length" class="analysis-card interpretation" aria-label="关键结论">
      <h3 class="sr-only">关键结论</h3>
      <div v-for="item in conclusions" :key="item.title" class="conclusion">
        <span class="small muted">{{ item.title }}</span>
        <strong :title="item.value">{{ item.value }}</strong>
        <button v-if="item.filter" class="button text-action compact" @click="$emit('select',item.filter)">{{ item.detail }}</button><span v-else>{{ item.detail }}</span>
      </div>
    </section>
    <div class="overview-switch segmented-group"><button class="button secondary compact" :aria-pressed="view==='algorithms'" @click="view='algorithms'">算法与用途</button><button class="button secondary compact" :aria-pressed="view==='files'" @click="view='files'">文件与处置</button></div>
    <AnalysisVisualization :class="{'short-hidden':view!=='algorithms'}" :result="result" @select="$emit('select',$event)" />
    <div class="overview-secondary" :class="{'short-hidden':view!=='files'}"><FileTreemap :result="result" @select="$emit('select',$event)" /><AnalysisPriorities :result="result" @select="$emit('select',$event)" /></div>
    <p v-if="!result.analysis" class="notice">
      此历史结果未记录资产分析，仍可查看原始发现；重新扫描可生成完整概览。
    </p>
  </div>
</template>
<style scoped>
.interpretation {
  padding: 4px 12px;
  background: var(--accent-soft);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  grid-column: 1 / -1;
}
.overview-grid { display: flex;flex-direction:column;min-height:0;gap:12px;flex:1 !important; }
.overview-grid > .analysis-visuals,.overview-secondary { flex:1;min-height:0; }.overview-secondary { display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:12px; }.overview-switch { display:none; }
.overview-grid :deep(.evidence-bars) { padding: 6px 8px; }
.overview-grid :deep(.evidence-bars.stack) { gap: 2px; }
.overview-grid :deep(.evidence-bar:not(.actionable)) { padding: 2px 6px; min-height: 28px; }
.overview-grid :deep(.disclosure-body) { margin-top: 4px; }
.overview-grid > .notice { grid-column: 1 / -1; }
.overview-grid > .small { grid-column: 1 / -1; }
.conclusion {
  display: flex;flex-direction:column;text-align:center;align-items:center;justify-content:center;
  gap: 2px;min-width:0;padding:4px;
  overflow-wrap: anywhere;
}
.conclusion strong { font-size:20px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }.conclusion > span { font-size:14px; }.conclusion > :last-child { font-size:14px;min-height:24px; }
@media(min-width:1024px) and (max-height:850px) { .overview-switch { display:flex;gap:8px; }.short-hidden { display:none !important; } }
@container results (max-width: 700px) {
  .overview-secondary, .interpretation { grid-template-columns: minmax(0, 1fr); }
}
</style>
