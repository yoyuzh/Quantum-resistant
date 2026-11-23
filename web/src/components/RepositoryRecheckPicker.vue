<script setup>
import { computed, ref, watch } from 'vue';
import { coverageLabels, repositoryScanCoverage } from '../utils/repositoryScan.js';

const props = defineProps({ repos: Array, modelValue: Array });
const emit = defineEmits(['update:modelValue']);
const query = ref('');
const page = ref(1);
const pageSize = 7;
const entries = computed(() => {
  const keyword = query.value.trim().toLowerCase();
  return props.repos.filter(repo => repo.full_name.toLowerCase().includes(keyword));
});
const pages = computed(() => Math.max(1, Math.ceil(entries.value.length / pageSize)));
const visible = computed(() => entries.value.slice((page.value - 1) * pageSize, page.value * pageSize));
const selected = computed(() => new Set(props.modelValue));
const matchesSelected = computed(() => entries.value.filter(repo => selected.value.has(repo.full_name)).length);
const allSelected = computed(() => entries.value.length > 0 && matchesSelected.value === entries.value.length);
watch(query, () => { page.value = 1; });
watch(pages, total => { page.value = Math.min(page.value, total); });

function toggle(name, checked) {
  emit('update:modelValue', checked ? [...selected.value, name] : props.modelValue.filter(item => item !== name));
}
function toggleAll(checked) {
  const names = new Set(entries.value.map(repo => repo.full_name));
  const next = checked ? [...new Set([...selected.value, ...names])] : props.modelValue.filter(name => !names.has(name));
  emit('update:modelValue', next);
}
</script>

<template>
  <section class="repo-picker" aria-label="选择复查仓库">
    <label>搜索已入库仓库<input v-model="query" type="search" placeholder="输入仓库名" /></label>
    <div class="picker-summary">
      <label class="select-all"><input type="checkbox" :disabled="!entries.length" :checked="allSelected"
        :indeterminate.prop="matchesSelected > 0 && !allSelected" @change="toggleAll($event.target.checked)" />全部</label>
      <span class="small" role="status">已选 {{ selected.size }} 个</span>
      <button v-if="selected.size" type="button" class="button text-action compact" @click="emit('update:modelValue', [])">清空选择</button>
    </div>
    <div v-if="visible.length" class="choices" role="group" aria-label="已入库仓库">
      <label v-for="repo in visible" :key="repo.full_name" class="choice" :class="{selected:selected.has(repo.full_name)}">
        <input type="checkbox" :checked="selected.has(repo.full_name)"
          @change="toggle(repo.full_name, $event.target.checked)" />
        <span>{{ repo.full_name }}</span><small>{{ coverageLabels[repositoryScanCoverage(repo)] }}</small>
      </label>
    </div>
    <p v-else class="small muted">{{ repos.length ? '没有匹配的仓库。' : '资料库暂无可复查的仓库。' }}</p>
    <div v-if="pages > 1" class="picker-summary">
      <button type="button" class="button secondary compact" :disabled="page === 1" @click="page--">上一页</button>
      <span class="small">第 {{ page }} / {{ pages }} 页</span>
      <button type="button" class="button secondary compact" :disabled="page === pages" @click="page++">下一页</button>
    </div>
  </section>
</template>

<style scoped>
.repo-picker { display:grid; gap:6px; }
.picker-summary { display:flex; align-items:center; justify-content:space-between; gap:8px; min-height:30px; }
.select-all { display:flex; flex-direction:row; align-items:center; gap:8px; cursor:pointer; }
.choices { display:grid; gap:3px; }
.choice { display:grid; grid-template-columns:auto minmax(0,1fr) auto; align-items:center; gap:8px; padding:6px 8px;
  border-radius:var(--radius); background:var(--bg-elevated); color:var(--text-primary); cursor:pointer; }
.choice.selected { background:var(--control-selected); }
.choice input,.select-all input { width:16px; height:16px; min-height:0; margin:0; accent-color:var(--accent); }
.choice span { overflow-wrap:anywhere; }
.choice small { color:var(--text-secondary); }
</style>
