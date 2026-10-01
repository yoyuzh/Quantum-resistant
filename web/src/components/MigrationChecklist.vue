<script setup>
import AppIcon from './AppIcon.vue';
defineProps({ analysis: Object });
defineEmits(['select']);
</script>
<template>
  <section class="stack" aria-label="迁移待办">
    <p v-if="!analysis" class="notice">此历史结果未记录迁移清单，请重新扫描。</p>
    <p v-else-if="!analysis.migrations.length" class="notice">
      本次没有需要生成迁移待办的算法证据。
    </p>
    <article
      v-for="item in analysis?.migrations || []"
      :key="item.algorithm"
      class="analysis-card stack"
    >
      <div class="toolbar">
        <span class="tag">{{ item.algorithm }}</span
        ><strong>{{ item.purpose }}</strong>
      </div>
      <p>
        {{ item.affected_files }} 个文件 · {{ item.finding_count }} 项发现 ·
        <strong>参考：{{ item.targets.join(' / ') }}</strong>
      </p>
      <ol>
        <li v-for="action in item.actions" :key="action.title">
          <strong>{{ action.title }}</strong>
          <p>{{ action.description }}</p>
        </li>
      </ol>
      <div class="toolbar">
        <button
          class="button secondary"
          @click="$emit('select', { algorithm: item.algorithm, sourceId: '', target: '' })"
        >
          <AppIcon name="code" :size="16" />查看相关证据
        </button>
        <a :href="item.reference_url" target="_blank" rel="noopener noreferrer" class="small"
          >NIST 标准参考</a
        >
      </div>
    </article>
  </section>
</template>
<style scoped>
strong {
  font-size: 0.85rem;
}
ol {
  padding-left: 1.3rem;
  margin: 0;
  display: grid;
  gap: 0.8rem;
}
li {
  padding-left: 0.3rem;
}
li::marker {
  color: var(--accent-dim);
  font-size: 0.75rem;
}
li p {
  color: var(--text-primary);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
