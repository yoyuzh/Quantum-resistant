<script setup>
import AppIcon from './AppIcon.vue';
import ScanLoading from './ScanLoading.vue';
import ScanResults from './ScanResults.vue';
import KnowledgePanel from './KnowledgePanel.vue';
defineProps({ state: Object, mode: String, input: Object });
defineEmits(['toggle-input', 'rescan']);
</script>
<template>
  <section class="panel results" :class="{ 'has-result': state.result }" aria-label="扫描结果区域" :aria-busy="state.busy">
    <ScanLoading
      v-if="state.busy && !state.result"
      :mode="mode"
      :progress="state.progress"
    />
    <Transition v-else name="content" appear>
      <ScanResults v-if="state.result" :result="state.result" :state="state" :input="input"
        @toggle-input="$emit('toggle-input')" @rescan="$emit('rescan')" />
      <div
        v-else
        class="panel-body stack welcome-body workspace-surface"
        role="region"
        tabindex="0"
        aria-label="扫描等待与迁移参考"
      >
        <div class="empty">
          <span class="empty-mark"><AppIcon name="scan" :size="28" /></span>
          <h2>等待扫描</h2>
          <p>扫描后显示算法、命中位置与迁移建议。</p>
        </div>
        <KnowledgePanel />
      </div>
    </Transition>
  </section>
</template>
<style scoped>
.results { background: var(--bg-surface); }
.results.has-result { background: transparent; box-shadow: none; }
.welcome-body > .empty { padding-block: 2rem; }
.empty-mark { width: 60px; height: 60px; border-radius: 16px; margin-bottom: 1rem; }
.empty h2 { font-size: 18px; }
.welcome-body > :last-child { padding-top: 8px; }
</style>
