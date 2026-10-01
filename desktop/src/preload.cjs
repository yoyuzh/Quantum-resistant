'use strict';
const { contextBridge, ipcRenderer } = require('electron');
const prefix = '--quantum-origin=';
const origin = process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length);
if (window.location.origin === origin && window.top === window) {
  contextBridge.exposeInMainWorld('quantumDesktop', Object.freeze({
    readTheme: () => ipcRenderer.sendSync('quantum:read-theme'),
    saveTheme: (value) => {
      if (value !== 'light' && value !== 'dark') return Promise.reject(new Error('主题设置无效'));
      return ipcRenderer.invoke('quantum:theme', value);
    },
  }));
}
