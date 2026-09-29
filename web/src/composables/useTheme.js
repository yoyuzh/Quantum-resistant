import { onUnmounted, ref, watch } from 'vue';

export function useTheme() {
  let initial = 'light';
  try {
    initial = localStorage.getItem('app-theme') === 'dark' ? 'dark' : 'light';
  } catch {
    /* Storage may be disabled. */
  }
  const theme = ref(initial);
  const stop = watch(
    theme,
    (value) => {
      document.documentElement.dataset.theme = value;
      try {
        localStorage.setItem('app-theme', value);
      } catch {
        /* Keep the session theme. */
      }
    },
    { immediate: true },
  );
  onUnmounted(stop);
  return {
    theme,
    toggle: () => {
      theme.value = theme.value === 'light' ? 'dark' : 'light';
    },
  };
}
