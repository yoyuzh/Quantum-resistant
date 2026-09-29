<script setup>
import { onMounted, ref } from 'vue';
import { request } from '../api/client.js';
const algorithms = ref([]);
const error = ref('');
async function load() {
  error.value = '';
  try {
    const graph = await request('/api/knowledge/graph');
    algorithms.value = graph.nodes.filter((n) => n.type === 'Algorithm');
  } catch (err) {
    error.value = err.message;
  }
}
onMounted(load);
</script>

<template>
  <details class="knowledge">
    <summary>算法迁移知识 <span class="muted small">静态知识参考</span></summary>
    <p class="muted small">这是算法与迁移方向的知识说明，不是本次项目的实际依赖关系图。</p>
    <div v-if="error" class="notice error">
      {{ error }} <button class="button secondary" @click="load">重新加载知识</button>
    </div>
    <dl>
      <template v-for="algorithm in algorithms" :key="algorithm.id"
        ><dt>{{ algorithm.label }}</dt>
        <dd>{{ algorithm.recommendation }}</dd></template
      >
    </dl>
  </details>
</template>

<style scoped>
.knowledge {
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
summary {
  cursor: pointer;
  font-weight: 600;
}
dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.7rem;
  font-size: 0.78rem;
  line-height: 1.6;
}
dt {
  color: var(--accent-dim);
}
dd {
  margin: 0;
}
</style>
