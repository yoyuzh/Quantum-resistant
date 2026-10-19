// The server remains authoritative for platform-safe paths, quotas and digests.
export function relativePath(file) {
  const path = file.webkitRelativePath || '';
  if (!path || path.startsWith('/') || /[\\\x00-\x1f]/.test(path) || path.split('/').some(part => !part || part === '.' || part === '..'))
    throw new Error('目录相对路径不可用，请改用普通文件上传（不进行跨模块证明）');
  if (path.split('/').length > 20 || new TextEncoder().encode(path).length > 512) throw new Error('相对路径超过 20 层或 512 字节');
  return path;
}

export async function uploadManifest(files, cryptoApi = globalThis.crypto) {
  if (!cryptoApi?.subtle?.digest) throw new Error('当前环境不支持安全摘要，请使用 localhost/HTTPS，或改用普通文件上传（不进行跨模块证明）');
  const seen = new Set();
  const entries = [];
  for (const [index, file] of files.entries()) {
    const path = relativePath(file);
    const identity = path.normalize('NFC').toLowerCase();
    if (seen.has(identity)) throw new Error(`相对路径重复：${path}`);
    seen.add(identity);
    // TextDecoder fatal matches Python utf-8-sig, including BOM removal, no newline normalization.
    let text;
    try { text = new TextDecoder('utf-8', { fatal: true }).decode(await file.arrayBuffer()); }
    catch { throw new Error(`${file.name} 不是有效 UTF-8 文本`); }
    const digest = await cryptoApi.subtle.digest('SHA-256', new TextEncoder().encode(text));
    entries.push({ index, relative_path: path, sha256: [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('') });
  }
  return { schema_version: 'upload-paths-1', entries };
}

export async function uploadBody(files, analysisMode = 'basic') {
  const paths = files.map(file => !!file.webkitRelativePath);
  if (paths.some(Boolean) && !paths.every(Boolean)) throw new Error('目录与普通文件不能混合上传，请清空后重新选择');
  const form = new FormData();
  if (paths.every(Boolean)) form.append('manifest', JSON.stringify(await uploadManifest(files)));
  form.append('analysis_mode', analysisMode);
  files.forEach(file => form.append('files', file));
  return form;
}
