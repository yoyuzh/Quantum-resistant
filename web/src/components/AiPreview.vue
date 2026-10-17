<script setup>
import { originLabels, skipLabels } from '../utils/aiAnalysis.js';
defineProps({ preview: Object, busy: Boolean });
defineEmits(['submit']);
</script>
<template>
  <div class="ai-preview stack">
    <h3>检查本次发送范围</h3>
    <p>{{ preview.target_origin }} · {{ preview.model }}</p>
    <p>{{ preview.candidate_coverage.selected_files }} 个文件，{{ preview.candidates.length }} 个候选，
      {{ preview.candidate_coverage.context_bytes }} 字节源码上下文。</p>
    <p>预览有效期至 {{ preview.expires_at }}；单次最多 {{ preview.budgets.request_bytes }} 字节输入，
      {{ preview.budgets.output_tokens }} 输出 token，最多 {{ preview.budgets.max_calls }} 次调用，
      总时限 {{ preview.budgets.task_seconds }} 秒。</p>
    <p class="notice">{{ preview.notice }}</p>
    <p v-if="preview.candidate_coverage.source_partial" class="notice">来源扫描不完整，本次只分析已保留部分。</p>
    <ul v-if="Object.keys(preview.candidate_coverage.skip_reasons).length">
      <li v-for="(count, reason) in preview.candidate_coverage.skip_reasons" :key="reason">{{ skipLabels[reason] || '其他未分析范围' }}：{{ count }}</li>
    </ul>
    <details v-for="candidate in preview.candidates" :key="candidate.candidate_id">
      <summary>{{ candidate.file_name }} · 第 {{ candidate.start_line }} 行 · {{ candidate.origins.map((value) => originLabels[value]).join(' / ') }}</summary>
      <p class="muted">来源 {{ candidate.source_id }}</p>
      <pre tabindex="0" aria-label="脱敏后待发送源码"><code v-for="line in candidate.lines" :key="line.line">{{ line.line }}  {{ line.text }}{{ '\n' }}</code></pre>
    </details>
    <button type="button" class="button primary" :disabled="busy" @click="$emit('submit')">
      确认本次范围并发送给模型
    </button>
  </div>
</template>
<style scoped>
.ai-preview { padding: 1rem; background: var(--bg-elevated); border-radius: var(--radius); }
p, summary { overflow-wrap: anywhere; }
pre { max-height: 22rem; overflow: auto; font: 0.78rem/1.7 var(--font-mono); }
details { border-top: 1px solid var(--border); padding-top: 0.7rem; }
summary { cursor: pointer; }
button { white-space: normal; height: auto; min-height: 40px; }
</style>
