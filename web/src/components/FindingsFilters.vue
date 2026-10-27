<script setup>
import { computed } from 'vue';
import SelectControl from './SelectControl.vue';
import { methodLabel } from '../utils/analysis.js';
import { fileLabel } from '../utils/presentation.js';
import { statusOptions } from '../utils/verification.js';
import { purposeLabels } from '../utils/assistance.js';
const props = defineProps({ findings: Array, sources: Array, filters: Object });
defineEmits(['update']);
const algorithms = computed(() => [{ value: '', label: '全部算法' },
  ...[...new Set(props.findings.map(item => item.algorithm))].sort().map(value => ({ value, label: value }))]);
const methods = computed(() => [{ value: '', label: '全部识别方式' },
  ...[...new Set(props.findings.map(item => item.detection_method || 'unknown'))].sort()
    .map(value => ({ value, label: methodLabel(value) }))]);
const files = computed(() => [{ value: '', label: '全部文件' },
  ...props.sources.map(source => ({ value: source.source_id, label: fileLabel(source, props.sources) }))]);
</script>
<template>
  <div class="findings-filters">
    <SelectControl v-if="findings.some(f => f.verification_status)" :model-value="filters.status || ''" label="确认状态" :options="statusOptions" @update:model-value="$emit('update', {status:$event})" />
    <SelectControl v-if="findings.some(f => f.purpose_code)" :model-value="filters.purpose || ''" label="用途" :options="[{value:'',label:'全部用途'},...Object.entries(purposeLabels).map(([value,label])=>({value,label}))]" @update:model-value="$emit('update',{purpose:$event})" />
    <SelectControl :model-value="filters.algorithm" label="算法" :options="algorithms"
      @update:model-value="$emit('update', { algorithm: $event })" />
    <SelectControl :model-value="filters.method" label="识别方式" :options="methods"
      @update:model-value="$emit('update', { method: $event })" />
    <SelectControl :model-value="filters.sourceId" label="文件" :options="files"
      @update:model-value="$emit('update', { sourceId: $event })" />
    <label>搜索<input :value="filters.query" type="search" placeholder="文件、API、证据或迁移建议"
      @input="$emit('update', { query: $event.target.value })" /></label>
  </div>
</template>
<style scoped>
.findings-filters { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 8px; padding: 8px var(--workspace-gutter); }
.findings-filters :deep(.select-label), label { font-size: 12px; line-height: 16px; gap: 2px; }
.findings-filters :deep(.select-field) { gap: 2px; }
.findings-filters :deep(.select-trigger), input { height: var(--control-height); padding: 4px 8px; line-height: 20px; }
.findings-filters :deep(.select-value) { display: block; white-space: nowrap; text-overflow: ellipsis; line-height: 20px; }
@container results (max-width: 760px) {
  .findings-filters { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 600px) {
  input { font-size: 16px; }
}
</style>
