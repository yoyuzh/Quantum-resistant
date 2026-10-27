import test from 'node:test';
import assert from 'node:assert/strict';
import { distribution, statusLabel } from '../src/utils/verification.js';
import { selectedFindings } from '../src/utils/analysis.js';
import { graphRecords } from '../src/utils/workbenchGraph.js';
import { callPath, callRows } from '../src/utils/callGraph.js';
import { activityHistory, elapsedStamp, batchWaiting } from '../src/utils/activity.js';
import { conciseInsights } from '../src/utils/presentation.js';

test('all three judgment states remain separate in graph and distribution',()=>{
  const statuses=['confirmed','ai_assessed','pending'];
  const findings=statuses.map((verification_status,i)=>({verification_status,algorithm:'RSA',source_id:'one',line:i+1,purpose_code:i===1?'sign':'key_generation'}));
  const rows=distribution({integrated_analysis:{findings}});
  assert.deepEqual(rows,[{algorithm:'RSA',confirmed:1,ai_assessed:1,pending:1}]);
  const graph=graphRecords({assets:findings.map(row=>({...row,file_name:'same.py',finding_count:1,targets:['ML-DSA']}))},'migration');
  assert.equal(graph.nodes.filter(n=>n.kind==='algorithm').length,3);
  assert.ok(graph.nodes.some(n=>n.kind==='reference' && n.status==='pending' && !n.referenceLabel));
  assert.equal(statusLabel('ai_assessed'),'AI研判');
});

test('purpose and source filters preserve AI judgments without changing status',()=>{
  const findings=[{algorithm:'RSA',source_id:'one',purpose_code:'sign',verification_status:'ai_assessed'},
    {algorithm:'RSA',source_id:'one',purpose_code:'key_generation',verification_status:'confirmed'}];
  assert.deepEqual(selectedFindings({findings},{sourceId:'one',purpose:'sign',status:'ai_assessed'}),[findings[0]]);
});

test('a definition is one labelled location and no fabricated caller',()=>{
  const [row]=callRows({integrated_analysis:{calls:[{id:'a',source_id:'s',line:4,algorithm:'ECC',context_kind:'uninstantiated_template',call_chain:[]}]}});
  assert.deepEqual(callPath(row),[{source_id:'s',start_line:4}]);
  assert.equal(row.context_kind,'uninstantiated_template');
});

test('history contains only the latest distinct actions in chronological order',()=>{
  const a={action:'分析',files:['a.py'],elapsed:1};
  const b={action:'分析',files:['b.py'],elapsed:1};
  const c={action:'保存',files:[],elapsed:2};
  assert.deepEqual(activityHistory({activity:c,activity_log:[a,b,{...a,elapsed:2},c]}),[b,{...a,elapsed:2}]);
  assert.deepEqual(activityHistory({activity:a,activity_log:[a,a]}),[]);
});

test('time row uses a single elapsed stamp and an actual batch wait',()=>{
  assert.equal(elapsedStamp(902.7),'15:02');
  assert.equal(elapsedStamp(NaN),'00:00');
  assert.equal(batchWaiting({elapsed:42,activity:{action:'模型正在分析',waiting_since:34}}),8);
  assert.equal(batchWaiting({elapsed:42,activity:{action:'保存结果',elapsed:34}}),0);
});

test('overview uses adopted judgments and actual purposes instead of generic algorithm guesses',()=>{
  const findings=[{algorithm:'ECC',file_name:'key.py',source_id:'k',purpose_code:'key_generation',verification_status:'confirmed'},
    {algorithm:'RSA',file_name:'use.py',source_id:'u',purpose_code:'sign',verification_status:'confirmed'},
    {algorithm:'RSA',file_name:'use.py',source_id:'u',purpose_code:'encrypt',verification_status:'ai_assessed'}];
  const values=conciseInsights({integrated_analysis:{findings},sources:findings});
  assert.equal(values[0].value,'RSA');assert.equal(values[0].detail,'2 项发现');
  assert.equal(values[1].value,'use.py');assert.equal(values.length,2);
});
