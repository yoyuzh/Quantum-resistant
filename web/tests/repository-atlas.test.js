import test from 'node:test';
import assert from 'node:assert/strict';
import { repositoryAtlas } from '../src/utils/repositoryAtlas.js';
import { inventoryFilename, inventoryMarkdown } from '../src/utils/repositoryInventory.js';

const base = { algorithm: 'RSA', purpose: 'sign', origin: 'static', status: 'confirmed',
  count: 21, example: { path: 'auth/cfg|sign.py', line: 3, source_id: 'a' } };
const first = { full_name: 'org/first', coverage: { partial: true, scanned_files: 1, candidate_files: 2 },
  algorithm_inventory: { basis: 'integrated', stages: { confirmed: 'partial', pending: 'completed' },
    groups: [base, { ...base, purpose: 'verify', count: 2 }] } };
const second = { full_name: 'org/clean', algorithm_inventory: { basis: 'base', stages: { confirmed: 'completed' }, groups: [] }};
const historic = { full_name: 'org/old', algorithms: ['RSA'], finding_count: 40,
  findings: [{ algorithm: 'RSA', file_name: '/tmp/private.py', line: 1, evidence: 'secret-body' },
    { algorithm: 'RSA', file_name: 'src/main.py', line: 7 }] };
const failure = { full_name: 'org/failure', code: 'timeout', error: '扫描超时 /tmp/private.py api_key=secret' };
const batch = { scanned_at: '2026-11-18T20:05:06Z', repos: [first, second, historic], failures: [failure],
  meta: { incomplete: true, requested_count: 4, query: 'topic:cryptography language:python' } };

test('covers distinct repos per assessed status and keeps historical presence separate', () => {
  const atlas = repositoryAtlas(batch);
  assert.deepEqual(atlas.rankings.confirmed[0], { algorithm: 'RSA', hits: 1, eligible: 2, partial: 1, total: 23 });
  assert.equal(atlas.rankings.ai_assessed[0].eligible, 0);
  assert.equal(atlas.rankings.legacy[0].hits, 1);
  assert.equal(atlas.rows[2].count('RSA', 'confirmed'), null);
  assert.equal(atlas.rows[1].count('RSA', 'confirmed'), 0);
  assert.equal(atlas.rows[2].historicalPositions.get('RSA'), 'src/main.py:7');
  assert.equal(atlas.partial, 1);
});

test('UTF-8 inventory covers all repos and uses findings counts, portable evidence and Beijing time', () => {
  const doc = inventoryMarkdown(repositoryAtlas(batch));
  for (const title of ['批次概况', '算法覆盖', '逐仓清单', '失败或未完成仓库']) assert.ok(doc.includes('## ' + title));
  for (const name of ['org/first', 'org/clean', 'org/old', 'org/failure']) assert.ok(doc.includes(name));
  assert.match(doc, /### 待分类（3 仓）\n\n#### \[org\/first\]/);
  assert.ok(doc.includes('| RSA | 签名 | 静态 | 21 | 未知 | 0 | 静态确认 auth/cfg\\|sign.py:3 |'));
  assert.ok(doc.includes('src/main.py:7'));
  assert.match(doc, /批次部分完成/);
  assert.doesNotMatch(doc, /secret|api_key|\/tmp\/|\/api\/tasks/);
  assert.equal(inventoryFilename(batch.scanned_at), '多仓库密码算法清单-20261119-040506.md');
  assert.equal(inventoryFilename(null), '多仓库密码算法清单-时间未知.md');
});

test('all failures retain their scope and have no algorithm denominator', () => {
  const atlas = repositoryAtlas({ repos: [], failures: [failure] });
  assert.equal(atlas.requested, 1);
  assert.deepEqual(atlas.rankings.confirmed, []);
  assert.match(inventoryMarkdown(atlas), /无可用仓库结果/);
});
