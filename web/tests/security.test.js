import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequestId } from '../src/utils/requestId.js';
import { ApiError, parseResponse } from '../src/api/errors.js';
import { uploadRequest } from '../src/api/upload.js';

test('request identities work with UUID and insecure-context random values', () => {
  assert.equal(createRequestId({ randomUUID: () => 'native' }), 'native');
  const fallback = createRequestId({ getRandomValues: (bytes) => bytes.fill(255) });
  assert.match(fallback, /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);
  assert.throws(() => createRequestId({}), /安全请求标识/);
});

test('shared response parser sanitizes invalid error details and preserves status', () => {
  assert.deepEqual(parseResponse('{"ok":true}', 200), { ok: true });
  assert.equal(parseResponse('report', 200, { text: true }), 'report');
  assert.throws(() => parseResponse('{"detail":{"private":"data"}}', 413), (error) =>
    error instanceof ApiError && error.status === 413 && !error.message.includes('private'));
  assert.throws(() => parseResponse('invalid', 502), (error) => error.status === 502);
});

test('XHR shares errors and removes event handlers after completion', async () => {
  const previous = globalThis.XMLHttpRequest;
  let instance;
  globalThis.XMLHttpRequest = class {
    constructor() { instance = this; this.upload = {}; }
    open() {}
    send() {}
    abort() { this.onabort?.(); }
  };
  try {
    const promise = uploadRequest('/api/tasks/files', { body: {}, signal: new AbortController().signal });
    instance.status = 413;
    instance.responseText = '{"detail":{"unexpected":"object"}}';
    instance.onload();
    await assert.rejects(promise, (error) => error.status === 413 && !error.message.includes('[object'));
    assert.equal(instance.onload, null);
    assert.equal(instance.upload.onprogress, null);
  } finally {
    globalThis.XMLHttpRequest = previous;
  }
});
