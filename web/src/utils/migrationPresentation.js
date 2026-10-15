// Only the generated target-list sentence is normalized; custom advice stays intact.
function normalizeAction(action, targets) {
  const prefix = `按用途评估 ${(targets || []).join(' / ')}，`;
  const suffix = '确认所用密码库与平台支持。ML-KEM 是密钥封装机制，不能直接替换签名或任意加密 API。';
  const description = action.description === prefix + suffix
    ? `按用途评估表中候选方案，${action.description.slice(prefix.length)}`
    : action.description;
  return { ...action, description };
}

export function migrationPresentation(migrations = []) {
  const normalized = migrations.map((item) => (item.actions || []).map((action) =>
    normalizeAction(action, item.targets)));
  const key = (action) => JSON.stringify([action.title, action.description]);
  const common = (migrations.length > 1 ? normalized[0] : []).filter((action) =>
    normalized.every((actions) => actions.some((candidate) => key(candidate) === key(action))));
  const shared = [...new Map(common.map((action) => [key(action), action])).values()];
  const sharedKeys = new Set(shared.map(key));
  const references = [...new Set(migrations.map((item) => item.reference_url).filter(Boolean))];
  return {
    shared,
    references,
    rows: migrations.map((item, index) => ({
      ...item,
      actions: (item.actions || []).filter((_, actionIndex) =>
        !sharedKeys.has(key(normalized[index][actionIndex]))),
    })),
  };
}
