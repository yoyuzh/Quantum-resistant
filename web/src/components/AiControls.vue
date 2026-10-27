<script setup>
import AppIcon from './AppIcon.vue';
import { modelStatus } from '../utils/modelProfiles.js';
import { aiEnabled, aiSettings, aiSettingsOpen, setAiEnabled } from '../composables/useAiSettings.js';
defineProps({ disabled: Boolean });
</script>
<template>
  <div class="ai-controls">
    <label class="ai-toggle" title="仅影响下一次扫描；关闭后仍执行跨文件静态分析">
      <input type="checkbox" role="switch" :checked="aiEnabled" :disabled="disabled" @change="setAiEnabled($event.target.checked)" />
      <span class="switch-track" aria-hidden="true"></span><span>AI 辅助</span>
    </label>
    <span class="model-state">{{ aiSettings.profile_name || aiSettings.model || 'AI' }} · {{ modelStatus(aiSettings) }}</span>
    <button type="button" class="button text-action compact" @click="aiSettingsOpen = true">
      <AppIcon name="settings" :size="16" />{{ aiSettings.ready ? '模型设置' : '配置模型' }}
    </button>
  </div>
</template>
<style scoped>
.ai-controls { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; justify-content: space-between; }
.model-state { font-size:13px;color:var(--text-secondary);margin-right:auto; }
.ai-toggle { display: inline-flex; gap: 8px; align-items: center; cursor: pointer; min-height: 36px; font-size: 13px; position: relative; }
.ai-toggle input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.switch-track { width: 32px; height: 18px; border-radius: 12px; background: var(--border); position: relative; }
.switch-track::after { content: ''; position: absolute; width: 12px; height: 12px; top: 3px; left: 3px; border-radius: 50%; background: var(--bg-surface); }
input:checked + .switch-track { background: var(--accent); }
input:checked + .switch-track::after { transform: translateX(14px); }
input:focus-visible + .switch-track { outline: 2px solid var(--accent); outline-offset: 3px; }
input:disabled ~ span { opacity: .55; }
@media (forced-colors: active) { .switch-track { border: 1px solid ButtonText; } input:checked + .switch-track { background: Highlight; } }
</style>
