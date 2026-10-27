'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { readAiSettings, saveAiSettings, clearAiSettings } = require('../src/ai-preferences.cjs');
const value = { preset: 'compatible', base_url: 'https://model.invalid/v1', model: 'fixture', consent: true, json_mode: true, output_parameter: 'max_tokens', reasoning_disabled: true, api_key: 'fixture-secret' };
const secure = { isEncryptionAvailable: () => true, getSelectedStorageBackend: () => 'gnome_libsecret',
  encryptString: x => Buffer.from(x.split('').reverse().join('')), decryptString: x => x.toString().split('').reverse().join('') };
test('desktop stores only encrypted credentials, preserves blank key and supports deletion', async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-preferences-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  await saveAiSettings(root, value, secure);
  assert.equal(fs.readFileSync(path.join(root, 'ai-settings.json'), 'utf8').includes('fixture-secret'), false);
  assert.equal((await readAiSettings(root, secure)).api_key, 'fixture-secret');
  await saveAiSettings(root, { ...value, api_key: '' }, secure);
  assert.equal((await readAiSettings(root, secure)).api_key, 'fixture-secret');
  clearAiSettings(root); const cleared = await readAiSettings(root, secure);
  assert.equal(cleared.api_key, undefined); assert.equal(cleared.consent, false);
});
test('unavailable system storage never falls back to a plaintext key file', async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-preferences-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const unavailable = { ...secure, isEncryptionAvailable: () => false };
  assert.equal((await saveAiSettings(root, value, unavailable)).credential_persisted, false);
  assert.equal(fs.readFileSync(path.join(root, 'ai-settings.json'), 'utf8').includes('fixture-secret'), false);
  assert.equal((await readAiSettings(root, unavailable)).api_key, undefined);
});
test('encryption failure keeps credentials in memory and restart disables consent', async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-preferences-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  await saveAiSettings(root, value, secure);
  const unavailable = { ...secure, isEncryptionAvailable: () => false };
  assert.equal((await readAiSettings(root, unavailable)).consent, false);
  const broken = { ...secure, encryptString: () => { throw new Error('locked'); } };
  assert.equal((await saveAiSettings(root, value, broken)).credential_persisted, false);
  assert.equal(fs.readFileSync(path.join(root, 'ai-settings.json'), 'utf8').includes('fixture-secret'), false);
});
