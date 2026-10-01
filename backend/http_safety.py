"""Validated redirects and output-bounded HTTP decompression."""
from __future__ import annotations

import zlib
from urllib.parse import urljoin, urlsplit
from contextlib import contextmanager
import httpx

ALLOWED_REMOTE_HOSTS = {'api.github.com', 'github.com', 'codeload.github.com', 'pypi.org', 'files.pythonhosted.org'}
CHUNK_BYTES = 65536


def validate_remote_url(value: str) -> httpx.URL:
    from backend.collection_common import CollectionError
    try:
        parsed = urlsplit(str(value))
        if (parsed.scheme != 'https' or parsed.hostname not in ALLOWED_REMOTE_HOSTS
                or parsed.port not in (None, 443) or parsed.username is not None or parsed.password is not None
                or '\\' in str(value) or any(ord(c) < 32 for c in str(value))):
            raise ValueError('invalid target')
        return httpx.URL(value)
    except (ValueError, httpx.InvalidURL) as exc:
        raise CollectionError('远程下载地址不受信任，已停止请求') from exc


@contextmanager
def request_stream(client, target, *, headers, params, timeout, strip_credentials):
    request = client.build_request('GET', target, headers=headers, params=params, timeout=timeout)
    if strip_credentials:
        # Remove credentials after client defaults and cookies have been merged.
        for key in ('authorization', 'proxy-authorization', 'cookie'):
            request.headers.pop(key, None)
    options = {'auth': None} if strip_credentials else {}
    response = client.send(request, stream=True, follow_redirects=False, **options)
    try:
        yield response
    finally:
        response.close()


@contextmanager
def safe_stream(client, url, budget, socket_timeout, *, headers=None, params=None):
    from backend.collection_common import CollectionError, http_slot
    target = validate_remote_url(url)
    outgoing = httpx.Headers(headers or {})
    outgoing['Accept-Encoding'] = 'gzip, deflate, identity'
    strip_credentials = False
    for hop in range(6):
        budget.remaining()
        with http_slot(budget):
            timeout = min(socket_timeout, budget.remaining())
            with request_stream(client, target, headers=outgoing, params=params, strip_credentials=strip_credentials,
                                timeout=httpx.Timeout(timeout, connect=min(4, timeout), pool=min(2, timeout))) as response:
                if response.status_code not in {301, 302, 303, 307, 308}:
                    yield response
                    return
                if hop == 5 or 'location' not in response.headers:
                    raise CollectionError('远程重定向次数过多或地址缺失')
                next_target = validate_remote_url(urljoin(str(response.request.url), response.headers['location']))
                if (target.scheme, target.host, target.port) != (next_target.scheme, next_target.host, next_target.port):
                    strip_credentials = True
                    for key in ('authorization', 'proxy-authorization', 'cookie'):
                        outgoing.pop(key, None)
                target, params = next_target, None


def decoded_chunks(response, budget, max_bytes):
    """Decode each compressed input with max_length, before allocating its expansion."""
    from backend.collection_common import CollectionError
    encoding = response.headers.get('content-encoding', 'identity').strip().lower()
    if encoding not in {'identity', '', 'gzip', 'deflate'}:
        raise CollectionError('远程响应使用不支持的压缩编码')
    # Preloaded MockTransport responses have already passed HTTPX's decoder.
    if response.is_stream_consumed:
        chunks = response.iter_bytes(chunk_size=CHUNK_BYTES)
        encoding = 'identity'
    else:
        chunks = response.iter_raw(chunk_size=CHUNK_BYTES)
    wire = output = 0
    decoder = None
    prefix = b''
    for raw in chunks:
        budget.remaining()
        wire += len(raw)
        if max_bytes is not None and wire > max_bytes:
            raise CollectionError('远程响应超过大小限制')
        if encoding in {'identity', ''}:
            output += len(raw)
            if max_bytes is not None and output > max_bytes:
                raise CollectionError('远程响应超过大小限制')
            yield raw
            continue
        if decoder is None:
            prefix += raw
            if len(prefix) < 2:
                continue
            wrapped = prefix[0] & 15 == 8 and int.from_bytes(prefix[:2], 'big') % 31 == 0
            decoder = zlib.decompressobj(31 if encoding == 'gzip' else 15 if wrapped else -15)
            raw, prefix = prefix, b''
        while raw:
            budget.remaining()
            if decoder.eof:
                if encoding != 'gzip':
                    raise httpx.DecodingError('远程响应解压失败：多余压缩数据')
                decoder = zlib.decompressobj(31)
            try:
                allowance = CHUNK_BYTES if max_bytes is None else min(CHUNK_BYTES, max_bytes - output + 1)
                data = decoder.decompress(raw, allowance)
            except zlib.error as exc:
                raise httpx.DecodingError('远程响应解压失败') from exc
            output += len(data)
            if max_bytes is not None and output > max_bytes:
                raise CollectionError('远程响应超过大小限制')
            if data:
                yield data
            raw = decoder.unused_data if decoder.eof else decoder.unconsumed_tail
    if encoding in {'gzip', 'deflate'} and (decoder is None or not decoder.eof):
        raise httpx.DecodingError('远程响应解压失败：压缩数据不完整')
