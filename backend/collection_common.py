from __future__ import annotations

import time
from concurrent.futures import FIRST_COMPLETED, ThreadPoolExecutor, wait
from dataclasses import dataclass
from typing import Callable, Iterable, TypeVar

import httpx

SourceDocument = tuple[str, str, str]
T = TypeVar("T")
R = TypeVar("R")


class CollectionError(RuntimeError):
    pass


class CollectionTimeout(CollectionError):
    pass


@dataclass(frozen=True)
class Deadline:
    end: float

    @classmethod
    def after(cls, seconds: float = 90) -> Deadline:
        return cls(time.monotonic() + seconds)

    def remaining(self) -> float:
        value = self.end - time.monotonic()
        if value <= 0:
            raise CollectionTimeout("远程扫描已超时，请缩小扫描范围后重试")
        return value


class CollectedSources(list[SourceDocument]):
    """List-compatible collection result, with explicit coverage metadata."""

    def __init__(self, documents: Iterable[SourceDocument] = (), *, limit: int = 80,
                 candidates: int | None = None, skipped: int = 0, partial: bool = False,
                 diagnostics: list[dict] | None = None) -> None:
        super().__init__(documents)
        self.coverage = {"scanned_files": len(self), "file_limit": limit, "candidate_files": candidates,
                         "skipped_files": skipped, "partial": partial}
        self.diagnostics = diagnostics or []


def concurrent_collect(items: Iterable[T], function: Callable[[T], R], workers: int, deadline: Deadline) -> tuple[list[tuple[T, R | Exception]], bool]:
    """Bound both running and queued work; workers never mutate returned results."""
    iterator = iter(items)
    executor = ThreadPoolExecutor(max_workers=max(1, workers))
    pending = {}
    results = []
    timed_out = False
    def submit_one() -> None:
        try:
            item = next(iterator)
        except StopIteration:
            return
        deadline.remaining()
        pending[executor.submit(function, item)] = item
    try:
        for _ in range(max(1, workers)):
            submit_one()
        while pending:
            done, _ = wait(pending, timeout=deadline.remaining(), return_when=FIRST_COMPLETED)
            if not done:
                raise CollectionTimeout("批次时间预算已用尽")
            for future in done:
                item = pending.pop(future)
                try:
                    result = future.result()
                except Exception as exc:
                    result = exc
                results.append((item, result))
            for _ in done:
                submit_one()
    except CollectionTimeout:
        timed_out = True
    finally:
        for future in pending:
            future.cancel()
        # In-flight HTTP calls carry the same deadline and bounded socket timeouts.
        executor.shutdown(wait=False, cancel_futures=True)
    return results, timed_out


def get_with_retries(client: httpx.Client, url: str, *, headers: dict | None = None,
                     params: dict | None = None, max_bytes: int | None = 8 * 1024 * 1024,
                     attempts: int = 3, deadline: Deadline | None = None) -> httpx.Response:
    budget = deadline or Deadline.after()
    for attempt in range(attempts):
        try:
            timeout = min(8.0, budget.remaining())
            with client.stream("GET", url, headers=headers, params=params, timeout=timeout) as response:
                response.raise_for_status()
                length = response.headers.get("content-length", "")
                if length.isdigit() and max_bytes is not None and int(length) > max_bytes:
                    raise CollectionError("远程响应超过大小限制")
                chunks, size = [], 0
                for chunk in response.iter_bytes():
                    budget.remaining()
                    size += len(chunk)
                    if max_bytes is not None and size > max_bytes:
                        raise CollectionError("远程响应超过大小限制")
                    chunks.append(chunk)
                budget.remaining()
                return httpx.Response(response.status_code, content=b"".join(chunks), request=response.request)
        except httpx.HTTPStatusError as exc:
            if exc.response.status_code not in {429, 500, 502, 503, 504} or attempt == attempts - 1:
                raise
        except (httpx.HTTPError, OSError):
            if attempt == attempts - 1:
                raise
        time.sleep(min(0.25 * (attempt + 1), budget.remaining()))
    raise CollectionError("远程请求失败")
