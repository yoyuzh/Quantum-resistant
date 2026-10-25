import { computed, watch } from 'vue';
import { graphCapacity, graphData } from '../utils/analysis.js';
import { pageCapacity } from '../utils/workspace.js';
import { useCollectionPagination } from './useCollectionPagination.js';

export function useGraphPagination(assets, query) {
  const matched = computed(() => graphData(assets.value, query.value, 1, 5000).files);
  const pager = useCollectionPagination(matched, item => item.id);
  const graph = computed(() => graphData(assets.value, query.value, pager.page.value, pager.size.value));
  let last = [640, false, true];
  function measure(height, constrained, canvas = true) {
    last = [height, constrained, canvas];
    const rows = pageCapacity(Math.max(0, height - 46), 56, constrained);
    const capacity = canvas && constrained
      ? graphCapacity(assets.value, query.value, rows) : Math.min(12, rows);
    pager.resize(capacity);
  }
  function changePage(delta) {
    pager.changePage(delta);
  }
  watch(query, () => measure(...last));
  return { ...pager, graph, measure, changePage };
}
