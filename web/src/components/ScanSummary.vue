<script setup>
defineProps({ summary: Object });
</script>

<template>
  <div class="metrics">
    <div>
      <span>扫描文件</span><strong>{{ summary.source_count }}</strong>
    </div>
    <div>
      <span>风险发现</span><strong>{{ summary.finding_count }}</strong>
    </div>
    <div>
      <span>算法种类</span><strong>{{ Object.keys(summary.algorithm_counts).length }}</strong>
    </div>
    <div>
      <span>迁移评分</span
      ><strong :class="{ danger: summary.migration_score.score >= 40 }"
        >{{ summary.migration_score.score }}<small>/100</small></strong
      >
    </div>
  </div>
  <p class="muted small">
    {{ summary.migration_score.priority }} · 启发式优先级：高风险项 × 25 + 受影响文件 × 10 +
    算法种类 × 10，上限 100；不代表风险概率。
  </p>
</template>

<style scoped>
.metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.7rem;
}
.metrics div {
  padding: 1rem 0.7rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-light);
  border-radius: var(--radius);
}
span {
  display: block;
  font-size: 0.75rem;
  color: var(--text-secondary);
}
strong {
  display: block;
  font-size: 1.9rem;
  font-weight: 600;
  margin-top: 0.4rem;
}
small {
  font-size: 0.75rem;
  color: var(--text-secondary);
}
.danger {
  color: var(--danger);
}
@media (max-width: 600px) {
  .metrics {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
