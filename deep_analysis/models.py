"""Versioned static contracts; no dependency on backend or legacy findings."""
from __future__ import annotations

from typing import Annotated, Literal, Union

from pydantic import BaseModel, ConfigDict, Field, model_validator

Text = Annotated[str, Field(min_length=1, max_length=512)]
Digest = Annotated[str, Field(pattern=r"^[0-9a-f]{64}$")]
Count = Annotated[int, Field(strict=True, ge=0)]
Scalar = Union[Annotated[str, Field(max_length=2048)], bool, int, float, None]
SourceType = Literal["snippet", "manual_upload", "github_repository", "pypi_package"]
Resolution = Literal["resolved", "ambiguous", "unknown"]
EdgeType = Literal["CALLS", "IMPORT_BINDING", "ASSIGN_FLOW", "ARGUMENT_FLOW", "RETURN_FLOW", "KEY_TYPE_FLOW"]
ClaimType = Literal["ALGORITHM", "OPERATION_TYPE", "KEY_SOURCE", "QUANTUM_CLASS"]
OperationType = Literal["sign", "verify", "encrypt", "decrypt", "key_generation", "key_exchange", "key_import", "unknown"]


class Contract(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True, allow_inf_nan=False)


class Span(Contract):
    """End-exclusive location: one-based lines, zero-based UTF-8 byte columns."""

    source_id: Text
    start_line: Annotated[int, Field(strict=True, ge=1)]
    start_col: Count
    end_line: Annotated[int, Field(strict=True, ge=1)]
    end_col: Count

    @model_validator(mode="after")
    def ordered(self) -> Span:
        if (self.end_line, self.end_col) <= (self.start_line, self.start_col):
            raise ValueError("位置必须为非空、结束不包含的有序范围")
        return self


class Known(Contract):
    kind: Literal["known"] = "known"
    value: Scalar


class Alternative(Contract):
    value: Scalar
    conditions: Annotated[tuple[Text, ...], Field(max_length=16)] = ()


class Ambiguous(Contract):
    kind: Literal["ambiguous"] = "ambiguous"
    alternatives: Annotated[tuple[Alternative, ...], Field(min_length=2, max_length=4)]


class Unknown(Contract):
    kind: Literal["unknown"] = "unknown"
    reason: Text
    # Known alternatives never erase an unknown branch.
    alternatives: Annotated[tuple[Alternative, ...], Field(max_length=4)] = ()


AbstractValue = Annotated[Union[Known, Ambiguous, Unknown], Field(discriminator="kind")]


class Versions(Contract):
    rules: Text
    semantics: Text
    engine: Text
    verifier: Text
    host_python: Text
    target_python: Text
    library_profiles: Annotated[tuple[Text, ...], Field(max_length=8)] = ()


class SourceIdentity(Contract):
    source_id: Text
    relative_path: Text
    sha256: Digest
    size_bytes: Annotated[int, Field(strict=True, ge=0, le=2 * 1024 * 1024)]


class CoverageCount(Contract):
    count: Count
    total: Count | None = None

    @model_validator(mode="after")
    def bounded(self) -> CoverageCount:
        if self.total is not None and self.count > self.total:
            raise ValueError("已处理数不能超过已知总数")
        return self


class Coverage(Contract):
    collected: CoverageCount
    available: CoverageCount
    selected: CoverageCount
    parsed: CoverageCount
    analyzed: CoverageCount
    partial: bool = False
    gaps: Annotated[tuple[Text, ...], Field(max_length=200)] = ()


class SnapshotIdentity(Contract):
    snapshot_id: Text
    source_type: SourceType
    path_fidelity: Literal["relative_paths", "flat_basename", "snippet"]
    sources: Annotated[tuple[SourceIdentity, ...], Field(max_length=5000)]
    package_roots: Annotated[tuple[Text, ...], Field(max_length=200)] = ()
    commit: Text | None = None
    collection_version: Text
    coverage: Coverage

    @model_validator(mode="after")
    def unique_sources(self) -> SnapshotIdentity:
        ids = [source.source_id for source in self.sources]
        if len(ids) != len(set(ids)):
            raise ValueError("快照source_id重复")
        if sum(source.size_bytes for source in self.sources) > 100 * 1024 * 1024:
            raise ValueError("快照超过100MiB")
        return self


class ArgumentFact(Contract):
    parameter: Text
    # An identity of the fact, not raw key material or a password.
    fact_id: Text


class CallContext(Contract):
    kind: Literal["invocation", "uninstantiated_template"]
    call_chain: Annotated[tuple[Span, ...], Field(max_length=5)] = ()
    arguments: Annotated[tuple[ArgumentFact, ...], Field(max_length=64)] = ()
    conditions: Annotated[tuple[Text, ...], Field(max_length=16)] = ()

    @model_validator(mode="after")
    def template_has_no_caller(self) -> CallContext:
        if self.kind == "uninstantiated_template" and self.call_chain:
            raise ValueError("未实例化模板不能携带调用链")
        parameters = [item.parameter for item in self.arguments]
        if len(parameters) != len(set(parameters)):
            raise ValueError("参数事实重复")
        return self


class Claim(Contract):
    claim_type: ClaimType
    value: AbstractValue
    resolution_status: Resolution
    level: Literal["E0", "E1", "E2", "E3"]
    evidence_ids: Annotated[tuple[Text, ...], Field(max_length=200)] = ()
    missing_edges: Annotated[tuple[EdgeType, ...], Field(max_length=6)] = ()
    reasons: Annotated[tuple[Text, ...], Field(max_length=32)] = ()

    @model_validator(mode="after")
    def consistent(self) -> Claim:
        expected = {"known": "resolved", "ambiguous": "ambiguous", "unknown": "unknown"}
        if self.resolution_status != expected[self.value.kind]:
            raise ValueError("claim解析状态与抽象值不一致")
        if self.level == "E3" and (self.value.kind != "known" or self.missing_edges or not self.evidence_ids):
            raise ValueError("E3需要唯一值及完整证据引用；仍须独立verifier核验")
        return self


class EvidenceNode(Contract):
    node_id: Text
    location: Span
    source_sha256: Digest
    expression: Annotated[str, Field(max_length=2048)] = ""
    redacted: bool = False


class EvidenceEdge(Contract):
    edge_id: Text
    edge_type: EdgeType
    source_node: Text
    target_node: Text
    conditions: Annotated[tuple[Text, ...], Field(max_length=16)] = ()


class EvidencePath(Contract):
    evidence_id: Text
    claim_type: ClaimType | None = None
    snapshot_id: Text
    context: CallContext
    nodes: Annotated[tuple[EvidenceNode, ...], Field(min_length=1, max_length=400)]
    edges: Annotated[tuple[EvidenceEdge, ...], Field(max_length=400)] = ()
    verification_status: Literal["unverified", "valid", "invalid"] = "unverified"
    historical_verification_status: Literal["valid", "invalid"] | None = None
    replay_status: Literal["available", "unavailable", "requires_revalidation"] = "requires_revalidation"
    gaps: Annotated[tuple[Text, ...], Field(max_length=32)] = ()
    versions: Versions

    @model_validator(mode="after")
    def references(self) -> EvidencePath:
        node_ids = [node.node_id for node in self.nodes]
        edge_ids = [edge.edge_id for edge in self.edges]
        if len(set(node_ids)) != len(node_ids) or len(set(edge_ids)) != len(edge_ids):
            raise ValueError("证据节点或边身份重复")
        if any(edge.source_node not in node_ids or edge.target_node not in node_ids for edge in self.edges):
            raise ValueError("证据边引用不存在节点")
        return self


class CryptoOperation(Contract):
    evidence_scope: Literal['static_call', 'algorithm_policy'] = 'static_call'
    operation_id: Text
    template_id: Text
    api: Text
    library: Text
    operation_type: OperationType
    algorithm: AbstractValue
    algorithm_family: Text | None = None
    resolution_status: Resolution
    call_site: Span | None
    sink_location: Span
    context: CallContext
    evidence_ids: Annotated[tuple[Text, ...], Field(max_length=200)] = ()
    claims: Annotated[tuple[Claim, ...], Field(min_length=4, max_length=4)]
    risk_category: Literal["quantum_vulnerable", "symmetric", "unknown"]

    @model_validator(mode="after")
    def claim_set(self) -> CryptoOperation:
        if {claim.claim_type for claim in self.claims} != {"ALGORITHM", "OPERATION_TYPE", "KEY_SOURCE", "QUANTUM_CLASS"}:
            raise ValueError("操作必须分别记录四类claim")
        algorithm_claim = next(claim for claim in self.claims if claim.claim_type == "ALGORITHM")
        if self.algorithm != algorithm_claim.value or self.resolution_status != algorithm_claim.resolution_status:
            raise ValueError("操作算法与逐项claim不一致")
        if (self.call_site is None) != (self.context.kind == "uninstantiated_template"):
            raise ValueError("调用点与模板上下文不一致")
        return self


class Budgets(Contract):
    python_files: Annotated[int, Field(strict=True, ge=0, le=5000)] = 5000
    source_bytes: Annotated[int, Field(strict=True, ge=0, le=100 * 1024 * 1024)] = 100 * 1024 * 1024
    ast_nodes: Annotated[int, Field(strict=True, ge=0, le=50000)] = 50000
    ast_depth: Annotated[int, Field(strict=True, ge=0, le=64)] = 64
    index_nodes: Annotated[int, Field(strict=True, ge=0, le=2000000)] = 2000000
    index_edges: Annotated[int, Field(strict=True, ge=0, le=4000000)] = 4000000
    structure_bytes: Annotated[int, Field(strict=True, ge=0, le=256 * 1024 * 1024)] = 256 * 1024 * 1024
    slice_nodes: Annotated[int, Field(strict=True, ge=0, le=400)] = 400
    call_depth: Annotated[int, Field(strict=True, ge=0, le=5)] = 5
    contexts_per_function: Annotated[int, Field(strict=True, ge=0, le=64)] = 64
    value_candidates: Annotated[int, Field(strict=True, ge=0, le=4)] = 4
    seconds: Annotated[float, Field(ge=0, le=180)] = 180
    effective_seconds: Annotated[float, Field(ge=0, le=180)] = 180
    queue_seconds: Annotated[float, Field(ge=0)] = 0
    cpu_wait_seconds: Annotated[float, Field(ge=0)] = 0
    analysis_seconds: Annotated[float, Field(ge=0)] = 0
    physical_read_bytes: Count = 0
    unique_read_bytes: Count = 0
    used_nodes: Count = 0
    used_edges: Count = 0
    used_structure_bytes: Count = 0


class Diagnostic(Contract):
    code: Text
    message: Text
    location: Span | None = None


class DeepAnalysisResult(Contract):
    schema_version: Literal["deep-static-1"] = "deep-static-1"
    status: Literal["completed", "partial", "failed", "cancelled", "skipped"]
    snapshot: SnapshotIdentity
    operations: Annotated[tuple[CryptoOperation, ...], Field(max_length=10000)] = ()
    evidence_paths: Annotated[tuple[EvidencePath, ...], Field(max_length=10000)] = ()
    coverage: Coverage
    diagnostics: Annotated[tuple[Diagnostic, ...], Field(max_length=1000)] = ()
    budgets: Budgets = Field(default_factory=Budgets)
    versions: Versions

    @model_validator(mode="after")
    def linked(self) -> DeepAnalysisResult:
        paths = {path.evidence_id: path for path in self.evidence_paths}
        if len(paths) != len(self.evidence_paths):
            raise ValueError("证据身份重复")
        ids = [operation.operation_id for operation in self.operations]
        if len(ids) != len(set(ids)):
            raise ValueError("操作身份重复")
        sources = {source.source_id: source for source in self.snapshot.sources}
        for path in self.evidence_paths:
            if path.snapshot_id != self.snapshot.snapshot_id or path.versions != self.versions:
                raise ValueError("证据快照或版本不一致")
            for node in path.nodes:
                source = sources.get(node.location.source_id)
                if source is None or node.source_sha256 != source.sha256:
                    raise ValueError("证据节点来源或摘要与快照不一致")
        for operation in self.operations:
            locations = (operation.sink_location, *operation.context.call_chain)
            if operation.call_site is not None:
                locations = (*locations, operation.call_site)
            if any(location.source_id not in sources for location in locations):
                raise ValueError("操作位置引用快照外来源")
            references = (*operation.evidence_ids, *(ref for claim in operation.claims for ref in claim.evidence_ids))
            if any(ref not in paths or paths[ref].context != operation.context for ref in references):
                raise ValueError("操作引用缺失或其他上下文证据")
            for claim in operation.claims:
                if claim.level == "E3" and any(paths[ref].verification_status != "valid" for ref in claim.evidence_ids):
                    raise ValueError("E3引用的路径尚未通过独立核验")
        return self
