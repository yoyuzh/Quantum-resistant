"""Bounded multipart ingestion, deadlines and disk persistence."""
from __future__ import annotations

import asyncio
import hashlib
from fastapi import HTTPException
from starlette.concurrency import run_in_threadpool
from backend.collection_config import MAX_COLLECTED_FILES, MAX_COLLECTED_FILE_BYTES, MAX_TEXT_BYTES, MAX_UPLOAD_BYTES
from backend.multipart import MultipartParser, decode_file
from backend.temp_storage import StoredDocument
from scan_quantum_vuln import make_source_id

UPLOAD_TIMEOUT_SECONDS = 600
UPLOAD_IDLE_SECONDS = 30


def persist_file(storage, folder, name, body, index, remaining):
    content, data = decode_file(name, body, remaining)
    path = storage.write_source(folder, data)
    identity = make_source_id(f'{index}:{name}', content)
    return StoredDocument(None, name, path, identity), [name, hashlib.sha256(data).hexdigest()], len(data)


async def read_upload(request, storage, folder):
    parser = MultipartParser(request.headers.get('content-type', ''),
                             max_file_bytes=MAX_COLLECTED_FILE_BYTES, max_files=MAX_COLLECTED_FILES)
    documents, manifest = [], []
    received = text_bytes = 0
    iterator = request.stream().__aiter__()
    end = asyncio.get_running_loop().time() + UPLOAD_TIMEOUT_SECONDS
    while True:
        remaining = end - asyncio.get_running_loop().time()
        try:
            chunk = await asyncio.wait_for(iterator.__anext__(), max(0, min(UPLOAD_IDLE_SECONDS, remaining)))
        except StopAsyncIteration:
            events = parser.finish()
            finished = True
        except asyncio.TimeoutError as exc:
            raise HTTPException(408, '上传读取超时，请重新上传文件') from exc
        else:
            received += len(chunk)
            if received > MAX_UPLOAD_BYTES:
                raise HTTPException(413, '上传请求超过 110 MiB 限制')
            events = parser.feed(chunk)
            finished = False
        for name, body in events:
            if asyncio.get_running_loop().time() >= end:
                raise HTTPException(408, '上传读取超时，请重新上传文件')
            document, fingerprint, size = await run_in_threadpool(
                persist_file, storage, folder, name, body, len(documents), MAX_TEXT_BYTES - text_bytes,
            )
            text_bytes += size
            documents.append(document)
            manifest.append(fingerprint)
        if finished:
            return documents, {'files': manifest, 'file_count': len(documents)}
