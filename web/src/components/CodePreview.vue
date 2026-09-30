<script setup>
import { computed, ref, watch, onUnmounted } from 'vue';
import { codeLines } from '../utils/results.js';
const props = defineProps({ sources: Array, finding: Object, loadSource: Function });
const loaded = ref(null);
const loading = ref(false);
const error = ref('');
let sequence = 0;
async function load() {
  const id = ++sequence;
  loaded.value = null;
  error.value = '';
  if (!props.loadSource) return;
  loading.value = true;
  try {
    const source = await props.loadSource(props.finding.source_id);
    if (id === sequence) loaded.value = codeLines([source], props.finding.source_id, props.finding.line);
  } catch (err) {
    if (id === sequence) error.value = err.message;
  } finally {
    if (id === sequence) loading.value = false;
  }
}
watch(() => [props.finding.source_id, props.finding.line], load, { immediate: true });
onUnmounted(() => { sequence++; });
const lines = computed(() => loaded.value ?? codeLines(props.sources, props.finding.source_id, props.finding.line));
</script>

<template>
  <p v-if="loading" class="muted small" role="status">正在读取源码…</p>
  <div v-else-if="error" class="notice error" role="alert">
    <p>{{ error }}</p><button class="button secondary" @click="load">重试读取源码</button>
  </div>
  <div
    v-else-if="lines.length"
    class="code-view"
    tabindex="0"
    :aria-label="`${finding.file_name} 第 ${finding.line} 行附近源码`"
  >
    <div v-for="line in lines" :key="line.number" :class="{ target: line.target }">
      <span class="line-number">{{ line.number }}</span
      ><code>{{ line.text || ' ' }}</code>
    </div>
  </div>
  <p v-else class="muted small">此结果未包含源码内容。</p>
</template>

<style scoped>
.code-view {
  overflow: auto;
  background: var(--bg-input);
  border-radius: var(--radius);
  padding: 0.6rem 0;
  font: 0.75rem/1.8 var(--font-mono);
}
.code-view > div {
  display: flex;
  width: max-content;
  min-width: 100%;
  white-space: pre;
}
.target {
  background: var(--accent-glow);
}
.line-number {
  display: inline-block;
  width: 3.5rem;
  text-align: right;
  padding-right: 1rem;
  color: var(--text-secondary);
  flex-shrink: 0;
  user-select: none;
}
code {
  padding-right: 1rem;
}
</style>
