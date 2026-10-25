<script setup>
import CoverageNotice from './CoverageNotice.vue';
import FindingsList from './FindingsList.vue';
import ResultHelp from './ResultHelp.vue';
import AppIcon from './AppIcon.vue';
defineProps({ repo: Object });
defineEmits(['scan-repository', 'back']);
</script>

<template>
  <section v-if="repo" id="popular-detail" class="panel popular-detail">
    <div class="panel-heading">
      <button class="button text-action compact back-list" @click="$emit('back')">
        <AppIcon name="back" :size="16" />返回榜单
      </button>
      <h2 tabindex="-1">{{ repo.full_name }}</h2>
      <p>
        <strong>{{ repo.finding_count }} 项发现</strong> · 迁移评分 {{ repo.migration_score }}/100
      </p>
    </div>
    <div class="popular-coverage">
      <CoverageNotice :coverage="repo.coverage" :diagnostics="repo.diagnostics" compact />
    </div>
      <div
        v-if="repo.details_truncated || repo.finding_count > (repo.findings || []).length"
        class="notice"
      >
        显示 {{ (repo.findings || []).length }} / {{ repo.finding_count }} 项详情。
        <button class="button text-action" @click="$emit('scan-repository', `https://github.com/${repo.full_name}`)">完整扫描此仓库</button>
      </div>
      <FindingsList class="popular-findings" :findings="repo.findings || []" :identity-peers="repo.findings" hide-filters />
      <div class="popular-boundary"><ResultHelp /></div>
  </section>
  <section v-else class="panel empty">
    <h2>仓库详情</h2>
    <p>选择仓库后显示发现明细与扫描范围。</p>
  </section>
</template>
<style scoped>
.back-list { display: none; margin-bottom: 0.7rem; }
.popular-coverage { padding: 0 12px; max-height: 25dvh; overflow-y: auto; }
.popular-findings { flex: 1; min-height: 0; }
.popular-boundary { display: flex; justify-content: end; padding: 0 12px; }
.popular-boundary :deep(.help-popup) { top: auto; bottom: 100%; }
.notice { margin: 4px 12px; padding: 8px; font-size: 12px; }
.notice .button { margin: 0; min-height: 28px; }
@media (max-width: 1023px), (max-height: 599px) {
  .back-list { display: inline-flex; }
}
</style>
