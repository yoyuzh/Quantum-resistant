import { computed, nextTick, onScopeDispose, reactive, ref, shallowRef, watch } from 'vue';
import { selectedFindings } from '../utils/analysis.js';
import { findingKey } from '../utils/results.js';
import { capturePosition, ensureFocusVisible, focusDestination, restorePosition } from '../utils/navigation.js';
import { fileLabel } from '../utils/presentation.js';

const emptyFilters = () => ({ sourceId: '', algorithm: '', query: '', target: '', method: '' });

export function useResultSelection(result, { body, header } = {}) {
  const tab = ref('overview');
  const filters = reactive(emptyFilters());
  const assetFilters = reactive(emptyFilters());
  const visited = reactive(new Set(['overview']));
  const origin = shallowRef(null);
  const announcement = ref('');
  const selectedKey = ref('');
  const findings = computed(() => selectedFindings(result.value, filters));
  const assetFindings = computed(() => selectedFindings(result.value, assetFilters));
  let sequence = 0;
  let animation;

  function cancelNavigation() {
    sequence++;
    animation?.cancel();
  }
  function reset() {
    cancelNavigation();
    Object.assign(filters, emptyFilters());
    if (tab.value === 'assets') Object.assign(assetFilters, emptyFilters());
    selectedKey.value = '';
    announcement.value = '';
  }

  async function switchTab(value) {
    cancelNavigation();
    origin.value = null;
    announcement.value = '';
    visited.add(value);
    if (value === 'assets') Object.assign(assetFilters, filters);
    tab.value = value;
    const id = sequence;
    await nextTick();
    if (id === sequence && body?.value) {
      if (capturePosition(body.value).panel) body.value.scrollTop = 0;
    }
  }

  async function select(value, location) {
    cancelNavigation();
    const id = sequence;
    origin.value = tab.value === 'findings' && origin.value ? origin.value : {
      tab: tab.value, filters: { ...filters }, selectedKey: selectedKey.value,
      trigger: typeof document === 'undefined' ? null : document.activeElement,
      position: body?.value ? capturePosition(body.value) : null,
    };
    Object.assign(filters, emptyFilters(), value);
    const match = location
      ? findings.value.find((item) => findingKey(item) === findingKey(location))
      : findings.value[0];
    selectedKey.value = match ? findingKey(match) : '';
    visited.add('findings');
    tab.value = 'findings';
    announcement.value = match
      ? `发现明细 · ${match.algorithm} · ${fileLabel(match, result.value.sources)} · 第 ${match.line} 行`
      : '发现明细 · 当前范围没有匹配证据';
    await nextTick();
    if (id !== sequence || !body?.value) return;
    const target = [...body.value.querySelectorAll('[data-finding-key]')]
      .find((element) => element.dataset.findingKey === selectedKey.value);
    animation = focusDestination(target || body.value.querySelector('.findings-list'),
      body.value, header?.value, { highlight: !!target });
  }

  function reveal(asset, location = asset.locations?.[0]) {
    return select({ sourceId: asset.source_id, algorithm: asset.algorithm },
      location ? { ...asset, ...location } : undefined);
  }

  async function back() {
    if (!origin.value) return;
    cancelNavigation();
    const id = sequence;
    const previous = origin.value;
    origin.value = null;
    Object.assign(filters, previous.filters);
    selectedKey.value = previous.selectedKey;
    tab.value = previous.tab;
    announcement.value = '';
    await nextTick();
    if (id !== sequence) return;
    if (body?.value) restorePosition(body.value, previous.position);
    if (previous.trigger?.isConnected) previous.trigger.focus({ preventScroll: true });
  }

  function updateFilters(value) {
    cancelNavigation();
    Object.assign(filters, value);
    selectedKey.value = '';
    announcement.value = '';
  }
  function keepFocusVisible(event) {
    ensureFocusVisible(event.target, body?.value, header?.value);
  }
  watch(result, () => {
    reset();
    origin.value = null;
    Object.assign(assetFilters, emptyFilters());
    visited.clear();
    visited.add('overview');
    tab.value = 'overview';
  });
  onScopeDispose(cancelNavigation);
  return { tab, filters, findings, assetFindings, visited, origin, announcement,
    selectedKey, reset, select, reveal, back, switchTab, updateFilters, keepFocusVisible };
}
