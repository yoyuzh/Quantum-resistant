from __future__ import annotations

import json
from email import policy
from email.parser import BytesParser
from pathlib import Path
from pathlib import PurePath
from typing import Any, Literal, Optional

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from backend.collectors import (
    CollectionError,
    collect_github_sources,
    collect_pypi_sources,
    validate_github_repository_url,
    validate_pypi_package_name,
)
from backend.reporting import beijing_now_iso, build_markdown_report, build_summary
from scan_quantum_vuln import make_source_id, scan_source_for_crypto

MAX_SOURCE_BYTES = 2 * 1024 * 1024
MAX_TOTAL_UPLOAD_BYTES = 10 * 1024 * 1024
PROJECT_ROOT = Path(__file__).resolve().parents[1]
WEB_DIR = PROJECT_ROOT / "web"
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


class ScanResponse(BaseModel):
    scanned_at: str
    source_type: SourceType
    sources: list[SourceRecord]
    findings: list[FindingRecord]
    summary: ScanSummary


class ReportRequest(BaseModel):
    scanned_at: Optional[str] = None
    source_type: SourceType = "manual_upload"
    sources: list[SourceRecord] = Field(default_factory=list)
    findings: list[FindingRecord] = Field(default_factory=list)


app = FastAPI(title="Quantum Crypto Migration Scanner", version="0.1.0")

app.mount("/static", StaticFiles(directory=WEB_DIR), name="static")


def normalize_filename(filename: str, fallback: str = "snippet.py") -> str:
    cleaned = filename.replace("\\", "/").split("/")[-1].strip()
    cleaned = PurePath(cleaned).name
    return cleaned or fallback


def build_scan_response(
    documents: list[tuple[str, str] | tuple[str, str, str]],
    source_type: SourceType,
) -> ScanResponse:
    scanned_at = beijing_now_iso()
    sources: list[dict[str, Any]] = []
    findings: list[dict[str, Any]] = []

    for index, document in enumerate(documents):
        if len(document) == 3:
            origin, filename, content = document
        else:
            filename, content = document
            origin = None
        if len(content.encode("utf-8")) > MAX_SOURCE_BYTES:
            raise HTTPException(status_code=413, detail=f"{filename} exceeds the 2 MB limit")

        source_id = make_source_id(f"{index}:{filename}", content)
        source_record = {
            "source_id": source_id,
            "file_name": filename,
            "source_type": source_type,
            "content": content,
            "line_count": len(content.splitlines()),
            "char_count": len(content),
            "origin": origin,
        }
        sources.append(source_record)
        findings.extend(
            scan_source_for_crypto(
                content,
                filename=filename,
                source_type=source_type,
                source_id=source_id,
            )
        )

    summary = build_summary(sources, findings)
    return ScanResponse(
        scanned_at=scanned_at,
        source_type=source_type,
        sources=sources,
        findings=findings,
        summary=summary,
    )


def parse_multipart_files(content_type: str, body: bytes) -> list[tuple[str, str]]:
    if "multipart/form-data" not in content_type:
        raise HTTPException(status_code=415, detail="Expected multipart/form-data")
    if len(body) > MAX_TOTAL_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Upload exceeds the 10 MB limit")

    raw_message = (
        f"Content-Type: {content_type}\r\nMIME-Version: 1.0\r\n\r\n".encode("utf-8") + body
    )
    message = BytesParser(policy=policy.default).parsebytes(raw_message)
    if not message.is_multipart():
        raise HTTPException(status_code=400, detail="Invalid multipart payload")

    documents: list[tuple[str, str]] = []
    for part in message.iter_parts():
        filename = part.get_filename()
        if not filename:
            continue

        payload = part.get_payload(decode=True) or b""
        if len(payload) > MAX_SOURCE_BYTES:
            raise HTTPException(status_code=413, detail=f"{filename} exceeds the 2 MB limit")

        try:
            content = payload.decode("utf-8-sig")
        except UnicodeDecodeError as exc:
            raise HTTPException(
                status_code=400,
                detail=f"{filename} is not valid UTF-8 text",
            ) from exc

        documents.append((normalize_filename(filename, "uploaded.py"), content))

    if not documents:
        raise HTTPException(status_code=400, detail="No files were uploaded")
    return documents


def model_to_dict(model: BaseModel) -> dict[str, Any]:
    if hasattr(model, "model_dump"):
        return model.model_dump()
    return model.dict()


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/", include_in_schema=False)
def index() -> FileResponse:
    return FileResponse(WEB_DIR / "index.html", headers={"Cache-Control": "no-store"})


@app.post("/api/scan/snippet", response_model=ScanResponse)
def scan_snippet(payload: SnippetScanRequest) -> ScanResponse:
    filename = normalize_filename(payload.filename, "snippet.py")
    return build_scan_response([(filename, payload.content)], source_type="snippet")


@app.post("/api/scan/files", response_model=ScanResponse)
async def scan_files(request: Request) -> ScanResponse:
    content_type = request.headers.get("content-type", "")
    body = await request.body()
    documents = parse_multipart_files(content_type, body)
    return build_scan_response(documents, source_type="manual_upload")


@app.post("/api/scan/github", response_model=ScanResponse)
def scan_github(payload: GitHubScanRequest) -> ScanResponse:
    try:
        documents = collect_github_sources(payload.repository_url)
    except CollectionError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    if not documents:
        raise HTTPException(status_code=404, detail="未找到可扫描的仓库源码文件")
    return build_scan_response(documents, source_type="github_repository")


@app.post("/api/scan/pypi", response_model=ScanResponse)
def scan_pypi(payload: PyPIScanRequest) -> ScanResponse:
    try:
        documents = collect_pypi_sources(payload.package_name)
    except CollectionError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    if not documents:
        raise HTTPException(status_code=404, detail="未找到可扫描的 PyPI 包源码文件")
    return build_scan_response(documents, source_type="pypi_package")


@app.get("/api/knowledge/graph")
def knowledge_graph() -> dict[str, list[dict[str, str]]]:
    nodes = [
        {"id": "algorithm:RSA", "label": "RSA", "type": "Algorithm"},
        {"id": "algorithm:DSA", "label": "DSA", "type": "Algorithm"},
        {"id": "algorithm:DH", "label": "DH", "type": "Algorithm"},
        {"id": "algorithm:ECDH", "label": "ECDH", "type": "Algorithm"},
        {"id": "algorithm:ECDSA", "label": "ECDSA", "type": "Algorithm"},
        {"id": "algorithm:ECC", "label": "ECC", "type": "Algorithm"},
        {"id": "algorithm:X25519", "label": "X25519", "type": "Algorithm"},
        {"id": "algorithm:Ed25519", "label": "Ed25519", "type": "Algorithm"},
        {"id": "math:integer-factorization", "label": "大整数分解", "type": "MathProblem"},
        {"id": "math:discrete-log", "label": "离散对数", "type": "MathProblem"},
        {"id": "math:elliptic-curve-dlog", "label": "椭圆曲线离散对数", "type": "MathProblem"},
        {"id": "risk:shor", "label": "Shor 算法量子威胁", "type": "Risk"},
        {"id": "pqc:ML-KEM", "label": "ML-KEM / FIPS 203", "type": "PQCRecommendation"},
        {"id": "pqc:ML-DSA", "label": "ML-DSA / FIPS 204", "type": "PQCRecommendation"},
        {"id": "pqc:SLH-DSA", "label": "SLH-DSA / FIPS 205", "type": "PQCRecommendation"},
        {"id": "api:cryptography", "label": "cryptography API", "type": "LibraryAPI"},
        {"id": "api:pycryptodome", "label": "PyCryptodome API", "type": "LibraryAPI"},
        {"id": "protocol:jwt-ssh", "label": "JWT / SSH 算法标识", "type": "ProtocolIdentifier"},
    ]
    edges = [
        {"source": "algorithm:RSA", "target": "math:integer-factorization", "label": "依赖"},
        {"source": "algorithm:DSA", "target": "math:discrete-log", "label": "依赖"},
        {"source": "algorithm:DH", "target": "math:discrete-log", "label": "依赖"},
        {"source": "algorithm:ECDH", "target": "math:elliptic-curve-dlog", "label": "依赖"},
        {"source": "algorithm:ECDSA", "target": "math:elliptic-curve-dlog", "label": "依赖"},
        {"source": "algorithm:ECC", "target": "math:elliptic-curve-dlog", "label": "依赖"},
        {"source": "algorithm:X25519", "target": "math:elliptic-curve-dlog", "label": "依赖"},
        {"source": "algorithm:Ed25519", "target": "math:elliptic-curve-dlog", "label": "依赖"},
        {"source": "math:integer-factorization", "target": "risk:shor", "label": "受影响"},
        {"source": "math:discrete-log", "target": "risk:shor", "label": "受影响"},
        {"source": "math:elliptic-curve-dlog", "target": "risk:shor", "label": "受影响"},
        {"source": "algorithm:RSA", "target": "pqc:ML-KEM", "label": "密钥建立迁移"},
        {"source": "algorithm:RSA", "target": "pqc:ML-DSA", "label": "签名迁移"},
        {"source": "algorithm:DH", "target": "pqc:ML-KEM", "label": "密钥交换迁移"},
        {"source": "algorithm:ECDH", "target": "pqc:ML-KEM", "label": "密钥交换迁移"},
        {"source": "algorithm:X25519", "target": "pqc:ML-KEM", "label": "密钥交换迁移"},
        {"source": "algorithm:DSA", "target": "pqc:ML-DSA", "label": "签名迁移"},
        {"source": "algorithm:ECDSA", "target": "pqc:ML-DSA", "label": "签名迁移"},
        {"source": "algorithm:Ed25519", "target": "pqc:ML-DSA", "label": "签名迁移"},
        {"source": "algorithm:Ed25519", "target": "pqc:SLH-DSA", "label": "长期归档可评估"},
        {"source": "api:cryptography", "target": "algorithm:RSA", "label": "可识别"},
        {"source": "api:cryptography", "target": "algorithm:ECDSA", "label": "可识别"},
        {"source": "api:pycryptodome", "target": "algorithm:RSA", "label": "可识别"},
        {"source": "protocol:jwt-ssh", "target": "algorithm:RSA", "label": "可识别"},
        {"source": "protocol:jwt-ssh", "target": "algorithm:ECDSA", "label": "可识别"},
    ]
    return {"nodes": nodes, "edges": edges}


class PopularScanRequest(BaseModel):
    top: int = Field(default=20, ge=1, le=100)


@app.post("/api/popular/scan")
def trigger_popular_scan(payload: PopularScanRequest = PopularScanRequest()) -> Response:
    """触发热门仓库批量扫描，完成后写入 popular.json 并返回结果。"""
    import os
    import tempfile

    from backend.popular import FetchError, fetch_popular_repos, run_batch_scan

    try:
        repos = fetch_popular_repos(top=payload.top)
    except FetchError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc

    batch_result = run_batch_scan(repos)

    output_path = WEB_DIR / "data" / "popular.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    data = {
        "scanned_at": batch_result.scanned_at,
        "repos": batch_result.repos,
        "meta": batch_result.meta,
    }
    json_content = json.dumps(data, indent=2, ensure_ascii=False)

    try:
        tmp_fd, tmp_path = tempfile.mkstemp(
            dir=str(output_path.parent), suffix=".tmp", prefix=".popular_"
        )
        with os.fdopen(tmp_fd, "w", encoding="utf-8") as f:
            f.write(json_content)
        os.replace(tmp_path, str(output_path))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"写入结果文件失败：{exc}") from exc

    return Response(content=json_content, media_type="application/json; charset=utf-8")


@app.get("/api/popular/results")
def get_popular_results() -> Response:
    """读取 web/data/popular.json 并返回其内容。"""
    popular_file = WEB_DIR / "data" / "popular.json"
    if not popular_file.exists():
        raise HTTPException(
            status_code=404,
            detail="热门仓库扫描数据尚未生成，请先运行批量扫描脚本",
        )
    try:
        file_content = popular_file.read_text(encoding="utf-8")
    except OSError as exc:
        raise HTTPException(
            status_code=500,
            detail="读取热门仓库数据文件失败",
        ) from exc
    try:
        json.loads(file_content)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=502,
            detail="热门仓库数据文件损坏，请重新运行批量扫描脚本",
        ) from exc
    return Response(content=file_content, media_type="application/json; charset=utf-8")


@app.post("/api/report/markdown")
def export_markdown_report(payload: ReportRequest) -> Response:
    sources = [model_to_dict(source) for source in payload.sources]
    findings = [model_to_dict(finding) for finding in payload.findings]
    report = build_markdown_report(
        sources=sources,
        findings=findings,
        source_type=payload.source_type,
        scanned_at=payload.scanned_at,
    )
    return Response(
        content=report,
        media_type="text/markdown; charset=utf-8",
        headers={"Content-Disposition": 'attachment; filename="quantum-scan-report.md"'},
    )
