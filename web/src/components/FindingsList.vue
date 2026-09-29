<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { filterFindings, findingKey, paginate } from '../utils/results.js';
import FindingCard from './FindingCard.vue';
import SelectControl from './SelectControl.vue';
const props = defineProps({ findings: Array, sources: Array });
const algorithm = ref('');
const sourceId = ref('');
const query = ref('');
const page = ref(1);
const list = ref(null);
async function changePage(delta) {
  page.value += delta;
  await nextTick();
  const container = list.value?.closest('.panel-body');
  if (container && container.scrollHeight > container.clientHeight) {
    container.scrollTop +=
      list.value.getBoundingClientRect().top - container.getBoundingClientRect().top - 20;
  } else {
    list.value?.scrollIntoView({ block: 'start' });
  }
  list.value?.focus({ preventScroll: true });
}
const algorithms = computed(() => [...new Set(props.findings.map((f) => f.algorithm))].sort());
const algorithmOptions = computed(() => [
  { value: '', label: '全部算法' },
  ...algorithms.value.map((value) => ({ value, label: value })),
]);
const fileOptions = computed(() => [
  { value: '', label: '全部文件' },
  ...props.sources.map((source, index) => ({
    value: source.source_id,
    label: `${index + 1}. ${source.file_name}`,
  })),
]);
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
  <section ref="list" class="stack findings-list" tabindex="-1" aria-label="风险发现明细">
    <h3>
      发现明细 <span class="muted small">{{ filtered.length }} / {{ findings.length }} 项</span>
    </h3>
    <div class="filters">
      <SelectControl v-model="algorithm" label="算法" :options="algorithmOptions" />
      <SelectControl v-model="sourceId" label="文件" :options="fileOptions" />
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
      <button class="button secondary" :disabled="pagination.current <= 1" @click="changePage(-1)">
        上一页
      </button>
      <span class="small"
        >第 {{ pagination.current }} / {{ pagination.pages }} 页 · 每页 50 项</span
      >
      <button
        class="button secondary"
        :disabled="pagination.current >= pagination.pages"
        @click="changePage(1)"
      >
        下一页
      </button>
    </div>
  </section>
</template>

<style scoped>
.findings-list {
  scroll-margin-top: 1rem;
}
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
@media (min-width: 1200px) {
  .filters {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr) minmax(0, 1.4fr);
  }
  .search {
    grid-column: auto;
  }
}
@media (max-width: 500px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
