import test from 'node:test';
import assert from 'node:assert/strict';
import { wrapDiagramText } from '../src/utils/flowPacking.js';
import { fileTiles } from '../src/utils/fileDistribution.js';

test('file treemap groups small files on one page and expands without dropping any counts',()=>{
  const files=Array.from({length:50},(_,i)=>({id:String(i),name:`long_file_${i}.py`,count:i===0?10000:1}));
  const data=fileTiles(files,600,240);
  assert.ok(data.grouped>0);
  assert.equal(data.tiles.reduce((n,t)=>n+t.data.count,0),10049);
  assert.ok(data.tiles.every(t=>t.lines.length && t.font>=14));
  assert.equal(fileTiles(files,1400,1800,true).tiles.length,50);
  assert.deepEqual(fileTiles([],500,180),{tiles:[],grouped:0});
  assert.ok(wrapDiagramText('超长中文迁移条件'.repeat(50),180,3).at(-1).endsWith('…'));
});
