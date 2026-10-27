<script setup>
import { computed, ref, watch } from 'vue';
import AppIcon from './AppIcon.vue';
import PagedCollection from './PagedCollection.vue';
import MigrationReferences from './MigrationReferences.vue';
import MigrationInspector from './MigrationInspector.vue';
import { migrationPresentation } from '../utils/migrationPresentation.js';
import { statusLabel } from '../utils/verification.js';
const props = defineProps({ analysis: Object, active: { type: Boolean, default: true } });
defineEmits(['select']);
const presentation = computed(() => migrationPresentation(props.analysis?.migrations));
const itemKey = item => JSON.stringify([item.algorithm,item.purpose,item.verification_status]);
const selected=ref(null),trigger=ref(null);
function inspect(item,element) { selected.value=item;trigger.value=element; }
watch([()=>props.analysis,()=>props.active],()=>{ selected.value=null; });
</script>
<template>
  <div class="migration-workspace">
  <PagedCollection :items="presentation.rows" :item-key="itemKey" label="迁移待办"
    :row-height="180" :touch-row-height="210">
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
        <div class="migration-identity"><strong>{{ item.algorithm }}</strong><span class="migration-count">{{ item.affected_files }} 个文件 · {{ item.finding_count }} 项</span><span class="tag">{{ statusLabel(item.verification_status) }}</span></div>
        <div class="migration-direction"><b>{{ item.purpose }}<span v-if="item.purpose_origin==='ai'"> · AI用途研判</span></b>
          <span v-if="item.targets.length" class="migration-targets">{{ item.targets.join(' / ') }}</span>
          <span v-else-if="item.migration_references?.length">{{ item.migration_references.map(r=>r.label).join('；') }}</span>
          <span v-else>确认用途与实现后选择迁移方向</span></div>
        <div class="migration-actions">
          <button class="button text-action" aria-haspopup="dialog" :aria-label="`查看 ${item.algorithm} 迁移方案`" @click="inspect(item,$event.currentTarget)">查看方案</button>
          <button class="button text-action" :aria-label="`查看 ${item.algorithm} 相关证据`"
            @click="$emit('select', { algorithm: item.algorithm, sourceId: '', target: '' })">
            相关证据 <AppIcon name="arrow" :size="16" />
          </button>
        </div>
      </article>
    </template>
  </PagedCollection>
  <MigrationInspector :item="selected" :shared="presentation.shared" :active="active" :trigger="trigger" @close="selected=null" @select="$emit('select',$event)" />
  </div>
</template>
<style scoped>
.migration-workspace { display:flex;flex-direction:column;min-height:0;min-width:0; }.migration-workspace > :first-child { flex:1;min-height:0; }
.migration-record { display: flex; flex-direction:column; justify-content:space-between;
  gap: 8px; padding: 12px; border: 1px solid var(--border-light);height:100%;
  border-radius: 8px; background: var(--bg-surface); }
.migration-identity { display:flex;justify-content:space-between;align-items:center;gap:8px; }.migration-direction { display:grid;gap:4px;min-width:0; }
.migration-count { margin-left:auto;font-size:13px; }.migration-identity .tag { flex:none; }.migration-direction>span { display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;line-height:20px; }
strong { font-size: 20px; overflow-wrap: anywhere; }
span { font-size: 14px; color: var(--text-secondary); }.migration-direction b { font-size:16px; }.migration-targets { color:var(--accent);font-weight:600; }
.migration-heading { display: grid; justify-items: start; gap: 4px; }
.migration-heading h3 { flex-shrink: 0; }
.migration-actions { display: flex; align-items: center; justify-content: space-between; gap: 6px; flex-wrap:wrap; }
.migration-actions>span { font-size:13px; }
.migration-actions > .button { flex-shrink: 0; font-size: 14px; }
</style>
