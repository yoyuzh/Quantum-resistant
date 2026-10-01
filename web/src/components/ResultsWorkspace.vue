<script setup>
import AppIcon from './AppIcon.vue';
import ScanLoading from './ScanLoading.vue';
import ScanResults from './ScanResults.vue';
import KnowledgePanel from './KnowledgePanel.vue';
defineProps({ state: Object, mode: String });
</script>
<template>
  <section class="panel results" aria-label="扫描结果区域" :aria-busy="state.busy">
    <ScanLoading
      v-if="state.busy"
      :mode="mode"
      :elapsed="state.elapsed"
      :has-result="!!state.result"
      :progress="state.progress"
    />
    <Transition v-else name="content" appear>
      <ScanResults v-if="state.result" :result="state.result" />
      <div
        v-else
        class="panel-body stack welcome-body"
        role="region"
        tabindex="0"
        aria-label="扫描指引与迁移知识"
      >
        <div class="empty">
          <span class="empty-mark"><AppIcon name="graph" :size="38" /></span>
          <h2>让密码资产清晰可见</h2>
          <p>选择来源并开始扫描，查看算法、证据与迁移待办。</p>
          <div class="welcome-flow" aria-hidden="true">
            <span><AppIcon name="file" :size="17" />文件</span>
            <AppIcon name="arrow" :size="16" />
            <span><AppIcon name="scan" :size="17" />算法</span>
            <AppIcon name="arrow" :size="16" />
            <span><AppIcon name="list" :size="17" />迁移方向</span>
          </div>
        </div>
        <KnowledgePanel />
      </div>
    </Transition>
  </section>
</template>
<style scoped>
.welcome-flow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin-top: 2rem;
  color: var(--text-secondary);
  font-size: 0.75rem;
}
.welcome-flow span {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
</style>
