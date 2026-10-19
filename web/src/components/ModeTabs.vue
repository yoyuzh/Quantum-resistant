<script setup>
import AppIcon from './AppIcon.vue';
defineProps({ modelValue: String, showSourceEdit: Boolean });
defineEmits(['update:modelValue', 'edit-source']);
const modes = [
  ['snippet', '代码片段', 'code'],
  ['files', '文件上传', 'upload'],
  ['github', 'GitHub 仓库', 'repository'],
  ['pypi', 'PyPI 包', 'package'],
  ['popular', '热门榜单', 'chart'],
];
</script>

<template>
  <nav class="mode-tabs" :class="{ 'has-source-edit': showSourceEdit }" aria-label="选择扫描来源">
    <button v-if="showSourceEdit" class="button source-edit" aria-label="编辑来源与扫描模式"
      title="编辑来源与扫描模式" @click="$emit('edit-source')">
      <AppIcon name="arrow" :size="20" />
    </button>
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
  margin: 0 auto;
  width: fit-content;
  max-width: 100%;
}
.has-source-edit {
  position: relative;
  width: 100%;
  padding-left: calc(var(--control-height) + .65rem);
  justify-content: center;
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
.button.source-edit {
  position: absolute;
  left: 0;
  top: 0;
  width: var(--control-height);
  min-height: var(--control-height);
  padding: 0;
  justify-self: start;
  flex-shrink: 0;
  color: var(--accent-dim);
  background: var(--control-bg);
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
  .has-source-edit { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
</style>
