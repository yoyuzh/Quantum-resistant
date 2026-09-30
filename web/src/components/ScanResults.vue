<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { formatTime } from '../utils/results.js';
import { useResultSelection } from '../composables/useResultSelection.js';
import CoverageNotice from './CoverageNotice.vue';
import ScanSummary from './ScanSummary.vue';
import FindingsList from './FindingsList.vue';
import KnowledgePanel from './KnowledgePanel.vue';
import AnalysisOverview from './AnalysisOverview.vue';
import AssetInventory from './AssetInventory.vue';
import MigrationChecklist from './MigrationChecklist.vue';
import ExportMenu from './ExportMenu.vue';
import AppIcon from './AppIcon.vue';
const props = defineProps({ result: Object });
const body = ref(null);
const { tab, filters, findings, selectedKey, reset, select, reveal } = useResultSelection(
  computed(() => props.result),
);
const tabs = [
  ['overview', '分析概览', 'graph'],
  ['assets', '资产清单', 'file'],
  ['findings', '发现明细', 'code'],
  ['migration', '迁移待办', 'list'],
];
const hasFilters = computed(() => Object.values(filters).some(Boolean));
watch(tab, () => body.value?.scrollTo({ top: 0 }), { flush: 'post' });
async function selectEvidence(value) {
  select({ query: '', ...value });
  await nextTick();
  body.value?.focus({ preventScroll: true });
}
async function revealEvidence(asset, location) {
  reveal(asset, location);
  await nextTick();
  body.value?.focus({ preventScroll: true });
}
function tabKeys(event, index) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const next =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? tabs.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  tab.value = tabs[next][0];
  event.currentTarget.parentElement.children[next].focus();
}
</script>

<template>
  <div class="result-layout">
    <p class="sr-only" role="status">扫描完成，共 {{ result.summary.finding_count }} 项发现。</p>
    <div class="panel-heading">
      <div class="result-heading">
        <div>
          <p class="eyebrow">扫描已完成</p>
          <h2>密码资产与迁移分析</h2>
          <p class="small muted">{{ formatTime(result.scanned_at) }} · 北京时间</p>
        </div>
        <ExportMenu :result="result" />
      </div>
      <div class="result-tabs" role="tablist" aria-label="分析视图">
        <button
          v-for="([value, label, icon], index) in tabs"
          :id="`tab-${value}`"
          :key="value"
          class="button"
          :class="{ active: tab === value }"
          role="tab"
          :aria-selected="tab === value"
          aria-controls="result-panel"
          :tabindex="tab === value ? 0 : -1"
          @click="tab = value"
          @keydown="tabKeys($event, index)"
        >
          <AppIcon :name="icon" :size="17" />{{ label }}
        </button>
      </div>
    </div>
    <div
      id="result-panel"
      ref="body"
      class="panel-body stack"
      role="tabpanel"
      tabindex="0"
      :aria-labelledby="`tab-${tab}`"
    >
      <ScanSummary :summary="result.summary" />
      <CoverageNotice :coverage="result.coverage" :diagnostics="result.diagnostics" />
      <div
        v-if="hasFilters && (tab === 'assets' || tab === 'findings')"
        class="filter-notice toolbar"
      >
        <span class="small"
          >当前筛选：{{ filters.algorithm || '全部算法'
          }}{{ filters.sourceId ? ' · ' + filters.sourceId : ''
          }}{{ filters.target ? ' · ' + filters.target : ''
          }}{{ filters.query ? ' · ' + filters.query : '' }}</span
        >
        <button class="button secondary" @click="reset">
          <AppIcon name="close" :size="14" />清除筛选
        </button>
      </div>
      <AnalysisOverview v-if="tab === 'overview'" :result="result" @select="selectEvidence" />
      <AssetInventory
        v-else-if="tab === 'assets'"
        :analysis="result.analysis"
        :findings="findings"
        @reveal="revealEvidence"
      />
      <FindingsList
        v-else-if="tab === 'findings'"
        :findings="result.findings"
        :sources="result.sources"
        :filters="filters"
        :matching="findings"
        :selected-key="selectedKey"
        @update:filters="Object.assign(filters, $event)"
      />
      <MigrationChecklist v-else :analysis="result.analysis" @select="selectEvidence" />
      <KnowledgePanel v-if="tab === 'overview' || tab === 'migration'" />
    </div>
  </div>
</template>

<style scoped>
.result-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.7rem;
}
.filter-notice {
  background: var(--accent-soft);
  padding: 0.5rem 0.7rem;
  border-radius: var(--radius);
  justify-content: space-between;
  overflow-wrap: anywhere;
}
</style>
