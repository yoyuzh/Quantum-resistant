"""Browser trust and bounded JSON ingestion before FastAPI model parsing."""
from __future__ import annotations

import asyncio
import os
from urllib.parse import urlsplit

from starlette.responses import JSONResponse

from backend.collection_config import MAX_COLLECTED_FILE_BYTES, MAX_UPLOAD_BYTES


def configured(name: str, default: str = '') -> set[str]:
    return {item.strip().lower() for item in os.getenv(name, default).split(',') if item.strip()}


def origin(value: str) -> tuple[str, str, int] | None:
    try:
        parsed = urlsplit(value)
        if parsed.scheme not in {'http', 'https'} or not parsed.hostname or parsed.username or parsed.password:
            return None
        if parsed.path not in {'', '/'} or parsed.query or parsed.fragment:
            return None
        return parsed.scheme, parsed.hostname.lower(), parsed.port or (443 if parsed.scheme == 'https' else 80)
    except ValueError:
        return None


class RequestBoundary:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope['type'] != 'http':
            return await self.app(scope, receive, send)
        headers = {key.decode('latin1').lower(): value.decode('latin1') for key, value in scope['headers']}
        for name in (b'host', b'origin'):
            if sum(key.lower() == name for key, _ in scope['headers']) > 1:
                return await self.reject(scope, receive, send, 400, '请求包含重复的主机或来源头')
        host = headers.get('host', '')
        target = origin(f"{scope.get('scheme', 'http')}://{host}")
        allowed = configured('QUANTUM_ALLOWED_HOSTS', 'localhost,127.0.0.1,::1')
        # TestClient's host is trusted only on its in-process transport.
        testing = scope.get('client', ('', 0))[0] == 'testclient' and target and target[1] == 'testserver'
        if not target or (target[1] not in allowed and not testing):
            return await self.reject(scope, receive, send, 400, '请求主机不受信任，请检查可信主机配置')
        if scope['method'] not in {'GET', 'HEAD', 'OPTIONS'} and 'origin' in headers:
            source = origin(headers['origin'])
            trusted = {origin(item) for item in configured('QUANTUM_ALLOWED_ORIGINS')}
            if not source or (source != target and source not in trusted):
                return await self.reject(scope, receive, send, 403, '请求来源不受信任，请从本项目页面操作')
        async def secured_send(message):
            if message['type'] == 'http.response.start':
                message['headers'] = [*message.get('headers', []),
                                      (b'x-content-type-options', b'nosniff'),
                                      (b'x-frame-options', b'DENY')]
            await send(message)
        path = scope['path']
        if scope['method'] in {'POST', 'PUT', 'PATCH'} and path.startswith('/api/') and not path.endswith('/files'):
            limit = (6 * MAX_COLLECTED_FILE_BYTES + 65536 if path.endswith('/snippet') else
                     MAX_UPLOAD_BYTES if path.startswith('/api/report/') else 65536)
            body = bytearray()
            end = asyncio.get_running_loop().time() + 600
            while True:
                remaining = end - asyncio.get_running_loop().time()
                try:
                    message = await asyncio.wait_for(receive(), max(0, min(30, remaining)))
                except asyncio.TimeoutError:
                    return await self.reject(scope, receive, secured_send, 408, '读取请求超时，请重新提交')
                if message['type'] == 'http.disconnect':
                    return
                chunk = message.get('body', b'')
                if len(body) + len(chunk) > limit:
                    return await self.reject(scope, receive, secured_send, 413, '请求数据超过大小限制')
                body.extend(chunk)
                if not message.get('more_body', False):
                    break
            iterator = iter([{'type': 'http.request', 'body': bytes(body), 'more_body': False}])
            async def replay():
                return next(iterator, {'type': 'http.request', 'body': b'', 'more_body': False})
            receive = replay
        await self.app(scope, receive, secured_send)

    @staticmethod
    async def reject(scope, receive, send, status, detail):
        await JSONResponse({'detail': detail}, status_code=status,
                           headers={'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY'})(scope, receive, send)
