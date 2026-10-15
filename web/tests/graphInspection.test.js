import test from 'node:test';
import assert from 'node:assert/strict';
import { graphData } from '../src/utils/analysis.js';
import { inspectGraph } from '../src/utils/graphInspection.js';
import { createRenderer, nextTick, ref } from 'vue';
import { useGraphInspection } from '../src/composables/useGraphInspection.js';

const assets = [
  { source_id: 'first', file_name: 'one/same.py', algorithm: 'RSA', finding_count: 2, targets: ['ML-KEM'] },
  { source_id: 'second', file_name: 'two/same.py', algorithm: 'RSA', finding_count: 1, targets: ['ML-DSA'] },
  { source_id: 'first', file_name: 'one/same.py', algorithm: 'ECDSA', finding_count: 3, targets: ['ML-DSA'] },
];

test('edge inspection preserves exact file identity, count and applicable target paths', () => {
  const graph = graphData(assets);
  const result = inspectGraph(graph, { kind: 'evidence', sourceId: 'first', algorithm: 'RSA' });
  assert.equal(result.title, 'one/same.py → RSA');
  assert.equal(result.detail, 'first · 2 项证据');
  assert.deepEqual([...result.files], ['first']);
  assert.deepEqual([...result.targets], ['ML-KEM']);
  assert.equal(result.evidence.length, 1);
  assert.equal(result.references.length, 1);
});

test('migration references highlight only files with that actual reference', () => {
  const graph = graphData(assets);
  const result = inspectGraph(graph, { kind: 'recommendation', algorithm: 'RSA', target: 'ML-DSA' });
  assert.deepEqual([...result.files], ['second']);
  assert.match(result.detail, /迁移参考.*复核/);
  const target = inspectGraph(graph, { kind: 'target', target: 'ML-DSA' });
  assert.deepEqual([...target.algorithms], ['RSA', 'ECDSA']);
  assert.equal(target.evidence.length, 2);
});

test('node inspection gathers related edges without joining same-named files', () => {
  const graph = graphData(assets);
  const file = inspectGraph(graph, { kind: 'file', sourceId: 'first' });
  assert.equal(file.detail, 'first · 5 项证据');
  assert.equal(file.evidence.length, 2);
  assert.deepEqual([...file.files], ['first']);
  const algorithm = inspectGraph(graph, { kind: 'algorithm', algorithm: 'RSA' });
  assert.equal(algorithm.detail, '2 个文件 · 3 项证据');
});

test('search, page changes and missing selections cannot leave stale relationships', () => {
  const many = Array.from({ length: 13 }, (_, i) => ({ ...assets[0], source_id: `s${i}` }));
  const selection = { kind: 'file', sourceId: 's0' };
  assert.ok(inspectGraph(graphData(many), selection));
  assert.equal(inspectGraph(graphData(many, '', 2), selection), null);
  assert.equal(inspectGraph(graphData(many, 'missing'), selection), null);
  assert.equal(inspectGraph(graphData([]), null), null);
});

function setup(t) {
  const previousWindow = globalThis.window;
  const listeners = new Map();
  globalThis.window = { innerWidth: 1000, innerHeight: 760,
    addEventListener: (name, handler) => listeners.set(name, handler),
    removeEventListener: name => listeners.delete(name) };
  const graph = ref(graphData(assets));
  let state;
  const renderer = createRenderer({ createComment: () => ({}), insert() {}, remove() {},
    parentNode: () => null, nextSibling: () => null });
  const app = renderer.createApp({ setup() {
    state = useGraphInspection(graph);
    return () => null;
  } });
  app.mount({});
  state.tooltip.value = { getBoundingClientRect: () => ({ width: 300, height: 80 }), contains: () => false };
  let rect = { left: 300, top: 600, bottom: 644 };
  const anchor = { isConnected: true, getBoundingClientRect: () => rect };
  t.after(() => {
    app.unmount();
    assert.equal(listeners.size, 0);
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  });
  return { state, graph, listeners, anchor, move: value => { rect = value; } };
}

test('pointer help stays within the viewport and only the latest inspection sets position', async (t) => {
  const { state, anchor } = setup(t);
  state.inspectPointer({ kind: 'file', sourceId: 'first' }, { currentTarget: anchor, clientX: 20, clientY: 30 });
  state.inspectPointer({ kind: 'file', sourceId: 'second' }, { currentTarget: anchor, clientX: 950, clientY: 700 });
  await nextTick();
  assert.equal(state.inspection.value.title, 'two/same.py');
  assert.deepEqual(state.position.value, { left: '692px', top: '608px' });
  state.clearInspection();
  await nextTick();
  assert.equal(state.inspection.value, null);
});

test('keyboard inspection follows scrolling, Escape dismisses it, new graph clears it', async (t) => {
  const { state, graph, listeners, anchor, move } = setup(t);
  state.inspectFocus({ kind: 'file', sourceId: 'first' }, { type: 'focus', currentTarget: anchor });
  await nextTick();
  assert.equal(state.inspection.value.title, 'one/same.py');
  move({ left: 300, top: 200, bottom: 244 });
  listeners.get('scroll')({ type: 'scroll', target: {} });
  await nextTick();
  assert.equal(state.position.value.top, '256px');
  listeners.get('keydown')({ key: 'Escape' });
  assert.equal(state.inspection.value, null);
  state.inspectFocus({ kind: 'algorithm', algorithm: 'RSA' }, { type: 'focus', currentTarget: anchor });
  graph.value = graphData(assets, 'missing');
  await nextTick();
  assert.equal(state.inspection.value, null);
});

test('help remains hoverable during the gap and closes after pointer exit', async (t) => {
  const { state, anchor } = setup(t);
  state.inspectPointer({ kind: 'file', sourceId: 'first' }, { currentTarget: anchor, clientX: 20, clientY: 30 });
  state.hidePointer();
  state.retainPointer();
  await new Promise(resolve => setTimeout(resolve, 120));
  assert.ok(state.inspection.value);
  state.hidePointer();
  await new Promise(resolve => setTimeout(resolve, 120));
  assert.equal(state.inspection.value, null);
});
