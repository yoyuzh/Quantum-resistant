<script setup>
import { computed } from 'vue';
import EvidenceGraph from './EvidenceGraph.vue';
import EvidenceBars from './EvidenceBars.vue';
const props = defineProps({ result: Object });
const emit = defineEmits(['select']);
const insights = computed(() => props.result.analysis?.insights);
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
    <section v-if="insights" class="analysis-card interpretation stack" aria-label="本次扫描解读">
      <div>
        <p class="eyebrow">从发现到下一步</p>
        <h3>本次扫描解读</h3>
      </div>
      <ul>
        <li v-for="line in insights.conclusions" :key="line">{{ line }}</li>
      </ul>
      <p v-if="result.coverage?.partial" class="small muted">
        这是部分采集结果；以下图表只包含本次完整分析的文件，未扫描部分无法判断。
      </p>
    </section>
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
        :total="result.findings.length"
        interactive
        @select="select('sourceId', $event.key)"
      />
      <p class="small muted">
        其余 {{ insights.other_files }} 个命中文件，共
        {{ insights.other_findings }} 项发现。点击条目可定位证据。
      </p>
      <EvidenceBars
        title="识别方式分布"
        :rows="insights.methods"
        :total="result.findings.length"
        interactive
        @select="select('method', $event.key)"
      />
      <EvidenceBars
        title="迁移用途分类"
        :rows="insights.purposes"
        :total="result.findings.length"
      />
      <details class="notice">
        <summary>如何理解这些迁移方向？</summary>
        <p>
          ML-KEM 是密钥封装机制，用于密钥建立；ML-DSA、SLH-DSA
          用于数字签名。它们不能直接替换任意加密或签名 API。
        </p>
        <p>
          RSA 和通用 ECC
          的用途需要结合调用上下文复核。识别方式表示证据来源，不是置信度；未记录不等于没有依据。
        </p>
      </details>
    </template>
    <EvidenceGraph
      v-if="result.analysis"
      :assets="result.analysis.assets"
      @select="$emit('select', { method: '', ...$event })"
    />
    <p v-if="!result.analysis" class="notice">
      此历史结果未记录资产分析，仍可查看原始发现；重新扫描可生成完整概览。
    </p>
  </div>
</template>
<style scoped>
.interpretation {
  background: var(--accent-soft);
}
ul {
  margin: 0;
  padding-left: 1.2rem;
  font-size: 0.85rem;
  line-height: 1.8;
  overflow-wrap: anywhere;
}
li + li {
  margin-top: 0.5rem;
}
summary {
  cursor: pointer;
}
details p {
  margin-top: 0.6rem;
}
</style>
