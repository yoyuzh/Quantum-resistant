<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import CodePreview from './CodePreview.vue';
import { methodLabel } from '../utils/analysis.js';
import { fileLabel } from '../utils/presentation.js';
const props = defineProps({
  finding: Object,
  sources: { type: Array, default: () => [] },
  initialExpanded: Boolean,
  loadSource: Function,
  identityPeers: Array,
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
    <p class="filename">{{ fileLabel(finding, identityPeers || sources) }}</p>
    <p class="evidence">{{ finding.evidence }}</p>
    <details :open="expanded" @toggle="expanded = $event.target.open">
      <summary class="button secondary">
        {{ expanded ? '收起详情' : '详情与源码' }}
      </summary>
      <div v-if="expanded" class="stack detail">
        <p>{{ methodLabel(finding.detection_method) }} · {{ finding.source_id }}</p>
        <p>
          密码库：{{ finding.library || '未记录' }}<br />完整 API：{{
            finding.resolved_api || '未记录'
          }}
        </p>
        <p>{{ finding.reason }}</p>
        <p>迁移参考：{{ finding.recommendation }}</p>
        <CodePreview :sources="sources" :finding="finding" :load-source="loadSource" />
      </div>
    </details>
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
  font-size: 0.875rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}
.evidence {
  font: 0.875rem/1.6 var(--font-mono);
  padding: 0.5rem 0;
  overflow-wrap: anywhere;
}
.detail {
  margin-top: 0.75rem;
}
</style>
