<script setup>
import { computed, nextTick, ref, provide } from 'vue';
import { useResultSelection } from '../composables/useResultSelection.js';
import { useSourceContent } from '../composables/useSourceContent.js';
import AiActions from './AiActions.vue';
import CoverageNotice from './CoverageNotice.vue';
import ScanSummary from './ScanSummary.vue';
import ResultHelp from './ResultHelp.vue';
import ResultHeader from './ResultHeader.vue';
import ResultTabs from './ResultTabs.vue';
import FindingsList from './FindingsList.vue';
import EvidenceGraph from './EvidenceGraph.vue';
import AnalysisOverview from './AnalysisOverview.vue';
import AssetInventory from './AssetInventory.vue';
import MigrationChecklist from './MigrationChecklist.vue';
const props = defineProps({ result: Object, state: Object, input: Object, presented: { type: Boolean, default: true } });
defineEmits(['toggle-input', 'rescan']);
const result = computed(() => props.result.integrated_analysis ? { ...props.result,
  findings: props.result.integrated_analysis.findings, summary: props.result.integrated_analysis.summary,
  analysis: props.result.integrated_analysis.analysis } : props.result);
const deepIncomplete=computed(()=>['partial','failed','cancelled'].includes(result.value.deep_analysis?.status));
const scopeDiagnostics=computed(()=>[...(result.value.diagnostics || []),...(deepIncomplete.value?result.value.deep_analysis.diagnostics || []:[])]);
const loadSource = useSourceContent(result);
const body = ref(null);
const header = ref(null);
const { tab, filters, findings, assetFindings, selectedKey, visited, origin, announcement,
  reset, select, reveal, back, switchTab, updateFilters, keepFocusVisible } = useResultSelection(result, { body, header });
const assistedSource = ref('');
provide('assistedResult', result);
async function clearFilters() {
  reset();
  await nextTick();
  (body.value?.querySelector('.select-trigger') || body.value)?.focus({ preventScroll: true });
}
</script>
<template>
  <div class="result-layout">
    <Teleport to="#result-view-navigation"><ResultTabs v-if="presented" :tab="tab" @select="switchTab" /></Teleport>
    <p class="sr-only" role="status">本次分析已结束，共 {{ result.summary.finding_count }} 项{{ result.integrated_analysis ? '确认风险' : '规则发现' }}。</p>
    <div ref="header" class="result-sticky">
      <ResultHeader :result="result" :tab="tab" :filters="filters" :origin="origin"
        :announcement="announcement" :state="state" :input="input" @back="back" @reset="clearFilters"
        @toggle-input="$emit('toggle-input')" @rescan="$emit('rescan')" />
    </div>
    <AiActions :result="result" :state="state" @pending="switchTab('findings'); updateFilters({status:'pending'})" />
    <div class="result-summary">
      <ScanSummary :summary="result.summary" :integrated="!!result.integrated_analysis" compact />
      <ResultHelp :score="result.summary.migration_score" :coverage="result.coverage" />
    </div>
    <div v-if="!result.coverage || result.coverage.partial || scopeDiagnostics.length || deepIncomplete" class="result-coverage">
      <p v-if="deepIncomplete" class="deep-status" role="status">跨文件核验未全部完成，已保留 {{ result.deep_analysis.operations?.length || 0 }} 项完整操作；规则发现仍可查看。</p>
      <CoverageNotice :coverage="result.coverage" :diagnostics="scopeDiagnostics" compact />
    </div>
    <div id="result-panel" ref="body" class="panel-body stack" role="tabpanel" tabindex="0"
      :class="{ 'is-findings': tab === 'findings', 'is-overview': tab === 'overview', 'is-paged': ['assets', 'migration', 'graph'].includes(tab),
        'workspace-surface': ['overview', 'assets', 'migration'].includes(tab) }"
      :aria-labelledby="`tab-${tab}`" @focusin="keepFocusVisible">
      <AnalysisOverview v-if="visited.has('overview')" v-show="tab === 'overview'"
        class="result-view" :class="{ 'view-active': tab === 'overview' }" :result="result" @select="select" />
      <EvidenceGraph v-if="visited.has('graph')" v-show="tab === 'graph'" class="result-view"
        :class="{ 'view-active': tab === 'graph' }" :assets="result.analysis?.assets || []"
        :available="!!result.analysis" :active="tab === 'graph'" :result="result" :load-source="loadSource" @select="select({ method: '', ...$event })" />
      <AssetInventory v-if="visited.has('assets')" v-show="tab === 'assets'"
        class="result-view" :class="{ 'view-active': tab === 'assets' }"
        :analysis="result.analysis" :findings="assetFindings" :active="tab==='assets' && presented" @reveal="reveal" />
      <FindingsList v-if="visited.has('findings')" v-show="tab === 'findings'"
        class="result-view" :class="{ 'view-active': tab === 'findings' }"
        :findings="result.findings" :sources="result.sources" :filters="filters" :matching="findings"
        :selected-key="selectedKey" :load-source="loadSource" :active="tab === 'findings'" @update:filters="updateFilters" />
      <MigrationChecklist v-if="visited.has('migration')" v-show="tab === 'migration'"
        class="result-view" :class="{ 'view-active': tab === 'migration' }" :analysis="result.analysis"
        :active="tab === 'migration'" @select="select" />
    </div>
  </div>
</template>
<style scoped>
.result-layout { background: var(--bg-surface); border-radius: var(--radius-lg); }
.result-summary { display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 4px var(--workspace-gutter); min-height: 36px; background: var(--bg-elevated); }
.result-coverage { padding: 0 var(--workspace-gutter); flex-shrink: 0;
  max-height: 25dvh; overflow-y: auto; background: var(--bg-surface); }
.result-summary > :first-child { flex: 1; }
.deep-status { font-size:14px;padding-block:4px;color:var(--text-secondary); }
.panel-body { background: transparent; padding: 16px var(--workspace-gutter); }
.panel-body.is-overview { padding-block: 12px; }
.panel-body.is-findings { padding: 0; overflow: hidden; gap: 0; }
.panel-body.is-findings > .findings-list { flex: 1; min-height: 0; }
@media (min-width: 1024px) and (min-height: 600px) {
  .panel-body.is-paged { overflow: hidden; }
  .panel-body.is-paged > .result-view { flex: 1; min-height: 0; }
}
@media (max-width: 600px) {
  .result-summary { align-items: flex-start; flex-wrap: wrap; padding-block: 4px; }
}
</style>
