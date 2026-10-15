// Restrict highlights to relationships present on the current graph page.
export function inspectGraph(graph, selection) {
  if (!selection) return null;
  const { kind, sourceId, algorithm, target } = selection;
  const file = graph.files.find((item) => item.id === sourceId);
  let evidence = graph.evidenceEdges;
  let references = graph.recommendationEdges;
  let title;
  let detail;

  if (kind === 'file' || kind === 'evidence') {
    if (!file) return null;
    evidence = evidence.filter((edge) => edge.sourceId === sourceId &&
      (kind === 'file' || edge.algorithm === algorithm));
    references = references.filter((edge) => evidence.some((item) =>
      item.algorithm === edge.algorithm && item.targets.includes(edge.target)));
    title = kind === 'file' ? file.label : `${file.label} → ${algorithm}`;
    detail = `${sourceId} · ${evidence.reduce((sum, edge) => sum + edge.count, 0)} 项证据`;
  } else if (kind === 'recommendation' || kind === 'target') {
    references = references.filter((edge) => edge.target === target &&
      (kind === 'target' || edge.algorithm === algorithm));
    evidence = evidence.filter((edge) => references.some((item) =>
      edge.algorithm === item.algorithm && edge.targets.includes(item.target)));
    title = kind === 'target' ? `${target} 迁移参考` : `${algorithm} → ${target}`;
    detail = '迁移参考 · 需按用途复核';
  } else if (kind === 'algorithm') {
    evidence = evidence.filter((edge) => edge.algorithm === algorithm);
    references = references.filter((edge) => edge.algorithm === algorithm);
    title = `${algorithm} 的关联路径`;
    detail = `${new Set(evidence.map((edge) => edge.sourceId)).size} 个文件 · ` +
      `${evidence.reduce((sum, edge) => sum + edge.count, 0)} 项证据`;
  } else return null;

  if (!evidence.length && !references.length) return null;
  return {
    title, detail, evidence, references,
    files: new Set(evidence.map((edge) => edge.sourceId)),
    algorithms: new Set([...evidence, ...references].map((edge) => edge.algorithm)),
    targets: new Set(references.map((edge) => edge.target)),
  };
}
