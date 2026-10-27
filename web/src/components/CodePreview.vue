<script setup>
import { computed, ref, watch, onUnmounted } from 'vue';
import { codeLines } from '../utils/results.js';
const props = defineProps({ sources: Array, finding: Object, loadSource: Function });
const loaded = ref(null);
const loading = ref(false);
const error = ref('');
const context = ref(false), sourceData = ref(null);
let sequence = 0;
async function load() {
  const id = ++sequence;
  loaded.value = null;
  sourceData.value = null;
  context.value = false;
  error.value = '';
  if (!props.loadSource) return;
  loading.value = true;
  try {
    const source = await props.loadSource(props.finding.source_id);
    if (id === sequence) { sourceData.value=source; loaded.value = codeLines([source], props.finding.source_id, props.finding.line); }
  } catch (err) {
    if (id === sequence) error.value = err.message;
  } finally {
    if (id === sequence) loading.value = false;
  }
}
watch(() => [props.finding.source_id, props.finding.line], load, { immediate: true });
onUnmounted(() => { sequence++; });
const lines = computed(() => loaded.value ?? codeLines(props.sources, props.finding.source_id, props.finding.line));
// Three text nodes keep even a 2 MiB file from becoming thousands of DOM rows.
const full = computed(() => {
  const text=(sourceData.value?.content || '').split('\n'), target=props.finding.line-1;
  return {before:text.slice(0,target).join('\n')+'\n',target:text[target] || '',after:'\n'+text.slice(target+1).join('\n')};
});
</script>

<template>
  <p v-if="loading" class="muted small" role="status">正在读取源码…</p>
  <div v-else-if="error" class="notice error" role="alert">
    <p>{{ error }}</p><button class="button secondary" @click="load">重试读取源码</button>
  </div>
  <div v-else-if="lines.length" class="source-preview">
  <div class="source-toolbar"><span>第 {{ finding.line }} 行{{ context ? ' · 完整文件' : ' · 附近源码' }}</span><button v-if="sourceData?.content" class="button text-action compact" @click="context=!context">{{ context ? '收起上下文' : '完整源码' }}</button></div>
  <pre v-if="context" class="full-code" tabindex="0" :aria-label="`${finding.file_name} 完整源码`"><code>{{ full.before }}<mark>{{ full.target }}</mark>{{ full.after }}</code></pre>
  <div v-else
    class="code-view"
    tabindex="0"
    :aria-label="`${finding.file_name} 第 ${finding.line} 行附近源码`"
  >
    <div v-for="line in lines" :key="line.number" :class="{ target: line.target }">
      <span class="line-number">{{ line.number }}</span
      ><code>{{ line.text || ' ' }}</code>
    </div>
  </div>
  </div>
  <p v-else class="notice">源码不可用，此结果仅保留代码证据。</p>
</template>

<style scoped>
.source-preview { min-width:0; }.source-toolbar { display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:13px;color:var(--text-secondary);margin-bottom:8px; }.source-toolbar button { font-size:13px; }
.full-code { font:14px/1.75 var(--font-mono);white-space:pre-wrap;overflow-wrap:anywhere; }.full-code mark { background:var(--accent-glow);color:inherit; }
.code-view {
  overflow-wrap: anywhere;
  background: var(--bg-input);
  border-radius: var(--radius);
  padding: 0.6rem 0;
  font: 0.875rem/1.75 var(--font-mono);
}
.code-view > div {
  display: flex;
  min-width: 0;
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
  min-width: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  padding-right: 1rem;
}
</style>
