<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';
import { arrangeOverview, overviewFocus, overviewLane, overviewPath, overviewRadius,
  OVERVIEW_FONT_SIZE, OVERVIEW_LINE_HEIGHT } from '../utils/repositoryOverview.js';
import { clamp } from '../utils/workbenchScene.js';

const props = defineProps({ graph:Object, neighborhood:Object, selectedEdge:String, floating:Boolean });
const emit = defineEmits(['node', 'link', 'reveal']);
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const reduced = ref(preference.matches);
const hover = ref('');
const poses = shallowRef(props.graph.home);
const active = computed(() => props.selectedEdge
  ? overviewFocus(props.graph, props.neighborhood.expanded, props.neighborhood.focus, props.selectedEdge)
  : props.neighborhood);
const targets = computed(() => props.neighborhood.id
  ? arrangeOverview(props.graph, props.neighborhood.id, props.neighborhood.nodes) : props.graph.home);
const positions = computed(() => props.graph.nodes.map(node => ({ node, ...position(node.id) })));
const paths = computed(() => new Map([...props.graph.links, ...props.graph.branches]
  .map(link => [link.id, overviewPath(link, poses.value)])));
const selectedLink = computed(() => props.graph.links.find(link => link.id === props.selectedEdge));
const flowing = computed(() => {
  const highlighted = active.value;
  const candidates = highlighted.id ? props.graph.links.filter(link => highlighted.edges.has(link.id)) : [...props.graph.links];
  const limit = highlighted.id ? 7 : 3;
  return new Set(candidates.sort((a, b) => b.width - a.width).slice(0, limit).map(link => link.id));
});
const ports = computed(() => {
  const link = selectedLink.value;
  if (!link) return [];
  const source = position(link.source), target = position(link.target);
  return [{ x:source.x + link.from, y:source.y + link.start }, { x:target.x - link.to, y:target.y + link.end }];
});
let overrides = new Map(), start = props.graph.home, started = null, frame = 0, dragging = '';

function position(id) {
  return poses.value.get(id) || targets.value.get(id);
}
function schedule() {
  if (!frame && !document.hidden) frame = requestAnimationFrame(draw);
}
function draw(now) {
  frame = 0;
  started ??= now;
  const progress = reduced.value ? 1 : Math.min(1, (now - started) / 420);
  const t = progress * progress * (3 - 2 * progress);
  const floating = props.floating && !reduced.value && progress === 1;
  poses.value = new Map(props.graph.nodes.map((node, index) => {
    const fixed = overrides.get(node.id), target = fixed || targets.value.get(node.id);
    const origin = start.get(node.id) || target;
    const current = position(node.id);
    if (fixed) return [node.id, fixed];
    if (floating && hover.value === node.id) return [node.id, current];
    const drift = floating && node.id !== props.neighborhood.selected;
    const x = origin.x + (target.x - origin.x) * t + (drift ? 2.4 * Math.sin(now / 1420 + index * 2.3) : 0);
    const y = origin.y + (target.y - origin.y) * t + (drift ? 3.2 * Math.cos(now / 1640 + index * 1.7) : 0);
    return [node.id, {x,y}];
  }));
  if (progress < 1 || floating) schedule();
}
function relayout(previousPoses = poses.value) {
  overrides = new Map();
  dragging = '';
  started = null;
  const entering = props.graph.nodes.map(node => {
    const target = targets.value.get(node.id);
    const previous = previousPoses.get(node.id), parent = previousPoses.get(node.category);
    return [node.id, reduced.value ? target : previous || (parent ? { x:target.x, y:parent.y } : target)];
  });
  start = new Map(entering);
  poses.value = start;
  schedule();
}
watch(targets, () => relayout());
watch([() => props.floating, reduced], () => {
  started = null;
  start = poses.value;
  schedule();
});
function motionPreference() { reduced.value = preference.matches; }
function visibility() {
  if (document.hidden) {
    cancelAnimationFrame(frame);
    frame = 0;
  } else schedule();
}
onMounted(() => {
  preference.addEventListener('change', motionPreference);
  document.addEventListener('visibilitychange', visibility);
  relayout();
});
onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  preference.removeEventListener('change', motionPreference);
  document.removeEventListener('visibilitychange', visibility);
});

function moveNode(id, x, y, settle = false) {
  const graph = props.graph, node = graph.nodes.find(item => item.id === id);
  if (!node) return;
  const [left, right] = overviewLane(graph, node);
  x = clamp(x, left, right);
  const top = node.height / 2 + 6, bottom = graph.height - top;
  y = clamp(y, top, bottom);
  dragging = settle ? '' : id;
  if (settle) {
    const blockers = graph.nodes.filter(other => other.side === node.side && other.id !== id)
      .map(other => ({ ...position(other.id), dx:(other.width + node.width) / 2 + 9, dy:(other.height + node.height) / 2 + 9 }))
      .filter(other => Math.abs(other.x - x) < other.dx);
    const valid = [y, ...blockers.flatMap(other => [other.y - other.dy, other.y + other.dy])]
      .filter(value => value >= top && value <= bottom && blockers.every(other => Math.abs(other.y - value) >= other.dy - .01));
    if (!valid.length) {
      overrides.delete(id);
      const next = new Map(poses.value);
      next.set(id, targets.value.get(id));
      poses.value = next;
      return;
    }
    y = valid.reduce((best, value) => Math.abs(value - y) < Math.abs(best - y) ? value : best);
  }
  const point = {x,y};
  overrides.set(id, point);
  const next = new Map(poses.value);
  next.set(id, point);
  poses.value = next;
}
function settleNode() {
  if (!dragging) return;
  const { x, y } = position(dragging);
  moveNode(dragging, x, y, true);
}
defineExpose({ position, moveNode, settleNode, reset: () => relayout() });
</script>

<template>
  <g v-for="link in graph.links" :key="link.id" class="overview-edge" tabindex="-1" role="button"
    :data-overview-edge="link.id" :aria-label="link.title"
    :opacity="active.edges.has(link.id) ? 1 : active.id || selectedEdge ? .15 : .68"
    @click="emit('link', link, $event.currentTarget)" @keydown.enter.prevent="emit('link', link, $event.currentTarget)">
    <title>{{ link.title }}</title>
    <path :d="paths.get(link.id)" fill="none" :stroke="link.color" pointer-events="none" stroke-linecap="round"
      :stroke-width="selectedEdge === link.id ? link.width + 1 : active.edges.has(link.id) ? link.width * 1.08 : link.width" />
    <path v-if="flowing.has(link.id)" class="overview-flow" :d="paths.get(link.id)" fill="none" pointer-events="none"
      :stroke="`color-mix(in srgb, ${link.color} 25%, #f7fbff)`" :stroke-width="Math.min(2, link.width * .48)" />
    <path :d="paths.get(link.id)" fill="none" stroke="transparent" pointer-events="stroke" stroke-linecap="round"
      :stroke-width="Math.max(10, link.width + 2)" />
  </g>
  <path v-for="branch in graph.branches" :key="branch.target" class="overview-membership" :d="paths.get(branch.id)"
    pathLength="1" stroke-dasharray="1" fill="none" stroke="var(--accent)" stroke-width="1.45" stroke-linecap="round"
    :stroke-opacity="active.nodes.has(branch.target) ? .68 : .16" pointer-events="none" />
  <g v-for="{ node, x, y } in positions" :key="node.id" class="overview-vertex" :class="{ member:node.category }"
    :data-overview-node="node.id" :transform="`translate(${x} ${y})`" role="button" tabindex="0"
    :aria-label="node.label + '，' + node.summary" :aria-expanded="node.expanded"
    :aria-pressed="node.side === 'category' ? undefined : neighborhood.selected === node.id"
    @pointerenter="hover=node.id" @pointerleave="hover=''" @focus="emit('reveal', $event, node, {x,y})"
    @click="emit('node', node, $event.currentTarget)"
    @keydown.enter.stop.prevent="emit('node', node, $event.currentTarget)" @keydown.space.stop.prevent="emit('node', node, $event.currentTarget)">
    <title>{{ node.label }}，{{ node.summary }}</title>
    <rect class="overview-card" :x="-node.width / 2" :y="-node.height / 2" :width="node.width" :height="node.height"
      :rx="overviewRadius(node)" :fill="neighborhood.selected === node.id || node.expanded ? 'var(--control-selected)' : 'var(--bg-surface)'"
      :stroke="node.color" stroke-width="1.35" />
    <g text-anchor="middle" pointer-events="none">
      <rect :x="-node.width / 2" :y="-node.height / 2" :width="node.width" :height="node.height" :rx="overviewRadius(node)"
        :fill="node.color" :opacity="node.side === 'repo' ? .055 : .12" />
      <text dominant-baseline="central" :font-size="OVERVIEW_FONT_SIZE" font-weight="600">
        <tspan v-for="(line, index) in node.labelLines" :key="index" x="0"
          :y="-node.height / 2 + 15 + index * OVERVIEW_LINE_HEIGHT">{{ line }}</tspan>
      </text>
      <text :x="node.side === 'category' ? -5 : 0" :y="node.height / 2 - 13" dominant-baseline="central"
        font-size="12.5" fill="var(--text-secondary)">{{ node.summary }}</text>
      <path v-if="node.side === 'category'" :transform="`translate(${node.width / 2 - 9} ${node.height / 2 - 14})`"
        :d="node.expanded ? 'M-3 0H3' : 'M-3 0H3 M0 -3V3'" fill="none" stroke="var(--accent)" stroke-width="1.7" stroke-linecap="round" />
    </g>
  </g>
  <circle v-for="(point, index) in ports" :key="index" :cx="point.x" :cy="point.y" r="3.8"
    :fill="selectedLink.color" stroke="var(--bg-surface)" stroke-width="1.1" pointer-events="none" />
</template>

<style scoped>
.overview-vertex,.overview-edge { cursor:pointer; }
.overview-edge { transition:opacity 180ms ease; }
.overview-flow { stroke-linecap:round; stroke-dasharray:4 29; opacity:.76; animation:overview-flow 1.45s linear infinite; }
@keyframes overview-flow { to { stroke-dashoffset:-33; } }
.overview-vertex:hover text:first-of-type { fill:var(--accent-dim); }
:global(:root[data-keyboard] .overview-vertex:focus-visible text:first-of-type) { fill:var(--accent-dim); text-decoration:underline; }
.overview-vertex.member { animation:reveal-repository 220ms ease-out both; }
.overview-membership { animation:draw-branch 440ms ease-out both; transition:stroke-opacity 240ms ease; }
@keyframes draw-branch { from { stroke-dashoffset:1; } to { stroke-dashoffset:0; } }
@keyframes reveal-repository { from { opacity:0; } to { opacity:1; } }
@media(prefers-reduced-motion:reduce) {
  .overview-edge,.overview-membership,.overview-vertex.member { animation:none; transition:none; }
  .overview-flow { display:none; }
}
</style>
