export function pageCapacity(height, rowHeight = 52, constrained = true) {
  if (!constrained) return 10;
  if (!Number.isFinite(height) || height <= 0) return 1;
  return Math.max(1, Math.min(50, Math.floor(height / Math.max(1, rowHeight))));
}

export function gridCapacity(height, columns = 1, rowHeight = 88, constrained = true) {
  if (!constrained) return 10;
  const rows = Math.max(1, Math.floor((Math.max(0, height) + 8) / (rowHeight + 8)));
  return Math.min(50, rows * columns);
}

export function collectionLayout({ height, width, count, heading = 0, footer = 0,
  pager = 37, rowHeight = 88, constrained = true }) {
  const columns = Math.min(Math.max(1, count), 4, Math.max(1, Math.floor((width + 12) / 372)));
  // Reserve the same pager budget even when it is hidden on a single page.
  // The capacity must not depend on the height of the rendered collection.
  const size = gridCapacity(Math.max(0, height - heading - footer - pager - 18), columns, rowHeight, constrained);
  return { columns, size, compact: count <= size };
}

export function describeInput(mode, draft) {
  if (mode === 'snippet') return draft.filename;
  if (mode === 'files') return `${draft.files.length} 个文件 · ${draft.files[0]?.name || ''}`;
  return draft.value;
}

export function describeResult(result) {
  const sources = result?.sources || [];
  const origins = [...new Set(sources.map(source => source.origin).filter(Boolean))];
  return origins.join('、') || (sources.length === 1 ? sources[0].file_name : `${sources.length} 个文件`);
}
