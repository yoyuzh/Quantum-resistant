"""Cooperative checkpoints; no abandoned analyzer threads or backend dependency."""
from __future__ import annotations

from contextlib import contextmanager
from contextvars import ContextVar
from typing import Callable, Iterator


class AnalysisLimit(Exception):
    """A bounded analyzer could not cover the entire input."""


_checkpoint: ContextVar[Callable[[], object] | None] = ContextVar('scan_checkpoint', default=None)
MAX_SOURCE_BYTES = 2 * 1024 * 1024
MAX_NODES = 50_000
MAX_DEPTH = 64


def checkpoint() -> None:
    callback = _checkpoint.get()
    if callback is not None:
        callback()


@contextmanager
def analysis_control(callback: Callable[[], object]) -> Iterator[None]:
    token = _checkpoint.set(callback)
    try:
        checkpoint()
        yield
    finally:
        _checkpoint.reset(token)


def mask_span(chars: list[str], start: int, end: int) -> None:
    for offset in range(start, end, 2048):
        checkpoint()
        chars[offset:min(end, offset + 2048)] = [
            char if char in '\r\n' else ' ' for char in chars[offset:min(end, offset + 2048)]
        ]
