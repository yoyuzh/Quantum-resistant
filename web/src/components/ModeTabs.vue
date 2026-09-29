<script setup>
defineProps({ modelValue: String });
defineEmits(['update:modelValue']);
const modes = [
  ['snippet', '代码片段'],
  ['files', '文件上传'],
  ['github', 'GitHub 仓库'],
  ['pypi', 'PyPI 包'],
  ['popular', '热门榜单'],
];
</script>

<template>
  <nav class="mode-tabs" aria-label="选择扫描来源">
    <button
      v-for="[value, label] in modes"
      :key="value"
      class="button"
      :class="{ active: modelValue === value }"
      :aria-pressed="modelValue === value"
      @click="$emit('update:modelValue', value)"
    >
      {{ label }}
    </button>
  </nav>
</template>

<style scoped>
.mode-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.2rem;
}
.button {
  background: transparent;
  color: var(--text-secondary);
  border-color: transparent;
}
.button.active {
  color: var(--accent-dim);
  background: var(--accent-soft);
  border-color: var(--accent);
}
</style>
