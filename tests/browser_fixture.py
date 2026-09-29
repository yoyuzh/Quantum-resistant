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

CODE = "from cryptography.hazmat.primitives.asymmetric import rsa\n" + "rsa.generate_private_key(public_exponent=65537, key_size=2048)\n" * 55


def collect(value, **kwargs):
    if "timeout" in value:
        raise CollectionTimeout("模拟远程扫描超时，请重试")
    if "failure" in value:
        raise CollectionError("模拟远程服务不可用，请重试")
    return CollectedSources([(value, "package/crypto.py", CODE)], limit=kwargs.get("max_files", 80),
                            candidates=3, skipped=2, partial=True,
                            diagnostics=[{"code": "partial_collection", "message": "模拟部分采集：两个文件未完成。"}])


refreshes = 0


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
             patch("backend.popular.collect_github_sources", collect):
            uvicorn.run(main.app, host="127.0.0.1", port=8018)
