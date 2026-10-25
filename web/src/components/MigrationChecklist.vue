<script setup>
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';
import DisclosurePanel from './DisclosurePanel.vue';
import PagedCollection from './PagedCollection.vue';
import MigrationReferences from './MigrationReferences.vue';
import MigrationSteps from './MigrationSteps.vue';
import { migrationPresentation } from '../utils/migrationPresentation.js';
const props = defineProps({ analysis: Object, active: { type: Boolean, default: true } });
defineEmits(['select']);
const presentation = computed(() => migrationPresentation(props.analysis?.migrations));
const itemKey = item => item.algorithm;
</script>
<template>
  <PagedCollection :items="presentation.rows" :item-key="itemKey" label="迁移待办"
    :row-height="100" :touch-row-height="128">
    <template #heading>
      <div class="migration-heading"><h3>迁移方向 <span>{{ presentation.rows.length }} 项</span></h3>
        <MigrationReferences :analysis="analysis" :presentation="presentation" :active="active" />
      </div>
    </template>
    <template #empty>
      <p class="notice">{{ !analysis ? '此历史结果未记录迁移清单，请重新扫描。' : '本次没有需要生成迁移待办的算法证据。' }}</p>
    </template>
    <template #default="{ item }">
      <article class="migration-record">
        <div class="migration-identity"><strong>{{ item.algorithm }}</strong><span>{{ item.purpose }}</span></div>
        <div class="migration-direction"><strong>{{ item.targets.join(' / ') }}</strong>
          <span>{{ item.affected_files }} 个文件 · {{ item.finding_count }} 项发现</span></div>
        <div class="migration-actions">
          <DisclosurePanel v-if="item.actions.length" class="specific-actions"
            :title="`${item.algorithm} ${presentation.rows.length === 1 ? '迁移流程' : '专项说明'}`">
            <MigrationSteps :actions="item.actions" />
          </DisclosurePanel>
          <button class="button text-action" :aria-label="`查看 ${item.algorithm} 相关证据`"
            @click="$emit('select', { algorithm: item.algorithm, sourceId: '', target: '' })">
            相关证据 <AppIcon name="arrow" :size="16" />
          </button>
        </div>
      </article>
    </template>
  </PagedCollection>
</template>
<style scoped>
.migration-record { display: grid; grid-template-columns: 76px minmax(0, 1fr); align-content: start;
  align-items: center; gap: 4px 8px; padding: 8px 12px; border: 1px solid var(--border-light);
  border-radius: 8px; background: var(--bg-surface); }
.migration-identity, .migration-direction { display: grid; gap: 2px; min-width: 0; }
strong { font-size: 13px; overflow-wrap: anywhere; }
span { font-size: 12px; color: var(--text-secondary); }
.migration-heading { display: grid; justify-items: start; gap: 4px; }
.migration-heading h3 { flex-shrink: 0; }
.migration-actions { grid-column: 1 / -1; display: flex; align-items: start; justify-content: end; gap: 12px; }
.migration-actions > .button { flex-shrink: 0; font-size: 12px; }
.specific-actions { flex: 1; min-width: 0; }
.specific-actions :deep(summary) { min-height: 28px; padding-block: 2px; }
@media (max-width: 600px), (pointer: coarse) {
  .specific-actions :deep(summary) { min-height: 44px; }
}
@media (max-width: 600px) {
  .migration-record { grid-template-columns: 64px minmax(0, 1fr); }
}
</style>
