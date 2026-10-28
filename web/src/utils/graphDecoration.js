export const kindColors = { file: '#627ec7', algorithm: '#16877f', reference: '#9a6dc1' };
export function nodeDecoration(node) {
  if (node.aggregated) return null;
  const center = { x: node.x + node.width * (node.kind === 'algorithm' ? .64 : .80), y: node.y + node.height / 2 };
  if (node.watermark) return { ...center, text: node.watermark, opacity: .032, color: kindColors.algorithm,
    size: Math.min(node.height * .8, node.width / Math.max(2, node.watermark.length) * 1.4) };
  const path = node.kind === 'file'
    ? 'M-15-22H6L17-11V22H-15ZM6-22V-11H17M-7-1H9M-7 7H9M-7 15H4'
    : 'M0-24L21-15V0C21 13 0 25 0 25S-21 13-21 0V-15ZM-10 0L-2 8L12-9';
  return { ...center, path, opacity: .035, color: kindColors[node.kind], size: Math.min(node.height * .75, 58 * node.scale) / 48 };
}
