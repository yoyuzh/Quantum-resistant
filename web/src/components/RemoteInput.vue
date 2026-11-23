<script setup>
defineProps({ mode: String, modelValue: String, disabled: Boolean });
defineEmits(['update:modelValue']);
</script>

<template>
  <div class="stack">
    <label
      >{{ mode === 'github' ? 'GitHub 仓库地址' : 'PyPI 包名' }}
      <input
        :name="mode === 'github' ? 'repository' : 'package'"
        :aria-describedby="`${mode}-requirement`"
        :value="modelValue"
        :disabled="disabled"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="mode === 'github' ? 'https://github.com/owner/repo' : 'cryptography'"
        :maxlength="mode === 'github' ? 500 : 214"
        spellcheck="false"
      />
    </label>
    <p :id="`${mode}-requirement`" class="small muted">{{ mode === 'github' ? '公开仓库的默认分支' : '优先扫描源码发行包' }}</p>
  </div>
</template>
