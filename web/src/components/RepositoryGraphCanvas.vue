<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch } from 'vue';
import { BUNDLE_LABEL_SIZE, BUNDLE_LABEL_LINE, bundleStyle, layoutRepositoryBundle, linkedRepositoryNames,
  matchesBundleFocus } from '../utils/repositoryBundle.js';
import { clamp } from '../utils/workbenchScene.js';
import { useRepositoryGraphCamera } from '../composables/useRepositoryGraphCamera.js';
import { exportRepositoryOverview, repositoryBundleSvg } from '../utils/repositorySvgExport.js';
import { arrangeOverview, layoutRepositoryOverview, overviewFocus, OVERVIEW_FONT_SIZE, OVERVIEW_WIDTH_GUIDE,
  OVERVIEW_PAGE_SIZE } from '../utils/repositoryOverview.js';
import { exportGraph } from '../utils/graphExport.js';
import RepositoryOverviewLayer from './RepositoryOverviewLayer.vue';

const props = defineProps({ groups: Array, flows: Array, focus: Object, legacy: Boolean, stamp: String,
  evidenceLocation: Function, overview: Boolean, expanded: String, overviewPeak: Number, selectedEdge: String,
  showUnlinked: Boolean, overlay: Object });
const emit = defineEmits(['node', 'link', 'reset']);
const frame = ref(null), svg = ref(null), page = ref(1), hovered = ref(null);
const overviewLayer = ref(null), floating = ref(false);
const gridId = useId();
const miniId = `${gridId}-minimap`;
const miniOpen = ref(false);
const dimensions = ref({ width: 980, height: 580 });
const measure = shallowRef(undefined);
const measureCard = shallowRef(undefined);
const title = computed(() => props.overview ? '二维仓库全景图' : '仓库算法用途边捆绑图');
const repositoryNames = computed(() => linkedRepositoryNames(props.groups, props.flows));
const pageableNames = computed(() => {
  if (!props.overview) return repositoryNames.value;
  const group = props.groups.find(item => item.id === props.expanded);
  if (!group) return [];
  return props.showUnlinked ? group.rows.map(row => row.repo.full_name) : linkedRepositoryNames([group], props.flows);
});
const pageSize = computed(() => clamp(Math.floor(dimensions.value.height / 58), 6, OVERVIEW_PAGE_SIZE));
const pages = computed(() => props.overview ? Math.max(1, Math.ceil(pageableNames.value.length / pageSize.value)) : 1);
const visibleNames = computed(() => props.overview
  ? pageableNames.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
  : repositoryNames.value);
const graph = computed(() => props.overview
  ? layoutRepositoryOverview(props.groups, props.flows, { expanded:props.expanded, visibleNames:visibleNames.value,
    legacy:props.legacy, viewportWidth:dimensions.value.width, measure:measureCard.value, peak:props.overviewPeak, showUnlinked:props.showUnlinked })
  : layoutRepositoryBundle(props.groups, props.flows, visibleNames.value, dimensions.value.width, dimensions.value.height, measure.value));
const legend = computed(() => props.overview ? [] : [...new Set(graph.value.links.map(link => link.purpose))].map(bundleStyle));
const neighborhood = computed(() => props.overview ? {
  ...overviewFocus(graph.value, props.expanded, props.focus), expanded:props.expanded, focus:props.focus,
} : null);
const overviewPositions = computed(() => neighborhood.value?.id
  ? arrangeOverview(graph.value, neighborhood.value.id, neighborhood.value.nodes) : graph.value.home);
const { camera, transform, fit, fittedScale, focusView, position, stop, zoom } =
  useRepositoryGraphCamera(dimensions, graph, () => props.overview ? 8 : 4);
const format = new Intl.NumberFormat('zh-CN');
const highlightedLinks = computed(() => props.overview ? [] : graph.value.links.filter(matches));
const relatedNodes = computed(() => new Set(highlightedLinks.value.flatMap(link => [link.source, link.target])));
const contextOpacity = computed(() => clamp(.49 - graph.value.links.length / 660, .27, .44));
let observer, pointer, pinch, suppressClick;

function movePage(value) {
  page.value = value;
  hovered.value = null;
  fit();
  emit('reset');
}
function showRepository(name) {
  const index = pageableNames.value.indexOf(name);
  if (index >= 0) page.value = Math.floor(index / pageSize.value) + 1;
}
watch(pageableNames, () => {
  page.value = 1;
  hovered.value = null;
});
watch(pages, value => { if (page.value > value) movePage(value); });
watch([dimensions, () => props.overview, neighborhood, () => graph.value.height, () => graph.value.width, () => props.overview && props.overlay],
  () => {
    if (!neighborhood.value?.selected) return fit();
    const connected = graph.value.nodes.filter(node => neighborhood.value.nodes.has(node.id));
    focusView(connected.map(node => ({ ...overviewPositions.value.get(node.id), w:node.width / 2, h:node.height / 2 })), frame.value, props.overlay);
  }, { immediate:true, flush:'post' });
onMounted(() => {
  const context = document.createElement('canvas').getContext('2d');
  if (context) {
    const family = getComputedStyle(svg.value).getPropertyValue('--font-sans') || 'sans-serif';
    const widthFor = (text, size) => {
      context.font = `700 ${size}px ${family}`;
      return context.measureText(text).width;
    };
    measure.value = text => widthFor(text, BUNDLE_LABEL_SIZE);
    const glyphs = new Map();
    measureCard.value = char => {
      if (!glyphs.has(char)) glyphs.set(char, widthFor(char, OVERVIEW_FONT_SIZE));
      return glyphs.get(char);
    };
  }
  observer = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    if (width && height) {
      dimensions.value = { width:Math.floor(width), height:Math.floor(height) };
    }
  });
  observer.observe(frame.value);
});
onBeforeUnmount(() => observer?.disconnect());

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
  if (event.button !== 0 || pinch) return;
  if (pointer) {
    if (!props.overview || event.pointerType !== 'touch' || pointer.type !== 'touch') return;
    const first = pointer.current, second = point(event);
    const [a,b] = [pointer.id, event.pointerId];
    const points = new Map([[a,first], [b,second]]);
    pinch = { points, camera:camera.value, ...pinchGeometry(points) };
    overviewLayer.value?.settleNode();
    stop();
    for (const id of points.keys()) event.currentTarget.setPointerCapture(id);
    suppressClick = true;
    pointer = null;
    return;
  }
  suppressClick = false;
  const nodeId = event.target.closest('[data-overview-node]')?.dataset.overviewNode;
  const origin = point(event);
  pointer = { id:event.pointerId, type:event.pointerType, origin, current:origin, camera:camera.value,
    nodeId, nodeStart:nodeId ? overviewLayer.value?.position(nodeId) : null };
}
function pinchGeometry(points) {
  const [first,second] = points.values();
  return { x:(first.x + second.x) / 2, y:(first.y + second.y) / 2,
    distance:Math.max(1, Math.hypot(first.x - second.x, first.y - second.y)) };
}
function move(event) {
  if (pinch?.points.has(event.pointerId)) {
    pinch.points.set(event.pointerId, point(event));
    const { x, y, distance } = pinchGeometry(pinch.points);
    const from = pinch.camera;
    const scale = clamp(from.scale * distance / pinch.distance, .2, 8);
    position({ scale, x:x - (pinch.x - from.x) * scale / from.scale, y:y - (pinch.y - from.y) * scale / from.scale });
    return;
  }
  if (pointer?.id !== event.pointerId) return;
  pointer.current = point(event);
  const { x, y } = pointer.current;
  const dx = x - pointer.origin.x, dy = y - pointer.origin.y;
  if (!suppressClick && Math.hypot(dx, dy) < 5) return;
  if (!suppressClick) {
    event.currentTarget.setPointerCapture(event.pointerId);
    stop();
  }
  suppressClick = true;
  if (pointer.nodeStart) {
    const { x:originX, y:originY } = pointer.nodeStart;
    overviewLayer.value?.moveNode(pointer.nodeId, originX + dx / camera.value.scale, originY + dy / camera.value.scale);
    return;
  }
  hovered.value = null;
  position({ ...pointer.camera, x:pointer.camera.x + dx, y:pointer.camera.y + dy });
}
function finish(event) {
  if (pinch?.points.has(event.pointerId)) pinch = null;
  if (pointer?.id !== event.pointerId) return;
  if (suppressClick) overviewLayer.value?.settleNode();
  pointer = null;
}
function ignoreDragClick(event) {
  if (!suppressClick) return;
  suppressClick = false;
  event.stopPropagation();
}
function key(event) {
  const movement = { ArrowLeft:[36,0], ArrowRight:[-36,0], ArrowUp:[0,36], ArrowDown:[0,-36] }[event.key];
  const nodeId = event.shiftKey && event.target.closest('[data-overview-node]')?.dataset.overviewNode;
  if (movement && nodeId) {
    const { x, y } = overviewLayer.value.position(nodeId);
    overviewLayer.value.moveNode(nodeId, x - movement[0] / 3, y - movement[1] / 3, true);
  } else if (movement) position({ ...camera.value, x:camera.value.x + movement[0], y:camera.value.y + movement[1] });
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
function revealNode(event, node, point = { x:node.labelX, y:node.labelY }) {
  if (!event.currentTarget.matches(':focus-visible')) return;
  const { x, y, scale } = camera.value;
  const px = x + point.x * scale, py = y + point.y * scale;
  position({ scale, x:x + clamp(px, 72, dimensions.value.width - 72) - px,
    y:y + clamp(py, 30, dimensions.value.height - 30) - py });
}
function describe(link) {
  return link.title || `${link.repo} → ${link.algorithm}（${link.label}），${format.format(link.count)}${props.legacy ? ' 条关联' : ' 项检出'}`;
}
function reset() {
  fit();
  overviewLayer.value?.reset();
  emit('reset');
}
function download(format) {
  const theme = getComputedStyle(svg.value);
  if (props.overview) return exportRepositoryOverview(format, props.groups, props.flows, {
    theme, stamp:props.stamp, evidenceLocation:props.evidenceLocation, title:title.value, legacy:props.legacy,
    measure:measureCard.value, peak:props.overviewPeak, showUnlinked:props.showUnlinked,
  });
  const full = layoutRepositoryBundle(props.groups, props.flows, repositoryNames.value, 0, 0, measure.value);
  return exportGraph(format, repositoryBundleSvg(full, theme, props.stamp, props.evidenceLocation), title.value);
}
defineExpose({ download, showRepository, focusViewport: () => frame.value?.focus({ preventScroll:true }) });
</script>

<template>
  <section class="bundle-canvas" :aria-label="title">
    <div ref="frame" class="bundle-viewport" role="region" aria-label="关系图画布，支持滚轮缩放和拖动平移" tabindex="0" @keydown="key">
      <svg ref="svg" :viewBox="`0 0 ${dimensions.width} ${dimensions.height}`" role="group" :aria-label="title"
        @wheel="wheel" @pointerdown="down" @pointermove="move" @pointerup="finish" @pointercancel="finish"
        @lostpointercapture="finish" @pointerleave="finish" @click.capture="ignoreDragClick"
        @click="overview && !$event.target.closest('[data-overview-node],[data-overview-edge]') && emit('reset')">
        <title>{{ title }}</title>
        <defs><pattern :id="gridId" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r=".8" fill="var(--workspace-dot)" />
        </pattern></defs>
        <rect width="100%" height="100%" fill="var(--bg-elevated)" />
        <rect width="100%" height="100%" :fill="`url(#${gridId})`" pointer-events="none" />
        <g data-graph-camera :transform="transform" font-family="var(--font-sans)" fill="var(--text-primary)">
          <RepositoryOverviewLayer v-if="overview" ref="overviewLayer" :graph="graph" :neighborhood="neighborhood"
            :selected-edge="selectedEdge" :floating="floating" @node="(node, target) => emit('node', node, target)"
            @link="(link, target) => emit('link', link, target)" @reveal="revealNode" />
          <template v-else>
          <circle :cx="graph.center.x" :cy="graph.center.y" :r="graph.radius" fill="none" stroke="var(--border)" />
          <g class="bundle-links">
            <g v-for="link in graph.links" :key="link.id" class="bundle-edge"
              tabindex="-1" role="button" :aria-label="describe(link)"
              @pointerenter="hovered=link" @pointerleave="hovered=null" @click="emit('link',link,$event.currentTarget)"
              @keydown.enter.prevent="emit('link',link,$event.currentTarget)">
              <title>{{ describe(link) }}</title>
              <path :d="link.path" :stroke="link.color" :stroke-dasharray="link.dash || undefined" fill="none"
                :stroke-width="link.width" :opacity="contextOpacity" pointer-events="none" />
              <path data-svg-hit-target :d="link.path" fill="none" stroke="transparent" pointer-events="stroke"
                :stroke-width="Math.max(7, link.width)" />
            </g>
          </g>
          <path v-for="link in highlightedLinks" :key="link.id" :d="link.path" :stroke="link.color"
            :stroke-dasharray="link.dash || undefined" :stroke-width="link.width" fill="none" opacity=".94" pointer-events="none" />
          <g v-for="node in graph.nodes" :key="node.id" class="bundle-node" role="button" tabindex="0"
            :class="{ related:relatedNodes.has(node.id) }"
            :aria-pressed="isSelected(node)"
            :aria-label="`${node.key}，${format.format(node.count)} ${legacy ? '条关联' : '项检出'}`"
            @pointerenter="hovered=node" @pointerleave="hovered=null" @focus="revealNode($event,node)" @click="emit('node',node,$event.currentTarget)"
            @keydown.enter.prevent="emit('node',node,$event.currentTarget)" @keydown.space.prevent="emit('node',node,$event.currentTarget)">
            <title>{{ node.key }}，{{ format.format(node.count) }} {{ legacy ? '条关联' : '项检出' }}</title>
            <line :x1="node.x" :x2="node.labelX" :y1="node.y" :y2="node.labelY"
              :stroke="isSelected(node) ? 'var(--accent)' : 'var(--border)'" />
            <circle :cx="node.x" :cy="node.y" :r="isSelected(node) ? 5 : 3"
              :fill="node.side === 'repo' ? 'var(--accent)' : 'var(--text-secondary)'" />
            <text :transform="`translate(${node.labelX} ${node.labelY}) rotate(${node.rotation})`"
              :text-anchor="node.anchor" dominant-baseline="central" :font-size="BUNDLE_LABEL_SIZE"
              :font-weight="isSelected(node) ? 700 : 500">
              <tspan v-for="(line, index) in node.labelLines" :key="index" x="0"
                :y="(index - (node.labelLines.length - 1) / 2) * BUNDLE_LABEL_LINE">{{ line }}</tspan>
            </text>
          </g>
          </template>
        </g>
      </svg>
      <div v-if="miniOpen" :id="miniId" class="bundle-mini" role="region" aria-label="关系图小地图">
        <div class="mini-header"><strong>小地图</strong><span>点击定位</span></div>
        <svg :viewBox="`${graph.exportBounds.x} ${graph.exportBounds.y} ${graph.exportBounds.width} ${graph.exportBounds.height}`"
          role="img" aria-label="图形轮廓和当前视口" @click.stop="miniMove">
          <circle v-if="!overview" :cx="graph.center.x" :cy="graph.center.y" :r="graph.radius" fill="none" stroke="var(--text-secondary)" vector-effect="non-scaling-stroke" />
          <circle v-for="node in graph.nodes" :key="node.id"
            :cx="overviewPositions?.get(node.id)?.x ?? node.x" :cy="overviewPositions?.get(node.id)?.y ?? node.y"
            :r="overview ? 7 : graph.radius / 46" fill="var(--accent)" />
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
      <button v-if="overview" class="button secondary compact" :aria-pressed="floating" @click="floating=!floating">浮动</button>
      <template v-if="pages > 1">
        <button class="button secondary compact" :disabled="page===1" @click="movePage(page-1)">上一页</button>
        <span class="small" aria-live="polite">第 {{ page }} / {{ pages }} 页</span>
        <button class="button secondary compact" :disabled="page===pages" @click="movePage(page+1)">下一页</button>
      </template>
      <div v-if="overview" class="bundle-legend">
        <span v-if="expanded"><svg width="20" height="12" aria-hidden="true"><path d="M2 6H18" stroke="var(--accent)" stroke-width="1.5" /></svg>类别归属</span>
        <span v-if="!legacy && graph.links.length" aria-label="线宽由细到粗表示检出量由少到多">检出量 少
          <svg width="36" height="12" aria-hidden="true"><path :d="OVERVIEW_WIDTH_GUIDE" fill="currentColor" /></svg>多</span>
      </div>
      <div v-else class="bundle-legend" role="group" aria-label="用途线型图例">
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
.bundle-node:hover text, :global(:root[data-keyboard] .bundle-node:focus-visible text) { fill:var(--accent); text-decoration:underline; }
.bundle-tools,.bundle-legend,.bundle-legend span { display:flex; flex-wrap:wrap; align-items:center; gap:6px; }
.bundle-tools { padding:4px 6px; }
.bundle-tools .button[aria-pressed='true'] { background:var(--control-selected); color:var(--accent-dim); }
.bundle-tools output { min-width:4ch; text-align:center; font-size:12px; font-variant-numeric:tabular-nums; }
.bundle-legend { gap:6px 12px; margin-inline-start:auto; font-size:12px; color:var(--text-secondary); }
@media(max-width:680px) { .bundle-legend { flex-basis:100%; } }
</style>
