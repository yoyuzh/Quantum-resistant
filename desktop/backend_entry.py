"""Private stdio-controlled backend entry; never accepts configuration from HTTP."""
from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
import logging
from logging.handlers import RotatingFileHandler
import os
from pathlib import Path
import socket
import sys
from threading import Lock, Thread, Event
from typing import Callable

RESOURCE_ROOT = Path(getattr(sys, '_MEIPASS', Path(__file__).resolve().parents[1]))
if str(RESOURCE_ROOT) not in sys.path:
    sys.path.insert(0, str(RESOURCE_ROOT))


class BeijingFormatter(logging.Formatter):
    def formatTime(self, record, datefmt=None):
        return datetime.fromtimestamp(record.created, timezone(timedelta(hours=8))).isoformat(timespec='milliseconds')


def main(*, bind_socket: socket.socket | None = None, application_setup: Callable[[], None] | None = None) -> None:
    output_lock = Lock()
    def emit(message: dict) -> None:
        with output_lock:
            sys.stdout.write(json.dumps(message, ensure_ascii=True) + '\n')
            sys.stdout.flush()

    # A bounded initial line; do not report its contents on errors (contains a secret).
    line = sys.stdin.buffer.readline(16385)
    if len(line) > 16384 or not line.endswith(b'\n'):
        raise ValueError('桌面启动配置无效')
    config = json.loads(line)
    from backend import runtime
    from backend.runtime import DesktopRuntime
    with bind_socket or socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        if bind_socket is None:
            if os.name == 'nt':
                sock.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
            sock.bind(('127.0.0.1', 0))
        sock.listen(128)
        runtime.desktop = DesktopRuntime(RESOURCE_ROOT, Path(config['data_root']),
                                         Path(config['cache_root']), sock.getsockname()[1], config['token'])
        logs = runtime.desktop.data_root / 'logs'
        logs.mkdir(mode=0o700, exist_ok=True)
        handler = RotatingFileHandler(logs / 'backend.log', maxBytes=1024 * 1024, backupCount=3, encoding='utf-8')
        handler.setFormatter(BeijingFormatter('%(asctime)s %(levelname)s %(name)s %(message)s'))
        logging.basicConfig(level=logging.WARNING, handlers=[handler], force=True)
        # Network request URLs may contain package/repository identifiers: no HTTP request logs.
        logging.getLogger('httpx').setLevel(logging.WARNING)
        import uvicorn
        from backend import main as backend
        if application_setup:
            application_setup()

        class DesktopServer(uvicorn.Server):
            async def startup(self, sockets=None):
                await super().startup(sockets=sockets)
                if self.started:
                    emit({'event': 'ready', 'port': runtime.desktop.port, 'pid': os.getpid()})

        server = DesktopServer(uvicorn.Config(backend.app, access_log=False, log_config=None,
                                              lifespan='on', loop='asyncio', http='h11',
                                              ws='none', timeout_graceful_shutdown=5))
        stopping = Event()
        def stop() -> None:
            if stopping.is_set():
                return
            stopping.set()
            server.should_exit = True
            # Also bounds Python's non-daemon analysis threads after uvicorn has returned.
            def watchdog():
                Event().wait(10)
                os._exit(0)
            Thread(target=watchdog, daemon=True).start()
            backend.task_routes.store.close()

        def control() -> None:
            try:
                while True:
                    raw = sys.stdin.buffer.readline(4097)
                    if not raw:
                        break
                    if len(raw) > 4096 or not raw.endswith(b'\n'):
                        break
                    command = json.loads(raw)
                    if command.get('command') == 'shutdown':
                        break
                    if command.get('command') == 'status':
                        scheduler = backend.task_routes.store.scheduler
                        with scheduler.lock:
                            active = scheduler.used
                        emit({'event': 'status', 'id': command.get('id'), 'active': active})
            except (ValueError, OSError, TypeError):
                pass
            finally:
                stop()
        Thread(target=control, daemon=True).start()
        try:
            server.run(sockets=[sock])
        finally:
            stop()


if __name__ == '__main__':
    try:
        main()
    except Exception:
        # Deliberately omit exception text/configuration and source data.
        sys.stderr.write('扫描后端启动失败，请检查资源文件和用户目录权限。\n')
        sys.exit(1)
