<script setup>
import AppIcon from './AppIcon.vue';
import { version } from '../../../desktop/package.json';
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
    <div v-if="!overlay" class="header-navigation"><slot /></div>
    <div class="header-actions">
    <span class="version">V{{ version }}</span>
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
  <div v-if="overlay" class="desktop-navigation"><slot /></div>
  <div id="result-view-navigation" class="result-navigation"></div>
</template>

<style scoped>
.app-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 52px;
  padding: 6px 16px;
  background: var(--bg-surface);
}
.brand {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.brand-mark {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 10px;
  background: var(--accent-soft);
  font: 700 1.5rem var(--font-mono);
  color: var(--accent);
}
.header-actions {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;
}
.desktop-overlay {
  display: flex;
  min-height: 0;
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
  font-size: 14px;
  margin: 0;
}
.header-navigation { min-width: 0; }
.version { color: var(--text-secondary); font-size: 11px; white-space: nowrap; }
.desktop-navigation { padding: 0 12px; background: var(--bg-surface); }
.result-navigation { padding: 0 var(--workspace-gutter); background: var(--bg-surface); flex-shrink: 0; }
.result-navigation:empty { display: none; }
@media (max-width: 1199px) {
  .app-header:not(.desktop-overlay) { grid-template-columns: minmax(0, 1fr) auto; }
  .header-navigation { grid-column: 1 / -1; grid-row: 2; width: 100%; }
  .header-actions { grid-column: 2; grid-row: 1; }
}
@media (max-width: 600px) {
  .app-header {
    padding: 8px 12px;
  }
  .brand-mark {
    display: none;
  }
  h1 {
    font-size: 13px;
  }
  .version { display: none; }
}
</style>
