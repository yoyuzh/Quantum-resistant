import test from 'node:test';
import assert from 'node:assert/strict';
import { effectScope, nextTick, reactive, ref } from 'vue';
import { useFindingPagination } from '../src/composables/useFindingPagination.js';
import { useInputLayout } from '../src/composables/useInputLayout.js';
import { findingKey } from '../src/utils/results.js';
import { collectionLayout, describeInput, gridCapacity, pageCapacity } from '../src/utils/workspace.js';
import { useCollectionPagination } from '../src/composables/useCollectionPagination.js';

const findings = Array.from({ length: 55 }, (_, index) => ({
  source_id: index < 54 ? 'first' : 'second', file_name: 'same.py',
  line: index + 1, algorithm: 'RSA', evidence: `call(${index})`,
}));
function pager(t) {
  const scope = effectScope();
  t.after(() => scope.stop());
  const items = ref(findings);
  const requested = ref('');
  return { items, requested, ...scope.run(() => useFindingPagination(items, requested)) };
}

test('page capacity fits complete rows, bounds extreme sizes and falls back for natural scrolling', () => {
  assert.equal(pageCapacity(375), 7);
  assert.equal(pageCapacity(425), 8);
  assert.equal(pageCapacity(10), 1);
  assert.equal(pageCapacity(10000), 50);
  assert.equal(pageCapacity(0, 52, false), 10);
});

test('paging selects the first item on the new page; resizing preserves the selected evidence', t => {
  const p = pager(t);
  p.measure(375, true);
  p.changePage(1);
  assert.equal(p.page.value, 2);
  assert.equal(p.active.value.line, 8);
  p.choose(findings[20]);
  p.measure(425, true);
  assert.equal(p.size.value, 8);
  assert.equal(p.page.value, 3);
  assert.equal(p.active.value.line, 21);
  assert.ok(p.pagination.value.items.some(item => findingKey(item) === p.activeKey.value));
  p.changePage(100);
  assert.equal(p.page.value, 7);
  assert.equal(p.active.value.line, 49);
});

test('external evidence navigation uses actual page capacity and separates same filenames', async t => {
  const p = pager(t);
  p.measure(375, true);
  p.requested.value = findingKey(findings[54]);
  await nextTick();
  assert.equal(p.page.value, 8);
  assert.equal(p.active.value.source_id, 'second');
  p.measure(600, true);
  assert.equal(p.page.value, 5);
  assert.equal(p.active.value.source_id, 'second');
});

test('filter and result replacement clear invalid selections and clamp empty pagination', async t => {
  const p = pager(t);
  p.choose(findings[40]);
  p.items.value = findings.slice(0, 2);
  await nextTick();
  assert.equal(p.page.value, 1);
  assert.equal(p.active.value.line, 1);
  p.items.value = [];
  await nextTick();
  assert.equal(p.active.value, undefined);
  assert.equal(p.pagination.value.pages, 1);
  p.measure(500, true);
  p.changePage(1);
  assert.equal(p.page.value, 1);
});

test('input layouts collapse on complete, partial and empty results and retain each submitted source', async t => {
  const scope = effectScope();
  t.after(() => scope.stop());
  const states = reactive({ github: { result: null, error: '', submittedSource: 'https://github.com/a/old' },
    snippet: { result: null, error: '' } });
  const layouts = scope.run(() => useInputLayout(states));
  states.github.result = { sources: [], findings: [], coverage: { partial: true } };
  await nextTick();
  assert.equal(layouts.github.collapsed, true);
  assert.equal(layouts.github.source, 'https://github.com/a/old');
  states.github.submittedSource = 'https://github.com/a/new';
  assert.equal(layouts.github.source, 'https://github.com/a/old', 'editing or submitting does not relabel the old result');
  states.snippet.result = { sources: [{ file_name: 'zero.py' }], findings: [] };
  await nextTick();
  assert.equal(layouts.snippet.collapsed, true);
  assert.equal(layouts.snippet.source, 'zero.py');
  states.github.error = '输入格式不正确';
  await nextTick();
  assert.equal(layouts.github.collapsed, false);
  assert.equal(layouts.snippet.collapsed, true);
});

test('source descriptions use submitted names without retaining source code', () => {
  assert.equal(describeInput('snippet', { filename: 'a.py', content: 'private code' }), 'a.py');
  assert.equal(describeInput('files', { files: [{ name: 'a.py' }, { name: 'b.py' }] }), '2 个文件 · a.py');
});

test('grid capacity counts complete double rows and keeps an identity visible after resize', t => {
  assert.equal(gridCapacity(280, 2), 6);
  assert.equal(gridCapacity(80, 2), 2);
  assert.equal(gridCapacity(10000, 2), 50);
  assert.equal(gridCapacity(80, 2, 88, false), 10);
  const scope = effectScope();
  t.after(() => scope.stop());
  const items = ref(findings);
  const p = scope.run(() => useCollectionPagination(items, findingKey));
  p.resize(6);
  p.changePage(3);
  const anchor = p.pagination.value.items[0];
  p.resize(8);
  assert.ok(p.pagination.value.items.some(item => findingKey(item) === findingKey(anchor)));
  const before = p.pagination.value;
  p.resize(2, true);
  assert.equal(p.size.value, 8, 'opening details does not reduce the page capacity');
  assert.deepEqual(p.pagination.value, before);
});

test('collection compaction covers empty, small and paged results using the full workspace budget', () => {
  const workspace = { height: 520, width: 1200, heading: 22, footer: 0, rowHeight: 88 };
  for (const count of [0, 1, 2, 4, 8, 55]) {
    const layout = collectionLayout({ ...workspace, count });
    assert.equal(layout.columns, Math.max(1, Math.min(count, 3)));
    assert.equal(layout.size, Math.max(1, Math.min(count, 3)) * 4);
    assert.equal(layout.compact, count <= layout.size);
  }
  assert.equal(collectionLayout({ ...workspace, width: 1103, count: 8 }).size, 8);
  assert.equal(collectionLayout({ ...workspace, width: 390, count: 8, constrained: false }).size, 10);
  assert.equal(collectionLayout({ ...workspace, height: 50000, count: 55 }).size, 50);
});

test('single-page visibility cannot feed back into capacity, and footer space remains reserved', () => {
  const workspace = { height: 520, width: 1200, heading: 22, footer: 100, rowHeight: 64 };
  const before = collectionLayout({ ...workspace, count: 55 });
  const filtered = collectionLayout({ ...workspace, count: 4 });
  assert.equal(filtered.size, before.size, 'hiding a pager must not add or remove rows');
  assert.equal(filtered.compact, true);
  assert.equal(before.compact, false);
  assert.equal(collectionLayout({ ...workspace, count: 4 }).size, filtered.size);
  assert.ok(collectionLayout({ ...workspace, footer: 0, count: 55 }).size > before.size);
});

test('adaptive collection columns use the full width and never exceed four columns or record count', () => {
  const workspace = { height: 520, count: 55 };
  for (const [width, columns] of [[390, 1], [731, 1], [732, 2], [1104, 3], [1476, 4], [2500, 4]]) {
    assert.equal(collectionLayout({ ...workspace, width }).columns, columns);
  }
  assert.equal(collectionLayout({ ...workspace, width: 2000, count: 1 }).columns, 1);
  assert.equal(collectionLayout({ ...workspace, width: 1200, count: 2 }).columns, 2);
});
