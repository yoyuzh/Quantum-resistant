import { computed, onMounted, onUnmounted, ref } from 'vue';
import { layoutGraph } from '../utils/graphLayout.js';

export function useGraphLayout(graph, width, height) {
  const revision = ref(0);
  let context;
  let family;
  let active = true;
  const measure = (text, size) => {
    context.font = `${size}px ${family}`;
    return context.measureText(text).width;
  };
  const layout = computed(() => {
    revision.value;
    return layoutGraph(graph.value, width.value, height.value, context ? measure : undefined);
  });
  onMounted(() => {
    context = document.createElement('canvas').getContext('2d');
    family = getComputedStyle(document.documentElement).getPropertyValue('--font-sans');
    revision.value++;
    document.fonts?.ready.then(() => { if (active) revision.value++; });
  });
  onUnmounted(() => { active = false; });
  return layout;
}
