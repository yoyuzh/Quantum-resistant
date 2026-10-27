import { hierarchy, treemap, treemapBinary } from 'd3-hierarchy';
import { wrapDiagramText } from './flowPacking.js';

export function fileTiles(files, width, height, expanded = false) {
  if (!files.length) return { tiles: [], grouped: 0 };
  const capacity = expanded ? files.length : Math.max(2, Math.min(10, Math.floor(width * height / 26000)));
  const sorted = [...files].sort((a,b)=>b.count-a.count || a.name.localeCompare(b.name));
  const shown = sorted.slice(0, capacity);
  if (sorted.length > capacity) {
    const rest = sorted.slice(capacity-1);
    shown.splice(capacity-1, 1, {id:'other-files', name:`其他 ${rest.length} 个文件`, count:rest.reduce((n,f)=>n+f.count,0),
      ai:rest.reduce((n,f)=>n+(f.ai || 0),0), pending:rest.reduce((n,f)=>n+(f.pending || 0),0), members:rest});
  }
  // Reserve readable space for very small values. Labels always show actual counts.
  const total=shown.reduce((sum,f)=>sum+f.count,0);
  const root=hierarchy({children:shown}).sum(d=>d.count ? Math.max(d.count,total/(shown.length*3)) : 0);
  const tiles=treemap().tile(treemapBinary).size([width,height]).paddingInner(4).round(true)(root).leaves();
  return {grouped:sorted.length > capacity ? sorted.length-capacity+1 : 0, tiles:tiles.map((node,index)=>{
    const w=node.x1-node.x0,h=node.y1-node.y0;
    let font=Math.max(14,Math.min(26,Math.sqrt(w*h)/9));
    let lines=[];
    let block;
    do {
      const limit=h>=font*4.5?2:1;
      lines=wrapDiagramText(node.data.name.split(/[\\/]/).at(-1),Math.max(16,w-24),limit,font);
      block=lines.length*font*1.2+6+font*1.3;
      if(block<=h-16)break;
      font-=1;
    }while(font>=14);
    font=Math.max(14,font);
    if(block>h-12){lines=[];block=font*1.3;}
    const top=node.y0+(h-block)/2;
    const labelY=top+font*.92;
    const countY=top+lines.length*font*1.2+(lines.length?6:0)+font*.96;
    return {...node,number:index+1,lines,font,labelY,countY};
  })};
}
