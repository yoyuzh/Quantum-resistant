import test from 'node:test';
import assert from 'node:assert/strict';
import { progressRows, elapsedSeconds } from '../src/utils/progress.js';
import { createSourceCache } from '../src/utils/sourceCache.js';
import { followTask } from '../src/utils/remoteTasks.js';
import { mergeFiles, configureLimits } from '../src/utils/files.js';
import { uploadRequest } from '../src/api/upload.js';

test('elapsed display uses whole seconds for server progress and safe defaults', () => {
  assert.equal(elapsedSeconds(34.3), 34);
  assert.equal(elapsedSeconds(41.9), 41);
  for (const value of [0, -1, undefined, null, NaN, Infinity]) assert.equal(elapsedSeconds(value), 0);
});

test('unknown totals never produce invented percentages; analysis waits for final denominator', () => {
  let rows = progressRows({ processed_files: 12, analyzed_files: 8, analysis_total: 10, totals_final: false });
  assert.ok(rows.every((row) => row.percent == null));
  rows = progressRows({ candidate_files: 20, processed_files: 12, analyzed_files: 8, analysis_total: 10, totals_final: true });
  assert.deepEqual(rows.map((row) => row.percent), [60, 80]);
  assert.equal(progressRows({ upload_bytes: 5, upload_total: 10 })[0].percent, 50);
  assert.equal(progressRows({ download_bytes: 5, download_total: null })[0].percent, null);
  assert.equal(progressRows({ processed_files: 0, candidate_files: 0 })[0].percent, null);
});

test('source cache shares in-flight requests, retains ten files and evicts oldest', async () => {
  const calls = [];
  const cache = createSourceCache(async (id) => { calls.push(id); return { content: id }; });
  await Promise.all([cache.load('same'), cache.load('same')]);
  assert.deepEqual(calls, ['same']);
  for (let i = 0; i < 10; i++) await cache.load(String(i));
  await cache.load('9');
  assert.equal(calls.length, 11);
  await cache.load('same');
  assert.equal(calls.length, 12);
  cache.clear();
  await cache.load('same');
  assert.equal(calls.length, 13);
});

test('source failures can retry and cleared pending responses cannot repopulate cache', async () => {
  let calls = 0;
  const cache = createSourceCache(async () => { if (++calls === 1) throw Error('expired'); return 'ok'; });
  await assert.rejects(cache.load('file'), /expired/);
  assert.equal(await cache.load('file'), 'ok');
  let resolve;
  const pendingCache = createSourceCache(() => new Promise((done) => { resolve = done; }));
  const previous = pendingCache.load('same');
  pendingCache.clear();
  resolve('old');
  await previous;
  const current = pendingCache.load('same');
  resolve('new');
  assert.equal(await current, 'new');
});

test('metadata-only task retrieval does not resubmit after resume', async () => {
  const calls = [];
  const result = await followTask({
    kind: 'files', id: 'resume', includeContent: false, signal: new AbortController().signal,
    request: async (url) => {
      calls.push(url);
      return url.includes('/result?') ? { sources: [] } : { state: 'succeeded', has_result: true };
    },
  });
  assert.deepEqual(calls, ['/api/tasks/resume', '/api/tasks/resume/result?include_content=false']);
  assert.deepEqual(result.result, { sources: [] });
});

test('5000 files accepted, 5001 rejected; configured limits drive validation', () => {
  const files = Array.from({ length: 5001 }, (_, i) => ({ name: `${i}.py`, size: 1 }));
  assert.equal(mergeFiles([], files).files.length, 5000);
  configureLimits({ max_files: 2, max_file_bytes: 100, max_text_bytes: 5, max_upload_bytes: 10000 });
  assert.equal(mergeFiles([], files).files.length, 2);
  assert.equal(mergeFiles([], [{ name: 'a.py', size: 4 }, { name: 'b.py', size: 4 }]).files.length, 1);
  configureLimits({ max_files: 5000, max_file_bytes: 2097152, max_text_bytes: 104857600, max_upload_bytes: 115343360 });
});

test('upload uses real byte events, request identity, and AbortSignal cleanup', async () => {
  let instance;
  class FakeXHR {
    constructor() { instance = this; this.upload = {}; this.headers = {}; }
    open() {}
    setRequestHeader(name, value) { this.headers[name] = value; }
    send() {}
    abort() { this.onabort(); }
  }
  globalThis.XMLHttpRequest = FakeXHR;
  try {
    const progress = [];
    const controller = new AbortController();
    const request = uploadRequest('/api/tasks/files', { body: {}, signal: controller.signal,
      headers: { 'X-Request-ID': 'upload' }, onProgress: (value) => progress.push(value) });
    instance.upload.onprogress({ loaded: 20, total: 100, lengthComputable: true });
    assert.equal(progress[0].upload_bytes, 20);
    assert.equal(progress[0].upload_total, 100);
    assert.equal(instance.headers['X-Request-ID'], 'upload');
    controller.abort();
    await assert.rejects(request, /取消/);
  } finally {
    delete globalThis.XMLHttpRequest;
  }
});
