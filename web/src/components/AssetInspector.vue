<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import AppIcon from './AppIcon.vue';
import DisclosurePanel from './DisclosurePanel.vue';
import { assetKey, methodLabel } from '../utils/analysis.js';
import { statusLabel } from '../utils/verification.js';
const props = defineProps({ asset: Object, items: Array, active: Boolean, trigger: Object });
const emit = defineEmits(['close', 'select', 'reveal']);
const dialog = ref(null), content = ref(null);
const index = computed(() => props.items.findIndex(a => assetKey(a) === assetKey(props.asset || {})));
async function close(restore = true) {
  dialog.value?.close();
  emit('close');
  await nextTick();
  if (restore && props.active && props.trigger?.isConnected) props.trigger.focus({ preventScroll: true });
}
function reveal(location) {
  const asset=props.asset;
  close(false);
  emit('reveal', asset, location);
}
function trapFocus(event) {
  const controls=[...dialog.value.querySelectorAll('button:not(:disabled),summary,a[href],[tabindex="0"]')]
    .filter(e=>e.getClientRects().length);
  const first=controls[0],last=controls.at(-1);
  if (event.shiftKey && document.activeElement===first) { event.preventDefault();last?.focus(); }
  else if (!event.shiftKey && document.activeElement===last) { event.preventDefault();first?.focus(); }
}
watch([() => props.asset, () => props.active], async () => {
  await nextTick();
  if (props.asset && props.active) {
    if (!dialog.value.open) dialog.value.showModal();
    if (content.value) content.value.scrollTop = 0;
  } else dialog.value?.close();
}, { immediate: true, flush: 'post' });
onBeforeUnmount(() => dialog.value?.close());
</script>
<template>
  <Teleport to="body">
    <dialog ref="dialog" class="asset-drawer" aria-labelledby="asset-title"
      @keydown.tab="trapFocus" @cancel.prevent="close()" @click="$event.target === dialog && close()">
      <template v-if="asset">
        <header class="asset-drawer-header">
          <div><h2 id="asset-title">{{ asset.algorithm }} · 资产详情</h2><span class="tag">{{ statusLabel(asset.verification_status) }}</span></div>
          <button class="button secondary" autofocus aria-label="关闭资产详情" @click="close()"><AppIcon name="close" :size="18" />关闭</button>
        </header>
        <div ref="content" class="asset-drawer-body">
          <h3 class="asset-path">{{ asset.file_name }}</h3>
          <dl>
            <dt>用途</dt><dd>{{ asset.purpose }} <span v-if="asset.purpose_origin==='ai'" class="tag">AI用途研判</span></dd>
            <dt>密码库</dt><dd>{{ asset.libraries?.join(' / ') || '未记录' }}</dd>
            <dt>识别方式</dt><dd>{{ asset.detection_methods?.map(methodLabel).join(' / ') || '未记录' }}</dd>
            <dt>完整 API</dt><dd class="asset-api">{{ asset.resolved_apis?.join('\n') || '未记录' }}</dd>
          </dl>
          <section><h3>迁移参考</h3>
            <ul v-if="asset.migration_references?.length" class="reference-list"><li v-for="r in asset.migration_references" :key="r.label"><strong>{{ r.label }}</strong><span>{{ r.condition }}</span></li></ul>
            <p v-else>{{ asset.targets?.join(' / ') || '补充实际用途与实现后选择迁移方向。' }}</p>
          </section>
          <section><h3>证据位置 <span class="muted">{{ asset.locations?.length }} 项</span></h3>
            <div class="asset-locations"><button v-for="(location,i) in asset.locations" :key="i" class="button secondary" @click="reveal(location)">
              <span>第 {{ location.line }} 行</span><code>{{ location.evidence }}</code><AppIcon name="arrow" :size="16" />
            </button></div>
          </section>
          <DisclosurePanel title="技术信息"><dl><dt>文件身份</dt><dd class="asset-api">{{ asset.source_id }}</dd></dl></DisclosurePanel>
        </div>
        <footer class="asset-drawer-footer"><button class="button secondary" :disabled="index<=0" @click="emit('select',items[index-1])">上一个</button><span>{{ index+1 }} / {{ items.length }}</span><button class="button secondary" :disabled="index>=items.length-1" @click="emit('select',items[index+1])">下一个</button></footer>
      </template>
    </dialog>
  </Teleport>
</template>
<style scoped>
.asset-drawer { position:fixed;inset:0 0 0 auto;margin:0;padding:0;border:0;width:min(720px,100%);max-width:none;height:100dvh;max-height:none;background:var(--bg-surface);color:var(--text-primary);box-shadow:var(--shadow-lg); }
.asset-drawer[open] { display:flex;flex-direction:column; }
.asset-drawer::backdrop { background:rgb(10 20 30 / 35%); }
.asset-drawer-header,.asset-drawer-footer { flex:none;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;background:var(--bg-elevated); }
.asset-drawer-header>div { display:flex;align-items:center;flex-wrap:wrap;gap:12px; }.asset-drawer-header h2 { font-size:20px;margin:0; }
.asset-drawer-body { flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;padding:20px;display:flex;flex-direction:column;gap:24px;font-size:15px; }
.asset-path { margin:0;font-size:17px;overflow-wrap:anywhere; }.asset-drawer-body h3 { font-size:16px;margin:0 0 12px; }
dl { display:grid;grid-template-columns:84px minmax(0,1fr);gap:12px;margin:0; }dt { color:var(--text-secondary); }dd { margin:0;overflow-wrap:anywhere; }.asset-api { font-family:var(--font-mono);white-space:pre-wrap;font-size:14px; }
.reference-list { list-style:none;padding:0;margin:0;display:grid;gap:12px; }.reference-list li { display:grid;gap:4px;padding:12px;background:var(--accent-soft);border-radius:var(--radius); }.reference-list span { color:var(--text-secondary);font-size:14px; }
.asset-locations { display:grid;gap:8px; }.asset-locations button { display:grid;grid-template-columns:auto minmax(0,1fr) auto;text-align:left; }.asset-locations code { overflow-wrap:anywhere;font-size:13px; }
@media(max-width:600px) { .asset-drawer-header,.asset-drawer-footer,.asset-drawer-body { padding:16px; }dl { grid-template-columns:72px minmax(0,1fr); }.asset-locations button { grid-template-columns:minmax(0,1fr) auto; }.asset-locations code { grid-row:2;grid-column:1/-1; } }
</style>
