"""Incremental multipart parser shared by streamed and legacy uploads."""
from __future__ import annotations

from email import policy
from email.message import Message
from email.parser import BytesParser
from fastapi import HTTPException
from backend.collection_config import MAX_COLLECTED_FILES, MAX_COLLECTED_FILE_BYTES
from backend.collectors import is_supported_source_path


class MultipartParser:
    def __init__(self, content_type: str, *, max_file_bytes=MAX_COLLECTED_FILE_BYTES, max_files=MAX_COLLECTED_FILES):
        header = Message()
        header['Content-Type'] = content_type
        boundary = header.get_param('boundary')
        if header.get_content_type() != 'multipart/form-data' or not boundary or len(boundary) > 200:
            raise HTTPException(415, '请使用有效的 multipart/form-data 上传文件')
        if any(ord(char) < 32 or ord(char) > 126 for char in boundary) or boundary.endswith(' '):
            raise HTTPException(400, '上传边界格式不正确')
        self.delimiter = b'\r\n--' + boundary.encode('ascii')
        self.initial = b'--' + boundary.encode('ascii') + b'\r\n'
        self.buffer, self.body = bytearray(), bytearray()
        self.state, self.name = 'initial', ''
        self.count = 0
        self.max_file_bytes, self.max_files = max_file_bytes, max_files

    def append_body(self, size: int) -> None:
        if len(self.body) + size > self.max_file_bytes:
            raise HTTPException(413, f'{self.name} 超过 2 MiB 限制')
        self.body.extend(self.buffer[:size])
        del self.buffer[:size]

    def complete(self):
        self.count += 1
        result = self.name, bytes(self.body)
        self.body.clear()
        return result

    def feed(self, chunk: bytes):
        if self.state == 'done':
            return
        self.buffer.extend(chunk)
        while True:
            if self.state == 'initial':
                if len(self.buffer) < len(self.initial):
                    return
                if not self.buffer.startswith(self.initial):
                    raise HTTPException(400, '上传数据格式不正确')
                del self.buffer[:len(self.initial)]
                self.state = 'headers'
            elif self.state == 'headers':
                end = self.buffer.find(b'\r\n\r\n')
                if end > 16384 or (end < 0 and len(self.buffer) > 16384):
                    raise HTTPException(400, '上传文件头过长')
                if end < 0:
                    return
                headers = BytesParser(policy=policy.default).parsebytes(bytes(self.buffer[:end]) + b'\r\n\r\n')
                if len(headers.get_all('content-disposition', [])) != 1 or len(headers.get_all('content-type', [])) > 1 or headers.defects:
                    raise HTTPException(400, '上传文件头格式不正确或存在重复头')
                filename = headers.get_filename()
                if not filename or headers.get_param('name', header='content-disposition') != 'files':
                    raise HTTPException(400, '上传文件字段必须为 files')
                from backend.uploads import normalize_filename
                self.name = normalize_filename(filename, 'uploaded.py')
                if not is_supported_source_path(self.name):
                    raise HTTPException(400, f'{self.name} 不是受支持的文本文件')
                if self.count >= self.max_files:
                    raise HTTPException(413, '单次最多上传 5000 个文件')
                del self.buffer[:end + 4]
                self.state = 'body'
            elif self.state == 'body':
                end = self.buffer.find(self.delimiter)
                if end < 0:
                    self.append_body(max(0, len(self.buffer) - len(self.delimiter) - 2))
                    return
                if len(self.buffer) < end + len(self.delimiter) + 2:
                    self.append_body(end)
                    return
                tail = bytes(self.buffer[end + len(self.delimiter):end + len(self.delimiter) + 2])
                if tail not in (b'--', b'\r\n'):
                    self.append_body(end + 1)
                    continue
                self.append_body(end)
                del self.buffer[:len(self.delimiter) + 2]
                self.state = 'closing' if tail == b'--' else 'headers'
                if self.state == 'headers':
                    yield self.complete()
            elif self.state == 'closing':
                if len(self.buffer) < 2:
                    return
                if not self.buffer.startswith(b'\r\n'):
                    raise HTTPException(400, '上传结束边界格式不正确')
                self.buffer.clear()
                self.state = 'done'
                yield self.complete()
                return
            else:
                return

    def finish(self):
        if self.state == 'closing' and not self.buffer:
            self.state = 'done'
            yield self.complete()
        if self.state != 'done' or not self.count:
            raise HTTPException(400, '上传数据不完整或未上传文件')


def decode_file(name: str, body: bytes, remaining: int) -> tuple[str, bytes]:
    try:
        content = body.decode('utf-8-sig')
    except UnicodeError as exc:
        raise HTTPException(400, f'{name} 不是有效 UTF-8 文本') from exc
    data = content.encode('utf-8')
    if len(data) > remaining:
        raise HTTPException(413, '源码文本超过 100 MiB 限制')
    return content, data
