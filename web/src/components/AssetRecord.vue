<script setup>
import AppIcon from './AppIcon.vue';
import DisclosurePanel from './DisclosurePanel.vue';
import { methodLabel } from '../utils/analysis.js';
import { fileLabel } from '../utils/presentation.js';
defineProps({ asset: Object, peers: Array });
defineEmits(['reveal']);
</script>
<template>
  <article class="asset-record">
    <div class="asset-identity">
      <AppIcon name="file" :size="16" />
      <strong>{{ fileLabel(asset, peers) }}</strong><span class="tag">{{ asset.algorithm }}</span>
    </div>
    <p class="asset-count">{{ asset.finding_count }} 项命中 · {{ asset.purpose }}</p>
    <button class="button text-action asset-evidence" @click="$emit('reveal', asset, asset.locations[0])">
      <AppIcon name="code" :size="16" />
      {{ asset.finding_count === 1 ? `证据 · 第 ${asset.locations[0]?.line} 行` : `${asset.finding_count} 项证据` }}
      <AppIcon name="arrow" :size="16" />
    </button>
    <DisclosurePanel class="asset-disclosure" title="资产详情">
      <dl>
        <dt>完整路径</dt><dd>{{ asset.file_name }}</dd>
        <dt>文件身份</dt><dd>{{ asset.source_id }}</dd>
        <dt>识别方式</dt><dd>{{ asset.detection_methods.map(methodLabel).join(' / ') }}</dd>
        <dt>密码库</dt><dd>{{ asset.libraries.join(' / ') || '未记录' }}</dd>
        <dt>完整 API</dt><dd class="api">{{ asset.resolved_apis.join(' / ') || '未记录' }}</dd>
        <dt>迁移参考</dt><dd>{{ asset.targets.join(' / ') }} · 按用途评估</dd>
      </dl>
    </DisclosurePanel>
  </article>
</template>
<style scoped>
.asset-record { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-content: start;
  gap: 2px 8px; padding: 8px 12px; border: 1px solid var(--border-light);
  border-radius: 8px; background: var(--bg-surface); }
.asset-identity { display: flex; align-items: center; gap: 6px; min-width: 0; }
.asset-identity strong { font-size: 13px; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.asset-identity .tag { flex-shrink: 0; }
.asset-count { grid-column: 1; font-size: 12px; line-height: 18px; color: var(--text-secondary); }
.asset-evidence { grid-column: 2; grid-row: 1 / 3; font-size: 12px; }
.asset-disclosure { grid-column: 1 / -1; }
.asset-disclosure :deep(summary) { min-height: 28px; padding-block: 2px; }
dl { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 4px 12px; margin: 0; }
dd { margin: 0; overflow-wrap: anywhere; }
.api { font-family: var(--font-mono); }
@media (max-width: 600px), (pointer: coarse) {
  .asset-disclosure :deep(summary) { min-height: 44px; }
}
@media (max-width: 600px) {
  .asset-evidence { grid-column: 1 / -1; grid-row: auto; justify-self: start; }
}
</style>
