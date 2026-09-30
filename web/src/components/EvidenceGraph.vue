<script setup>
import { computed, ref, watch } from 'vue';
import { graphData } from '../utils/analysis.js';
const props = defineProps({ assets: Array });
defineEmits(['select']);
const query = ref('');
const page = ref(1);
const graph = computed(() => graphData(props.assets, query.value, page.value));
const height = computed(() =>
  Math.max(180, Math.max(graph.value.files.length, graph.value.algorithms.length) * 56 + 30),
);
const y = (index, length) => 15 + ((height.value - 30) * (index + 0.5)) / length;
const fileY = (id) =>
  y(
    graph.value.files.findIndex((file) => file.id === id),
    graph.value.files.length,
  );
const algorithmY = (name) => y(graph.value.algorithms.indexOf(name), graph.value.algorithms.length);
const targetY = (name) => y(graph.value.targets.indexOf(name), graph.value.targets.length);
const curve = (x1, y1, x2, y2) =>
  `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`;
const shortName = (name) => (name.length > 20 ? `${name.slice(0, 7)}…${name.slice(-12)}` : name);
watch(query, () => {
  page.value = 1;
});
</script>

<template>
  <section class="stack" aria-label="文件算法证据关系图">
    <div>
      <h3>从文件追踪到迁移方向</h3>
      <p class="small muted">实线是本次命中证据，虚线是静态迁移建议；此图不是完整供应链依赖图。</p>
    </div>
    <label
      >查找图中文件<input v-model="query" type="search" placeholder="文件路径或身份编号"
    /></label>
    <div
      v-if="graph.files.length"
      class="graph-scroll"
      tabindex="0"
      aria-label="关系图，可横向滚动"
    >
      <div class="graph-labels">
        <span>文件与命中数</span><span>传统算法</span><span>迁移方向 · 需复核</span>
      </div>
      <svg
        class="graph"
        :viewBox="`0 0 620 ${height}`"
        :style="{ height: `${height}px` }"
        aria-label="可交互的证据关系"
      >
        <g
          v-for="edge in graph.evidenceEdges"
          :key="`${edge.sourceId}:${edge.algorithm}`"
          class="edge"
          role="button"
          tabindex="0"
          :aria-label="`${edge.sourceId} 的 ${edge.algorithm}：${edge.count} 项证据`"
          @click="
            $emit('select', { sourceId: edge.sourceId, algorithm: edge.algorithm, target: '' })
          "
          @keydown.enter="
            $emit('select', { sourceId: edge.sourceId, algorithm: edge.algorithm, target: '' })
          "
          @keydown.space.prevent="
            $emit('select', { sourceId: edge.sourceId, algorithm: edge.algorithm, target: '' })
          "
        >
          <path
            class="hit-area"
            :d="curve(190, fileY(edge.sourceId), 252, algorithmY(edge.algorithm))"
          />
          <path :d="curve(190, fileY(edge.sourceId), 252, algorithmY(edge.algorithm))" />
        </g>
        <g
          v-for="edge in graph.recommendationEdges"
          :key="`${edge.algorithm}:${edge.target}`"
          class="edge recommendation"
          role="button"
          tabindex="0"
          :aria-label="`${edge.algorithm} 的 ${edge.target} 迁移参考`"
          @click="$emit('select', { algorithm: edge.algorithm, target: edge.target, sourceId: '' })"
          @keydown.enter="
            $emit('select', { algorithm: edge.algorithm, target: edge.target, sourceId: '' })
          "
          @keydown.space.prevent="
            $emit('select', { algorithm: edge.algorithm, target: edge.target, sourceId: '' })
          "
        >
          <path
            class="hit-area"
            :d="curve(362, algorithmY(edge.algorithm), 442, targetY(edge.target))"
          />
          <path :d="curve(362, algorithmY(edge.algorithm), 442, targetY(edge.target))" />
        </g>
        <g
          v-for="file in graph.files"
          :key="file.id"
          class="node file"
          role="button"
          tabindex="0"
          :aria-label="`${file.label}，${file.id}，${file.count} 项发现`"
          @click="$emit('select', { sourceId: file.id, algorithm: '', target: '' })"
          @keydown.enter="$emit('select', { sourceId: file.id, algorithm: '', target: '' })"
          @keydown.space.prevent="$emit('select', { sourceId: file.id, algorithm: '', target: '' })"
        >
          <title>{{ file.label }} · {{ file.id }}</title>
          <rect x="2" :y="fileY(file.id) - 22" width="188" height="44" rx="9" />
          <text x="12" :y="fileY(file.id) - 3">{{ shortName(file.label) }}</text>
          <text x="12" :y="fileY(file.id) + 13" class="sub">
            {{ file.id.slice(-6) }} · {{ file.count }} 项
          </text>
        </g>
        <g
          v-for="algorithm in graph.algorithms"
          :key="algorithm"
          class="node algorithm"
          role="button"
          tabindex="0"
          :aria-label="`筛选 ${algorithm}`"
          @click="$emit('select', { algorithm, sourceId: '', target: '' })"
          @keydown.enter="$emit('select', { algorithm, sourceId: '', target: '' })"
          @keydown.space.prevent="$emit('select', { algorithm, sourceId: '', target: '' })"
        >
          <rect x="252" :y="algorithmY(algorithm) - 20" width="110" height="40" rx="10" />
          <text x="307" :y="algorithmY(algorithm) + 4" text-anchor="middle">{{ algorithm }}</text>
        </g>
        <g
          v-for="target in graph.targets"
          :key="target"
          class="node target"
          role="button"
          tabindex="0"
          :aria-label="`查看 ${target} 对应证据`"
          @click="$emit('select', { target, algorithm: '', sourceId: '' })"
          @keydown.enter="$emit('select', { target, algorithm: '', sourceId: '' })"
          @keydown.space.prevent="$emit('select', { target, algorithm: '', sourceId: '' })"
        >
          <rect x="442" :y="targetY(target) - 20" width="176" height="40" rx="10" />
          <text x="530" :y="targetY(target) + 4" text-anchor="middle">{{ target }}</text>
        </g>
      </svg>
    </div>
    <p v-else class="notice">
      {{ assets.length ? '没有匹配的文件。' : '本次未发现可绘制的算法证据。' }}
    </p>
    <div class="toolbar graph-footer">
      <span class="small muted"
        >当前 {{ graph.files.length }} / {{ graph.totalFiles }} 个命中文件 · 搜索匹配
        {{ graph.matchedFiles }} 个</span
      >
      <template v-if="graph.pagination.pages > 1">
        <button class="button secondary" :disabled="graph.pagination.current === 1" @click="page--">
          上一页
        </button>
        <span class="small">{{ graph.pagination.current }} / {{ graph.pagination.pages }}</span>
        <button
          class="button secondary"
          :disabled="graph.pagination.current === graph.pagination.pages"
          @click="page++"
        >
          下一页
        </button>
      </template>
    </div>
  </section>
</template>

<style scoped>
.graph-scroll {
  overflow-x: auto;
  background: var(--bg-elevated);
  border-radius: var(--radius-lg);
  padding: 1rem 0.5rem;
}
.graph-labels {
  display: grid;
  grid-template-columns: 40% 31% 29%;
  min-width: 520px;
  font-size: 0.7rem;
  color: var(--text-secondary);
  padding-inline: 10px;
}
.graph {
  width: 100%;
  min-width: 520px;
  display: block;
}
.node {
  cursor: pointer;
}
.node rect {
  fill: var(--bg-surface);
}
.node text {
  fill: var(--text-primary);
  font: 12px var(--font-sans);
  pointer-events: none;
}
.node .sub {
  fill: var(--text-secondary);
  font-size: 10px;
}
.algorithm rect {
  fill: var(--accent-soft);
}
.algorithm text {
  fill: var(--accent-dim);
  font-weight: 600;
}
.target rect {
  fill: var(--bg-surface);
}
.node:hover rect,
.node:focus-visible rect {
  fill: var(--accent-glow);
}
.edge {
  cursor: pointer;
}
.edge path {
  stroke: var(--accent);
  stroke-width: 1.3;
  fill: none;
  opacity: 0.4;
}
.edge .hit-area {
  stroke: transparent;
  stroke-width: 16;
  opacity: 1;
}
.edge:hover path:not(.hit-area),
.edge:focus-visible path:not(.hit-area) {
  stroke-width: 3;
  opacity: 1;
}
.recommendation path:not(.hit-area) {
  stroke-dasharray: 5 5;
  stroke: var(--text-secondary);
}
.graph-footer {
  justify-content: space-between;
}
</style>
