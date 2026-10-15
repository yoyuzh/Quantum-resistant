<script setup>
import AppIcon from './AppIcon.vue';
const overlay = ['win32', 'linux'].includes(window.quantumDesktop?.platform);
defineProps({ theme: String });
defineEmits(['toggle-theme']);
</script>

<template>
  <header class="app-header" :class="{ 'desktop-overlay': overlay }">
    <div class="brand">
      <span class="brand-mark"><AppIcon name="shield" :size="overlay ? 18 : 26" /></span>
      <h1>抗量子密码风险检测与迁移辅助软件</h1>
    </div>
    <div class="header-actions">
    <button
      class="button secondary"
      @click="$emit('toggle-theme')"
      :aria-label="theme === 'light' ? '切换深色模式' : '切换浅色模式'"
    >
      <AppIcon :name="theme === 'light' ? 'moon' : 'sun'" :size="17" />
      {{ theme === 'light' ? '深色' : '浅色' }}
    </button>
    </div>
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
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;
}
.desktop-overlay {
  height: env(titlebar-area-height, 36px);
  padding-block: 0;
  padding-left: calc(env(titlebar-area-x, 0px) + 16px);
  padding-right: max(16px, calc(100vw - env(titlebar-area-x, 0px) - env(titlebar-area-width, calc(100vw - 150px)) + 16px));
  -webkit-app-region: drag;
  app-region: drag;
}
.desktop-overlay .brand { gap: 8px; }
.desktop-overlay .brand-mark { width: 24px; height: 24px; border-radius: 7px; }
.desktop-overlay h1 {
  font-size: 13px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.desktop-overlay .button {
  min-height: 28px;
  height: 28px;
  padding: 0 8px;
  font-size: 12px;
  gap: 5px;
  border-radius: 6px;
}
.desktop-overlay .header-actions {
  -webkit-app-region: no-drag;
  app-region: no-drag;
}
h1 {
  font-size: 1.05rem;
  margin: 0;
}
@media (max-width: 600px) {
  .app-header {
    padding: 0.85rem 1rem;
  }
  .brand-mark {
    display: none;
  }
  h1 {
    font-size: 0.95rem;
  }
}
</style>
