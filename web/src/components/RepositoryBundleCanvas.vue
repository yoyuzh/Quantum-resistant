<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch } from 'vue';
import { BUNDLE_PAGE_SIZE, BUNDLE_LABEL_SIZE, BUNDLE_LABEL_LINE, bundleStyle, layoutRepositoryBundle, linkedRepositoryNames, matchesBundleFocus } from '../utils/repositoryBundle.js';
import { clamp, zoomView } from '../utils/workbenchScene.js';
import { repositoryBundleSvg } from '../utils/repositorySvgExport.js';
import { exportGraph } from '../utils/graphExport.js';

const props = defineProps({ groups: Array, flows: Array, focus: Object, legacy: Boolean, stamp: String, evidenceLocation: Function });
const emit = defineEmits(['node', 'link', 'reset']);
const frame = ref(null), svg = ref(null), page = ref(1), hovered = ref(null);
const gridId = useId();
const miniId = `${gridId}-minimap`;
const miniOpen = ref(false);
const camera = ref({ x: 0, y: 0, scale: 1 });
const dimensions = ref({ width: 980, height: 580 });
const pagingHeight = ref(580);
const measure = shallowRef(undefined);
const repositoryNames = computed(() => linkedRepositoryNames(props.groups, props.flows));
const pageSize = computed(() => clamp(Math.floor((pagingHeight.value - 44) / 19), 18, BUNDLE_PAGE_SIZE));
const pages = computed(() => Math.max(1, Math.ceil(repositoryNames.value.length / pageSize.value)));
const visibleNames = computed(() => repositoryNames.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value));
const graph = computed(() => layoutRepositoryBundle(props.groups, props.flows, visibleNames.value,
  dimensions.value.width, dimensions.value.height, measure.value));
const legend = computed(() => [...new Set(graph.value.links.map(link => link.purpose))].map(bundleStyle));
const transform = computed(() => `translate(${camera.value.x} ${camera.value.y}) scale(${camera.value.scale})`);
const format = new Intl.NumberFormat('zh-CN');
const highlighting = computed(() => Object.values(props.focus).some(Boolean) || Boolean(hovered.value));
const relatedNodes = computed(() => highlighting.value ? new Set(graph.value.links.filter(matches).flatMap(link => ['repo:' + link.repo, 'algorithm:' + link.algorithm])) : new Set());
let observer, pointer, suppressClick;

function movePage(value) {
  page.value = value;
  hovered.value = null;
  fit();
  emit('reset');
}
watch(repositoryNames, () => movePage(1));
watch(pages, value => { if (page.value > value) movePage(value); });
watch([dimensions, () => graph.value.height, () => graph.value.width], () => fit(), { immediate:true });
onMounted(() => {
  const context = document.createElement('canvas').getContext('2d');
  context.font = `700 ${BUNDLE_LABEL_SIZE}px ${getComputedStyle(svg.value).getPropertyValue('--font-sans') || 'sans-serif'}`;
  measure.value = text => context.measureText(text).width;
  observer = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    if (width && height) {
      dimensions.value = { width:Math.floor(width), height:Math.floor(height) };
      pagingHeight.value = height + (parseFloat(getComputedStyle(frame.value).marginTop) || 0);
    }
  });
  observer.observe(frame.value);
});
onBeforeUnmount(() => observer?.disconnect());

function fittedScale(widthOnly = false) {
  const { width, height } = dimensions.value;
  return widthOnly ? width / graph.value.width : Math.min(width / graph.value.width, height / graph.value.height);
}
function fit(widthOnly = false) {
  const { width, height } = dimensions.value;
  const scale = fittedScale(widthOnly);
  camera.value = { x:(width - graph.value.width * scale) / 2, y:(height - graph.value.height * scale) / 2, scale };
}
function position(view) {
  const { width, height } = dimensions.value;
  const edge = 48;
  const minX = Math.min(edge - graph.value.width * view.scale, (width - graph.value.width * view.scale) / 2);
  const minY = Math.min(edge - graph.value.height * view.scale, (height - graph.value.height * view.scale) / 2);
  camera.value = { ...view, x:clamp(view.x, minX, width - edge), y:clamp(view.y, minY, height - edge) };
}
function zoom(factor, x = dimensions.value.width / 2, y = dimensions.value.height / 2) {
  const scale = clamp(camera.value.scale * factor, .2, 4);
  if (scale !== camera.value.scale) position(zoomView(camera.value, scale / camera.value.scale, x, y));
}
function point(event) {
  return new DOMPoint(event.clientX, event.clientY).matrixTransform(event.currentTarget.getScreenCTM().inverse());
}
function wheel(event) {
  if (event.ctrlKey || event.metaKey) return;
  event.preventDefault();
  const { x, y } = point(event);
  zoom(Math.exp(-clamp(event.deltaY, -160, 160) * .0025), x, y);
}
function down(event) {
  if (event.button !== 0 || pointer) return;
  suppressClick = false;
  pointer = { id:event.pointerId, origin:point(event), camera:camera.value };
}
function move(event) {
  if (pointer?.id !== event.pointerId) return;
  const { x, y } = point(event);
  const dx = x - pointer.origin.x, dy = y - pointer.origin.y;
  if (!suppressClick && Math.hypot(dx, dy) < 5) return;
  if (!suppressClick) event.currentTarget.setPointerCapture(event.pointerId);
  suppressClick = true;
  hovered.value = null;
  position({ ...pointer.camera, x:pointer.camera.x + dx, y:pointer.camera.y + dy });
}
function finish(event) {
  if (pointer?.id === event.pointerId) pointer = null;
}
function ignoreDragClick(event) {
  if (!suppressClick) return;
  suppressClick = false;
  event.stopPropagation();
}
function key(event) {
  const movement = { ArrowLeft:[36,0], ArrowRight:[-36,0], ArrowUp:[0,36], ArrowDown:[0,-36] }[event.key];
  if (movement) position({ ...camera.value, x:camera.value.x + movement[0], y:camera.value.y + movement[1] });
  else if (event.key === '+' || event.key === '=') zoom(1.3);
  else if (event.key === '-') zoom(1 / 1.3);
  else if (event.key === '0') fit();
  else return;
  event.preventDefault();
}
function miniMove(event) {
  const { x, y } = point(event);
  const scale = Math.max(camera.value.scale, fittedScale() * 1.65);
  position({ scale, x:dimensions.value.width / 2 - x * scale, y:dimensions.value.height / 2 - y * scale });
}
function matches(link) {
  const hover = hovered.value;
  const selected = Object.values(props.focus).some(Boolean) && matchesBundleFocus(link, props.focus);
  return selected || Boolean(hover && (hover.side ? link[hover.side] === hover.key : link.id === hover.id));
}
function isSelected(node) {
  return node.key === props.focus[node.side];
}
function revealNode(event, node) {
  if (!event.currentTarget.matches(':focus-visible')) return;
  const { x, y, scale } = camera.value;
  const px = x + node.labelX * scale, py = y + node.labelY * scale;
  position({ scale, x:x + clamp(px, 72, dimensions.value.width - 72) - px,
    y:y + clamp(py, 30, dimensions.value.height - 30) - py });
}
function describe(link) {
  return `${link.repo} → ${link.algorithm}（${link.label}），${format.format(link.count)}${props.legacy ? ' 条关联' : ' 项检出'}`;
}
function reset() {
  fit();
  emit('reset');
}
function download(format) {
  const full = layoutRepositoryBundle(props.groups, props.flows, repositoryNames.value, 0, 0, measure.value);
  return exportGraph(format, repositoryBundleSvg(full, getComputedStyle(svg.value), props.stamp, props.evidenceLocation), '仓库算法用途边捆绑图');
}
defineExpose({ download });
</script>

<template>
  <section class="bundle-canvas" aria-label="仓库与算法层次边捆绑图">
    <div ref="frame" class="bundle-viewport" role="region" aria-label="环形关系图画布，支持滚轮缩放和拖动平移" tabindex="0" @keydown="key">
      <svg ref="svg" :viewBox="`0 0 ${dimensions.width} ${dimensions.height}`" role="group" aria-label="圆周内的具体仓库、算法和用途关系"
        @wheel="wheel" @pointerdown="down" @pointermove="move" @pointerup="finish" @pointercancel="finish"
        @lostpointercapture="finish" @pointerleave="finish" @click.capture="ignoreDragClick">
        <title>仓库算法用途层次边捆绑图</title>
        <defs><pattern :id="gridId" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r=".8" fill="var(--workspace-dot)" />
        </pattern></defs>
        <rect width="100%" height="100%" fill="var(--bg-elevated)" />
        <rect width="100%" height="100%" :fill="`url(#${gridId})`" pointer-events="none" />
        <g data-graph-camera :transform="transform" font-family="var(--font-sans)" fill="var(--text-primary)">
          <circle :cx="graph.center.x" :cy="graph.center.y" :r="graph.radius" fill="none" stroke="var(--border)" />
          <g class="bundle-links">
            <g v-for="link in graph.links" :key="link.id" class="bundle-edge"
              tabindex="-1" role="button" :aria-label="describe(link)"
              @pointerenter="hovered=link" @pointerleave="hovered=null" @click="emit('link',link,$event.currentTarget)"
              @keydown.enter.prevent="emit('link',link,$event.currentTarget)">
              <title>{{ describe(link) }}</title>
              <path :d="link.path" :stroke="link.color" :stroke-dasharray="link.dash || undefined" fill="none"
                :stroke-width="link.width" :opacity="matches(link) ? .98 : .44" pointer-events="none" />
              <path data-svg-hit-target :d="link.path" fill="none" stroke="transparent" pointer-events="stroke"
                :stroke-width="Math.max(7, link.width)" />
            </g>
          </g>
          <g v-for="node in graph.nodes" :key="node.id" class="bundle-node" role="button" tabindex="0"
            :class="{ related:relatedNodes.has(node.id) }"
            :aria-pressed="isSelected(node)" :aria-label="`${node.key}，${format.format(node.count)} ${legacy ? '条关联' : '项检出'}`"
            @pointerenter="hovered=node" @pointerleave="hovered=null" @focus="revealNode($event,node)" @click="emit('node',node,$event.currentTarget)"
            @keydown.enter.prevent="emit('node',node,$event.currentTarget)" @keydown.space.prevent="emit('node',node,$event.currentTarget)">
            <title>{{ node.key }}，{{ format.format(node.count) }} {{ legacy ? '条关联' : '项检出' }}</title>
            <line :x1="node.x" :x2="node.labelX + (node.side === 'repo' ? 4 : -4)" :y1="node.y" :y2="node.labelY"
              :stroke="isSelected(node) ? 'var(--accent)' : 'var(--border)'" />
            <circle :cx="node.x" :cy="node.y" :r="isSelected(node) ? 5 : 3"
              :fill="node.side === 'repo' ? 'var(--accent)' : 'var(--text-secondary)'" />
            <text :x="node.labelX" :text-anchor="node.side === 'repo' ? 'end' : 'start'" dominant-baseline="central" :font-size="BUNDLE_LABEL_SIZE"
              :font-weight="isSelected(node) ? 700 : 500">
              <tspan v-for="(line, index) in node.labelLines" :key="index" :x="node.labelX"
                :y="node.labelY + (index - (node.labelLines.length - 1) / 2) * BUNDLE_LABEL_LINE">{{ line }}</tspan>
            </text>
          </g>
        </g>
      </svg>
      <div v-if="miniOpen" :id="miniId" class="bundle-mini" role="region" aria-label="关系图小地图">
        <div class="mini-header"><strong>小地图</strong><span>点击定位</span></div>
        <svg :viewBox="`${graph.exportBounds.x} ${graph.exportBounds.y} ${graph.exportBounds.width} ${graph.exportBounds.height}`"
          role="img" aria-label="圆环轮廓和当前视口" @click.stop="miniMove">
          <circle :cx="graph.center.x" :cy="graph.center.y" :r="graph.radius" fill="none" stroke="var(--text-secondary)" vector-effect="non-scaling-stroke" />
          <circle v-for="node in graph.nodes" :key="node.id" :cx="node.x" :cy="node.y" :r="graph.radius / 46" fill="var(--accent)" />
          <rect :x="-camera.x/camera.scale" :y="-camera.y/camera.scale" :width="dimensions.width/camera.scale"
            :height="dimensions.height/camera.scale" fill="var(--accent-soft)" fill-opacity=".28" stroke="var(--accent)" stroke-width="2" vector-effect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
    <div class="bundle-tools">
      <button class="button secondary compact" aria-label="缩小关系图" @click="zoom(1/1.3)">−</button>
      <output aria-label="当前缩放">{{ Math.round(camera.scale*100) }}%</output>
      <button class="button secondary compact" aria-label="放大关系图" @click="zoom(1.3)">＋</button>
      <button class="button secondary compact" @click="fit(true)">适应宽度</button>
      <button class="button secondary compact" @click="reset">复位</button>
      <button class="button secondary compact" :aria-expanded="miniOpen" :aria-controls="miniOpen ? miniId : undefined" @click="miniOpen=!miniOpen">小地图</button>
      <template v-if="pages > 1">
        <button class="button secondary compact" :disabled="page===1" @click="movePage(page-1)">上一页</button>
        <span class="small">仓库第 {{ page }} / {{ pages }} 页</span>
        <button class="button secondary compact" :disabled="page===pages" @click="movePage(page+1)">下一页</button>
      </template>
      <div class="bundle-legend" role="group" aria-label="用途线型图例">
        <span v-for="item in legend" :key="item.label">
          <svg width="28" height="10" aria-hidden="true"><path d="M1 5H27" :stroke="item.color" stroke-width="2" :stroke-dasharray="item.dash || undefined" /></svg>
          {{ item.label }}
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bundle-canvas { position:relative; display:flex; flex:1; flex-direction:column; min-width:0; min-height:0; overflow:hidden; border-radius:var(--radius);
  background:radial-gradient(circle,var(--workspace-dot) 1px,transparent 1px) 0 0/20px 20px,var(--bg-elevated); }
.bundle-viewport { flex:1; min-height:0; overflow:hidden; position:relative; }
.bundle-viewport > svg { display:block; width:100%; height:100%; touch-action:none; cursor:grab; user-select:none; }
.bundle-viewport > svg:active { cursor:grabbing; }
.bundle-mini { position:absolute; z-index:2; inset:auto 10px 10px auto; width:min(184px,55%); padding:6px;
  background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow-lg); }
.mini-header { display:flex; justify-content:space-between; gap:4px; font-size:12px; }
.mini-header span { color:var(--text-secondary); }
.bundle-mini svg { display:block; width:100%; height:86px; cursor:crosshair; background:var(--bg-elevated); border-radius:var(--radius); }
.bundle-edge,.bundle-node { cursor:pointer; }
.bundle-node text { transition:fill 150ms ease-out; }
.bundle-edge path:first-of-type { transition:opacity 150ms ease-out; }
@media(prefers-reduced-motion:reduce) { .bundle-node text,.bundle-edge path:first-of-type { transition:none; } }
.bundle-node.related text { fill:var(--accent-dim); }
.bundle-node:is(:hover,:focus-visible) text { fill:var(--accent); text-decoration:underline; }
.bundle-tools,.bundle-legend,.bundle-legend span { display:flex; flex-wrap:wrap; align-items:center; gap:6px; }
.bundle-tools { padding:4px 6px; }
.bundle-tools output { min-width:4ch; text-align:center; font-size:12px; font-variant-numeric:tabular-nums; }
.bundle-legend { gap:6px 12px; margin-inline-start:auto; font-size:12px; color:var(--text-secondary); }
@media(max-width:680px) { .bundle-legend { flex-basis:100%; } }
</style>
