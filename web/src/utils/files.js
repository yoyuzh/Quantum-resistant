export let MAX_FILE_BYTES = 2 * 1024 * 1024;
export let MAX_TOTAL_BYTES = 110 * 1024 * 1024;
export let MAX_TEXT_BYTES = 100 * 1024 * 1024;
export let MAX_FILES = 5000;
export function configureLimits(config) {
  MAX_FILE_BYTES = config.max_file_bytes;
  MAX_TOTAL_BYTES = config.max_upload_bytes;
  MAX_TEXT_BYTES = config.max_text_bytes;
  MAX_FILES = config.max_files;
}
export const ACCEPT =
  '.py,.pyw,.cs,.csproj,.xaml,.xml,.md,.java,.js,.jsx,.ts,.tsx,.go,.rs,.txt,.pem,.yml,.yaml,.json,.cfg,.ini,.toml';
const suffixes = new Set(ACCEPT.split(','));

export const fileKey = (file) => JSON.stringify([file.name, file.size, file.lastModified]);
export const uploadBytes = (files) =>
  files.reduce(
    (sum, file) => sum + file.size + 512 + new TextEncoder().encode(file.name).length,
    2048,
  );

export function mergeFiles(existing, incoming) {
  const files = [...existing];
  const seen = new Set(files.map(fileKey));
  const errors = [];
  let estimated = uploadBytes(files);
  let textBytes = files.reduce((sum, file) => sum + file.size, 0);
  for (const file of incoming) {
    if (seen.has(fileKey(file))) continue;
    const suffix = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!suffixes.has(suffix)) errors.push(`${file.name}：不支持的文件格式`);
    else if (file.size > MAX_FILE_BYTES) errors.push(`${file.name}：超过单文件 2 MiB 限制`);
    else if (files.length >= MAX_FILES) errors.push(`单次最多上传 ${MAX_FILES} 个文件`);
    else if (textBytes + file.size > MAX_TEXT_BYTES || estimated + file.size + 512 + new TextEncoder().encode(file.name).length > MAX_TOTAL_BYTES)
      errors.push(`${file.name}：超过源码或上传总量上限`);
    else {
      seen.add(fileKey(file));
      files.push(file);
      textBytes += file.size;
      estimated += file.size + 512 + new TextEncoder().encode(file.name).length;
    }
  }
  return { files, errors: [...new Set(errors)] };
}

export function validateDraft(mode, draft) {
  if (mode === 'snippet') {
    if (!draft.content.trim()) return '请先输入待扫描内容';
    if (!draft.filename.trim()) return '请输入文件名';
    if (new TextEncoder().encode(draft.content).length > MAX_FILE_BYTES)
      return '代码片段超过 2 MiB 限制';
  }
  if (mode === 'files' && !draft.files.length) return '请先选择文件或导入示例';
  if (mode === 'github') {
    try {
      const url = new URL(draft.value.trim());
      if (
        !['https:', 'http:'].includes(url.protocol) ||
        url.host !== 'github.com' ||
        !/^\/[\w.-]+\/[\w.-]+/.test(url.pathname)
      )
        throw new Error();
    } catch {
      return '请输入 https://github.com/owner/repo 格式的仓库地址';
    }
  }
  if (
    mode === 'pypi' &&
    (!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,213}$/.test(draft.value.trim()) || draft.value.includes('..'))
  )
    return '请输入有效的 PyPI 包名';
  return '';
}
