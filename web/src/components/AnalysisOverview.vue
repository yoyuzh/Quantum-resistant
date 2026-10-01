<script setup>
import { computed } from 'vue';
import EvidenceGraph from './EvidenceGraph.vue';
import EvidenceBars from './EvidenceBars.vue';
import DisclosurePanel from './DisclosurePanel.vue';
import { conciseInsights } from '../utils/presentation.js';
const props = defineProps({ result: Object });
const emit = defineEmits(['select']);
const insights = computed(() => props.result.analysis?.insights);
const conclusions = computed(() => conciseInsights(props.result));
const algorithms = computed(
  () =>
    insights.value?.algorithms ||
    Object.entries(props.result.summary.algorithm_counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([key, count]) => ({ key, label: key, count })),
);
function select(field, value) {
  emit('select', { sourceId: '', algorithm: '', target: '', method: '', [field]: value });
}
</script>
<template>
  <div class="stack">
    <p v-if="!result.findings.length" class="notice">本次未命中已知传统公钥算法。</p>
    <section v-if="conclusions.length" class="analysis-card interpretation stack" aria-label="关键结论">
      <h3>关键结论</h3>
      <div v-for="item in conclusions" :key="item.title" class="conclusion">
        <span class="small muted">{{ item.title }}</span>
        <strong>{{ item.value }}</strong>
        <span class="small">{{ item.detail }}</span>
      </div>
    </section>
    <template v-if="result.findings.length">
      <EvidenceBars
        title="算法命中分布"
        :rows="algorithms"
        :total="result.findings.length"
        interactive
        @select="select('algorithm', $event.key)"
      />
      <template v-if="insights">
        <EvidenceBars
          title="受影响文件 Top 8"
          :rows="insights.files"
          :peers="result.sources"
          :total="result.findings.length"
          interactive
          @select="select('sourceId', $event.key)"
        />
        <p v-if="insights.other_files > 0" class="small muted">
          其余 {{ insights.other_files }} 个命中文件，共
          {{ insights.other_findings }} 项发现。
        </p>
        <EvidenceBars
          title="迁移用途分类"
          :rows="insights.purposes"
          :total="result.findings.length"
        />
        <DisclosurePanel title="识别依据">
          <EvidenceBars title="识别方式分布" :rows="insights.methods" interactive @select="select('method', $event.key)" />
        </DisclosurePanel>
      </template>
      <EvidenceGraph
        v-if="result.analysis"
        :assets="result.analysis.assets"
        @select="$emit('select', { method: '', ...$event })"
      />
    </template>
    <p v-if="!result.analysis" class="notice">
      此历史结果未记录资产分析，仍可查看原始发现；重新扫描可生成完整概览。
    </p>
  </div>
</template>
<style scoped>
.interpretation {
  background: var(--accent-soft);
}
.conclusion {
  display: grid;
  grid-template-columns: 5.5rem minmax(0, 1fr);
  gap: 0.1rem 0.75rem;
  overflow-wrap: anywhere;
}
.conclusion > :last-child {
  grid-column: 2;
}
</style>
