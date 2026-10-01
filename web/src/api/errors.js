export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.status = status;
  }
}

export function parseResponse(content, status, { text = false } = {}) {
  const ok = status >= 200 && status < 300;
  if (text && ok) return content;
  let data;
  try {
    data = JSON.parse(content);
  } catch {
    throw new ApiError(`服务返回了无效数据（HTTP ${status}），请稍后重试`, status);
  }
  if (!ok) {
    throw new ApiError(typeof data?.detail === 'string' ? data.detail : '服务请求失败，请检查输入或稍后重试', status);
  }
  return data;
}
