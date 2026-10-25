<script setup>
import { ref } from 'vue';
import CodePreview from './CodePreview.vue';
import DisclosurePanel from './DisclosurePanel.vue';
import { methodLabel } from '../utils/analysis.js';
import { fileLabel } from '../utils/presentation.js';
defineProps({ finding: Object, sources: Array, peers: Array, loadSource: Function });
const codeOpened = ref(false);
</script>
<template>
  <div v-if="finding" class="finding-detail">
    <div class="detail-identity">
      <span class="tag">{{ finding.algorithm }}</span><span class="risk">{{ finding.risk_level }}</span>
      <span class="muted small">第 {{ finding.line }} 行</span>
    </div>
    <h3>{{ fileLabel(finding, peers || sources) }}</h3>
    <section class="detail-section">
      <h4>命中证据</h4><p class="full-evidence">{{ finding.evidence }}</p>
    </section>
    <dl>
      <dt>识别依据</dt><dd>{{ methodLabel(finding.detection_method) }}</dd>
      <dt>密码库</dt><dd>{{ finding.library || '未记录' }}</dd>
      <dt>完整 API</dt><dd class="api">{{ finding.resolved_api || '未记录' }}</dd>
    </dl>
    <section class="detail-section"><h4>风险原因</h4><p>{{ finding.reason }}</p></section>
    <section class="detail-section recommendation"><h4>迁移参考</h4><p>{{ finding.recommendation }}</p></section>
    <DisclosurePanel title="附近源码" @toggle="codeOpened = $event">
      <CodePreview v-if="codeOpened" :sources="sources || []" :finding="finding" :load-source="loadSource" />
    </DisclosurePanel>
  </div>
  <p v-else class="empty compact">选择一条发现，查看详情与源码。</p>
</template>
<style scoped>
.finding-detail { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; min-width: 0; padding: 10px 12px; font-size: 13px;
  line-height: 1.6; overflow-wrap: anywhere; }
.detail-identity { display: flex; align-items: center; gap: 8px; }
h3 { font-size: 14px; line-height: 1.5; }
h4 { margin: 0 0 4px; font-size: 12px; color: var(--text-secondary); font-weight: 500; }
.risk { color: var(--danger); font-size: 12px; }
.full-evidence { font: 13px/1.6 var(--font-mono); white-space: pre-wrap; }
dl { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 4px 12px; margin: 0; }
dt { color: var(--text-secondary); }
dd { margin: 0; }
.api { font-family: var(--font-mono); font-size: 12px; }
.recommendation { padding: 8px; border-radius: 8px; background: var(--accent-soft); }
.detail-section { min-width: 0; }
</style>
