export const TERMINAL = new Set(['succeeded', 'partial', 'failed', 'cancelled']);

export function abortableDelay(ms, signal) {
  return new Promise((resolve, reject) => {
    const stop = () => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
    };
    const abort = () => {
      stop();
      reject(new Error('已停止查询'));
    };
    const timer = setTimeout(() => {
      stop();
      resolve();
    }, ms);
    signal?.addEventListener('abort', abort, { once: true });
    if (signal?.aborted) abort();
  });
}

export async function followTask({
  request,
  kind,
  body,
  signal,
  id,
  requestId,
  onId = () => {},
  onProgress = () => {},
  onConnection = () => {},
  delay = abortableDelay,
  includeContent = true,
}) {
  let retries = 0;
  while (!id) {
    try {
      const created = await request(`/api/tasks/${kind}`, {
        method: 'POST',
        body,
        signal,
        timeout: 10000,
        headers: { 'X-Request-ID': requestId },
      });
      if (!created?.id) throw new Error('任务响应格式不完整');
      id = created.id;
      onId(id);
    } catch (error) {
      if (signal.aborted || (error.status >= 400 && error.status < 500) || ++retries >= 3)
        throw error;
      onConnection('提交连接中断，正在用同一请求标识恢复…');
      await delay(Math.min(1000 * retries, 5000), signal);
    }
  }
  retries = 0;
  while (!signal.aborted) {
    let status;
    let result;
    try {
      status = await request(`/api/tasks/${id}`, { signal, timeout: 10000 });
      if (!status || !['queued', 'running', ...TERMINAL].includes(status.state))
        throw new Error('任务状态格式不完整');
      onProgress(status);
      if (TERMINAL.has(status.state) && status.has_result)
        result = await request(`/api/tasks/${id}/result${includeContent ? '' : '?include_content=false'}`, { signal, timeout: 60000 });
      onConnection('');
      retries = 0;
    } catch (error) {
      if (signal.aborted || (error.status >= 400 && error.status < 500)) throw error;
      onConnection('查询连接暂时中断，后台任务仍在运行，正在重连…');
      await delay(Math.min(1000 * 2 ** retries++, 5000), signal);
      continue;
    }
    if (TERMINAL.has(status.state)) {
      if (result) return { result, status };
      throw new Error(
        status.error ||
          (status.state === 'cancelled'
            ? '任务已取消；上次结果已保留'
            : '任务失败；上次结果已保留'),
      );
    }
    await delay(1000, signal);
  }
  throw new Error('已停止查询');
}
