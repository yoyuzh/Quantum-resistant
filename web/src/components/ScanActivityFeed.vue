<script setup>
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';
import { activityHistory } from '../utils/activity.js';
const props = defineProps({ progress: Object, stage: Number });
const activity = computed(() => props.progress?.activity);
const history = computed(() => activityHistory(props.progress));
const fallback = ['正在采集待分析的源码文件', '正在检查密码调用与算法配置',
  '正在建立模块关系并核验参数传播', '正在准备模型所需的脱敏证据', '正在整合发现、用途与迁移待办'];
</script>
<template>
  <section class="activity-feed" aria-label="扫描实时动态">
    <div class="activity-caption"><span><i aria-hidden="true"></i>当前任务</span>
      <span v-if="progress?.ai_progress">剩余 {{ progress.ai_progress.remaining }} 组 · 已提交 {{ progress.ai_progress.calls || 0 }} 次请求</span>
    </div>
    <p v-if="activity?.repository" class="activity-files">{{ activity.repository }}</p>
    <p class="activity-action" role="status">{{ activity?.action || fallback[stage] }}</p>
    <div v-if="activity?.files?.length" class="activity-files">
      <span v-for="file in activity.files" :key="file" :title="file"><AppIcon name="file" :size="13" />{{ file }}</span>
    </div>
    <p v-if="progress?.recovery" class="activity-wait">正在自动恢复 · 第 {{ progress.recovery.attempt }} 次补救<span v-if="progress.recovery.retry_at_elapsed > progress.elapsed"> · {{ Math.ceil(progress.recovery.retry_at_elapsed-progress.elapsed) }} 秒后继续</span></p>
    <ol v-if="history.length" class="activity-history" aria-label="最近任务动态">
      <li v-for="(item,i) in history" :key="`${item.elapsed}:${i}`"><span>{{ item.action }}<small v-if="item.files?.length" :title="item.files.join('、')"> · {{ item.files.join('、') }}</small></span></li>
    </ol>
  </section>
</template>
<style scoped>
.activity-feed { width:100%; min-width:0; text-align:left; padding:12px 14px; background:var(--bg-elevated); border-radius:var(--radius); font-size:12px; }
.activity-caption { display:flex; flex-wrap:wrap; justify-content:space-between; gap:4px 12px; color:var(--text-secondary); }
.activity-caption > span:first-child { display:flex; align-items:center; gap:6px; }
.activity-caption i { width:6px; height:6px; background:var(--accent); border-radius:50%; animation:pulse 2s ease-in-out infinite; }
.activity-action { color:var(--text-primary); font-size:13px; margin:8px 0 4px; }
.activity-files { display:flex; flex-wrap:wrap; gap:4px 12px; color:var(--accent-dim); }
.activity-files span { display:flex; align-items:center; gap:5px; overflow-wrap:anywhere; min-width:0; }
.activity-files svg { flex-shrink:0; }.activity-wait { color:var(--text-secondary); margin-top:6px; }
.activity-history { list-style:none; padding:8px 0 0; margin:8px 0 0; border-top:1px solid var(--border-light); display:grid; gap:5px; color:var(--text-secondary); }
.activity-history li { display:flex; gap:10px; min-width:0; }.activity-history time { font-variant-numeric:tabular-nums; flex-shrink:0; }
.activity-history li > span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }.activity-history small { font-size:inherit; }
@keyframes pulse { 50% { opacity:.4; } }
@media(prefers-reduced-motion:reduce) { .activity-caption i { animation:none; } }
</style>
