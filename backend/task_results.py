"""Atomic task checkpoints using the shared temporary-store accounting."""
from __future__ import annotations


def persist_result(store, job, value):
    with store.lock:
        if job.state != 'running':
            return False
    result = {**value, **({'sources': [dict(s) for s in value['sources']]} if 'sources' in value else {})}
    paths = getattr(job.control, 'source_paths', {})
    job.control.source_paths = paths
    for source in result.get('sources', []):
        identity = source.get('source_id')
        if not identity:
            continue
        if identity not in paths and source.get('content_available') is not False:
            content = source.get('content', '')
            if content or not source.get('char_count'):
                paths[identity] = store.storage.write_source(job.folder, content.encode('utf-8'))
        source['content'] = ''
        source['content_available'] = identity in paths
    try:
        path = store.storage.write_json(job.folder, result)
    except RuntimeError:
        if job.result:
            raise  # Keep the previous complete checkpoint and its sources.
        with store.lock:
            if job.readers:
                raise RuntimeError('来源仍在读取，不能释放源码换取结果空间')
            store.storage.discard_sources(job.folder)
            job.control.source_paths = {}
        note = {'code': 'source_storage_evicted', 'message': '临时存储容量不足，完整分析结果已保留；本次源码未保留，查看源码需重新扫描。'}
        for source in result.get('sources', []):
            source['content_available'] = False
        result.setdefault('diagnostics', []).append(note)
        for repo in result.get('repos', []):
            repo.setdefault('diagnostics', []).append(note)
        path = store.storage.write_json(job.folder, result)
    size = path.stat().st_size
    if size > store.max_bytes:
        store.storage.remove(path)
        raise RuntimeError('任务结果超过缓存容量，未保存；请缩小扫描范围后重试')
    with store.lock:
        if job.state != 'running':
            store.storage.remove(path)
            return False
        old = job.result
        job.result, job.size = path, size
    if old and old != path:
        store.storage.remove(old)
    return True
