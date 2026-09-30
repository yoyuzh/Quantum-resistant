import { nextTick, onUnmounted } from 'vue';
import { createTaskRunner } from '../utils/tasks.js';

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
        frame = requestAnimationFrame(finish);
        signal.addEventListener('abort', finish, { once: true });
      }),
  );
}

export function useTaskRunner() {
  const runner = createTaskRunner({ present: afterPresentation });
  onUnmounted(runner.dispose);
  return runner;
}
