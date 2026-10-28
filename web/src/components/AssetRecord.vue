<script setup>
import AppIcon from './AppIcon.vue';
import { fileLabel } from '../utils/presentation.js';
import { statusLabel } from '../utils/verification.js';
defineProps({ asset: Object, peers: Array });
defineEmits(['reveal', 'inspect']);
</script>
<template>
  <article class="asset-record">
    <div class="asset-identity"><AppIcon name="file" :size="18" /><strong :title="asset.file_name">{{ fileLabel(asset,peers) }}</strong><span class="tag">{{ asset.algorithm }}</span></div>
    <p>{{ statusLabel(asset.verification_status) }} · {{ asset.purpose }}</p>
    <div class="asset-actions"><button class="button text-action" @click="$emit('reveal',asset,asset.locations[0])">{{ asset.finding_count }} 项证据 <AppIcon name="arrow" :size="16" /></button>
      <button class="button secondary compact" aria-haspopup="dialog" @click="$emit('inspect',$event.currentTarget)">查看详情</button></div>
  </article>
</template>
<style scoped>
.asset-record { display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border-light);border-radius:var(--radius);background:var(--bg-surface);height:100%;min-width:0; }
.asset-identity { display:flex;align-items:center;gap:8px;min-width:0; }.asset-identity strong { font-size:15px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }.asset-identity .tag { margin-left:auto;flex:none; }
p { margin:0;color:var(--text-secondary);font-size:14px; }.asset-actions { margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:8px; }.asset-actions .button { font-size:14px; }
</style>
