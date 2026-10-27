export function flowRecords(assets) {
  const nodes = new Map(), links = new Map();
  function node(id, data) {
    if (!nodes.has(id)) nodes.set(id, { id, ...data });
    return id;
  }
  function link(source, target, value, status) {
    const key = JSON.stringify([source, target, status]);
    const item = links.get(key) || { source, target, value: 0, status };
    item.value += value;
    links.set(key, item);
  }
  for (const asset of assets) {
    const value = Number(asset.finding_count) || 0;
    if (value <= 0 || !asset.source_id) continue;
    const status = asset.verification_status || 'confirmed';
    const file = node('file:' + asset.source_id, {
      kind: 'file', label: asset.file_name || asset.source_id, sourceId: asset.source_id, status,
    });
    const algorithm = node(JSON.stringify(['algorithm', asset.algorithm, asset.purpose, status]), {
      kind: 'algorithm', label: asset.algorithm, detail: (asset.purpose || '用途待确认')+(asset.purpose_origin==='ai'?' · AI用途':''),
      algorithm: asset.algorithm, status,
    });
    const refs = status === 'pending' ? [] : asset.migration_references || [];
    const labels = refs.length ? refs.map(r => r.label) : asset.targets || [];
    const conditional = refs.some(r => r.kind === 'conditional');
    const label = labels.join('；') || '补充算法或用途证据';
    const target = node(JSON.stringify(['reference', label, conditional]), {
      kind: 'reference', label, referenceLabel: labels.length ? label : '', conditional, status,
      detail: conditional ? '有条件参考' : labels.length ? '按用途评估兼容性' : '证据不足',
    });
    link(file, algorithm, value, status);
    link(algorithm, target, value, status);
  }
  return { nodes: [...nodes.values()], links: [...links.values()] };
}

export function wrapDiagramText(text, width, limit = 3, font = 14) {
  const lines = [''];
  let used = 0;
  const chars = [...String(text || '')];
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i], size = /[^\u0000-\u00ff]/.test(char) ? font : font * .59;
    if (used + size > width && lines.at(-1)) {
      if (lines.length === limit) {
        lines[limit - 1] = lines.at(-1).slice(0, -1) + '…';
        break;
      }
      lines.push(''); used = 0;
    }
    lines[lines.length - 1] += char;
    used += size;
  }
  if(lines.length>1 && lines.at(-1).length<4 && lines.at(-2).length>10){
    lines[lines.length-1]=lines.at(-2).slice(-6)+lines.at(-1);
    lines[lines.length-2]=lines.at(-2).slice(0,-6);
  }
  return lines;
}
