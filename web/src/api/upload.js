import { ApiError, parseResponse } from './errors.js';

export function uploadRequest(path, { body, signal, headers, onProgress, timeout = 600000 }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let settled = false;
    const abort = () => xhr.abort();
    const finish = (error, value) => {
      if (settled) return;
      settled = true;
      signal?.removeEventListener('abort', abort);
      xhr.onload = xhr.onerror = xhr.ontimeout = xhr.onabort = null;
      xhr.upload.onprogress = xhr.upload.onload = null;
      error ? reject(error) : resolve(value);
    };
    xhr.open('POST', path);
    xhr.timeout = timeout;
    for (const [key, value] of Object.entries(headers || {})) xhr.setRequestHeader(key, value);
    xhr.upload.onprogress = (event) => onProgress?.({
      stage: '上传文件', kind: 'files', upload_bytes: event.loaded,
      upload_total: event.lengthComputable ? event.total : null,
    });
    xhr.upload.onload = () => onProgress?.({ stage: '上传完成，正在读取文件', kind: 'files' });
    xhr.onload = () => {
      try { finish(null, parseResponse(xhr.responseText, xhr.status)); }
      catch (error) { finish(error); }
    };
    xhr.onerror = () => finish(new ApiError('上传连接中断，正在恢复提交'));
    xhr.ontimeout = () => finish(new ApiError('上传超时，请检查网络后重试'));
    xhr.onabort = () => finish(new ApiError('上传已取消；上次结果已保留'));
    signal?.addEventListener('abort', abort, { once: true });
    if (signal?.aborted) return finish(new ApiError('上传已取消'));
    xhr.send(body);
  });
}
