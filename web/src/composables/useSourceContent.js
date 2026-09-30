import { watch, onUnmounted } from 'vue';
import { request } from '../api/client.js';
import { createSourceCache } from '../utils/sourceCache.js';

export function useSourceContent(result) {
  let controller = new AbortController();
  const cache = createSourceCache((id) => request(
    `/api/tasks/${encodeURIComponent(result.value.task_id)}/sources/${encodeURIComponent(id)}`,
    { signal: controller.signal },
  ));
  function clear() {
    controller.abort();
    controller = new AbortController();
    cache.clear();
  }
  watch(result, clear);
  onUnmounted(clear);
  return async (id) => {
    const source = result.value.sources.find((item) => item.source_id === id);
    if (!source?.content_available || source.content) return source;
    if (!result.value.task_id) throw new Error('此结果未记录源码任务，请重新扫描');
    return cache.load(id);
  };
}
