<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { request } from '../api/client.js';
import { useRemoteTask } from '../composables/useRemoteTask.js';
import { useTaskRunner } from '../composables/useTaskRunner.js';
import RepositoryAtlas from './RepositoryAtlas.vue';

const library = ref(null);
const input = ref('');
const refreshExisting = ref(false);
const fileInput = ref(null);
const transferring = ref(false);
const toolsOpen = ref(false);
const notice = ref('');
const state = reactive({ busy: false, result: null, error: '', taskId: '', progress: null });
const busy = computed(() => state.busy || transferring.value);
const remote = useRemoteTask('popular', state, 'repository-library');
const runner = useTaskRunner();

const batch = computed(() => {
  if (!library.value) return null;
  const live = state.result;
  const current = new Map((live?.repos || []).map(r => [r.full_name.toLowerCase(), r]));
  const repos = library.value.repos.map(repo => ({
    ...repo, repository_id: repo.scanned_at === live?.scanned_at ? current.get(repo.full_name.toLowerCase())?.repository_id : null,
  }));
  return { ...library.value, repos, task_id: live?.task_id,
    scanned_at: repos.reduce((latest,r) => !latest || Date.parse(r.scanned_at) > Date.parse(latest) ? r.scanned_at : latest, null),
    meta: { query: '内置公开仓库、追加扫描与导入记录，每仓保留最新一次结果' } };
});

async function load() {
  try { library.value = await request('/api/repository-library'); }
  catch (error) { state.error = error.message; }
}

async function scan(id = '') {
  if (busy.value) return;
  const names = input.value.trim().split(/[\s,，]+/).filter(Boolean);
  if (!id && (!names.length || names.length > 30)) {
    state.error = '每次请输入 1–30 个仓库'; return;
  }
  notice.value = '';
  state.result = null;
  const body = { repositories: names, refresh_existing: refreshExisting.value };
  await runner.run('append', state, signal => remote.execute(body, signal, id, 'library'), { minimum: 0 });
  const result = state.result;
  if (result) {
    const saved = result.meta.library_saved ? result.repos.length : 0;
    notice.value = '扫描结束，已保存 ' + saved + ' 个，跳过已有 ' + result.meta.skipped_existing + ' 个，失败 ' + result.failures.length + ' 个。';
    if (saved && !result.failures.length) input.value = '';
    await load();
  }
}
onMounted(async () => {
  await load();
  const id = remote.saved();
  if (id) await scan(id);
});

async function importFile(event) {
  const file = event.target.files[0];
  event.target.value = '';
  if (!file || busy.value) return;
  transferring.value = true;
  notice.value = ''; state.error = '';
  try {
    if (file.size > 16 * 1024 * 1024) throw new Error('JSON 文件超过 16 MiB');
    const incoming = JSON.parse(await file.text());
    library.value = await request('/api/repository-library/import', { method: 'POST', body: incoming });
    notice.value = '导入完成，资料库共 ' + library.value.repos.length + ' 个仓库。';
  } catch (error) {
    state.error = error instanceof SyntaxError ? '文件不是有效的 JSON 资料库' : error.message;
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
    <button class="button secondary compact management-toggle" aria-controls="library-controls" :aria-expanded="toolsOpen" @click="toolsOpen=!toolsOpen">管理资料库</button>
    <div id="library-controls" class="library-tools" :class="{expanded: toolsOpen}">
      <details><summary>添加仓库并扫描</summary>
        <form @submit.prevent="scan()">
          <label>GitHub 仓库（每次最多 30 个）<textarea v-model="input" rows="3" placeholder="owner/repo 或 GitHub 仓库地址，每行一个" required :disabled="busy" /></label>
          <label><input type="checkbox" v-model="refreshExisting" :disabled="busy" /> 重新扫描已有仓库</label>
          <button class="button primary compact" :disabled="busy || !input.trim()">开始追加扫描</button>
        </form>
      </details>
      <div class="actions">
        <input ref="fileInput" type="file" accept=".json,application/json" hidden @change="importFile" />
        <button class="button secondary compact" :disabled="busy || !library" @click="fileInput.click()">导入 JSON</button>
        <button class="button secondary compact" :disabled="!library" @click="exportFile">导出 JSON</button>
      </div>
    </div>
    <p v-if="state.error" class="notice error" role="alert">{{ state.error }} <button v-if="!library" class="button text-action compact" @click="load">重新读取</button></p>
    <p v-if="state.busy" role="status">正在追加扫描 · {{ state.progress?.stage || '准备中' }} · {{ state.elapsed }} 秒
      <button class="button text-action compact" @click="remote.cancel">取消</button></p>
    <p v-else-if="notice" role="status">{{ notice }}</p>
    <details v-if="state.result?.failures?.length"><summary>查看本次失败原因</summary>
      <p v-for="f in state.result.failures" :key="f.full_name">{{ f.full_name }} · {{ f.error }}</p></details>
    <RepositoryAtlas v-if="batch" :result="batch" inline />
    <p v-else-if="!state.error" role="status">正在读取本机资料库…</p>
  </section>
</template>
<style scoped>
.library { flex:1; width:100%; min-width:0; overflow:auto; height:100%; min-height:0; padding:12px; }
.management-toggle { display:none; }
.library-tools,.actions { display:flex; align-items:start; gap:10px; flex-wrap:wrap; }
.library-tools { justify-content:space-between; padding:8px 12px; background:var(--bg-elevated); }
summary { cursor:pointer; padding:6px; font-weight:600; }
form { display:grid; gap:8px; padding:8px; width:min(520px,78vw); }
textarea { display:block; width:100%; margin-top:6px; }
form button { justify-self:start; }
@media(max-width:600px) {
  .management-toggle { display:inline-flex; min-height:36px; }
  .library-tools:not(.expanded) { display:none; }
}
</style>
