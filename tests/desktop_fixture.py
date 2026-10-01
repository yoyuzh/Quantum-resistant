"""Desktop-only offline acceptance adapter, fixed to localhost:8018.

Not bundled. Select as QUANTUM_DESKTOP_BACKEND_ENTRY only with development Electron.
The production entry contains no mocks, fixture flags, or imports of this module.
"""
from __future__ import annotations

from pathlib import Path
import socket
import sys
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from desktop.backend_entry import main


def install_fixture() -> None:
    # Import only after the private runtime and authenticated app are initialized.
    from tests import browser_fixture as fixture
    from backend import main as backend, task_routes, scanning
    patches = [patch.object(backend, 'collect_github_sources', fixture.collect),
               patch.object(backend, 'collect_pypi_sources', fixture.collect),
               patch.object(backend, 'scan_popular', fixture.popular),
               patch.object(task_routes, 'fetch_popular_repos', fixture.task_search),
               patch.object(scanning, 'analyze_source', fixture.slow_analyze),
               patch('backend.pipeline.analyze_source', fixture.slow_analyze),
               patch('backend.popular.analyze_source', fixture.slow_analyze),
               patch('backend.popular.collect_github_sources', fixture.collect)]
    for item in patches:
        item.start()


if __name__ == '__main__':
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.bind(('127.0.0.1', 8018))
    main(bind_socket=sock, application_setup=install_fixture)
