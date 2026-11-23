<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { request } from '../api/client.js';
import { useRemoteTask } from '../composables/useRemoteTask.js';
import { useTaskRunner } from '../composables/useTaskRunner.js';
import { libraryScanSummary } from '../utils/repositoryScan.js';
import RepositoryAtlas from './RepositoryAtlas.vue';
import RepositoryScanDialog from './RepositoryScanDialog.vue';
import AppIcon from './AppIcon.vue';

const library = ref(null);
const liveBatch = ref(null);
const fileInput = ref(null);
const transferring = ref(false);
const notice = ref('');
const libraryError = ref('');
const state = reactive({ busy: false, result: null, error: '', taskId: '', progress: null });
const busy = computed(() => state.busy || transferring.value);
const remote = useRemoteTask('popular', state, 'repository-library');
const runner = useTaskRunner();
const scanNotice = computed(() => state.result ? libraryScanSummary(state.result) : '');
const repos = computed(() => library.value?.repos || []);

const batch = computed(() => {
  if (!library.value) return null;
  const live = liveBatch.value;
  const current = new Map((live?.repos || []).map(r => [r.full_name.toLowerCase(), r]));
  const repos = library.value.repos.map(repo => ({
    ...repo, repository_id: repo.scanned_at === live?.scanned_at ? current.get(repo.full_name.toLowerCase())?.repository_id : null,
  }));
  return { ...library.value, repos, task_id: live?.task_id,
    scanned_at: repos.reduce((latest,r) => !latest || Date.parse(r.scanned_at) > Date.parse(latest) ? r.scanned_at : latest, null),
    meta: { query: '内置公开仓库、追加扫描与导入记录，每仓保留最新一次结果' } };
});

async function load() {
  try {
    library.value = await request('/api/repository-library');
    libraryError.value = '';
  } catch (error) { libraryError.value = error.message; }
}

async function scan({ body, endpoint = 'library/discover' }, id = '') {
  if (busy.value) return;
  notice.value = '';
  state.result = null;
  await runner.run('discover', state, signal => remote.execute(body, signal, id, endpoint));
  const result = state.result;
  if (result?.meta?.library_saved) {
    liveBatch.value = result;
    await load();
  }
}
onMounted(async () => {
  await load();
  const id = remote.saved();
  if (id) await scan({ body: null }, id);
});

async function saveScannedBatch() {
  if (busy.value || !state.result?.task_id) return;
  transferring.value = true;
  state.error = '';
  try {
    const { library_saved_repositories, library_retained_repositories } = await request(
      '/api/repository-library/batches/' + encodeURIComponent(state.result.task_id), { method: 'POST' });
    Object.assign(state.result.meta, { library_saved: true, save_error: '', library_saved_repositories, library_retained_repositories });
    liveBatch.value = state.result;
    await load();
  } catch (error) { state.error = error.message; }
  finally { transferring.value = false; }
}

async function importFile(event) {
  const file = event.target.files[0];
  event.target.value = '';
  if (!file || busy.value) return;
  transferring.value = true;
  notice.value = ''; libraryError.value = '';
  try {
    if (file.size > 16 * 1024 * 1024) throw new Error('JSON 文件超过 16 MiB');
    const incoming = JSON.parse(await file.text());
    library.value = await request('/api/repository-library/import', { method: 'POST', body: incoming });
    notice.value = '导入完成，资料库共 ' + library.value.repos.length + ' 个仓库。';
  } catch (error) {
    libraryError.value = error instanceof SyntaxError ? '文件不是有效的 JSON 资料库' : error.message;
  } finally { transferring.value = false; }
}

function exportFile() {
  const blob = new Blob([JSON.stringify(library.value, null, 2)], { type: 'application/json;charset=utf-8' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url; link.download = '仓库扫描资料库.json'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>
<template>
  <section class="library panel" aria-label="仓库扫描资料库">
    <div class="library-tools">
      <h2>仓库全景</h2>
      <div class="actions">
        <input ref="fileInput" type="file" accept=".json,application/json" hidden @change="importFile" />
        <button class="button secondary compact" :disabled="busy || !library" @click="fileInput.click()"><AppIcon name="upload" :size="16" />导入 JSON</button>
        <button class="button secondary compact" :disabled="!library" @click="exportFile"><AppIcon name="download" :size="16" />导出 JSON</button>
        <RepositoryScanDialog :state="state" :blocked="transferring" :repos="repos"
          @scan="scan" @cancel="remote.cancel" @save="saveScannedBatch" />
      </div>
    </div>
    <p v-if="libraryError" class="notice error" role="alert">{{ libraryError }} <button class="button text-action compact" @click="load">重新读取</button></p>
    <p v-else-if="notice || scanNotice" class="small" role="status">{{ notice || scanNotice }}</p>
    <p v-if="state.error && !state.busy" class="small scan-error" role="status">扫描未完成，可打开扫描窗口查看原因。</p>
    <RepositoryAtlas v-if="batch" :result="batch" />
    <p v-else-if="!libraryError" role="status">正在读取本机资料库…</p>
  </section>
</template>
<style scoped>
.library { flex:1; display:flex; flex-direction:column; gap:8px; min-width:0; min-height:0; overflow:auto;
  overscroll-behavior:contain; padding:12px 16px; }
.library-tools,.actions { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.library-tools { justify-content:space-between; }
.library-tools h2 { font-size:20px; }
.library > p { margin:0; }
.scan-error { color:var(--text-secondary); }
@media(max-width:600px) { .library { padding:10px; } .library-tools h2 { font-size:18px; } }
</style>
