<script setup>
import { ref, watch } from 'vue';
import { request } from '../api/client.js';
import ScanResults from './ScanResults.vue';
const props=defineProps({repo:Object,taskId:String});
defineEmits(['back','scan-repository']);
const result=ref(null),error=ref(''),loading=ref(false),revision=ref(0);
watch(()=>[props.repo.repository_id,props.taskId,revision.value],async (_,old,onCleanup)=>{
  const controller=new AbortController();onCleanup(()=>controller.abort());
  result.value=null;error.value='';loading.value=true;
  try {
    const value=await request('/api/tasks/'+encodeURIComponent(props.taskId)+'/repositories/'+encodeURIComponent(props.repo.repository_id),{signal:controller.signal});
    if (!controller.signal.aborted) result.value=value;
  } catch(e) {if (!controller.signal.aborted) error.value=e.message;}
  finally {if (!controller.signal.aborted) loading.value=false;}
},{immediate:true});
</script>
<template>
  <section id="popular-detail" class="panel results popular-repository" aria-label="热门仓库完整分析">
    <div class="repository-toolbar"><button class="button text-action compact" @click="$emit('back')">返回榜单</button><strong>{{ repo.full_name }}</strong><button class="button secondary compact" @click="$emit('scan-repository',repo.url)">单独扫描</button></div>
    <p v-if="loading" class="notice" role="status">正在读取仓库分析结果…</p>
    <div v-else-if="error" class="notice error" role="alert">{{ error }}<button class="button secondary compact" @click="revision++">重新读取</button></div>
    <ScanResults v-else-if="result" :result="result" :state="{busy:false,readOnly:true}" :input="{source:repo.full_name,collapsed:true}" @rescan="$emit('scan-repository',repo.url)" />
  </section>
</template>
<style scoped>
.popular-repository { min-height:0;min-width:0;display:flex;flex-direction:column; }.repository-toolbar { display:flex;align-items:center;gap:10px;padding:6px 12px;min-height:40px; }.repository-toolbar strong { flex:1;font-size:13px;overflow-wrap:anywhere; }.popular-repository :deep(.result-layout) { flex:1;min-height:0; }
</style>
