import { ApiError, parseResponse } from './errors.js';
export { ApiError } from './errors.js';

export async function request(
  path,
  { method = 'GET', body, signal, timeout = 15000, text = false, headers = {} } = {},
) {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal?.addEventListener('abort', cancel, { once: true });
  if (signal?.aborted) cancel();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeout);
  try {
    const form = body instanceof FormData;
    const response = await fetch(path, {
      method,
      signal: controller.signal,
      headers:
        body && !form
          ? { 'Content-Type': 'application/json', ...headers }
          : Object.keys(headers).length
            ? headers
            : undefined,
      body: body ? (form ? body : JSON.stringify(body)) : undefined,
    });
    const content = await response.text();
    const data = parseResponse(content, response.status, { text });
    if (text) return data;
    if (
      path.startsWith('/api/scan/') &&
      (!data || !Array.isArray(data.sources) || !Array.isArray(data.findings) || !data.summary)
    ) {
      throw new ApiError('扫描结果格式不完整，请重试', response.status);
    }
    if (path.startsWith('/api/popular/') && (!data || !Array.isArray(data.repos))) {
      throw new ApiError('榜单结果格式不完整，请重试', response.status);
    }
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (timedOut) throw new ApiError('请求超时，请缩小扫描范围后重试；上次结果已保留');
    if (controller.signal.aborted) throw new ApiError('请求已取消');
    throw new ApiError('无法连接服务，请检查后端是否运行后重试');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', cancel);
  }
}
