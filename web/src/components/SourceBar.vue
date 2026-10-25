<script setup>
import AppIcon from './AppIcon.vue';
defineProps({ source: String, collapsed: Boolean, busy: Boolean, restored: Boolean, note: String });
defineEmits(['toggle', 'rescan']);
</script>
<template>
  <div class="source-bar">
    <AppIcon name="repository" :size="16" />
    <span class="source-caption">本次来源</span>
    <span class="source-name" :title="source">{{ source }}</span>
    <span v-if="note?.includes('取消')" class="source-note">已取消 · 保留部分结果</span>
    <button data-edit-input class="button secondary compact" @click="$emit('toggle')" :aria-expanded="!collapsed"
      aria-controls="scan-input">{{ collapsed ? '编辑输入' : '收起输入' }}</button>
    <button class="button primary compact" :disabled="busy" @click="$emit('rescan')">
      <AppIcon name="scan" :size="15" />{{ restored ? '确认输入' : busy ? '正在扫描…' : '重新扫描' }}
    </button>
  </div>
</template>
<style scoped>
.source-bar { display: flex; align-items: center; gap: 8px; min-width: 0; min-height: 32px; }
.source-caption { color: var(--text-secondary); font-size: 12px; white-space: nowrap; }
.source-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; }
.button { flex-shrink: 0; }
.source-note { color: var(--warning); font-size: 12px; }
@media (max-width: 600px) {
  .source-bar { flex-wrap: wrap; }
  .source-name { flex-basis: calc(100% - 100px); }
  .source-bar > .button { flex: 1; }
}
</style>
