export function elapsedSeconds(value) {
  const seconds = Number(value);
  return Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
}

export function progressRows(progress = {}) {
  const rows = [];
  const add = (label, value, total, known) => {
    if (value == null) return;
    rows.push({ label, value, total: known ? total : null,
      percent: known && total > 0 ? Math.min(100, Math.floor(value / total * 100)) : null });
  };
  add('上传字节', progress.upload_bytes, progress.upload_total, progress.upload_total != null);
  add('下载字节', progress.download_bytes, progress.download_total, progress.download_total != null);
  add('已处理文件', progress.processed_files, progress.candidate_files, progress.candidate_files != null);
  add('已分析文件', progress.analyzed_files, progress.analysis_total, progress.totals_final && progress.analysis_total != null);
  return rows;
}
