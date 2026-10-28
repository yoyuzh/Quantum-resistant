import { reactive, ref, watch } from 'vue';
import { request } from '../api/client.js';
import { readAiPreference, saveAiPreference } from '../utils/assistance.js';

export const aiSettings = reactive({ ready: false, configured: false, can_manage: true, model: '', base_url: '', credential_storage: 'process', loading:true, load_error:'' });
export const aiEnabled = ref(readAiPreference());
export const aiSettingsOpen = ref(false);
export const aiProfiles=reactive({profiles:[],providers:[],active_profile_id:null});
export const aiGate=reactive({open:false,configuring:false,reason:''});
let gateResolve;
export function setAiEnabled(value) { aiEnabled.value = value; saveAiPreference(value); }
export async function loadAiSettings() {
  aiSettings.loading=true;
  try {
    const [config,list,providers]=await Promise.all([request('/api/ai/config'),request('/api/ai/profiles'),aiProfiles.providers.length?Promise.resolve({providers:aiProfiles.providers}):request('/api/ai/providers')]);
    Object.assign(aiSettings,config,{load_error:''});Object.assign(aiProfiles,list,providers);
    return config;
  } catch(e){aiSettings.ready=false;aiSettings.load_error=e.message;throw e;}
  finally {aiSettings.loading=false;}
}
export async function manageProfile(action,id,settings) {
  const desktop=globalThis.quantumDesktop;
  let response,failure;
  try {
  if(desktop?.manageAiProfile) response=await desktop.manageAiProfile({action,id,settings});
  else {
    const urls={create:'/api/ai/profiles',update:`/api/ai/profiles/${id}`,delete:`/api/ai/profiles/${id}`,clear:`/api/ai/profiles/${id}/credential`,activate:'/api/ai/active'};
    response=await request(urls[action],{method:{create:'POST',update:'PUT',activate:'PUT',delete:'DELETE',clear:'DELETE'}[action],body:action==='activate'?{profile_id:id}:settings});
  }
  } catch(e){failure=e;}
  try{await loadAiSettings();}catch(e){failure ||= e;}
  if(failure)throw failure;
  return response;
}
export function profileSelection() { return aiSettings.ready?{ai_profile_id:aiSettings.profile_id,ai_profile_version:aiSettings.version}:{}; }
export async function ensureAiReady(force=false) {
  if(!force && !aiEnabled.value)return {assisted:false};
  aiGate.reason='';
  try {await loadAiSettings();}catch(e){aiGate.reason=e.message;}
  if(aiSettings.ready)return {assisted:true,...profileSelection()};
  if(gateResolve)return null;
  aiGate.open=true;
  return new Promise(resolve=>{gateResolve=resolve;});
}
export function finishAiGate(action) {
  if(action==='configure'){aiGate.open=false;aiGate.configuring=true;aiSettingsOpen.value=true;return;}
  const resolve=gateResolve;gateResolve=null;aiGate.open=false;aiGate.configuring=false;
  resolve?.(action==='static'?{assisted:false}:action==='ready'?{assisted:true,...profileSelection()}:null);
}
export async function saveAiSettings(value) {
  const desktop = globalThis.quantumDesktop;
  const response = desktop?.saveAiSettings ? await desktop.saveAiSettings(value) : await request('/api/ai/config', { method: 'PUT', body: value });
  Object.assign(aiSettings, response);
  await loadAiSettings();
  return response;
}
export async function clearAiCredential() {
  const desktop = globalThis.quantumDesktop;
  if (desktop?.clearAiCredential) await desktop.clearAiCredential();
  else await request('/api/ai/config/credential', { method: 'DELETE' });
  await loadAiSettings();
}

watch([()=>aiSettings.ready,aiSettingsOpen],()=>{
  if(!aiGate.configuring)return;
  if(aiSettings.ready){aiSettingsOpen.value=false;finishAiGate('ready');}
  else if(!aiSettingsOpen.value){aiGate.configuring=false;aiGate.open=true;}
});
