<script setup>
import { ref } from 'vue';
import KnowledgeContent from './KnowledgeContent.vue';
const visited = ref(false);
</script>
<template>
  <details class="knowledge" @toggle="visited ||= $event.target.open">
    <summary>算法迁移知识</summary>
    <KnowledgeContent v-if="visited" />
  </details>
</template>
<style scoped>
.knowledge { min-width: 0; }
summary { cursor: pointer; font-weight: 600; }
</style>
