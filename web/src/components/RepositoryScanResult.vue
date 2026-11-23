<script setup>
import { computed } from 'vue';
import { coverageLabels, libraryScanSummary, repositoryScanCoverage, repositorySkipReasons } from '../utils/repositoryScan.js';

const props = defineProps({ result: Object, blocked: Boolean });
defineEmits(['save']);
const retained = computed(() => new Set(props.result.meta?.library_retained_repositories));
const saved = computed(() => new Set(props.result.meta?.library_saved_repositories ??
  (props.result.meta?.library_saved ? props.result.repos.map(repo => repo.full_name) : [])));
const coverageDiagnostics = new Set(['partial_collection', 'files_skipped', 'collection_interrupted', 'analysis_interrupted', 'archive_budget']);
const rows = computed(() => props.result.repos.map(repo => ({
  repo, state: repositoryScanCoverage(repo), reasons: repositorySkipReasons(repo.coverage) ||
    repo.diagnostics?.find(note => coverageDiagnostics.has(note.code))?.message,
})));
</script>

<template>
  <section class="batch-result" aria-label="本轮仓库扫描结果">
    <p role="status">{{ libraryScanSummary(result) }}</p>
    <div v-if="result.repos.length && !result.meta?.library_saved" class="save-row">
      <span>{{ result.meta?.save_error || '待入库' }}</span>
      <button type="button" class="button secondary compact" :disabled="blocked" @click="$emit('save')">保存扫描结果</button>
    </div>
    <ul class="batch-rows" aria-label="本轮扫描的仓库" tabindex="0">
      <li v-for="{ repo, state, reasons } in rows" :key="repo.full_name">
        <div class="row-heading"><strong>{{ repo.full_name }}</strong><span class="small" :class="state">{{ coverageLabels[state] }}</span></div>
        <p v-if="repo.coverage" class="small muted">
          已扫描 {{ repo.coverage.scanned_files }}<template v-if="repo.coverage.candidate_files != null"> / {{ repo.coverage.candidate_files }}</template> 个文件
          <template v-if="repo.coverage.skipped_files">，跳过 {{ repo.coverage.skipped_files }} 个</template>
          <template v-if="repo.coverage.degraded_files">，{{ repo.coverage.degraded_files }} 个降级分析</template>
          <template v-if="saved.has(repo.full_name)">，已入库</template>
          <template v-else-if="retained.has(repo.full_name)">，沿用原记录</template>
        </p>
        <p v-if="reasons" class="small muted">{{ reasons }}</p>
        <p v-if="['partial', 'failed', 'cancelled'].includes(repo.analysis_summary?.deep_status)" class="small muted">跨文件分析未完成</p>
      </li>
      <li v-for="repo in result.failures" :key="repo.full_name">
        <div class="row-heading"><strong>{{ repo.full_name }}</strong><span class="small partial">未完成</span></div>
        <p class="small muted">{{ repo.error }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.batch-result { display:grid; gap:10px; }
.batch-result p { margin:0; }
.batch-result > p,.save-row { background:var(--bg-elevated); border-radius:var(--radius); padding:8px 10px; }
.save-row,.row-heading { display:flex; align-items:center; justify-content:space-between; gap:8px; }
.save-row { flex-wrap:wrap; }
.row-heading strong { overflow-wrap:anywhere; }
.row-heading span { flex:none; }
.complete { color:var(--accent-dim); }
.partial,.unknown { color:var(--text-secondary); }
.batch-rows { list-style:none; margin:0; padding:0 8px 0 0; max-height:min(42dvh,360px); overflow:auto; overscroll-behavior:contain; }
.batch-rows li { display:grid; gap:2px; padding:7px 4px; overflow-wrap:anywhere; }
.batch-rows li + li { border-top:1px solid var(--border-light); }
</style>
