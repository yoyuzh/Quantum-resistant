import { graphAssets } from './analysis.js';
import { flowRecords } from './flowPacking.js';

export function graphRecords(data, mode, filter = {}) {
  const text = (filter.query || '').trim().toLocaleLowerCase();
  const files = new Map((data.sources || []).map(s => [s.source_id, s.file_name]));
  const origins = new Map((data.findings || []).map(f => [f.finding_id, f.origins || ['rule']]));
  const match = row => (!filter.algorithm || row.algorithm === filter.algorithm)
    && (!filter.status || (row.verification_status || 'confirmed') === filter.status)
    && (!filter.purpose || row.purpose_codes?.includes(filter.purpose) || row.purpose_code === filter.purpose)
    && (!filter.source || (row.origins || row.finding_ids?.flatMap(id => origins.get(id) || []) || (row.verification_status === 'ai_assessed' ? ['ai'] : ['cross_file'])).includes(filter.source))
    && (!text || [row.file_name || files.get(row.source_id), row.algorithm, row.api, ...(row.resolved_apis || [])].join(' ').toLocaleLowerCase().includes(text));
  if (mode === 'migration') {
    const assets = graphAssets(data.assets).filter(match);
    const graph = flowRecords(assets);
    const counts = new Map();
    for (const a of assets) counts.set(a.source_id, (counts.get(a.source_id) || 0) + a.finding_count);
    for (const node of graph.nodes) if (node.kind === 'file') node.detail = counts.get(node.sourceId) + ' 项发现';
    return { ...graph, mode, count: assets.reduce((n, a) => n + a.finding_count, 0), files: counts.size };
  }
  const nodes = new Map(), links = new Map();
  const paths = new Map((data.evidencePaths || []).map(p => [p.evidence_id, p]));
  const rows = (data.calls || []).filter(match);
  for (const row of rows) {
    const status = row.verification_status || 'confirmed';
    const sink = { source_id: row.source_id, start_line: row.line };
    const positionId = p => JSON.stringify(['position', row.id, p.source_id, p.start_line]);
    function position(p, role = 'source') {
      const id = positionId(p), isSink = p.source_id === sink.source_id && p.start_line === sink.start_line;
      if (!nodes.has(id)) {
        const definition = row.context_kind === 'uninstantiated_template';
        nodes.set(id, { id, kind: isSink ? 'algorithm' : 'file', role: isSink ? 'operation' : role,
          kindLabel: isSink ? (definition ? '定义处' : '操作位置') : '证据位置',
          label: files.get(p.source_id) || p.source_id, sourceId: p.source_id, line: p.start_line,
          detail: `第 ${p.start_line} 行`, api: isSink ? row.api : '', purpose: row.purpose,
          algorithm: row.algorithm, status, callId: row.id, operationId: row.operation_id,
          contextKind: row.context_kind, definition });
      }
      const node = nodes.get(id);
      if (!isSink && role !== 'source' && ({source:0,value:1,caller:2,import:3,result:4}[role] >= ({source:0,value:1,caller:2,import:3,result:4}[node.role] || 0))) {
        node.role = role;
        node.kindLabel = { import: '导入位置', caller: '调用位置', result: '返回位置', value: '参数或赋值' }[role];
        node.kind = role === 'result' ? 'reference' : 'file';
      }
      return id;
    }
    function relation(a, b, label) {
      if (a === b) return;
      const id = JSON.stringify([a, b, label]);
      links.set(id, { source: a, target: b, value: 1, status, label, groupKey: row.id, algorithm: row.algorithm });
    }
    const chain = [...(row.call_chain || []), sink];
    for (let i = 0; i < chain.length; i++) {
      const id = position(chain[i], 'caller');
      if (i) relation(position(chain[i - 1], 'caller'), id, row.context_kind === 'ai_evidence' ? '关联' : '调用');
    }
    for (const reference of row.evidence_ids || []) {
      const path = paths.get(reference);
      if (!path) continue;
      const byId = new Map(path.nodes.map(n => [n.node_id, n]));
      for (const edge of path.edges || []) {
        const label = { ARGUMENT_FLOW: '参数', RETURN_FLOW: '返回', ASSIGN_FLOW: '赋值', IMPORT_BINDING: '导入' }[edge.edge_type];
        const a = byId.get(edge.source_node)?.location, b = byId.get(edge.target_node)?.location;
        if (!label || !a || !b) continue;
        relation(position(a, label === '导入' ? 'import' : 'value'), position(b, label === '返回' ? 'result' : 'source'), label);
      }
    }
  }
  return { mode, nodes: [...nodes.values()], links: [...links.values()], count: rows.length,
    files: new Set([...nodes.values()].map(n => n.sourceId)).size };
}
