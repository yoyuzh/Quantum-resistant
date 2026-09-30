import test from 'node:test';
import assert from 'node:assert/strict';
import { createTaskRunner } from '../src/utils/tasks.js';

const flush = async () => {
  for (let i = 0; i < 12; i++) await Promise.resolve();
};
function harness() {
  let time = 0;
  let sequence = 0;
  const pending = new Map();
  const runner = createTaskRunner({
    now: () => time,
    schedule: (fn, ms) => {
      const id = ++sequence;
      pending.set(id, { fn, at: time + ms });
      return id;
    },
    unschedule: (id) => pending.delete(id),
  });
  async function advance(ms) {
    const target = time + ms;
    while (true) {
      const next = [...pending]
        .filter(([, value]) => value.at <= target)
        .sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      time = next[1].at;
      pending.delete(next[0]);
      next[1].fn();
      await flush();
    }
    time = target;
    await flush();
  }
  return { runner, pending, advance };
}
const state = () => ({ result: 'old', error: '', busy: false, elapsed: 0 });

test('quick success and failure remain visible for 1500ms and keep prior result on error', async () => {
  for (const fail of [false, true]) {
    const h = harness();
    const s = state();
    const run = h.runner.run('snippet', s, async () => {
      if (fail) throw Error('failure');
      return 'new';
    });
    assert.equal(s.busy, true);
    await flush();
    await h.advance(1499);
    assert.equal(s.busy, true);
    assert.equal(s.result, 'old');
    await h.advance(1);
    await run;
    assert.equal(s.busy, false);
    assert.equal(s.result, fail ? 'old' : 'new');
    assert.equal(s.error, fail ? 'failure' : '');
    assert.equal(h.pending.size, 0);
  }
});
test('slow request has no extra delay; non-scan reads can bypass minimum', async () => {
  const h = harness();
  const s = state();
  let resolve;
  const run = h.runner.run(
    'slow',
    s,
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  await flush();
  await h.advance(2400);
  assert.equal(s.elapsed, 2);
  resolve('done');
  await run;
  assert.equal(s.busy, false);
  const read = state();
  await h.runner.run('read', read, async () => 'cached', { minimum: 0, flag: 'loading' });
  assert.equal(read.loading, false);
  assert.equal(read.result, 'cached');
});
test('independent modes retain their results and duplicate submissions do not start work', async () => {
  const h = harness();
  const a = state(),
    b = state();
  let calls = 0;
  const one = h.runner.run('snippet', a, async () => {
    calls++;
    return 'A';
  });
  await h.runner.run('snippet', a, async () => {
    calls++;
    return 'incorrect';
  });
  const two = h.runner.run('github', b, async () => 'B');
  await flush();
  await h.advance(1500);
  await Promise.all([one, two]);
  assert.equal(calls, 1);
  assert.equal(a.result, 'A');
  assert.equal(b.result, 'B');
});
test('unmount cancels presentation waits and does not overwrite saved state', async () => {
  const h = harness();
  const s = state();
  let signal;
  const run = h.runner.run('x', s, async (value) => {
    signal = value;
    return 'new';
  });
  await flush();
  h.runner.dispose();
  await run;
  assert.equal(signal.aborted, true);
  assert.equal(s.result, 'old');
  assert.equal(s.busy, false);
  assert.equal(h.pending.size, 0);
});
test('cancelled old response cannot replace a newer run', async () => {
  const h = harness();
  const s = state();
  let resolve;
  const old = h.runner.run(
    'x',
    s,
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  h.runner.cancel('x');
  const fresh = h.runner.run('x', s, async () => 'fresh');
  await flush();
  await h.advance(1500);
  await fresh;
  resolve('obsolete');
  await old;
  assert.equal(s.result, 'fresh');
  assert.equal(h.pending.size, 0);
});
