<script setup>
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';
import ScanActivityFeed from './ScanActivityFeed.vue';
import { scanStage, scanStages } from '../utils/scanStages.js';
import { elapsedStamp, batchWaiting } from '../utils/activity.js';
const props = defineProps({ mode: String, progress: Object, state: Object });
defineEmits(['cancel']);
const stage = computed(() => scanStage(props.progress, props.state?.aiBusy));
const elapsed = computed(() => Math.floor(props.progress?.elapsed ?? props.state?.elapsed ?? 0));
const waiting=computed(()=>batchWaiting(props.progress));
const stopped = computed(() => props.progress?.cancel_requested || props.progress?.ai_stop_requested || props.state?.cancelling);
</script>
<template>
  <div class="scan-loading" role="region" aria-label="扫描等待状态" aria-busy="true" tabindex="-1">
    <div class="loading-top"><strong>{{ state?.submittedSource || progress?.target || '本次扫描' }}</strong><span>总用时 {{ elapsedStamp(elapsed) }}<template v-if="waiting >= 3"> · 本批等待 {{ waiting }} 秒</template></span></div>
    <div class="loading-center">
      <div class="scan-network" aria-hidden="true">
        <span v-for="(icon, i) in ['file', 'graph', 'assist']" :key="icon" class="network-node" :class="{ active: i === Math.min(2, Math.floor(stage.index / 1.5)) }"><AppIcon :name="icon" :size="30" /></span>
        <span class="network-stream"></span>
      </div>
      <h2 role="status">{{ stopped ? '正在保留已完成部分' : stage.title }}</h2>
      <ol class="stage-track" aria-label="扫描阶段"><li v-for="(name, i) in scanStages" :key="name" :class="{ current: i === stage.index, finished: i < stage.index }" :aria-current="i === stage.index ? 'step' : undefined">
        <span class="stage-dot"><span>{{ i < stage.index ? '✓' : i + 1 }}</span></span>{{ name }}</li></ol>
      <div class="progress-block">
        <div class="stage-progress" role="progressbar" :aria-label="stage.title" :aria-valuenow="stage.row?.percent ?? undefined" aria-valuemin="0" aria-valuemax="100"><span :class="{ indeterminate: stage.row?.percent == null }" :style="stage.row?.percent != null ? { transform: `scaleX(${Math.min(100, stage.row.percent) / 100})` } : {}"></span></div>
        <p v-if="stage.row">{{ stage.row.label }} {{ stage.row.value }}<span v-if="stage.row.total != null"> / {{ stage.row.total }}</span><strong v-if="stage.row.percent != null">{{ stage.row.percent }}%</strong><span class="progress-scope">当前步骤</span></p>
        <p v-else>{{ stage.index === 3 ? '正在核对算法、用途与关联证据' : '完成后统一呈现分析结果' }}</p>
      </div>
      <ScanActivityFeed :progress="progress" :stage="stage.index" />
      <p v-if="state?.connection" class="notice" role="status">{{ state.connection }}</p>
      <button class="button secondary" :disabled="stopped || !progress?.id" @click="$emit('cancel')">{{ stopped ? '正在整理…' : progress?.ai_running || state?.aiBusy ? '停止 AI 并查看结果' : '取消扫描' }}</button>
    </div>
  </div>
</template>
<style scoped>
.scan-loading { flex: 1; min-height: 440px; min-width: 0; display: flex; flex-direction: column; padding: 18px 24px; background: var(--bg-surface); border-radius: inherit; }
.loading-top { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 10px; font-size: 12px; color: var(--text-secondary); }.loading-top strong { max-width: 80%; overflow-wrap: anywhere; font-weight: 500; }
.loading-center { width: min(100%, 660px); margin: auto; display: grid; justify-items: center; gap: 18px; padding-block: 18px; }h2 { font-size: 20px; font-weight: 600; text-align: center; }
.progress-block strong { margin-left:14px; color:var(--accent); font-variant-numeric:tabular-nums; }.progress-scope { margin-left:8px; color:var(--text-muted); }
.scan-network { display: flex; align-items: center; justify-content: space-between; position: relative; width: min(350px, 85%); padding-block: 22px; }.scan-network::before { content: ''; position: absolute; left: 24px; right: 24px; height: 1px; background: var(--border-light); }
.network-node { position: relative; z-index: 1; display: grid; place-items: center; height: 64px; width: 64px; border-radius: 18px; background: var(--bg-elevated); color: var(--text-muted); }.network-node.active { background: var(--control-selected); color: var(--accent); animation: breathe 2.4s ease-in-out infinite; }
.network-stream { z-index:0; position: absolute; left: 10%; width: 20%; height: 3px; background: var(--accent); border-radius: 4px; animation: stream 2.6s ease-in-out infinite; }
.stage-track { display: flex; justify-content: space-between; gap: 12px; width: 100%; list-style: none; padding: 0; margin: 0; color: var(--text-muted); font-size: 12px; }.stage-track li { display: flex; align-items: center; gap: 6px; }.stage-track .current { color: var(--accent); font-weight: 600; }.stage-track .finished { color: var(--text-secondary); }
.stage-dot { display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: var(--bg-elevated); font-size: 11px; }.current .stage-dot, .finished .stage-dot { background: var(--accent-soft); color: var(--accent); }
.progress-block { width: 100%; text-align: center; font-size: 12px; color: var(--text-secondary); }.progress-block p { margin-top: 10px; }.stage-progress { height: 5px; overflow: hidden; border-radius: 5px; background: var(--bg-elevated); }.stage-progress > span { display: block; height: 100%; background: var(--accent); transform-origin: left; transition: transform 300ms ease; border-radius: inherit; }.stage-progress > .indeterminate { width: 30%; animation: sweep 1.7s ease-in-out infinite; }
@keyframes sweep { from { transform: translateX(-100%); } to { transform: translateX(440%); } }@keyframes stream { 0% { transform: translateX(0); opacity: 0; } 30% { opacity: .7; } 100% { transform: translateX(300%); opacity: 0; } }@keyframes breathe { 50% { transform: translateY(-4px); } }
@media (min-width: 1024px) and (min-height: 600px) { .scan-loading { min-height: 0; flex-basis: 0; } }@media (max-width: 600px) { .scan-loading { padding: 16px; }.stage-track { flex-wrap: wrap; justify-content: center; gap: 12px 18px; }.loading-center { gap: 20px; } }
@media (prefers-reduced-motion: reduce) { .network-node.active, .network-stream, .indeterminate { animation: none !important; }.network-stream { display: none; }.stage-progress > span { transition: none; } }
</style>
