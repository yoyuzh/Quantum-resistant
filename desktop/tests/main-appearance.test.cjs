'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { EventEmitter } = require('node:events');
const { PALETTES } = require('../src/appearance.cjs');

async function startMain(initial) {
  const windows = [];
  const events = [];
  const handlers = {};
  const listeners = {};
  let saved = initial;
  let theme;
  let finish;
  const shown = new Promise(resolve => { finish = resolve; });
  class Window extends EventEmitter {
    constructor(options) {
      super(); this.options = options; windows.push(this); events.push('create');
      this.webContents = Object.assign(new EventEmitter(), {
        mainFrame: { url: '' }, setWindowOpenHandler: () => {},
      });
    }
    async loadURL(url) { this.webContents.mainFrame.url = url; }
    removeMenu() {}
    show() { if (windows.length === 2) finish(); }
    destroy() { this.destroyed = true; }
    isDestroyed() { return !!this.destroyed; }
    setAutoHideMenuBar() {}
    setMenuBarVisibility() {}
    setBackgroundColor(value) { this.background = value; }
    setTitleBarOverlay(value) { this.overlay = value; }
  }
  class Backend extends EventEmitter {
    async start() { this.origin = 'http://127.0.0.1:1234'; return this.origin; }
    async stop() {}
  }
  const app = Object.assign(new EventEmitter(), {
    isPackaged: false, setName: () => {}, getPath: () => '/profile', setPath: () => {},
    requestSingleInstanceLock: () => true, whenReady: () => Promise.resolve(), quit: () => {},
  });
  const electron = {
    app, BrowserWindow: Window,
    nativeTheme: { get themeSource() { return theme; },
      set themeSource(value) { theme = value; events.push('theme'); } },
    protocol: { registerSchemesAsPrivileged: () => {}, handle: () => {} },
    session: { fromPartition: () => ({ setPermissionRequestHandler: () => {}, setPermissionCheckHandler: () => {},
      webRequest: { onBeforeRequest: () => {}, onBeforeSendHeaders: () => {} }, on: () => {} }) },
    Menu: { buildFromTemplate: () => ({ popup: () => {} }), setApplicationMenu: () => {} },
    ipcMain: { handle: (name, handler) => { handlers[name] = handler; },
      on: (name, listener) => { listeners[name] = listener; } },
    dialog: { showMessageBox: async () => { throw new Error('Unexpected startup failure'); } }, shell: {},
  };
  const source = fs.readFileSync(path.join(__dirname, '../src/main.cjs'), 'utf8');
  vm.runInNewContext(source, {
    __dirname: path.join(__dirname, '../src'), Response,
    process: { platform: 'win32', env: {}, resourcesPath: '/resources' },
    require: (name) => {
      if (name === 'electron') return electron;
      if (name === 'node:fs') return { mkdirSync: () => {}, existsSync: () => false, appendFileSync: () => {} };
      if (name === './backend.cjs') return { BackendProcess: Backend };
      if (name === './preferences.cjs') return { readTheme: () => saved, saveTheme: (_root, value) => { saved = value; } };
      if (name.startsWith('./')) return require(path.join(__dirname, '../src', name));
      return require(name);
    },
  });
  await shown;
  return { windows, handlers, listeners, events, currentTheme: () => theme, saved: () => saved };
}

test('main initializes theme before either hidden window and synchronizes validated IPC after startup', { timeout: 2000 }, async () => {
  for (const initial of ['dark', 'light']) {
    const h = await startMain(initial);
    assert.equal(h.events[0], 'theme');
    for (const window of h.windows) {
      assert.equal(window.options.show, false);
      assert.equal(window.options.backgroundColor, PALETTES[initial].root);
      assert.equal(window.options.titleBarOverlay.color, PALETTES[initial].surface);
    }
    const window = h.windows[1];
    const event = { sender: window.webContents, senderFrame: window.webContents.mainFrame };
    const next = initial === 'dark' ? 'light' : 'dark';
    h.handlers['quantum:theme'](event, next);
    assert.equal(h.currentTheme(), next);
    assert.equal(window.overlay.color, PALETTES[next].surface);
    assert.equal(window.background, PALETTES[next].root);
    assert.equal(h.saved(), next);
    h.listeners['quantum:read-theme'](event);
    assert.equal(event.returnValue, next);
    assert.throws(() => h.handlers['quantum:theme']({ sender: {} }, initial));
    assert.throws(() => h.handlers['quantum:theme'](event, '../invalid'));
    assert.equal(h.currentTheme(), next);
  }
});
