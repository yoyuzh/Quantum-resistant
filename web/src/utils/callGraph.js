export function callRows(result = {}) {
  const calls=result.integrated_analysis?.calls;
  return (Array.isArray(calls) ? calls : []).filter(row => row && typeof row.source_id === 'string').map(row => ({
    ...row, algorithm:row.algorithm || '算法待确认', purpose:row.purpose || '用途待确认',
    call_chain:Array.isArray(row.call_chain) ? row.call_chain.filter(p => p && p.source_id && Number.isFinite(p.start_line)) : [],
  }));
}

export function callPath(row) {
  if (!row) return [];
  return [...row.call_chain, {source_id:row.source_id,start_line:row.line}].filter(p=>p.source_id && Number.isInteger(p.start_line) && p.start_line>0).filter((p,index,positions) =>
    index===0 || p.source_id!==positions[index-1].source_id || p.start_line!==positions[index-1].start_line);
}
