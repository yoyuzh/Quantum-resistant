import test from 'node:test';
import assert from 'node:assert/strict';
import { assistanceAction } from '../src/utils/assistance.js';
import { selectedFindings } from '../src/utils/analysis.js';

test('zero groups remaining suppresses historical false retry, effective AI purpose filters the original row',()=>{
  assert.equal(assistanceAction({ai_analysis:{status:'partial',coverage:{remaining:0,partial:true}}}),'');
  assert.equal(assistanceAction({ai_analysis:{status:'partial',coverage:{remaining:1},execution:{retryable:0}}}),'');
  const row={source_id:'s',algorithm:'RSA',purpose_code:'unknown',effective_purpose_code:'sign'};
  assert.equal(selectedFindings({findings:[row]},{purpose:'sign'}).length,1);
});
