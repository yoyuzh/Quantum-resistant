"""Load a frozen, explicitly annotated corpus without executing target modules."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from deep_analysis.evaluation import EdgeLabel, ExperimentCase, OperationLabel, Prediction
from deep_analysis.identity import content_digest, stable_id
from deep_analysis.inputs import LogicalInput, LogicalSource
from deep_analysis.models import Known, SourceIdentity, Span, Unknown, Ambiguous, Alternative

ROOT = Path(__file__).with_name("fixtures")


def anchor_span(case: dict, reference: list) -> Span:
    """References are hand-selected [relative_path, exact_text, occurrence]."""
    path, needle, occurrence = reference
    source = case["files"][path]
    offset = -1
    for _ in range(occurrence + 1):
        offset = source.index(needle, offset + 1)
    prefix = source[:offset]
    end = source[:offset + len(needle)]
    return Span(source_id=stable_id("fixture-source", [case["id"], path]),
                start_line=prefix.count("\n") + 1, start_col=len(prefix.rsplit("\n", 1)[-1].encode("utf-8")),
                end_line=end.count("\n") + 1, end_col=len(end.rsplit("\n", 1)[-1].encode("utf-8")))


def load_catalog() -> tuple[dict, ...]:
    raw = (ROOT / "corpus.json").read_bytes()
    manifest = json.loads((ROOT / "manifest.json").read_text())
    if hashlib.sha256(raw).hexdigest() != manifest["corpus_sha256"]:
        raise ValueError("夹具清单已变化，必须审查并显式重新冻结")
    cases = json.loads(raw)
    for case in cases:
        digests = {path: content_digest(text) for path, text in case["files"].items()}
        if digests != manifest["sources"][case["id"]]:
            raise ValueError("夹具源码摘要变化")
    return tuple(cases)


def as_experiment(case: dict) -> ExperimentCase:
    sources = tuple(LogicalSource(identity=SourceIdentity(
        source_id=stable_id("fixture-source", [case["id"], path]), relative_path=path,
        sha256=content_digest(content), size_bytes=len(content.encode("utf-8"))), content=content)
        for path, content in sorted(case["files"].items()))
    snapshot = stable_id("fixture-snapshot", [source.identity.model_dump(mode="json") for source in sources])
    operations, edges = [], []
    for item in case["operations"]:
        context = tuple(anchor_span(case, ref) for ref in item["context"])
        if "unknown" in item:
            algorithm = Unknown(reason=item["unknown"])
        elif "ambiguous" in item:
            algorithm = Ambiguous(alternatives=tuple(Alternative(value=value, conditions=(condition,))
                                                     for value, condition in item["ambiguous"]))
        else:
            algorithm = Known(value=item["algorithm"])
        operations.append(OperationLabel(snapshot_id=snapshot, sink=anchor_span(case, item["sink"]),
                                         operation_type=item["type"], context_kind=item.get("context_kind", "invocation"),
                                         context=context, algorithm=algorithm,
                                         supported=item.get("supported", True)))
        for kind, start, end in item["edges"]:
            edges.append(EdgeLabel(snapshot_id=snapshot, context=context, edge_type=kind,
                                   source=anchor_span(case, start), target=anchor_span(case, end)))
    return ExperimentCase(case_id=case["id"], inputs=LogicalInput(sources=sources),
                          expected=Prediction(operations=tuple(operations), edges=tuple(edges)))


def load_cases(split: str | None = None) -> tuple[ExperimentCase, ...]:
    return tuple(as_experiment(case) for case in load_catalog() if split is None or case["split"] == split)
