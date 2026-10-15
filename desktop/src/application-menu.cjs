'use strict';
function installApplicationMenu({ app, Menu, window, quit, platform }) {
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
  // Keep Electron's native editing/zoom accelerators, without exposing a menu
  // strip or a detached popup on Windows/Linux. macOS keeps its system menu.
  window.webContents.on('before-input-event', (event, input) => {
    if (platform === 'darwin') return;
    const menuKey = input.key === 'F10' && !input.shift && !input.control && !input.alt;
    if (input.key === 'Alt' || menuKey) event.preventDefault();
  });
  return menu;
}
module.exports = { installApplicationMenu };
