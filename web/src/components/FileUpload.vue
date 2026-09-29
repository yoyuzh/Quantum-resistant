<script setup>
import { ref } from 'vue';
import { request } from '../api/client.js';
import { ACCEPT, fileKey, mergeFiles } from '../utils/files.js';
const props = defineProps({ files: Array, disabled: Boolean });
const emit = defineEmits(['update:files']);
const picker = ref(null);
const errors = ref([]);
const loading = ref(false);
function add(files) {
  if (props.disabled) return;
  const result = mergeFiles(props.files, Array.from(files));
  errors.value = result.errors;
  emit('update:files', result.files);
}
function select(event) {
  add(event.target.files);
  event.target.value = '';
}
async function samples() {
  loading.value = true;
  errors.value = [];
  try {
    const data = await request('/api/samples');
    add(
      data.map((s) => new File([s.content], s.file_name, { type: 'text/plain', lastModified: 0 })),
    );
  } catch (error) {
    errors.value = [error.message];
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="stack">
    <input
      ref="picker"
      class="sr-only"
      tabindex="-1"
      type="file"
      multiple
      :accept="ACCEPT"
      @change="select"
      :disabled="disabled"
      aria-label="选择代码文件"
    />
    <button
      type="button"
      class="dropzone"
      :disabled="disabled"
      @click="picker.click()"
      @dragover.prevent
      @drop.prevent="add($event.dataTransfer.files)"
    >
      <span class="upload-icon" aria-hidden="true">↑</span>
      <strong>选择文件或拖放到这里</strong>
      <span class="muted small">源码、配置及 PEM 文本 · UTF-8 编码</span>
    </button>
    <p class="muted small">
      单文件 2 MiB，合计 10 MiB（含表单开销），最多 80 个文件。同名不同版本可同时扫描。
    </p>
    <div class="toolbar">
      <button
        type="button"
        class="button secondary"
        @click="samples"
        :disabled="disabled || loading"
      >
        {{ loading ? '正在读取示例…' : '导入示例代码' }}</button
      ><span class="muted small">已选 {{ files.length }} 个文件</span>
    </div>
    <div v-if="errors.length" class="notice error" role="alert">
      <p v-for="error in errors" :key="error">{{ error }}</p>
    </div>
    <ul class="file-list">
      <li v-for="(file, index) in files" :key="fileKey(file)">
        <span
          >{{ file.name }}<small>{{ (file.size / 1024).toFixed(1) }} KiB</small></span
        ><button
          type="button"
          class="button secondary"
          :disabled="disabled"
          :aria-label="`移除 ${file.name}`"
          @click="
            $emit(
              'update:files',
              files.filter((_, i) => i !== index),
            )
          "
        >
          移除
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dropzone {
  display: grid;
  justify-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 2rem 0.8rem;
  border: 1px dashed var(--accent);
  border-radius: var(--radius);
  color: var(--text-primary);
  background: var(--accent-soft);
  cursor: pointer;
}
.upload-icon {
  color: var(--accent);
  font-size: 2rem;
}
.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 350px;
  overflow-y: auto;
}
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--border-light);
}
li span {
  overflow-wrap: anywhere;
  font-size: 0.85rem;
}
small {
  display: block;
  color: var(--text-secondary);
  margin-top: 0.2rem;
}
</style>
