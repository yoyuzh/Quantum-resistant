import { nextTick, onUnmounted } from 'vue';
import { createTaskRunner } from '../utils/tasks.js';
import { PROGRESS_FILL_MS } from '../utils/progress.js';
import { abortableDelay } from '../utils/remoteTasks.js';
import { completedModelProgress } from '../utils/scanStages.js';

function motionVisible() {
  return !document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function afterPresentation(signal) {
  return nextTick().then(
    () =>
      new Promise((resolve) => {
        if (signal.aborted) return resolve();
        let frame;
        const finish = () => {
          cancelAnimationFrame(frame);
          clearTimeout(fallback);
          signal.removeEventListener('abort', finish);
          resolve();
        };
        const fallback = setTimeout(finish, 100);
        frame = requestAnimationFrame(() => { frame = requestAnimationFrame(finish); });
        signal.addEventListener('abort', finish, { once: true });
      }),
  );
}

export async function presentScanCompletion(state, status, result, signal) {
  const ai = result.ai_analysis;
  const model = !status.cancel_requested && !status.ai_stop_requested && !status.error &&
    completedModelProgress({ ...ai?.coverage, status: ai?.status });
  if ((!model && status.state !== 'succeeded') || signal.aborted || !motionVisible()) return;
  await afterPresentation(signal);
  if (signal.aborted || !motionVisible()) return;
  if (model) state.modelPresentation = model;
  else state.presentationComplete = true;
  await afterPresentation(signal);
  if (!signal.aborted && motionVisible())
    await abortableDelay(PROGRESS_FILL_MS + 120, signal).catch(() => {});
}

export function useTaskRunner() {
  const runner = createTaskRunner({ present: signal => motionVisible() ? afterPresentation(signal) : undefined });
  onUnmounted(runner.dispose);
  return {
    run(key, state, task, options) {
      return runner.run(key, state, signal => {
        state.presentationComplete = false;
        state.modelPresentation = null;
        return task(signal);
      }, { minimum: motionVisible() ? 800 : 0, ...options });
    },
  };
}
