<script setup>
import { nextTick,onBeforeUnmount,ref,watch } from 'vue';
import { aiGate,aiSettings,finishAiGate } from '../composables/useAiSettings.js';
const dialog=ref(null);
let origin;
watch(()=>aiGate.open,async open=>{await nextTick();if(open){origin=document.activeElement;dialog.value.showModal();}else dialog.value?.close();});
function cancel(){finishAiGate('cancel');origin?.focus({preventScroll:true});}
function trap(event){const buttons=[...dialog.value.querySelectorAll('button')];if(event.shiftKey && document.activeElement===buttons[0]){event.preventDefault();buttons.at(-1).focus();}else if(!event.shiftKey && document.activeElement===buttons.at(-1)){event.preventDefault();buttons[0].focus();}}
onBeforeUnmount(()=>{dialog.value?.close();finishAiGate('cancel');});
</script>
<template>
  <dialog ref="dialog" class="ai-setup-prompt" aria-labelledby="ai-setup-title" @cancel.prevent="cancel" @keydown.tab="trap"><h2 id="ai-setup-title">先配置 AI 模型</h2><p>{{ aiGate.reason || (aiSettings.credential_unavailable?'已保存配置的凭据未能恢复，请重新填写密钥。':aiSettings.profile_id?'当前配置缺少密钥、发送授权或有效连接，请检查模型设置。':'尚未启用可用的模型配置。') }}</p><div><button class="button primary" autofocus @click="finishAiGate('configure')">去配置</button><button class="button secondary" @click="finishAiGate('static')">仅静态扫描</button><button class="button text-action" @click="cancel">取消</button></div></dialog>
</template>
<style scoped>
.ai-setup-prompt { width:min(460px,calc(100% - 32px));padding:24px;border:0;border-radius:var(--radius-lg);background:var(--bg-surface);color:var(--text-primary); }.ai-setup-prompt::backdrop { background:rgb(8 18 28 / 40%); }h2 { font-size:20px;margin:0 0 12px; }p { margin:0 0 20px;font-size:15px;color:var(--text-secondary); }div { display:flex;flex-wrap:wrap;gap:8px; }
</style>
