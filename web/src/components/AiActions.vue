<script setup>
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';
import InfoTip from './InfoTip.vue';
import { assistanceAction, confirmedOperations, analysisLabels } from '../utils/assistance.js';
import { aiSettingsOpen } from '../composables/useAiSettings.js';
const props = defineProps({ result: Object, state: Object });
const ai = computed(() => props.result?.ai_analysis);
const running = computed(() => props.state.aiBusy || props.state.progress?.ai_running);
const label = computed(() => assistanceAction(props.result));
const changes = computed(() => props.result.integrated_analysis?.changes);
const crossFileCount = computed(() => confirmedOperations(props.result).length);
const notes = computed(() => {
  const grouped=new Map();
  for (const note of ai.value?.diagnostics || []) {
    if (ai.value.coverage?.remaining===0 && ['invalid_opinion','missing_candidate','invalid_json'].includes(note.code)) continue;
    const row=grouped.get(note.code) || {...note,count:0};row.count++;grouped.set(note.code,row);
  }
  return [...grouped.values()];
});
const stopReasonLabels = {call_budget:'达到本次调用上限',input_budget:'达到累计输入上限',
  ai_timeout:'达到本次截止时间',cancelled:'用户已停止',config_changed:'模型配置已变化',
  provider_auth:'服务鉴权失败',protocol_failures:'模型返回格式持续无效',
  provider_timeout:'模型请求超时',provider_connection:'模型连接中断',provider_rate_limit:'服务限流',
  unresolved_responses:'响应无效或缺少证据',retry_after_deadline:'服务等待时间超过剩余预算',provider_balance:'账户余额不足',provider_parameters:'服务参数不兼容'};
defineEmits(['pending']);
</script>
<template>
  <div class="ai-actions">
    <div class="assistance-counts">
      <span v-if="changes?.review_required">需人工处理 <b>{{ changes.review_required }}</b></span>
      <template v-if="changes">
        <span v-if="changes.new_confirmed" title="跨文件核验新增的静态发现">新增确认 <b>{{ changes.new_confirmed }}</b></span>
        <span v-if="changes.purpose_completed">补充用途 <b>{{ changes.purpose_completed }}</b></span>
        <span v-if="changes.ai_assessed">AI 研判 <b>{{ changes.ai_assessed }}</b></span>
        <button v-if="changes.pending" class="button text-action compact" @click="$emit('pending')">证据不足 {{ changes.pending }}</button>
      </template>
      <span v-else-if="crossFileCount">跨文件确认 <b>{{ crossFileCount }}</b></span>
    </div>
    <div class="ai-action-buttons">
      <span v-if="running" role="status">{{ state.aiProgress?.stage || 'AI 辅助分析中' }}</span>
      <span v-else-if="ai" class="ai-state">{{ ai.status === 'skipped' ? 'AI 未运行' : `AI分析${analysisLabels[ai.status] || '未运行'}` }}
      <InfoTip label="AI复核详情">
        <p>{{ ai.coverage?.completed ?? 0 }} / {{ ai.coverage?.discovered ?? 0 }} 组，{{ ai.shared_budget ? '整批共享：' : '' }}{{ ai.calls || 0 }} 次调用，{{ ai.usage?.total_tokens ?? '未知' }} token</p>
        <p v-for="(run,index) in ai.runs || []" :key="index">{{ run.profile_name || run.model }}：{{ run.calls || 0 }} 次调用，{{ run.usage?.total_tokens ?? '未知' }} token</p>
        <p v-for="note in notes" :key="note.code">{{ note.message }}<template v-if="note.count>1">（{{ note.count }} 次）</template></p></InfoTip></span>
      <span v-if="ai?.coverage?.remaining" class="ai-incomplete">剩余 {{ ai.coverage.remaining }} 组，{{ stopReasonLabels[ai.stop_reason] || '意见不完整' }}</span>
      <button v-if="running" class="button secondary compact" :disabled="state.aiProgress?.ai_stop_requested || state.progress?.ai_stop_requested" @click="state.stopAi?.()">停止 AI</button>
      <button v-else-if="label && !state.readOnly" class="button secondary compact" :disabled="state.busy" @click="state.assist?.()"><AppIcon name="assist" :size="15" />{{ label }}</button>
      <button class="button text-action compact" @click="aiSettingsOpen = true"><AppIcon name="settings" :size="15" />{{ ai?.status === 'skipped' ? '配置模型' : '模型设置' }}</button>
    </div>
    <p v-if="state.aiError" class="notice error" role="alert">{{ state.aiError }}</p>
  </div>
</template>
<style scoped>
.ai-actions { padding: 6px var(--workspace-gutter); display: flex; align-items: center; flex-wrap: wrap; gap: 6px 16px; background: var(--bg-surface); font-size: 12px; }
.assistance-counts { display: flex; flex-wrap: wrap; align-items:center; min-height:32px; gap: 12px; color: var(--text-secondary); flex: 1; }
.assistance-counts:empty { display: none; }
.assistance-counts > span { display:inline-flex;align-items:baseline;gap:6px;line-height:20px; }
.assistance-counts > button { padding-inline:0;min-height:32px; }
.assistance-counts b { color: var(--text-primary); font-variant-numeric: tabular-nums; margin-left: 3px; }
.ai-action-buttons { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.ai-state { display:inline-flex;align-items:center;gap:2px;min-height:32px; }.ai-incomplete { color:var(--text-secondary); }
.ai-actions p { flex-basis: 100%; }.ai-note { color: var(--text-secondary); overflow-wrap: anywhere; }
@media (max-width: 600px) { .ai-action-buttons { width: 100%; } }
</style>
