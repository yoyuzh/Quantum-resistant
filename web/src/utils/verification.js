export const statusLabel = value => ({ confirmed:'静态确认', ai_assessed:'AI研判', pending:'证据不足' })[value] || '静态确认';
export const statusOptions = [{value:'',label:'全部状态'}, ...['confirmed','ai_assessed','pending'].map(value=>({value,label:statusLabel(value)}))];

export function visualizationRows(result) {
  return result?.integrated_analysis?.findings || result?.findings || [];
}

export function distribution(result) {
  const groups=new Map();
  for (const row of visualizationRows(result)) {
    if (!groups.has(row.algorithm)) groups.set(row.algorithm,{algorithm:row.algorithm,confirmed:0,ai_assessed:0,pending:0});
    groups.get(row.algorithm)[row.verification_status || 'confirmed']++;
  }
  return [...groups.values()].sort((a,b)=>(b.confirmed+b.ai_assessed+b.pending)-(a.confirmed+a.ai_assessed+a.pending));
}
