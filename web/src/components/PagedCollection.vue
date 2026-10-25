<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, toRef, watch } from 'vue';
import { useCollectionPagination } from '../composables/useCollectionPagination.js';
import { collectionLayout } from '../utils/workspace.js';
import { focusDestination } from '../utils/navigation.js';
import CollectionPager from './CollectionPager.vue';
const props = defineProps({ items: Array, itemKey: Function, label: String,
  rowHeight: { type: Number, default: 92 }, touchRowHeight: { type: Number, default: 120 } });
const root = ref(null);
const heading = ref(null);
const viewport = ref(null);
const columns = ref(1);
const recordHeight = ref(props.rowHeight);
const { size, pagination, resize, changePage } = useCollectionPagination(toRef(props, 'items'), props.itemKey);
const compact = computed(() => props.items.length <= size.value);
let observer;
let media;
let touch;
function measure() {
  if (!root.value?.getClientRects().length) return;
  recordHeight.value = touch.matches ? props.touchRowHeight : props.rowHeight;
  const control = parseFloat(getComputedStyle(root.value).getPropertyValue('--compact-control-height')) || 32;
  const layout = collectionLayout({ height: root.value.clientHeight, width: root.value.clientWidth,
    count: props.items.length, heading: heading.value?.offsetHeight || 0,
    pager: control + 6, rowHeight: recordHeight.value, constrained: media.matches });
  columns.value = layout.columns;
  resize(layout.size);
}
async function turn(delta) {
  changePage(delta);
  await nextTick();
  viewport.value.scrollTop = 0;
  if (!media.matches) focusDestination(root.value, root.value.closest('.panel-body'),
    root.value.closest('.result-layout')?.querySelector('.result-sticky'));
}
onMounted(() => {
  media = window.matchMedia('(min-width: 1024px) and (min-height: 600px)');
  touch = window.matchMedia('(max-width: 600px), (pointer: coarse)');
  observer = new ResizeObserver(measure);
  observer.observe(root.value);
  observer.observe(heading.value);
  media.addEventListener('change', measure);
  touch.addEventListener('change', measure);
  measure();
});
onUnmounted(() => {
  observer?.disconnect();
  media?.removeEventListener('change', measure);
  touch?.removeEventListener('change', measure);
});
watch([() => props.rowHeight, () => props.items.length], () => { if (media) nextTick(measure); });
</script>
<template>
  <section ref="root" class="collection-view" :class="{ compact, solitary: items.length <= 1, pair: items.length === 2 }" :aria-label="label" tabindex="-1">
    <div ref="heading" class="collection-heading"><slot name="heading" /></div>
    <div ref="viewport" class="collection-viewport">
      <div v-if="items.length" class="collection-grid" :style="{ '--columns': columns, '--record-height': `${recordHeight}px` }">
        <template v-for="item in pagination.items" :key="itemKey(item)"><slot :item="item" /></template>
      </div>
      <slot v-else name="empty" />
    </div>
    <CollectionPager v-if="!compact" :pagination="pagination" :size="size" @change="turn" />
  </section>
</template>
<style scoped>
.collection-view { display: flex; flex-direction: column; width: 100%; min-width: 0; min-height: 0; gap: 8px; }
.collection-view.solitary { max-width: 720px; }
.collection-view.pair { max-width: 1200px; }
.collection-heading { flex-shrink: 0; }
.collection-heading :deep(h3) { font-size: 14px; }
.collection-grid { display: grid; grid-template-columns: repeat(var(--columns), minmax(0, 1fr)); gap: 8px 12px; align-items: start; }
.collection-grid > :deep(*) { min-height: var(--record-height); }
@media (min-width: 1024px) and (min-height: 600px) {
  .collection-view { flex: 1; }
  .collection-viewport { flex: 1; min-height: 0; overflow-y: auto; }
  .compact .collection-viewport { flex: 0 1 auto; }
}
</style>
