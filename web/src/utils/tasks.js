// Request and presentation lifetimes share one cancellation boundary.
export function createTaskRunner({
  now = () => performance.now(),
  schedule = (fn, ms) => setTimeout(fn, ms),
  unschedule = (id) => clearTimeout(id),
  present = async () => {},
} = {}) {
  const jobs = new Map();
  let disposed = false;
  function cancel(key) {
    const job = jobs.get(key);
    if (!job) return;
    jobs.delete(key);
    job.controller.abort();
    unschedule(job.tick);
    job.state[job.flag] = false;
  }
  async function run(
    key,
    state,
    task,
    { minimum = 1500, flag = 'busy', errorMessage = (e) => e.message } = {},
  ) {
    if (disposed || jobs.has(key)) return;
    const controller = new AbortController();
    const job = { controller, state, flag, tick: null };
    jobs.set(key, job);
    const active = () => !disposed && jobs.get(key) === job;
    state[flag] = true;
    state.error = '';
    state.elapsed = 0;
    const requestedAt = now();
    const tick = () => {
      if (!active()) return;
      state.elapsed = Math.floor((now() - requestedAt) / 1000);
      job.tick = schedule(tick, 1000);
    };
    job.tick = schedule(tick, 1000);
    const presented = Promise.resolve(present(controller.signal)).then(() => now());
    try {
      let result;
      let failure;
      try {
        result = await task(controller.signal);
      } catch (error) {
        failure = error;
      }
      const visibleAt = await presented;
      if (!active()) return;
      const remaining = Math.max(0, minimum - (now() - visibleAt));
      if (remaining)
        await new Promise((resolve) => {
          const finish = () => {
            unschedule(timer);
            controller.signal.removeEventListener('abort', finish);
            resolve();
          };
          const timer = schedule(finish, remaining);
          controller.signal.addEventListener('abort', finish, { once: true });
        });
      if (!active()) return;
      if (failure) state.error = errorMessage(failure);
      else state.result = result;
      state.loaded = true;
    } finally {
      unschedule(job.tick);
      if (active()) {
        state[flag] = false;
        jobs.delete(key);
      }
    }
  }
  return {
    run,
    cancel,
    dispose() {
      disposed = true;
      [...jobs.keys()].forEach(cancel);
    },
  };
}
