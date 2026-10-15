import test from 'node:test';
import assert from 'node:assert/strict';
import { effectScope, nextTick, ref } from 'vue';
import { useResultSelection } from '../src/composables/useResultSelection.js';
import { findingKey } from '../src/utils/results.js';
import { capturePosition, ensureFocusVisible, focusDestination, restorePosition } from '../src/utils/navigation.js';

const items = Array.from({ length: 56 }, (_, index) => ({
  source_id: index < 55 ? 'first' : 'second', file_name: 'same.py', algorithm: 'RSA',
  line: index + 1, evidence: `gen(${index})`,
}));
function setup(t) {
  const scope = effectScope();
  const result = ref({ findings: items, sources: [
    { source_id: 'first', file_name: 'same.py' }, { source_id: 'second', file_name: 'same.py' },
  ] });
  const state = scope.run(() => useResultSelection(result));
  t.after(() => scope.stop());
  return { state, result };
}
test('evidence navigation restores filters and preserves asset range across the trip', async (t) => {
  const { state } = setup(t);
  state.filters.algorithm = 'RSA';
  await state.switchTab('assets');
  await state.reveal({ ...items[0], locations: [{ line: 52, evidence: 'gen(51)' }] });
  assert.equal(state.tab.value, 'findings');
  assert.equal(state.selectedKey.value, findingKey(items[51]));
  assert.equal(state.findings.value.length, 55);
  assert.equal(state.assetFindings.value.length, 56);
  assert.match(state.announcement.value, /第 52 行/);
  await state.back();
  assert.equal(state.tab.value, 'assets');
  assert.equal(state.filters.algorithm, 'RSA');
  assert.equal(state.filters.sourceId, '');
  assert.equal(state.origin.value, null);
});
test('same filenames stay separate; missing evidence falls back to the list', async (t) => {
  const { state } = setup(t);
  await state.reveal(items[55]);
  assert.deepEqual(state.findings.value.map(f => f.source_id), ['second']);
  assert.equal(state.selectedKey.value, findingKey(items[55]));
  await state.select({ algorithm: 'DH' });
  assert.equal(state.selectedKey.value, '');
  assert.match(state.announcement.value, /没有匹配/);
});
test('rapid navigation keeps the original return point and direct tab changes clear it', async (t) => {
  const { state } = setup(t);
  await state.switchTab('migration');
  await Promise.all([state.select({ sourceId: 'first' }), state.select({ sourceId: 'second' })]);
  assert.equal(state.filters.sourceId, 'second');
  assert.equal(state.origin.value.tab, 'migration');
  await state.switchTab('overview');
  assert.equal(state.origin.value, null);
  assert.equal(state.announcement.value, '');
});
test('manual filter changes and a new result clear stale evidence selection', async (t) => {
  const { state, result } = setup(t);
  await state.select({ sourceId: 'first' });
  state.updateFilters({ query: 'no match' });
  assert.equal(state.selectedKey.value, '');
  assert.equal(state.findings.value.length, 0);
  result.value = { findings: [], sources: [] };
  await nextTick();
  assert.equal(state.tab.value, 'overview');
  assert.equal(state.origin.value, null);
  assert.deepEqual([...state.visited], ['overview']);
});

test('scrolling uses the panel only when it actually scrolls, with sticky clearance and reduced motion', (t) => {
  const previousWindow = globalThis.window;
  const previousStyle = globalThis.getComputedStyle;
  t.after(() => {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
    if (previousStyle === undefined) delete globalThis.getComputedStyle;
    else globalThis.getComputedStyle = previousStyle;
  });
  const pageScrolls = [];
  let reduced = true;
  globalThis.window = { scrollY: 600, scrollTo: value => pageScrolls.push(value.top),
    matchMedia: () => ({ matches: reduced }) };
  globalThis.getComputedStyle = element => ({ overflowY: element.overflow || 'visible',
    backgroundColor: '#fff', getPropertyValue: () => '#dcf' });
  const panelScrolls = [];
  const panel = { scrollHeight: 1200, clientHeight: 600, scrollTop: 400, overflow: 'auto',
    scrollTo: value => panelScrolls.push(value.top), getBoundingClientRect: () => ({ top: 100 }) };
  let animated = 0;
  let focused = 0;
  const target = { getBoundingClientRect: () => ({ top: 300 }),
    focus: options => { assert.equal(options.preventScroll, true); focused++; }, animate: () => { animated++; } };
  const header = { getBoundingClientRect: () => ({ height: 180, bottom: 180 }) };
  const position = capturePosition(panel);
  focusDestination(target, panel, header, { highlight: true });
  assert.deepEqual(panelScrolls, [584]);
  assert.equal(animated, 0);
  restorePosition(panel, position);
  assert.equal(panelScrolls.at(-1), 400);
  panel.overflow = 'visible';
  const documentPosition = capturePosition(panel);
  focusDestination(target, panel, header);
  assert.equal(pageScrolls.at(-1), 704);
  restorePosition(panel, documentPosition);
  assert.equal(pageScrolls.at(-1), 600);
  reduced = false;
  focusDestination(target, panel, header, { highlight: true });
  assert.equal(animated, 1);
  assert.equal(focused, 3);
  const obscured = { ...target, getBoundingClientRect: () => ({ top: 100 }) };
  ensureFocusVisible(obscured, panel, header);
  assert.equal(pageScrolls.at(-1), 504);
  assert.equal(focused, 3, 'revealing keyboard focus does not refocus the control');
  const labelledInput = { ...target, closest: () => obscured };
  ensureFocusVisible(labelledInput, panel, header);
  assert.equal(pageScrolls.at(-1), 504, 'the field label stays visible together with its control');
});
