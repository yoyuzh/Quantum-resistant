'use strict';
const { trustedFrame } = require('./policy.cjs');

function installApplicationMenu({ app, Menu, ipcMain, window, origin, quit, platform }) {
  const menu = Menu.buildFromTemplate([
    ...(platform === 'darwin' ? [{ label: app.name,
      submenu: [{ label: '退出', accelerator: 'Cmd+Q', click: () => void quit() }] }] : []),
    { label: '文件', submenu: [{ label: '退出', accelerator: 'Alt+F4', click: () => void quit() }] },
    { label: '编辑', submenu: [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' },
      { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }] },
    { label: '视图', submenu: [{ role: 'reload' }, { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }] },
  ]);
  Menu.setApplicationMenu(menu);
  if (platform !== 'darwin') {
    window.setAutoHideMenuBar(false);
    window.setMenuBarVisibility(false);
  }
  const open = (callback) => menu.popup({ window, x: 16, y: 68, callback });
  ipcMain.handle('quantum:menu', (event) => {
    if (!trustedFrame(event, window.webContents, origin) || platform === 'darwin') {
      throw new Error('菜单请求无效');
    }
    return new Promise((resolve) => open(() => resolve()));
  });
  window.webContents.on('before-input-event', (event, input) => {
    if (platform === 'darwin') return;
    if (input.key === 'F10' && input.type === 'keyDown' && !input.shift && !input.control && !input.alt) {
      event.preventDefault();
      open();
    }
    // Keep a lone Alt from revealing an unthemed native menu strip.
    if (input.key === 'Alt') event.preventDefault();
  });
  return menu;
}
module.exports = { installApplicationMenu };
