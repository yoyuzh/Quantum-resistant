<script setup>
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';
import DisclosurePanel from './DisclosurePanel.vue';
import { activityHistory } from '../utils/activity.js';
const props = defineProps({ progress: Object, target: String });
const activity = computed(() => props.progress?.activity);
const files = computed(() => (activity.value?.files || []).filter(file => file !== props.target));
const history = computed(() => activityHistory(props.progress));
</script>
<template>
  <section v-if="activity?.repository || activity?.action || files.length || progress?.recovery || history.length" class="activity-feed" aria-label="扫描动态">
    <p v-if="activity?.repository" class="activity-files">{{ activity.repository }}</p>
    <div v-if="files.length" class="activity-files">
      <span v-for="file in files" :key="file" :title="file"><AppIcon name="file" :size="13" />{{ file }}</span>
    </div>
    <p v-if="progress?.recovery" class="activity-wait" role="status">自动重试<span v-if="progress.recovery.retry_at_elapsed > progress.elapsed">，{{ Math.ceil(progress.recovery.retry_at_elapsed-progress.elapsed) }} 秒后继续</span></p>
    <DisclosurePanel v-if="activity?.action || history.length" title="任务记录">
      <p v-if="activity?.action">{{ activity.action }}</p>
      <ol v-if="history.length" class="activity-history" aria-label="最近任务记录">
        <li v-for="(item,i) in history" :key="`${item.elapsed}:${i}`" :title="item.files?.join('、')">{{ item.action }}<template v-if="item.files?.length">，{{ item.files.join('、') }}</template></li>
      </ol>
    </DisclosurePanel>
  </section>
</template>
<style scoped>
.activity-feed { width:100%; min-width:0; text-align:left; padding:12px 14px; background:var(--bg-elevated); border-radius:var(--radius); font-size:12px; }
.activity-files { display:flex; flex-wrap:wrap; gap:4px 12px; color:var(--accent-dim); }
.activity-files span { display:flex; align-items:center; gap:5px; overflow-wrap:anywhere; min-width:0; }
.activity-files svg { flex-shrink:0; }.activity-wait { color:var(--text-secondary); margin-top:6px; }
.activity-history { list-style:none; padding:8px 0 0; margin:8px 0 0; border-top:1px solid var(--border-light); display:grid; gap:5px; color:var(--text-secondary); }
.activity-history li { overflow-wrap:anywhere; }
</style>
