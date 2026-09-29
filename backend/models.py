from __future__ import annotations

from typing import Any, Literal, Optional
from pydantic import BaseModel, Field
from backend.collectors import validate_github_repository_url, validate_pypi_package_name

MAX_SOURCE_BYTES = 2 * 1024 * 1024
SourceType = Literal["snippet", "manual_upload", "github_repository", "pypi_package"]

class SnippetScanRequest(BaseModel):
    filename: str = Field(default="snippet.py", min_length=1, max_length=240)
    content: str = Field(default="", max_length=MAX_SOURCE_BYTES)


class GitHubScanRequest(BaseModel):
    repository_url: str = Field(min_length=1, max_length=500)

    def __init__(self, **data: Any) -> None:
        super().__init__(**data)
        self.repository_url = validate_github_repository_url(self.repository_url)


class PyPIScanRequest(BaseModel):
    package_name: str = Field(min_length=1, max_length=214)

    def __init__(self, **data: Any) -> None:
        super().__init__(**data)
        self.package_name = validate_pypi_package_name(self.package_name)


class SourceRecord(BaseModel):
    source_id: str
    file_name: str
    source_type: SourceType
    content: str
    line_count: int
    char_count: int
    origin: Optional[str] = None


class FindingRecord(BaseModel):
    source_id: str
    file_name: str
    source_type: SourceType
    line: int
    algorithm: str
    risk_level: str
    evidence: str
    reason: str
    recommendation: str


class ScanSummary(BaseModel):
    source_count: int
    finding_count: int
    algorithm_counts: dict[str, int]
    migration_score: dict[str, int | str]


class Coverage(BaseModel):
    scanned_files: int
    file_limit: int | None = None
    candidate_files: int | None = None
    skipped_files: int = 0
    partial: bool = False


class Diagnostic(BaseModel):
    code: str
    message: str
    source_id: str | None = None


class ScanResponse(BaseModel):
    scanned_at: str
    source_type: SourceType
    sources: list[SourceRecord]
    findings: list[FindingRecord]
    summary: ScanSummary
    coverage: Coverage | None = None
    diagnostics: list[Diagnostic] = Field(default_factory=list)


class ReportRequest(BaseModel):
    coverage: Coverage | None = None
    diagnostics: list[Diagnostic] = Field(default_factory=list)
    scanned_at: Optional[str] = None
    source_type: SourceType = "manual_upload"
    sources: list[SourceRecord] = Field(default_factory=list)
    findings: list[FindingRecord] = Field(default_factory=list)


class SampleSourceRecord(BaseModel):
    file_name: str
    content: str
    line_count: int
    char_count: int



class PopularScanRequest(BaseModel):
    top: int = Field(default=8, ge=1, le=30)
