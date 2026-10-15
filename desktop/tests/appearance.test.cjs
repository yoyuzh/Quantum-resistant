'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { PALETTES, windowAppearance, applyAppearance, startupPage } = require('../src/appearance.cjs');
const { installApplicationMenu } = require('../src/application-menu.cjs');

test('window and startup appearance use persisted light/dark colors with native controls', () => {
  for (const theme of ['light', 'dark']) {
    const options = windowAppearance(theme, 'win32');
    assert.equal(options.titleBarStyle, 'hidden');
    assert.equal(options.titleBarOverlay.color, PALETTES[theme].surface);
    assert.equal(windowAppearance(theme, 'linux', 36).titleBarOverlay.height, 36);
    assert.match(startupPage(theme, 'win32'), new RegExp(PALETTES[theme].root));
    assert.match(startupPage(theme, 'win32'), new RegExp(`color-scheme:${theme}`));
    assert.equal(windowAppearance(theme, 'darwin').titleBarStyle, undefined);
  }
  assert.throws(() => windowAppearance('invalid', 'win32'));
});
test('theme changes update native UI and active windows, ignoring destroyed windows', () => {
  const native = {};
  const changes = [];
  const window = { isDestroyed: () => false, setBackgroundColor: c => changes.push(c),
    setTitleBarOverlay: o => changes.push(o.color) };
  applyAppearance(native, [null, { isDestroyed: () => true }, window], 'dark', 'win32');
  assert.equal(native.themeSource, 'dark');
  assert.deepEqual(changes, [PALETTES.dark.root, PALETTES.dark.surface]);
  applyAppearance(native, [window], 'light', 'darwin');
  assert.equal(native.themeSource, 'light');
  assert.equal(changes.at(-1), PALETTES.light.root);
});
function menuHarness(platform = 'win32') {
  const handlers = {};
  const events = {};
  const visibility = [];
  let template;
  let popups = 0;
  let exits = 0;
  const contents = { mainFrame: { url: 'http://127.0.0.1:1234/' },
    on: (name, handler) => { events[name] = handler; } };
  const menu = { popup: ({ callback }) => { popups++; callback?.(); } };
  const window = { webContents: contents, setAutoHideMenuBar: v => visibility.push(['auto', v]),
    setMenuBarVisibility: v => visibility.push(['visible', v]) };
  installApplicationMenu({ platform, window, origin: 'http://127.0.0.1:1234',
    quit: () => exits++, app: { name: 'scanner' },
    ipcMain: { handle: (name, handler) => { handlers[name] = handler; } },
    Menu: { buildFromTemplate: t => { template = t; return menu; }, setApplicationMenu: () => {} },
  });
  return { handlers, events, contents, template, visibility, popups: () => popups, exits: () => exits };
}
test('menu IPC permits only the current local main frame, preserving native menu commands', async () => {
  const h = menuHarness();
  const valid = { sender: h.contents, senderFrame: h.contents.mainFrame };
  await h.handlers['quantum:menu'](valid);
  assert.equal(h.popups(), 1);
  assert.throws(() => h.handlers['quantum:menu']({ ...valid, sender: {} }), /菜单请求无效/);
  assert.throws(() => h.handlers['quantum:menu']({ ...valid, senderFrame: { url: h.contents.mainFrame.url } }));
  assert.deepEqual(h.visibility, [['auto', false], ['visible', false]]);
  assert(h.template[1].submenu.some(item => item.role === 'paste'));
  assert(h.template[2].submenu.some(item => item.role === 'zoomIn'));
  h.template[0].submenu[0].click();
  assert.equal(h.exits(), 1);
});
test('F10 opens the compact menu, lone Alt cannot reveal a white strip, macOS stays native', () => {
  const h = menuHarness();
  let prevented = 0;
  const event = { preventDefault: () => prevented++ };
  h.events['before-input-event'](event, { key: 'F10', type: 'keyDown' });
  assert.equal(h.popups(), 1);
  h.events['before-input-event'](event, { key: 'Alt', type: 'keyUp' });
  h.events['before-input-event'](event, { key: 'F4', alt: true, type: 'keyDown' });
  assert.equal(prevented, 2);
  const mac = menuHarness('darwin');
  assert.deepEqual(mac.visibility, []);
  assert.throws(() => mac.handlers['quantum:menu']({ sender: mac.contents, senderFrame: mac.contents.mainFrame }));
});
