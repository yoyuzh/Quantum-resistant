<script setup>
import { computed, ref, watch } from 'vue';
import { formatStars, formatTime, sortRepos } from '../utils/results.js';
import ScanStatus from './ScanStatus.vue';
import PopularDetail from './PopularDetail.vue';
import SelectControl from './SelectControl.vue';
import ScanLoading from './ScanLoading.vue';
import AppIcon from './AppIcon.vue';
import TaskProgress from './TaskProgress.vue';
import PopularOverview from './PopularOverview.vue';
import ScanHelp from './ScanHelp.vue';
const topOptions = [5, 8, 10, 20, 30].map((value) => ({ value, label: `${value} 个仓库` }));
const props = defineProps({ state: Object });
defineEmits(['refresh', 'reload', 'update:top', 'cancel', 'scan-repository']);
const previous = ref(false);
const displayed = computed(() =>
  previous.value && props.state.previous ? props.state.previous : props.state.result,
);
watch(
  () => props.state.previous,
  (value) => {
    if (value) previous.value = true;
  },
);
const selected = ref('');
const repos = computed(() => sortRepos(displayed.value?.repos || []));
watch(
  () => props.state.result,
  () => {
    previous.value = false;
  },
);
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
    <section class="panel popular-panel">
      <div class="panel-heading">
        <h2>热门密码学仓库</h2>
        <p class="muted small">Python · 按 GitHub Star 排序</p>
      </div>
      <div class="panel-body stack" role="region" tabindex="0" aria-label="热门仓库扫描与列表">
        <SelectControl
          label="扫描仓库数量"
          :model-value="state.busy && state.progress?.total_repos != null ? state.progress.total_repos : state.top"
          :options="topOptions"
          :disabled="state.busy || state.loading"
          @update:model-value="$emit('update:top', $event)"
        />
        <button
          class="button primary"
          :disabled="state.busy || state.loading"
          @click="$emit('refresh')"
        >
          {{ state.busy ? '正在扫描…' : state.result ? '重新扫描热门仓库' : '开始热门扫描' }}
        </button>
        <ScanHelp mode="popular" />
        <ScanStatus
          :busy="state.busy || state.loading"
          :label="state.loading ? '正在加载上次结果' : '正在检索与扫描仓库'"
          :error="state.error"
          :elapsed="state.progress?.elapsed ?? state.elapsed"
          :has-result="!!state.result"
          @retry="$emit(state.retryRefresh ? 'refresh' : 'reload')"
        />
        <TaskProgress :state="state" @cancel="$emit('cancel')" />
        <template v-if="displayed">
          <p class="small muted">
            {{ previous ? '上次快照' : '本次结果' }}：{{
              formatTime(displayed.scanned_at)
            }}（北京时间）
          </p>
          <p v-if="displayed.meta?.incomplete" class="notice">
            本次结果不完整，上次快照已保留。{{ displayed.meta.save_error }}
          </p>
          <button
            v-if="state.result?.meta?.incomplete"
            class="button secondary"
            @click="state.previous ? (previous = !previous) : $emit('reload')"
          >
            {{ previous ? '查看本次部分结果' : '查看上次快照' }}
          </button>
          <PopularOverview :result="displayed" @select="selected = $event" />
          <p class="small">
            成功 {{ repos.length }} 个 · 失败
            {{ displayed.failures?.length ?? displayed.meta?.failed_count ?? 0 }} 个
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
                  ><AppIcon name="star" :size="13" /> {{ formatStars(repo.star_count) }} ·
                  {{ repo.finding_count }} 项发现 · {{ !repo.coverage ? '范围未知' : repo.coverage.partial ? '部分扫描' : repo.coverage.candidate_files == null ? '总数未知' : `${repo.coverage.scanned_files} 个文件` }}</small
                ></span
              ><span class="tag" :aria-label="`迁移评分 ${repo.migration_score}`">{{ repo.migration_score }} 分</span>
            </button>
          </div>
          <details v-if="displayed.failures?.length" class="notice">
            <summary>查看失败仓库</summary>
            <p v-for="failure in displayed.failures" :key="failure.full_name">
              <strong>{{ failure.full_name }}</strong
              >：{{ failure.error }}
            </p>
          </details>
        </template>
        <div v-else-if="!state.loading && !state.busy" class="empty compact">
          <p>尚无榜单结果，点击上方按钮开始扫描。</p>
        </div>
      </div>
    </section>
    <section v-if="state.busy" class="panel results" aria-label="热门扫描进度">
      <ScanLoading
        mode="popular"
        :elapsed="state.elapsed"
        :has-result="!!state.result"
        :progress="state.progress"
      />
    </section>
    <Transition v-else name="content" appear>
      <PopularDetail :key="selected" :repo="activeRepo" @scan-repository="$emit('scan-repository', $event)" />
    </Transition>
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
  border-radius: var(--radius);
  cursor: pointer;
}
.repo-row:hover:not(.selected) {
  background: var(--accent-soft);
}
.repo-row.selected {
  background: var(--accent-soft);
  box-shadow: inset 3px 0 var(--accent);
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
