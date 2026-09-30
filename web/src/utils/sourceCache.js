export function createSourceCache(fetchSource, limit = 10) {
  const cache = new Map();
  const pending = new Map();
  let generation = 0;
  async function load(id, signal) {
    if (cache.has(id)) {
      const value = cache.get(id);
      cache.delete(id);
      cache.set(id, value);
      return value;
    }
    if (pending.has(id)) return pending.get(id);
    const current = generation;
    const promise = fetchSource(id, signal).then((value) => {
      if (current === generation && !signal?.aborted) {
        cache.set(id, value);
        while (cache.size > limit) cache.delete(cache.keys().next().value);
      }
      return value;
    }).finally(() => { if (pending.get(id) === promise) pending.delete(id); });
    pending.set(id, promise);
    return promise;
  }
  return { load, clear: () => { generation++; cache.clear(); pending.clear(); } };
}
