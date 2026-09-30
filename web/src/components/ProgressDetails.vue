<script setup>
import { computed } from 'vue';
import { progressRows } from '../utils/progress.js';
const props = defineProps({ progress: Object });
const rows = computed(() => progressRows(props.progress));
const repositories = computed(() => props.progress?.repositories || []);
function amount(value, label) {
  return label.includes('字节') ? `${(value / 1048576).toFixed(1)} MiB` : `${value} 个`;
}
</script>
<template>
  <div v-if="progress" class="progress-details stack">
    <p class="small" role="status">
      {{ ['succeeded', 'partial', 'cancelled', 'failed'].includes(progress.state)
        ? '分析已结束，正在呈现结果' : progress.stage || '正在提交任务' }}
    </p>
    <div v-for="row in rows" :key="row.label" class="progress-row">
      <div class="progress-label small">
        <span>{{ row.label }} {{ amount(row.value, row.label) }}<template v-if="row.total != null"> / {{ amount(row.total, row.label) }}</template></span>
        <span v-if="row.percent != null">{{ row.percent }}%</span>
      </div>
      <progress v-if="row.percent != null" :value="row.percent" max="100" :aria-label="row.label" />
    </div>
    <p class="small muted">
      已采集 {{ progress.collected_files || 0 }} 个 · 已分析 {{ progress.analyzed_files || 0 }} 个
      <span v-if="progress.skipped_files"> · 跳过 {{ progress.skipped_files }} 个</span>
      <span v-if="progress.kind === 'popular'"> · 仓库已结束 {{ progress.completed_repos || 0 }} / {{ progress.total_repos ?? '待确认' }}</span>
    </p>
    <details v-if="repositories.length" open>
      <summary class="small">各仓库进度</summary>
      <ul>
        <li v-for="repo in repositories" :key="repo.name" class="small">
          <strong>{{ repo.name }}</strong> · {{ repo.completed_repos ? '已结束' : repo.stage || '准备扫描' }}
          <span v-if="repo.processed_files != null">处理 {{ repo.processed_files }}<template v-if="repo.candidate_files != null"> / {{ repo.candidate_files }}</template> · 跳过 {{ repo.skipped_files || 0 }}</span>
          <span>采集 {{ repo.collected_files || 0 }} · 分析 {{ repo.analyzed_files || 0 }}<template v-if="repo.totals_final"> / {{ repo.analysis_total }}</template></span>
          <span v-if="repo.download_bytes != null">下载 {{ amount(repo.download_bytes, '字节') }}<template v-if="repo.download_total != null"> / {{ amount(repo.download_total, '字节') }}</template></span>
        </li>
      </ul>
    </details>
  </div>
</template>
<style scoped>
.progress-details {
  width: 100%;
  max-width: 36rem;
  text-align: left;
}
.progress-label {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}
progress {
  width: 100%;
  height: 0.5rem;
  accent-color: var(--accent);
}
summary {
  cursor: pointer;
}
ul {
  padding-left: 1rem;
  max-height: 12rem;
  overflow: auto;
  margin: 0.5rem 0 0;
}
li {
  overflow-wrap: anywhere;
  margin-bottom: 0.5rem;
}
li span {
  display: block;
  color: var(--text-secondary);
}
</style>
