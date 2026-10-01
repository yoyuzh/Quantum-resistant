<script setup>
defineProps({ filename: String, content: String, disabled: Boolean });
defineEmits(['update:filename', 'update:content']);
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
      >待扫描内容<textarea
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
.editor {
  min-height: 330px;
  font: 0.8rem/1.7 var(--font-mono);
  tab-size: 4;
  resize: vertical;
  white-space: pre;
  overflow: auto;
}
@media (max-width: 600px) {
  .editor {
    min-height: 230px;
  }
}
</style>
