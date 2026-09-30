<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import CodePreview from './CodePreview.vue';
import { methodLabel } from '../utils/analysis.js';
const props = defineProps({
  finding: Object,
  sources: { type: Array, default: () => [] },
  initialExpanded: Boolean,
  loadSource: Function,
});
const expanded = ref(props.initialExpanded);
const article = ref(null);
async function reveal() {
  if (!props.initialExpanded) return;
  expanded.value = true;
  await nextTick();
  article.value?.scrollIntoView({ block: 'nearest' });
}
onMounted(reveal);
watch(() => props.initialExpanded, reveal);
</script>

<template>
  <article ref="article" class="finding">
    <div class="toolbar">
      <span class="tag">{{ finding.algorithm }}</span
      ><span class="risk">{{ finding.risk_level }}</span
      ><span class="muted small">第 {{ finding.line }} 行</span>
    </div>
    <p class="filename">{{ finding.file_name }}</p>
    <p class="small muted">{{ methodLabel(finding.detection_method) }} · {{ finding.source_id }}</p>
    <p class="evidence">{{ finding.evidence }}</p>
    <p class="small">{{ finding.recommendation }}</p>
    <button class="button secondary small" @click="expanded = !expanded" :aria-expanded="expanded">
      {{ expanded ? '收起详情' : '查看原因与源码' }}
    </button>
    <div v-if="expanded" class="stack detail">
      <p class="small muted">
        密码库：{{ finding.library || '未记录' }}<br />完整 API：{{
          finding.resolved_api || '未记录'
        }}
      </p>
      <p class="small muted">{{ finding.reason }}</p>
      <CodePreview :sources="sources" :finding="finding" :load-source="loadSource" />
    </div>
  </article>
</template>

<style scoped>
.finding {
  padding: 1rem;
  border-left: 3px solid var(--danger);
  border-radius: var(--radius);
  background: var(--bg-elevated);
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
