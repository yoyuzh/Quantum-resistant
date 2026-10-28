import { computed, ref, watch } from 'vue';
import { paginate } from '../utils/results.js';

// Keep a stable identity in view when the viewport changes its page capacity.
export function useCollectionPagination(items, key, initialSize = 10) {
  const page = ref(1);
  const size = ref(initialSize);
  const pagination = computed(() => paginate(items.value, page.value, size.value));
  function resize(capacity, locked = false) {
    if (locked) return;
    const anchor = pagination.value.items[0];
    size.value = capacity;
    const index = anchor ? items.value.findIndex(item => key(item) === key(anchor)) : 0;
    page.value = Math.floor(Math.max(0, index) / capacity) + 1;
  }
  function changePage(delta) {
    page.value = Math.max(1, Math.min(pagination.value.pages, pagination.value.current + delta));
  }
  watch(items, () => { page.value = 1; });
  return { page, size, pagination, resize, changePage };
}
