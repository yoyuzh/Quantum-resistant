import { onScopeDispose, ref } from 'vue';
import { request } from '../api/client.js';

export function useKnowledge(fetchKnowledge = request) {
  const algorithms = ref([]);
  const error = ref('');
  const busy = ref(false);
  const loaded = ref(false);
  let controller;
  let disposed = false;
  async function load() {
    if (busy.value || loaded.value || disposed) return;
    busy.value = true;
    error.value = '';
    controller = new AbortController();
    try {
      const graph = await fetchKnowledge('/api/knowledge/graph', { signal: controller.signal });
      if (disposed) return;
      algorithms.value = graph.nodes.filter(node => node.type === 'Algorithm');
      loaded.value = true;
    } catch (err) {
      if (!disposed) error.value = err.message;
    } finally {
      busy.value = false;
    }
  }
  onScopeDispose(() => { disposed = true; controller?.abort(); });
  return { algorithms, error, busy, load };
}
