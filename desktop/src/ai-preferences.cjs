'use strict';
const fs = require('node:fs');
const path = require('node:path');
const POLICY = 'redacted-evidence-3';
const fields = ['preset', 'base_url', 'model', 'consent', 'json_mode', 'output_parameter', 'reasoning_disabled'];

async function available(safeStorage) {
  try {
    const enabled = safeStorage.isAsyncEncryptionAvailable
      ? await safeStorage.isAsyncEncryptionAvailable() : safeStorage.isEncryptionAvailable();
    return enabled && !(process.platform === 'linux' && safeStorage.getSelectedStorageBackend() === 'basic_text');
  } catch { return false; }
}
async function readAiSettings(root, safeStorage) {
  try {
    const file = path.join(root, 'ai-settings.json');
    if (fs.statSync(file).size > 65536) return null;
    const record = JSON.parse(fs.readFileSync(file, 'utf8'));
    const settings = Object.fromEntries(fields.filter(k => k in record.settings).map(k => [k, record.settings[k]]));
    settings.consent = record.policy_version === POLICY && !!settings.consent;
    if (record.credential && await available(safeStorage)) {
      const buffer = Buffer.from(record.credential, 'base64');
      settings.api_key = safeStorage.decryptStringAsync
        ? (await safeStorage.decryptStringAsync(buffer)).result : safeStorage.decryptString(buffer);
    }
    if (record.credential && !settings.api_key) settings.consent = false;
    return settings;
  } catch { return null; }
}
async function saveAiSettings(root, settings, safeStorage) {
  let previous = null;
  try { previous = JSON.parse(fs.readFileSync(path.join(root, 'ai-settings.json'), 'utf8')); } catch { /* First setup. */ }
  const publicSettings = Object.fromEntries(fields.map(k => [k, settings[k]]));
  let credential = settings.base_url === previous?.settings?.base_url ? previous?.credential : null;
  let persisted = !!credential;
  if (settings.api_key) {
    credential = null; persisted = false;
    if (await available(safeStorage)) {
      try {
        const encrypted = safeStorage.encryptStringAsync ? await safeStorage.encryptStringAsync(settings.api_key) : safeStorage.encryptString(settings.api_key);
        credential = encrypted.toString('base64'); persisted = true;
      } catch { /* Keep the already configured credential in memory only. */ }
    }
  }
  if (settings.api_key && !persisted) publicSettings.consent = false;
  const temporary = path.join(root, 'ai-settings.tmp');
  fs.writeFileSync(temporary, JSON.stringify({ settings: publicSettings, credential, policy_version: POLICY }), { mode: 0o600 });
  fs.renameSync(temporary, path.join(root, 'ai-settings.json'));
  return { credential_persisted: persisted };
}
function clearAiSettings(root) {
  const file = path.join(root, 'ai-settings.json');
  try {
    const value = JSON.parse(fs.readFileSync(file, 'utf8'));
    value.credential = null; value.settings.consent = false;
    const temporary = path.join(root, 'ai-settings.tmp');
    fs.writeFileSync(temporary, JSON.stringify(value), { mode: 0o600 });
    fs.renameSync(temporary, file);
  } catch { /* No retained credential. */ }
}
function forgetAiSettings(root) {
  try { fs.unlinkSync(path.join(root, 'ai-settings.json')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
}
module.exports = { readAiSettings, saveAiSettings, clearAiSettings, forgetAiSettings };
