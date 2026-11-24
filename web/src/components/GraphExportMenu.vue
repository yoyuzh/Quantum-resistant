<script setup>
import { ref } from 'vue';
import AppIcon from './AppIcon.vue';
const props = defineProps({ exportView: Function, exportList: Function, disabled: Boolean });
const menu = ref(null), trigger = ref(null), error = ref('');
const pending = ref(false), prepared = ref(null);
async function choose(format) {
  menu.value.open = false;
  trigger.value.focus();
  error.value = '';
  if (format === 'save') {
    prepared.value?.();
    prepared.value = null;
    return;
  }
  prepared.value = null;
  pending.value = true;
  try {
    if (format === 'list') props.exportList();
    else {
      const save = await props.exportView(format);
      if (typeof save === 'function' && menu.value) {
        prepared.value = save;
        menu.value.open = true;
      }
    }
  } catch { error.value = '导出失败，请重试。'; }
  finally { pending.value = false; }
}
</script>
<template>
  <details ref="menu" class="graph-export" @keydown.esc.stop.prevent="menu.open = false; trigger.focus()" @focusout="!menu.contains($event.relatedTarget) && (menu.open = false)">
    <summary ref="trigger" class="button secondary compact"><AppIcon name="download" :size="16" />{{ pending ? '正在导出' : '导出' }}</summary>
    <div class="export-options">
      <button v-if="prepared" class="button secondary compact" @click="choose('save')">保存已生成的 PNG</button>
      <button class="button text-action compact" :disabled="disabled || pending" @click="choose('html')">交互图（HTML）</button>
      <button class="button text-action compact" :disabled="disabled || pending" @click="choose('png')">完整图图片（PNG）</button>
      <button v-if="exportList" class="button text-action compact" :disabled="pending" @click="choose('list')">仓库清单（Markdown）</button>
    </div>
  </details>
  <p v-if="error" class="small" role="alert">{{ error }}</p>
</template>
<style scoped>
.graph-export { position:relative; }
summary { list-style:none; cursor:pointer; }
summary::-webkit-details-marker { display:none; }
.export-options { position:absolute; z-index:8; inset:calc(100% + 4px) 0 auto auto; min-width:max-content; display:grid;
  padding:5px; border:1px solid var(--border); border-radius:var(--radius); background:var(--bg-surface); box-shadow:var(--shadow-lg); }
.export-options button { justify-content:flex-start; }
</style>
