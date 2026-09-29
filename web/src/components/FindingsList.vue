<script setup>
import { computed, ref, watch } from 'vue';
import { filterFindings, findingKey, paginate } from '../utils/results.js';
import FindingCard from './FindingCard.vue';
const props = defineProps({ findings: Array, sources: Array });
const algorithm = ref('');
const sourceId = ref('');
const query = ref('');
const page = ref(1);
const algorithms = computed(() => [...new Set(props.findings.map((f) => f.algorithm))].sort());
const filtered = computed(() =>
  filterFindings(props.findings, {
    algorithm: algorithm.value,
    sourceId: sourceId.value,
    query: query.value,
  }),
);
const pagination = computed(() => paginate(filtered.value, page.value));
watch([algorithm, sourceId, query], () => {
  page.value = 1;
});
watch(
  () => props.findings,
  () => {
    algorithm.value = '';
    sourceId.value = '';
    query.value = '';
    page.value = 1;
  },
);
</script>

<template>
  <section class="stack" aria-label="风险发现明细">
    <h3>
      发现明细 <span class="muted small">{{ filtered.length }} / {{ findings.length }} 项</span>
    </h3>
    <div class="filters">
      <label
        >算法<select v-model="algorithm">
          <option value="">全部算法</option>
          <option v-for="item in algorithms" :key="item">{{ item }}</option>
        </select></label
      >
      <label
        >文件<select v-model="sourceId">
          <option value="">全部文件</option>
          <option
            v-for="(source, index) in sources"
            :key="source.source_id"
            :value="source.source_id"
          >
            {{ index + 1 }}. {{ source.file_name }}
          </option>
        </select></label
      >
      <label class="search"
        >搜索<input v-model="query" type="search" placeholder="文件、证据或迁移建议"
      /></label>
    </div>
    <p v-if="!filtered.length" class="notice">
      {{ findings.length ? '没有符合筛选条件的发现。' : '本次扫描未发现已知传统公钥算法用法。' }}
    </p>
    <FindingCard
      v-for="finding in pagination.items"
      :key="findingKey(finding)"
      :finding="finding"
      :sources="sources"
    />
    <div v-if="pagination.pages > 1" class="toolbar pagination">
      <button class="button secondary" :disabled="pagination.current <= 1" @click="page--">
        上一页
      </button>
      <span class="small"
        >第 {{ pagination.current }} / {{ pagination.pages }} 页 · 每页 50 项</span
      >
      <button
        class="button secondary"
        :disabled="pagination.current >= pagination.pages"
        @click="page++"
      >
        下一页
      </button>
    </div>
  </section>
</template>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 0.7rem;
}
.search {
  grid-column: 1 / -1;
}
.pagination {
  justify-content: center;
}
@media (max-width: 500px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
