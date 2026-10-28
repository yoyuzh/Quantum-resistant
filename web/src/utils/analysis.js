import { filterFindings } from './results.js';

export const assetKey = item => JSON.stringify([item.source_id,item.algorithm,item.verification_status || 'confirmed']);
export function assetLocation(findings, asset, location) {
  return findings.find(f => assetKey(f)===assetKey(asset) && (!location || f.line===location.line)
    && (!location?.evidence || f.evidence===location.evidence));
}

export const methodLabel = (method) =>
  ({
    ast_call: 'AST 调用',
    ast_config: 'AST 配置',
    text_call: '文本调用',
    text_config: '文本配置',
    pem_header: 'PEM 头',
    cross_file: '跨文件核验',
    ai_candidate: 'AI代码分析',
  })[method] || '未记录';

export function selectedFindings(result, filters) {
  const selected = filterFindings(result.findings, filters).filter(
    (finding) => (!filters.method || (finding.detection_method || 'unknown') === filters.method) &&
      (!filters.status || (finding.verification_status || 'confirmed') === filters.status),
  ).filter(finding => !filters.purpose || (finding.effective_purpose_code || finding.purpose_code || 'unknown')===filters.purpose);
  if (!filters.target) return selected;
  const migrations = (result.analysis?.migrations || []).filter(item => item.targets.includes(filters.target) || item.migration_references?.some(r=>r.label===filters.target) || item.migration_references?.map(r=>r.label).join('；')===filters.target);
  return selected.filter(finding => finding.verification_status !== 'pending' && migrations.some(item =>
    Array.isArray(item.finding_ids) ? item.finding_ids.includes(finding.finding_id) : item.algorithm === finding.algorithm));
}

export function graphAssets(assets = []) {
  return (Array.isArray(assets) ? assets : []).filter(a => a && typeof a.source_id === 'string' && a.source_id).map(a => ({
    ...a, file_name:typeof a.file_name === 'string' && a.file_name || a.source_id,
    algorithm:typeof a.algorithm === 'string' && a.algorithm || '算法待确认',
    finding_count:Number.isFinite(Number(a.finding_count)) ? Math.max(0,Number(a.finding_count)) : 0,
    targets:a.verification_status === 'pending' ? [] : [...new Set((a.targets?.length ? a.targets : a.migration_references?.map(r=>r.label) || []).filter(t => typeof t === 'string' && t))],
  }));
}
