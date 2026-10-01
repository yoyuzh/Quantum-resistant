'use strict';
const { app, BrowserWindow, session, dialog, shell, Menu, ipcMain, protocol } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const { BackendProcess } = require('./backend.cjs');
const { localURL, externalURL, requestHeaders, trustedFrame, validTheme } = require('./policy.cjs');
const { readTheme, saveTheme } = require('./preferences.cjs');

app.setName('Quantum Resistant Scanner');
if (!app.isPackaged && process.env.QUANTUM_DESKTOP_DATA_DIR) {
  const root = path.resolve(process.env.QUANTUM_DESKTOP_DATA_DIR);
  fs.mkdirSync(root, { recursive: true, mode: 0o700 });
  app.setPath('userData', root);
}
protocol.registerSchemesAsPrivileged([{ scheme: 'quantum', privileges: { standard: true, secure: true } }]);
let window;
let splash;
let backend;
let quitting = false;
let closing = false;
let downloads = 0;
let dataRoot;
function log(message) {
  try {
    const file = path.join(dataRoot, 'logs', 'desktop.log');
    if (fs.existsSync(file) && fs.statSync(file).size > 1024 * 1024) {
      for (let index = 2; index >= 0; index--) {
        const source = index ? `${file}.${index}` : file;
        const target = `${file}.${index + 1}`;
        if (fs.existsSync(target)) fs.unlinkSync(target);
        if (fs.existsSync(source)) fs.renameSync(source, target);
      }
    }
    const stamp = new Date(Date.now() + 8 * 3600000).toISOString().replace('Z', '+08:00');
    fs.appendFileSync(file, `${stamp} ${message}\n`, { mode: 0o600 });
  } catch { /* A failed log must not prevent cleanup. */ }
}
async function quit() {
  if (quitting || closing) return;
  closing = true;
  const active = backend?.origin ? await backend.active() : 0;
  if (window && !window.isDestroyed() && (active === null || active > 0 || downloads > 0)) {
    const { response } = await dialog.showMessageBox(window, {
      type: 'question', title: '退出扫描平台', buttons: ['继续使用', '取消任务并退出'],
      defaultId: 0, cancelId: 0,
      message: '扫描、保存或服务状态查询尚未完成。',
      detail: '退出将取消进行中的任务，未导出的扫描结果会丢失。',
    });
    if (response !== 1) { closing = false; return; }
  }
  quitting = true;
  if (window && !window.isDestroyed()) window.hide();
  await backend?.stop();
  app.quit();
}
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const target = window || splash;
    if (!target || target.isDestroyed()) return;
    if (target.isMinimized()) target.restore();
    target.show(); target.focus();
  });
  app.on('before-quit', (event) => { if (!quitting) { event.preventDefault(); void quit(); } });
  app.on('window-all-closed', () => { if (!quitting) void quit(); });
  app.whenReady().then(start).catch(async () => {
    log('桌面应用启动失败');
    await dialog.showMessageBox({ type: 'error', title: '启动失败', message: '扫描平台无法启动。',
      detail: `请检查安装是否完整、用户目录是否可写。诊断日志位于：${dataRoot || app.getPath('userData')}。` });
    quitting = true;
    await backend?.stop();
    app.quit();
  });
}

async function start() {
  dataRoot = app.getPath('userData');
  fs.mkdirSync(path.join(dataRoot, 'logs'), { recursive: true, mode: 0o700 });
  protocol.handle('quantum', () => new Response(
    '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>正在启动扫描平台</title>' +
    '<style>body{font:16px system-ui;background:#f4f7fc;color:#213349;padding:52px}h1{font-size:24px}</style>' +
    '<h1>抗量子迁移风险扫描平台</h1><p>正在启动本地扫描服务…</p><p>本地扫描无需联网。</p></html>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'" } },
  ));
  splash = new BrowserWindow({ width: 620, height: 300, resizable: false, autoHideMenuBar: true,
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true, devTools: false } });
  splash.on('close', (event) => { if (!quitting) { event.preventDefault(); void quit(); } });
  await splash.loadURL('quantum://startup');
  const entry = app.isPackaged
    ? path.join(process.resourcesPath, 'backend', 'quantum-backend', process.platform === 'win32' ? 'quantum-backend.exe' : 'quantum-backend')
    : (process.env.QUANTUM_DESKTOP_BACKEND_ENTRY || path.join(__dirname, '..', 'backend_entry.py'));
  if (app.isPackaged && !fs.existsSync(entry)) throw new Error('扫描服务文件缺失');
  backend = new BackendProcess(app.isPackaged ? entry : (process.env.QUANTUM_DESKTOP_PYTHON || 'python'),
    app.isPackaged ? [] : ['-B', entry], { dataRoot, cacheRoot: path.join(dataRoot, 'cache'), log });
  backend.on('exit', async (expected) => {
    if (expected || quitting || !window || window.isDestroyed()) return;
    log('扫描后端意外退出');
    await dialog.showMessageBox(window, { type: 'error', title: '扫描服务已停止',
      message: '本地扫描服务意外退出，请重新启动应用。', detail: '未导出的任务结果无法恢复。' });
    quitting = true; app.quit();
  });
  const origin = await backend.start();
  if (quitting) return;
  const isolated = session.fromPartition('quantum-scanner');
  isolated.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
  isolated.setPermissionCheckHandler(() => false);
  isolated.webRequest.onBeforeRequest((details, callback) => {
    callback({ cancel: !localURL(details.url, origin) && !details.url.startsWith(`blob:${origin}/`) });
  });
  isolated.webRequest.onBeforeSendHeaders((details, callback) => {
    callback({ requestHeaders: requestHeaders(details.requestHeaders, details.url, origin, backend.token) });
  });
  isolated.on('will-download', (event, item, contents) => {
    if (contents !== window?.webContents || item.getInitiatorOrigin() !== origin ||
        !item.getURL().startsWith(`blob:${origin}/`) || !item.hasUserGesture()) {
      event.preventDefault(); return;
    }
    const filename = path.basename(item.getFilename());
    const extension = path.extname(filename).slice(1).toLowerCase();
    if (!['html', 'md', 'json', 'csv'].includes(extension)) { event.preventDefault(); return; }
    downloads++;
    item.setSaveDialogOptions({ title: '保存扫描报告', defaultPath: path.join(app.getPath('downloads'), filename),
      filters: [{ name: '扫描报告', extensions: [extension] }] });
    item.once('done', async (_event, state) => {
      downloads--;
      if (!window || window.isDestroyed() || quitting) return;
      await dialog.showMessageBox(window, { type: state === 'interrupted' ? 'error' : 'info', title: '报告保存',
        message: state === 'completed' ? '报告已保存。' : state === 'cancelled' ? '已取消保存，报告仍可再次下载。' : '报告保存失败，请重新选择保存位置。' });
    });
  });
  window = new BrowserWindow({ width: 1440, height: 960, minWidth: 900, minHeight: 600, show: false,
    title: '抗量子迁移风险扫描平台 · 测试版', icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: { session: isolated, preload: path.join(__dirname, 'preload.cjs'),
      additionalArguments: [`--quantum-origin=${origin}`],
      nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true,
      allowRunningInsecureContent: false, devTools: !app.isPackaged } });
  window.on('page-title-updated', (event) => event.preventDefault());
  window.on('close', (event) => { if (!quitting) { event.preventDefault(); void quit(); } });
  window.webContents.on('will-attach-webview', (event) => event.preventDefault());
  window.webContents.on('will-navigate', (event, value) => {
    if (!localURL(value, origin)) { event.preventDefault(); if (externalURL(value)) void shell.openExternal(value); }
  });
  window.webContents.on('will-redirect', (event, value) => { if (!localURL(value, origin)) event.preventDefault(); });
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (externalURL(url)) void shell.openExternal(url);
    return { action: 'deny' };
  });
  window.webContents.on('render-process-gone', () => { log('窗口渲染进程退出'); void quit(); });
  ipcMain.handle('quantum:theme', (event, value) => {
    if (!trustedFrame(event, window.webContents, origin) || !validTheme(value)) throw new Error('主题请求无效');
    saveTheme(dataRoot, value);
  });
  ipcMain.on('quantum:read-theme', (event) => {
    event.returnValue = trustedFrame(event, window.webContents, origin) ? readTheme(dataRoot) : null;
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    ...(process.platform === 'darwin' ? [{ label: app.name, submenu: [{ label: '退出', accelerator: 'Cmd+Q', click: () => void quit() }] }] : []),
    { label: '文件', submenu: [{ label: '退出', accelerator: 'Alt+F4', click: () => void quit() }] },
    { label: '编辑', submenu: [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' },
      { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }] },
    { label: '视图', submenu: [{ role: 'reload' }, { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }] },
  ]));
  await window.loadURL(`${origin}/`);
  splash.destroy(); splash = null;
  window.show();
  log('桌面扫描窗口已启动');
}
