import { statusLabel } from './verification.js';
import { analysisLabels, purposeLabels } from './assistance.js';

export const statuses = ['confirmed', 'ai_assessed', 'pending'];
export const label = status => status === 'legacy' ? '历史基础检出' : statusLabel(status);
export const purposeName = group => purposeLabels[group.purpose] || '用途待确认';
export const originName = group => ({ static: '静态', ai: 'AI', unknown: '未知' })[group.origin] || '未知';
export const coverageName = repo => !repo.coverage ? '范围未知' : repo.coverage.partial ? '部分扫描' : '扫描完成';

function rowModel(repo) {
  const inventory = repo.algorithm_inventory;
  const groups = inventory?.groups || [];
  const counts = new Map();
  for (const group of groups) {
    const values = counts.get(group.algorithm) || {};
    values[group.status] = (values[group.status] || 0) + group.count;
    counts.set(group.algorithm, values);
  }
  const legacy = !inventory && Array.isArray(repo.algorithms);
  const historicalPositions = new Map();
  if (legacy) {
    for (const finding of repo.findings || []) {
      const path = finding.file_name;
      if (typeof path !== 'string' || /[\\:\x00-\x1f]/.test(path) || path.split('/').some(part => ['', '.', '..'].includes(part))) continue;
      if (!Number.isInteger(finding.line) || finding.line < 1 || historicalPositions.has(finding.algorithm)) continue;
      historicalPositions.set(finding.algorithm, path + ':' + finding.line);
    }
  }
  function count(algorithm, status) {
    if (status === 'legacy') return legacy ? Number(repo.algorithms.includes(algorithm)) : null;
    const found = counts.get(algorithm)?.[status];
    if (found != null) return found;
    const stage = inventory?.stages[status];
    return ['completed', 'partial'].includes(stage) ? 0 : null;
  }
  return { repo, groups, legacy, historicalPositions, count, algorithms: legacy ? [...new Set(repo.algorithms)] : [...counts.keys()] };
}

export function stageText(row, status) {
  if (status === 'legacy') return row.legacy ? '基础检出，分组数量未知' : '无历史基础列表';
  const inventory = row.repo.algorithm_inventory;
  if (!inventory) return '分组数量未知';
  const stage = inventory.stages[status];
  return (inventory.basis === 'base' ? '基础扫描' : '融合分析') + '（' + (analysisLabels[stage] || '未评估') + '）';
}

export function repositoryAtlas(batch) {
  const rows = (batch.repos || []).map(rowModel);
  const algorithms = [...new Set(rows.flatMap(row => row.algorithms))].sort();
  const modes = rows.some(row => row.legacy) ? [...statuses, 'legacy'] : statuses;
  const rankings = {};
  for (const mode of modes) {
    rankings[mode] = algorithms.map(algorithm => {
      const eligible = rows.filter(row => row.count(algorithm, mode) !== null);
      const hits = eligible.filter(row => row.count(algorithm, mode) > 0);
      return { algorithm, hits: hits.length, eligible: eligible.length,
        partial: eligible.filter(row => row.repo.coverage?.partial).length,
        total: eligible.reduce((sum, row) => sum + row.count(algorithm, mode), 0) };
    }).sort((a, b) => b.hits - a.hits || a.algorithm.localeCompare(b.algorithm));
  }
  const failures = batch.failures || [];
  const failed = batch.meta?.failed_count ?? failures.length;
  return { batch, rows, algorithms, modes, rankings, failures, failed,
    partial: rows.filter(row => row.repo.coverage?.partial).length,
    requested: batch.meta?.requested_count ?? rows.length + failed };
}

export function batchScope(atlas) {
  if (atlas.batch.schema_version === 1) return `收录 ${atlas.rows.length} 个仓库${atlas.partial ? `（${atlas.partial} 个部分扫描）` : ''}`;
  return `请求 ${atlas.requested} 个仓库，可用 ${atlas.rows.length} 个（部分扫描 ${atlas.partial} 个），未完成 ${atlas.failed} 个`;
}
