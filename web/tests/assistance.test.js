import assert from 'node:assert/strict';
import test from 'node:test';
import { assistanceAction, confirmedOperations, migrationTasks, readAiPreference, saveAiPreference } from '../src/utils/assistance.js';
import { followTask } from '../src/utils/remoteTasks.js';
import { fileKey } from '../src/utils/files.js';

test('AI defaults on, remembers off, and storage errors preserve a usable default', () => {
  const data = new Map(); const store = { getItem: k => data.get(k), setItem: (k,v) => data.set(k,v) };
  assert.equal(readAiPreference(store), true); saveAiPreference(false, store); assert.equal(readAiPreference(store), false);
  assert.equal(readAiPreference({ getItem() { throw new Error(); } }), true);
});
test('supplement and continue actions reflect actual completion', () => {
  assert.equal(assistanceAction({}), '补做 AI 分析');
  assert.equal(assistanceAction({ ai_analysis: { status: 'completed', coverage: { remaining: 0 } } }), '');
  assert.equal(assistanceAction({ ai_analysis: { status: 'partial', coverage: { remaining: 5 } } }), '继续 AI 分析');
  assert.equal(assistanceAction({ ai_analysis: { status: 'cancelled', coverage: { remaining: 5 } } }), '重试未完成项');
});
test('AI opinions do not become confirmed operations or migration tasks', () => {
  const result = { ai_analysis: { opinions: [{ algorithm: 'RSA' }] }, deep_analysis: { operations: [] } };
  assert.deepEqual(confirmedOperations(result), []); assert.deepEqual(migrationTasks(result), []);
});
test('directory paths distinguish same-named files', () => {
  const a = { name: 'crypto.py', size: 10, lastModified: 1, webkitRelativePath: 'a/crypto.py' };
  assert.notEqual(fileKey(a), fileKey({ ...a, webkitRelativePath: 'b/crypto.py' }));
});
test('checkpoint updates occur once per version, before terminal results', async () => {
  let polls = 0, reads = 0; const snapshots = [], controller = new AbortController();
  const value = { sources: [], findings: [], summary: {} };
  const answer = await followTask({ kind: 'snippet', id: 'task', signal: controller.signal, delay: async () => {},
    request: async path => {
      if (path.endsWith('/checkpoint')) { reads++; return value; }
      if (path.includes('/result')) return value;
      return { id: 'task', state: ++polls < 3 ? 'running' : 'succeeded', checkpoint_version: 1, has_result: true };
    }, onCheckpoint: item => snapshots.push(item) });
  assert.equal(reads, 1); assert.equal(snapshots[0].task_id, 'task'); assert.deepEqual(answer.result, value);
});

test('terminal-only presentation polls lightweight status without downloading intermediate results', async () => {
  let polls=0,checkpointReads=0;
  const answer=await followTask({kind:'snippet',id:'one',signal:new AbortController().signal,
    readCheckpoints:false,delay:async()=>{},request:async path=>{
      if(path.endsWith('/checkpoint')) {checkpointReads++;return {};}
      if(path.includes('/result'))return {findings:[],summary:{}};
      return {id:'one',state:++polls<3?'running':'succeeded',checkpoint_version:polls,has_result:true};
    }});
  assert.equal(checkpointReads,0);
  assert.equal(polls,3);
  assert.deepEqual(answer.result.findings,[]);
});
