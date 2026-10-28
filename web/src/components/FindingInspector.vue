<script setup>
import { onBeforeUnmount, ref, watch } from 'vue';
import AppIcon from './AppIcon.vue';
import FindingDetail from './FindingDetail.vue';
const props = defineProps({ finding: Object, sources: Array, peers: Array, loadSource: Function,
  wide: Boolean, opened: Boolean });
const emit = defineEmits(['close']);
const dialog = ref(null);
watch([() => props.opened, () => props.wide, () => props.finding], () => {
  const element = dialog.value;
  if (!element) return;
  if (props.opened && !props.wide && props.finding) {
    if (!element.open) element.showModal();
  } else if (element.open) element.close();
}, { flush: 'post' });
onBeforeUnmount(() => dialog.value?.close());
</script>
<template>
  <aside v-if="wide" class="inspector" aria-label="发现详情与源码" tabindex="0">
    <div class="inspector-heading">详情与源码</div>
    <div class="inspector-content"><FindingDetail :finding="finding" :sources="sources" :peers="peers" :load-source="loadSource" /></div>
  </aside>
  <Teleport to="body">
    <dialog ref="dialog" class="finding-drawer" aria-label="发现详情与源码"
      @cancel.prevent="emit('close')" @click="($event.target === dialog) && emit('close')">
      <div class="drawer-content">
        <div class="inspector-heading">详情与源码
          <button class="button secondary compact" aria-label="关闭详情，返回发现列表" autofocus @click="emit('close')">
            <AppIcon name="close" :size="16" />关闭
          </button>
        </div>
        <div class="inspector-content"><FindingDetail v-if="opened && !wide" :finding="finding"
          :sources="sources" :peers="peers" :load-source="loadSource" /></div>
      </div>
    </dialog>
  </Teleport>
</template>
<style scoped>
.inspector { min-width: 0; min-height: 0; display: flex; flex-direction: column;
  border-left: 1px solid var(--border-light); background: var(--bg-elevated); }
.inspector-heading { display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
  min-height: 28px; padding: 4px 12px; color: var(--text-secondary); font-size: 12px; }
.inspector-content { flex: 1; min-width: 0; min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
.finding-drawer { position: fixed; inset: 0 0 0 auto; margin: 0; padding: 0; border: 0;
  width: min(480px, calc(100% - 12px)); max-width: none; height: 100dvh; max-height: none;
  background: var(--bg-surface); color: var(--text-primary); box-shadow: var(--shadow-lg); }
.finding-drawer::backdrop { background: rgb(10 20 30 / 40%); }
.drawer-content { height: 100%; display: flex; flex-direction: column; }
@media (max-width: 600px) { .inspector-heading { min-height: 56px; } }
</style>
