'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { validTheme } = require('./policy.cjs');

function readTheme(root) {
  try {
    const file = path.join(root, 'preferences.json');
    if (fs.statSync(file).size > 4096) return 'light';
    const value = JSON.parse(fs.readFileSync(file, 'utf8')).theme;
    return validTheme(value) ? value : 'light';
  } catch { return 'light'; }
}
function saveTheme(root, theme) {
  if (!validTheme(theme)) throw new Error('主题设置无效');
  const temporary = path.join(root, 'preferences.tmp');
  fs.writeFileSync(temporary, JSON.stringify({ theme }), { mode: 0o600 });
  fs.renameSync(temporary, path.join(root, 'preferences.json'));
}
module.exports = { readTheme, saveTheme };
