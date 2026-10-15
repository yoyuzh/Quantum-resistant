'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { PALETTES, TITLE_BAR_HEIGHT, windowAppearance, applyAppearance, startupPage } = require('../src/appearance.cjs');
const { installApplicationMenu } = require('../src/application-menu.cjs');

test('main and startup windows keep a compact native caption in both themes', () => {
  assert.equal(TITLE_BAR_HEIGHT, 36);
  for (const theme of ['light', 'dark']) {
    for (const platform of ['win32', 'linux']) {
      const options = windowAppearance(theme, platform);
      assert.equal(options.titleBarStyle, 'hidden');
      assert.equal(options.titleBarOverlay.color, PALETTES[theme].surface);
      assert.equal(options.titleBarOverlay.height, TITLE_BAR_HEIGHT);
      assert.match(startupPage(theme, platform), /height:36px/);
      assert.match(startupPage(theme, platform), new RegExp(`color-scheme:${theme}`));
    }
    assert.equal(windowAppearance(theme, 'darwin').titleBarStyle, undefined);
    assert.match(startupPage(theme, 'darwin'), /height:0px/);
  }
  assert.throws(() => windowAppearance('invalid', 'win32'));
});

test('theme changes preserve caption height, ignoring destroyed windows', () => {
  const native = {};
  const changes = [];
  const window = { isDestroyed: () => false, setBackgroundColor: c => changes.push(c),
    setTitleBarOverlay: o => changes.push(o) };
  applyAppearance(native, [null, { isDestroyed: () => true }, window], 'dark', 'win32');
  assert.equal(native.themeSource, 'dark');
  assert.equal(changes[0], PALETTES.dark.root);
  assert.equal(changes[1].color, PALETTES.dark.surface);
  assert.equal(changes[1].height, TITLE_BAR_HEIGHT);
  applyAppearance(native, [window], 'light', 'darwin');
  assert.equal(native.themeSource, 'light');
  assert.equal(changes.at(-1), PALETTES.light.root);
});

function menuHarness(platform = 'win32') {
  const events = {};
  const visibility = [];
  let template;
  let installed;
  let exits = 0;
  const menu = {};
  const window = { webContents: { on: (name, handler) => { events[name] = handler; } },
    setAutoHideMenuBar: v => visibility.push(['auto', v]),
    setMenuBarVisibility: v => visibility.push(['visible', v]) };
  installApplicationMenu({ platform, window, quit: () => exits++, app: { name: 'scanner' },
    Menu: { buildFromTemplate: t => { template = t; return menu; }, setApplicationMenu: m => { installed = m; } },
  });
  return { events, template, visibility, installed, exits: () => exits };
}

test('hidden native menu preserves editing, zoom, reload and exit accelerators', () => {
  const h = menuHarness();
  assert.deepEqual(h.installed, {});
  assert.deepEqual(h.visibility, [['auto', false], ['visible', false]]);
  assert(h.template[1].submenu.some(item => item.role === 'paste'));
  assert(h.template[2].submenu.some(item => item.role === 'zoomIn'));
  assert(h.template[2].submenu.some(item => item.role === 'reload'));
  h.template[0].submenu[0].click();
  assert.equal(h.exits(), 1);
});

test('Windows/Linux cannot reveal a menu with F10 or Alt; OS shortcuts and macOS stay native', () => {
  for (const platform of ['win32', 'linux']) {
    const h = menuHarness(platform);
    let prevented = 0;
    const event = { preventDefault: () => prevented++ };
    for (const input of [{ key: 'F10', type: 'keyDown' }, { key: 'F10', type: 'keyUp' }, { key: 'Alt', type: 'keyUp' }]) {
      h.events['before-input-event'](event, input);
    }
    assert.equal(prevented, 3);
    for (const input of [{ key: 'F4', alt: true }, { key: 'c', control: true }, { key: 'F10', shift: true }]) {
      h.events['before-input-event'](event, { ...input, type: 'keyDown' });
    }
    assert.equal(prevented, 3);
  }
  const mac = menuHarness('darwin');
  mac.events['before-input-event']({ preventDefault: () => assert.fail('macOS input must stay native') }, { key: 'F10' });
  assert.deepEqual(mac.visibility, []);
  assert.equal(mac.template[0].label, 'scanner');
});
