<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { aiSettings, aiSettingsOpen, profileSelection } from '../composables/useAiSettings.js';
import AppIcon from './AppIcon.vue';
import RepositoryRecheckPicker from './RepositoryRecheckPicker.vue';
import RepositoryScanResult from './RepositoryScanResult.vue';
import ScanLoading from './ScanLoading.vue';
import SelectControl from './SelectControl.vue';

const props = defineProps({ state: Object, blocked: Boolean, repos: Array });
const emit = defineEmits(['scan', 'cancel', 'save']);
const dialog = ref(null);
const popupLayer = ref(null);
const trigger = ref(null);
const limit = ref(10);
const scope = ref('discover');
const assistPurpose = ref(false);
const selected = ref([]);
const showResult = ref(false);
const heading = ref(null);
const scopes = [
  { value: 'discover', label: 'AI 选择新仓库' },
  { value: 'recheck', label: '复查已入库仓库' },
];
const options = [5, 10, 20, 30].map(value => ({ value, label: `${value} 个` }));
options.push({ value: 'unlimited', label: '不设上限' });
const result = computed(() => props.state.result);
const recheck = computed(() => scope.value === 'recheck');
const requiresModel = computed(() => !recheck.value || assistPurpose.value);
const canScan = computed(() => !props.blocked && (!recheck.value || selected.value.length > 0) && (!requiresModel.value || aiSettings.ready));

function open(event) {
  trigger.value = event.currentTarget;
  showResult.value = Boolean(result.value);
  dialog.value.showModal();
}

function submit() {
  if (!canScan.value || props.state.busy) return;
  const body = {
    ...(recheck.value ? { repositories:selected.value } : { max_repositories:limit.value === 'unlimited' ? null : limit.value }),
    ai_assisted: assistPurpose.value,
    ...(requiresModel.value ? profileSelection() : {}),
  };
  emit('scan', { endpoint: 'library/' + scope.value, body });
}

watch(() => props.state.busy, async busy => {
  showResult.value = !busy && Boolean(result.value);
  await nextTick();
  if (!dialog.value?.open) return;
  const target = busy ? dialog.value.querySelector('.scan-loading') : heading.value;
  target?.focus({ preventScroll: true });
});
watch(() => props.repos, repos => {
  const known = new Set(repos.map(repo => repo.full_name));
  selected.value = selected.value.filter(name => known.has(name));
});
async function changeView(value) {
  showResult.value = value;
  await nextTick();
  heading.value?.focus({ preventScroll: true });
}
onBeforeUnmount(() => dialog.value?.close());
</script>

<template>
  <button class="button primary compact" aria-haspopup="dialog" @click="open">
    <AppIcon name="scan" :size="17" />{{ state.busy ? '查看扫描进度' : result ? '查看扫描结果' : '扫描仓库' }}
  </button>
  <Teleport to="body">
    <dialog ref="dialog" class="repository-scan-dialog" aria-labelledby="repository-scan-title"
      @close="trigger?.focus({ preventScroll: true })">
      <header>
        <h2 id="repository-scan-title" ref="heading" tabindex="-1">{{ state.busy ? '仓库扫描进度' : showResult ? '仓库扫描结果' : '扫描仓库' }}</h2>
        <button type="button" class="button secondary compact" autofocus @click="dialog.close()">
          <AppIcon name="close" :size="16" />{{ state.busy ? '在后台继续' : '关闭' }}
        </button>
      </header>
      <div ref="popupLayer" />
      <ScanLoading v-if="state.busy" mode="library" :state="state"
        :progress="state.progress || (recheck ? { library_recheck:true, purpose_review:assistPurpose } : undefined)" @cancel="$emit('cancel')" />
      <p v-if="state.error && !state.busy" class="notice error scan-error" role="alert">{{ state.error }}</p>
      <div v-if="!state.busy && showResult && result" class="scan-options">
        <RepositoryScanResult :result="result" :blocked="blocked" @save="$emit('save')" />
        <button type="button" class="button primary" @click="changeView(false)"><AppIcon name="scan" :size="17" />继续扫描</button>
      </div>
      <form v-else-if="!state.busy" class="scan-options" @submit.prevent="submit">
        <div class="scan-fields" :class="{ single: recheck }">
          <SelectControl v-model="scope" label="扫描范围" :options="scopes" :popup-target="popupLayer" />
          <SelectControl v-if="!recheck" v-model="limit" label="本轮最多扫描的仓库数" :options="options" :popup-target="popupLayer" />
        </div>
        <RepositoryRecheckPicker v-if="recheck" v-model="selected" :repos="repos" />
        <p v-if="recheck" class="small">复查会扫描所选仓库的默认分支并更新用途。达到批次预算时保留已完成的结果。</p>
        <p v-if="scope === 'discover'" class="small">选仓时向模型发送公开仓库名称和 Star 数。{{ limit === 'unlimited' ? '由 AI 在候选范围内决定数量。' : '' }}</p>
        <label class="purpose-option"><input v-model="assistPurpose" type="checkbox" />让 AI 复核规则未识别的用途</label>
        <p v-if="assistPurpose" class="small">将规则未识别的公开源码证据片段脱敏后发送给当前模型，结果标为 AI 推断。</p>
        <div v-if="requiresModel" class="model-row">
          <span>{{ aiSettings.ready ? aiSettings.profile_name || aiSettings.model : aiSettings.loading ? '正在读取模型配置' : '需要启用已授权的模型' }}</span>
          <button type="button" class="button text-action compact" @click="aiSettingsOpen = true">
            <AppIcon name="settings" :size="16" />{{ aiSettings.ready ? '模型设置' : '配置模型' }}
          </button>
        </div>
        <button class="button primary" :disabled="!canScan"><AppIcon name="scan" :size="17" />{{ recheck ? '开始复查' : '开始扫描' }}</button>
        <button v-if="result" type="button" class="button text-action compact" @click="changeView(true)">查看上次结果</button>
      </form>
    </dialog>
  </Teleport>
</template>

<style scoped>
.repository-scan-dialog { width:min(610px,calc(100% - 24px)); max-height:calc(100dvh - 24px); margin:auto; padding:16px;
  border:0; border-radius:var(--radius-lg); background:var(--bg-surface); color:var(--text-primary); overscroll-behavior:contain; }
.repository-scan-dialog::backdrop { background:rgb(8 18 28 / 42%); }
header,.model-row { display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap; }
header h2 { font-size:20px; }
.scan-options { display:grid; gap:12px; padding-top:12px; }
.scan-options p { margin:0; }
.scan-fields { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
.scan-fields.single { grid-template-columns:1fr; }
.purpose-option { display:flex; align-items:center; gap:8px; min-height:32px; cursor:pointer; }
.purpose-option input { width:16px; height:16px; min-height:0; accent-color:var(--accent); }
.model-row { background:var(--bg-elevated); border-radius:var(--radius); padding:8px 10px; }
.scan-error { margin:10px 0 0; overflow-wrap:anywhere; }
.repository-scan-dialog :deep(.scan-loading) { min-height:0; padding:12px 4px 0; }
@media(max-height:550px) { .repository-scan-dialog :deep(.loading-center) { gap:9px; padding-block:6px; } }
@media(max-width:440px) { .scan-fields { grid-template-columns:1fr; } }
</style>
