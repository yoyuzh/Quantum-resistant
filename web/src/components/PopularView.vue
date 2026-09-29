<script setup>
import { computed, ref, watch } from 'vue';
import { formatStars, formatTime, sortRepos } from '../utils/results.js';
import ScanStatus from './ScanStatus.vue';
import PopularDetail from './PopularDetail.vue';
const props = defineProps({ state: Object });
defineEmits(['refresh', 'reload', 'update:top']);
const selected = ref('');
const repos = computed(() => sortRepos(props.state.result?.repos || []));
const activeRepo = computed(() => repos.value.find((r) => r.full_name === selected.value));
watch(
  repos,
  (value) => {
    if (!value.some((r) => r.full_name === selected.value))
      selected.value = value[0]?.full_name || '';
  },
  { immediate: true },
);
</script>

<template>
  <div class="workspace-grid">
    <section class="panel stack">
      <div>
        <h2>热门密码学仓库</h2>
        <p class="muted small">Python · 按 GitHub Star 排序</p>
      </div>
      <label
        >扫描仓库数量<select
          :value="state.top"
          :disabled="state.busy || state.loading"
          @change="$emit('update:top', Number($event.target.value))"
        >
          <option v-for="n in [5, 8, 10, 20, 30]" :key="n" :value="n">{{ n }} 个仓库</option>
        </select></label
      >
      <button
        class="button primary"
        :disabled="state.busy || state.loading"
        @click="$emit('refresh')"
      >
        {{ state.busy ? '正在扫描…' : state.result ? '重新扫描热门仓库' : '开始热门扫描' }}
      </button>
      <p class="small muted">
        每仓库最多采集 6 个文件；整个批次时间预算 60 秒。失败或超时的仓库单独列出。
      </p>
      <ScanStatus
        :busy="state.busy || state.loading"
        :label="state.loading ? '正在加载上次结果' : '正在检索与扫描仓库'"
        :error="state.error"
        :elapsed="state.elapsed"
        :has-result="!!state.result"
        @retry="$emit(state.retryRefresh ? 'refresh' : 'reload')"
      />
      <template v-if="state.result">
        <p class="small muted">上次结果：{{ formatTime(state.result.scanned_at) }}（北京时间）</p>
        <p class="small">
          成功 {{ repos.length }} 个 · 失败
          {{ state.result.failures?.length ?? state.result.meta?.failed_count ?? 0 }} 个
        </p>
        <div class="repo-list" aria-label="热门仓库列表">
          <button
            v-for="(repo, index) in repos"
            :key="repo.full_name"
            class="repo-row"
            :class="{ selected: selected === repo.full_name }"
            :aria-pressed="selected === repo.full_name"
            @click="selected = repo.full_name"
          >
            <span class="rank">{{ index + 1 }}</span
            ><span class="repo-info"
              ><strong>{{ repo.full_name }}</strong
              ><small
                >★ {{ formatStars(repo.star_count) }} · {{ repo.finding_count }} 项发现</small
              ></span
            ><span class="tag">{{ repo.migration_score }}</span>
          </button>
        </div>
        <details v-if="state.result.failures?.length" class="notice">
          <summary>查看失败仓库</summary>
          <p v-for="failure in state.result.failures" :key="failure.full_name">
            <strong>{{ failure.full_name }}</strong
            >：{{ failure.error }}
          </p>
        </details>
      </template>
      <div v-else-if="!state.loading && !state.busy" class="empty compact">
        <p>尚无榜单结果，点击上方按钮开始扫描。</p>
      </div>
    </section>
    <PopularDetail :repo="activeRepo" />
  </div>
</template>

<style scoped>
.repo-list {
  display: grid;
  gap: 0.5rem;
}
.repo-row {
  width: 100%;
  display: flex;
  gap: 0.7rem;
  align-items: center;
  text-align: left;
  padding: 0.85rem;
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
}
.repo-row.selected {
  border-color: var(--accent);
  background: var(--accent-soft);
}
.rank {
  color: var(--text-secondary);
  font: 0.85rem var(--font-mono);
}
.repo-info {
  flex: 1;
  min-width: 0;
}
strong {
  display: block;
  font-size: 0.83rem;
  overflow-wrap: anywhere;
}
small {
  display: block;
  margin-top: 0.4rem;
  color: var(--text-secondary);
  font-size: 0.72rem;
}
summary {
  cursor: pointer;
}
</style>
