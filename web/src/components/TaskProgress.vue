<script setup>
defineProps({ state: Object });
defineEmits(['cancel']);
</script>
<template>
  <div v-if="state.busy && state.taskId" class="task-progress stack" aria-label="后台任务状态">
    <p v-if="state.progress?.target" class="small muted">当前任务：{{ state.progress.target }}</p>
    <p role="status">
      <strong>{{ state.progress?.stage || '正在恢复任务' }}</strong>
    </p>
    <p class="small muted">
      已采集 {{ state.progress?.collected_files || 0 }} 个文件 · 已分析
      {{ state.progress?.analyzed_files || 0 }} 个文件
      <span v-if="state.progress?.kind === 'popular'">
        · 已结束 {{ state.progress?.completed_repos || 0 }} 个仓库</span
      >
    </p>
    <p v-if="state.connection" class="notice" role="status">{{ state.connection }}</p>
    <button
      type="button"
      class="button secondary"
      :disabled="state.cancelling || state.progress?.cancel_requested"
      @click="$emit('cancel')"
    >
      {{
        state.progress?.cancel_requested
          ? '正在整理已完成部分…'
          : state.cancelling
            ? '正在请求取消…'
            : '取消任务'
      }}
    </button>
    <p class="small muted">可切换来源；刷新页面会恢复查询。服务重启后任务需重新提交。</p>
  </div>
  <p v-else-if="!state.busy && state.taskNote" class="notice" role="status">{{ state.taskNote }}</p>
</template>
<style scoped>
.task-progress {
  overflow-wrap: anywhere;
  padding: 1rem;
  background: var(--accent-soft);
  border-radius: var(--radius);
}
</style>
