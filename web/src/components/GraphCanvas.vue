<script setup>
const props = defineProps({ graph: Object, layout: Object, inspection: Object, tooltipId: String });
defineEmits(['select', 'inspect-pointer', 'inspect-focus', 'blur-node', 'hide-pointer']);
const fileNode = id => props.layout.files.get(id);
const algorithmNode = name => props.layout.algorithms.get(name);
const targetNode = name => props.layout.targets.get(name);
const fileY = id => fileNode(id).y;
const algorithmY = name => algorithmNode(name).y;
const targetY = name => targetNode(name).y;
const curve = (x1, y1, x2, y2) => `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`;
</script>
<template>
    <div
      class="graph-canvas"
      tabindex="0"
      aria-label="文件、算法与迁移方向的关系图"
      @pointerleave="$emit('hide-pointer')"
    >
      <div class="graph-labels">
        <span :style="{ left: `${layout.columns.file.x}px`, width: `${layout.columns.file.width}px` }">文件与命中数</span>
        <span :style="{ left: `${layout.columns.algorithm.x}px`, width: `${layout.columns.algorithm.width}px` }">传统算法</span>
        <span :style="{ left: `${layout.columns.target.x}px`, width: `${layout.columns.target.width}px` }">迁移方向 · 需复核</span>
      </div>
      <svg
        class="graph"
        :viewBox="`0 0 ${layout.width} ${layout.height}`"
        :style="{ height: `${layout.height}px` }"
        aria-label="可交互的证据关系"
      >
        <g
          v-for="edge in graph.evidenceEdges"
          :key="`${edge.sourceId}:${edge.algorithm}`"
          class="edge"
          :class="{ highlighted: inspection?.evidence.includes(edge) }"
          aria-hidden="true"
          @pointerenter="$emit('inspect-pointer', { kind: 'evidence', ...edge }, $event)"
          @pointerleave="$emit('hide-pointer')"
        >
          <path class="hit-area" :d="curve(fileNode(edge.sourceId).right, fileY(edge.sourceId), algorithmNode(edge.algorithm).x, algorithmY(edge.algorithm))" />
          <path :d="curve(fileNode(edge.sourceId).right, fileY(edge.sourceId), algorithmNode(edge.algorithm).x, algorithmY(edge.algorithm))" />
        </g>
        <g
          v-for="edge in graph.recommendationEdges"
          :key="`${edge.algorithm}:${edge.target}`"
          class="edge recommendation"
          :class="{ highlighted: inspection?.references.includes(edge) }"
          aria-hidden="true"
          @pointerenter="$emit('inspect-pointer', { kind: 'recommendation', ...edge }, $event)"
          @pointerleave="$emit('hide-pointer')"
        >
          <path class="hit-area" :d="curve(algorithmNode(edge.algorithm).right, algorithmY(edge.algorithm), targetNode(edge.target).x, targetY(edge.target))" />
          <path :d="curve(algorithmNode(edge.algorithm).right, algorithmY(edge.algorithm), targetNode(edge.target).x, targetY(edge.target))" />
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
          @pointerenter="$emit('inspect-pointer', { kind: 'file', sourceId: file.id }, $event)"
          @pointerleave="$emit('hide-pointer')"
          @focus="$emit('inspect-focus', { kind: 'file', sourceId: file.id }, $event)"
          @blur="$emit('blur-node')"
          @click="$emit('select', { sourceId: file.id, algorithm: '', target: '' })"
          @keydown.enter="$emit('select', { sourceId: file.id, algorithm: '', target: '' })"
          @keydown.space.prevent="$emit('select', { sourceId: file.id, algorithm: '', target: '' })"
        >
          <title>{{ file.label }} · {{ file.id }}</title>
          <rect :x="fileNode(file.id).x" :y="fileY(file.id) - 22" :width="fileNode(file.id).width" height="44" rx="9" />
          <text :x="fileNode(file.id).x + 12" :y="fileY(file.id) - 3">{{ fileNode(file.id).label }}</text>
          <text :x="fileNode(file.id).x + 12" :y="fileY(file.id) + 13" class="sub">
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
          @pointerenter="$emit('inspect-pointer', { kind: 'algorithm', algorithm }, $event)"
          @pointerleave="$emit('hide-pointer')"
          @focus="$emit('inspect-focus', { kind: 'algorithm', algorithm }, $event)"
          @blur="$emit('blur-node')"
          @click="$emit('select', { algorithm, sourceId: '', target: '' })"
          @keydown.enter="$emit('select', { algorithm, sourceId: '', target: '' })"
          @keydown.space.prevent="$emit('select', { algorithm, sourceId: '', target: '' })"
        >
          <rect :x="algorithmNode(algorithm).x" :y="algorithmY(algorithm) - 22" :width="algorithmNode(algorithm).width" height="44" rx="10" />
          <text :x="algorithmNode(algorithm).x + algorithmNode(algorithm).width / 2" :y="algorithmY(algorithm) + 4" text-anchor="middle">{{ algorithmNode(algorithm).label }}</text>
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
          @pointerenter="$emit('inspect-pointer', { kind: 'target', target }, $event)"
          @pointerleave="$emit('hide-pointer')"
          @focus="$emit('inspect-focus', { kind: 'target', target }, $event)"
          @blur="$emit('blur-node')"
          @click="$emit('select', { target, algorithm: '', sourceId: '' })"
          @keydown.enter="$emit('select', { target, algorithm: '', sourceId: '' })"
          @keydown.space.prevent="$emit('select', { target, algorithm: '', sourceId: '' })"
        >
          <rect :x="targetNode(target).x" :y="targetY(target) - 22" :width="targetNode(target).width" height="44" rx="10" />
          <text :x="targetNode(target).x + targetNode(target).width / 2" :y="targetY(target) + 4" text-anchor="middle">{{ targetNode(target).label }}</text>
        </g>
      </svg>
    </div>
</template>
<style scoped>
.graph-canvas {
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.graph-labels {
  position: relative;
  height: 26px;
  font-size: 0.7rem;
  color: var(--text-secondary);
  padding-inline: 10px;
}
.graph-labels span { position: absolute; top: 6px; text-align: center; font-size: 11px; }
.graph {
  width: 100%;
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
  font: 13px var(--font-sans);
  pointer-events: none;
}
.node .sub {
  fill: var(--text-secondary);
  font-size: 11px;
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
</style>
