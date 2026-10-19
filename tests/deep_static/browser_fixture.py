"""Offline deep UI acceptance server, localhost:8018 only; never production wiring.

Run: python -m tests.deep_static.browser_fixture
Remote sources and deliberate failure/expiry controls are local test data.
"""
from __future__ import annotations

from unittest.mock import patch

import time
import uvicorn
from fastapi import HTTPException

from backend import main, task_routes, deep_work
from backend.collection_common import CollectedSources, CollectionError
from backend.task_store import TaskStore

WRAPPER = 'import jwt\n\ndef sign_jwt(payload, key, algorithm):\n    return jwt.encode(payload, key, algorithm=algorithm)\n'
CALLER = ('from crypto.wrap import sign_jwt\n\n# 中文：离线浏览器验收，不执行源码。\n'
          'rsa_token = sign_jwt({}, "fixture-key", "RS256")\n'
          'hmac_token = sign_jwt({}, "fixture-key", "HS256")\n')


def collect(value, **kwargs):
    deadline = kwargs.get('deadline')
    if 'failure' in value and 'deep-failure' not in value:
        raise CollectionError('离线 fixture：远程采集失败，基础结果已保留')
    if 'slow' in value and deadline:
        deadline.control.emit(stage='离线取消验收等待')
        deadline.pause(30)
    prefix = 'very-long-path-for-responsive-review/' * 4 if 'long' in value else ''
    if 'deep-pause' in value:
        prefix = 'deep-pause/'
    if 'deep-failure' in value:
        prefix = 'deep-failure/'
    documents = [(value, prefix + 'app/main.py', CALLER),
                 (value, prefix + 'crypto/__init__.py', ''),
                 (value, prefix + 'crypto/wrap.py', WRAPPER)]
    if deadline:
        documents = [deadline.control.publish(item) for item in documents]
    return CollectedSources(documents, candidates=None if 'unknown' in value else 3)


real_analyze = deep_work.analyze_crypto


def controlled_analyze(source, **kwargs):
    paths = [item.relative_path for item in source.identity.sources]
    if any(path.startswith('deep-failure/') for path in paths):
        raise RuntimeError('offline fixture deep failure')
    if any(path.startswith('deep-pause/') for path in paths):
        publish = kwargs['on_result']
        def checkpoint(result):
            publish(result)
            until = time.monotonic() + 30
            while time.monotonic() < until:
                kwargs['checkpoint']()
                time.sleep(.05)
        kwargs['on_result'] = checkpoint
    return real_analyze(source, **kwargs)


@main.app.post('/fixture/expire-source/{identity}')
def expire_source(identity: str):
    job = task_routes.store.jobs.get(identity)
    if not job:
        raise HTTPException(404, 'fixture task missing')
    task_routes.store.storage.discard_sources(job.folder)
    return {'sources_discarded': True}


if __name__ == '__main__':
    store = TaskStore()
    try:
        with patch.object(task_routes, 'store', store), \
             patch.object(main, 'collect_github_sources', collect), \
             patch.object(main, 'collect_pypi_sources', collect), \
             patch.object(deep_work, 'analyze_crypto', controlled_analyze):
            uvicorn.run(main.app, host='127.0.0.1', port=8018)
    finally:
        store.close()
