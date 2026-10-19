"""Canonical identities and exact source positions, independent of any engine."""
from __future__ import annotations

import hashlib
import json

from deep_analysis.models import CallContext, SnapshotIdentity, Span


def stable_id(kind: str, facts: object) -> str:
    encoded = json.dumps(facts, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False).encode("utf-8")
    return f"{kind}:{hashlib.sha256(encoded).hexdigest()}"


def content_digest(content: str) -> str:
    """Digest decoded text re-encoded as UTF-8, without newline/BOM rewriting."""
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def snapshot_id(snapshot: SnapshotIdentity) -> str:
    facts = snapshot.model_dump(mode="json", exclude={"snapshot_id"})
    facts["sources"] = sorted(facts["sources"], key=lambda item: (item["relative_path"], item["source_id"]))
    facts["package_roots"] = sorted(facts["package_roots"])
    return stable_id("snapshot", facts)


def template_id(snapshot: str, sink: Span, rules: str) -> str:
    return stable_id("template", [snapshot, sink.model_dump(mode="json"), rules])


def operation_id(snapshot: str, sink: Span, context: CallContext, rules: str, semantics: str) -> str:
    facts = context.model_dump(mode="json")
    facts["arguments"] = sorted(facts["arguments"], key=lambda fact: fact["parameter"])
    return stable_id("operation", [template_id(snapshot, sink, rules), facts, semantics])


def extract_span(content: str, span: Span) -> str:
    """Reject out-of-bounds or split code points instead of rounding columns."""
    # Only LF separates Python source lines; preserve CRLF and Unicode separators.
    lines = content.encode("utf-8").split(b"\n")
    if span.end_line > len(lines):
        raise ValueError("位置超出源码行数")
    start = lines[span.start_line - 1]
    end = lines[span.end_line - 1]
    if span.start_col > len(start) or span.end_col > len(end):
        raise ValueError("位置超出源码字节列")
    # Explicitly verify boundaries even for a multi-line slice.
    start[:span.start_col].decode("utf-8")
    end[:span.end_col].decode("utf-8")
    if span.start_line == span.end_line:
        data = start[span.start_col:span.end_col]
    else:
        data = b"\n".join([start[span.start_col:], *lines[span.start_line:span.end_line - 1], end[:span.end_col]])
    return data.decode("utf-8")
