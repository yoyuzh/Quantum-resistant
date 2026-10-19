"""Reproduce the legacy contract baseline using real local APIs and mocked remotes.

Record deliberately with: python -m tests.deep_static.baseline
Tests only compare against the saved baseline and never rewrite it.
"""
from __future__ import annotations

import json
from pathlib import Path
import subprocess
import sys
import tempfile
from unittest.mock import patch

from fastapi.testclient import TestClient

from backend import task_routes
from backend.main import app
from backend.models import CryptoAsset, FindingRecord, ScanResponse
from backend.task_store import TaskStore

ROOT = Path(__file__).resolve().parents[2]
BASELINE = Path(__file__).with_name("fixtures") / "legacy_baseline.json"
CODE = "from Crypto.PublicKey import RSA\nkey = RSA.generate(2048)\n"


def normalize(value):
    if isinstance(value, dict):
        return {key: ("<beijing-iso-time>" if key == "scanned_at" else normalize(item)) for key, item in value.items()}
    if isinstance(value, list):
        return [normalize(item) for item in value]
    return value


def collect_baseline() -> dict:
    store = TaskStore()
    client = TestClient(app, base_url="http://127.0.0.1")
    scans, reports = {}, {}
    try:
        with patch.object(task_routes, "store", store), \
             patch("backend.main.collect_github_sources", return_value=[("baseline.py", CODE)]), \
             patch("backend.main.collect_pypi_sources", return_value=[("baseline.py", CODE)]):
            requests = (("snippet", {"json": {"filename": "baseline.py", "content": CODE}}),
                        ("files", {"files": [("files", ("baseline.py", CODE.encode(), "text/plain"))]}),
                        ("github", {"json": {"repository_url": "https://github.com/example/baseline"}}),
                        ("pypi", {"json": {"package_name": "baseline"}}))
            for kind, options in requests:
                response = client.post("/api/scan/" + kind, **options)
                response.raise_for_status()
                scans["sync_" + kind] = normalize(response.json())
                response = client.post("/api/tasks/" + kind, headers={"X-Request-ID": "deep-baseline-" + kind + "-0001"}, **options)
                if response.status_code != 202:
                    raise AssertionError(response.text)
                identity = response.json()["id"]
                store.jobs[identity].future.result(timeout=10)
                status = client.get("/api/tasks/" + identity).json()
                if status["state"] != "succeeded":
                    raise AssertionError(status)
                result = client.get("/api/tasks/" + identity + "/result")
                result.raise_for_status()
                scans["task_" + kind] = normalize(result.json())
            payload = scans["sync_snippet"] | {"scanned_at": "2026-10-18T16:00:00+08:00"}
            for kind in ("json", "csv", "markdown", "html"):
                response = client.post("/api/report/" + kind, json=payload)
                response.raise_for_status()
                reports[kind] = {"content_type": response.headers["content-type"], "body": response.text}
    finally:
        store.close()
        client.close()
    with tempfile.TemporaryDirectory() as folder:
        target = Path(folder) / "baseline.py"
        target.write_text(CODE, encoding="utf-8")
        process = subprocess.run([sys.executable, "-B", str(ROOT / "scan_quantum_vuln.py"), str(target), "--json"],
                                 capture_output=True, text=True, timeout=10, check=True, cwd=ROOT)
    return {"schema_version": "legacy-baseline-1", "head": "c359a57b6daa4cb16b3b3af6c4b56e58a535ae31",
            "scans": scans, "reports": reports, "cli": {"stdout": json.loads(process.stdout), "stderr": process.stderr},
            "legacy_schemas": {model.__name__: model.model_json_schema() for model in (FindingRecord, CryptoAsset, ScanResponse)}}


if __name__ == "__main__":
    BASELINE.write_text(json.dumps(collect_baseline(), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(BASELINE)
