<script setup>
import { computed, ref, watch, onUnmounted } from 'vue';
import { sourceWindow } from '../utils/deepAnalysis.js';
const props = defineProps({ span: Object, sources: Array, loadSource: Function, title: String });
const emit = defineEmits(['unavailable']);
const content = ref('');
const loading = ref(false);
const error = ref('');
const heading = ref(null);
let sequence = 0;
watch(() => [props.span, props.loadSource], async () => {
  const id = ++sequence;
  content.value = '';
  error.value = '';
  loading.value = false;
  if (!props.span) return;
  loading.value = true;
  try {
    const source = await props.loadSource(props.span.source_id);
    if (id === sequence) {
      if (typeof source?.content !== 'string') throw Object.assign(new Error('源码已过期或不可用，请重新扫描。'), { status: 404 });
      content.value = source.content;
    }
  } catch (err) {
    if (id === sequence) {
      error.value = err.message;
      if (err.status === 404 || err.status === 410) emit('unavailable', props.span.source_id);
    }
  }
  finally { if (id === sequence) loading.value = false; }
}, { immediate: true });
onUnmounted(() => { sequence++; });
const path = computed(() => {
  const source = props.sources?.find(item => item.source_id === props.span?.source_id);
  return source?.relative_path || source?.file_name || props.span?.source_id;
});
const lines = computed(() => sourceWindow(content.value, props.span, 2));
defineExpose({ focus: () => heading.value?.focus() });
</script>
<template>
  <section class="deep-source" :aria-label="title" :aria-busy="loading">
    <div class="source-title">
      <h4 ref="heading" tabindex="-1">{{ title }} <span>{{ path || '无调用点' }}</span></h4>
      <span v-if="span" class="muted small">{{ span.start_line }}:{{ span.start_col }}–{{ span.end_line }}:{{ span.end_col }}</span>
    </div>
    <p v-if="!span" class="source-note">未实例化模板没有具体调用点。</p>
    <p v-else-if="loading" class="source-note" role="status">正在读取源码…</p>
    <p v-else-if="error" class="source-note" role="alert">{{ error }}</p>
    <div v-else class="source-code" tabindex="0" :aria-label="`${path} 源码，定位第 ${span.start_line} 行`">
      <div v-for="line in lines" :key="line.number" class="source-line" :class="{ selected: line.selected }">
        <span class="line-number" aria-hidden="true">{{ line.number }}</span>
        <code>{{ line.before }}<mark>{{ line.marked }}</mark>{{ line.after || ' ' }}</code>
      </div>
    </div>
    <p v-if="span" class="source-foot">行号从 1 开始 · 列为 UTF-8 字节 · 结束位置不包含</p>
  </section>
</template>
<style scoped>
.deep-source { min-width: 0; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; background: var(--bg-input); }
.source-title { display: flex; justify-content: space-between; flex-wrap: wrap; gap: .4rem; padding: .6rem .8rem; background: var(--bg-elevated); }
h4 { margin: 0; font-size: .8rem; overflow-wrap: anywhere; }
h4 span { margin-left: .5rem; font-weight: 500; color: var(--text-secondary); }
.source-code { max-height: 200px; overflow-y: auto; padding: .7rem 0; font: .78rem/1.85 var(--font-mono); }
.source-line { display: grid; grid-template-columns: 3.2em minmax(0, 1fr); padding-right: .7rem; }
.line-number { text-align: right; padding-right: 1em; color: var(--text-secondary); user-select: none; }
code { white-space: pre-wrap; overflow-wrap: anywhere; tab-size: 4; }
.selected { background: var(--accent-soft); }
mark { background: var(--accent-glow); color: var(--text-primary); border-radius: 2px; }
.source-note { padding: 1rem; color: var(--text-secondary); }
.source-foot { padding: .35rem .8rem; color: var(--text-secondary); border-top: 1px solid var(--border); font-size: .68rem; }
</style>
