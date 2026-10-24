"""运行 A/B/C/D 脱敏消融实验；只输出指标摘要，不保存模型原文或凭据。"""
from __future__ import annotations

import json
import math
import time
from pathlib import Path
from unittest.mock import patch

from backend.ai.candidates import independent_positions
from backend.ai.config import get_config
from backend.ai.context import build_context
from backend.ai.models import AiCoverage, Candidate, CandidateCoverage, Preview, Usage, stable_digest
from backend.ai.runner import analyze
from backend.ai.metrics import throughput_metrics
from backend.collection_common import Deadline

ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / "tests/fixtures/ai/baseline/throughput_cases.py"


def no_check():
    return None


def main():
    text = FIXTURE.read_text(encoding="utf-8")
    positions, _ = independent_positions(text, FIXTURE.name, no_check)
    raw = len(positions)
    result = {"sources": [{"source_id": "baseline", "file_name": FIXTURE.name,
                            "content_available": True}], "findings": [], "diagnostics": [],
              "coverage": {"partial": False}}
    budgets = {"search_files": 10, "search_bytes": 100_000, "preview_candidates": 40,
               "preview_files": 10, "candidate_bytes": 4096, "context_bytes": 100_000}
    started = time.monotonic()
    candidates, coverage = build_context(result, lambda _: text, budgets, no_check)
    context_elapsed = time.monotonic() - started
    grouped = len(candidates)
    purpose_known = sum(item.semantic_evidence.purpose != "unknown" for item in candidates)
    base = throughput_metrics(discovered=raw, aggregated=raw, positions=raw,
                              retained_positions=raw, semantic_errors=0,
                              valid_opinions=0, opinions=0, elapsed_seconds=0.0,
                              completed=0, requests=math.ceil(raw / 5))
    only_grouped = throughput_metrics(discovered=raw, aggregated=grouped, positions=raw,
                                      retained_positions=sum(len(item.member_locations) for item in candidates),
                                      semantic_errors=0, valid_opinions=0, opinions=0,
                                      elapsed_seconds=context_elapsed, completed=0,
                                      requests=math.ceil(grouped / 5))
    with_context = dict(only_grouped)
    with_context.update({"purpose_evidence_rate": purpose_known / grouped if grouped else None,
                         "context_levels": sorted({level for item in candidates for level in item.context_levels})})
    config = get_config()
    preview = Preview(preview_id="ablation-preview", source_task_id="ablation-source",
                      digest=stable_digest([item.model_dump() for item in candidates]),
                      config_version=config.public()["config_version"], expires_at="2099-01-01T00:00:00+08:00",
                      target_origin="mock://ablation", model="fixture-model", budgets=dict(config.budgets),
                      candidates=candidates, candidate_coverage=coverage)
    def mocked_complete(cfg, batch, deadline, **kwargs):
        kwargs["on_send"]()
        rows = [{"candidate_id": item.candidate_id, "algorithm": "RSA", "purpose": item.semantic_evidence.purpose,
                 "opinion_kind": "abstain", "rationale": "固定脱敏 fixture 仅用于吞吐验证。",
                 "missing_information": ["真实用途需人工核查"], "migration_direction": None,
                 "applicability": [], "manual_checks": ["核对协议与部署条件"], "citations": []} for item in batch]
        return json.dumps({"opinions": rows}), Usage(prompt_tokens=10, completion_tokens=10, total_tokens=20)
    started = time.monotonic()
    with patch("backend.ai.runner.complete", side_effect=mocked_complete):
        full = analyze(preview, config, Deadline.after(10))
    full_elapsed = time.monotonic() - started
    full_result = json.loads(json.dumps(full))
    d = throughput_metrics(discovered=raw, aggregated=grouped, positions=raw,
                           retained_positions=sum(len(item.member_locations) for item in candidates),
                           semantic_errors=0,
                           valid_opinions=sum(item["citation_status"] == "absent" for item in full_result["opinions"]),
                           opinions=len(full_result["opinions"]), elapsed_seconds=full_elapsed,
                           completed=full_result["ai_coverage"]["completed"],
                           requests=full_result["ai_coverage"]["calls"])
    d.update({"purpose_evidence_rate": purpose_known / grouped if grouped else None,
              "context_levels": sorted({level for item in candidates for level in item.context_levels}),
              "retries": full_result["ai_coverage"]["retries"], "timeout_rate": 0.0})
    output = {"experiment_version": "ai-throughput-ablation-1", "fixture": str(FIXTURE.relative_to(ROOT)),
              "source_digest": stable_digest(text), "generated_at": "2026-10-24", "credentials_logged": False,
              "groups": {"A_baseline": base, "B_aggregation": only_grouped,
                         "C_aggregation_context": with_context, "D_full": d}}
    print(json.dumps(output, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
