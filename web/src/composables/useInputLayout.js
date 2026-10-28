import { reactive, watch } from 'vue';
import { describeResult } from '../utils/workspace.js';

export function useInputLayout(states) {
  const layouts = reactive(Object.fromEntries(Object.keys(states).map(mode =>
    [mode, { collapsed: false, source: '' }])));
  for (const [mode, state] of Object.entries(states)) {
    watch(() => state.busy || state.aiBusy, busy => {
      if (busy) layouts[mode].collapsed = true;
    });
    watch(() => state.result, result => {
      if (!result) return;
      layouts[mode].source = state.submittedSource || describeResult(result);
      layouts[mode].collapsed = true;
    });
    watch(() => state.error, error => {
      if (error) layouts[mode].collapsed = false;
    });
  }
  return layouts;
}
