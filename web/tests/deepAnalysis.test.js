import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto, createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { abstractText, byteColumnToOffset, coverageText, operationPage, sourceLimit, sourceWindow, sourceTree } from '../src/utils/deepAnalysis.js';
import { relativePath, uploadBody, uploadManifest } from '../src/utils/pathUpload.js';
import { mergeFiles } from '../src/utils/files.js';
import { createDeepTask } from '../src/utils/deepTask.js';

const source = 's1';
const span = { source_id: source, start_line: 1, start_col: 0, end_line: 1, end_col: 3 };
function operation(id, algorithm, extra = {}) {
  return { operation_id: id, algorithm: { kind: 'known', value: algorithm }, operation_type: 'sign',
    api: 'jwt.encode', resolution_status: 'resolved', risk_category: algorithm === 'RS256' ? 'quantum_vulnerable' : 'symmetric',
    context: { kind: 'invocation', call_chain: [span], conditions: [] }, call_site: span, sink_location: span,
    claims: [{ level: 'E3' }], ...extra };
}
function file(path, text = 'print(1)\n') {
  const value = new File([text], path.split('/').at(-1), { lastModified: 1 });
  Object.defineProperty(value, 'webkitRelativePath', { value: path });
  return value;
}
function harness(request) {
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  return { task: createDeepTask({ request, storage, key: 'deep-test' }), values, storage };
}

test('UTF-8 columns highlight Chinese and astral characters, end exclusive, bounded source window', () => {
  assert.equal(byteColumnToOffset('中😀a', 3), 1);
  assert.equal(byteColumnToOffset('中😀a', 7), 3);
  const lines = sourceWindow('中😀签名(x)\nnext', { ...span, start_col: 7, end_col: 13 });
  assert.equal(lines[0].marked, '签名');
  assert.equal(lines[0].before, '中😀');
  assert.equal(sourceWindow(Array(200).fill('x').join('\n'), { ...span, end_line: 199 }).length, 25);
});

test('relative file tree preserves same basenames and distinct source identities', () => {
  const tree = sourceTree([{ relative_path: 'p/a/main.py', source_id: 'a' }, { relative_path: 'p/b/main.py', source_id: 'b' }]);
  assert.equal(tree.length, 1);
  assert.equal(tree[0].children[0].children[0].source.source_id, 'a');
  assert.equal(tree[0].children[1].children[0].source.source_id, 'b');
});

test('RS256 and HS256 retain distinct contexts through filtering and pagination', () => {
  const operations = Array.from({ length: 19 }, (_, index) => operation(String(index), index % 2 ? 'RS256' : 'HS256'));
  assert.deepEqual(operationPage(operations, { algorithm: 'RS256' }, 2, 4).items.map(op => op.operation_id), ['9', '11', '13', '15']);
  assert.equal(operationPage(operations, { risk: 'symmetric' }).total, 10);
  assert.equal(operationPage(operations, { sourceId: 'other' }).total, 0);
  assert.equal(operationPage(operations, { level: 'E3', type: 'sign' }).total, 19);
  assert.equal(operationPage(operations, {}, 99).current, 3);
  assert.equal(operationPage(operations, { query: 'jwt.encode' }).total, 19);
  const unknown = operation('unknown', '', { algorithm: { kind: 'unknown', reason: '动态参数' }, resolution_status: 'unknown' });
  assert.equal(operationPage([unknown], { query: '动态参数' }).total, 1);
  assert.equal(abstractText(unknown.algorithm), 'Unknown');
  assert.equal(coverageText({ count: 2, total: null }), '2 / 未知');
  assert.equal(coverageText({ count: 0, total: 0 }), '0 / 0');
});

test('directory manifests preserve same basenames, long paths and decoded BOM/newlines digest', async () => {
  const a = file('project/a/main.py', '\ufeff# 中文\r\nx = 1\r\n');
  const b = file('project/b/main.py', 'x = 2\n');
  const long = file(`project/${'long-directory/'.repeat(18)}helper.py`);
  const manifest = await uploadManifest([a, b, long], webcrypto);
  assert.equal(manifest.entries[0].sha256, createHash('sha256').update('# 中文\r\nx = 1\r\n').digest('hex'));
  assert.equal(manifest.entries[1].relative_path, 'project/b/main.py');
  assert.equal(manifest.entries[2].index, 2);
  assert.equal(mergeFiles([], [a, b]).files.length, 2);
  const body = await uploadBody([a, b], 'deep');
  assert.equal(body.get('analysis_mode'), 'deep');
  assert.equal(JSON.parse(body.get('manifest')).entries.length, 2);
  assert.equal(body.getAll('files').length, 2);
});

test('directory fallback refuses missing/mixed paths, duplicates, traversal and invalid UTF-8', async () => {
  const flat = new File(['x'], 'main.py');
  assert.throws(() => relativePath(flat), /相对路径/);
  assert.throws(() => relativePath(file('../main.py')), /相对路径/);
  await assert.rejects(uploadBody([flat, file('p/main.py')]), /不能混合/);
  await assert.rejects(uploadManifest([file('p/Main.py'), file('p/main.py')], webcrypto), /重复/);
  const invalid = file('p/invalid.py', new Uint8Array([0xff]));
  await assert.rejects(uploadManifest([invalid], webcrypto), /有效 UTF-8/);
  await assert.rejects(uploadManifest([file('p/a.py')], {}), /不支持安全摘要.*普通文件/);
  const body = await uploadBody([flat]);
  assert.equal(body.has('manifest'), false);
  assert.equal(body.get('analysis_mode'), 'basic');
});

test('opening deep state performs zero requests; four input limitations stay explicit', async () => {
  let requests = 0;
  const { task } = harness(async () => { requests++; });
  task.bind('source');
  assert.equal(requests, 0);
  const sources = [{ file_name: 'main.py', content_available: true }];
  assert.match(sourceLimit({ source_type: 'snippet', sources }), /局部/);
  assert.match(sourceLimit({ source_type: 'manual_upload', sources }), /平铺/);
  assert.match(sourceLimit({ source_type: 'github_repository', sources }), /已采集/);
  assert.match(sourceLimit({ source_type: 'pypi_package', sources }), /已采集/);
  assert.match(sourceLimit({ sources: [] }), /过期/);
  assert.match(sourceLimit({ sources: [{ file_name: 'a.js', content_available: true }] }), /没有 Python/);
  task.dispose();
});

test('stale submission cannot overwrite switched source; storage contains task/source IDs only', async () => {
  let release;
  const { task, values } = harness(async path => {
    if (path === '/api/tasks/deep-analysis') return new Promise(resolve => { release = resolve; });
    throw new Error('unexpected request');
  });
  task.bind('first');
  const work = task.start();
  task.bind('second', { operations: [] });
  release({ id: 'old' });
  await work;
  assert.equal(task.state.sourceTaskId, 'second');
  assert.deepEqual(task.state.result, { operations: [] });
  assert.equal(values.size, 0);
});

test('explicit start, ID-only restore, source isolation, expiry and failures retain previous deep result', async () => {
  const calls = [];
  let fail = false;
  const { task, values, storage } = harness(async (path, args) => {
    calls.push([path, args]);
    if (fail) throw Object.assign(new Error('gone'), { status: 404 });
    if (path === '/api/tasks/deep-analysis') return { id: 'deep-id' };
    if (path.endsWith('/result?include_content=false')) return { deep_analysis: { status: 'completed', operations: [] } };
    return { id: 'deep-id', state: 'succeeded', has_result: true };
  });
  task.bind('source-id');
  await task.start();
  assert.equal(calls[0][1].body.source_task_id, 'source-id');
  assert.ok(calls[0][1].headers['X-Request-ID']);
  assert.equal([...values.values()][0], '{"sourceTaskId":"source-id","taskId":"deep-id"}');
  const other = createDeepTask({ request: async () => { throw new Error('must not request'); }, storage, key: 'deep-test' });
  other.bind('different');
  await other.restore();
  assert.equal(other.state.taskId, '');
  calls.length = 0;
  task.bind('source-id');
  await task.restore();
  assert.equal(calls[0][0], '/api/tasks/deep-id');
  fail = true;
  await task.start();
  assert.equal(task.state.result.status, 'completed');
  assert.match(task.state.error, /过期.*基础结果已保留/);
  task.dispose(); other.dispose();
});

test('cancel requests server cancellation, partial checkpoint remains available', async () => {
  let release;
  const { task } = harness(async path => {
    if (path === '/api/tasks/deep-analysis') return { id: 'deep' };
    if (path.endsWith('/cancel')) { release({ id: 'deep', state: 'partial', has_result: true }); return { state: 'partial' }; }
    if (path.endsWith('/result?include_content=false')) return { deep_analysis: { status: 'cancelled', operations: [] } };
    return new Promise(resolve => { release = resolve; });
  });
  task.bind('source');
  const work = task.start();
  await new Promise(resolve => setImmediate(resolve));
  await task.cancel();
  await work;
  assert.equal(task.state.result.status, 'cancelled');
  assert.equal(task.state.busy, false);
});

test('production deep export uses saved server endpoint and no client supplied proof body', async () => {
  const component = await readFile(new URL('../src/components/DeepWorkspace.vue', import.meta.url), 'utf8');
  assert.match(component, /\/deep-analysis\/export/);
  assert.match(component, /text: true/);
  assert.doesNotMatch(component, /method: 'POST'/);
});

test('a failed rerun never changes the task used for previous source navigation/export', async () => {
  const { task } = harness(async path => {
    if (path === '/api/tasks/deep-analysis') return { id: 'failed-task' };
    if (path.endsWith('/result?include_content=false')) return { summary: {}, findings: [] };
    return { id: 'failed-task', state: 'partial', has_result: true, error: 'write failed' };
  });
  task.bind('old-task', { status: 'completed', operations: [] });
  await task.start();
  assert.equal(task.state.taskId, 'failed-task');
  assert.equal(task.state.resultTaskId, 'old-task');
  assert.equal(task.state.result.status, 'completed');
  assert.match(task.state.error, /write failed/);
});

test('late status/result callbacks after source switch cannot replace progress or saved identity', async () => {
  let release;
  const { task, values } = harness(async path => {
    if (path === '/api/tasks/deep-analysis') return { id: 'first-deep' };
    return new Promise(resolve => { release = resolve; });
  });
  task.bind('first-source');
  const run = task.start();
  await new Promise(resolve => setImmediate(resolve));
  task.bind('second-source');
  release({ id: 'first-deep', state: 'running', deep_operations: 999 });
  await run;
  assert.equal(task.state.sourceTaskId, 'second-source');
  assert.equal(task.state.progress, null);
  assert.equal(task.state.busy, false);
  assert.equal(JSON.parse([...values.values()][0]).sourceTaskId, 'first-source');
});
