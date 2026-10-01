import test from 'node:test';
import assert from 'node:assert/strict';
import { fileLabel, conciseInsights } from '../src/utils/presentation.js';

test('only ambiguous filenames need identity suffixes, including suffix collisions', () => {
  const a = { file_name: 'same.py', source_id: 'src_one123456' };
  const b = { file_name: 'same.py', source_id: 'src_two654321' };
  assert.equal(fileLabel(a, [a, a]), 'same.py');
  assert.equal(fileLabel(a, [a, b]), 'same.py · 123456');
  const c = { ...b, source_id: 'src_three123456' };
  assert.equal(fileLabel(a, [a, c]), 'same.py · src_one123456');
  assert.equal(fileLabel({ key: a.source_id, label: a.file_name }, [a, b]), 'same.py · 123456');
});

test('concise conclusions derive at most three items from existing counts without modifying data', () => {
  const result = { summary: { algorithm_counts: { RSA: 4 } }, sources: [
    { source_id: 'src_000001', file_name: 'same.py' }, { source_id: 'src_000002', file_name: 'same.py' },
  ], analysis: { insights: { algorithms: [{ label: 'RSA', count: 4 }],
    files: [{ key: 'src_000001', label: 'same.py', count: 3 }],
    purposes: [{ label: '用途待确认', count: 4 }] } } };
  const before = structuredClone(result);
  assert.deepEqual(conciseInsights(result), [
    { title: '主要算法', value: 'RSA', detail: '4 项发现' },
    { title: '命中最多', value: 'same.py · 000001', detail: '3 项发现' },
    { title: '用途待确认', value: '4 项', detail: '结合调用上下文复核' },
  ]);
  assert.deepEqual(result, before);
});

test('empty and historic results never invent conclusions or safety claims', () => {
  assert.deepEqual(conciseInsights({ summary: { algorithm_counts: {} } }), []);
  assert.deepEqual(conciseInsights({ summary: { algorithm_counts: { RSA: 2, DH: 4 } } }),
    [{ title: '主要算法', value: 'DH', detail: '4 项发现' }]);
});
