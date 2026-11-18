import test from 'node:test';
import assert from 'node:assert/strict';
import { CubicBezierCurve3, Euler, OrthographicCamera, Quaternion, TubeGeometry, Vector3 } from 'three';
import { intersects, solveLayerSpacing, solveSpatialReflow, spatialProjection } from '../src/utils/spatialReflow.js';
import { createViewSettle, followLayerAim, layerAim, layerPoses } from '../src/utils/layeredCamera.js';
import { movePipePoint, pipeMotion } from '../src/utils/spatialPipeMotion.js';

test('同一投影里的仓库自动错开并保留原切面与节点顺序',()=>{
  const camera = new OrthographicCamera(-180,180,160,-160,1,1200);
  camera.position.set(0,0,700);
  camera.lookAt(0,0,0);
  camera.updateMatrixWorld();
  const projection = spatialProjection(camera,360,320);
  const center = new Vector3();
  const layers = [{index:0,center:new Vector3(0,0,150),width:300,height:260},
    {index:1,center,width:300,height:260}];
  const first = {id:'a',position:new Vector3(-14,0,0),size:[44,30,20],row:true,layer:1};
  const second = {id:'b',position:new Vector3(14,0,0),size:[44,30,20],row:true,layer:1};
  const far = {id:'c',position:new Vector3(0,0,150),size:[26,30,20],layer:0};
  const layout = {layers,nodes:new Map([first,second,far].map(n=>[n.id,n]))};
  assert(intersects(projection.body(first,first.position),projection.body(second,second.position)));
  const {offsets,hints} = solveSpatialReflow(layout,projection,{nodes:new Set()},'atlas',()=>({w:92,h:33}));
  assert(offsets.size>0);
  assert.equal(hints.size,2);
  const position = n => n.position.clone().add(offsets.get(n.id) || center);
  const boxes = [first,second,far].map(n=>{
    const pos = position(n);
    assert.equal(pos.z,n.position.z);
    return projection.body(n,pos);
  });
  for (const [i,box] of boxes.entries()) assert(!boxes.slice(i+1).some(b=>intersects(box,b)));
  assert(position(first).x<position(second).x);
});

test('管道两端随各自节点移动，插值过程中横截面直径不变',()=>{
  const curve = new CubicBezierCurve3(new Vector3(0,0,300),new Vector3(0,0,150),
    new Vector3(90,20,150),new Vector3(90,20,0));
  const geometry = new TubeGeometry(curve,24,3,6,false), position = geometry.getAttribute('position');
  const original = position.array.slice();
  const a = new Vector3(20,-30,37), b = new Vector3(-17,9,-26);
  const motion = pipeMotion(geometry,curve,false);
  motion.update(a,b);
  assert(Math.abs(position.getX(0)-original[0]-a.x)<1e-4);
  assert(Math.abs(position.getY(0)-original[1]-a.y)<1e-4);
  assert(Math.abs(position.getZ(0)-original[2]-a.z)<1e-4);
  const end = position.count-1;
  assert(Math.abs(position.getX(end)-original[end*3]-b.x)<1e-4);
  assert(Math.abs(position.getY(end)-original[end*3+1]-b.y)<1e-4);
  assert(Math.abs(position.getZ(end)-original[end*3+2]-b.z)<1e-4);
  for (let ring=0;ring<25;ring++) {
    const i = ring*7, j = i+3;
    assert(Math.abs(new Vector3().fromBufferAttribute(position,i)
      .distanceTo(new Vector3().fromBufferAttribute(position,j))-6)<1e-4);
  }
  const at = curve.getPoint(.5);
  assert(movePipePoint(at.clone(),.5,a,b).distanceTo(at.add(a.clone().add(b).multiplyScalar(.5)))<1e-8);
  motion.update();
  assert.deepEqual(position.array,original);
  geometry.dispose();
});

test('切面随镜头转向后，屏幕坐标仍反投影到原逻辑层，标签保持正向',()=>{
  const eye = new Vector3(.73,.48,1).normalize();
  const camera = new OrthographicCamera(-210,210,180,-180,1,1500);
  camera.position.copy(eye).multiplyScalar(900);
  camera.lookAt(0,0,0);
  camera.updateMatrixWorld();
  const layers = [{index:0,center:new Vector3(-100,0,300)}];
  const poses = layerPoses(layers,camera.quaternion,new Map());
  const projection = spatialProjection(camera,420,360,poses,camera.quaternion);
  const position = new Vector3(-60,45,300);
  const screen = projection.point(position.x,position.y,position.z,0);
  assert(projection.world(screen.x,screen.y,position.z,0).distanceTo(position)<1e-8);
  assert(Math.abs(projection.point(position.x+50,position.y,position.z,0).y-screen.y)<1e-8);
});

test('连续转动推迟避让，停稳后只消费一次布局请求',()=>{
  const view = createViewSettle();
  view.touch(100);
  assert.equal(view.take(319),false);
  view.touch(300);
  assert.equal(view.pending,true);
  assert.equal(view.wait(320),200);
  assert.equal(view.take(519),false);
  assert.equal(view.take(520),true);
  assert.equal(view.pending,false);
  assert.equal(view.wait(540),null);
  assert.equal(view.take(900),false);
});

test('只在切面明显遮挡时沿 XY 拉开，重新分离时回到世界锚点',()=>{
  const camera = new OrthographicCamera(-380,380,270,-270,1,1800);
  const layers = [300,0,-300].map((depth,index)=>({index,depth,width:238,height:200,data:[{}],
    center:new Vector3((index-1)*15,0,depth)}));
  const plan = (eye,target=new Vector3())=>{
    camera.position.copy(eye);
    camera.lookAt(target);
    camera.updateMatrixWorld();
    const poses = layerPoses(layers,camera.quaternion,new Map());
    return solveLayerSpacing(layers,spatialProjection(camera,760,540,poses));
  };
  const front = new Vector3(0,0,900), side = new Vector3(850,0,400);
  assert.equal(plan(side).size,0);
  const offsets = plan(front);
  assert(offsets.size>=2);
  for (const offset of offsets.values()) assert(offset.z===0 && offset.length()<=110);
  assert(offsets.get(0).distanceTo(offsets.get(2))>80);
  assert.equal(plan(side).size,0);
  assert.equal(plan(new Vector3(720,0,900),new Vector3(720,0,0)).size,0);
});

test('面板部分跟随并平滑限角，跨过背面时朝向连续',()=>{
  const rad = degrees=>degrees*Math.PI/180;
  const view = (yaw,pitch)=>new Vector3(Math.sin(rad(yaw))*Math.cos(rad(pitch)),
    Math.sin(rad(pitch)),Math.cos(rad(yaw))*Math.cos(rad(pitch)));
  const aim = (yaw,pitch)=>layerAim(new Euler(),view(yaw,pitch));
  assert(aim(40,30).y>0 && aim(40,30).y<rad(40));
  assert(Math.abs(aim(90,80).y-rad(38))<1e-9);
  assert(Math.abs(aim(-90,-90).x-rad(26))<1e-9);
  assert(Math.abs(aim(179,0).y-aim(-179,0).y)<rad(2));

  const target = aim(90,80);
  const fine = aim(0,0), coarse = aim(0,0);
  assert(followLayerAim(fine,target,18));
  assert(fine.y>0 && fine.y<target.y);
  for (let i=0;i<9;i++) followLayerAim(fine,target,18);
  followLayerAim(coarse,target,180);
  assert(Math.abs(fine.y-coarse.y)<1e-9);
  assert(!followLayerAim(fine,target,Infinity));
  assert(fine.equals(target));
});

test('斜视下矩形包围框相交但切面轮廓分开时不触发避让',()=>{
  const camera = new OrthographicCamera(-380,380,270,-270,1,1800);
  camera.position.set(0,0,900);
  camera.lookAt(0,0,0);
  camera.updateMatrixWorld();
  const layers = [300,0].map((depth,index)=>({index,depth,width:240,height:64,data:[{}],
    center:new Vector3(index*46,-index*46,depth)}));
  const turn = new Quaternion().setFromAxisAngle(new Vector3(0,0,1),Math.PI/4);
  const poses = layerPoses(layers,turn,new Map());
  const projection = spatialProjection(camera,760,540,poses,turn);
  const shapes = layers.map(({index,center,width,height})=>
    projection.body({layer:index,size:[width*.76,height*.76,0]},center));
  assert(intersects(...shapes));
  assert.equal(solveLayerSpacing(layers,projection).size,0);
});
