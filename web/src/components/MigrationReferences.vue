<script setup>
import { nextTick, onBeforeUnmount, ref, toRef, useId, watch } from 'vue';
import { referenceTabs, useReferenceDrawer } from '../composables/useReferenceDrawer.js';
import AppIcon from './AppIcon.vue';
import KnowledgeContent from './KnowledgeContent.vue';
import MigrationSteps from './MigrationSteps.vue';
const props = defineProps({ analysis: Object, presentation: Object, active: Boolean });
const content = ref(null);
const dialog = ref(null);
const closeButton = ref(null);
const id = useId();
const { opened, tab, visited, open, close, select } = useReferenceDrawer(toRef(props, 'analysis'), toRef(props, 'active'), content);
watch(opened, async value => {
  if (value) {
    dialog.value.showModal();
    await nextTick();
    closeButton.value?.focus({ preventScroll: true });
  } else if (dialog.value.open) dialog.value.close();
}, { flush: 'post' });
function keys(event, index) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3;
  select(referenceTabs[next][0]);
  event.currentTarget.parentElement.children[next].focus();
}
onBeforeUnmount(() => dialog.value?.close());
</script>
<template>
  <div class="reference-tools" aria-label="迁移参考">
    <button v-for="[value, label] in referenceTabs" :key="value" class="button text-action"
      aria-haspopup="dialog" :aria-expanded="opened && tab === value" :aria-controls="`${id}-drawer`"
      @click="open(value, $event.currentTarget)">{{ label }}<AppIcon name="arrow" :size="14" /></button>
  </div>
  <Teleport to="body">
    <dialog :id="`${id}-drawer`" ref="dialog" class="reference-drawer" aria-label="迁移参考"
      @cancel.prevent="close()" @click="($event.target === dialog) && close()">
      <div class="reference-shell">
        <div class="reference-heading"><h2>迁移参考</h2>
          <button ref="closeButton" class="button secondary compact" aria-label="关闭迁移参考" @click="close()">
            <AppIcon name="close" :size="16" />关闭</button>
        </div>
        <div class="reference-tabs" role="tablist" aria-label="迁移参考分类">
          <button v-for="([value, label], index) in referenceTabs" :id="`${id}-${value}`" :key="value" class="button"
            role="tab" :aria-selected="tab === value" :aria-controls="`${id}-content`" :tabindex="tab === value ? 0 : -1"
            @click="select(value)" @keydown="keys($event, index)">{{ label }}</button>
        </div>
        <div :id="`${id}-content`" ref="content" class="reference-content" role="tabpanel" tabindex="0" :aria-labelledby="`${id}-${tab}`">
          <div v-show="tab === 'workflow'">
            <MigrationSteps v-if="presentation.shared.length" :actions="presentation.shared" />
            <p v-else class="notice">当前结果没有通用迁移流程，请通过对应记录的“查看方案”打开迁移步骤。</p>
          </div>
          <KnowledgeContent v-if="visited.has('knowledge')" v-show="tab === 'knowledge'" />
          <div v-show="tab === 'standards'" class="reference-links">
            <p class="small muted">静态标准参考，请结合密码用途和平台支持复核。</p>
            <a v-for="(url, index) in presentation.references" :key="url" :href="url" target="_blank" rel="noopener noreferrer"
              class="button text-action"><AppIcon name="external" :size="16" />NIST 标准参考{{ presentation.references.length > 1 ? ` ${index + 1}` : '' }}</a>
            <p v-if="!presentation.references.length" class="notice">当前结果未提供 NIST 标准参考链接。</p>
          </div>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>
<style scoped>
.reference-tools { display: flex; flex-wrap: wrap; align-items: center; gap: 0 16px; }
.reference-tools .button { font-size: 13px; }
.reference-drawer { position: fixed; inset: 0 0 0 auto; margin: 0; padding: 0; border: 0; width: min(640px, 100%);
  max-width: none; height: 100dvh; max-height: none; background: var(--bg-surface); color: var(--text-primary); box-shadow: var(--shadow-lg); }
.reference-drawer::backdrop { background: rgb(10 20 30 / 35%); }
.reference-shell { display: flex; flex-direction: column; height: 100%; min-height: 0; }
.reference-heading { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; flex-shrink: 0; }
.reference-heading h2 { font-size: 16px; }
.reference-tabs { display: flex; flex-shrink: 0; padding: 0 12px; }
.reference-tabs .button { flex: 1; background: transparent; color: var(--text-secondary); border-radius: 0; font-size: 13px; }
.reference-tabs [aria-selected='true'] { color: var(--accent-dim); box-shadow: inset 0 -2px var(--accent); font-weight: 600; }
.reference-content { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 16px; font-size: 13px; color: var(--text-secondary); }
.reference-links { display: grid; justify-items: start; gap: 8px; }
@media (max-width: 600px) {
  .reference-tools { gap: 0 12px; }
  .reference-tabs { padding-inline: 4px; }
  .reference-tabs .button { padding-inline: 4px; }
}
@media (forced-colors: active) {
  .reference-tabs [aria-selected='true'] { border-bottom: 2px solid Highlight; }
}
</style>
