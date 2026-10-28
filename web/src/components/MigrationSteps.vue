<script setup>
defineProps({ actions: Array });
</script>
<template>
  <ol class="migration-steps">
    <li v-for="(action, index) in actions" :key="index"><strong>{{ action.title }}</strong><p>{{ action.description }}</p></li>
  </ol>
</template>
<style scoped>
.migration-steps { margin: 0; padding-left: 20px; display: grid; gap: 8px; }
li::marker { color: var(--accent-dim); }
strong { font-weight: 600; }
p { margin-top: 2px; }
</style>
