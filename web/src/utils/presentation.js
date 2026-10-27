// Display identities only where names are ambiguous; never replace source_id keys.
export function fileLabel(item, peers = []) {
  const name = item.file_name ?? item.label ?? '';
  const id = item.source_id ?? item.key ?? '';
  const ids = [...new Set(peers.filter((peer) => (peer.file_name ?? peer.label) === name)
    .map((peer) => peer.source_id ?? peer.key).filter(Boolean))].sort();
  if (ids.length < 2) return name;
  const suffix = String(id).slice(-6);
  const ambiguous = ids.filter((value) => String(value).slice(-6) === suffix).length > 1;
  return `${name} · ${ambiguous ? id : suffix}`;
}

export function conciseInsights(result) {
  const integrated=result.integrated_analysis?.findings;
  if (Array.isArray(integrated)) {
    const rows=integrated.filter(r=>r.verification_status!=='pending');
    const algorithms=new Map(),files=new Map();
    for (const row of rows) {
      algorithms.set(row.algorithm,(algorithms.get(row.algorithm) || 0)+1);
      const item=files.get(row.source_id) || {file_name:row.file_name,source_id:row.source_id,count:0};
      item.count++;files.set(row.source_id,item);
    }
    const topAlgorithm=[...algorithms].sort((a,b)=>b[1]-a[1] || a[0].localeCompare(b[0]))[0];
    const topFile=[...files.values()].sort((a,b)=>b.count-a.count || a.file_name.localeCompare(b.file_name))[0];
    const items=[];
    if (topAlgorithm) items.push({title:'主要算法',value:topAlgorithm[0],detail:topAlgorithm[1]+' 项发现'});
    if (topFile) items.push({title:'命中最多',value:fileLabel(topFile,result.sources || rows),detail:topFile.count+' 项发现'});
    const unknown=rows.filter(r=>(r.effective_purpose_code || r.purpose_code || 'unknown')==='unknown').length;
    if (unknown) items.push({title:'用途待确认',value:unknown+' 项',detail:'查看用途证据',filter:{purpose:'unknown'}});
    return items;
  }
  const insights = result.analysis?.insights;
  const algorithms = insights?.algorithms ?? Object.entries(result.summary?.algorithm_counts || {})
    .map(([key, count]) => ({ label: key, count })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  const items = [];
  if (algorithms.length) items.push({ title: '主要算法', value: algorithms[0].label, detail: `${algorithms[0].count} 项发现` });
  if (insights?.files?.length) {
    const top = insights.files[0];
    items.push({ title: '命中最多', value: fileLabel(top, result.sources || insights.files), detail: `${top.count} 项发现` });
  }
  const pending = insights?.purposes?.find((row) => row.label.includes('待确认'));
  if (pending?.count) items.push({ title: '用途待确认', value: `${pending.count} 项`, detail: '结合调用上下文复核' });
  return items;
}
