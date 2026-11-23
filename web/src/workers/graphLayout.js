import { layoutWorkbench } from '../utils/workbenchGraph.js';
let data;
self.onmessage=event=>{
  try {
    const start=performance.now();
    if (event.data.data!==undefined) data=event.data.data;
    const graph=layoutWorkbench(data,event.data.mode,event.data.filter);
    self.postMessage({ticket:event.data.ticket,graph,duration_ms:Math.round(performance.now()-start)});
  }
  catch { self.postMessage({ticket:event.data.ticket,error:'图布局未完成，请缩小筛选范围后重试。'}); }
};
