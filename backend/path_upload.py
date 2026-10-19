"""Explicit path manifest protocol over the existing bounded multipart parser."""
from __future__ import annotations

import asyncio
import json
from typing import Annotated, Literal

from fastapi import HTTPException
from pydantic import Field, ValidationError
from starlette.concurrency import run_in_threadpool

from backend.collection_config import MAX_COLLECTED_FILES, MAX_TEXT_BYTES, MAX_UPLOAD_BYTES
from backend.multipart import MultipartParser
from backend.upload_stream import persist_file, UPLOAD_IDLE_SECONDS, UPLOAD_TIMEOUT_SECONDS
from deep_analysis.models import Contract, Digest
from deep_analysis.paths import validate_paths


class PathEntry(Contract):
    index: Annotated[int, Field(strict=True, ge=0, lt=5000)]
    relative_path: Annotated[str, Field(min_length=1, max_length=512)]
    sha256: Digest


class PathManifest(Contract):
    schema_version: Literal['upload-paths-1']
    entries: Annotated[tuple[PathEntry, ...], Field(min_length=1, max_length=5000)]


def unique_object(pairs: list[tuple[str, object]]) -> dict:
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError('manifest含重复JSON字段')
        result[key] = value
    return result


def bind_manifest(raw: bytes, documents: list, fingerprints: list, mode: str) -> dict:
    try:
        value = json.loads(raw.decode('utf-8'), object_pairs_hook=unique_object)
        if isinstance(value, dict) and isinstance(value.get('entries'), list) and len(value['entries']) > 5000:
            raise HTTPException(413, 'manifest最多5000项')
        manifest = PathManifest.model_validate(value)
        entries = sorted(manifest.entries, key=lambda e: e.index)
        if [e.index for e in entries] != list(range(len(documents))):
            raise ValueError('manifest必须逐文件恰好覆盖一次')
        paths = validate_paths([e.relative_path for e in entries])
    except (ValueError, UnicodeError, ValidationError, RecursionError) as exc:
        raise HTTPException(422, 'manifest结构或路径不合法') from exc
    for entry, path, doc, fingerprint in zip(entries, paths, documents, fingerprints):
        if entry.sha256 != fingerprint[1]:
            raise HTTPException(409, 'manifest内容摘要与解码后的文件不一致')
        doc.relative_path = path
        doc.name = path
    return {'schema_version': 'upload-paths-1', 'analysis_mode': mode,
            'files': fingerprints, 'file_count': len(documents), 'entries': [{**e.model_dump(), 'relative_path': p} for e, p in zip(entries, paths)]}


async def read_path_upload(request, storage, folder):
    """Caller owns whole-folder cleanup on any failure, including cancellation."""
    parser = MultipartParser(request.headers.get('content-type', ''), path_fields=True, max_files=MAX_COLLECTED_FILES)
    documents, fingerprints, fields = [], [], {}
    received = text_bytes = 0
    iterator = request.stream().__aiter__()
    loop = asyncio.get_running_loop()
    end = loop.time() + UPLOAD_TIMEOUT_SECONDS
    while True:
        try:
            chunk = await asyncio.wait_for(iterator.__anext__(), max(0, min(UPLOAD_IDLE_SECONDS, end - loop.time())))
        except StopAsyncIteration:
            events, finished = parser.finish(), True
        except asyncio.TimeoutError as exc:
            raise HTTPException(408, '上传读取超时，请重新上传文件') from exc
        else:
            received += len(chunk)
            if received > MAX_UPLOAD_BYTES:
                raise HTTPException(413, '上传请求超过 110 MiB 限制')
            events, finished = parser.feed(chunk), False
        for field, name, body in events:
            if loop.time() >= end:
                raise HTTPException(408, '上传读取超时，请重新上传文件')
            if field == 'files':
                doc, fingerprint, size = await run_in_threadpool(persist_file, storage, folder, name, body, len(documents), MAX_TEXT_BYTES - text_bytes)
                documents.append(doc)
                fingerprints.append(fingerprint)
                text_bytes += size
            else:
                if field in fields:
                    raise HTTPException(422, 'manifest及analysis_mode只能各出现一次')
                fields[field] = body
        if finished:
            if not documents or 'manifest' not in fields:
                raise HTTPException(422, '缺少files或manifest')
            try:
                mode = fields.get('analysis_mode', b'basic').decode('ascii')
            except UnicodeError as exc:
                raise HTTPException(422, 'analysis_mode必须为basic或deep') from exc
            if mode not in ('basic', 'deep'):
                raise HTTPException(422, 'analysis_mode必须为basic或deep')
            fingerprint = await run_in_threadpool(bind_manifest, fields['manifest'], documents, fingerprints, mode)
            return documents, fingerprint
