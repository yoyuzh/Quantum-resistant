import test from 'node:test';
import assert from 'node:assert/strict';
import { followTask, abortableDelay } from '../src/utils/remoteTasks.js';
import { selectedFindings } from '../src/utils/analysis.js';

function options(extra = {}) {
  return {
    kind: 'github',
    body: { repository_url: 'fixture' },
    signal: new AbortController().signal,
    requestId: 'same-id',
    delay: async () => {},
    ...extra,
  };
}

test('lost submission response retries with the same identity, then retrieves partial result', async () => {
  const keys = [],
    phases = [];
  let submitted = 0;
  const outcome = await followTask(
    options({
      onProgress: (value) => phases.push(value.state),
      request: async (url, args) => {
        if (url === '/api/tasks/github') {
          keys.push(args.headers['X-Request-ID']);
          if (++submitted === 1) throw new Error('lost reply');
          return { id: 'one' };
        }
        if (url.endsWith('/result')) return { findings: [] };
        return { state: 'partial', has_result: true };
      },
    }),
  );
  assert.deepEqual(keys, ['same-id', 'same-id']);
  assert.deepEqual(phases, ['partial']);
  assert.deepEqual(outcome.result, { findings: [] });
});

test('resume polls sequentially, reconnects with bounded backoff, never resubmits', async () => {
  const urls = [],
    waits = [];
  let calls = 0;
  await followTask(
    options({
      id: 'saved',
      delay: async (ms) => waits.push(ms),
      request: async (url) => {
        urls.push(url);
        if (++calls <= 4) throw new Error('offline');
        if (url.endsWith('/result')) return { sources: [] };
        return { state: 'succeeded', has_result: true };
      },
    }),
  );
  assert.deepEqual(waits, [1000, 2000, 4000, 5000]);
  assert.ok(urls.every((url) => url.startsWith('/api/tasks/saved')));
});

test('expired jobs and failed jobs stop without replacing an earlier result', async () => {
  await assert.rejects(
    followTask(
      options({
        id: 'expired',
        request: async () => {
          throw Object.assign(new Error('expired'), { status: 404 });
        },
      }),
    ),
    /expired/,
  );
  await assert.rejects(
    followTask(
      options({
        id: 'failed',
        request: async () => ({ state: 'failed', error: 'network timeout', has_result: false }),
      }),
    ),
    /network timeout/,
  );
});

test('unmount cancels timer and prevents later polls', async () => {
  const controller = new AbortController();
  const pending = abortableDelay(10000, controller.signal);
  controller.abort();
  await assert.rejects(pending, /停止/);
  let calls = 0;
  await assert.rejects(
    followTask(
      options({
        id: 'active',
        signal: new AbortController().signal,
        request: async () => {
          calls++;
          return { state: 'running' };
        },
        delay: async () => {
          throw new Error('unmounted');
        },
      }),
    ),
    /unmounted/,
  );
  assert.equal(calls, 1);
});

test('queue-full is not resubmitted automatically', async () => {
  let calls = 0;
  await assert.rejects(
    followTask(
      options({
        request: async () => {
          calls++;
          throw Object.assign(new Error('full'), { status: 429 });
        },
      }),
    ),
    /full/,
  );
  assert.equal(calls, 1);
});

test('method filter combines with file identity and treats missing metadata as unknown', () => {
  const findings = [
    { source_id: 'a', algorithm: 'RSA', detection_method: 'ast_call' },
    { source_id: 'b', algorithm: 'RSA' },
  ];
  assert.deepEqual(selectedFindings({ findings }, { method: 'unknown' }), [findings[1]]);
  assert.deepEqual(selectedFindings({ findings }, { method: 'ast_call', sourceId: 'b' }), []);
});
