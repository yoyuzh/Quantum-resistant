from __future__ import annotations

import json
from pathlib import Path
from threading import Lock

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from backend.collectors import collect_github_sources, collect_pypi_sources
from backend.knowledge import knowledge_graph
from backend.models import MAX_SOURCE_BYTES, SampleSourceRecord
from backend.popular import scan_popular
from backend.task_routes import router as task_router
from backend import task_routes
from backend.task_store import TaskStore
from contextlib import asynccontextmanager
from backend.scan_routes import router as scan_router
from backend.request_boundary import RequestBoundary
from backend.report_routes import router as report_router
from backend.storage import write_results
from backend.uploads import MAX_TOTAL_UPLOAD_BYTES
from backend.collection_config import (MAX_COLLECTED_FILES, MAX_TEXT_BYTES, MAX_ARCHIVE_BYTES,
                                       SCAN_TIMEOUT_SECONDS, POPULAR_TIMEOUT_SECONDS,
                                       MAX_ARCHIVE_MEMBERS, MAX_ARCHIVE_METADATA_BYTES, MAX_ARCHIVE_EXPANDED_BYTES)
from backend.upload_stream import UPLOAD_TIMEOUT_SECONDS, UPLOAD_IDLE_SECONDS

PROJECT_ROOT = Path(__file__).resolve().parents[1]
WEB_DIR = PROJECT_ROOT / "web"
SAMPLE_INPUTS_DIR = PROJECT_ROOT / "sample_inputs"
POPULAR_SCAN_LOCK = Lock()
@asynccontextmanager
async def lifespan(app):
    if task_routes.store.closed:
        task_routes.store = TaskStore()
    yield
    task_routes.store.close()


app = FastAPI(title="Quantum Crypto Migration Scanner", version="0.3.0", lifespan=lifespan)
app.add_middleware(RequestBoundary)
app.include_router(task_router)
app.include_router(report_router)
app.include_router(scan_router)
app.mount("/static/assets", StaticFiles(directory=WEB_DIR / "assets"), name="assets")


@app.exception_handler(RequestValidationError)
async def validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
    fields = sorted({str(e["loc"][-1]) for e in exc.errors() if e.get("loc")})
    return JSONResponse(status_code=422, content={"detail": "输入格式不正确，请检查：" + "、".join(fields)})


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get('/api/config')
def scan_config() -> dict:
    return {'max_files': MAX_COLLECTED_FILES, 'max_file_bytes': MAX_SOURCE_BYTES,
            'max_text_bytes': MAX_TEXT_BYTES, 'max_upload_bytes': MAX_TOTAL_UPLOAD_BYTES,
            'max_archive_bytes': MAX_ARCHIVE_BYTES, 'scan_timeout_seconds': SCAN_TIMEOUT_SECONDS,
            'popular_timeout_seconds': POPULAR_TIMEOUT_SECONDS, 'minimum_loading_ms': 1500,
            'upload_timeout_seconds': UPLOAD_TIMEOUT_SECONDS, 'upload_idle_seconds': UPLOAD_IDLE_SECONDS,
            'max_archive_members': MAX_ARCHIVE_MEMBERS, 'max_archive_metadata_bytes': MAX_ARCHIVE_METADATA_BYTES,
            'max_archive_expanded_bytes': MAX_ARCHIVE_EXPANDED_BYTES}


@app.get("/static/", include_in_schema=False)
@app.get("/static/index.html", include_in_schema=False)
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


app.get("/api/knowledge/graph")(knowledge_graph)


@app.get("/static/data/popular.json", include_in_schema=False)
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
