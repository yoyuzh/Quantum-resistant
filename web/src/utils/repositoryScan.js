const skipLabels = {
  file_size: '超过单文件大小上限', encoding: '文件编码无法识别', file_limit: '达到文件数上限',
  text_budget: '达到文本总量上限', archive_budget: '达到归档处理上限', path: '路径不受支持',
  download_failure: '下载失败', read_failure: '读取失败', analysis_failure: '分析未完成',
  timeout: '超时', cancelled: '已取消', storage: '存储失败',
};

const deepGapLabels = {
  parse_failed: 'Python 语法解析失败', ast_limit: '达到 Python 语法树上限',
  source_unavailable: '部分源码不可读取', source_digest_mismatch: '部分源码摘要不匹配',
  source_path_conflict: '源码路径冲突', source_path_invalid: '源码路径无效', source_limit: '达到源码索引上限',
  package_root_missing: '未识别 Python 包根目录，按文件核验',
  index_limit: '达到模块索引上限', context_limit: '达到调用上下文上限',
  slice_limit: '达到语义分析范围上限', call_depth_limit: '达到跨文件调用深度上限',
  evidence_limit: '达到证据核验上限', deep_interrupted: '核验提前结束',
};

export function repositoryVerificationNotice(summary) {
  if (!summary || !['partial', 'failed', 'cancelled'].includes(summary.deep_status)) return '';
  if (summary.deep_status === 'cancelled') return '跨文件核验已取消';
  if (summary.deep_status === 'failed') return '跨文件分析失败';
  const python = summary.deep_python;
  const status = summary.deep_work_completed === true
    ? (python?.count ? '可解析 Python 文件已核验' : '无可核验的 Python 文件')
    : '跨文件核验部分完成';
  const scope = python?.total > 0 && python.count < python.total
    ? `已解析 ${python.count} / ${python.total} 个已采集的 Python 文件` : '';
  const gaps = (summary.deep_gaps || []).map(gap => deepGapLabels[gap]).filter(Boolean);
  return [status, scope, ...gaps].filter(Boolean).join('，');
}

export function repositoryScanCoverage(repo) {
  const coverage = repo.coverage;
  if (coverage?.partial || coverage?.skipped_files > 0 || coverage?.degraded_files > 0 ||
      ['partial', 'failed', 'cancelled'].includes(repo.analysis_summary?.deep_status)) return 'partial';
  if (coverage?.candidate_files == null) return 'unknown';
  return coverage.candidate_files === coverage.scanned_files ? 'complete' : 'partial';
}

export const coverageLabels = { complete: '完整扫描', partial: '部分扫描', unknown: '覆盖未知' };

export function repositorySkipReasons(coverage) {
  return Object.entries(coverage?.skip_reasons || {}).filter(([,count]) => count > 0)
    .map(([reason,count]) => `${skipLabels[reason] || '其他原因'} ${count} 个`).join('，');
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
  return parts.join('，');
}
