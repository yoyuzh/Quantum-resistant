import test from 'node:test';
import assert from 'node:assert/strict';
import { graphRecords,layoutWorkbench,visibleGraph } from '../src/utils/workbenchGraph.js';
import { graphScene,fitGraph } from '../src/utils/workbenchScene.js';
import { modelStatus } from '../src/utils/modelProfiles.js';

const assets=Array.from({length:5000},(_,i)=>({source_id:`s${i}`,file_name:`packages/crypto/long_file_${i}.py`,algorithm:i%2?'RSA':'ECDSA',purpose:'数字签名',purpose_codes:['sign'],verification_status:i%3?'confirmed':'ai_assessed',finding_count:1,migration_references:[{label:'ML-DSA / SLH-DSA',kind:'reference'}]}));
const data={assets,sources:assets.map(a=>({source_id:a.source_id,file_name:a.file_name})),findings:[],calls:[]};
test('full graph retains 5000 sources with complete relationship endpoints',()=>{
  const start=performance.now(),graph=layoutWorkbench(data,'migration');
  assert.equal(graph.files,5000);assert.equal(graph.count,5000);
  assert.equal(graph.nodes.filter(n=>n.kind==='file').length,5000);
  const ids=new Set(graph.nodes.map(n=>n.id));
  assert.ok(graph.links.every(l=>ids.has(l.source) && ids.has(l.target)));
  const current=visibleGraph(graph,{x:0,y:0,scale:1},1200,700);
  assert.ok(current.nodes.length<60);
  assert.equal(graph.links.reduce((sum,l)=>sum+l.value,0),10000);
  const scene=graphScene(graph,fitGraph(graph,{width:1200,height:700}),{width:1200,height:700});
  assert.ok(scene.aggregated);
  assert.equal(scene.nodes.reduce((n,node)=>n+node.members.length,0),graph.nodes.length);
  assert.equal(scene.edges.reduce((n,edge)=>n+edge.count,0),10000);
  assert.ok(scene.nodes.length<60);
  console.log(JSON.stringify({graph5000LayoutMs:Math.round(performance.now()-start),nodes:graph.nodes.length,links:graph.links.length,viewportNodes:current.nodes.length}));
});
test('filtering preserves distinct source IDs, state and full search coverage',()=>{
  const selected=layoutWorkbench(data,'migration',{query:'long_file_4999.py'});
  assert.equal(selected.files,1);assert.ok(selected.nodes.some(n=>n.sourceId==='s4999'));
  const ai=graphRecords(data,'migration',{status:'ai_assessed'});
  assert.equal(ai.count,1667);
});
test('call graph does not invent calls for definitions or turn AI associations into static calls',()=>{
  const result={sources:[{source_id:'s',file_name:'factory.py'},{source_id:'a',file_name:'caller.py'}],calls:[{id:'def',source_id:'s',line:3,algorithm:'ECC',context_kind:'uninstantiated_template',call_chain:[]},{id:'ai',source_id:'s',line:7,algorithm:'RSA',context_kind:'ai_evidence',verification_status:'ai_assessed',call_chain:[{source_id:'a',start_line:8}]}]};
  const graph=layoutWorkbench(result,'calls');
  assert.equal(graph.nodes.length,3);assert.equal(graph.links.length,1);
  assert.equal(graph.links[0].label,'关联');assert.equal(graph.links[0].status,'ai_assessed');
});
test('profile availability never equates saved settings with tested connectivity',()=>{
  assert.equal(modelStatus({}),'未启用模型');
  assert.equal(modelStatus({id:'a',has_key:true,consent:true,ready:true}),'已配置 · 未测试');
  assert.equal(modelStatus({id:'a',credential_unavailable:true}),'凭据未恢复');
  assert.equal(modelStatus({id:'a',has_key:true,consent:true,connection:{status:'tested'}}),'连接测试通过');
});


test('当前视图导出保留状态线型、说明并转义标签', async () => {
  const {workbenchSvg}=await import('../src/utils/workbenchSvg.js');
  const graph={nodes:[{id:'a',x:0,y:0,width:200,height:60,lines:['<unsafe>'],detail:'AI用途',status:'ai_assessed'}],links:[{id:'l',source:'a',target:'b',a:[200,30],b:[400,30],color:'#16877f',status:'ai_assessed'}]};
  const svg=workbenchSvg(graph,{x:0,y:0,scale:1},{width:800,height:500},{surface:'#fff',background:'#eee',text:'#111',secondary:'#555',border:'#ddd'});
  assert.ok(svg.includes('stroke-dasharray="8 4"'));
  assert.ok(svg.includes('&lt;unsafe&gt;'));
  assert.ok(svg.includes('AI研判 · AI用途'));
  assert.ok(!svg.includes('<unsafe>'));
});


test('同一节点的多条关系使用独立端口',()=>{
  const graph=layoutWorkbench({assets:[
    {source_id:'one',file_name:'one.py',algorithm:'RSA',purpose:'签名',finding_count:1,targets:['ML-DSA']},
    {source_id:'one',file_name:'one.py',algorithm:'ECDSA',purpose:'签名',finding_count:1,targets:['ML-DSA']},
  ]},'migration');
  const edges=graph.links.filter(e=>e.source==='file:one');
  assert.equal(edges.length,2);
  assert.notEqual(edges[0].a[1],edges[1].a[1]);
});
