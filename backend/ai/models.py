from __future__ import annotations

import hashlib
import json
from typing import Annotated, Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

SCHEMA_VERSION = "1"
RULE_VERSION = "ai-candidates-1"
PROMPT_VERSION = "ai-review-1"
VALIDATION_VERSION = "ai-citations-1"
Identifier = Annotated[str, Field(min_length=1, max_length=256)]
Digest = Annotated[str, Field(pattern=r"^[0-9a-f]{64}$")]
Label = Annotated[str, Field(min_length=1, max_length=120)]
OpinionKind = Literal["supports_static", "questions_static", "new_candidate", "abstain"]
CitationStatus = Literal["valid", "invalid", "absent"]


def stable_digest(value: Any) -> str:
    """以规范 JSON 指纹绑定输入，字典顺序不影响结果。"""
    data = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


def finding_fingerprint(finding: dict) -> str:
    # 不依赖列表下标；路径同名时仍保留 source_id 身份。
    return stable_digest({key: finding.get(key) for key in (
        "source_id", "line", "algorithm", "detection_method", "library", "resolved_api", "evidence"
    )})


class AiModel(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)


class EvidenceLine(AiModel):
    line: int = Field(ge=1)
    text: str = Field(max_length=8192)


class Candidate(AiModel):
    candidate_id: Digest
    source_id: Identifier
    file_name: str = Field(min_length=1, max_length=4096)
    start_line: int = Field(ge=1)
    end_line: int = Field(ge=1)
    origins: list[Literal["static", "independent", "pem_diagnostic"]] = Field(min_length=1, max_length=3)
    rules: list[Label] = Field(min_length=1, max_length=16)
    input_digest: Digest
    static_finding_refs: list[Digest] = Field(default_factory=list, max_length=100)
    lines: list[EvidenceLine] = Field(default_factory=list, max_length=500)

    @model_validator(mode="after")
    def ordered_range(self) -> Candidate:
        if self.end_line < self.start_line:
            raise ValueError("候选行范围无效")
        numbers = [item.line for item in self.lines]
        if numbers != sorted(set(numbers)):
            raise ValueError("上下文行号必须递增且唯一")
        if sum(len(item.text.encode("utf-8")) + 1 for item in self.lines) > 8192:
            raise ValueError("候选上下文超过 8 KiB")
        return self


class Citation(AiModel):
    source_id: Identifier
    start_line: int = Field(ge=1)
    end_line: int = Field(ge=1)
    quote: str = Field(min_length=1, max_length=8192)

    @model_validator(mode="after")
    def ordered_range(self) -> Citation:
        if self.end_line < self.start_line:
            raise ValueError("引用行范围无效")
        return self


class ModelOpinion(AiModel):
    candidate_id: Digest
    algorithm: Label
    purpose: Label
    opinion_kind: OpinionKind
    rationale: str = Field(min_length=1, max_length=2000)
    missing_information: list[Annotated[str, Field(min_length=1, max_length=500)]] = Field(max_length=10)
    citations: list[Citation] = Field(max_length=10)


class Opinion(ModelOpinion):
    citation_status: CitationStatus
    citation_errors: list[str] = Field(default_factory=list, max_length=20)


class AiDiagnostic(AiModel):
    code: Label
    message: str = Field(min_length=1, max_length=500)
    candidate_id: Digest | None = None
    source_id: Identifier | None = None


class CandidateCoverage(AiModel):
    source_files: int = Field(default=0, ge=0)
    searched_files: int = Field(default=0, ge=0)
    searched_bytes: int = Field(default=0, ge=0)
    selected_files: int = Field(default=0, ge=0)
    discovered_candidates: int = Field(default=0, ge=0)
    selected_candidates: int = Field(default=0, ge=0)
    context_bytes: int = Field(default=0, ge=0)
    source_partial: bool = False
    partial: bool = False
    skip_reasons: dict[str, int] = Field(default_factory=dict)


class AiCoverage(AiModel):
    planned: int = Field(ge=0)
    completed: int = Field(default=0, ge=0)
    calls: int = Field(default=0, ge=0)
    partial: bool = False


class Usage(AiModel):
    prompt_tokens: int | None = Field(default=None, ge=0)
    completion_tokens: int | None = Field(default=None, ge=0)
    total_tokens: int | None = Field(default=None, ge=0)


class PreviewRequest(AiModel):
    source_task_id: Identifier


class SubmitRequest(AiModel):
    preview_id: Identifier
    digest: Digest
    consent: Literal[True]

    @field_validator("consent", mode="before")
    @classmethod
    def explicit_consent(cls, value: Any) -> bool:
        if value is not True:
            raise ValueError("请主动确认本次发送")
        return value


class Preview(AiModel):
    preview_id: Identifier
    source_task_id: Identifier
    digest: Digest
    config_version: Digest
    expires_at: str
    target_origin: str
    model: str
    budgets: dict[str, int]
    candidates: list[Candidate] = Field(max_length=40)
    candidate_coverage: CandidateCoverage
    diagnostics: list[AiDiagnostic] = Field(default_factory=list)
    notice: str = "脱敏不能保证发现所有秘密，请检查本次片段。已发送数据无法撤回，取消只能停止后续请求。"


class AiAnalysisResult(AiModel):
    schema_version: Literal["1"] = SCHEMA_VERSION
    source_task_id: Identifier
    input_digest: Digest
    created_at: str
    provider: str
    model: str
    rule_version: str = RULE_VERSION
    prompt_version: str = PROMPT_VERSION
    validation_version: str = VALIDATION_VERSION
    candidate_coverage: CandidateCoverage
    ai_coverage: AiCoverage
    candidates: list[Candidate] = Field(max_length=40)
    opinions: list[Opinion] = Field(default_factory=list, max_length=40)
    diagnostics: list[AiDiagnostic] = Field(default_factory=list)
    usage: Usage = Field(default_factory=Usage)
