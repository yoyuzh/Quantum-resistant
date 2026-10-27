<script setup>
import { ref, inject, computed } from 'vue';
import CodePreview from './CodePreview.vue';
import DisclosurePanel from './DisclosurePanel.vue';
import { methodLabel } from '../utils/analysis.js';
import AssistedEvidence from './AssistedEvidence.vue';
import { purposeLabels, opinionLabels } from '../utils/assistance.js';
import { fileLabel } from '../utils/presentation.js';
import InfoTip from './InfoTip.vue';
import { statusLabel } from '../utils/verification.js';
const props = defineProps({ finding: Object, sources: Array, peers: Array, loadSource: Function, compact:Boolean });
const codeOpened = ref(false);
const assistedResult = inject('assistedResult', null);
const operations = computed(() => (assistedResult?.value?.deep_analysis?.operations || []).filter(o => props.finding?.operation_ids?.includes(o.operation_id)));
</script>
<template>
  <div v-if="finding" class="finding-detail">
    <div v-if="!compact" class="detail-identity">
      <span class="tag">{{ finding.algorithm }}</span><span class="risk">{{ statusLabel(finding.verification_status) }}</span>
      <span class="muted small">第 {{ finding.line }} 行</span>
      <InfoTip v-if="finding.verification_status !== 'confirmed'" label="判断状态说明">AI研判为有证据依据的模型结论，证据不足表示仍有关键缺口；两者均不计入静态迁移评分。</InfoTip>
    </div>
    <h3 v-if="!compact">{{ fileLabel(finding, peers || sources) }}</h3>
    <section v-if="finding.evidence !== finding.resolved_api && !(compact && finding.evidence === '源码实现研判')" class="detail-section">
      <h4>命中证据</h4><p class="full-evidence">{{ finding.evidence }}</p>
    </section>
    <dl>
      <dt>识别依据</dt><dd>{{ methodLabel(finding.detection_method) }}</dd>
      <dt v-if="finding.library">密码库</dt><dd v-if="finding.library">{{ finding.library }}</dd>
      <dt v-if="finding.resolved_api">完整 API</dt><dd v-if="finding.resolved_api" class="api">{{ finding.resolved_api }}</dd>
      <dt v-if="finding.purpose_code">用途</dt><dd v-if="finding.purpose_code">{{ purposeLabels[finding.effective_purpose_code || finding.purpose_code] }}<span v-if="finding.purpose_origin==='ai'" class="tag">AI用途研判</span></dd>
    </dl>
    <section v-if="!(finding.opinions || []).some(o => o.rationale === finding.reason)" class="detail-section"><h4>风险原因</h4><p>{{ finding.reason }}</p></section>
    <section class="detail-section recommendation"><h4>迁移参考</h4><p>{{ finding.recommendation }}</p></section>
    <p v-if="finding.suggested_purpose && !finding.effective_purpose_code && finding.purpose_code === 'unknown' && finding.suggested_purpose !== '用途待确认'">用途建议：{{ finding.suggested_purpose }}（待核验）</p>
    <section v-for="opinion in finding.opinions || []" :key="opinion.candidate_id" class="detail-section recommendation">
      <h4>{{ opinionLabels[opinion.opinion_kind] }}<InfoTip v-if="opinion.model_origin" label="研判模型来源">{{ opinion.model_origin.profile_name || opinion.model_origin.model }} · {{ opinion.model_origin.model }}</InfoTip></h4><p>{{ opinion.rationale }}</p>
      <p v-if="opinion.missing_information?.length" class="small muted">待补充：{{ opinion.missing_information.join('；') }}</p>
      <details v-for="citation in opinion.citations || []" :key="citation.evidence_id"><summary>{{ citation.file_name }} · 第 {{ citation.start_line }} 行</summary><pre class="full-evidence">{{ citation.text }}</pre></details>
    </section>
    <DisclosurePanel v-for="operation in operations" :key="operation.operation_id" title="跨文件证据">
      <AssistedEvidence :result="assistedResult" :operation="operation" :load-source="loadSource" />
    </DisclosurePanel>
    <DisclosurePanel v-if="!compact" title="附近源码" @toggle="codeOpened = $event">
      <CodePreview v-if="codeOpened" :sources="sources || []" :finding="finding" :load-source="loadSource" />
    </DisclosurePanel>
  </div>
  <p v-else class="empty compact">选择一条发现，查看详情与源码。</p>
</template>
<style scoped>
.finding-detail { display: grid; grid-template-columns: minmax(0, 1fr); gap: 10px; min-width: 0; padding: 14px; font-size: 15px;
  line-height: 1.6; overflow-wrap: anywhere; }
.detail-identity { display: flex; align-items: center; flex-wrap:wrap; gap: 8px; min-height:28px; }
h3 { font-size: 14px; line-height: 1.5; }
h4 { margin: 0 0 4px; font-size: 14px; color: var(--text-secondary); font-weight: 500; }
.risk { color: var(--text-secondary); font-size: 12px; }
.full-evidence { font: 13px/1.6 var(--font-mono); white-space: pre-wrap; }
dl { display: grid; grid-template-columns: 80px minmax(0, 1fr); gap: 8px 12px; margin: 0; align-items:baseline; }
dt { color: var(--text-secondary); }
dd { margin: 0; }
.api { font-family: var(--font-mono); font-size: 14px; }
.recommendation { padding: 8px; border-radius: 8px; background: var(--accent-soft); }
.detail-section { min-width: 0; }
</style>
