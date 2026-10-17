"""AI 本地验收：真实 API/适配器 + 回环模型，绝不连接供应商。"""
from __future__ import annotations

import json
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from unittest.mock import patch

import uvicorn
from fastapi import HTTPException

from backend import main, task_routes
from backend.ai.config import load_config
from tests.browser_fixture import collect

calls = 0
mode = "normal"


class ModelHandler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_POST(self):
        global calls
        if self.path != "/v1/chat/completions":
            self.send_error(404)
            return
        size = int(self.headers.get("Content-Length", "0"))
        if size > 32768:
            self.send_error(413)
            return
        body = json.loads(self.rfile.read(size))
        candidates = json.loads(body["messages"][1]["content"])["candidates"]
        calls += 1
        if mode == "slow":
            time.sleep(2)
        if mode == "failure":
            self.send_error(401)
            return
        opinions = []
        for index, candidate in enumerate(candidates):
            line = next(item for item in candidate["lines"] if item["line"] == candidate["start_line"])
            static = bool(candidate["static_finding_refs"])
            kind = ("supports_static" if index % 2 else "questions_static") if static else ("new_candidate" if index % 2 else "abstain")
            opinions.append({"candidate_id": candidate["candidate_id"], "algorithm": "RSA" if static else "unknown",
                "purpose": "unknown", "opinion_kind": kind, "rationale": "本地固定模型响应，仅验证流程，意见需人工复核",
                "missing_information": ["实际使用环境"], "citations": [{"source_id": candidate["source_id"],
                "start_line": line["line"], "end_line": line["line"], "quote": line["text"]}]})
        content = json.dumps({"opinions": opinions}, ensure_ascii=False)
        data = json.dumps({"choices": [{"message": {"content": content}}]}, ensure_ascii=False).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        try:
            self.wfile.write(data)
        except (BrokenPipeError, ConnectionResetError):
            pass


@main.app.get("/fixture/ai")
def metrics():
    return {"calls": calls, "mode": mode}


@main.app.post("/fixture/ai/{value}")
def change_mode(value: str):
    global mode
    if value not in {"normal", "slow", "failure"}:
        raise HTTPException(422, "未知 fixture 模式")
    mode = value
    return metrics()


@main.app.post("/fixture/expire-source/{identity}")
def expire_source(identity: str):
    with task_routes.store.lock:
        job = task_routes.store.jobs.get(identity)
        if not job or job.state not in {"succeeded", "partial"}:
            raise HTTPException(409, "来源尚未结束")
        job.ended = -10000
        task_routes.store._prune()
    return {"expired": identity}


if __name__ == "__main__":
    config = load_config({"QUANTUM_AI_ENABLED": "true", "QUANTUM_AI_BASE_URL": "http://127.0.0.1:8019/v1",
                          "QUANTUM_AI_MODEL": "local-fixture-not-real-model"})
    server = ThreadingHTTPServer(("127.0.0.1", 8019), ModelHandler)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        with patch("backend.ai.routes.get_config", return_value=config), \
             patch.object(main, "collect_github_sources", collect), \
             patch.object(main, "collect_pypi_sources", collect):
            uvicorn.run(main.app, host="127.0.0.1", port=8018)
    finally:
        server.shutdown()
        server.server_close()
