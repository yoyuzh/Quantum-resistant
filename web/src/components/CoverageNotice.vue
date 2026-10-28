<script setup>
import { computed } from 'vue';
import { coverageText } from '../utils/results.js';
import DisclosurePanel from './DisclosurePanel.vue';
const props = defineProps({ coverage: Object, diagnostics: { type: Array, default: () => [] }, compact: Boolean });
const caption = computed(() => {
  const c = props.coverage;
  const label = !c ? '扫描范围未知' : c.partial ? '部分扫描' : '扫描范围';
  return [label, c && `已分析 ${c.scanned_files} 个文件`,
    c && (c.candidate_files == null ? '候选总数未知' : `候选 ${c.candidate_files} 个`),
    c?.skipped_files && `跳过 ${c.skipped_files} 个`,
    props.diagnostics.length && `扫描异常（${props.diagnostics.length} 条诊断）`].filter(Boolean).join(' · ');
});
</script>

<template>
  <div class="coverage stack" :class="{ compact, notice: !coverage || coverage.partial || diagnostics.length }">
    <p v-if="!compact || (!coverage && !diagnostics.length)">{{ caption }}</p>
    <DisclosurePanel v-if="coverage || diagnostics.length" :title="compact ? caption : '范围详情与诊断'">
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
.coverage.compact { padding: 0; background: transparent; font-size: var(--font-control); }
.coverage.compact :deep(summary) { min-height: 28px; padding: 2px 0; font-size: 13px; line-height: 20px; }
ul {
  margin: 0;
  padding-left: 1.2rem;
}
li + li { margin-top: 4px; }
@media (max-width: 600px), (pointer: coarse) {
  .coverage.compact :deep(summary) { min-height: 44px; }
}
</style>
