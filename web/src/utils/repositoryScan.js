const skipLabels = {
  file_size: '超过单文件大小上限', encoding: '非 UTF-8', file_limit: '达到文件数上限',
  text_budget: '达到文本总量上限', archive_budget: '达到归档处理上限', path: '路径不受支持',
  download_failure: '下载失败', read_failure: '读取失败', analysis_failure: '分析未完成',
  timeout: '超时', cancelled: '已取消', storage: '存储失败',
};

export function repositoryScanCoverage(repo) {
  const coverage = repo.coverage;
  if (coverage?.partial || coverage?.skipped_files > 0) return 'partial';
  if (coverage?.candidate_files == null) return 'unknown';
  return coverage.candidate_files === coverage.scanned_files ? 'complete' : 'partial';
}

export const coverageLabels = { complete: '完整扫描', partial: '部分扫描', unknown: '覆盖未知' };

export function repositorySkipReasons(coverage) {
  return Object.entries(coverage?.skip_reasons || {}).filter(([,count]) => count > 0)
    .map(([reason,count]) => `${skipLabels[reason] || '其他原因'} ${count} 个`).join(' · ');
}

export function libraryScanSummary(result) {
  const repos = result.repos || [];
  const saved = result.meta?.library_saved_repositories?.length ?? (result.meta?.library_saved ? repos.length : 0);
  const retained = result.meta?.library_retained_repositories?.length || 0;
  const counts = { complete: 0, partial: 0, unknown: 0 };
  const failures = result.failures?.length || 0;
  for (const repo of repos) counts[repositoryScanCoverage(repo)]++;
  const parts = [`本轮 ${repos.length + failures} 个仓库`];
  for (const [key, label] of Object.entries(coverageLabels)) if (counts[key]) parts.push(`${label} ${counts[key]} 个`);
  if (failures) parts.push(`失败或未完成 ${failures} 个`);
  if (saved) parts.push(`已入库 ${saved} 个`);
  if (retained) parts.push(`保留原记录 ${retained} 个`);
  return parts.join(' · ');
}
