import { computed, ref, watch } from 'vue';
import { findingKey, paginate } from '../utils/results.js';
import { pageCapacity } from '../utils/workspace.js';

export function useFindingPagination(items, requestedKey) {
  const page = ref(1);
  const size = ref(10);
  const activeKey = ref('');
  const pagination = computed(() => paginate(items.value, page.value, size.value));
  const active = computed(() => items.value.find(item => findingKey(item) === activeKey.value));
  function choose(item) {
    activeKey.value = item ? findingKey(item) : '';
    const index = items.value.findIndex(item => findingKey(item) === activeKey.value);
    if (index >= 0) page.value = Math.floor(index / size.value) + 1;
  }
  function changePage(delta) {
    page.value = Math.max(1, Math.min(pagination.value.pages, pagination.value.current + delta));
    choose(pagination.value.items[0]);
  }
  function measure(height, constrained, rowHeight = 52) {
    const anchor = active.value || pagination.value.items[0];
    size.value = pageCapacity(height, rowHeight, constrained);
    choose(anchor);
  }
  watch(items, () => {
    page.value = 1;
    const requested = items.value.find(item => findingKey(item) === requestedKey?.value);
    choose(requested || items.value[0]);
  }, { immediate: true });
  watch(() => requestedKey?.value, key => {
    if (!key) return;
    const item = items.value.find(item => findingKey(item) === key);
    if (item) choose(item);
  });
  return { page, size, pagination, activeKey, active, choose, changePage, measure };
}
