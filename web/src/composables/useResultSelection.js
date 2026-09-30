import { computed, reactive, ref, watch } from 'vue';
import { selectedFindings } from '../utils/analysis.js';
import { findingKey } from '../utils/results.js';

export function useResultSelection(result) {
  const tab = ref('overview');
  const filters = reactive({ sourceId: '', algorithm: '', query: '', target: '', method: '' });
  const selectedKey = ref('');
  const findings = computed(() => selectedFindings(result.value, filters));
  function reset() {
    Object.assign(filters, { sourceId: '', algorithm: '', query: '', target: '', method: '' });
    selectedKey.value = '';
  }
  function select(value) {
    reset();
    Object.assign(filters, value);
    selectedKey.value = '';
    tab.value = 'findings';
  }
  function reveal(asset, location) {
    reset();
    Object.assign(filters, { sourceId: asset.source_id, algorithm: asset.algorithm });
    if (location) selectedKey.value = findingKey({ ...asset, ...location });
    tab.value = 'findings';
  }
  watch(result, () => {
    reset();
    tab.value = 'overview';
  });
  return { tab, filters, findings, selectedKey, reset, select, reveal };
}
