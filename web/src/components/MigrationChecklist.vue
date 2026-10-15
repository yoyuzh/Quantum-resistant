<script setup>
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';
import DisclosurePanel from './DisclosurePanel.vue';
import { migrationPresentation } from '../utils/migrationPresentation.js';
const props = defineProps({ analysis: Object });
defineEmits(['select']);
const presentation = computed(() => migrationPresentation(props.analysis?.migrations));
</script>
<template>
  <section class="stack" aria-label="迁移待办">
    <h3>迁移方向</h3>
    <p v-if="!analysis" class="notice">此历史结果未记录迁移清单，请重新扫描。</p>
    <p v-else-if="!presentation.rows.length" class="notice">本次没有需要生成迁移待办的算法证据。</p>
    <div v-else class="migration-list">
      <article v-for="item in presentation.rows" :key="item.algorithm" class="migration-row">
        <div class="migration-identity">
          <strong>{{ item.algorithm }}</strong>
          <span class="small muted">{{ item.purpose }}</span>
        </div>
        <div class="migration-direction">
          <strong>{{ item.targets.join(' / ') }}</strong>
          <span class="small muted">{{ item.affected_files }} 个文件 · {{ item.finding_count }} 项发现</span>
        </div>
        <button class="button text-action" :aria-label="`查看 ${item.algorithm} 相关证据`"
          @click="$emit('select', { algorithm: item.algorithm, sourceId: '', target: '' })">
          相关证据 <AppIcon name="arrow" :size="16" />
        </button>
        <div v-if="item.actions.length" class="specific-actions">
          <DisclosurePanel :title="`${item.algorithm} ${presentation.rows.length === 1 ? '迁移流程' : '专项说明'}`">
            <ol class="migration-steps">
              <li v-for="(action, index) in item.actions" :key="index">
                <strong>{{ action.title }}</strong><p>{{ action.description }}</p>
              </li>
            </ol>
          </DisclosurePanel>
        </div>
      </article>
    </div>
    <DisclosurePanel v-if="presentation.shared.length" title="通用迁移流程">
      <ol class="migration-steps">
        <li v-for="(action, index) in presentation.shared" :key="index">
          <strong>{{ action.title }}</strong><p>{{ action.description }}</p>
        </li>
      </ol>
    </DisclosurePanel>
    <div v-if="presentation.references.length" class="toolbar">
      <a v-for="(url, index) in presentation.references" :key="url" :href="url" target="_blank"
        rel="noopener noreferrer" class="button text-action">
        <AppIcon name="external" :size="16" />NIST 标准参考{{ presentation.references.length > 1 ? ` ${index + 1}` : '' }}
      </a>
    </div>
  </section>
</template>
<style scoped>
.migration-row {
  display: grid;
  grid-template-columns: minmax(7rem, 0.8fr) minmax(0, 1.6fr) auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid var(--border-light);
}
.migration-identity,
.migration-direction {
  display: grid;
  gap: 0.25rem;
  min-width: 0;
}
strong {
  font-size: 0.9375rem;
  overflow-wrap: anywhere;
}
.specific-actions {
  grid-column: 1 / -1;
}
.migration-steps {
  margin: 0;
  padding-left: 1.3rem;
  display: grid;
  gap: 0.85rem;
}
.migration-steps li::marker {
  color: var(--accent-dim);
}
.migration-steps p {
  margin-top: 0.25rem;
}
@media (max-width: 600px) {
  .migration-row {
    grid-template-columns: minmax(0, 1fr) auto;
  }
  .migration-direction {
    grid-column: 1;
    grid-row: 2;
  }
  .migration-row > .button {
    grid-column: 2;
    grid-row: 1 / 3;
    padding-inline: 0.65rem;
  }
}
</style>
