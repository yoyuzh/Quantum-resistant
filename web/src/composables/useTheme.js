import { onUnmounted, ref, watch } from 'vue';
import { readThemePreference, persistThemePreference } from '../utils/theme.js';

export function useTheme() {
  const theme = ref(readThemePreference(window.quantumDesktop));
  const stop = watch(
    theme,
    (value) => {
      document.documentElement.dataset.theme = value;
      persistThemePreference(value, window.quantumDesktop);
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
