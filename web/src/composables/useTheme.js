import { onUnmounted, ref, watch } from 'vue';

export function useTheme() {
  let initial = 'light';
  try {
    const stored = window.quantumDesktop?.readTheme() ?? localStorage.getItem('app-theme');
    initial = stored === 'dark' ? 'dark' : 'light';
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
        window.quantumDesktop?.saveTheme(value).catch(() => {});
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
