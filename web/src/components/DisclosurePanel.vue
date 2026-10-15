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
  overflow-wrap: anywhere;
}
summary {
  cursor: pointer;
  color: var(--accent-dim);
  font-size: var(--font-control);
}
.disclosure-body {
  margin-top: 0.65rem;
  gap: 0.65rem;
  font-size: 0.9375rem;
}
</style>
