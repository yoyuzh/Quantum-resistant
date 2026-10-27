<script setup>
import { computed,nextTick,onBeforeUnmount,ref,watch } from 'vue';
import AiProfileEditor from './AiProfileEditor.vue';
import SelectControl from './SelectControl.vue';
import { request } from '../api/client.js';
import { aiSettings,aiSettingsOpen,aiProfiles,loadAiSettings,manageProfile } from '../composables/useAiSettings.js';
import { notify } from '../composables/useNotice.js';
import AppIcon from './AppIcon.vue';
import { modelStatus } from '../utils/modelProfiles.js';
const dialog=ref(null),selected=ref('new'),busy=ref(false),error=ref(''),status=ref(''),confirmDelete=ref(false);
const profileOptions=computed(()=>[{value:'new',label:'新配置'},...aiProfiles.profiles.map(p=>({value:p.id,label:p.name+(p.active?' · 已启用':'')}))]);
const current=computed(()=>aiProfiles.profiles.find(p=>p.id===selected.value) || null);
watch(error,value=>{if(value)notify(value,'error');});
watch(status,value=>{if(value)notify(value);});
let origin,sequence=0;
watch(aiSettingsOpen,async open=>{
  const ticket=++sequence;
  if(!open){dialog.value?.close();return;}
  origin=document.activeElement;error.value='';status.value='';confirmDelete.value=false;
  try{await loadAiSettings();}catch(e){error.value=e.message;}
  if(ticket!==sequence || !aiSettingsOpen.value)return;
  selected.value=aiProfiles.active_profile_id || aiProfiles.profiles[0]?.id || 'new';
  await nextTick();dialog.value.showModal();
});
async function close(){aiSettingsOpen.value=false;await nextTick();origin?.isConnected && origin.focus({preventScroll:true});}
function trap(event){const items=[...dialog.value.querySelectorAll('button,input,summary,[tabindex="0"]')].filter(e=>!e.disabled && e.getClientRects().length);if(event.shiftKey && document.activeElement===items[0]){event.preventDefault();items.at(-1)?.focus();}else if(!event.shiftKey && document.activeElement===items.at(-1)){event.preventDefault();items[0]?.focus();}}
async function operation(work){if(busy.value)return;busy.value=true;error.value='';status.value='';try{await work();}catch(e){error.value=e.message;}finally{busy.value=false;}}
async function save(settings,activate){await operation(async()=>{
  const value=await manageProfile(current.value?'update':'create',current.value?.id,settings);selected.value=value.id;
  if(activate)await manageProfile('activate',value.id);
  const saved=aiProfiles.profiles.find(p=>p.id===value.id);
  status.value=saved?.credential_persisted?'配置已保存':'配置已生效，仅本次运行';
});}
function activate(id){operation(async()=>{await manageProfile('activate',id);status.value=id?'已切换，新任务使用该模型':'已停用，新任务不调用模型';});}
function test(){notify('正在测试已保存配置…','loading');operation(async()=>{try{await request(`/api/ai/profiles/${selected.value}/test`,{method:'POST',timeout:50000});}finally{await loadAiSettings();}status.value='连接与输出格式测试通过';});}
function remove(clear=false){operation(async()=>{await manageProfile(clear?'clear':'delete',selected.value);if(!clear)selected.value=aiProfiles.profiles[0]?.id || 'new';confirmDelete.value=false;status.value=clear?'凭据已删除':'配置已删除';});}
onBeforeUnmount(()=>{sequence++;dialog.value?.close();});
</script>
<template>
  <dialog ref="dialog" class="ai-settings" aria-labelledby="ai-settings-title" @keydown.tab="trap" @cancel.prevent="close" @click="$event.target===dialog && close()">
    <header><h2 id="ai-settings-title"><AppIcon name="settings" :size="22" />模型配置</h2><button class="button secondary compact" autofocus @click="close">关闭</button></header>
    <div class="settings-layout"><aside><div class="profile-actions"><button class="button primary compact" :disabled="busy || !aiSettings.can_manage || aiProfiles.profiles.filter(p=>!p.readonly).length>=32" @click="selected='new';confirmDelete=false">新增配置</button><button class="button secondary compact" :disabled="busy || !aiSettings.can_manage || !aiProfiles.active_profile_id" @click="activate(null)">全部停用</button></div>
      <SelectControl v-if="aiProfiles.profiles.length" class="mobile-profile-picker" v-model="selected" label="已保存配置" :options="profileOptions" :popup-target="dialog" />
      <div class="profile-list" aria-label="已保存模型配置"><button v-for="profile in aiProfiles.profiles" :key="profile.id" class="profile-row" :class="{selected:selected===profile.id}" :aria-pressed="selected===profile.id" @click="selected=profile.id;confirmDelete=false"><strong>{{ profile.name }}</strong><span>{{ profile.model }}</span><small>{{ profile.active?'已启用':'未启用' }}</small></button></div>
    </aside><section class="profile-main"><div v-if="current" class="profile-summary"><div class="profile-heading"><h3>{{ current.name }}</h3><strong>{{ modelStatus(current) }}</strong></div><span>{{ current.readonly?'环境变量 · 只读':current.credential_persisted?'系统安全存储':'仅本次运行' }}</span><button class="button secondary compact" :disabled="busy || !aiSettings.can_manage || current.active" @click="activate(current.id)">{{ current.active?'当前启用':'启用此配置' }}</button></div>
      <p v-if="!aiSettings.can_manage" class="notice">仅本机可管理模型配置。</p>
      <AiProfileEditor v-if="aiSettingsOpen" :key="selected" :profile="current" :providers="aiProfiles.providers" :busy="busy" :can-manage="aiSettings.can_manage" :popup-target="dialog" :first="!aiProfiles.profiles.length" @save="save" @test="test" @clear="remove(true)" />
      <div v-if="current && !current.readonly" class="delete-actions"><button v-if="!confirmDelete" class="button text-action compact" :disabled="busy || !aiSettings.can_manage" @click="confirmDelete=true">删除配置</button><template v-else><span>删除后需重新填写凭据。</span><button class="button secondary compact" :disabled="busy" @click="remove()">确认删除</button><button class="button text-action compact" @click="confirmDelete=false">取消</button></template></div>
    </section></div>
  </dialog>
</template>
<style scoped>
.ai-settings { width:min(1080px,calc(100% - 32px));height:min(760px,calc(100dvh - 32px));max-width:none;max-height:none;padding:20px;border:0;border-radius:var(--radius-lg);background:var(--bg-surface);color:var(--text-primary); }
.ai-settings[open] { display:flex;flex-direction:column;gap:18px; }.ai-settings::backdrop { background:rgb(8 18 28 / 40%); }
header { display:flex;align-items:center;justify-content:space-between;gap:12px;flex:none; }h2 { display:flex;align-items:center;gap:10px;margin:0;font-size:20px; }
.settings-layout { flex:1;display:grid;grid-template-columns:224px minmax(0,1fr);gap:28px;min-height:0; }
.settings-layout>aside { display:flex;flex-direction:column;gap:14px;min-height:0; }.profile-actions { display:flex;gap:6px;flex-wrap:wrap; }
.mobile-profile-picker { display:none; }.profile-list { flex:1;overflow:auto;overscroll-behavior:contain; }
.profile-row { display:grid;gap:5px;text-align:left;width:100%;padding:14px 12px;background:transparent;color:var(--text-primary);cursor:pointer;border-radius:var(--radius); }
.profile-row strong { font-size:16px;overflow-wrap:anywhere; }.profile-row.selected { background:var(--control-selected); }
.profile-row span,.profile-row small { color:var(--text-secondary);font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
.profile-row small { justify-self:start;color:var(--accent-dim); }.profile-main { min-width:0;min-height:0;display:flex;flex-direction:column; }
.profile-summary { display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:18px;font-size:13px;flex:none; }
.profile-heading { display:grid;gap:3px; }.profile-heading h3 { font-size:18px; }.profile-heading strong { color:var(--accent-dim);font-size:13px;font-weight:500; }
.profile-summary>span { margin-left:8px;color:var(--text-secondary); }.profile-summary button { margin-left:auto; }
.delete-actions { display:flex;align-items:center;gap:8px;font-size:13px;margin-top:10px;flex:none;min-height:34px; }
@media(max-width:700px) {
 .ai-settings { width:100%;height:100dvh;max-height:none;margin:0;border-radius:0;padding:14px;gap:12px; }
 .settings-layout { display:flex;flex-direction:column;gap:14px; }.settings-layout>aside { flex:none;gap:8px; }.profile-main { flex:1; }
 .profile-list { display:none; }.mobile-profile-picker { display:grid; }.profile-summary { margin-bottom:10px; }.profile-summary>span { margin-left:0; }
 .profile-heading h3 { font-size:16px; }.profile-summary button { margin-left:auto; }
}
</style>
