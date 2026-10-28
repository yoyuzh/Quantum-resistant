import { onMounted, onUnmounted } from 'vue';

export function useListViewport(viewport, measure) {
  let observer;
  let media;
  function update() {
    const element = viewport.value;
    if (!element || !element.getClientRects().length) return;
    measure(element.clientHeight, media.matches);
  }
  onMounted(() => {
    media = window.matchMedia('(min-width: 1024px) and (min-height: 600px)');
    observer = new ResizeObserver(update);
    observer.observe(viewport.value);
    media.addEventListener('change', update);
    update();
  });
  onUnmounted(() => {
    observer?.disconnect();
    media?.removeEventListener('change', update);
  });
}
