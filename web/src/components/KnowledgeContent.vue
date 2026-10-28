<script setup>
import { onMounted } from 'vue';
import { useKnowledge } from '../composables/useKnowledge.js';
const { algorithms, error, busy, load } = useKnowledge();
onMounted(load);
</script>
<template>
  <div class="knowledge-content" :aria-busy="busy">
    <p v-if="busy" class="small muted" role="status">正在加载算法知识…</p>
    <div v-else-if="error" class="notice error" role="alert">
      {{ error }} <button class="button secondary" @click="load">重新加载知识</button>
    </div>
    <dl v-else>
      <template v-for="algorithm in algorithms" :key="algorithm.id">
        <dt>{{ algorithm.label }}</dt><dd>{{ algorithm.recommendation }}</dd>
      </template>
    </dl>
  </div>
</template>
<style scoped>
dl { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 6px 12px; margin: 8px 0;
  font-size: 13px; color: var(--text-secondary); line-height: 1.6; }
dt { color: var(--accent-dim); font-weight: 600; }
dd { margin: 0; overflow-wrap: anywhere; }
</style>
