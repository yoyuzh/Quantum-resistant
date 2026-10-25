<script setup>
import TaskProgress from './TaskProgress.vue';
import ProgressDetails from './ProgressDetails.vue';
defineProps({ state: Object });
defineEmits(['cancel']);
</script>
<template>
  <div v-if="state.busy" class="scan-activity" role="status">
    <div>
      <strong>{{ state.progress?.stage || '正在准备扫描' }}</strong>
      <span class="muted"> · 已分析 {{ state.progress?.analyzed_files ?? 0 }} 个文件
        · {{ Math.floor(state.progress?.elapsed ?? state.elapsed) }} 秒</span>
      <p v-if="state.connection" class="small">{{ state.connection }}</p>
    </div>
    <div class="activity-actions">
      <details class="activity-details">
        <summary>任务详情</summary>
        <div class="activity-popup"><ProgressDetails :progress="state.progress" /></div>
      </details>
      <TaskProgress :state="state" @cancel="$emit('cancel')" />
    </div>
  </div>
</template>
<style scoped>
.scan-activity { display: flex; justify-content: space-between; align-items: center; gap: 12px;
  padding: 6px 12px; background: var(--accent-soft); font-size: 13px; border-radius: var(--radius); }
.scan-activity :deep(.task-progress) { padding: 0; background: transparent; }
.scan-activity :deep(.task-progress > p) { display: none; }
.scan-activity :deep(.button) { min-height: var(--compact-control-height); }
.activity-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.activity-details { position: relative; }
.activity-popup { position: absolute; top: 100%; right: 0; z-index: 40; padding: 12px;
  width: min(420px, calc(100vw - 32px)); max-height: 50dvh; overflow-y: auto;
  background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius); box-shadow: var(--shadow-lg); }
@media (max-width: 600px) { .scan-activity { flex-wrap: wrap; } }
</style>
