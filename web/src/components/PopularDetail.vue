<script setup>
import CoverageNotice from './CoverageNotice.vue';
import FindingCard from './FindingCard.vue';
import { findingKey } from '../utils/results.js';
defineProps({ repo: Object });
</script>

<template>
  <section v-if="repo" class="panel stack">
    <h2>{{ repo.full_name }}</h2>
    <p class="muted small">
      迁移评分 {{ repo.migration_score }}/100 · {{ repo.finding_count }} 项发现 · 启发式优先级
    </p>
    <CoverageNotice :coverage="repo.coverage" :diagnostics="repo.diagnostics" />
    <p
      v-if="repo.details_truncated || repo.finding_count > (repo.findings || []).length"
      class="notice"
    >
      已显示前 {{ (repo.findings || []).length }} 项详情，共 {{ repo.finding_count }} 项发现。使用
      GitHub 仓库扫描可查看所采集文件的完整结果。
    </p>
    <p v-if="!repo.findings?.length" class="notice">已扫描文件中未发现已知传统公钥算法用法。</p>
    <FindingCard
      v-for="finding in repo.findings || []"
      :key="findingKey(finding)"
      :finding="finding"
    />
  </section>
  <section v-else class="panel empty">
    <h2>仓库详情</h2>
    <p>选择左侧仓库，查看发现及扫描范围。</p>
  </section>
</template>
