<script setup>
defineProps({
  busy: Boolean,
  error: String,
  elapsed: { type: Number, default: 0 },
  hasResult: Boolean,
  label: { type: String, default: '正在扫描' },
});
defineEmits(['retry']);
</script>

<template>
  <div v-if="busy" class="notice status" role="status" aria-live="polite">
    <span class="spinner" aria-hidden="true"></span>
    <div>
      <strong>{{ label }}</strong>
      <p>
        已等待 {{ elapsed }} 秒，完成后自动显示结果。{{ hasResult ? '下方保留上次结果。' : '' }}
      </p>
    </div>
  </div>
  <div v-if="error" class="notice error" role="alert">
    <p>{{ error }}</p>
    <button class="button secondary" :disabled="busy" @click="$emit('retry')">重试</button>
  </div>
</template>

<style scoped>
.status {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}
.spinner {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
  }
}
</style>
