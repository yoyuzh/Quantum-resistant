<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { graphScene, fitGraph, zoomView, nearestEdge, clamp } from '../utils/workbenchScene.js';
import { renderScene } from '../utils/workbenchRender.js';
import { workbenchSvg } from '../utils/workbenchSvg.js';
import { createFocusMotion, sceneFocus } from '../utils/workbenchFocus.js';
import GraphLegend from './GraphLegend.vue';
const props = defineProps({ graph: Object, selected: String });
const emit = defineEmits(['select', 'stats']);
const root = ref(null), canvas = ref(null), footer = ref(null), mini = ref(null), miniOpen = ref(false), hover = ref('');
const view = ref({ x: 0, y: 0, scale: 1 }), size = ref({ width: 800, height: 500, bottomInset: 88 });
const percent = computed(() => view.value.scale < .01 ? (view.value.scale * 100).toPrecision(2) : Math.round(view.value.scale * 100));
let observer, theme, frame = 0, scene = { nodes: [], edges: [] }, drag = null, automaticFit = true, focusKey = '';
const motion = createFocusMotion(), reduced = matchMedia('(prefers-reduced-motion: reduce)');
function invalidate() { if (!frame) frame = requestAnimationFrame(draw); }
function fit(widthOnly = false) {
  automaticFit = true; view.value = fitGraph(props.graph, size.value, widthOnly); invalidate();
}
function locate(id) {
  const node = props.graph?.nodes.find(n => n.id === id);
  if (!node) return;
  automaticFit = false;
  const scale = Math.min(1.3, (size.value.width - 64) / node.width, (size.value.height - size.value.bottomInset) / node.height);
  view.value = { x: size.value.width / 2 - (node.x + node.width / 2) * scale,
    y: 28 + (size.value.height - size.value.bottomInset) / 2 - (node.y + node.height / 2) * scale, scale };
  invalidate();
}
function zoom(factor, x = size.value.width / 2, y = size.value.height / 2) {
  automaticFit = false; view.value = zoomView(view.value, factor, x, y); invalidate();
}
function wheel(event) {
  event.preventDefault();
  const rect = canvas.value.getBoundingClientRect();
  zoom(Math.exp(-clamp(event.deltaY, -180, 180) * .002), event.clientX - rect.left, event.clientY - rect.top);
}
function point(event) {
  const rect = canvas.value.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}
function hit(p) { return scene.nodes.find(n => p.x >= n.x && p.x <= n.x + n.width && p.y >= n.y && p.y <= n.y + n.height); }
function down(event) {
  canvas.value.setPointerCapture(event.pointerId);
  drag = { ...point(event), vx: view.value.x, vy: view.value.y, moved: false };
}
function move(event) {
  const p = point(event);
  if (drag) {
    const dx = p.x - drag.x, dy = p.y - drag.y;
    drag.moved ||= Math.hypot(dx, dy) > 4;
    automaticFit = false; view.value = { ...view.value, x: drag.vx + dx, y: drag.vy + dy }; invalidate();
    return;
  }
  const current = hit(p)?.id || nearestEdge(scene.edges, p)?.id || '';
  if (hover.value !== current) {
    hover.value = current; canvas.value.style.cursor = current ? 'pointer' : 'grab'; invalidate();
  }
}
function up(event) {
  if (!drag) return;
  if (!drag.moved) {
    const node = hit(point(event)), edge = nearestEdge(scene.edges, point(event));
    if (node?.aggregated) locate(node.members[0]);
    else if (node) emit('select', node.id);
    else if (edge) emit('select', edge.target);
  }
  drag = null; canvas.value.releasePointerCapture(event.pointerId);
}
function key(event) {
  if (['+', '=', '-', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '0'].includes(event.key)) event.preventDefault();
  if (['+', '='].includes(event.key)) zoom(1.5);
  else if (event.key === '-') zoom(1 / 1.5);
  else if (event.key === '0') fit();
  else if (event.key.startsWith('Arrow')) {
    automaticFit = false;
    view.value = { ...view.value, x: view.value.x + ({ ArrowLeft: 60, ArrowRight: -60 }[event.key] || 0),
      y: view.value.y + ({ ArrowUp: 60, ArrowDown: -60 }[event.key] || 0) }; invalidate();
  }
}
function colors() {
  const css = getComputedStyle(root.value), get = name => css.getPropertyValue(name).trim();
  return { surface: get('--bg-surface'), background: get('--bg-elevated'), text: get('--text-primary'),
    secondary: get('--text-secondary'), border: get('--border'), accent: get('--accent'), font: get('--font-sans') };
}
function draw(now) {
  frame = 0;
  if (!canvas.value || !props.graph) return;
  const ctx = canvas.value.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1), { width, height } = size.value;
  if (canvas.value.width !== width * dpr || canvas.value.height !== height * dpr) {
    canvas.value.width = width * dpr; canvas.value.height = height * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, width, height);
  scene = graphScene(props.graph, view.value, size.value);
  const focused = scene.nodes.find(n => n.id === hover.value) || scene.edges.find(e => e.id === hover.value);
  const nextKey = JSON.stringify(focused?.members || (props.selected ? [props.selected] : []));
  if (focusKey !== nextKey) {
    motion.set(sceneFocus(props.graph, scene, hover.value, props.selected), now); focusKey = nextKey;
  }
  const focus = motion.sample(now, reduced.matches);
  renderScene(ctx, scene, colors(), focus);
  emit('stats', { nodes: scene.visibleNodes, edges: scene.visibleEdges, groups: scene.nodes.length, aggregated: scene.aggregated });
  drawMini();
  if (focus.running) invalidate();
}
function drawMini() {
  if (!miniOpen.value || !mini.value || !props.graph) return;
  const ctx = mini.value.getContext('2d'), g = props.graph, sx = 180 / g.width, sy = 110 / g.height;
  ctx.clearRect(0, 0, 180, 110); ctx.fillStyle = colors().accent;
  for (const n of g.nodes) ctx.fillRect(n.x * sx, n.y * sy, Math.max(2, n.width * sx), Math.max(1, n.height * sy));
  ctx.strokeStyle = colors().text;
  ctx.strokeRect(-view.value.x / view.value.scale * sx, -view.value.y / view.value.scale * sy,
    size.value.width / view.value.scale * sx, Math.max(2, size.value.height / view.value.scale * sy));
}
function miniMove(event) {
  const rect = mini.value.getBoundingClientRect(), g = props.graph;
  automaticFit = false;
  view.value = { ...view.value, x: size.value.width / 2 - (event.clientX - rect.left) / 180 * g.width * view.value.scale,
    y: size.value.height / 2 - (event.clientY - rect.top) / 110 * g.height * view.value.scale }; invalidate();
}
function exportView() {
  const value = workbenchSvg(props.graph, view.value, size.value, colors());
  const url = URL.createObjectURL(new Blob([value], { type: 'image/svg+xml' })), link = document.createElement('a');
  link.href = url; link.download = 'evidence-view.svg'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
watch(() => props.graph, () => { hover.value = ''; focusKey = ''; fit(); }, { flush: 'post' });
watch(() => props.selected, id => { if (id) locate(id); invalidate(); });
watch(miniOpen, invalidate);
onMounted(() => {
  observer = new ResizeObserver(() => {
    if (!root.value.clientWidth || !root.value.clientHeight) return;
    size.value = { width: root.value.clientWidth, height: root.value.clientHeight,
      bottomInset: Math.max(88, (footer.value?.offsetHeight || 60) + (root.value.clientWidth < 600 ? 80 : 56)) };
    if (props.selected) locate(props.selected); else if (automaticFit) fit(); else invalidate();
  });
  observer.observe(root.value);
  observer.observe(footer.value);
  theme = new MutationObserver(invalidate); theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  reduced.addEventListener('change', invalidate);
  fit();
});
onBeforeUnmount(() => { observer?.disconnect(); theme?.disconnect(); reduced.removeEventListener('change', invalidate); cancelAnimationFrame(frame); });
defineExpose({ fit, locate, exportView });
</script>
<template>
  <div ref="root" class="canvas-workspace" :data-scale="view.scale" :data-hover="hover">
    <canvas ref="canvas" tabindex="0" aria-label="完整关系图。滚轮缩放，拖动画布平移，0复位显示全部；搜索可定位记录，点击节点查看依据。"
      @wheel="wheel" @pointerdown="down" @pointermove="move" @pointerup="up" @pointercancel="drag=null"
      @pointerleave="hover='';invalidate()" @keydown="key" />
    <p v-if="!graph.nodes.length" class="canvas-empty" role="status">没有匹配的关系</p>
    <div ref="footer" class="canvas-footer"><div class="canvas-tools">
      <button class="button secondary compact" aria-label="缩小关系图" @click="zoom(1/1.5)">−</button><span>{{ percent }}%</span>
      <button class="button secondary compact" aria-label="放大关系图" @click="zoom(1.5)">＋</button>
      <button class="button secondary compact" @click="fit(true)">适应宽度</button>
      <button class="button secondary compact" @click="fit()">复位</button>
      <button class="button secondary compact" :aria-pressed="miniOpen" @click="miniOpen=!miniOpen">小地图</button>
      <button class="button secondary compact" @click="exportView">导出当前视图</button>
    </div><GraphLegend :mode="graph.mode" /></div>
    <canvas v-if="miniOpen" ref="mini" class="graph-mini" width="180" height="110" aria-label="关系图小地图" @click="miniMove" />
  </div>
</template>
<style scoped>
.canvas-workspace { flex:1;min-width:0;min-height:220px;position:relative;overflow:hidden;background:radial-gradient(circle,var(--workspace-dot) 1px,transparent 1px) 0 0/20px 20px,var(--bg-elevated);border-radius:var(--radius); }
.canvas-workspace>canvas:first-child { display:block;width:100%;height:100%;touch-action:none;cursor:grab; }
.canvas-footer { position:absolute;bottom:12px;left:12px;right:12px;display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:8px;pointer-events:none; }
.canvas-tools { display:flex;flex-wrap:wrap;align-items:center;gap:4px; }
.canvas-tools>* { pointer-events:auto; }.canvas-tools>span { padding:4px;background:var(--bg-surface);font-size:12px; }
.canvas-empty { position:absolute;inset:35% 0 auto;text-align:center;color:var(--text-secondary);pointer-events:none; }
.graph-mini { position:absolute;right:12px;top:30px;background:var(--bg-surface);border-radius:6px;cursor:crosshair; }
</style>
