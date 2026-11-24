<script setup>
defineProps({ mode: String, modelValue: String, disabled: Boolean });
defineEmits(['update:modelValue']);
</script>

<template>
  <div class="stack">
    <label
      >{{ mode === 'github' ? '公开 GitHub 仓库地址' : 'PyPI 包名' }}
      <input
        :name="mode === 'github' ? 'repository' : 'package'"
        :value="modelValue"
        :disabled="disabled"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="mode === 'github' ? 'https://github.com/owner/repo' : 'cryptography'"
        :maxlength="mode === 'github' ? 500 : 214"
        spellcheck="false"
      />
    </label>
  </div>
</template>
