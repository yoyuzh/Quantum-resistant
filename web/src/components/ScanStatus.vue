<script setup>
defineProps({ error: String });
defineEmits(['retry']);
</script>

<template>
  <div v-if="error" class="notice error" role="alert">
    <p>{{ error }}</p>
    <button type="button" class="button secondary" @click="$emit('retry')">重试</button>
  </div>
</template>
