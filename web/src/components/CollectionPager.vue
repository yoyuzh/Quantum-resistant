<script setup>
defineProps({ pagination: Object, size: Number, variable: Boolean });
defineEmits(['change']);
</script>
<template>
  <div class="collection-pager" aria-label="结果分页">
    <span>{{ pagination.current }} / {{ pagination.pages }} 页 · {{ variable ? '本页' : '每页' }} {{ size }} 项</span>
    <div class="toolbar">
      <button class="button secondary compact" :disabled="pagination.current <= 1" @click="$emit('change', -1)">上一页</button>
      <button class="button secondary compact" :disabled="pagination.current >= pagination.pages" @click="$emit('change', 1)">下一页</button>
    </div>
  </div>
</template>
<style scoped>
.collection-pager { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
  gap: 4px 12px; flex-shrink: 0; padding-top: 4px; font-size: 12px; }
.toolbar { gap: 4px; }
</style>
