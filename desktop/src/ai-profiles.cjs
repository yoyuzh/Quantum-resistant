'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {readAiSettings}=require('./ai-preferences.cjs');
const POLICY='redacted-evidence-3';
const fields=['name','preset','base_url','model','consent','json_mode','output_parameter','reasoning_disabled','protocol','auth_mode','output_mode','region','remember'];
async function secure(storage) {
  try{return (storage.isAsyncEncryptionAvailable?await storage.isAsyncEncryptionAvailable():storage.isEncryptionAvailable()) && !(process.platform==='linux' && storage.getSelectedStorageBackend()==='basic_text');}
  catch{return false;}
}
async function readAiProfiles(root,storage) {
  const file=path.join(root,'ai-profiles.json');
  if(!fs.existsSync(file)) {
    const old=await readAiSettings(root,storage);
    let credential=false;try{credential=!!JSON.parse(fs.readFileSync(path.join(root,'ai-settings.json'),'utf8')).credential;}catch{}
    return old?{profiles:[{id:'legacy-default',settings:{...old,name:'默认配置',remember:true},persisted_key:old.api_key || '',credential_persisted:!!old.api_key,credential_unavailable:credential && !old.api_key}],active_profile_id:'legacy-default'}:null;
  }
  try {
    if(fs.statSync(file).size>512*1024)return null;
    const record=JSON.parse(fs.readFileSync(file,'utf8'));
    if(record.version!==1 || !Array.isArray(record.profiles) || record.profiles.length>32)return null;
    const enabled=await secure(storage),profiles=[];
    for(const item of record.profiles) {
      const settings={...item.settings,api_key:''};
      settings.consent=!!settings.consent && item.policy===POLICY;
      if(item.credential && enabled) {
        try {const data=Buffer.from(item.credential,'base64');settings.api_key=storage.decryptStringAsync?(await storage.decryptStringAsync(data)).result:storage.decryptString(data);}catch{settings.consent=false;}
      }
      if(item.credential && !settings.api_key)settings.consent=false;
      profiles.push({id:item.id,settings,persisted_key:settings.api_key || '',credential_persisted:!!settings.api_key,credential_unavailable:!!item.credential && !settings.api_key});
    }
    return {profiles,active_profile_id:record.active_profile_id};
  }catch{return null;}
}
async function writeAiProfiles(root,bundle,storage) {
  const enabled=await secure(storage),profiles=[],persisted=[];
  let previous=[];
  try{previous=JSON.parse(fs.readFileSync(path.join(root,'ai-profiles.json'),'utf8')).profiles || [];}catch{}
  if(!previous.length){try{const old=JSON.parse(fs.readFileSync(path.join(root,'ai-settings.json'),'utf8'));previous=[{id:'legacy-default',...old}];}catch{}}

  for(const item of bundle.profiles.filter(p=>p.settings.remember!==false)) {
    const settings=Object.fromEntries(fields.filter(k=>k in item.settings).map(k=>[k,item.settings[k]]));
    let credential=null;
    const retained=previous.find(p=>p.id===item.id)?.credential;
    if(item.settings.api_key && item.persisted_key===item.settings.api_key && retained)credential=retained;
    if(item.settings.api_key && !credential && enabled) {
      try {const buffer=storage.encryptStringAsync?await storage.encryptStringAsync(item.settings.api_key):storage.encryptString(item.settings.api_key);credential=buffer.toString('base64');}catch{ /* Memory only. */ }
    }
    if(item.settings.api_key && !credential)throw new Error('系统安全存储不可用，配置仅本次运行');
    if(item.credential_unavailable && !item.settings.api_key){
      credential=previous.find(p=>p.id===item.id)?.credential || null;
      settings.consent=false;
    }else persisted.push(item.id);
    profiles.push({id:item.id,settings,credential,policy:POLICY});
  }
  const serialized=JSON.stringify({version:1,profiles,active_profile_id:bundle.active_profile_id});
  if(Buffer.byteLength(serialized,'utf8')>500*1024)throw new Error('模型配置超过安全存储大小限制');
  const temporary=path.join(root,'ai-profiles-'+require('node:crypto').randomBytes(8).toString('hex')+'.tmp');
  try {
    fs.writeFileSync(temporary,serialized,{mode:0o600,flag:'wx'});
    fs.renameSync(temporary,path.join(root,'ai-profiles.json'));
  }catch(error){try{fs.unlinkSync(temporary);}catch{}throw error;}
  for(const item of bundle.profiles)if(persisted.includes(item.id))item.persisted_key=item.settings.api_key || '';
  // Retire the single-profile fallback only after the new bundle is durable.
  try{fs.unlinkSync(path.join(root,'ai-settings.json'));}catch{}
  return persisted;
}
function updateBundle(bundle,action,id,settings,response) {
  if(action==='activate')bundle.active_profile_id=id || null;
  else if(action==='delete') {bundle.profiles=bundle.profiles.filter(p=>p.id!==id);if(bundle.active_profile_id===id)bundle.active_profile_id=null;}
  else if(action==='clear') {const p=bundle.profiles.find(p=>p.id===id);if(p){p.settings.api_key='';p.settings.consent=false;p.credential_unavailable=false;p.persisted_key='';}}
  else {
    const identity=response.id,old=bundle.profiles.find(p=>p.id===identity);
    const key=settings.api_key || (old?.settings.base_url===response.base_url?old.settings.api_key:'') || '';
    const item={id:identity,persisted_key:old?.persisted_key || '',credential_unavailable:!settings.api_key && !!old?.credential_unavailable && old.settings.base_url===response.base_url,settings:{...Object.fromEntries(fields.map(k=>[k,response[k] ?? settings[k]])),api_key:key}};
    bundle.profiles=bundle.profiles.filter(p=>p.id!==identity);bundle.profiles.push(item);
  }
  return bundle;
}
module.exports={readAiProfiles,writeAiProfiles,updateBundle};
