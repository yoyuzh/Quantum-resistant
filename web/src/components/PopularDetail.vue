<script setup>
import CoverageNotice from './CoverageNotice.vue';
import FindingCard from './FindingCard.vue';
import { findingKey } from '../utils/results.js';
import ResultHelp from './ResultHelp.vue';
defineProps({ repo: Object });
defineEmits(['scan-repository']);
</script>

<template>
  <section v-if="repo" class="panel popular-detail">
    <div class="panel-heading">
      <h2>{{ repo.full_name }}</h2>
      <p>
        <strong>{{ repo.finding_count }} 项发现</strong> · 迁移评分 {{ repo.migration_score }}/100
      </p>
    </div>
    <div class="panel-body stack" role="region" tabindex="0" aria-label="仓库扫描详情">
      <CoverageNotice :coverage="repo.coverage" :diagnostics="repo.diagnostics" />
      <div
        v-if="repo.details_truncated || repo.finding_count > (repo.findings || []).length"
        class="notice"
      >
        显示 {{ (repo.findings || []).length }} / {{ repo.finding_count }} 项详情。
        <button class="button secondary" @click="$emit('scan-repository', `https://github.com/${repo.full_name}`)">完整扫描此仓库</button>
      </div>
      <p v-if="!repo.findings?.length" class="notice">已扫描文件中未发现已知传统公钥算法用法。</p>
      <FindingCard
        v-for="finding in repo.findings || []"
        :key="findingKey(finding)"
        :finding="finding"
        :identity-peers="repo.findings"
      />
      <ResultHelp />
    </div>
  </section>
  <section v-else class="panel empty">
    <h2>仓库详情</h2>
    <p>选择左侧仓库，查看发现及扫描范围。</p>
  </section>
</template>
