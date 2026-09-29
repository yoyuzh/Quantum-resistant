<script setup>
import { coverageText } from '../utils/results.js';
defineProps({ coverage: Object, diagnostics: { type: Array, default: () => [] } });
</script>

<template>
  <div class="notice coverage">
    <strong>{{ coverageText(coverage) }}</strong>
    <p>
      {{
        coverage?.partial ? '存在未扫描部分。' : ''
      }}结果仅对应本次输入和当前规则，零发现不代表整个项目没有相关用法。
    </p>
    <details v-if="diagnostics.length">
      <summary>查看 {{ diagnostics.length }} 条扫描诊断</summary>
      <ul>
        <li v-for="(item, index) in diagnostics" :key="index">{{ item.message }}</li>
      </ul>
    </details>
  </div>
</template>

<style scoped>
.coverage {
  font-size: 0.78rem;
  line-height: 1.65;
}
summary {
  cursor: pointer;
  color: var(--accent-dim);
}
ul {
  padding-left: 1.2rem;
  max-height: 220px;
  overflow: auto;
}
</style>
