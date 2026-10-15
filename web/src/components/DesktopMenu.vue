<script setup>
import { ref } from 'vue';
import AppIcon from './AppIcon.vue';
const open = ref(false);
const error = ref('');
async function show() {
  if (open.value) return;
  error.value = '';
  open.value = true;
  try {
    await window.quantumDesktop.showMenu();
  } catch {
    error.value = '菜单暂时无法打开，请重试。';
  } finally {
    open.value = false;
  }
}
</script>
<template>
  <div class="desktop-menu">
    <button class="button text-action" :class="{ open }" aria-haspopup="menu" :aria-expanded="open" aria-keyshortcuts="F10"
      @pointerdown.prevent @click="show">
      <AppIcon name="menu" :size="17" />菜单
    </button>
    <p v-if="error" class="notice error" role="alert">{{ error }}</p>
  </div>
</template>
<style scoped>
.desktop-menu { position: relative; }
.open { font-weight: 600; text-decoration-color: currentColor; }
p { position: absolute; right: 0; top: 100%; width: 16rem; z-index: 20; }
</style>
