<script setup>
import ScanLoading from './ScanLoading.vue';
import ScanResults from './ScanResults.vue';
import KnowledgePanel from './KnowledgePanel.vue';
defineProps({ state: Object, mode: String, input: Object });
defineEmits(['toggle-input', 'rescan', 'cancel']);
</script>
<template>
  <section class="panel results" :class="{ 'has-result': state.result && !state.busy && !state.aiBusy }" aria-label="扫描结果区域" :aria-busy="state.busy || state.aiBusy">
    <ScanLoading
      v-if="state.busy || state.aiBusy"
      :mode="mode"
      :progress="state.aiBusy ? state.aiProgress : state.progress" :state="state" @cancel="$emit('cancel')"
    />
    <Transition name="content">
      <ScanResults v-if="state.result" v-show="!state.busy && !state.aiBusy" :presented="!state.busy && !state.aiBusy" :result="state.result" :state="state" :input="input"
        @toggle-input="$emit('toggle-input')" @rescan="$emit('rescan')" />
      <div
        v-else-if="!state.busy && !state.aiBusy"
        class="panel-body stack welcome-body workspace-surface"
        role="region"
        tabindex="0"
        aria-label="迁移参考"
      >
        <KnowledgePanel />
      </div>
    </Transition>
  </section>
</template>
<style scoped>
.results { background: var(--bg-surface); }
.results[aria-busy='true'] :deep(.result-layout),
.results[aria-busy='true'] .welcome-body { display:none !important; }
.results.has-result { background: transparent; box-shadow: none; }
</style>
