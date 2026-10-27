<script setup>
import { useId } from 'vue';
defineProps({ modelValue: Boolean, label: String });
defineEmits(['update:modelValue']);
const labelId = useId();
</script>
<template>
  <div class="checkbox-control">
    <input type="checkbox" :checked="modelValue" :aria-labelledby="labelId" @change="$emit('update:modelValue',$event.target.checked)" />
    <span :id="labelId">{{ label }}</span><slot />
  </div>
</template>
<style scoped>
.checkbox-control { display:flex;align-items:center;gap:10px;min-width:0;font-size:14px; }
input { flex:none;width:20px;height:20px;min-height:20px;margin:0;padding:0;accent-color:var(--accent);cursor:pointer; }
span { min-width:0;cursor:default; }
input:disabled { cursor:not-allowed; }
</style>
