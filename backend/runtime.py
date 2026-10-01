"""Explicit desktop configuration; ordinary web/CLI execution keeps its defaults."""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
import re


@dataclass(frozen=True)
class DesktopRuntime:
    resource_root: Path
    data_root: Path
    cache_root: Path
    port: int
    token: str = field(repr=False)

    def __post_init__(self) -> None:
        if not re.fullmatch(r'[a-f0-9]{64}', self.token) or not 0 < self.port < 65536:
            raise ValueError('桌面启动配置无效')
        for root in (self.data_root, self.cache_root):
            if not root.is_absolute():
                raise ValueError('桌面数据目录必须使用绝对路径')
            root.mkdir(mode=0o700, parents=True, exist_ok=True)

    @property
    def origin(self) -> str:
        return f'http://127.0.0.1:{self.port}'


desktop: DesktopRuntime | None = None


def temporary_parent() -> Path:
    if desktop:
        return desktop.cache_root / 'scans'
    import tempfile
    return Path(tempfile.gettempdir()) / 'quantum-resistant-scans'
