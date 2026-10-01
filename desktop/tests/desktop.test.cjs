'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { PassThrough } = require('node:stream');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { BackendProcess } = require('../src/backend.cjs');
const { localURL, externalURL, requestHeaders, trustedFrame } = require('../src/policy.cjs');
const { readTheme, saveTheme } = require('../src/preferences.cjs');

test('capability only reaches exact local origin; external protocols and deceptive domains rejected', () => {
  const origin = 'http://127.0.0.1:18321';
  for (const url of ['http://127.0.0.1:18322/', 'http://127.0.0.1.evil:18321/', 'file:///tmp/a', 'https://127.0.0.1:18321/', 'http://user@127.0.0.1:18321/', `blob:${origin}/report`]) {
    assert.equal(localURL(url, origin), false);
    assert.deepEqual(requestHeaders({ 'x-quantum-desktop-token': 'old' }, url, origin, 'secret'), {});
  }
  assert.equal(requestHeaders({}, origin + '/api/config', origin, 'secret')['X-Quantum-Desktop-Token'], 'secret');
  assert.equal(externalURL('https://csrc.nist.gov/pubs/fips/203/final'), true);
  for (const url of ['javascript:alert(1)', 'file:///tmp/a', 'https://csrc.nist.gov.evil/', 'https://user@csrc.nist.gov/', 'https://csrc.nist.gov:444/']) assert.equal(externalURL(url), false);
});
test('theme IPC trusts only main frame of the expected window and origin', () => {
  const contents = { mainFrame: { url: 'http://127.0.0.1:1234/' } };
  assert.equal(trustedFrame({ sender: contents, senderFrame: contents.mainFrame }, contents, 'http://127.0.0.1:1234'), true);
  assert.equal(trustedFrame({ sender: {}, senderFrame: contents.mainFrame }, contents, 'http://127.0.0.1:1234'), false);
  assert.equal(trustedFrame({ sender: contents, senderFrame: { url: contents.mainFrame.url } }, contents, 'http://127.0.0.1:1234'), false);
});
test('preload exposes only theme access on the main local page and rereads persisted theme after reload', async () => {
  const origin = 'http://127.0.0.1:1234';
  const source = fs.readFileSync(path.join(__dirname, '../src/preload.cjs'), 'utf8');
  let theme = 'light';
  let bridge;
  const electron = {
    contextBridge: { exposeInMainWorld: (name, value) => { assert.equal(name, 'quantumDesktop'); bridge = value; } },
    ipcRenderer: {
      sendSync: (channel) => { assert.equal(channel, 'quantum:read-theme'); return theme; },
      invoke: async (channel, value) => { assert.equal(channel, 'quantum:theme'); theme = value; },
    },
  };
  function load(pageOrigin, child = false) {
    bridge = undefined;
    const window = { location: { origin: pageOrigin } };
    window.top = child ? {} : window;
    vm.runInNewContext(source, { require: () => electron, window, process: { argv: [`--quantum-origin=${origin}`] } });
  }
  load(origin);
  assert.deepEqual(Object.keys(bridge).sort(), ['readTheme', 'saveTheme']);
  assert.equal(bridge.readTheme(), 'light');
  await bridge.saveTheme('dark');
  load(origin);
  assert.equal(bridge.readTheme(), 'dark');
  await assert.rejects(bridge.saveTheme('../file'));
  load('https://evil.example');
  assert.equal(bridge, undefined);
  load(origin, true);
  assert.equal(bridge, undefined);
});
test('preferences validate values, tolerate corruption and replace atomically', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'quantum-prefs-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  assert.equal(readTheme(root), 'light');
  saveTheme(root, 'dark');
  assert.equal(readTheme(root), 'dark');
  assert.throws(() => saveTheme(root, '../secret'));
  fs.writeFileSync(path.join(root, 'preferences.json'), '{');
  assert.equal(readTheme(root), 'light');
});
function fakeProcess() {
  const child = new EventEmitter();
  child.pid = 42; child.exitCode = null; child.signalCode = null;
  child.stdin = new PassThrough(); child.stdout = new PassThrough(); child.stderr = new PassThrough();
  child.kill = () => { child.exitCode = 0; child.emit('close', 0); };
  return child;
}
test('backend startup uses pipes, status roundtrip and cleanup without secret arguments', async () => {
  const child = fakeProcess();
  let options;
  const backend = new BackendProcess('python', ['-B', 'entry.py'], { dataRoot: '/data', cacheRoot: '/cache',
    spawnProcess: (_command, args, value) => { options = value; assert(!args.includes(backend.token)); return child; } });
  let initialization;
  child.stdin.once('data', (chunk) => { initialization = JSON.parse(chunk); });
  const started = backend.start();
  child.stdout.write('{"event":"ready","port":1234,"pid":42}\n');
  assert.equal(await started, 'http://127.0.0.1:1234');
  assert.equal(initialization.token.length, 64);
  assert.equal(options.windowsHide, true);
  assert.equal(options.shell, false);
  const status = backend.active();
  child.stdout.write('{"event":"status","id":1,"active":2}\n');
  assert.equal(await status, 2);
  child.stdin.once('data', () => child.kill());
  await backend.stop();
  assert.equal(child.exitCode, 0);
});
test('backend startup rejects timeout, invalid readiness and missing binary', async () => {
  const stalled = fakeProcess();
  const backend = new BackendProcess('missing', [], { timeout: 5, spawnProcess: () => stalled });
  await assert.rejects(backend.start(), /超时/);
  stalled.kill();
  const invalid = fakeProcess();
  const bad = new BackendProcess('x', [], { spawnProcess: () => invalid });
  const result = bad.start();
  invalid.stdout.write('{"event":"ready","port":1234,"pid":0}\n');
  await assert.rejects(result, /无效/);
  invalid.kill();
  const absent = new BackendProcess('x', [], { spawnProcess: () => { throw new Error('ENOENT'); } });
  await assert.rejects(absent.start(), /无法启动/);
});
