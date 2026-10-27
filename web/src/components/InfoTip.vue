<script setup>
import { nextTick, onMounted, onUnmounted, ref, useId } from 'vue';
import AppIcon from './AppIcon.vue';
defineProps({ label: { type: String, default: '查看说明' } });
const id = useId();
const trigger = ref(null), popup = ref(null), opened = ref(false), pinned = ref(false);
const target = ref('body'), placement = ref({});
let timer;
function retain() { clearTimeout(timer); }
async function show() {
  clearTimeout(timer);
  document.dispatchEvent(new CustomEvent('scanner-info-open', {detail:id}));
  opened.value = true;
  await nextTick();
  position();
}
function position() {
  if (!opened.value || !trigger.value || !popup.value) return;
  const anchor = trigger.value.getBoundingClientRect();
  if (anchor.bottom < 0 || anchor.top > innerHeight) { hide(); return; }
  const box = popup.value.getBoundingClientRect();
  placement.value = {
    left: `${Math.max(8, Math.min(anchor.right - box.width, innerWidth - box.width - 8))}px`,
    top: `${Math.max(8, Math.min(innerHeight-box.height-8,anchor.bottom + box.height + 12 < innerHeight ? anchor.bottom + 6 : anchor.top - box.height - 6))}px`,
  };
}
function hide() {
  clearTimeout(timer);
  opened.value = false;
  pinned.value = false;
}
function leave() {
  clearTimeout(timer);
  timer = setTimeout(() => { if (!pinned.value && document.activeElement !== trigger.value) hide(); }, 150);
}
function toggle() {
  if (pinned.value) hide();
  else { pinned.value = true; show(); }
}
function outside(event) {
  if (!trigger.value?.contains(event.target) && !popup.value?.contains(event.target)) hide();
}
function escape(event) {
  if (event.key === 'Escape' && opened.value) { event.preventDefault(); event.stopPropagation(); hide(); }
}
function anotherOpened(event) { if (event.detail !== id) hide(); }
onMounted(() => {
  target.value = trigger.value.closest('dialog') || 'body';
  document.addEventListener('pointerdown', outside, true);
  document.addEventListener('keydown', escape, true);
  document.addEventListener('scanner-info-open', anotherOpened);
  window.addEventListener('resize', hide);
  window.addEventListener('scroll', position, true);
});
onUnmounted(() => {
  clearTimeout(timer);
  document.removeEventListener('pointerdown', outside, true);
  document.removeEventListener('keydown', escape, true);
  document.removeEventListener('scanner-info-open', anotherOpened);
  window.removeEventListener('resize', hide);
  window.removeEventListener('scroll', position, true);
});
</script>
<template>
  <button ref="trigger" type="button" class="info-trigger" :aria-label="label"
    :aria-describedby="opened ? id : undefined" :aria-expanded="opened"
    @mouseenter="show" @mouseleave="leave" @focus="show" @blur="leave" @click.stop="toggle">
    <AppIcon name="info" :size="16" />
  </button>
  <Teleport :to="target">
    <div v-if="opened" :id="id" ref="popup" class="info-popup" role="tooltip" :style="placement"
      @mouseenter="retain" @mouseleave="leave"><slot /></div>
  </Teleport>
</template>
<style scoped>
.info-trigger { display:inline-flex; align-items:center; justify-content:center; vertical-align:middle;
  flex-shrink:0; width:28px; height:28px; padding:0; border:0; border-radius:50%; background:transparent;
  color:var(--text-secondary); cursor:help; line-height:1; }
.info-trigger:hover, .info-trigger[aria-expanded='true'] { color:var(--accent); background:var(--accent-soft); }
.info-popup { position:fixed; z-index:220; width:max-content; max-width:min(360px,calc(100vw - 16px));
  max-height:60dvh; overflow-y:auto; padding:10px 12px; border:1px solid var(--border-light);
  border-radius:var(--radius); box-shadow:var(--shadow-lg); background:var(--bg-surface);
  color:var(--text-primary); font-size:13px; line-height:1.6; overflow-wrap:anywhere; }
.info-popup :deep(p + p) { margin-top:6px; }
@media(pointer:coarse) { .info-trigger { width:40px; height:40px; } }
</style>
