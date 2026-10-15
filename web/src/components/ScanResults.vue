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
const props = defineProps({ result: Object });
const result = computed(() => props.result);
const loadSource = useSourceContent(result);
const body = ref(null);
const header = ref(null);
const { tab, filters, findings, assetFindings, selectedKey, visited, origin, announcement,
  reset, select, reveal, back, switchTab, updateFilters, keepFocusVisible } = useResultSelection(result, { body, header });
</script>
<template>
  <div class="result-layout">
    <p class="sr-only" role="status">分析结束，共 {{ result.summary.finding_count }} 项发现。</p>
    <div ref="header" class="result-sticky">
      <ResultHeader :result="result" :tab="tab" :filters="filters" :origin="origin"
        :announcement="announcement" @select-tab="switchTab" @back="back" @reset="reset" />
    </div>
    <div id="result-panel" ref="body" class="panel-body stack" role="tabpanel" tabindex="0"
      :aria-labelledby="`tab-${tab}`" @focusin="keepFocusVisible">
      <ScanSummary :summary="result.summary" :compact="tab !== 'overview'" />
      <CoverageNotice :coverage="result.coverage" :diagnostics="result.diagnostics" :compact="tab !== 'overview'" />
      <AnalysisOverview v-if="visited.has('overview')" v-show="tab === 'overview'"
        class="result-view" :class="{ 'view-active': tab === 'overview' }" :result="result" @select="select" />
      <AssetInventory v-if="visited.has('assets')" v-show="tab === 'assets'"
        class="result-view" :class="{ 'view-active': tab === 'assets' }"
        :analysis="result.analysis" :findings="assetFindings" @reveal="reveal" />
      <FindingsList v-if="visited.has('findings')" v-show="tab === 'findings'"
        class="result-view" :class="{ 'view-active': tab === 'findings' }"
        :findings="result.findings" :sources="result.sources" :filters="filters" :matching="findings"
        :selected-key="selectedKey" :load-source="loadSource" @update:filters="updateFilters" />
      <MigrationChecklist v-if="visited.has('migration')" v-show="tab === 'migration'"
        class="result-view" :class="{ 'view-active': tab === 'migration' }" :analysis="result.analysis" @select="select" />
      <ResultHelp :score="result.summary.migration_score" />
      <KnowledgePanel v-if="tab === 'migration'" />
    </div>
  </div>
</template>
