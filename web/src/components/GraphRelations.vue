<script setup>
defineProps({ graph: Object });
defineEmits(['select']);
</script>
<template>
  <div class="graph-relations" aria-label="文件、算法与迁移方向关系列表">
    <article v-for="file in graph.files" :key="file.id" class="relation-file">
      <button class="button text-action file-button" @click="$emit('select', { sourceId: file.id, algorithm: '', target: '' })">
        {{ file.label }}<span class="muted">{{ file.count }} 项 · {{ file.id }}</span>
      </button>
      <div v-for="edge in graph.evidenceEdges.filter(item => item.sourceId === file.id)"
        :key="edge.algorithm" class="relation-path">
        <button class="button secondary" @click="$emit('select', { algorithm: edge.algorithm, sourceId: '', target: '' })">
          {{ edge.algorithm }} · {{ edge.count }} 项
        </button>
        <span class="reference-label">迁移参考 →</span>
        <button v-for="target in edge.targets" :key="target" class="button text-action"
          @click="$emit('select', { target, sourceId: '', algorithm: '' })">{{ target }}</button>
      </div>
    </article>
  </div>
</template>
<style scoped>
.graph-relations { display: grid; gap: 8px; }
.relation-file { padding: 8px; min-width: 0; }
.relation-file + .relation-file { border-top: 1px solid var(--border-light); }
.file-button { flex-direction: column; align-items: start; text-align: left; overflow-wrap: anywhere; max-width: 100%; }
.file-button span { font-size: 12px; }
.relation-path { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; }
.reference-label { font-size: 12px; color: var(--text-secondary); }
</style>
