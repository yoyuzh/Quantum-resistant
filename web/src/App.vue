<script setup>
import { computed, reactive, ref, watch } from 'vue';
import AppHeader from './components/AppHeader.vue';
import ModeTabs from './components/ModeTabs.vue';
import SnippetInput from './components/SnippetInput.vue';
import FileUpload from './components/FileUpload.vue';
import RemoteInput from './components/RemoteInput.vue';
import ScanStatus from './components/ScanStatus.vue';
import ScanResults from './components/ScanResults.vue';
import PopularView from './components/PopularView.vue';
import KnowledgePanel from './components/KnowledgePanel.vue';
import { useScan } from './composables/useScan.js';
import { usePopular } from './composables/usePopular.js';
import { useTheme } from './composables/useTheme.js';
import { DEFAULT_RSA_CODE } from './utils/defaults.js';

const mode = ref('snippet');
const drafts = reactive({
  snippet: { filename: 'snippet.py', content: DEFAULT_RSA_CODE },
  files: { files: [] },
  github: { value: 'https://github.com/pyca/cryptography' },
  pypi: { value: 'cryptography' },
});
const { states, start } = useScan();
const { state: popular, run: runPopular } = usePopular();
const { theme, toggle } = useTheme();
const current = computed(() => states[mode.value]);
const titles = {
  snippet: '扫描代码片段',
  files: '扫描本地文件',
  github: '扫描 GitHub 仓库',
  pypi: '扫描 PyPI 包',
};
watch(mode, (value) => {
  if (value === 'popular' && !popular.loaded) runPopular();
});
function submit() {
  start(mode.value, drafts[mode.value]);
}
</script>

<template>
  <AppHeader :theme="theme" @toggle-theme="toggle" />
  <main class="app-main">
    <ModeTabs v-model="mode" />
    <PopularView
      v-if="mode === 'popular'"
      :state="popular"
      @update:top="popular.top = $event"
      @refresh="runPopular(true)"
      @reload="runPopular(false)"
    />
    <div v-else class="workspace-grid">
      <section class="panel stack">
        <div>
          <p class="eyebrow">扫描工作区</p>
          <h2>{{ titles[mode] }}</h2>
        </div>
        <form class="stack" @submit.prevent="submit">
          <SnippetInput
            v-if="mode === 'snippet'"
            v-model:filename="drafts.snippet.filename"
            v-model:content="drafts.snippet.content"
            :disabled="current.busy"
          />
          <FileUpload
            v-else-if="mode === 'files'"
            v-model:files="drafts.files.files"
            :disabled="current.busy"
          />
          <RemoteInput
            v-else
            :key="mode"
            v-model="drafts[mode].value"
            :mode="mode"
            :disabled="current.busy"
          />
          <button type="submit" class="button primary" :disabled="current.busy">
            {{ current.busy ? '正在扫描…' : current.result ? '重新扫描' : '开始扫描' }}
          </button>
        </form>
        <ScanStatus
          :busy="current.busy"
          :error="current.error"
          :elapsed="current.elapsed"
          :has-result="!!current.result"
          @retry="submit"
        />
        <p class="muted small">
          只做静态分析，不执行输入代码。当前输入和扫描结果仅保存在本次页面会话中。
        </p>
      </section>
      <section class="panel results" aria-label="扫描结果区域">
        <ScanResults v-if="current.result" :key="mode" :result="current.result" />
        <div v-else class="stack">
          <div class="empty">
            <span class="empty-mark" aria-hidden="true">⌕</span>
            <h2>{{ current.busy ? '正在分析，请稍候' : '从一段代码开始' }}</h2>
            <p>
              {{
                current.busy
                  ? '完成后，这里会显示发现、位置及迁移建议。'
                  : '选择来源并开始扫描，查看密码算法的代码证据和迁移方向。'
              }}
            </p>
          </div>
          <KnowledgePanel />
        </div>
      </section>
    </div>
    <footer>抗量子迁移前置分析原型 · 扫描范围有限，结果需结合实际用途复核</footer>
  </main>
</template>
