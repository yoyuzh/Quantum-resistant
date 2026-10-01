<script setup>
defineProps({ title: String });
</script>

<template>
  <details class="disclosure">
    <summary>{{ title }}</summary>
    <div class="disclosure-body stack"><slot /></div>
  </details>
</template>

<style scoped>
.disclosure {
  border-top: 1px solid var(--border-light);
  padding-top: 0.65rem;
  overflow-wrap: anywhere;
}
summary {
  cursor: pointer;
  color: var(--accent-dim);
  font-size: 0.875rem;
  min-height: 32px;
}
.disclosure-body {
  margin-top: 0.65rem;
  gap: 0.65rem;
  font-size: 0.875rem;
}
</style>
