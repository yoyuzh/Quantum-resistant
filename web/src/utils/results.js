export function formatTime(value) {
  if (!value) return '时间未知';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '时间未知'
    : date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false });
}

export const formatStars = (value) =>
  value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value ?? 0);
export const sortRepos = (repos) => [...repos].sort((a, b) => b.star_count - a.star_count);
export const findingKey = (f) => JSON.stringify([f.source_id, f.line, f.algorithm, f.evidence]);

export function filterFindings(findings, { algorithm = '', sourceId = '', query = '' }) {
  const text = query.trim().toLowerCase();
  return findings.filter(
    (f) =>
      (!algorithm || f.algorithm === algorithm) &&
      (!sourceId || f.source_id === sourceId) &&
      (!text ||
        [
          f.file_name,
          f.source_id,
          f.algorithm,
          f.evidence,
          f.library,
          f.resolved_api,
          f.recommendation,
        ].some((v) =>
          String(v ?? '')
            .toLowerCase()
            .includes(text),
        )),
  );
}

export function paginate(items, page, size = 50) {
  const pages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.max(1, Math.min(page, pages));
  return { items: items.slice((current - 1) * size, current * size), pages, current };
}

export function codeLines(sources, sourceId, line) {
  const source = sources.find((s) => s.source_id === sourceId);
  if (!source) return [];
  const start = Math.max(0, line - 4);
  return source.content
    .split('\n')
    .slice(start, line + 3)
    .map((text, i) => ({ number: start + i + 1, text, target: start + i + 1 === line }));
}

export function coverageText(coverage) {
  if (!coverage) return '扫描范围未知（历史结果）';
  const candidate =
    coverage.candidate_files == null ? '候选总数未知' : `候选 ${coverage.candidate_files} 个`;
  return `已扫描 ${coverage.scanned_files} 个文件 · ${candidate}${coverage.file_limit ? ` · 上限 ${coverage.file_limit} 个` : ''} · 跳过 ${coverage.skipped_files || 0} 个`;
}
