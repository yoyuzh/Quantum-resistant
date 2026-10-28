"""Internal unverified semantic facts. These are never a production export schema."""
from __future__ import annotations

from dataclasses import dataclass, field

from original_a.deep_analysis.models import AbstractValue, CallContext, Coverage, Diagnostic, Span


@dataclass(frozen=True)
class FlowStep:
    step_id: str
    kind: str
    source: Span
    destination: Span
    context_id: str
    parameter: str | None = None


@dataclass(frozen=True)
class Fact:
    fact_id: str
    value: AbstractValue = field(repr=False)
    steps: tuple[FlowStep, ...] = ()
    conditions: tuple[str, ...] = ()
    # Literal containers preserve structure without pretending a list is a scalar.
    items: tuple[Fact, ...] | None = field(default=None, repr=False)
    # Typed provenance is separate from scalars: a source string cannot forge a key.
    key_type: str | None = None
    key_origin: Span | None = None


@dataclass(frozen=True)
class Candidate:
    operation_id: str
    template_id: str
    api: str | None
    sink: Span
    context: CallContext
    arguments: tuple[tuple[str, Fact], ...] = field(repr=False)
    reason: str | None = None

    def argument(self, name: str) -> Fact | None:
        return dict(self.arguments).get(name)


@dataclass(frozen=True)
class SemanticResult:
    snapshot_id: str
    candidates: tuple[Candidate, ...]
    diagnostics: tuple[Diagnostic, ...]
    coverage: Coverage
    semantics_version: str
    discovery_version: str
    cache_entries: int
    cache_hits: int
    fact_count: int
    step_count: int
    structure_bytes: int
    nodes_used: int = 0
    edges_used: int = 0
