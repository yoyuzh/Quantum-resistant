"""Offline browser acceptance server: python -m tests.browser_fixture (port 8018).

Uses real scan/upload/report routes; substitutes only remote collection and batch
search. All generated popular data lives in a temporary directory.
"""
from __future__ import annotations

import shutil
import tempfile
import time
from pathlib import Path
from unittest.mock import patch

import uvicorn

from backend import main
from backend.collection_common import CollectedSources, CollectionError, CollectionTimeout
from backend.popular import BatchResult, RepoInfo, run_batch_scan
from backend.reporting import beijing_now_iso
from backend import task_routes, scanning
from backend.scanning import build_scan_response
from backend.html_report import build_html_report
from fastapi.responses import HTMLResponse

CODE = "from cryptography.hazmat.primitives.asymmetric import rsa\n" + "rsa.generate_private_key(public_exponent=65537, key_size=2048)\n" * 55


def collect(value, **kwargs):
    if "timeout" in value:
        raise CollectionTimeout("模拟远程扫描超时，请重试")
    if "failure" in value:
        raise CollectionError("模拟远程服务不可用，请重试")
    deadline = kwargs.get('deadline')
    if deadline:
        deadline.control.emit(stage='采集离线 fixture')
        deadline.pause(.2)
    if 'slow' in value or 'large' in value:
        count = 120 if 'large' in value else 8
        docs = []
        if deadline:
            deadline.control.emit(candidate_files=count, processed_files=0)
        for i in range(count):
            try:
                document = (value, f'package/module_{i}.py', CODE)
                docs.append(deadline.control.publish(document) if deadline else document)
                if deadline:
                    deadline.control.emit(collected_delta=1, processed_delta=1)
            except CollectionTimeout:
                break
        return CollectedSources(docs, candidates=count, skipped=count-len(docs), partial=len(docs)<count)
    if deadline:
        deadline.control.emit(collected_delta=1)
    return CollectedSources([(value, "package/crypto.py", CODE)], limit=kwargs.get("max_files", 5000),
                            candidates=3, skipped=2, partial=True,
                            diagnostics=[{"code": "partial_collection", "message": "模拟部分采集：两个文件未完成。"}])


refreshes = 0
real_analyze = scanning.analyze_source


def slow_analyze(content, filename, *args, **kwargs):
    if 'module_' in filename:
        time.sleep(.5)
    return real_analyze(content, filename, *args, **kwargs)


def task_search(top=8, **kwargs):
    global refreshes
    refreshes += 1
    if refreshes == 2:
        raise CollectionError('模拟刷新失败；上次结果已保留')
    if top == 30:
        return [RepoInfo(f'demo/slow-{i}', f'https://github.com/demo/slow-{i}', 1200-i) for i in range(30)]
    return [RepoInfo('demo/slow', 'https://github.com/demo/slow', 1200),
            RepoInfo('demo/slow-second', 'https://github.com/demo/slow-second', 1000),
            RepoInfo('demo/failure', 'https://github.com/demo/failure', 800)]


@main.app.get('/fixture/report', response_class=HTMLResponse)
def example_report():
    result = build_scan_response([('authentication/crypto.py', CODE)], 'snippet').model_dump()
    result.pop('summary')
    result.pop('analysis')
    return build_html_report(**result)


def popular(top=8):
    global refreshes
    refreshes += 1
    time.sleep(.5)
    if refreshes == 2:
        raise CollectionError("模拟刷新失败；上次结果已保留")
    return run_batch_scan([RepoInfo("demo/crypto", "https://github.com/demo/crypto", 1200),
                           RepoInfo("demo/failure", "https://github.com/demo/failure", 800)])


if __name__ == "__main__":
    with tempfile.TemporaryDirectory(prefix="quantum-browser-") as directory:
        root = Path(directory)
        shutil.copy2(main.WEB_DIR / "index.html", root / "index.html")
        with patch.object(main, "WEB_DIR", root), \
             patch.object(main, "collect_github_sources", collect), \
             patch.object(main, "collect_pypi_sources", collect), \
             patch.object(main, "scan_popular", popular), \
             patch.object(task_routes, 'fetch_popular_repos', task_search), \
             patch.object(scanning, 'analyze_source', slow_analyze), \
             patch('backend.pipeline.analyze_source', slow_analyze), \
             patch('backend.popular.analyze_source', slow_analyze), \
             patch("backend.popular.collect_github_sources", collect):
            uvicorn.run(main.app, host="127.0.0.1", port=8018)
