import test from 'node:test';
import assert from 'node:assert/strict';
import { scanStage } from '../src/utils/scanStages.js';
import { selectedFindings } from '../src/utils/analysis.js';
import { findingKey } from '../src/utils/results.js';

test('unknown work stays indeterminate; model progress uses actual groups', () => {
  assert.equal(scanStage(null).index, 0);
  assert.equal(scanStage({stage:'跨文件核验'}).row, null);
  assert.equal(scanStage({stage:'读取与分析'}).index, 1);
  assert.equal(scanStage({stage:'准备扫描'},true).title, '准备模型复核');
  assert.equal(scanStage({analyzed_files:0},true).row, null);
  const value = scanStage({stage:'模型复核',ai_progress:{completed:12,discovered:24}});
  assert.equal(value.index,3);
  assert.equal(value.row.percent,50);
  assert.equal(scanStage({ai_progress:{completed:0,discovered:0}},true).row.percent,null);
  assert.equal(scanStage({state:'partial'}).index,4);
  assert.equal(scanStage({stage:'结果整理',ai_running:true}).index,4);
  assert.equal(scanStage({stage:'跨文件静态分析',activity:{completed:5,total:10}}).row.percent,50);
});

test('pending filters preserve independent call contexts and legacy confirmation', () => {
  const a={source_id:'one',line:3,algorithm:'RSA',finding_id:'call-a'};
  const b={...a,finding_id:'call-b',verification_status:'pending'};
  assert.notEqual(findingKey(a),findingKey(b));
  assert.deepEqual(selectedFindings({findings:[a,b]},{status:'pending'}),[b]);
  assert.deepEqual(selectedFindings({findings:[a,b]},{status:'confirmed'}),[a]);
});
