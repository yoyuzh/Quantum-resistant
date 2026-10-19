<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { version as appVersion } from '../../desktop/package.json';
import AppHeader from './components/AppHeader.vue';
import ModeTabs from './components/ModeTabs.vue';
import SnippetInput from './components/SnippetInput.vue';
import FileUpload from './components/FileUpload.vue';
import RemoteInput from './components/RemoteInput.vue';
import ScanStatus from './components/ScanStatus.vue';
import TaskProgress from './components/TaskProgress.vue';
import ScanHelp from './components/ScanHelp.vue';
import ResultsWorkspace from './components/ResultsWorkspace.vue';
import AppIcon from './components/AppIcon.vue';
import PopularView from './components/PopularView.vue';
import { useScan } from './composables/useScan.js';
import { usePopular } from './composables/usePopular.js';
import { useTheme } from './composables/useTheme.js';
import { DEFAULT_RSA_CODE } from './utils/defaults.js';
import { focusDestination } from './utils/navigation.js';

const nativeOverlay = ['win32', 'linux'].includes(window.quantumDesktop?.platform);
const mode = ref('snippet');
const analysisMode = ref('basic');
const deepView = ref(false);
watch(mode, () => { deepView.value = false; });
const drafts = reactive({
  snippet: { filename: 'snippet.py', content: DEFAULT_RSA_CODE },
  files: { files: [] },
  github: { value: 'https://github.com/pyca/cryptography' },
  pypi: { value: 'cryptography' },
});
const { states, start, cancel } = useScan();
const { state: popular, run: runPopular, cancel: cancelPopular } = usePopular();
const { theme, toggle } = useTheme();
const current = computed(() => states[mode.value]);
const inputBody = ref(null);
watch(
  () => current.value?.error,
  (error) => {
    if (error)
      inputBody.value?.querySelector('[role="alert"]')?.scrollIntoView({ block: 'nearest' });
  },
  { flush: 'post' },
);
const titles = {
  snippet: '扫描代码片段',
  files: '扫描本地文件',
  github: '扫描 GitHub 仓库',
  pypi: '扫描 PyPI 包',
};
watch(mode, (value) => {
  if (value === 'popular' && !popular.loaded) runPopular();
});
async function editSource() {
  deepView.value = false;
  await nextTick();
  inputBody.value?.focus();
}
function submit() {
  deepView.value = false;
  start(mode.value, drafts[mode.value], analysisMode.value);
}
async function prepareRepository(value) {
  mode.value = 'github';
  drafts.github.value = value;
  await nextTick();
  focusDestination(inputBody.value?.closest('.input-panel')?.querySelector('h2'),
    inputBody.value, undefined, { focus: false });
  inputBody.value?.querySelector('input')?.focus({ preventScroll: true });
}
</script>

<template>
  <AppHeader :theme="theme" @toggle-theme="toggle"><ModeTabs v-if="!nativeOverlay" v-model="mode" :show-source-edit="deepView" @edit-source="editSource" /></AppHeader>
  <main class="app-main" :class="{ 'native-overlay-main': nativeOverlay }">
    <ModeTabs v-if="nativeOverlay" v-model="mode" :show-source-edit="deepView" @edit-source="editSource" />
    <PopularView
      v-if="mode === 'popular'"
      :state="popular"
      @update:top="popular.top = $event"
      @refresh="runPopular(true)"
      @reload="runPopular(false)"
      @cancel="cancelPopular"
      @scan-repository="prepareRepository"
    />
    <div v-else class="workspace-grid" :class="{ 'deep-wide': deepView }">
      <section class="panel input-panel" :inert="deepView" :aria-hidden="deepView" aria-label="扫描输入区域">
        <div class="panel-heading">
          <h2>{{ titles[mode] }}</h2>
        </div>
        <form class="input-form" @submit.prevent="submit">
          <div
            :key="mode"
            ref="inputBody"
            class="panel-body stack input-body"
            role="region"
            tabindex="0"
            aria-label="扫描输入内容"
          >
            <p v-if="current.restored" class="notice">
              {{ current.busy ? '已恢复后台任务，输入草稿未保存。' : '已恢复结果，请确认输入后再扫描。' }}
            </p>
            <SnippetInput
              v-if="mode === 'snippet' && !(current.restored && current.busy)"
              v-model:filename="drafts.snippet.filename"
              v-model:content="drafts.snippet.content"
              :disabled="current.busy"
            />
            <FileUpload
              v-else-if="mode === 'files' && !(current.restored && current.busy)"
              v-model:files="drafts.files.files"
              :disabled="current.busy"
            />
            <RemoteInput
              v-else-if="(mode === 'github' || mode === 'pypi') && !(current.restored && current.busy)"
              :key="mode"
              v-model="drafts[mode].value"
              :mode="mode"
              :disabled="current.busy"
            />
            <ScanStatus
              :busy="current.busy"
              :error="current.error"
              :elapsed="current.progress?.elapsed ?? current.elapsed"
              :has-result="!!current.result"
              @retry="submit"
            />
            <TaskProgress :state="current" @cancel="cancel(mode)" />
            <ScanHelp :mode="mode" />
          </div>
          <div class="panel-actions stack">
            <label>扫描模式<select v-model="analysisMode" aria-label="扫描模式" :disabled="current.busy"><option value="basic">基础扫描</option><option value="deep">基础扫描 + Python 深度分析</option></select></label>
            <p class="small muted">深度分析无需模型；片段只分析局部，目录保留相对路径，GitHub / PyPI 仅覆盖已采集文件。</p>
            <button type="submit" class="button primary" :disabled="current.busy">
              <AppIcon name="scan" :size="18" />
              {{ current.busy ? '正在扫描…' : current.result ? '重新扫描' : '开始扫描' }}
            </button>
          </div>
        </form>
      </section>
      <ResultsWorkspace :key="mode" :state="current" :mode="mode" @deep-view="deepView = $event" />
    </div>
    <footer>抗量子密码风险检测与迁移辅助软件 V{{ appVersion }}</footer>
  </main>
</template>
