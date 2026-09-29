from __future__ import annotations

from email import policy
from email.parser import BytesParser
from pathlib import PurePath
from fastapi import HTTPException
from backend.collectors import is_supported_source_path
from backend.models import MAX_SOURCE_BYTES

MAX_TOTAL_UPLOAD_BYTES = 10 * 1024 * 1024
MAX_UPLOAD_FILES = 80

def normalize_filename(filename: str, fallback: str = "snippet.py") -> str:
    cleaned = filename.replace("\\", "/").split("/")[-1].strip()
    cleaned = PurePath(cleaned).name
    return cleaned or fallback


def parse_multipart_files(content_type: str, body: bytes) -> list[tuple[str, str]]:
    if "multipart/form-data" not in content_type:
        raise HTTPException(status_code=415, detail="请使用 multipart/form-data 上传文件")
    if len(body) > MAX_TOTAL_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="上传请求超过 10 MiB 限制")

    raw_message = (
        f"Content-Type: {content_type}\r\nMIME-Version: 1.0\r\n\r\n".encode("utf-8") + body
    )
    message = BytesParser(policy=policy.default).parsebytes(raw_message)
    if not message.is_multipart():
        raise HTTPException(status_code=400, detail="上传数据格式不正确")

    documents: list[tuple[str, str]] = []
    for part in message.iter_parts():
        filename = part.get_filename()
        if not filename:
            continue
        if part.get_param("name", header="content-disposition") != "files":
            raise HTTPException(400, "上传文件字段必须为 files")
        if len(documents) >= MAX_UPLOAD_FILES:
            raise HTTPException(413, "单次最多上传 80 个文件")
        normalized_filename = normalize_filename(filename, "uploaded.py")
        if not is_supported_source_path(normalized_filename):
            raise HTTPException(
                status_code=400,
                detail=f"{normalized_filename} 不是受支持的文本文件",
            )

        payload = part.get_payload(decode=True) or b""
        if len(payload) > MAX_SOURCE_BYTES:
            raise HTTPException(status_code=413, detail=f"{filename} 超过 2 MiB 限制")

        try:
            content = payload.decode("utf-8-sig")
        except UnicodeDecodeError as exc:
            raise HTTPException(
                status_code=400,
                detail=f"{filename} 不是有效 UTF-8 文本",
            ) from exc

        documents.append((normalized_filename, content))

    if not documents:
        raise HTTPException(status_code=400, detail="未上传文件")
    return documents
