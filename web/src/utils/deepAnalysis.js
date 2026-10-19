export const deepStatus = {
  queued: '排队中', running: '分析中', completed: '分析完成', succeeded: '分析完成',
  partial: '部分结果', failed: '分析失败', cancelled: '已取消', skipped: '已跳过',
};
export const claimLabels = { ALGORITHM: '算法', OPERATION_TYPE: '操作类型', KEY_SOURCE: '密钥来源', QUANTUM_CLASS: '风险类别' };
export const operationLabels = { sign: '签名', verify: '验签', encrypt: '加密', decrypt: '解密', key_generation: '密钥生成', key_exchange: '密钥交换', key_import: '密钥导入', unknown: '未知操作' };
export const riskLabels = { quantum_vulnerable: '量子脆弱', symmetric: '对称密码', unknown: '风险未知' };
export const resolutionLabels = { resolved: '已解析', ambiguous: '多种可能', unknown: '未知' };
export const edgeLabels = { CALLS: '调用', IMPORT_BINDING: '导入绑定', ASSIGN_FLOW: '赋值传递', ARGUMENT_FLOW: '参数绑定', RETURN_FLOW: '返回值传递', KEY_TYPE_FLOW: '密钥类型传递' };

export function abstractText(value) {
  if (!value) return 'Unknown';
  if (value.kind === 'known') return String(value.value ?? 'null');
  const alternatives = (value.alternatives || []).map(item => String(item.value)).join(' / ');
  return value.kind === 'ambiguous' ? alternatives : `Unknown${alternatives ? `（已知候选：${alternatives}）` : ''}`;
}

export function coverageText(value) {
  return value ? `${value.count} / ${value.total == null ? '未知' : value.total}` : '未知';
}

export function sourceLimit(result) {
  const fidelity = result?.deep_analysis?.snapshot?.path_fidelity;
  const type = result?.source_type;
  if (!result?.sources?.some(source => source.content_available || source.content))
    return '源码不可用或已过期，请重新提交来源；已有基础结果仍可查看。';
  if (!result.sources.some(source => /\.pyw?$/i.test(source.relative_path || source.file_name || '')))
    return '当前来源没有 Python 文件，深度分析将跳过；基础扫描仍可用。';
  if (fidelity === 'snippet' || type === 'snippet') return '片段仅分析局部代码，无法还原未提供的模块。';
  if (fidelity === 'flat_basename' || (type === 'manual_upload' && fidelity !== 'relative_paths' && result.path_preserved === false))
    return '普通文件上传为平铺路径，关闭确定性跨模块证明。选择目录可保留相对路径。';
  if (type === 'manual_upload' && !fidelity && result.path_preserved == null)
    return '普通文件上传为平铺路径，不能进行跨模块证明；目录上传保留相对路径。当前资格以深度快照为准。';
  return '仅分析已采集的 Python 源码；缺失模块、采集截断和动态行为可能留下 Unknown。';
}

export function sourceTree(sources) {
  const roots = [];
  for (const source of sources) {
    const parts = (source.relative_path || source.file_name || source.source_id).split('/');
    let children = roots;
    parts.forEach((name, index) => {
      const path = parts.slice(0, index + 1).join('/');
      if (index === parts.length - 1) {
        const duplicate = sources.some(other => other !== source && (other.relative_path || other.file_name || other.source_id) === path);
        children.push({ name: duplicate ? `${name} · ${source.source_id}` : name, path, source });
      }
      else {
        let branch = children.find(node => node.path === path && node.children);
        if (!branch) { branch = { name, path, children: [] }; children.push(branch); }
        children = branch.children;
      }
    });
  }
  return roots;
}

export function operationPage(operations, filters = {}, page = 1, size = 8) {
  const query = (filters.query || '').trim().toLowerCase();
  const matches = operations.filter(op =>
    (!filters.algorithm || abstractText(op.algorithm) === filters.algorithm) &&
    (!filters.resolution || op.resolution_status === filters.resolution) &&
    (!filters.risk || op.risk_category === filters.risk) &&
    (!filters.type || op.operation_type === filters.type) &&
    (!filters.level || op.claims.some(claim => claim.level === filters.level)) &&
    (!filters.sourceId || [op.call_site, op.sink_location, ...op.context.call_chain].some(span => span?.source_id === filters.sourceId)) &&
    (!query || JSON.stringify([op.api, op.algorithm, op.context, op.claims]).toLowerCase().includes(query)));
  const pages = Math.max(1, Math.ceil(matches.length / size));
  const current = Math.max(1, Math.min(pages, page));
  return { items: matches.slice((current - 1) * size, current * size), total: matches.length, pages, current };
}

// Convert Python AST UTF-8 byte columns into JS UTF-16 offsets. End is exclusive.
export function byteColumnToOffset(line, column) {
  let bytes = 0;
  let offset = 0;
  for (const char of line) {
    const width = new TextEncoder().encode(char).length;
    if (bytes + width > column) break;
    bytes += width;
    offset += char.length;
  }
  return offset;
}

export function sourceWindow(content, span, radius = 5) {
  if (!span || typeof content !== 'string') return [];
  const lines = content.split('\n');
  const first = Math.max(1, span.start_line - radius);
  const last = Math.min(lines.length, span.start_line + 24, span.end_line + radius);
  return lines.slice(first - 1, last).map((text, index) => {
    const number = first + index;
    const selected = number >= span.start_line && number <= span.end_line;
    const start = selected ? byteColumnToOffset(text, number === span.start_line ? span.start_col : 0) : 0;
    const end = selected ? (number === span.end_line ? byteColumnToOffset(text, span.end_col) : text.length) : 0;
    return { number, before: text.slice(0, start), marked: text.slice(start, end), after: text.slice(end), selected };
  });
}
