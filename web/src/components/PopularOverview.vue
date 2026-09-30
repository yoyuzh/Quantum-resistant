<script setup>
import { computed } from 'vue';
import EvidenceBars from './EvidenceBars.vue';
const props = defineProps({ result: Object });
defineEmits(['select']);
const rows = computed(() =>
  (props.result?.repos || [])
    .map((r) => ({ key: r.full_name, label: r.full_name, count: r.finding_count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key)),
);
const partial = computed(
  () => (props.result?.repos || []).filter((r) => r.coverage?.partial).length,
);
const total = computed(() => rows.value.reduce((sum, row) => sum + row.count, 0));
</script>
<template>
  <details class="popular-overview">
    <summary>本次批次概览 · {{ rows.length }} 个可用仓库</summary>
    <p class="small muted">
      范围内完整采集 {{ rows.length - partial }} 个 · 部分采集 {{ partial }} 个 · 失败/未完成
      {{ result.failures?.length || 0 }} 个
    </p>
    <EvidenceBars
      title="仓库发现数对比"
      :rows="rows"
      :total="total"
      interactive
      @select="$emit('select', $event.key)"
    />
    <p class="small muted">
      按各仓库汇总数对比，不从截断的代表性发现推算完整资产。采集范围不同，不宜据此比较整个仓库的安全性。
    </p>
  </details>
</template>
<style scoped>
summary {
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--accent);
}
.popular-overview {
  padding: 1rem;
  background: var(--bg-elevated);
  border-radius: var(--radius);
}
p {
  margin: 0.75rem 0;
}
</style>
