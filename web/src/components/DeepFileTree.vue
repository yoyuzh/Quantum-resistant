<script setup>
import AppIcon from './AppIcon.vue';
defineProps({ nodes: Array, selected: String });
defineEmits(['select']);
</script>
<template>
  <ul class="deep-file-tree">
    <li v-for="node in nodes" :key="node.source?.source_id || node.path">
      <details v-if="node.children" open>
        <summary><AppIcon name="package" :size="16" /><span>{{ node.name }}</span></summary>
        <DeepFileTree :nodes="node.children" :selected="selected" @select="$emit('select', $event)" />
      </details>
      <button v-else class="button tree-file" :class="{ active: node.source.source_id === selected }"
        :aria-current="node.source.source_id === selected ? 'location' : undefined"
        :title="node.path" :aria-label="`${node.path} · ${node.source.source_id}`" @click="$emit('select', node.source)">
        <AppIcon name="code" :size="16" /><span>{{ node.name }}</span>
      </button>
    </li>
  </ul>
</template>
<style scoped>
.deep-file-tree { list-style: none; margin: 0; padding: 0; min-width: 0; }
li { min-width: 0; }
summary { width: 100%; text-decoration: none; font-weight: 500; font-size: .8rem; color: var(--text-secondary); gap: .4rem; }
summary span { min-width: 0; overflow-wrap: anywhere; }
summary svg { flex-shrink: 0; }
details > .deep-file-tree { padding-left: .65rem; border-left: 1px solid var(--border); margin-left: .3rem; }
.tree-file { background: transparent; color: var(--text-secondary); justify-content: flex-start; text-align: left; width: 100%; min-width: 0; font-size: .8rem; margin: .15rem 0; }
.tree-file.active { color: var(--accent-dim); background: var(--accent-soft); }
.tree-file svg { flex-shrink: 0; }
.tree-file span { min-width: 0; overflow-wrap: anywhere; }
</style>
