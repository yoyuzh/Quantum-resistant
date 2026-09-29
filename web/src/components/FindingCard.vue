<script setup>
import { ref } from 'vue';
import CodePreview from './CodePreview.vue';
defineProps({ finding: Object, sources: { type: Array, default: () => [] } });
const expanded = ref(false);
</script>

<template>
  <article class="finding">
    <div class="toolbar">
      <span class="tag">{{ finding.algorithm }}</span
      ><span class="risk">{{ finding.risk_level }}</span
      ><span class="muted small">第 {{ finding.line }} 行</span>
    </div>
    <p class="filename">{{ finding.file_name }}</p>
    <p class="evidence">{{ finding.evidence }}</p>
    <p class="small">{{ finding.recommendation }}</p>
    <button class="button secondary small" @click="expanded = !expanded" :aria-expanded="expanded">
      {{ expanded ? '收起详情' : '查看原因与源码' }}
    </button>
    <div v-if="expanded" class="stack detail">
      <p class="small muted">{{ finding.reason }}</p>
      <CodePreview :sources="sources" :finding="finding" />
    </div>
  </article>
</template>

<style scoped>
.finding {
  padding: 1rem;
  border: 1px solid var(--border);
  border-left: 3px solid var(--danger);
  border-radius: var(--radius);
  background: var(--bg-surface);
}
.risk {
  color: var(--danger);
  font-size: 0.75rem;
}
.filename {
  font-size: 0.8rem;
  color: var(--text-secondary);
  overflow-wrap: anywhere;
}
.evidence {
  font: 0.8rem/1.6 var(--font-mono);
  overflow-wrap: anywhere;
}
.detail {
  margin-top: 0.75rem;
}
</style>
