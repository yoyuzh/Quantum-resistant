<script setup>
import { computed, ref, watch } from 'vue';
import { paginate } from '../utils/results.js';
import { citationLabels, displayUnknown, filterOpinions, opinionLabels, opinionPriority, prioritizeOpinions } from '../utils/aiAnalysis.js';
const props = defineProps({ result: Object });
defineEmits(['reveal']);
const kind = ref('');
const citation = ref('');
const page = ref(1);
const pageSize = 8;
const items = computed(() => prioritizeOpinions(filterOpinions(props.result.opinions, kind.value, citation.value), props.result.candidates));
const pagination = computed(() => paginate(items.value, page.value, pageSize));
const pages = computed(() => pagination.value.pages);
const visibleItems = computed(() => pagination.value.items);
watch([kind, citation, () => props.result], () => { page.value = 1; });
const candidateFor = (item) => props.result.candidates.find((row) => row.candidate_id === item.candidate_id);
const priorityFor = (item) => opinionPriority(item, candidateFor(item));
function turnPage(value) {
  page.value = value;
  pager.value?.focus({ preventScroll: true });
}
const pager = ref(null);
</script>
<template>
  <div class="stack">
    <div class="filters">
      <label>意见类型 <select v-model="kind"><option value="">全部</option>
        <option v-for="(label, key) in opinionLabels" :key="key" :value="key">{{ label }}</option>
      </select></label>
      <label>引用核验 <select v-model="citation"><option value="">全部</option>
        <option v-for="(label, key) in citationLabels" :key="key" :value="key">{{ label }}</option>
      </select></label>
    </div>
    <p class="muted">按复核优先级从高到低排列；优先级用于安排人工复核，不代表风险概率或安全结论。</p>
    <p v-if="!items.length" class="muted">没有符合筛选的意见。零意见不代表安全。</p>
    <article v-for="item in visibleItems" :key="item.candidate_id" class="opinion stack">
      <h4 :class="`priority-${priorityFor(item).level}`"><span class="priority-label">{{ priorityFor(item).label }}</span>{{ opinionLabels[item.opinion_kind] }} · {{ displayUnknown(item.algorithm) }}</h4>
      <p>用途：{{ displayUnknown(item.purpose) }} · {{ citationLabels[item.citation_status] }}</p>
      <p>{{ item.rationale }}</p>
      <p>文件：{{ candidateFor(item)?.file_name }} · 来源 {{ candidateFor(item)?.source_id }}</p>
      <p v-if="item.migration_direction">迁移方向：{{ item.migration_direction }} · 适用性：{{ item.applicability?.join('；') || '未知' }} · 校验：{{ item.migration_validation || 'unknown' }}</p>
      <ul v-if="item.manual_checks?.length"><li v-for="text in item.manual_checks" :key="text">人工核查：{{ text }}</li></ul>
      <ul v-if="item.missing_information.length"><li v-for="text in item.missing_information" :key="text">缺失信息：{{ text }}</li></ul>
      <ul v-if="item.citation_errors.length"><li v-for="text in item.citation_errors" :key="text">{{ text }}</li></ul>
      <div v-for="(ref, index) in item.citations" :key="index">
        <button v-if="item.citation_status === 'valid'" type="button" class="button subtle"
          @click="$emit('reveal', { ...ref, file_name: candidateFor(item)?.file_name })">
          查看第 {{ ref.start_line }}–{{ ref.end_line }} 行源码
        </button>
        <p v-else>未通过核验的引用 · 第 {{ ref.start_line }}–{{ ref.end_line }} 行</p>
        <pre tabindex="0" aria-label="引用的脱敏证据">{{ ref.quote }}</pre>
      </div>
      <details><summary>保存的脱敏快照与静态发现引用</summary>
        <p>静态指纹：{{ candidateFor(item)?.static_finding_refs.join('、') || '无' }}</p>
        <pre tabindex="0"><code v-for="line in candidateFor(item)?.lines" :key="line.line">{{ line.line }}  {{ line.text }}{{ '\n' }}</code></pre>
      </details>
    </article>
    <nav v-if="pages > 1" ref="pager" class="pager" tabindex="-1" aria-label="AI 意见分页">
      <button type="button" class="button subtle" :disabled="page === 1" @click="turnPage(page - 1)">上一页</button>
      <span role="status" aria-live="polite">第 {{ page }} / {{ pages }} 页 · {{ items.length }} 条意见</span>
      <button type="button" class="button subtle" :disabled="page === pages" @click="turnPage(page + 1)">下一页</button>
    </nav>
  </div>
</template>
<style scoped>
.priority-high { color: var(--danger); }
.priority-medium { color: var(--warning); }
.priority-unknown { color: var(--text-secondary); }
.priority-info { color: var(--accent-dim); }
.priority-label { display: inline-block; font-size: 0.75rem; margin-right: 0.6rem; border: 1px solid currentColor; border-radius: 4px; padding: 0.1rem 0.35rem; }
.pager { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.6rem; }
.filters { display: flex; flex-wrap: wrap; gap: 1rem; }
label { display: grid; gap: 0.4rem; }
select { color: var(--text-primary); background: var(--bg-input); border: 1px solid var(--border); padding: 0.5rem; border-radius: 6px; }
.opinion { padding: 1rem; border: 1px solid var(--border); border-radius: var(--radius); }
p, h4, summary { overflow-wrap: anywhere; }
pre { max-height: 20rem; overflow: auto; white-space: pre-wrap; overflow-wrap: anywhere; font: 0.78rem/1.7 var(--font-mono); }
button { white-space: normal; height: auto; min-height: 40px; }
</style>
