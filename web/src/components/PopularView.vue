<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { capturePosition, focusDestination, restorePosition } from '../utils/navigation.js';
import { formatStars, formatTime, sortRepos } from '../utils/results.js';
import ScanStatus from './ScanStatus.vue';
import PopularDetail from './PopularDetail.vue';
import SelectControl from './SelectControl.vue';
import ScanLoading from './ScanLoading.vue';
import AppIcon from './AppIcon.vue';
import PopularOverview from './PopularOverview.vue';
import ScanHelp from './ScanHelp.vue';
import AiControls from './AiControls.vue';
const topOptions = [5, 8, 10, 20, 30].map((value) => ({ value, label: `${value} 个仓库` }));
const props = defineProps({ state: Object });
defineEmits(['refresh', 'reload', 'update:top', 'cancel', 'scan-repository']);
const displayed=computed(()=>props.state.result);
const selected = ref('');
const settingsExpanded=ref(false);
const listBody = ref(null);
const detail = ref(null);
let returnPoint;
let navigation = 0;
async function selectRepository(name) {
  const id = ++navigation;
  returnPoint = { trigger: document.activeElement, position: capturePosition(listBody.value) };
  selected.value = name;
  await nextTick();
  if (id !== navigation) return;
  const root = detail.value?.$el;
  focusDestination(root?.querySelector('h2'), root?.querySelector('.panel-body'));
}
function backToList() {
  navigation++;
  restorePosition(listBody.value, returnPoint?.position);
  returnPoint?.trigger?.focus({ preventScroll: true });
}
const repos = computed(() => sortRepos(displayed.value?.repos || []));
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
  <div class="workspace-grid popular-workspace" :class="{'popular-running':state.busy}">
    <section v-if="state.busy" class="panel results popular-wait" aria-label="热门扫描进度"><ScanLoading mode="popular" :state="state" :progress="state.progress" @cancel="$emit('cancel')" /></section>
    <section v-show="!state.busy" class="panel popular-panel">
      <div class="panel-heading">
        <h2>热门密码学仓库</h2>
        <p class="muted small">Python · 按 GitHub Star 排序</p>
      </div>
      <div ref="listBody" class="panel-body stack" role="region" tabindex="0" aria-label="热门仓库扫描与列表">
        <button v-if="displayed" class="button secondary compact settings-toggle" :aria-expanded="settingsExpanded" @click="settingsExpanded=!settingsExpanded">扫描设置</button>
        <div v-if="!displayed || settingsExpanded" class="popular-settings">
        <SelectControl
          label="扫描仓库数量"
          :model-value="state.busy && state.progress?.total_repos != null ? state.progress.total_repos : state.top"
          :options="topOptions"
          :disabled="state.busy || state.loading"
          @update:model-value="$emit('update:top', $event)"
        />
        <AiControls :disabled="state.busy" />
        <ScanHelp mode="popular" />
        </div>
        <button
          class="button primary"
          :disabled="state.busy || state.loading"
          @click="$emit('refresh')"
        >
          {{ state.busy ? '正在扫描…' : state.result ? '重新扫描热门仓库' : '开始热门扫描' }}
        </button>
        <ScanStatus
          :busy="false"
          :label="state.loading ? '正在加载上次结果' : '正在检索与扫描仓库'"
          :error="state.error"
          :elapsed="state.progress?.elapsed ?? state.elapsed"
          :has-result="!!state.result"
          @retry="$emit(state.retryRefresh ? 'refresh' : 'reload')"
        />

        <template v-if="displayed">
          <p class="small muted">
            本次结果：{{
              formatTime(displayed.scanned_at)
            }}（北京时间）
          </p>
          <p v-if="displayed.meta?.incomplete" class="notice">
            本次结果不完整。{{ displayed.meta.save_error }}
          </p>

          <PopularOverview :result="displayed" @select="selectRepository" />
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
              aria-controls="popular-detail"
              @click="selectRepository(repo.full_name)"
            >
              <span class="rank">{{ index + 1 }}</span
              ><span class="repo-info"
                ><strong>{{ repo.full_name }}</strong
                ><small
                  ><AppIcon name="star" :size="13" /> {{ formatStars(repo.star_count) }} ·
                  {{ repo.analysis_summary?.confirmed ?? repo.finding_count }} 静态 / {{ repo.analysis_summary?.ai_assessed || 0 }} AI · {{ !repo.coverage ? '范围未知' : repo.coverage.partial ? '部分扫描' : repo.coverage.candidate_files == null ? '总数未知' : `${repo.coverage.scanned_files} 个文件` }}</small
                ></span
              ><span class="tag" :aria-label="`迁移评分 ${repo.analysis_summary?.migration_score ?? repo.migration_score}`">{{ repo.analysis_summary?.migration_score ?? repo.migration_score }} 分</span>
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
          <p>暂无热门仓库扫描结果。</p>
        </div>
      </div>
    </section>
    <Transition v-if="!state.busy" name="content" appear>
      <PopularDetail :key="selected" ref="detail" :repo="activeRepo" :task-id="state.result?.task_id" @back="backToList"
        @scan-repository="$emit('scan-repository', $event)" />
    </Transition>
  </div>
</template>

<style scoped>
.popular-wait { grid-column:1/-1;min-height:0; }.popular-running { grid-template-columns:minmax(0,1fr); }
@media(min-width:1024px) and (min-height:600px) { .popular-workspace { grid-template-columns:320px minmax(0,1fr); }.popular-running { grid-template-columns:minmax(0,1fr); } }
.repo-list {
  display: grid;
  gap: 4px;
  min-height:0;
  overflow:auto;
  align-content:start;
  flex:1;
}
.popular-settings { display:grid;gap:10px; }.settings-toggle { align-self:start; }
.popular-panel { position:relative; }.popular-panel .panel-heading { padding:10px 12px; }.popular-panel .panel-heading h2 { font-size:16px; }.popular-panel .panel-heading p { font-size:12px; }
.popular-panel > .panel-body { gap:8px;padding:8px 12px; }.popular-panel > .panel-body > p { margin:0;font-size:12px; }.popular-panel .settings-toggle { position:absolute;top:8px;right:12px;min-height:28px;font-size:11px; }.popular-panel:has(.settings-toggle) .panel-heading { padding-right:90px; }
.repo-row {
  width: 100%;
  display: flex;
  gap: 0.7rem;
  align-items: center;
  text-align: left;
  padding: 8px;
  background: var(--control-bg);
  color: var(--text-primary);
  border-radius: var(--radius);
  cursor: pointer;
}
.repo-row:hover:not(.selected) {
  background: var(--control-hover);
}
.repo-row.selected {
  background: var(--control-selected);
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
  margin-top: 2px;
  color: var(--text-secondary);
  font-size: 0.72rem;
}
summary {
  cursor: pointer;
}
</style>
