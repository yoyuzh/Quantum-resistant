<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import AppIcon from './AppIcon.vue';
import FileMapCanvas from './FileMapCanvas.vue';
const props=defineProps({files:Array,open:Boolean,trigger:Object});
const emit=defineEmits(['close','select']);
const dialog=ref(null),canvas=ref(null),query=ref(''),width=ref(1000),height=ref(600);
const visible=computed(()=>props.files.filter(f=>f.name.toLocaleLowerCase().includes(query.value.trim().toLocaleLowerCase())));
const mapHeight=computed(()=>Math.max(height.value,Math.ceil(visible.value.length/Math.max(1,Math.floor(width.value/240)))*110));
async function close(restore=true) { dialog.value?.close();emit('close');await nextTick();if(restore && props.trigger?.isConnected) props.trigger.focus({preventScroll:true}); }
function select(value) { close(false);emit('select',value); }
function trap(event) {
  const controls=[...dialog.value.querySelectorAll('button,input,[tabindex="0"]')].filter(e=>e.getClientRects().length);
  const first=controls[0],last=controls.at(-1);
  if(event.shiftKey && document.activeElement===first) {event.preventDefault();last?.focus();}
  else if(!event.shiftKey && document.activeElement===last) {event.preventDefault();first?.focus();}
}
let observer;
watch(()=>props.open,async value=>{
  await nextTick();
  if(value) { query.value='';dialog.value.showModal();await nextTick();observer=new ResizeObserver(()=>{width.value=Math.max(280,canvas.value.clientWidth);height.value=Math.max(260,canvas.value.clientHeight);});observer.observe(canvas.value); }
  else {observer?.disconnect();dialog.value?.close();}
});
onBeforeUnmount(()=>{observer?.disconnect();dialog.value?.close();});
</script>
<template>
  <Teleport to="body"><dialog ref="dialog" class="file-map-dialog" aria-labelledby="file-map-title" @cancel.prevent="close()" @click="$event.target===dialog && close()" @keydown.tab="trap">
    <header><h2 id="file-map-title">文件中的算法发现 <span>{{ visible.length }} 个文件</span></h2><button class="button secondary" aria-label="关闭文件分布图" @click="close()"><AppIcon name="close" :size="18" />关闭</button></header>
    <label class="map-search">查找文件<input v-model="query" type="search" placeholder="文件路径" /></label>
    <div ref="canvas" class="full-map"><div v-if="visible.length" :style="{height:mapHeight+'px'}"><FileMapCanvas :files="visible" :width="width" :height="mapHeight" expanded @select="select" /></div><p v-else class="notice">没有匹配的文件。</p></div>
  </dialog></Teleport>
</template>
<style scoped>
.file-map-dialog { width:min(1500px,calc(100% - 40px));height:min(1000px,calc(100dvh - 48px));max-width:none;max-height:none;padding:18px;border:0;border-radius:var(--radius-lg);color:var(--text-primary);background:var(--bg-surface); }.file-map-dialog[open] { display:flex;flex-direction:column;gap:12px; }.file-map-dialog::backdrop { background:rgb(10 20 30 / 40%); }header { display:flex;justify-content:space-between;align-items:center;gap:16px; }h2 { font-size:20px;margin:0; }h2 span { font-size:14px;color:var(--text-secondary);font-weight:400; }.map-search { display:flex;align-items:center;gap:12px; }.map-search input { max-width:400px;flex:1;min-width:0; }.full-map { flex:1;min-height:0;overflow:auto;overscroll-behavior:contain; }@media(max-width:600px) { .file-map-dialog { width:100%;height:100dvh;margin:0;border-radius:0;padding:12px; }h2 { font-size:17px; } }
</style>
