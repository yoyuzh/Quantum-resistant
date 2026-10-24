from __future__ import annotations

import json
import time
import unittest
import uuid
from dataclasses import replace
from threading import Event
from unittest.mock import patch

import httpx
from fastapi.testclient import TestClient

from backend import task_routes
from backend.ai.models import Usage
from backend.ai.provider import ProviderError, complete
from backend.collection_common import Deadline
from backend.main import app
from backend.task_store import TaskStore
from tests.test_ai_provider import config, opinion


class AiWorkflowTests(unittest.TestCase):
    def test_timeout_retry_recovers_with_actual_call_count_and_unknown_usage(self):
        requests = []

        def recovering(cfg, batch, deadline, **kwargs):
            def handler(request):
                requests.append(request)
                if len(requests) == 1:
                    raise httpx.ReadTimeout("test-secret")
                return httpx.Response(200, json={
                    "choices": [{"message": {"content": json.dumps({"opinions": [opinion(item) for item in batch]})}}],
                    "usage": {"prompt_tokens": 10, "completion_tokens": 20, "total_tokens": 30},
                })

            return complete(cfg, batch, deadline, transport=httpx.MockTransport(handler), **kwargs)

        preview = self.preview()
        with patch.object(Deadline, "pause"), patch("backend.ai.runner.complete", side_effect=recovering):
            identity = self.submit(preview).json()["id"]
            self.assertEqual(self.wait(identity)["state"], "succeeded")
        result = self.store.result(identity)
        self.assertEqual(result["ai_coverage"]["calls"], 2)
        self.assertEqual(result["ai_coverage"]["completed"], len(preview["candidates"]))
        self.assertIsNone(result["usage"]["total_tokens"])

    def test_timeout_retry_shares_task_call_budget_and_preserves_completed_batch(self):
        requests = []

        def limited(cfg, batch, deadline, **kwargs):
            def handler(request):
                requests.append(request)
                if len(requests) > 1:
                    raise httpx.ReadTimeout("test-secret")
                return httpx.Response(200, json={"choices": [{"message": {
                    "content": json.dumps({"opinions": [opinion(item) for item in batch]})}}]})

            return complete(cfg, batch, deadline, transport=httpx.MockTransport(handler), **kwargs)

        with patch("backend.ai.routes.get_config", return_value=config(batch_candidates=1, max_calls=2)):
            preview = self.preview(self.source("encrypt(x)\nencrypt(y)"))
            with patch.object(Deadline, "pause"), patch("backend.ai.runner.complete", side_effect=limited):
                identity = self.submit(preview).json()["id"]
                self.assertEqual(self.wait(identity)["state"], "partial")
        result = self.store.result(identity)
        self.assertEqual(len(requests), 2)
        self.assertEqual(result["ai_coverage"]["calls"], 2)
        self.assertEqual(len(result["opinions"]), 1)
        self.assertIn("call_budget", [item["code"] for item in result["diagnostics"]])
        self.assertIsNone(result["usage"]["total_tokens"])

    def setUp(self):
        self.store = TaskStore()
        self.swap = patch.object(task_routes, "store", self.store)
        self.swap.start()
        self.client = TestClient(app)
        self.configuration = patch("backend.ai.routes.get_config", return_value=config())
        self.configuration.start()
        self.calls = []

        def complete(cfg, batch, deadline, **kwargs):
            self.calls.append(batch)
            if kwargs.get("on_send"):
                kwargs["on_send"]()
            return json.dumps({"opinions": [opinion(candidate) for candidate in batch]}), Usage()

        self.provider = patch("backend.ai.runner.complete", side_effect=complete)
        self.provider.start()

    def tearDown(self):
        self.provider.stop()
        self.configuration.stop()
        self.store.close()
        self.swap.stop()

    def post(self, path, data, request_id=None):
        return self.client.post(path, json=data, headers={"X-Request-ID": request_id or str(uuid.uuid4())})

    def wait(self, identity):
        end = time.monotonic() + 5
        while time.monotonic() < end:
            status = self.store.get(identity)
            if status["state"] in {"succeeded", "partial", "failed", "cancelled"}:
                return status
            time.sleep(.005)
        self.fail("任务未结束")

    def source(self, content="encrypt(data)"):
        response = self.post("/api/tasks/snippet", {"content": content})
        self.assertEqual(response.status_code, 202, response.text)
        self.wait(response.json()["id"])
        return response.json()["id"]

    def preview(self, source=None):
        response = self.post("/api/ai/previews", {"source_task_id": source or self.source()})
        self.assertEqual(response.status_code, 200, response.text)
        return response.json()

    def submit(self, preview, request_id=None):
        return self.post("/api/tasks/ai", {"preview_id": preview["preview_id"], "digest": preview["digest"], "consent": True}, request_id)

    def test_preview_has_no_calls_and_task_independent_export(self):
        source = self.source()
        before = self.store.result(source)
        preview = self.preview(source)
        self.assertEqual(self.calls, [])
        state = self.submit(preview)
        self.assertEqual(state.status_code, 202, state.text)
        identity = state.json()["id"]
        self.assertEqual(self.wait(identity)["state"], "succeeded")
        result = self.store.result(identity, include_content=True)
        self.assertNotIn("sources", result)
        self.assertNotIn("findings", result)
        self.assertEqual(result["opinions"][0]["citation_status"], "valid")
        self.assertIsNone(result["usage"]["total_tokens"])
        self.assertEqual(before, self.store.result(source))
        exported = self.client.get(f"/api/ai/tasks/{identity}/export")
        self.assertEqual(exported.status_code, 200)
        self.assertNotIn("test-secret", exported.text)
        self.assertNotIn("SYSTEM_PROMPT", exported.text)
        self.assertEqual(self.client.get(f"/api/ai/tasks/{source}/export").status_code, 409)

    def test_idempotency_consumption_expiration_and_conflict(self):
        preview = self.preview()
        request_id = str(uuid.uuid4())
        first = self.submit(preview, request_id)
        self.assertEqual(first.status_code, 202)
        self.wait(first.json()["id"])
        self.assertEqual(self.submit(preview, request_id).json()["id"], first.json()["id"])
        self.assertEqual(len(self.calls), 1)
        self.assertEqual(self.submit(preview).status_code, 409)
        self.assertEqual(self.submit({**preview, "digest": "f" * 64}, request_id).status_code, 409)
        fresh = self.preview()
        self.store.ai_previews.entries[fresh["preview_id"]]["end"] = 0
        self.assertEqual(self.submit(fresh).status_code, 404)
        self.assertEqual(self.submit({**preview, "digest": "f" * 64}).status_code, 409)

    def test_config_consent_boundary_and_capacity_no_calls(self):
        preview = self.preview()
        data = {"preview_id": preview["preview_id"], "digest": preview["digest"]}
        self.assertEqual(self.post("/api/tasks/ai", data).status_code, 422)
        self.assertEqual(self.post("/api/tasks/ai", {**data, "consent": False}).status_code, 422)
        self.assertEqual(self.client.post("/api/ai/previews", json={}, headers={"Origin": "https://evil.example"}).status_code, 403)
        tickets = [self.store.reserve() for _ in range(self.store.capacity)]
        try:
            self.assertEqual(self.submit(preview).status_code, 429)
            self.assertIn(preview["preview_id"], self.store.ai_previews.entries)
        finally:
            for ticket in tickets:
                ticket.release()
        with patch("backend.ai.routes.get_config", return_value=replace(config(), api_key="changed")):
            self.assertEqual(self.submit(preview).status_code, 409)
        self.assertFalse(self.calls)

    def test_zero_candidates_all_abstention_error_diagnostics_and_source_expiry(self):
        preview = self.preview(self.source("x = 1"))
        identity = self.submit(preview).json()["id"]
        self.assertEqual(self.wait(identity)["state"], "succeeded")
        self.assertEqual(self.store.result(identity)["opinions"], [])
        self.assertFalse(self.calls)
        preview = self.preview()
        # 快照不固定来源生命周期。
        self.assertEqual(self.store.jobs[preview["source_task_id"]].readers, 0)
        self.store.jobs[preview["source_task_id"]].ended = -10000
        self.store._prune()
        identity = self.submit(preview).json()["id"]
        self.assertEqual(self.wait(identity)["state"], "succeeded")
        self.assertEqual(self.store.result(identity)["opinions"][0]["opinion_kind"], "abstain")
        preview = self.preview()
        with patch("backend.ai.runner.complete", side_effect=ProviderError("provider_auth", "模型鉴权失败")):
            identity = self.submit(preview).json()["id"]
            self.assertEqual(self.wait(identity)["state"], "failed")
            self.assertEqual(self.store.result(identity)["diagnostics"][0]["code"], "provider_auth")

    def test_cancel_discards_late_batch_and_keeps_complete_items(self):
        preview = self.preview(self.source("\n".join("encrypt(x)" for _ in range(6))))
        entered, release = Event(), Event()
        count = 0

        def slow(cfg, batch, deadline, **kwargs):
            nonlocal count
            count += 1
            kwargs["on_send"]()
            if count == 2:
                entered.set()
                release.wait(3)
            return json.dumps({"opinions": [opinion(candidate, citations=[]) for candidate in batch]}), Usage()

        with patch("backend.ai.runner.complete", side_effect=slow):
            identity = self.submit(preview).json()["id"]
            self.assertTrue(entered.wait(3))
            self.client.post(f"/api/tasks/{identity}/cancel")
            release.set()
            self.assertEqual(self.wait(identity)["state"], "partial")
            self.assertEqual(len(self.store.result(identity)["opinions"]), 5)
            self.assertEqual(self.store.result(identity)["ai_coverage"]["completed"], 5)

    def test_preview_limits_cleanup_and_storage_failure(self):
        source = self.source()
        for _ in range(4):
            self.preview(source)
        self.assertEqual(self.post("/api/ai/previews", {"source_task_id": source}).status_code, 429)
        for entry in self.store.ai_previews.entries.values():
            entry["end"] = 0
        self.store.ai_previews.prune()
        self.assertEqual(len(self.store.ai_previews.entries), 0)
        with patch.object(self.store.storage, "write", side_effect=RuntimeError("storage")):
            self.assertEqual(self.post("/api/ai/previews", {"source_task_id": source}).status_code, 429)
        self.assertEqual(self.store.jobs[source].readers, 0)
        self.assertEqual(self.store.ai_previews.building, 0)


    def test_source_rejections_and_preview_ttl(self):
        self.assertEqual(self.post("/api/ai/previews", {"source_task_id": "missing"}).status_code, 404)
        blocker = Event()
        running = self.store.submit("snippet", {}, str(uuid.uuid4()), lambda _: (blocker.wait(3), {})[1])
        try:
            self.assertEqual(self.post("/api/ai/previews", {"source_task_id": running["id"]}).status_code, 409)
            unsupported = self.store.submit("popular", {}, str(uuid.uuid4()), lambda _: {"repos": []})
            self.wait(unsupported["id"])
            self.assertEqual(self.post("/api/ai/previews", {"source_task_id": unsupported["id"]}).status_code, 409)
        finally:
            blocker.set()
        source = self.source()
        preview = self.preview(source)
        entry = self.store.ai_previews.entries[preview["preview_id"]]
        folder = entry["folder"]
        self.assertTrue(folder.exists())
        entry["end"] = 0
        self.store.ai_previews.prune()
        self.assertFalse(folder.exists())

    def test_submit_storage_failure_rolls_back_and_queue_snapshot_survives(self):
        preview = self.preview()
        used = self.store.scheduler.used
        with patch.object(self.store.storage, "write", side_effect=RuntimeError("capacity")):
            self.assertEqual(self.submit(preview).status_code, 429)
        self.assertEqual(self.store.scheduler.used, used)
        self.assertIn(preview["preview_id"], self.store.ai_previews.entries)
        blocker = Event()
        blockers = [self.store.submit("snippet", {"n": i}, str(uuid.uuid4()), lambda _: (blocker.wait(3), {})[1])
                    for i in range(2)]
        try:
            response = self.submit(preview)
            identity = response.json()["id"]
            self.assertEqual(response.status_code, 202, response.text)
            source = self.store.jobs[preview["source_task_id"]]
            self.assertEqual(source.readers, 0)
            source.ended = -10000
            self.store._prune()
            self.assertNotIn(source.id, self.store.jobs)
            blocker.set()
            self.assertEqual(self.wait(identity)["state"], "succeeded")
        finally:
            blocker.set()

    def test_calls_budget_and_cancel_first_late_response(self):
        preview = self.preview(self.source("encrypt(x)\nencrypt(y)"))
        with patch("backend.ai.routes.get_config", return_value=config(batch_candidates=1, max_calls=1)):
            # 配置绑定要求重新预览。
            preview = self.preview(preview["source_task_id"])
            identity = self.submit(preview).json()["id"]
            self.assertEqual(self.wait(identity)["state"], "partial")
            result = self.store.result(identity)
            self.assertEqual(result["ai_coverage"]["calls"], 1)
            self.assertEqual(result["ai_coverage"]["completed"], 1)
            self.assertIn("call_budget", [item["code"] for item in result["diagnostics"]])
        preview = self.preview()
        entered, release = Event(), Event()

        def late(cfg, batch, deadline, **kwargs):
            kwargs["on_send"]()
            entered.set()
            release.wait(3)
            return json.dumps({"opinions": [opinion(candidate) for candidate in batch]}), Usage()

        with patch("backend.ai.runner.complete", side_effect=late):
            identity = self.submit(preview).json()["id"]
            self.assertTrue(entered.wait(3))
            self.store.cancel(identity)
            release.set()
            self.assertEqual(self.wait(identity)["state"], "cancelled")
            self.assertFalse(self.store.result(identity)["opinions"])


    def test_partial_static_scope_and_timeout_retain_diagnostics(self):
        source = self.source()
        original = self.store.result(source, include_content=False)
        original["coverage"]["partial"] = True
        original_path = self.store.jobs[source].result
        self.store.storage.remove(original_path)
        self.store.jobs[source].result = self.store.storage.write_json(self.store.jobs[source].folder, original)
        preview = self.preview(source)
        self.assertTrue(preview["candidate_coverage"]["source_partial"])
        identity = self.submit(preview).json()["id"]
        self.assertEqual(self.wait(identity)["state"], "partial")
        self.store.ai_previews.close()
        with patch("backend.ai.routes.get_config", return_value=config(task_seconds=1)):
            preview = self.preview()

            def too_late(cfg, batch, deadline, **kwargs):
                kwargs["on_send"]()
                deadline.control.cancelled.wait(1.02)
                return json.dumps({"opinions": [opinion(candidate) for candidate in batch]}), Usage()

            with patch("backend.ai.runner.complete", side_effect=too_late):
                identity = self.submit(preview).json()["id"]
                self.assertEqual(self.wait(identity)["state"], "failed")
                result = self.store.result(identity)
                self.assertEqual(result["diagnostics"][0]["code"], "task_timeout")
                self.assertFalse(result["opinions"])


    def test_prepare_deadline_capacity_disabled_and_missing_source(self):
        from backend.collection_common import Deadline
        from backend.ai.config import AiConfig
        source = self.source()
        with patch("backend.ai.previews.Deadline.after", return_value=Deadline.after(-1)):
            self.assertEqual(self.post("/api/ai/previews", {"source_task_id": source}).status_code, 504)
        self.assertEqual(self.store.jobs[source].readers, 0)
        self.store.ai_previews.max_bytes = 1
        self.assertEqual(self.post("/api/ai/previews", {"source_task_id": source}).status_code, 429)
        with patch("backend.ai.routes.get_config", return_value=AiConfig()):
            self.assertEqual(self.post("/api/ai/previews", {"source_task_id": source}).status_code, 503)
        self.store.ai_previews.max_bytes = 2 * 1024 * 1024
        self.store.jobs[source].control.source_paths = {}
        self.assertEqual(self.post("/api/ai/previews", {"source_task_id": source}).status_code, 409)
        self.assertFalse(self.calls)

    def test_single_candidate_request_bytes_budget_never_calls_model(self):
        with patch("backend.ai.routes.get_config", return_value=config(request_bytes=1)):
            preview = self.preview()
            identity = self.submit(preview).json()["id"]
            self.assertEqual(self.wait(identity)["state"], "failed")
            result = self.store.result(identity)
            self.assertEqual(result["diagnostics"][0]["code"], "request_budget")
            self.assertEqual(result["ai_coverage"]["calls"], 0)
            self.assertFalse(self.calls)


if __name__ == "__main__":
    unittest.main()
