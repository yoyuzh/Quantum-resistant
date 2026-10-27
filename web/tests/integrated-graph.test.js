import test from 'node:test';
import assert from 'node:assert/strict';
import { selectedFindings, assetKey, assetLocation } from '../src/utils/analysis.js';
import { callRows, callPath } from '../src/utils/callGraph.js';

test('call graph accepts absent optional chains and removes only consecutive duplicate locations', () => {
  const rows=callRows({integrated_analysis:{calls:[
    {id:'one',source_id:'a',line:3,algorithm:'RSA',call_chain:[{source_id:'caller',start_line:2},{source_id:'a',start_line:3}]},
    {id:'two',source_id:'a',line:4,verification_status:'pending'},null,
  ]}});
  assert.equal(rows.length,2);
  assert.equal(callPath(rows[0]).length,2);
  assert.deepEqual(callPath(rows[1]),[{source_id:'a',start_line:4}]);
  assert.deepEqual(callRows({}),[]);
  assert.deepEqual(callRows({integrated_analysis:{calls:null}}),[]);
});

test('migration target selection follows confirmed finding identities rather than every use of an algorithm', () => {
  const signed={finding_id:'sign',algorithm:'RSA',source_id:'a'};
  const generated={...signed,finding_id:'generate'};
  const pending={...signed,finding_id:'pending',verification_status:'pending'};
  const result={findings:[signed,generated,pending],analysis:{migrations:[{algorithm:'RSA',targets:['ML-DSA'],finding_ids:['sign']}]}};
  assert.deepEqual(selectedFindings(result,{target:'ML-DSA'}),[signed]);
});

test('pending asset selection resolves its actual finding instead of the confirmed finding at the same algorithm', () => {
  const confirmed={finding_id:'confirmed',source_id:'a',algorithm:'RSA',line:3,evidence:'jwt.encode'};
  const pending={...confirmed,finding_id:'pending',line:6,evidence:'pow',verification_status:'pending'};
  const asset={source_id:'a',algorithm:'RSA',verification_status:'pending'};
  assert.notEqual(assetKey(asset),assetKey(confirmed));
  assert.equal(assetLocation([confirmed,pending],asset,{line:6,evidence:'pow'}),pending);
});
