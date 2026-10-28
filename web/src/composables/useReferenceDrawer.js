import { nextTick, onScopeDispose, reactive, ref, watch } from 'vue';

export const referenceTabs = [
  ['workflow', '通用迁移流程'], ['knowledge', '算法迁移知识'], ['standards', 'NIST 标准参考'],
];

export function useReferenceDrawer(result, active, content) {
  const opened = ref(false);
  const tab = ref('workflow');
  const visited = reactive(new Set());
  const positions = new Map();
  let trigger;
  let revision = 0;
  function remember() {
    if (opened.value && content.value) positions.set(tab.value, content.value.scrollTop);
  }
  async function select(value) {
    remember();
    tab.value = value;
    visited.add(value);
    const current = ++revision;
    await nextTick();
    if (current === revision && content.value) content.value.scrollTop = positions.get(value) || 0;
  }
  function open(value, element) {
    trigger = element;
    select(value);
    opened.value = true;
  }
  async function close(restoreFocus = true) {
    remember();
    opened.value = false;
    revision++;
    await nextTick();
    if (restoreFocus && !opened.value && active.value && trigger?.isConnected) trigger.focus({ preventScroll: true });
  }
  watch(active, value => { if (!value) close(false); });
  watch(result, () => {
    close(false);
    positions.clear();
    visited.clear();
    tab.value = 'workflow';
  });
  onScopeDispose(() => { revision++; });
  return { opened, tab, visited, open, close, select };
}
