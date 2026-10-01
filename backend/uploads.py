from __future__ import annotations

from pathlib import PurePath
from fastapi import HTTPException
from backend.collection_config import MAX_COLLECTED_FILES, MAX_COLLECTED_FILE_BYTES, MAX_TEXT_BYTES, MAX_UPLOAD_BYTES

MAX_UPLOAD_FILES = MAX_COLLECTED_FILES
MAX_SOURCE_BYTES = MAX_COLLECTED_FILE_BYTES
MAX_TOTAL_UPLOAD_BYTES = MAX_UPLOAD_BYTES


def normalize_filename(filename: str, fallback: str = 'snippet.py') -> str:
    cleaned = filename.replace(chr(92), '/').split('/')[-1].strip()
    return PurePath(cleaned).name or fallback


def parse_multipart_files(content_type: str, body: bytes) -> list[tuple[str, str]]:
    """Compatibility adapter; validation is shared with the streamed endpoint."""
    from backend.multipart import MultipartParser, decode_file
    if len(body) > MAX_TOTAL_UPLOAD_BYTES:
        raise HTTPException(413, '上传请求超过 110 MiB 限制')
    parser = MultipartParser(content_type, max_file_bytes=MAX_SOURCE_BYTES, max_files=MAX_UPLOAD_FILES)
    documents, text_bytes = [], 0
    for events in (parser.feed(body), parser.finish()):
        for name, data in events:
            content, encoded = decode_file(name, data, MAX_TEXT_BYTES - text_bytes)
            documents.append((name, content))
            text_bytes += len(encoded)
    return documents
