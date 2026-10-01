"""Session capability for the packaged application, including static resources."""
from __future__ import annotations

import hmac
from starlette.responses import JSONResponse
from backend.runtime import DesktopRuntime

TOKEN_HEADER = b'x-quantum-desktop-token'
CSP = ("default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; "
       "img-src 'self' data:; font-src 'self'; connect-src 'self'; "
       "object-src 'none'; frame-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'")


class DesktopBoundary:
    def __init__(self, app, runtime: DesktopRuntime):
        self.app, self.runtime = app, runtime

    async def __call__(self, scope, receive, send):
        if scope['type'] == 'websocket':
            return await send({'type': 'websocket.close', 'code': 1008})
        if scope['type'] != 'http':
            return await self.app(scope, receive, send)
        headers = scope['headers']
        def values(name):
            return [value for key, value in headers if key.lower() == name]
        token = values(TOKEN_HEADER)
        expected_host = f'127.0.0.1:{self.runtime.port}'.encode('ascii')
        origins = values(b'origin')
        valid = (values(b'host') == [expected_host] and len(token) == 1
                 and hmac.compare_digest(token[0], self.runtime.token.encode('ascii'))
                 and (not origins or origins == [self.runtime.origin.encode('ascii')]))
        if not valid:
            return await JSONResponse({'detail': '桌面会话认证失败，请重新启动应用'}, status_code=403,
                                      headers={'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'})(scope, receive, send)
        async def secured_send(message):
            if message['type'] == 'http.response.start':
                message['headers'] = [*message.get('headers', []),
                                      (b'content-security-policy', CSP.encode('ascii')),
                                      (b'cache-control', b'no-store'),
                                      (b'referrer-policy', b'no-referrer')]
            await send(message)
        await self.app(scope, receive, secured_send)
