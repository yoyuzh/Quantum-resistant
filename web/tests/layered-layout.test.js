import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BoxGeometry, Euler, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, PerspectiveCamera, Quaternion, Raycaster, Spherical, Vector3 } from 'three';
import { repositoryAtlas } from '../src/utils/repositoryAtlas.js';
import { categoryScale, repositoryCategories } from '../src/utils/repositoryCategories.js';
import { groupedRepositoryGraph } from '../src/utils/repositoryGraph.js';
import { layeredLayout, spatialFocus } from '../src/composables/useLayered3DLayout.js';
import { cameraShot, layerAim, layerPoses, SPATIAL_FOV } from '../src/utils/layeredCamera.js';
import { spatialProjection, solveLayerSpacing } from '../src/utils/spatialReflow.js';
import { edgePlan, pickSpatialTarget } from '../src/utils/layeredObjects.js';
import { createLayeredTextures } from '../src/utils/layeredTextures.js';

const seed = JSON.parse(readFileSync(new URL('../repository-seed.json',import.meta.url)));
const atlas = repositoryAtlas(seed);
const groups = repositoryCategories(atlas.rows);
const status = 'confirmed';
const graph = expanded=>groupedRepositoryGraph(groups,expanded,1,atlas.rankings[status],status,1000,'',categoryScale(groups,status));

test('折叠时只有类别和算法，展开保持原计数与线宽',()=>{
  const base = graph(''), expanded = graph('category:identity');
  const overview = layeredLayout(base,'atlas');
  const layout = layeredLayout(expanded,'atlas');
  assert.deepEqual(overview.layers.map(layer=>layer.depth),[300,-300]);
  assert.equal([...overview.nodes.values()].filter(n=>n.kind==='file').length,0);
  assert.equal(overview.links.length,41);
  assert(overview.links.every(e=>!e.branch));
  assert.deepEqual(layout.layers.map(layer=>layer.depth),[300,0,-300]);
  assert.equal(layout.layers[1].data.length,7);
  assert.equal(layout.links.filter(e=>e.branch).length,7);
  const confirmed = seed.repos.flatMap(repo=>repo.algorithm_inventory.groups)
    .filter(group=>group.status===status).reduce((total,group)=>total+group.count,0);
  for (const view of [overview,layout]) {
    assert.equal(view.links.reduce((total,edge)=>total+(edge.value || 0),0),confirmed);
  }
  for (const edge of layout.links.filter(e=>!e.branch)) {
    assert.equal(edge.band,expanded.links.find(e=>e.id===edge.id).band);
  }
  const zero = layout.nodes.get('repo:pyauth/pyotp'), busy = layout.nodes.get('repo:jpadilla/pyjwt');
  assert(zero.size[2]<busy.size[2]);
  assert.equal(zero.position.z,0);
  assert.equal(spatialFocus(layout,'category:identity').nodes.has('algorithm:RSA'),true);
});

test('跨层曲线保持归属、端点方向与 Worker 的来源语义',()=>{
  const file = {id:'src',kind:'file',label:'source.py',sourceId:'src-id',line:7,y:5};
  const operation = {id:'op',kind:'algorithm',label:'RSA',y:25};
  const reference = {id:'ref',kind:'reference',label:'参考',y:52};
  const input = {nodes:[file,operation,reference],links:[
    {id:'import',source:'src',target:'op',status:'confirmed',value:5},
    {id:'migration',source:'op',target:'ref',status:'ai_assessed',value:3},
  ]};
  const result = layeredLayout(input,'workbench');
  assert.deepEqual([...result.nodes.values()].map(node=>node.position.z),[250,0,-250]);
  assert.equal(result.nodes.get('src').sourceId,'src-id');
  for (const edge of result.links) {
    const {v0,v1,v2,v3} = edge.curve;
    assert.deepEqual([v0.x,v0.y,v3.x,v3.y],[v1.x,v1.y,v2.x,v2.y]);
    assert.equal(v1.z,(v0.z+v3.z)/2);
    assert.equal(v1.z,v2.z);
    assert(v0.z>v3.z);
  }
});

test('窄屏取景有限，逐层正视直接对准所选切面',()=>{
  const layout = layeredLayout(graph('category:identity'),'atlas',true);
  assert(layout.layers[0].center.x < 0 && layout.layers[2].center.x > 0);
  for(const review of [null,0,1,2]){
    const shot = cameraShot(layout,{aspect:.48,variant:'atlas',review,focus:[],compact:true});
    assert([...shot.position.toArray(),...shot.target.toArray(),shot.orthoHeight].every(Number.isFinite));
    if(review!==null) assert.equal(shot.position.x,shot.target.x);
  }
});

test('横屏展开或转向后，整块切面仍处于视口内',()=>{
  const layout = layeredLayout(graph('category:identity'),'atlas');
  for (const [width,height] of [[1326,612],[1166,490],[760,440]]) {
    const options = {aspect:width/height,variant:'atlas',review:null,focus:['category:identity']};
    const initial = cameraShot(layout,options);
    const home = new Spherical().setFromVector3(initial.position.clone().sub(initial.target));
    for (const yaw of [-Math.PI/5,0,Math.PI/5]) {
      const direction = new Vector3().setFromSphericalCoords(1,home.phi,home.theta+yaw);
      const shot = cameraShot(layout,{...options,direction});
      const camera = new PerspectiveCamera(SPATIAL_FOV,options.aspect,1,18000);
      camera.position.copy(shot.position);
      camera.lookAt(shot.target);
      camera.updateMatrixWorld();
      const attitude = new Quaternion().setFromEuler(layerAim(new Euler(),direction,true));
      const base = spatialProjection(camera,width,height,layerPoses(layout.layers,attitude,new Map()));
      const shifts = solveLayerSpacing(layout.layers,base,true);
      const projection = spatialProjection(camera,width,height,layerPoses(layout.layers,attitude,shifts));
      for (const layer of layout.layers) for (const x of [-1,1]) for (const y of [-1,1]) {
        const point = projection.point(layer.center.x+x*layer.width/2,layer.center.y+y*layer.height/2,layer.depth,layer.index);
        assert(point.x>=12 && point.x<=width-12 && point.y>=12 && point.y<=height-12,
          '切面留白不足 '+JSON.stringify({width,height,yaw,layer:layer.index,point}));
      }
    }
  }
});

test('本地生成的节点颜色和粗糙度贴图具有刻纹与色阶',()=>{
  const materials = createLayeredTextures();
  assert.deepEqual(Object.keys(materials),['category','file','algorithm']);
  for (const {map,roughnessMap} of Object.values(materials)) {
    for (const texture of [map,roughnessMap]) {
      const {data,width,height} = texture.image;
      assert.equal(data.length,width*height*4);
      assert.notEqual(data[0],data[Math.floor(data.length/8)*4]);
      assert.equal(texture.generateMipmaps,true);
      texture.dispose();
    }
  }
});

test('工作台主干预算优先保留焦点关系',()=>{
  const links = Array.from({length:640},(_,id)=>({id,band:id}));
  assert.equal(edgePlan({links},new Set([0]),false).length,180);
  assert.equal(edgePlan({links},new Set([0]),true).length,420);
  assert.equal(edgePlan({links},new Set([0]),false)[0].id,0);
});

test('点击前层底座或节点不会选中被遮挡的后层节点或经过的连线',()=>{
  const material = new MeshBasicMaterial();
  function node(id,x,z,width) {
    const mesh = new InstancedMesh(new BoxGeometry(width,2,1),material,1);
    mesh.setMatrixAt(0,new Matrix4().makeTranslation(x,0,z));
    mesh.userData.ids = [id];
    return mesh;
  }
  const front = node('front',0,3,1);
  const pad = node('front',0,3,2);
  const back = node('back',.8,0,2);
  const board = new Mesh(new BoxGeometry(10,10,1),material);
  board.position.z = 2;
  board.updateMatrixWorld();
  const edge = new Mesh(new BoxGeometry(2,1,1),material);
  edge.position.z = 5;
  edge.userData.edge = {id:'link'};
  edge.updateMatrixWorld();
  const surfaces = [front,pad,back,board];
  const ray = new Raycaster(new Vector3(.8,0,8),new Vector3(0,0,-1));
  assert.deepEqual(pickSpatialTarget(ray,surfaces,[edge]),{id:'front',edge:false});
  ray.ray.origin.x = 0;
  assert.deepEqual(pickSpatialTarget(ray,surfaces,[edge]),{id:'front',edge:false});
  ray.ray.origin.x = 1.3;
  assert.equal(pickSpatialTarget(ray,surfaces,[edge]),null);
  ray.ray.origin.x = .8;
  assert.deepEqual(pickSpatialTarget(ray,[back,board],[edge]),{id:'link',edge:true});
});

test('三块切面分别以世界坐标中心为转轴，只有遮挡偏移改变锚点',()=>{
  const layers = [300,0,-300].map((z,index)=>({index,center:new Vector3(index*210-210,27,z)}));
  const offsets = new Map([[1,new Vector3(-28,16,0)]]);
  for (const angle of [0,.5,Math.PI/2,Math.PI,Math.PI*1.5]) {
    const attitude = new Quaternion().setFromAxisAngle(new Vector3(0,1,0),angle);
    const poses = layerPoses(layers,attitude,offsets);
    for (const {index,center} of layers) {
      const {matrix} = poses.get(index);
      const expected = center.clone().add(offsets.get(index) || new Vector3());
      assert(center.clone().applyMatrix4(matrix).distanceTo(expected)<1e-9);
      const normal = new Vector3(0,0,1).transformDirection(matrix);
      assert(normal.distanceTo(new Vector3(0,0,1).applyQuaternion(attitude))<1e-9);
    }
  }
});
