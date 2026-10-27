import { layoutWorkbench } from '../utils/workbenchGraph.js';
self.onmessage=event=>{
  try {
    const start=performance.now();
    const graph=layoutWorkbench(event.data.data,event.data.mode,event.data.filter);
    self.postMessage({ticket:event.data.ticket,graph,duration_ms:Math.round(performance.now()-start)});
  }
  catch { self.postMessage({ticket:event.data.ticket,error:'图布局未完成，请缩小筛选范围后重试。'}); }
};
