<script setup>
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';
const props = defineProps({ filename: String, content: String, disabled: Boolean });
defineEmits(['update:filename', 'update:content']);
const lineCount = computed(() => props.content ? props.content.split('\n').length : 0);
</script>

<template>
  <div class="stack snippet-input">
    <label
      >文件名<input
        :value="filename"
        maxlength="240"
        :disabled="disabled"
        @input="$emit('update:filename', $event.target.value)"
        placeholder="snippet.py"
    /></label>
    <label class="editor-label"
      ><span class="editor-heading"><span><AppIcon name="code" :size="16" />待扫描内容</span><span class="line-count" aria-hidden="true">{{ lineCount }} 行</span></span><textarea
        class="editor"
        :value="content"
        :disabled="disabled"
        @input="$emit('update:content', $event.target.value)"
        spellcheck="false"
        placeholder="粘贴 Python 代码、配置或 PEM 内容"
      ></textarea>
    </label>
  </div>
</template>

<style scoped>
.editor-heading { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.editor-heading > span:first-child { display: inline-flex; align-items: center; gap: 6px; }
.line-count { font-size: 12px; font-variant-numeric: tabular-nums; }
.editor {
  min-height: 330px;
  font: 0.8rem/1.7 var(--font-mono);
  tab-size: 4;
  resize: vertical;
  white-space: pre;
  overflow: auto;
}
.editor::placeholder {
  white-space: normal;
  font-family: var(--font-sans);
  font-size: var(--font-control);
}
@media (max-width: 600px) {
  .editor {
    min-height: 230px;
  }
}
</style>
