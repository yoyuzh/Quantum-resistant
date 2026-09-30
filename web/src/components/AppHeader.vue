<script setup>
import AppIcon from './AppIcon.vue';
defineProps({ theme: String });
defineEmits(['toggle-theme']);
</script>

<template>
  <header class="app-header">
    <div class="brand">
      <span class="brand-mark"><AppIcon name="shield" :size="26" /></span>
      <div>
        <h1>抗量子迁移风险扫描平台</h1>
        <p>发现密码算法 · 定位代码证据 · 辅助迁移决策</p>
      </div>
    </div>
    <button
      class="button secondary"
      @click="$emit('toggle-theme')"
      :aria-label="theme === 'light' ? '切换深色模式' : '切换浅色模式'"
    >
      <AppIcon :name="theme === 'light' ? 'moon' : 'sun'" :size="17" />
      {{ theme === 'light' ? '深色' : '浅色' }}
    </button>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem max(1.5rem, calc((100vw - 1392px) / 2));
  background: var(--bg-surface);
  box-shadow: var(--shadow-card);
}
.brand {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.brand-mark {
  display: grid;
  place-items: center;
  width: 2.65rem;
  height: 2.65rem;
  flex-shrink: 0;
  border-radius: 10px;
  background: var(--accent-soft);
  font: 700 1.5rem var(--font-mono);
  color: var(--accent);
}
.app-header > .button {
  flex-shrink: 0;
}
h1 {
  font-size: 1.05rem;
  margin: 0;
}
p {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0.25rem 0 0;
}
@media (max-width: 600px) {
  .app-header {
    padding: 0.85rem 1rem;
  }
  .brand-mark,
  p {
    display: none;
  }
  h1 {
    font-size: 0.95rem;
  }
}
</style>
