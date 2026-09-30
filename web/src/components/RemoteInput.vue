<script setup>
import { scanLimits } from '../composables/useScanConfig.js';
defineProps({ mode: String, modelValue: String, disabled: Boolean });
defineEmits(['update:modelValue']);
</script>

<template>
  <div class="stack">
    <label
      >{{ mode === 'github' ? 'GitHub 仓库地址' : 'PyPI 包名' }}
      <input
        :value="modelValue"
        :disabled="disabled"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="mode === 'github' ? 'https://github.com/owner/repo' : 'cryptography'"
        :maxlength="mode === 'github' ? 500 : 214"
        spellcheck="false"
      />
    </label>
    <div class="notice">
      <p v-if="mode === 'github'">
        固定默认分支版本；超过32个候选文件时优先读取源码归档，失败回退逐文件采集。关键词只影响顺序。
      </p>
      <p v-else>优先读取 PyPI 源码发行包，必要时回退 wheel。只分析文本，不安装或执行包内代码。</p>
      <p>
        最多采集 {{ scanLimits.max_files }} 个文件，单文件 {{ scanLimits.max_file_bytes / 1048576 }} MiB、
        文本总量 {{ scanLimits.max_text_bytes / 1048576 }} MiB。后台任务预算 {{ scanLimits.scan_timeout_seconds / 60 }}
        分钟，可取消；持续显示实际完成数量。
      </p>
    </div>
  </div>
</template>
