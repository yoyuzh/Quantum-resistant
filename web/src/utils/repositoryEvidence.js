export function repositoryLocation(repo, example) {
  if (!example?.path || !Number.isInteger(example.line) || example.line < 1) return null;
  const path = example.path.split('/');
  const validPath = path.every(part => part && part !== '.' && part !== '..' && !/[\\:\u0000-\u001f]/.test(part));
  const pinned = /^[\da-f]{40}$/i.test(repo.revision || '') && /^[\w.-]+\/[\w.-]+$/.test(repo.full_name) && validPath;
  const url = pinned ? `https://github.com/${repo.full_name}/blob/${repo.revision}/${path.map(encodeURIComponent).join('/')}#L${example.line}` : '';
  return { ...example, url, label:`${example.path}:${example.line}` };
}
