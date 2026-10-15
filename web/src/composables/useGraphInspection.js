import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { inspectGraph } from '../utils/graphInspection.js';

export function useGraphInspection(graph) {
  const pointer = ref(null);
  const focused = ref(null);
  const tooltip = ref(null);
  const position = ref({});
  const inspection = computed(() => inspectGraph(graph.value, pointer.value || focused.value));
  let hideTimer;
  let sequence = 0;
  let focusAnchor;

  function retainPointer() {
    clearTimeout(hideTimer);
  }
  function hidePointer() {
    retainPointer();
    hideTimer = setTimeout(() => { pointer.value = null; }, 100);
  }
  function clearInspection() {
    retainPointer();
    sequence++;
    pointer.value = null;
    focused.value = null;
    focusAnchor = null;
  }
  async function place(event) {
    const id = ++sequence;
    const anchor = event.currentTarget.getBoundingClientRect();
    const x = event.type === 'focus' ? anchor.left : event.clientX;
    const y = event.type === 'focus' ? anchor.bottom : event.clientY;
    await nextTick();
    if (id !== sequence || !tooltip.value) return;
    const rect = tooltip.value.getBoundingClientRect();
    const left = Math.max(8, Math.min(x + 16, window.innerWidth - rect.width - 8));
    const top = y + rect.height + 16 < window.innerHeight ? y + 12 : Math.max(8, y - rect.height - 12);
    position.value = { left: `${left}px`, top: `${top}px` };
  }
  function inspectPointer(selection, event) {
    retainPointer();
    pointer.value = selection;
    place(event);
  }
  function inspectFocus(selection, event) {
    retainPointer();
    pointer.value = null;
    focused.value = selection;
    focusAnchor = event.currentTarget;
    place(event);
  }
  function blurNode() {
    focused.value = null;
    focusAnchor = null;
  }
  function dismiss(event) {
    if (event.key === 'Escape') clearInspection();
  }
  function reposition(event) {
    // Hoverable help must remain open while its own contents are scrolled.
    if (event.type === 'scroll' && tooltip.value?.contains(event.target)) return;
    pointer.value = null;
    if (focused.value && focusAnchor?.isConnected) {
      const rect = focusAnchor.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        place({ type: 'focus', currentTarget: focusAnchor });
        return;
      }
    }
    clearInspection();
  }

  watch(graph, clearInspection);
  onMounted(() => {
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    window.addEventListener('keydown', dismiss);
  });
  onUnmounted(() => {
    clearInspection();
    window.removeEventListener('scroll', reposition, true);
    window.removeEventListener('resize', reposition);
    window.removeEventListener('keydown', dismiss);
  });
  return { inspection, tooltip, position, inspectPointer, inspectFocus, blurNode,
    retainPointer, hidePointer, clearInspection };
}
