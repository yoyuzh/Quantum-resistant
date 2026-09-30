<script setup>
import { computed } from 'vue';
import EvidenceGraph from './EvidenceGraph.vue';
const props = defineProps({ result: Object });
defineEmits(['select']);
const counts = computed(() =>
  Object.entries(props.result.summary.algorithm_counts).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  ),
);
const max = computed(() => Math.max(1, ...counts.value.map((item) => item[1])));
</script>
<template>
  <div class="stack">
    <EvidenceGraph
      v-if="result.analysis"
      :assets="result.analysis.assets"
      @select="$emit('select', $event)"
    />
    <section class="stack" aria-label="全量算法分布">
      <h3>
        算法分布 <span class="small muted">全部 {{ result.summary.finding_count }} 项发现</span>
      </h3>
      <div class="distribution">
        <button
          v-for="[algorithm, count] in counts"
          :key="algorithm"
          class="distribution-row"
          :aria-label="`筛选 ${algorithm} 的 ${count} 项发现`"
          @click="$emit('select', { algorithm, sourceId: '', target: '' })"
        >
          <span>{{ algorithm }}</span
          ><span class="bar"><i :style="{ width: `${(count / max) * 100}%` }"></i></span
          ><strong>{{ count }}</strong>
        </button>
      </div>
      <p v-if="!counts.length" class="notice">
        本次输入中未发现已知传统公钥算法用法；请结合扫描范围判断。
      </p>
    </section>
    <p v-if="!result.analysis" class="notice">
      此历史结果未记录资产分析，仍可查看原始发现；重新扫描可生成证据关系图。
    </p>
  </div>
</template>
<style scoped>
.distribution {
  display: grid;
  gap: 0.4rem;
}
.distribution-row {
  display: grid;
  grid-template-columns: 85px 1fr 35px;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 0.8rem;
  border-radius: var(--radius);
  background: var(--bg-elevated);
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  font-size: 0.8rem;
}
.distribution-row:hover {
  background: var(--accent-soft);
}
.bar {
  height: 6px;
  background: var(--accent-soft);
  border-radius: 10px;
  overflow: hidden;
}
.bar i {
  display: block;
  height: 100%;
  background: var(--accent);
  border-radius: inherit;
  opacity: 0.7;
}
strong {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
