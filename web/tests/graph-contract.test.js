import test from 'node:test';
import assert from 'node:assert/strict';
import { graphRecords, layoutWorkbench } from '../src/utils/workbenchGraph.js';
import { highlightedRelations } from '../src/utils/workbenchFocus.js';

const asset=(source_id,algorithm='RSA',extra={})=>({source_id,file_name:`${source_id}/same.py`,algorithm,finding_count:1,targets:['ML-KEM'],...extra});

test('同名文件不合并，同一文件的不同算法共用文件节点且保留计数',()=>{
  const graph=layoutWorkbench({assets:[asset('first'),asset('first','DSA'),asset('second','ECDSA')]},'migration');
  assert.equal(graph.files,2); assert.equal(graph.count,3);
  assert.equal(graph.nodes.filter(n=>n.kind==='file').length,2);
  assert.equal(graph.nodes.find(n=>n.id==='file:first').detail,'2 项发现');
  const left=graph.links.filter(e=>e.source==='file:first');
  assert.equal(left.length,2); assert.notEqual(left[0].a[1],left[1].a[1]);
  assert.ok(graph.nodes.find(n=>n.id==='file:first').y!==graph.nodes.find(n=>n.id==='file:second').y);
});
test('静态与证据不足分别成线；待确认项不获得静态迁移参考',()=>{
  const graph=layoutWorkbench({assets:[asset('a'),asset('a','RSA',{verification_status:'pending',finding_count:3,
    migration_references:[{label:'ML-DSA',kind:'reference'}]})]},'migration');
  const pending=graph.nodes.find(n=>n.kind==='algorithm' && n.status==='pending');
  const edge=graph.links.find(e=>e.source===pending.id);
  assert.equal(graph.nodes.find(n=>n.id===edge.target).referenceLabel,'');
  const focus=highlightedRelations(graph,[edge.id]);
  assert.ok([...focus.edges.keys()].every(id=>graph.links.find(e=>e.id===id).status==='pending'));
});
test('历史缺项、未知算法及空输入不崩溃，也不推测迁移方案',()=>{
  const graph=layoutWorkbench({assets:[null,{},asset('legacy',undefined,{algorithm:undefined,targets:null,verification_status:'pending'})]},'migration');
  assert.equal(graph.files,1);
  assert.equal(graph.nodes.find(n=>n.kind==='algorithm').label,'算法待确认');
  assert.ok(graph.nodes.filter(n=>n.kind==='reference').every(n=>!n.referenceLabel));
  assert.equal(layoutWorkbench({assets:null},'migration').nodes.length,0);
});
test('条件迁移备选合并为一个参考，不将发现数量相乘',()=>{
  const graph=graphRecords({assets:[asset('s','RSA',{finding_count:3,migration_references:[
    {label:'签名：ML-DSA',kind:'conditional'},{label:'密钥建立：ML-KEM',kind:'conditional'},
  ]})]},'migration');
  assert.equal(graph.nodes.length,3); assert.equal(graph.links.length,2);
  assert.deepEqual(graph.links.map(l=>l.value),[3,3]);
  assert.equal(graph.nodes.find(n=>n.kind==='reference').conditional,true);
});
test('筛选后不保留旧节点，长文件与单节点在当前布局中完整保留',()=>{
  const assets=[asset('one','RSA',{file_name:'中文目录/'.repeat(20)+'rsa_config.py'}),asset('two','ECDSA')];
  const graph=layoutWorkbench({assets},'migration',{query:'rsa_config'});
  assert.equal(graph.files,1); assert.equal(graph.count,1);
  assert.equal(graph.nodes.find(n=>n.kind==='file').label,assets[0].file_name);
  assert.ok(graph.nodes.every(n=>Number.isFinite(n.x) && Number.isFinite(n.y) && n.width>0 && n.height>0));
  assert.equal(layoutWorkbench({assets},'migration',{query:'missing'}).nodes.length,0);
});
