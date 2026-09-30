import { filterFindings, paginate } from './results.js';

export const methodLabel = (method) =>
  ({
    ast_call: 'AST 调用',
    ast_config: 'AST 配置',
    text_call: '文本调用',
    text_config: '文本配置',
    pem_header: 'PEM 头',
  })[method] || '未记录';

export function selectedFindings(result, filters) {
  const selected = filterFindings(result.findings, filters);
  if (!filters.target) return selected;
  const allowed = new Set(
    (result.analysis?.migrations || [])
      .filter((item) => item.targets.includes(filters.target))
      .map((item) => item.algorithm),
  );
  return selected.filter((finding) => allowed.has(finding.algorithm));
}

export function graphData(assets, query = '', page = 1) {
  const files = new Map();
  for (const asset of assets) {
    if (!files.has(asset.source_id))
      files.set(asset.source_id, {
        id: asset.source_id,
        label: asset.file_name,
        count: 0,
      });
    files.get(asset.source_id).count += asset.finding_count;
  }
  const text = query.trim().toLocaleLowerCase();
  const matched = [...files.values()].filter((file) =>
    `${file.label} ${file.id}`.toLocaleLowerCase().includes(text),
  );
  const pagination = paginate(matched, page, 12);
  const visible = new Set(pagination.items.map((file) => file.id));
  const subset = assets.filter((asset) => visible.has(asset.source_id));
  const algorithms = [...new Set(subset.map((asset) => asset.algorithm))].sort();
  const targets = [...new Set(subset.flatMap((asset) => asset.targets))].sort();
  const evidenceEdges = subset.map((asset) => ({
    sourceId: asset.source_id,
    algorithm: asset.algorithm,
    count: asset.finding_count,
  }));
  const recommendations = new Map();
  subset.forEach((asset) =>
    asset.targets.forEach((target) => {
      recommendations.set(JSON.stringify([asset.algorithm, target]), {
        algorithm: asset.algorithm,
        target,
      });
    }),
  );
  return {
    files: pagination.items,
    algorithms,
    targets,
    evidenceEdges,
    recommendationEdges: [...recommendations.values()],
    pagination,
    totalFiles: files.size,
    matchedFiles: matched.length,
  };
}
