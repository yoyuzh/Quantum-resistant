import test from 'node:test';
import assert from 'node:assert/strict';
import { migrationPresentation } from '../src/utils/migrationPresentation.js';
import { readThemePreference, persistThemePreference } from '../src/utils/theme.js';

const description = '确认所用密码库与平台支持。ML-KEM 是密钥封装机制，不能直接替换签名或任意加密 API。';
const migration = (algorithm, target) => ({ algorithm, targets: [target], reference_url: 'https://csrc.nist.gov', actions: [
  { title: '确认用途', description: '核对实际调用场景。' },
  { title: '选择实现', description: `按用途评估 ${target}，${description}` },
] });
test('generated target lists share guidance once while keeping rows and references', () => {
  const items = [migration('DH', 'ML-KEM'), migration('DSA', 'ML-DSA')];
  const before = structuredClone(items);
  const shown = migrationPresentation(items);
  assert.equal(shown.shared.length, 2);
  assert.equal(shown.rows.length, 2);
  assert.deepEqual(shown.rows.map(r => r.actions), [[], []]);
  assert.match(shown.shared[1].description, /表中候选方案/);
  assert.equal(shown.references.length, 1);
  assert.deepEqual(items, before);
});
test('custom advice and non-template target text are never discarded', () => {
  const items = [migration('DH', 'ML-KEM'), migration('DSA', 'ML-DSA')];
  items[1].actions.push({ title: '专用协议', description: '核查签名协议。' });
  items[0].actions[1].description = '按用途评估 ML-KEM，自定义实现要求。';
  const shown = migrationPresentation(items);
  assert.equal(shown.shared.length, 1);
  assert.equal(shown.rows[0].actions[0].description, items[0].actions[1].description);
  assert.equal(shown.rows[1].actions.length, 2);
  assert.deepEqual(migrationPresentation().shared, []);
  const single = migrationPresentation([items[0]]);
  assert.equal(single.shared.length, 0);
  assert.equal(single.rows[0].actions.length, 2);
});
test('desktop preference wins, storage failures cannot prevent native synchronization', async () => {
  const denied = () => { throw new Error('storage denied'); };
  assert.equal(readThemePreference({ readTheme: () => 'dark' }, denied), 'dark');
  assert.equal(readThemePreference({ readTheme: denied }, () => ({ getItem: () => 'dark' })), 'dark');
  assert.equal(readThemePreference(undefined, denied), 'light');
  let saved;
  persistThemePreference('dark', { saveTheme: async (value) => { saved = value; } }, denied);
  assert.equal(saved, 'dark');
  persistThemePreference('light', { saveTheme: async () => { throw new Error('disk denied'); } }, denied);
  await Promise.resolve();
});
