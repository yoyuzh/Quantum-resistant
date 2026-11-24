import { computed, onBeforeUnmount, ref } from 'vue';
import { clamp, zoomView } from '../utils/workbenchScene.js';

export function useRepositoryGraphCamera(dimensions, graph, maximumScale) {
  const camera = ref({ x: 0, y: 0, scale: 1 });
  const transform = computed(() => `translate(${camera.value.x} ${camera.value.y}) scale(${camera.value.scale})`);
  let frame = 0;
  function stop() {
    cancelAnimationFrame(frame);
  }
  onBeforeUnmount(stop);

  function fittedScale(widthOnly = false) {
    const { width, height } = dimensions.value;
    const byWidth = width / graph.value.width;
    return widthOnly ? byWidth : Math.min(byWidth, height / graph.value.height);
  }
  function fit(widthOnly = false) {
    const { width, height } = dimensions.value;
    const scale = fittedScale(widthOnly);
    stop();
    camera.value = { x:(width - graph.value.width * scale) / 2, y:(height - graph.value.height * scale) / 2, scale };
  }
  function bounded(view) {
    const { width, height } = dimensions.value;
    const edge = 48;
    const minX = Math.min(edge - graph.value.width * view.scale, (width - graph.value.width * view.scale) / 2);
    const minY = Math.min(edge - graph.value.height * view.scale, (height - graph.value.height * view.scale) / 2);
    return { ...view, x:clamp(view.x, minX, width - edge), y:clamp(view.y, minY, height - edge) };
  }
  function position(view) {
    stop();
    camera.value = bounded(view);
  }
  function zoom(factor, x = dimensions.value.width / 2, y = dimensions.value.height / 2) {
    const scale = clamp(camera.value.scale * factor, .2, maximumScale());
    if (scale !== camera.value.scale) position(zoomView(camera.value, scale / camera.value.scale, x, y));
  }
  function focusView(boxes, viewport, overlay) {
    if (!boxes.length) return fit();
    const left = Math.min(...boxes.map(box => box.x - box.w)), right = Math.max(...boxes.map(box => box.x + box.w));
    const top = Math.min(...boxes.map(box => box.y - box.h)), bottom = Math.max(...boxes.map(box => box.y + box.h));
    const { width, height } = dimensions.value;
    const fitScale = fittedScale();
    function fitArea(x, y, w, h) {
      const scale = Math.min(w / (right - left + 28), h / (bottom - top + 24), fitScale * 1.65);
      return { scale, x:x + (w - (left + right) * scale) / 2, y:y + (h - (top + bottom) * scale) / 2 };
    }
    let target = fitArea(0, 0, width, height);
    if (viewport && overlay?.offsetWidth) {
      const frame = viewport.getBoundingClientRect(), card = overlay.getBoundingClientRect();
      const cardLeft = card.left - frame.left - 8, cardTop = card.top - frame.top - 8;
      const cardRight = card.right - frame.left + 8, cardBottom = card.bottom - frame.top + 8;
      const { x, y, scale } = target;
      if (boxes.some(box => x + (box.x + box.w) * scale > cardLeft && x + (box.x - box.w) * scale < cardRight &&
        y + (box.y + box.h) * scale > cardTop && y + (box.y - box.h) * scale < cardBottom)) {
        const leftArea = fitArea(0, 0, cardLeft, height);
        const belowArea = fitArea(0, cardBottom, width, height - cardBottom);
        const clearArea = leftArea.scale > belowArea.scale ? leftArea : belowArea;
        if (clearArea.scale >= fitScale * .55) target = clearArea;
      }
    }
    const goal = bounded(target);
    stop();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      camera.value = goal;
      return;
    }
    const from = camera.value, start = performance.now();
    function step(now) {
      const t = clamp((now - start) / 420, 0, 1);
      const progress = t * t * (3 - 2 * t);
      camera.value = {
        x:from.x + (goal.x - from.x) * progress, y:from.y + (goal.y - from.y) * progress,
        scale:from.scale + (goal.scale - from.scale) * progress,
      };
      if (t < 1) frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
  }
  return { camera, transform, fit, fittedScale, focusView, position, stop, zoom };
}
