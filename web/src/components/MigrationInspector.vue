<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import AppIcon from './AppIcon.vue';
import MigrationSteps from './MigrationSteps.vue';
import { statusLabel } from '../utils/verification.js';
const props = defineProps({ item: Object, shared: Array, active: Boolean, trigger: Object });
const emit = defineEmits(['close', 'select']);
const dialog = ref(null), body = ref(null);
const actions = computed(() => [...new Map([...(props.shared || []), ...(props.item?.actions || [])]
  .map(a => [JSON.stringify([a.title, a.description]), a])).values()]);
async function close(restore = true) {
  dialog.value?.close();
  emit('close');
  await nextTick();
  if (restore && !props.item && props.active && props.trigger?.isConnected) props.trigger.focus({preventScroll:true});
}
function reveal() {
  const item=props.item;
  close(false);
  emit('select',{algorithm:item.algorithm,purpose:item.purpose_code || '',sourceId:'',target:''});
}
function trapFocus(event) {
  const controls=[...dialog.value.querySelectorAll('button:not(:disabled),a[href],[tabindex="0"]')]
    .filter(e=>e.getClientRects().length);
  const first=controls[0],last=controls.at(-1);
  if (event.shiftKey && document.activeElement===first) { event.preventDefault();last?.focus(); }
  else if (!event.shiftKey && document.activeElement===last) { event.preventDefault();first?.focus(); }
}
watch([()=>props.item,()=>props.active],async()=>{
  await nextTick();
  if (props.item && props.active) {
    if (!dialog.value.open) dialog.value.showModal();
    if (body.value) body.value.scrollTop=0;
  } else dialog.value?.close();
},{immediate:true,flush:'post'});
onBeforeUnmount(()=>dialog.value?.close());
</script>
<template>
  <Teleport to="body">
    <dialog ref="dialog" class="migration-dialog" aria-labelledby="migration-plan-title"
      @keydown.tab="trapFocus" @cancel.prevent="close()" @click="$event.target===dialog && close()">
      <template v-if="item">
        <header><div><h2 id="migration-plan-title">{{ item.algorithm }} 迁移方案</h2><span class="tag">{{ statusLabel(item.verification_status) }}</span></div>
          <button class="button secondary" autofocus aria-label="关闭迁移方案" @click="close()"><AppIcon name="close" :size="18" />关闭</button></header>
        <div ref="body" class="migration-dialog-body">
          <div class="plan-purpose"><strong>{{ item.purpose }}</strong><span v-if="item.purpose_origin==='ai'" class="tag">AI用途研判</span><span>{{ item.affected_files }} 个文件 · {{ item.finding_count }} 项发现</span></div>
          <section v-if="item.migration_references?.length" class="plan-references"><h3>迁移参考</h3>
            <div v-for="reference in item.migration_references" :key="reference.label"><strong>{{ reference.label }}</strong><p>{{ reference.condition }}</p></div>
          </section>
          <section><h3>实施步骤</h3><MigrationSteps v-if="actions.length" :actions="actions" /><p v-else>先确认密码用途与协议，再安排兼容性和迁移测试。</p></section>
        </div>
        <footer><button class="button secondary" @click="reveal">查看相关证据<AppIcon name="arrow" :size="16" /></button></footer>
      </template>
    </dialog>
  </Teleport>
</template>
<style scoped>
.migration-dialog { width:min(760px,calc(100% - 32px));max-width:none;max-height:calc(100dvh - 48px);padding:0;border:0;border-radius:var(--radius-lg);background:var(--bg-surface);color:var(--text-primary);box-shadow:var(--shadow-lg); }
.migration-dialog[open] { display:flex;flex-direction:column; }.migration-dialog::backdrop { background:rgb(10 20 30 / 35%); }
header,footer { flex:none;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;background:var(--bg-elevated); }header>div { display:flex;align-items:center;gap:12px;flex-wrap:wrap; }h2 { font-size:20px;margin:0; }h3 { font-size:16px;margin:0 0 12px; }
.migration-dialog-body { min-height:0;overflow:auto;overscroll-behavior:contain;padding:20px;display:grid;gap:24px;font-size:15px; }.plan-purpose { display:flex;flex-wrap:wrap;align-items:center;gap:12px; }.plan-purpose>span:last-child { color:var(--text-secondary); }
.plan-references>div { padding:12px;margin-top:8px;background:var(--accent-soft);border-radius:var(--radius);overflow-wrap:anywhere; }.plan-references p { color:var(--text-secondary);font-size:14px;margin:6px 0 0; }
footer { justify-content:flex-end; }
@media(max-width:600px) { .migration-dialog { width:100%;height:100dvh;max-height:none;margin:0;border-radius:0; }.migration-dialog-body { flex:1; }header,footer,.migration-dialog-body { padding:16px; } }
</style>
