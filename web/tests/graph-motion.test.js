import test from 'node:test';
import assert from 'node:assert/strict';
import { highlightedRelations, sceneFocus, createFocusMotion } from '../src/utils/workbenchFocus.js';
import { nodeDecoration } from '../src/utils/graphDecoration.js';
import { fitGraph } from '../src/utils/workbenchScene.js';

const graph = {
  mode:'migration',
  nodes:[{id:'f1',kind:'file'},{id:'f2',kind:'file'},{id:'a',kind:'algorithm'},{id:'b',kind:'algorithm'},{id:'r',kind:'reference'}],
  links:[{id:'left1',source:'f1',target:'a',groupKey:'a',color:'teal'},
    {id:'left2',source:'f2',target:'a',groupKey:'a',color:'teal'},
    {id:'right',source:'a',target:'r',groupKey:'a',color:'teal'},
    {id:'otherLeft',source:'f1',target:'b',groupKey:'b',color:'teal'},
    {id:'otherRight',source:'b',target:'r',groupKey:'b',color:'teal'}],
};
test('左侧悬浮只联动自身与右侧，右侧悬浮才收集对应左侧',()=>{
  const left=highlightedRelations(graph,['left1']);
  assert.deepEqual([...left.edges.keys()],['left1','right']);
  assert.ok(!left.nodes.has('f2'));
  const right=highlightedRelations(graph,['right']);
  assert.deepEqual(new Set(right.edges.keys()),new Set(['left1','left2','right']));
  assert.ok(!right.edges.has('otherRight'),'相同颜色与共享参考都不能扩大路径');
});
test('节点与调用上下文保持关联；聚合悬浮覆盖其真实成员',()=>{
  assert.equal(highlightedRelations(graph,['a']).edges.size,3);
  const calls={...graph,mode:'calls'};
  assert.equal(highlightedRelations(calls,['left1']).edges.size,3);
  const scene={nodes:[],edges:[{id:'merged',members:['left1','otherLeft']}]};
  const focus=sceneFocus(graph,scene,'merged','');
  assert.deepEqual(new Set(focus.edges.keys()),new Set(['left1','right','otherLeft','otherRight']));
  assert.equal(sceneFocus(graph,scene,'','').dim,0);
});
test('渐显、打断及渐隐连续，160毫秒收敛；减少动画直接完成',()=>{
  const motion=createFocusMotion(),left=highlightedRelations(graph,['left1']);
  motion.set(left,0);
  assert.equal(motion.sample(0).edges.size,0);
  const midway=motion.sample(80);
  assert.equal(midway.edges.get('left1'),.5);
  motion.set(highlightedRelations(graph,['otherLeft']),80);
  assert.equal(motion.sample(80).edges.get('left1'),.5);
  assert.equal(motion.sample(240).edges.get('otherLeft'),1);
  assert.ok(!motion.sample(240).edges.has('left1'));
  motion.set(highlightedRelations(graph,[]),240);
  assert.ok(motion.sample(320).dim>0 && motion.sample(320).dim<1);
  assert.equal(motion.sample(400).dim,0);
  assert.equal(motion.sample(400).running,false);
  motion.set(left,500);
  assert.equal(motion.sample(500,true).edges.get('right'),1);
  assert.equal(motion.sample(500,true).running,false);
});
test('卡片装饰共用垂直中心且较文字显著减弱，低倍聚合不添加水印',()=>{
  const base={x:20,y:30,width:300,height:60,scale:1};
  const algorithm=nodeDecoration({...base,kind:'algorithm',watermark:'DH'});
  assert.equal(algorithm.y,60); assert.ok(algorithm.opacity<.04);
  const file=nodeDecoration({...base,kind:'file'}),reference=nodeDecoration({...base,kind:'reference'});
  assert.notEqual(file.path,reference.path);
  assert.equal(file.y,reference.y);
  assert.equal(nodeDecoration({...base,kind:'file',aggregated:true}),null);
});
test('窄屏复位为换行的工具及图例预留实际高度',()=>{
  const graph={width:700,height:800},size={width:356,height:434,bottomInset:234};
  const view=fitGraph(graph,size);
  assert.ok(view.y+graph.height*view.scale < size.height-154-12-8);
});
