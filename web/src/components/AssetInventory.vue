<script setup>
import { computed, ref, watch } from 'vue';
import PagedCollection from './PagedCollection.vue';
import AssetRecord from './AssetRecord.vue';
import AssetInspector from './AssetInspector.vue';
import { assetKey } from '../utils/analysis.js';
const props = defineProps({ analysis: Object, findings: Array, active: {type:Boolean,default:true} });
const selected=ref(null), visible=ref([]), trigger=ref(null);
function inspect(asset, items, element) { selected.value=asset;visible.value=items;trigger.value=element; }
watch([()=>props.analysis,()=>props.active],()=>{ selected.value=null; });
defineEmits(['reveal']);
const assets = computed(() => {
  const keys = new Set(props.findings.map(assetKey));
  return (props.analysis?.assets || []).filter(asset => keys.has(assetKey(asset)));
});
</script>
<template>
  <div class="asset-inventory">
  <PagedCollection :items="assets" :item-key="assetKey" label="密码资产清单" :row-height="142" :touch-row-height="156">
    <template #heading><h3>密码资产 <span class="small muted">{{ assets.length }} 项</span></h3></template>
    <template #empty>
      <p class="notice">{{ !analysis ? '此历史结果未记录资产分析，请在发现明细中查看证据。' : '当前范围内没有密码资产。' }}</p>
    </template>
    <template #default="{ item, visibleItems }">
      <AssetRecord :asset="item" :peers="analysis.assets" @inspect="element=>inspect(item,visibleItems,element)" @reveal="(asset, location) => $emit('reveal', asset, location)" />
    </template>
  </PagedCollection>
  <AssetInspector :asset="selected" :items="visible" :active="active" :trigger="trigger" @close="selected=null" @select="selected=$event" @reveal="(asset, location)=>$emit('reveal',asset,location)" />
  </div>
</template>
<style scoped>
.asset-inventory { display:flex;flex-direction:column;min-height:0;min-width:0; }
.asset-inventory > :first-child { flex:1;min-height:0; }
</style>
