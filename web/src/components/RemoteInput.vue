<script setup>
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
        优先读取默认分支的文件树，按密码相关文件名优先采集；必要时回退源码归档。
      </p>
      <p v-else>优先读取 PyPI 源码发行包，必要时回退 wheel。只分析文本，不安装或执行包内代码。</p>
      <p>最多采集 80 个文件，单文件上限 2 MiB。扫描结果会标明实际采集范围。</p>
    </div>
  </div>
</template>
