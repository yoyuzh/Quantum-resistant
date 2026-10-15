<script setup>
import { computed, ref, useId, watch } from 'vue';
import { graphData } from '../utils/analysis.js';
import { useGraphInspection } from '../composables/useGraphInspection.js';
const props = defineProps({ assets: Array });
const emit = defineEmits(['select']);
const query = ref('');
const page = ref(1);
const graph = computed(() => graphData(props.assets, query.value, page.value));
const tooltipId = useId();
const { inspection, tooltip, position, inspectPointer, inspectFocus, blurNode,
  retainPointer, hidePointer, clearInspection } = useGraphInspection(graph);
function select(value) {
  clearInspection();
  emit('select', value);
}
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
  <section class="stack" aria-label="文件算法证据关系图" @keydown.esc.stop="clearInspection">
    <div>
      <h3>从文件追踪到迁移方向</h3>
      <p class="small muted">实线：命中证据 · 虚线：迁移参考</p>
    </div>
    <label
      >查找图中文件<input v-model="query" type="search" placeholder="文件路径或身份编号"
    /></label>
    <div
      v-if="graph.files.length"
      class="graph-scroll"
      tabindex="0"
      aria-label="关系图，可横向滚动"
      @pointerleave="hidePointer"
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
          :class="{ highlighted: inspection?.evidence.includes(edge) }"
          aria-hidden="true"
          @pointerenter="inspectPointer({ kind: 'evidence', ...edge }, $event)"
          @pointerleave="hidePointer"
        >
          <path class="hit-area" :d="curve(190, fileY(edge.sourceId), 252, algorithmY(edge.algorithm))" />
          <path :d="curve(190, fileY(edge.sourceId), 252, algorithmY(edge.algorithm))" />
        </g>
        <g
          v-for="edge in graph.recommendationEdges"
          :key="`${edge.algorithm}:${edge.target}`"
          class="edge recommendation"
          :class="{ highlighted: inspection?.references.includes(edge) }"
          aria-hidden="true"
          @pointerenter="inspectPointer({ kind: 'recommendation', ...edge }, $event)"
          @pointerleave="hidePointer"
        >
          <path class="hit-area" :d="curve(362, algorithmY(edge.algorithm), 442, targetY(edge.target))" />
          <path :d="curve(362, algorithmY(edge.algorithm), 442, targetY(edge.target))" />
        </g>
        <g
          v-for="file in graph.files"
          :key="file.id"
          class="node file"
          :class="{ highlighted: inspection?.files.has(file.id) }"
          role="button"
          tabindex="0"
          :aria-label="`${file.label}，${file.id}，${file.count} 项发现`"
          :aria-describedby="inspection ? tooltipId : undefined"
          @pointerenter="inspectPointer({ kind: 'file', sourceId: file.id }, $event)"
          @pointerleave="hidePointer"
          @focus="inspectFocus({ kind: 'file', sourceId: file.id }, $event)"
          @blur="blurNode"
          @click="select({ sourceId: file.id, algorithm: '', target: '' })"
          @keydown.enter="select({ sourceId: file.id, algorithm: '', target: '' })"
          @keydown.space.prevent="select({ sourceId: file.id, algorithm: '', target: '' })"
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
          :class="{ highlighted: inspection?.algorithms.has(algorithm) }"
          role="button"
          tabindex="0"
          :aria-label="`筛选 ${algorithm}`"
          :aria-describedby="inspection ? tooltipId : undefined"
          @pointerenter="inspectPointer({ kind: 'algorithm', algorithm }, $event)"
          @pointerleave="hidePointer"
          @focus="inspectFocus({ kind: 'algorithm', algorithm }, $event)"
          @blur="blurNode"
          @click="select({ algorithm, sourceId: '', target: '' })"
          @keydown.enter="select({ algorithm, sourceId: '', target: '' })"
          @keydown.space.prevent="select({ algorithm, sourceId: '', target: '' })"
        >
          <rect x="252" :y="algorithmY(algorithm) - 20" width="110" height="40" rx="10" />
          <text x="307" :y="algorithmY(algorithm) + 4" text-anchor="middle">{{ algorithm }}</text>
        </g>
        <g
          v-for="target in graph.targets"
          :key="target"
          class="node target"
          :class="{ highlighted: inspection?.targets.has(target) }"
          role="button"
          tabindex="0"
          :aria-label="`查看 ${target} 对应证据`"
          :aria-describedby="inspection ? tooltipId : undefined"
          @pointerenter="inspectPointer({ kind: 'target', target }, $event)"
          @pointerleave="hidePointer"
          @focus="inspectFocus({ kind: 'target', target }, $event)"
          @blur="blurNode"
          @click="select({ target, algorithm: '', sourceId: '' })"
          @keydown.enter="select({ target, algorithm: '', sourceId: '' })"
          @keydown.space.prevent="select({ target, algorithm: '', sourceId: '' })"
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
      <span class="small muted">当前 {{ graph.files.length }} / {{ graph.totalFiles }} 个命中文件 · 搜索匹配
        {{ graph.matchedFiles }} 个</span>
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
    <Teleport to="body">
      <div v-if="inspection" :id="tooltipId" ref="tooltip" class="graph-inspection" role="tooltip"
        :style="position" @pointerenter="retainPointer" @pointerleave="hidePointer"
        @keydown.esc="clearInspection">
        <strong>{{ inspection.title }}</strong><span>{{ inspection.detail }}</span>
      </div>
    </Teleport>
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
  fill: var(--control-bg);
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
  fill: var(--control-selected);
}
.algorithm text {
  fill: var(--accent-dim);
  font-weight: 600;
}
.target rect {
  fill: var(--control-bg);
}
.node:hover rect,
.node:focus-visible rect,
.node.highlighted rect {
  fill: var(--control-hover);
}
.edge path {
  pointer-events: none;
  stroke: var(--accent);
  stroke-width: 1.3;
  fill: none;
  opacity: 0.4;
}
.edge .hit-area {
  pointer-events: stroke;
  stroke: transparent;
  stroke-width: 16;
  opacity: 1;
}
.edge.highlighted path:not(.hit-area) {
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
.graph-inspection {
  position: fixed;
  z-index: 110;
  max-width: min(420px, calc(100vw - 16px));
  max-height: min(240px, 50vh);
  overflow-y: auto;
  padding: 0.65rem 0.8rem;
  border-radius: var(--radius);
  background: var(--bg-surface);
  color: var(--text-primary);
  box-shadow: var(--shadow-lg);
  display: grid;
  gap: 0.15rem;
  font-size: 0.8125rem;
  overflow-wrap: anywhere;
}
.graph-inspection span { color: var(--text-secondary); }
</style>
