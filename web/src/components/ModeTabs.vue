<script setup>
import AppIcon from './AppIcon.vue';
defineProps({ modelValue: String });
defineEmits(['update:modelValue']);
const modes = [
  ['snippet', '代码片段', 'code'],
  ['files', '文件上传', 'upload'],
  ['github', 'GitHub 仓库', 'repository'],
  ['pypi', 'PyPI 包', 'package'],
  ['popular', '热门榜单', 'chart'],
];
</script>

<template>
  <nav class="mode-tabs" aria-label="选择扫描来源">
    <button
      v-for="[value, label, icon] in modes"
      :key="value"
      class="button"
      :class="{ active: modelValue === value }"
      :aria-pressed="modelValue === value"
      @click="$emit('update:modelValue', value)"
    >
      <AppIcon :name="icon" :size="18" />{{ label }}
    </button>
  </nav>
</template>

<style scoped>
.mode-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0 auto 0.85rem;
  width: fit-content;
  max-width: 100%;
}
.button {
  background: transparent;
  color: var(--text-secondary);
}
.button.active {
  color: var(--accent-dim);
  background: var(--control-selected);
  font-weight: 600;
}
.button:hover:not(.active) {
  color: var(--accent-dim);
}
@media (max-width: 600px) {
  .mode-tabs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    width: 100%;
  }
  .button {
    padding-inline: 0.4rem;
  }
}
</style>
