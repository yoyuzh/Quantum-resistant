'use strict';

// Matches the surface/root/text tokens in web/src/styles/theme.css.
const PALETTES = Object.freeze({
  light: Object.freeze({ root: '#f2f5f8', surface: '#ffffff', text: '#1a2532' }),
  dark: Object.freeze({ root: '#0a0f16', surface: '#131c26', text: '#e3ecf4' }),
});
const TITLE_BAR_HEIGHT = 36;
function windowAppearance(theme, platform) {
  const colors = PALETTES[theme];
  if (!colors) throw new Error('主题设置无效');
  return {
    backgroundColor: colors.root,
    ...(platform === 'darwin' ? {} : {
      titleBarStyle: 'hidden',
      titleBarOverlay: { color: colors.surface, symbolColor: colors.text, height: TITLE_BAR_HEIGHT },
    }),
  };
}
function applyAppearance(nativeTheme, windows, theme, platform) {
  const options = windowAppearance(theme, platform);
  nativeTheme.themeSource = theme;
  for (const window of windows) {
    if (!window || window.isDestroyed()) continue;
    window.setBackgroundColor(options.backgroundColor);
    if (platform !== 'darwin') window.setTitleBarOverlay(options.titleBarOverlay);
  }
}
function startupPage(theme, platform) {
  const colors = PALETTES[theme];
  const overlay = platform !== 'darwin';
  return '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>正在启动扫描平台</title>' +
    `<style>body{margin:0;font:16px/1.7 system-ui;background:${colors.root};color:${colors.text};color-scheme:${theme}}` +
    `.titlebar{height:${overlay ? TITLE_BAR_HEIGHT : 0}px;background:${colors.surface};app-region:drag}` +
    'main{padding:24px 40px}h1{font-size:21px}p{margin:8px 0}</style>' +
    '<div class="titlebar"></div><main><h1>抗量子密码风险检测与迁移辅助软件</h1>' +
    '<p>正在启动本地扫描服务…</p></main></html>';
}
module.exports = { PALETTES, TITLE_BAR_HEIGHT, windowAppearance, applyAppearance, startupPage };
