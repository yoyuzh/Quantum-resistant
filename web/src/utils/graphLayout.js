const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const fallbackMeasure = (text, size = 13) => [...text].reduce((width, char) =>
  width + (/[^\u0000-\u00ff]/.test(char) ? size : size * .57), 0);

export function truncateGraphLabel(text, width, measure = fallbackMeasure) {
  if (measure(text, 13) <= width) return text;
  const chars = [...text];
  const head = chars.slice(0, 5);
  const filename = text.split(/[\\/]/).at(-1);
  const suffix = measure(`…${filename}`, 13) <= width ? filename : '';
  while (head.length && measure(`${head.join('')}…${suffix}`, 13) > width) head.pop();
  const tail = chars.slice(head.length);
  while (tail.length && measure(`${head.join('')}…${tail.join('')}`, 13) > width) tail.shift();
  return `${head.join('')}…${tail.join('')}`;
}

export function layoutGraph(graph, availableWidth, availableHeight = 0, measure = fallbackMeasure) {
  const fileWidths = graph.files.map(file => clamp(Math.max(measure(file.label, 13),
    measure(`${file.id.slice(-6)} · ${file.count} 项`, 11)) + 24, 140, 320));
  const algorithmWidths = graph.algorithms.map(name => clamp(measure(name, 13) + 24, 76, 128));
  const targetWidths = graph.targets.map(name => clamp(measure(name, 13) + 24, 104, 168));
  let fileWidth = Math.max(140, ...fileWidths);
  const algorithmWidth = Math.max(76, ...algorithmWidths);
  const targetWidth = Math.max(104, ...targetWidths);
  const padding = 24;
  fileWidth = Math.max(140, Math.min(fileWidth, availableWidth - algorithmWidth - targetWidth - 128 - padding * 2));
  const width = Math.max(availableWidth, fileWidth + algorithmWidth + targetWidth + 128 + padding * 2);
  const gap = (width - fileWidth - algorithmWidth - targetWidth - padding * 2) / 2;
  const count = Math.max(1, graph.files.length, graph.algorithms.length, graph.targets.length);
  const height = Math.max(availableHeight, count * 56 + 20);
  const columns = {
    file: { x: padding, width: fileWidth },
    algorithm: { x: padding + fileWidth + gap, width: algorithmWidth },
    target: { x: width - padding - targetWidth, width: targetWidth },
  };
  function nodes(items, widths, column, identity, label, align) {
    return new Map(items.map((item, index) => {
      const nodeWidth = Math.min(widths[index], column.width);
      const x = column.x + (align === 'end' ? column.width - nodeWidth : align === 'center' ? (column.width - nodeWidth) / 2 : 0);
      const y = items.length === 1 ? height / 2 : 38 + index * (height - 76) / (items.length - 1);
      return [identity(item), { x, y, width: nodeWidth, right: x + nodeWidth,
        label: truncateGraphLabel(label(item), nodeWidth - 24, measure) }];
    }));
  }
  return { width, height, columns, fits: width <= availableWidth,
    files: nodes(graph.files, fileWidths, columns.file, file => file.id, file => file.label, 'end'),
    algorithms: nodes(graph.algorithms, algorithmWidths, columns.algorithm, name => name, name => name, 'center'),
    targets: nodes(graph.targets, targetWidths, columns.target, name => name, name => name, 'start') };
}
