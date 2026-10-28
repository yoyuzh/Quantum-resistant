<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import AppIcon from './AppIcon.vue';
import { notice, dismissNotice } from '../composables/useNotice.js';
const popup = ref(null), target = ref('body'), displayed = ref(null), visible = ref(false);
let timer, leaveTimer, parent, frame, generation = 0;
async function position() {
  const ticket = ++generation;
  popup.value?.hidePopover?.();
  parent?.removeEventListener('close', position);
  parent = [...document.querySelectorAll('dialog[open]')].filter(e => e.getClientRects().length).at(-1);
  target.value = parent || 'body';
  await nextTick();
  if (ticket !== generation || !displayed.value) return;
  try { popup.value.showPopover?.(); } catch { /* Fixed placement remains available. */ }
  parent?.addEventListener('close', position, { once: true });
}
watch(notice, async value => {
  clearTimeout(timer); clearTimeout(leaveTimer); cancelAnimationFrame(frame);
  if (!value) {
    visible.value = false;
    leaveTimer = setTimeout(() => {
      popup.value?.hidePopover?.(); displayed.value = null;
      parent?.removeEventListener('close', position); generation++;
    }, 200);
    return;
  }
  displayed.value = value; visible.value = false;
  await position();
  if (notice.value?.id !== value.id) return;
  // Two paints start the transition in the native popover top layer as well.
  frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => { visible.value = true; }); });
  if (value.duration) timer = setTimeout(() => dismissNotice(value.id), value.duration);
}, { immediate: true });
onBeforeUnmount(() => {
  generation++; clearTimeout(timer); clearTimeout(leaveTimer); cancelAnimationFrame(frame);
  parent?.removeEventListener('close', position);
});
</script>
<template>
  <Teleport :to="target"><div v-if="displayed" ref="popup" popover="manual" class="centered-notice" :class="[displayed.kind,{visible}]"
    :role="displayed.kind==='error'?'alert':'status'" :aria-live="displayed.kind==='error'?'assertive':'polite'">
    <div class="notice-icon"><AppIcon :name="displayed.kind==='success'?'shield':displayed.kind==='loading'?'scan':'info'" :size="26" /></div>
    <div class="notice-content"><strong>{{ displayed.message }}</strong><a v-if="displayed.action" class="button text-action compact" :href="displayed.action.url" :download="displayed.action.filename">再次下载</a></div>
  </div></Teleport>
</template>
<style scoped>
.centered-notice { display:flex;align-items:center;gap:14px;position:fixed;inset:50% auto auto 50%;transform:translate(-50%,calc(-50% + 6px));opacity:0;transition:opacity 180ms ease,transform 180ms ease;margin:0;z-index:1000;width:min(440px,calc(100vw - 32px));padding:20px;border:0;border-radius:var(--radius-lg);background:var(--bg-surface);color:var(--text-primary);box-shadow:0 14px 64px rgb(0 0 0 / 24%);pointer-events:none; }
.centered-notice.visible { opacity:1;transform:translate(-50%,-50%); }
.centered-notice:popover-open { display:flex;align-items:center;gap:14px; }
.notice-icon { flex:none;display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:var(--control-selected);color:var(--accent); }
.notice-content { flex:1;min-width:0;overflow-wrap:anywhere;font-size:15px; }.notice-content strong { font-weight:600; }.notice-content a { pointer-events:auto; }
.error .notice-icon { color:var(--risk-high);background:var(--bg-elevated); }
.loading .notice-icon svg { animation:rotate 2.5s linear infinite; }@keyframes rotate { to {transform:rotate(360deg);} }
@media(prefers-reduced-motion:reduce){.centered-notice{transition:none;}.loading .notice-icon svg {animation:none;}}
</style>
