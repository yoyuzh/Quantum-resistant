import test from 'node:test';
import assert from 'node:assert/strict';
import { request } from '../src/api/client.js';

test('API handles valid JSON, error messages and malformed responses', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('{"ok":true}'));
  assert.deepEqual(await request('/test'), { ok: true });
  globalThis.fetch = async () => new Response('{"detail":"扫描超时"}', { status: 504 });
  await assert.rejects(request('/test'), /扫描超时/);
  globalThis.fetch = async () => new Response('<html>Error</html>', { status: 502 });
  await assert.rejects(request('/test'), /无效数据/);
  globalThis.fetch = async () => new Response('# report');
  assert.equal(await request('/test', { text: true }), '# report');
});

test('API timeout aborts the pending request', async (t) => {
  t.mock.method(
    globalThis,
    'fetch',
    (_, options) =>
      new Promise((resolve, reject) => {
        options.signal.addEventListener('abort', () => reject(new Error('aborted')));
      }),
  );
  await assert.rejects(request('/test', { timeout: 5 }), /请求超时/);
});

test('API submits actual FormData without a JSON content type', async (t) => {
  let options;
  t.mock.method(globalThis, 'fetch', async (_, value) => {
    options = value;
    return new Response('{"ok":true}');
  });
  const body = new FormData();
  body.append('files', new Blob(['x=1']), 'a.py');
  await request('/test', { method: 'POST', body });
  assert.equal(options.body, body);
  assert.equal(options.headers, undefined);
});

test('malformed successful scan and ranking payloads remain recoverable errors', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('null'));
  await assert.rejects(request('/api/scan/snippet'), /结果格式不完整/);
  await assert.rejects(request('/api/popular/results'), /结果格式不完整/);
  globalThis.fetch = async () => new Response('null', { status: 502 });
  await assert.rejects(request('/api/scan/snippet'), /服务请求失败/);
});
