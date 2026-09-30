"""Bounded multipart ingestion without retaining the whole request body."""
from __future__ import annotations

import hashlib
from email import policy
from email.parser import BytesParser
from email.message import Message

from fastapi import HTTPException
from starlette.concurrency import run_in_threadpool
from backend.collection_config import MAX_COLLECTED_FILES, MAX_COLLECTED_FILE_BYTES, MAX_TEXT_BYTES, MAX_UPLOAD_BYTES
from backend.collectors import is_supported_source_path
from backend.temp_storage import StoredDocument
from backend.uploads import normalize_filename
from scan_quantum_vuln import make_source_id


def persist_file(storage, folder, name, body, index, remaining):
    try:
        content = body.decode('utf-8-sig')
    except UnicodeError as exc:
        raise HTTPException(400, f'{name} 不是有效 UTF-8 文本') from exc
    data = content.encode('utf-8')
    if len(data) > remaining:
        raise HTTPException(413, '源码文本超过 100 MiB 限制')
    path = storage.write_source(folder, data)
    identity = make_source_id(f'{index}:{name}', content)
    return StoredDocument(None, name, path, identity), [name, hashlib.sha256(data).hexdigest()], len(data)


async def read_upload(request, storage, folder):
    header = Message()
    header['Content-Type'] = request.headers.get('content-type', '')
    boundary = header.get_param('boundary')
    if header.get_content_type() != 'multipart/form-data' or not boundary or len(boundary) > 200:
        raise HTTPException(415, '请使用有效的 multipart/form-data 上传文件')
    try:
        delimiter = b'\r\n--' + boundary.encode('ascii')
    except UnicodeError as exc:
        raise HTTPException(400, '上传边界格式不正确') from exc
    initial = b'--' + boundary.encode('ascii') + b'\r\n'
    buffer = bytearray()
    documents, manifest = [], []
    state, name = 'initial', ''
    body = bytearray()
    received = text_bytes = 0
    async for chunk in request.stream():
        received += len(chunk)
        if received > MAX_UPLOAD_BYTES:
            raise HTTPException(413, '上传请求超过 110 MiB 限制')
        buffer.extend(chunk)
        while True:
            if state == 'initial':
                if len(buffer) < len(initial):
                    break
                if not buffer.startswith(initial):
                    raise HTTPException(400, '上传数据格式不正确')
                del buffer[:len(initial)]
                state = 'headers'
            elif state == 'headers':
                end = buffer.find(b'\r\n\r\n')
                if end > 16384:
                    raise HTTPException(400, '上传文件头过长')
                if end < 0:
                    if len(buffer) > 16384:
                        raise HTTPException(400, '上传文件头过长')
                    break
                headers = BytesParser(policy=policy.default).parsebytes(bytes(buffer[:end]) + b'\r\n\r\n')
                filename = headers.get_filename()
                if not filename or headers.get_param('name', header='content-disposition') != 'files':
                    raise HTTPException(400, '上传文件字段必须为 files')
                name = normalize_filename(filename, 'uploaded.py')
                if not is_supported_source_path(name):
                    raise HTTPException(400, f'{name} 不是受支持的文本文件')
                if len(documents) >= MAX_COLLECTED_FILES:
                    raise HTTPException(413, '单次最多上传 5000 个文件')
                del buffer[:end + 4]
                body.clear()
                state = 'body'
            elif state == 'body':
                end = buffer.find(delimiter)
                # Keep a boundary-sized tail across stream chunk boundaries.
                take = end if end >= 0 else max(0, len(buffer) - len(delimiter) - 2)
                if len(body) + take > MAX_COLLECTED_FILE_BYTES:
                    raise HTTPException(413, f'{name} 超过 2 MiB 限制')
                body.extend(buffer[:take])
                del buffer[:take]
                if end < 0 or len(buffer) < len(delimiter) + 2:
                    break
                tail = bytes(buffer[len(delimiter):len(delimiter) + 2])
                if tail not in (b'--', b'\r\n'):
                    raise HTTPException(400, '上传边界格式不正确')
                document, fingerprint, size = await run_in_threadpool(
                    persist_file, storage, folder, name, bytes(body), len(documents), MAX_TEXT_BYTES-text_bytes,
                )
                text_bytes += size
                documents.append(document)
                manifest.append(fingerprint)
                del buffer[:len(delimiter) + 2]
                state = 'done' if tail == b'--' else 'headers'
            else:
                buffer.clear()
                break
    if state != 'done' or not documents:
        raise HTTPException(400, '上传数据不完整或未上传文件')
    return documents, {'files': manifest, 'file_count': len(documents)}
