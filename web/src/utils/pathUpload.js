export const logicalPath = file => file.webkitRelativePath || file.relativePath || '';
export async function fileUpload(files, aiAssisted) {
  const paths = files.map(logicalPath);
  const withPaths = paths.some(Boolean);
  const root = paths[0]?.split('/')[0];
  const singleRoot = root && paths.every(value => value.startsWith(`${root}/`));
  if (withPaths && !globalThis.crypto?.subtle) throw new Error('目录上传需要 localhost 或 HTTPS；也可改用普通文件上传。');
  const body = new FormData();
  const entries = [];
  for (const [index, file] of files.entries()) {
    body.append('files', file);
    if (withPaths) {
      const content = new TextEncoder().encode(await file.text());
      const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', content));
      entries.push({ index, relative_path: singleRoot ? paths[index].slice(root.length + 1) : paths[index] || file.name,
        sha256: [...hash].map(v => v.toString(16).padStart(2, '0')).join('') });
    }
  }
  body.append('ai_assisted', String(aiAssisted));
  if (withPaths) body.append('manifest', JSON.stringify({ schema_version: 'upload-paths-1', entries }));
  return { body, kind: withPaths ? 'files-with-paths' : 'files' };
}
