<script setup>
import { computed } from 'vue';
import PagedCollection from './PagedCollection.vue';
import AssetRecord from './AssetRecord.vue';
const props = defineProps({ analysis: Object, findings: Array });
defineEmits(['reveal']);
const assetKey = asset => JSON.stringify([asset.source_id, asset.algorithm]);
const assets = computed(() => {
  const keys = new Set(props.findings.map(assetKey));
  return (props.analysis?.assets || []).filter(asset => keys.has(assetKey(asset)));
});
</script>
<template>
  <PagedCollection :items="assets" :item-key="assetKey" label="密码资产清单">
    <template #heading><h3>密码资产 <span class="small muted">{{ assets.length }} 项</span></h3></template>
    <template #empty>
      <p class="notice">{{ !analysis ? '此历史结果未记录资产分析，请在发现明细中查看证据。' : '当前范围内没有密码资产。' }}</p>
    </template>
    <template #default="{ item }">
      <AssetRecord :asset="item" :peers="analysis.assets" @reveal="(asset, location) => $emit('reveal', asset, location)" />
    </template>
  </PagedCollection>
</template>
