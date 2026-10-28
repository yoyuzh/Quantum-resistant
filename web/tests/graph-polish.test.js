import test from 'node:test';
import assert from 'node:assert/strict';
import { fileTiles } from '../src/utils/fileDistribution.js';
import { layoutWorkbench } from '../src/utils/workbenchGraph.js';
import { fitGraph, zoomView, nearestEdge, graphScene, MAX_ZOOM, MIN_ZOOM } from '../src/utils/workbenchScene.js';
import { highlightedRelations } from '../src/utils/workbenchFocus.js';
import { textRows } from '../src/utils/workbenchRender.js';

const files = [5,3,2,2,1,1,1].map((count,i)=>({id:'s'+i,name:'risky_very_long_file_name_'+i+'.py',count}));
const data = {assets:files.flatMap((f,i)=>Array.from({length:i%3+1},(_,j)=>({source_id:f.id,file_name:f.name,
  algorithm:['DH','DSA','ECC','ECDH','RSA','ECDSA','X25519'][i],purpose:j?'密钥生成 · AI用途':'用途待确认',
  verification_status:'confirmed',finding_count:1,migration_references:[{label:'签名场景：ML-DSA / SLH-DSA；密钥建立场景：ML-KEM',kind:'conditional'}]})))};

test('树图数量与名称作为整体居中，短区域数量不触及裁剪边界',()=>{
  for(const [width,height] of [[1125,245],[600,180],[330,200],[1400,800]]) {
    const tiles=fileTiles(files,width,height).tiles;
    assert.equal(tiles.reduce((n,t)=>n+t.data.count,0),15);
    for(const t of tiles) {
      assert.ok(t.countY+t.font*.25<=t.y1-6,JSON.stringify({width,height,y0:t.y0,y1:t.y1,countY:t.countY,font:t.font}));
      assert.ok(t.countY-t.font>=t.y0+6);
      if(t.lines.length)assert.ok(t.labelY-t.font*.85>=t.y0+5);
    }
  }
});

function cutsNode(a,b,node) {
  const left=node.x+1,right=node.x+node.width-1,top=node.y+1,bottom=node.y+node.height-1;
  if(a[0]===b[0])return a[0]>left && a[0]<right && Math.max(a[1],b[1])>top && Math.min(a[1],b[1])<bottom;
  return a[1]>top && a[1]<bottom && Math.max(a[0],b[0])>left && Math.min(a[0],b[0])<right;
}
test('迁移通道避开卡片，长说明按真实文字行数分配高度',()=>{
  const graph=layoutWorkbench(data,'migration');
  for(const node of graph.nodes) {
    for(const row of textRows({...node,scale:1}))assert.ok(row.y+row.size*.25<node.y+node.height);
    for(const other of graph.nodes)if(node!==other)assert.ok(node.x+node.width<=other.x || other.x+other.width<=node.x || node.y+node.height<=other.y || other.y+other.height<=node.y);
  }
  for(const edge of graph.links)for(let i=1;i<edge.points.length;i++)for(const node of graph.nodes) {
    if(node.id!==edge.source && node.id!==edge.target)assert.ok(!cutsNode(edge.points[i-1],edge.points[i],node),edge.id+' cuts '+node.id);
  }
});
test('悬浮路径同时关联文件端与迁移端，不沿共享迁移目标误选其他算法',()=>{
  const graph=layoutWorkbench(data,'migration');
  const edge=graph.links.find(e=>e.source.startsWith('file:'));
  const focus=highlightedRelations(graph,[edge.id]), related=graph.links.filter(e=>focus.edges.has(e.id));
  assert.ok(related.some(e=>e.target===edge.target));
  assert.ok(related.some(e=>e.source===edge.target));
  assert.equal(new Set(related.map(e=>e.color)).size,1);
  assert.ok(related.length<graph.links.length);
});
test('复位完整居中，指针缩放保持锚点且覆盖扩展倍率',()=>{
  const graph=layoutWorkbench(data,'migration'),size={width:1280,height:640},view=fitGraph(graph,size);
  assert.ok(view.x>=0 && view.y>=0);
  assert.ok(view.x+graph.width*view.scale<=size.width);
  assert.ok(view.y+graph.height*view.scale<=size.height-60);
  const x=233,y=110,next=zoomView(view,1.5,x,y);
  assert.ok(Math.abs((x-view.x)/view.scale-(x-next.x)/next.scale)<1e-8);
  assert.equal(zoomView(view,1e9,x,y).scale,MAX_ZOOM);
  assert.equal(zoomView(view,1e-10,x,y).scale,MIN_ZOOM);
});
test('选取最近的连线，不因数组顺序选中旁边路径',()=>{
  const a={id:'far',points:[[0,0],[100,0]]},b={id:'near',points:[[0,7],[100,7]]};
  assert.equal(nearestEdge([a,b],{x:40,y:6}).id,'near');
});
test('调用图合并重复位置并用导入关系连接到定义，不虚构执行',()=>{
  const graph=layoutWorkbench({sources:[{source_id:'s',file_name:'factory.py'}],calls:[{id:'one',source_id:'s',line:6,algorithm:'ECC',api:'ec.generate_private_key',context_kind:'uninstantiated_template',evidence_ids:['p']}],
    evidencePaths:[{evidence_id:'p',nodes:[{node_id:'a',location:{source_id:'s',start_line:2}},{node_id:'b',location:{source_id:'s',start_line:6}}],edges:[{source_node:'a',target_node:'b',edge_type:'IMPORT_BINDING'}]}]},'calls');
  assert.equal(graph.nodes.length,2);assert.equal(graph.links.length,1);assert.equal(graph.links[0].label,'导入');
  assert.ok(graph.nodes.some(n=>n.badge==='导入位置'));
  assert.ok(graph.nodes.some(n=>n.badge==='定义处'));
  assert.ok(graph.nodes.find(n=>n.role==='operation').x>graph.nodes.find(n=>n.role==='import').x);
  const scene=graphScene(graph,fitGraph(graph,{width:1200,height:700}),{width:1200,height:700});
  assert.equal(scene.nodes.length,2);
});



test('居中消息替换后，旧操作清理不能关闭新提示',async()=>{
  const {notify,notice,dismissNotice}=await import('../src/composables/useNotice.js');
  const old=notify('报告已生成'),current=notify('保存失败','error');
  dismissNotice(old);assert.equal(notice.value.id,current);assert.ok(notice.value.duration>0 && notice.value.duration<=8000);
  dismissNotice(current);assert.equal(notice.value,null);
});
