<script setup>
import { computed, ref, watch } from 'vue';
import { paginate } from '../utils/results.js';
import { methodLabel } from '../utils/analysis.js';
import AppIcon from './AppIcon.vue';
const props = defineProps({ analysis: Object, findings: Array });
defineEmits(['reveal']);
const page = ref(1);
const assets = computed(() => {
  const keys = new Set(
    props.findings.map((item) => JSON.stringify([item.source_id, item.algorithm])),
  );
  return (props.analysis?.assets || []).filter((asset) =>
    keys.has(JSON.stringify([asset.source_id, asset.algorithm])),
  );
});
const pagination = computed(() => paginate(assets.value, page.value, 50));
watch(assets, () => {
  page.value = 1;
});
</script>
<template>
  <section class="stack" aria-label="密码资产清单">
    <p class="small muted">
      按文件身份与算法聚合，共
      {{ assets.length }} 项资产。数量与位置为该资产的全部命中；这是本次静态证据清单，不是完整
      CBOM。
    </p>
    <p v-if="!analysis" class="notice">此历史结果未记录资产分析，请在发现明细中查看证据。</p>
    <p v-else-if="!assets.length" class="notice">当前范围内没有密码资产。</p>
    <article
      v-for="asset in pagination.items"
      :key="`${asset.source_id}:${asset.algorithm}`"
      class="analysis-card stack"
    >
      <div class="toolbar">
        <AppIcon name="file" :size="18" /><strong class="asset-file">{{ asset.file_name }}</strong
        ><span class="tag">{{ asset.algorithm }}</span>
      </div>
      <p class="small muted">
        {{ asset.source_id }} · {{ asset.finding_count }} 项命中 · {{ asset.purpose }}
      </p>
      <dl>
        <dt>识别方式</dt>
        <dd>{{ asset.detection_methods.map(methodLabel).join(' / ') }}</dd>
        <dt>密码库</dt>
        <dd>{{ asset.libraries.join(' / ') || '未记录' }}</dd>
        <dt>完整 API</dt>
        <dd class="api">{{ asset.resolved_apis.join(' / ') || '未记录' }}</dd>
        <dt>迁移参考</dt>
        <dd>{{ asset.targets.join(' / ') }} · 按用途评估</dd>
      </dl>
      <div class="toolbar" aria-label="证据位置">
        <button
          v-for="(location, index) in asset.locations.slice(0, 8)"
          :key="index"
          class="button secondary"
          :aria-label="`查看 ${asset.file_name} 第 ${location.line} 行 ${asset.algorithm} 证据`"
          @click="$emit('reveal', asset, location)"
        >
          第 {{ location.line }} 行
        </button>
        <button class="button secondary" @click="$emit('reveal', asset)">
          全部证据 <AppIcon name="arrow" :size="16" />
        </button>
      </div>
    </article>
    <div v-if="pagination.pages > 1" class="toolbar">
      <button class="button secondary" :disabled="pagination.current === 1" @click="page--">
        上一页
      </button>
      <span class="small">{{ pagination.current }} / {{ pagination.pages }}</span>
      <button
        class="button secondary"
        :disabled="pagination.current === pagination.pages"
        @click="page++"
      >
        下一页
      </button>
    </div>
  </section>
</template>
<style scoped>
.asset-file {
  font-size: 0.85rem;
  overflow-wrap: anywhere;
}
dl {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.5rem 1rem;
  margin: 0;
  font-size: 0.78rem;
}
dt {
  color: var(--text-secondary);
}
dd {
  margin: 0;
  overflow-wrap: anywhere;
}
.api {
  font-family: var(--font-mono);
}
</style>
