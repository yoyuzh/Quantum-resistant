<script setup>
import { ref, computed, watch } from 'vue';
import { paginate } from '../utils/results.js';
import AppIcon from './AppIcon.vue';
import { request } from '../api/client.js';
import { ACCEPT, fileKey, mergeFiles } from '../utils/files.js';
const props = defineProps({ files: Array, disabled: Boolean });
const emit = defineEmits(['update:files']);
const picker = ref(null);
const directoryPicker = ref(null);
const errors = ref([]);
const loading = ref(false);
const page = ref(1);
const pagination = computed(() => paginate(props.files, page.value, 100));
watch(() => props.files, () => { page.value = 1; });
function add(files) {
  if (props.disabled) return;
  const result = mergeFiles(props.files, Array.from(files));
  errors.value = result.errors.slice(0, 20);
  if (result.errors.length > 20) errors.value.push(`另有 ${result.errors.length - 20} 个文件未加入。`);
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
    <input ref="directoryPicker" type="file" webkitdirectory multiple class="sr-only" tabindex="-1" :disabled="disabled" @change="select" aria-label="选择源码目录" />
    <button
      type="button"
      class="dropzone"
      :class="{ 'has-files': files.length }"
      :disabled="disabled"
      @click="picker.click()"
      @dragover.prevent
      @drop.prevent="add($event.dataTransfer.files)"
    >
      <span class="upload-icon"><AppIcon name="upload" :size="files.length ? 24 : 32" /></span>
      <strong>{{ files.length ? '继续添加文件' : '选择文件或拖放到这里' }}</strong>
      <span class="muted small">源码、配置及 PEM 文本 · UTF-8 编码</span>
    </button>
    <div class="toolbar">
      <button type="button" class="button secondary compact" :disabled="disabled" @click="directoryPicker.click()"><AppIcon name="repository" :size="16" />选择目录</button>
      <button
        type="button"
        class="button text-action compact"
        @click="samples"
        :disabled="disabled || loading"
      >
        {{ loading ? '正在读取示例…' : '导入示例代码' }}</button
      ><strong>已选 {{ files.length }} 个文件</strong>
    </div>
    <div v-if="errors.length" class="notice error" role="alert">
      <p v-for="error in errors" :key="error">{{ error }}</p>
    </div>
    <ul class="file-list">
      <li v-for="file in pagination.items" :key="fileKey(file)">
        <span
          >{{ file.webkitRelativePath || file.relativePath || file.name }}<small>{{ (file.size / 1024).toFixed(1) }} KiB</small></span
        ><button
          type="button"
          class="button text-action subtle compact"
          :disabled="disabled"
          :aria-label="`移除 ${file.name}`"
          @click="
            $emit(
              'update:files',
              files.filter((item) => item !== file),
            )
          "
        >
          移除
        </button>
      </li>
    </ul>
    <div v-if="pagination.pages > 1" class="toolbar">
      <button type="button" class="button secondary" :disabled="pagination.current <= 1" @click="page--">上一页</button>
      <span class="small">{{ pagination.current }} / {{ pagination.pages }} · 每页100个文件</span>
      <button type="button" class="button secondary" :disabled="pagination.current >= pagination.pages" @click="page++">下一页</button>
    </div>
  </div>
</template>

<style scoped>
.dropzone {
  display: grid;
  justify-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 2rem 0.8rem;
  border-radius: var(--radius);
  color: var(--text-primary);
  background: var(--accent-soft);
  cursor: pointer;
}
.dropzone:hover:not(:disabled) {
  background: var(--accent-glow);
}
.upload-icon {
  display: flex;
  color: var(--accent);
  font-size: 2rem;
}
.dropzone.has-files {
  grid-template-columns: auto minmax(0, 1fr);
  justify-items: start;
  gap: 0.2rem 0.65rem;
  padding: 0.8rem;
  text-align: left;
}
.has-files .upload-icon { grid-row: 1 / 3; align-self: center; }
.has-files .small { grid-column: 2; font-size: 0.75rem; }
.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.65rem;
  border-radius: var(--radius);
  background: var(--bg-elevated);
}
li + li {
  margin-top: 0.4rem;
}
li span {
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: 0.85rem;
}
li .button {
  flex-shrink: 0;
}
small {
  display: block;
  color: var(--text-secondary);
  margin-top: 0.2rem;
}
</style>
