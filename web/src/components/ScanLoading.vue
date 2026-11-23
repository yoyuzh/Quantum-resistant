<script setup>
import { computed, ref, watch } from 'vue';
import AppIcon from './AppIcon.vue';
import ScanActivityFeed from './ScanActivityFeed.vue';
import { completedModelProgress, libraryScanStage, libraryScanStages, modelCompletionStage, scanStage, scanStages } from '../utils/scanStages.js';
import { elapsedStamp } from '../utils/activity.js';
import { PROGRESS_FILL_MS } from '../utils/progress.js';
import { TERMINAL } from '../utils/remoteTasks.js';
const props = defineProps({ mode: String, progress: Object, state: Object });
defineEmits(['cancel']);
const libraryMode = computed(() => props.mode === 'library');
const waiting = ref(0);
watch(() => props.progress, (progress, _, onCleanup) => {
  const started = progress?.activity?.waiting_since;
  waiting.value = 0;
  if (started == null || !progress.ai_progress?.active_groups) return;
  const observed = performance.now() - Math.max(0, progress.elapsed - started) * 1000;
  const update = () => { waiting.value = Math.floor((performance.now() - observed) / 1000); };
  update();
  const timer = setInterval(update, 250);
  onCleanup(() => clearInterval(timer));
}, { immediate: true });
const stages = computed(() => libraryMode.value ? libraryScanStages(props.progress) : scanStages);
const modelDone = computed(() => props.state?.modelPresentation ||
  (!props.progress?.cancel_requested && !props.progress?.ai_stop_requested && !props.progress?.error &&
    (props.progress?.stage === '结果整理' || ['succeeded', 'partial'].includes(props.progress?.state)) &&
    completedModelProgress(props.progress?.ai_progress)));
const stage = computed(() => modelDone.value
  ? modelCompletionStage(modelDone.value, libraryMode.value ? stages.value.indexOf('用途复核') : 3)
  : libraryMode.value ? libraryScanStage(props.progress, waiting.value) : scanStage(props.progress, props.state?.aiBusy, waiting.value));
const activeIcon = computed(() => libraryMode.value ? stage.value.icon : Math.min(2, Math.floor(stage.value.index / 1.5)));
const icons = computed(() => libraryMode.value ? ['search', 'assist', 'repository'] : ['file', 'graph', 'assist']);
const elapsed = computed(() => Math.floor(props.progress?.elapsed ?? props.state?.elapsed ?? 0));
const stopped = computed(() => props.progress?.cancel_requested || props.progress?.ai_stop_requested || props.state?.cancelling);
const complete = computed(() => props.state?.presentationComplete);
const terminal = computed(() => TERMINAL.has(props.progress?.state));
const endedTitles = { partial: '扫描部分完成', failed: '扫描失败', cancelled: '扫描已取消' };
const endedTitle = computed(() => modelDone.value ? undefined : endedTitles[props.progress?.state]);
const percent = computed(() => complete.value ? 100 : stage.value.row?.percent);
const title = computed(() => complete.value ? (props.state?.aiBusy ? 'AI 复核完成' : '扫描完成')
  : endedTitle.value || (stopped.value && !terminal.value
    ? (props.progress?.ai_running || props.state?.aiBusy ? '正在停止 AI' : '正在取消扫描') : stage.value.title));
</script>
<template>
  <div class="scan-loading" role="region" aria-label="扫描等待状态" :aria-busy="!libraryMode || undefined" tabindex="-1">
    <div class="loading-top">
      <strong v-if="!libraryMode">{{ state?.submittedSource || progress?.target || '本次扫描' }}</strong>
      <span>用时 {{ elapsedStamp(elapsed) }}</span>
    </div>
    <div class="loading-center">
      <div class="scan-network" aria-hidden="true">
        <span v-for="(icon, i) in icons" :key="icon" class="network-node" :class="{ active: i === activeIcon }"><AppIcon :name="icon" :size="30" /></span>
        <span v-if="!complete && !endedTitle" class="network-stream"></span>
      </div>
      <h2 role="status">{{ title }}</h2>
      <ol class="stage-track" aria-label="扫描阶段">
        <li v-for="(name, i) in stages" :key="name" :class="{ current: i === stage.index }" :aria-current="i === stage.index ? 'step' : undefined">
          {{ name }}
        </li>
      </ol>
      <div class="progress-block">
        <div class="stage-progress" :role="endedTitle ? undefined : 'progressbar'" :aria-hidden="endedTitle ? true : undefined"
          :aria-label="complete || modelDone ? title : stage.row?.label || title"
          :aria-valuenow="percent ?? undefined" aria-valuemin="0" aria-valuemax="100"
          :aria-valuetext="stage.row && !complete && stage.row.total != null ? `${stage.row.value} / ${stage.row.total}` : undefined"
          :style="{ '--progress-duration': `${PROGRESS_FILL_MS}ms` }">
          <span v-if="!endedTitle && percent != null" :key="stage.index" class="fill"
            :style="{ '--progress-ratio': percent / 100 }" />
          <span v-if="!endedTitle && (percent == null || (stage.modelWaiting && percent < 100))" class="pending-track"
            aria-hidden="true" :style="{ left: `${percent ?? 0}%` }"><span class="indeterminate" /></span>
        </div>
        <p v-if="!complete && (stage.row || stage.detail)">
          <span v-if="stage.row">{{ stage.row.label }} {{ stage.row.value }}<template v-if="stage.row.total != null"> / {{ stage.row.total }}</template></span>
          <span v-if="stage.detail">{{ stage.detail }}</span>
        </p>
      </div>
      <button class="button secondary" :disabled="stopped || terminal || !progress?.id" @click="$emit('cancel')">{{ progress?.ai_running || state?.aiBusy ? '停止 AI' : '取消扫描' }}</button>
      <ScanActivityFeed v-if="!terminal" :progress="progress" :target="state?.submittedSource || progress?.target" />
      <p v-if="state?.connection" class="notice" role="status">{{ state.connection }}</p>
    </div>
  </div>
</template>
<style scoped>
.scan-loading { flex: 1; min-height: 440px; min-width: 0; display: flex; flex-direction: column; padding: 18px 24px; background: var(--bg-surface); border-radius: inherit; }
.loading-top { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 10px; font-size: 12px; color: var(--text-secondary); }.loading-top strong { max-width: 80%; overflow-wrap: anywhere; font-weight: 500; }
.loading-center { width: min(100%, 660px); margin: 0 auto; display: grid; justify-items: center; gap: 16px; padding-block: clamp(18px, 5dvh, 52px) 18px; }h2 { font-size: 20px; font-weight: 600; text-align: center; }
.scan-network { display: flex; align-items: center; justify-content: space-between; position: relative; width: min(350px, 85%); padding-block: 22px; }.scan-network::before { content: ''; position: absolute; left: 24px; right: 24px; height: 1px; background: var(--border-light); }
.network-node { position: relative; z-index: 1; display: grid; place-items: center; height: 64px; width: 64px; border-radius: 18px; background: var(--bg-elevated); color: var(--text-muted); }.network-node.active { background: var(--control-selected); color: var(--accent); animation: breathe 2.4s ease-in-out infinite; }
.network-stream { z-index:0; position: absolute; left: 10%; width: 20%; height: 3px; background: var(--accent); border-radius: 4px; animation: stream 2.6s ease-in-out infinite; }
.stage-track { display: flex; justify-content: space-between; gap: 12px; width: 100%; list-style: none; padding: 0; margin: 0; color: var(--text-secondary); font-size: 12px; }
.stage-track .current { color: var(--accent); font-weight: 600; }
.progress-block { width: 100%; min-height: 33px; text-align: center; font-size: 12px; color: var(--text-secondary); }
.progress-block p { display: flex; justify-content: center; gap: 2px 14px; flex-wrap: wrap; margin-top: 10px; }
.stage-progress { position: relative; height: 5px; overflow: hidden; border-radius: 5px; background: var(--bg-elevated); }
.stage-progress .fill, .indeterminate { display: block; height: 100%; background: var(--accent); border-radius: inherit; }
.fill { transform: scaleX(var(--progress-ratio)); transform-origin: left; transition: transform var(--progress-duration) cubic-bezier(.25,.65,.35,1); }
@starting-style { .fill { transform: scaleX(0); } }
.pending-track { position: absolute; inset: 0 0 0 0; overflow: hidden; border-radius: inherit; }
.indeterminate { width: 28%; opacity: .7; animation: sweep 1.25s ease-in-out infinite; }
@keyframes sweep { from { transform: translateX(-100%); } to { transform: translateX(440%); } }@keyframes stream { 0% { transform: translateX(0); opacity: 0; } 30% { opacity: .7; } 100% { transform: translateX(300%); opacity: 0; } }@keyframes breathe { 50% { transform: translateY(-4px); } }
@media (min-width: 1024px) and (min-height: 600px) { .scan-loading { min-height: 0; flex-basis: 0; } }@media (max-width: 600px) { .scan-loading { padding: 16px; }.stage-track { flex-wrap: wrap; justify-content: center; gap: 12px 18px; }.loading-center { gap: 20px; } }
@media (prefers-reduced-motion: reduce) { .network-node.active, .network-stream, .indeterminate { animation: none; }.network-stream { display: none; }.fill { transition: none; } }
</style>
