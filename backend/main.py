from __future__ import annotations

import json
from dataclasses import asdict
from pathlib import Path
from threading import Lock

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.concurrency import run_in_threadpool

from backend.collectors import CollectionError, CollectionTimeout, collect_github_sources, collect_pypi_sources, is_supported_source_path
from backend.knowledge import knowledge_graph
from backend.models import *
from backend.popular import scan_popular
from backend.reporting import build_markdown_report
from backend.report_exports import build_csv_report, build_json_report
from backend.scanning import build_scan_response
from backend.storage import write_results
from backend.uploads import MAX_TOTAL_UPLOAD_BYTES, normalize_filename, parse_multipart_files

PROJECT_ROOT = Path(__file__).resolve().parents[1]
WEB_DIR = PROJECT_ROOT / "web"
SAMPLE_INPUTS_DIR = PROJECT_ROOT / "sample_inputs"
POPULAR_SCAN_LOCK = Lock()
app = FastAPI(title="Quantum Crypto Migration Scanner", version="0.2.0")
app.mount("/static", StaticFiles(directory=WEB_DIR), name="static")


@app.exception_handler(RequestValidationError)
async def validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
    fields = sorted({str(e["loc"][-1]) for e in exc.errors() if e.get("loc")})
    return JSONResponse(status_code=422, content={"detail": "输入格式不正确，请检查：" + "、".join(fields)})


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/", include_in_schema=False)
def index() -> FileResponse:
    return FileResponse(WEB_DIR / "index.html", headers={"Cache-Control": "no-store"})


@app.get("/api/samples", response_model=list[SampleSourceRecord])
def list_sample_sources() -> list[SampleSourceRecord]:
    samples = []
    for path in sorted(SAMPLE_INPUTS_DIR.glob("*.py")):
        try:
            if path.stat().st_size > MAX_SOURCE_BYTES:
                continue
            content = path.read_text(encoding="utf-8-sig")
        except (UnicodeError, OSError):
            continue
        samples.append(SampleSourceRecord(file_name=path.name, content=content, line_count=len(content.splitlines()), char_count=len(content)))
    return samples


@app.post("/api/scan/snippet", response_model=ScanResponse)
def scan_snippet(payload: SnippetScanRequest) -> ScanResponse:
    if not payload.content.strip():
        raise HTTPException(400, "请先输入待扫描内容")
    return build_scan_response([(normalize_filename(payload.filename), payload.content)], "snippet")


@app.post("/api/scan/files", response_model=ScanResponse)
async def scan_files(request: Request) -> ScanResponse:
    body = bytearray()
    async for chunk in request.stream():
        if len(body) + len(chunk) > MAX_TOTAL_UPLOAD_BYTES:
            raise HTTPException(413, "上传请求超过 10 MiB 限制")
        body.extend(chunk)
    def scan():
        documents = parse_multipart_files(request.headers.get("content-type", ""), bytes(body))
        return build_scan_response(documents, "manual_upload")
    return await run_in_threadpool(scan)


def remote_scan(collector, value: str, source_type: SourceType) -> ScanResponse:
    try:
        documents = collector(value)
    except CollectionTimeout as exc:
        raise HTTPException(504, str(exc)) from exc
    except CollectionError as exc:
        raise HTTPException(502, str(exc)) from exc
    if not documents:
        raise HTTPException(404, "未找到可扫描的文本文件")
    return build_scan_response(documents, source_type)


@app.post("/api/scan/github", response_model=ScanResponse)
def scan_github(payload: GitHubScanRequest) -> ScanResponse:
    return remote_scan(collect_github_sources, payload.repository_url, "github_repository")


@app.post("/api/scan/pypi", response_model=ScanResponse)
def scan_pypi(payload: PyPIScanRequest) -> ScanResponse:
    return remote_scan(collect_pypi_sources, payload.package_name, "pypi_package")


app.get("/api/knowledge/graph")(knowledge_graph)


@app.post("/api/popular/scan")
def trigger_popular_scan(payload: PopularScanRequest = PopularScanRequest()) -> dict:
    if not POPULAR_SCAN_LOCK.acquire(blocking=False):
        raise HTTPException(409, "热门仓库正在扫描，请等待本次扫描完成")
    try:
        result = scan_popular(top=payload.top)
        write_results(result, WEB_DIR / "data/popular.json")
        return asdict(result)
    except CollectionTimeout as exc:
        raise HTTPException(504, str(exc)) from exc
    except CollectionError as exc:
        raise HTTPException(502, str(exc)) from exc
    except OSError as exc:
        raise HTTPException(500, "无法保存扫描结果，请检查数据目录权限；上次结果已保留") from exc
    finally:
        POPULAR_SCAN_LOCK.release()


@app.get("/api/popular/results")
def get_popular_results() -> Response:
    path = WEB_DIR / "data/popular.json"
    if not path.exists():
        raise HTTPException(404, "热门仓库扫描数据尚未生成，请先运行批量扫描脚本或点击开始扫描")
    try:
        content = path.read_text(encoding="utf-8")
    except OSError as exc:
        raise HTTPException(500, "读取热门仓库数据文件失败") from exc
    except UnicodeError as exc:
        raise HTTPException(502, "热门仓库数据文件损坏，请重新运行批量扫描脚本") from exc
    try:
        data = json.loads(content)
        if not isinstance(data, dict) or not isinstance(data.get("repos"), list):
            raise ValueError("invalid shape")
    except (ValueError, UnicodeError) as exc:
        raise HTTPException(502, "热门仓库数据文件损坏，请重新运行批量扫描脚本") from exc
    return Response(content, media_type="application/json", headers={"Cache-Control": "no-store"})


@app.post("/api/report/markdown")
def export_markdown_report(payload: ReportRequest) -> Response:
    report = build_markdown_report(
        sources=[s.model_dump() for s in payload.sources],
        findings=[f.model_dump() for f in payload.findings],
        source_type=payload.source_type, scanned_at=payload.scanned_at,
        coverage=payload.coverage.model_dump() if payload.coverage else None,
        diagnostics=[d.model_dump() for d in payload.diagnostics],
    )
    return Response(report, media_type="text/markdown", headers={"Content-Disposition": 'attachment; filename="quantum-scan-report.md"'})


@app.post("/api/report/json")
def export_json_report(payload: ReportRequest) -> Response:
    report = build_json_report(**payload.model_dump())
    return Response(json.dumps(report, ensure_ascii=False, indent=2), media_type="application/json",
                    headers={"Content-Disposition": 'attachment; filename="quantum-scan-report.json"'})


@app.post("/api/report/csv")
def export_csv_report(payload: ReportRequest) -> Response:
    report = build_csv_report([finding.model_dump() for finding in payload.findings])
    return Response(report, media_type="text/csv",
                    headers={"Content-Disposition": 'attachment; filename="quantum-scan-findings.csv"'})
