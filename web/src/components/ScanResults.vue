<script setup>
import { computed, ref } from 'vue';
import { useResultSelection } from '../composables/useResultSelection.js';
import { useSourceContent } from '../composables/useSourceContent.js';
import CoverageNotice from './CoverageNotice.vue';
import ScanSummary from './ScanSummary.vue';
import ResultHelp from './ResultHelp.vue';
import ResultHeader from './ResultHeader.vue';
import FindingsList from './FindingsList.vue';
import KnowledgePanel from './KnowledgePanel.vue';
import AnalysisOverview from './AnalysisOverview.vue';
import AssetInventory from './AssetInventory.vue';
import MigrationChecklist from './MigrationChecklist.vue';
import AiAnalysisPanel from './AiAnalysisPanel.vue';
const props = defineProps({ result: Object, mode: String });
const emptyResult = { findings: [], sources: [] };
const result = computed(() => props.result || emptyResult);
const loadSource = useSourceContent(result);
const body = ref(null);
const header = ref(null);
const { tab, filters, findings, assetFindings, selectedKey, visited, origin, announcement,
  reset, select, reveal, back, switchTab, updateFilters, keepFocusVisible } = useResultSelection(result, { body, header });
</script>
<template>
  <div class="result-layout">
    <p v-if="props.result" class="sr-only" role="status">分析结束，共 {{ result.summary.finding_count }} 项发现。</p>
    <div ref="header" class="result-sticky">
      <ResultHeader :result="props.result" :tab="tab" :filters="filters" :origin="origin"
        :announcement="announcement" @select-tab="switchTab" @back="back" @reset="reset" />
    </div>
    <div id="result-panel" ref="body" class="panel-body stack" role="tabpanel" tabindex="0"
      :aria-labelledby="`tab-${tab}`" @focusin="keepFocusVisible">
      <slot v-if="!props.result && tab !== 'ai'" />
      <ScanSummary v-if="props.result && tab !== 'ai'" :summary="result.summary" :compact="tab !== 'overview'" />
      <CoverageNotice v-if="props.result && tab !== 'ai'" :coverage="result.coverage" :diagnostics="result.diagnostics" :compact="tab !== 'overview'" />
      <AnalysisOverview v-if="props.result && visited.has('overview')" v-show="tab === 'overview'"
        class="result-view" :class="{ 'view-active': tab === 'overview' }" :result="result" @select="select" />
      <AssetInventory v-if="props.result && visited.has('assets')" v-show="tab === 'assets'"
        class="result-view" :class="{ 'view-active': tab === 'assets' }"
        :analysis="result.analysis" :findings="assetFindings" @reveal="reveal" />
      <FindingsList v-if="props.result && visited.has('findings')" v-show="tab === 'findings'"
        class="result-view" :class="{ 'view-active': tab === 'findings' }"
        :findings="result.findings" :sources="result.sources" :filters="filters" :matching="findings"
        :selected-key="selectedKey" :load-source="loadSource" @update:filters="updateFilters" />
      <MigrationChecklist v-if="props.result && visited.has('migration')" v-show="tab === 'migration'"
        class="result-view" :class="{ 'view-active': tab === 'migration' }" :analysis="result.analysis" @select="select" />
      <AiAnalysisPanel v-show="tab === 'ai'" :source-task-id="props.result?.task_id" :mode="mode" :active="tab === 'ai'" />
      <ResultHelp v-if="props.result && tab !== 'ai'" :score="result.summary.migration_score" />
      <KnowledgePanel v-if="tab === 'migration'" />
    </div>
  </div>
</template>
