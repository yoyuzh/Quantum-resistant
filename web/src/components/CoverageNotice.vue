<script setup>
import { coverageText } from '../utils/results.js';
import DisclosurePanel from './DisclosurePanel.vue';
defineProps({ coverage: Object, diagnostics: { type: Array, default: () => [] } });
</script>

<template>
  <div class="coverage stack" :class="{ 'notice': !coverage || coverage.partial || diagnostics.length }">
    <p>
      <strong>{{ !coverage ? '扫描范围未知' : coverage.partial ? '部分扫描' : coverage.candidate_files == null ? '候选总数未知' : '扫描范围' }}</strong>
      <template v-if="coverage"> · 已分析 {{ coverage.scanned_files }} 个文件<template v-if="coverage.candidate_files != null"> / 候选 {{ coverage.candidate_files }} 个</template><template v-else> · 候选总数未知</template><template v-if="coverage.skipped_files"> · 跳过 {{ coverage.skipped_files }} 个</template></template>
      <template v-if="diagnostics.length"> · 扫描异常（{{ diagnostics.length }} 条诊断）</template>
    </p>
    <DisclosurePanel v-if="coverage || diagnostics.length" title="范围详情与诊断">
      <p>{{ coverageText(coverage) }}</p>
      <p v-if="coverage?.partial">存在未扫描内容，以下结果仅包含完整分析的文件。</p>
      <ul>
        <li v-for="(item, index) in diagnostics" :key="index">{{ item.message }}</li>
      </ul>
    </DisclosurePanel>
  </div>
</template>

<style scoped>
.coverage {
  font-size: 0.875rem;
  line-height: 1.65;
  gap: 0.5rem;
}
summary {
  cursor: pointer;
  color: var(--accent-dim);
}
ul {
  padding-left: 1.2rem;
}
</style>
