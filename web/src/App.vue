<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue';
import AiControls from './components/AiControls.vue';
import AiSettings from './components/AiSettings.vue';
import CenteredNotice from './components/CenteredNotice.vue';
import AiSetupPrompt from './components/AiSetupPrompt.vue';
import AppHeader from './components/AppHeader.vue';
import ModeTabs from './components/ModeTabs.vue';
import SnippetInput from './components/SnippetInput.vue';
import FileUpload from './components/FileUpload.vue';
import RemoteInput from './components/RemoteInput.vue';
import ScanStatus from './components/ScanStatus.vue';
import ScanActivity from './components/ScanActivity.vue';
import ScanHelp from './components/ScanHelp.vue';
import ResultsWorkspace from './components/ResultsWorkspace.vue';
import AppIcon from './components/AppIcon.vue';
import PopularView from './components/PopularView.vue';
import { useScan } from './composables/useScan.js';
import { usePopular } from './composables/usePopular.js';
import { useTheme } from './composables/useTheme.js';
import { useInputLayout } from './composables/useInputLayout.js';
import { DEFAULT_RSA_CODE } from './utils/defaults.js';
import { focusDestination } from './utils/navigation.js';

function initialMode() {
  try {
    const saved = sessionStorage.getItem('quantum-active-source');
    return ['snippet', 'files', 'github', 'pypi'].includes(saved) ? saved : 'snippet';
  } catch { return 'snippet'; }
}
const mode = ref(initialMode());
const drafts = reactive({
  snippet: { filename: 'snippet.py', content: DEFAULT_RSA_CODE },
  files: { files: [] },
  github: { value: 'https://github.com/pyca/cryptography' },
  pypi: { value: 'cryptography' },
});
const { states, start, cancel } = useScan();
const { state: popular, run: runPopular, cancel: cancelPopular } = usePopular();
const { theme, toggle } = useTheme();
const inputs = useInputLayout(states);
const current = computed(() => states[mode.value]);
const inputLayout = computed(() => inputs[mode.value]);
const inputBody = ref(null);
const resultsWorkspace = ref(null);
watch(() => inputLayout.value?.collapsed, async collapsed => {
  if (collapsed && inputBody.value?.closest('.input-panel')?.contains(document.activeElement)) {
    await nextTick();
    resultsWorkspace.value?.$el.querySelector('[data-edit-input]')?.focus({ preventScroll: true });
  }
});
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
  try { if (value !== 'popular') sessionStorage.setItem('quantum-active-source', value); } catch { /* Optional preference. */ }
  if (value === 'popular' && !popular.loaded) runPopular();
});
function submit() {
  if (current.value.restored && inputLayout.value.collapsed) {
    editInput();
    return;
  }
  current.value.restored = false;
  start(mode.value, drafts[mode.value]);
  if (current.value.error) inputLayout.value.collapsed = false;
}
async function editInput() {
  inputLayout.value.collapsed = false;
  current.value.restored = false;
  await nextTick();
  inputBody.value?.querySelector('input, textarea')?.focus({ preventScroll: true });
}
function toggleInput() {
  if (inputLayout.value.collapsed) editInput();
  else inputLayout.value.collapsed = true;
}
async function prepareRepository(value) {
  mode.value = 'github';
  drafts.github.value = value;
  inputs.github.collapsed = false;
  await nextTick();
  focusDestination(inputBody.value?.closest('.input-panel')?.querySelector('h2'),
    inputBody.value, undefined, { focus: false });
  inputBody.value?.querySelector('input')?.focus({ preventScroll: true });
}
</script>

<template>
  <AppHeader :theme="theme" @toggle-theme="toggle"><ModeTabs v-model="mode" /></AppHeader>
  <main class="app-main" :class="{ 'results-expanded': mode !== 'popular' && inputLayout.collapsed }">
    <PopularView
      v-if="mode === 'popular'"
      :state="popular"
      @update:top="popular.top = $event"
      @refresh="runPopular(true)"
      @reload="runPopular(false)"
      @cancel="cancelPopular"
      @scan-repository="prepareRepository"
    />
    <div v-else class="scan-workspace">
      <div class="workspace-grid" :class="{ 'input-collapsed': inputLayout.collapsed }">
        <section id="scan-input" v-show="!inputLayout.collapsed" class="panel input-panel" aria-label="扫描输入区域">
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
                :busy="false"
                :error="current.error"
                :elapsed="current.progress?.elapsed ?? current.elapsed"
                :has-result="!!current.result"
                @retry="submit"
              />
              <p v-if="!current.busy && current.taskNote && !current.result" class="notice">{{ current.taskNote }}</p>
              <ScanHelp :mode="mode" />
            </div>
            <div class="panel-actions stack">
              <AiControls :disabled="current.busy" />
              <button type="submit" class="button primary" :disabled="current.busy">
                <AppIcon name="scan" :size="18" />
                {{ current.busy ? '正在扫描…' : current.result ? '重新扫描' : '开始扫描' }}
              </button>
            </div>
          </form>
        </section>
        <ResultsWorkspace :key="mode" ref="resultsWorkspace" :state="current" :mode="mode"
          :input="inputLayout" @toggle-input="toggleInput" @rescan="submit" @cancel="current.aiBusy ? current.stopAi() : cancel(mode)" />
      </div>
    </div>
  </main>
  <AiSettings /><AiSetupPrompt /><CenteredNotice />
</template>
