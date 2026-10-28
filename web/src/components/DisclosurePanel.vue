<script setup>
defineProps({ title: String, defaultOpen: Boolean });
defineEmits(['toggle']);
</script>

<template>
  <details class="disclosure" :open="defaultOpen" @toggle="$emit('toggle', $event.target.open)">
    <summary>{{ title }}</summary>
    <div class="disclosure-body stack"><slot /></div>
  </details>
</template>

<style scoped>
.disclosure {
  overflow-wrap: anywhere;
  font-size: 13px;
}
summary {
  cursor: pointer;
  color: var(--accent-dim);
  font-size: var(--font-control);
  font-weight: 600;
}
.disclosure-body {
  margin-top: 6px;
  gap: 6px;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--text-secondary);
}
</style>
