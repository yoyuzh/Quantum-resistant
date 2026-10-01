from __future__ import annotations

import os
import time
import logging
from email.utils import parsedate_to_datetime
from contextlib import contextmanager
from threading import BoundedSemaphore, Event, Lock
import urllib.request
from concurrent.futures import FIRST_COMPLETED, ThreadPoolExecutor, wait
from dataclasses import dataclass, field
from typing import Callable, Iterable, TypeVar
from backend.collection_config import MAX_COLLECTED_FILES, MAX_TEXT_BYTES, SCAN_TIMEOUT_SECONDS

import httpx

SourceDocument = tuple[str, str, str]
T = TypeVar("T")
R = TypeVar("R")


class CollectionError(RuntimeError):
    pass


class CollectionTimeout(CollectionError):
    pass


class CollectionCancelled(CollectionTimeout):
    pass


class CollectionControl:
    def __init__(self, report=None, *, max_bytes=MAX_TEXT_BYTES, parent=None, scope=None):
        self.cancelled = Event()
        self.report = report
        self.lock = Lock()
        self.bytes = 0
        self.grace_seconds = 0
        self.finalizing = False
        self.max_bytes = max_bytes
        self.parent = parent
        self.scope = scope
        self.publisher = None
        self.storage = getattr(parent, 'storage', None)
        self.folder = getattr(parent, 'folder', None)
        if parent:
            self.cancelled = parent.cancelled

    def request_cancel(self) -> bool:
        with self.lock:
            if self.finalizing:
                return False
            self.cancelled.set()
            return True

    def begin_commit(self) -> bool:
        with self.lock:
            if self.cancelled.is_set():
                return False
            self.finalizing = True
            return True

    def accept(self, size: int) -> bool:
        with self.lock:
            if self.bytes + size > self.max_bytes:
                return False
            self.bytes += size
        return True

    def emit(self, **values):
        if self.parent:
            self.parent.emit(scope=self.scope, **values)
            return
        if self.report:
            self.report(**values)

    def publish(self, document):
        return self.publisher(document) if self.publisher else document


@dataclass(frozen=True)
class Deadline:
    end: float
    control: CollectionControl = field(default_factory=CollectionControl, compare=False)

    @classmethod
    def after(cls, seconds: float = SCAN_TIMEOUT_SECONDS) -> Deadline:
        return cls(time.monotonic() + seconds)

    def remaining(self) -> float:
        if self.control.cancelled.is_set():
            raise CollectionCancelled("任务已取消，正在保留已完成部分")
        value = self.end - time.monotonic()
        if value <= 0:
            raise CollectionTimeout("远程扫描已超时，请缩小扫描范围后重试")
        return value

    def child(self, seconds: float) -> Deadline:
        return Deadline(min(self.end, time.monotonic() + seconds), self.control)

    def pause(self, seconds: float) -> None:
        self.control.cancelled.wait(min(seconds, self.remaining()))
        self.remaining()


HTTP_SLOTS = BoundedSemaphore(8)
logger = logging.getLogger(__name__)


@contextmanager
def http_slot(deadline: Deadline):
    acquired = False
    try:
        while not acquired:
            acquired = HTTP_SLOTS.acquire(timeout=min(.2, deadline.remaining()))
        yield
    finally:
        if acquired:
            HTTP_SLOTS.release()


def retry_delay(response: httpx.Response, attempt: int) -> float:
    value = response.headers.get("retry-after")
    if value:
        try:
            return max(0, float(value))
        except ValueError:
            try:
                return max(0, parsedate_to_datetime(value).timestamp() - time.time())
            except (ValueError, TypeError, OverflowError):
                pass
    if response.headers.get("x-ratelimit-remaining") == "0":
        try:
            return max(1, float(response.headers['x-ratelimit-reset']) - time.time())
        except (ValueError, KeyError):
            return 60
    return 60 if response.status_code in {403, 429} else .5 * 2 ** attempt


class CollectedSources(list[SourceDocument]):
    """List-compatible collection result, with explicit coverage metadata."""

    def __init__(self, documents: Iterable[SourceDocument] = (), *, limit: int = MAX_COLLECTED_FILES,
                 candidates: int | None = None, skipped: int = 0, partial: bool = False,
                 diagnostics: list[dict] | None = None, skip_reasons: dict | None = None) -> None:
        super().__init__(documents)
        self.coverage = {"scanned_files": len(self), "file_limit": limit, "candidate_files": candidates,
                         "skipped_files": skipped, "partial": partial, "skip_reasons": skip_reasons or {}}
        self.diagnostics = diagnostics or []


def remote_client_options() -> dict:
    """Use explicit proxy variables, then the Windows static system proxy."""
    options = {"follow_redirects": False, "trust_env": True}
    if any(os.environ.get(key) for key in ("HTTPS_PROXY", "HTTP_PROXY", "ALL_PROXY")):
        return options
    if os.name == "nt":
        read_registry = getattr(urllib.request, "getproxies_registry", None)
        proxies = read_registry() if read_registry else {}
        proxy = proxies.get("https") or proxies.get("http")
        if proxy:
            options["proxy"] = proxy
    return options


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
        if timed_out and pending:
            # Give cooperative workers a short opportunity to publish completed files.
            wait(tuple(pending), timeout=deadline.control.grace_seconds)
        for future, item in pending.items():
            if future.done() and not future.cancelled():
                try:
                    results.append((item, future.result()))
                except Exception as exc:
                    results.append((item, exc))
            else:
                future.cancel()
        # In-flight HTTP calls carry the same deadline and bounded socket timeouts.
        executor.shutdown(wait=False, cancel_futures=True)
    return results, timed_out


def get_with_retries(client: httpx.Client, url: str, *, headers: dict | None = None,
                     params: dict | None = None, max_bytes: int | None = 8 * 1024 * 1024,
                     attempts: int = 3, deadline: Deadline | None = None,
                     socket_timeout: float = 8.0, spool: bool = False) -> httpx.Response:
    budget = deadline or Deadline.after()
    for attempt in range(attempts):
        delay = .5 * 2 ** attempt
        started = time.monotonic()
        path = None
        try:
            timeout = min(socket_timeout, budget.remaining())
            with bounded_stream(client, url, budget, timeout, headers=headers, params=params) as response:
                response.raise_for_status()
                length = response.headers.get("content-length", "")
                if length.isdigit() and max_bytes is not None and int(length) > max_bytes:
                    raise CollectionError("远程响应超过大小限制")
                chunks, size = [], 0
                if spool and budget.control.storage:
                    path = budget.control.storage.write(budget.control.folder, b'', '.archive')
                if spool:
                    total = int(length) if length.isdigit() and not response.headers.get('content-encoding') else None
                    budget.control.emit(download_bytes=0, download_total=total)
                from backend.http_safety import decoded_chunks
                for chunk in decoded_chunks(response, budget, max_bytes):
                    budget.remaining()
                    size += len(chunk)
                    if max_bytes is not None and size > max_bytes:
                        raise CollectionError("远程响应超过大小限制")
                    if path:
                        budget.control.storage.append(path, chunk)
                    else:
                        chunks.append(chunk)
                    if spool:
                        budget.control.emit(download_bytes=size)
                budget.remaining()
                # iter_bytes() has already decompressed the body. Forwarding the
                # wire encoding would make HTTPX decode it a second time.
                headers_out = {key: value for key, value in response.headers.items()
                               if key.lower() not in {'content-encoding', 'content-length', 'transfer-encoding'}}
                result = httpx.Response(response.status_code, content=b"".join(chunks), headers=headers_out, request=response.request)
                if path:
                    result.extensions['archive_path'] = path
                    path = None
                return result
        except httpx.HTTPStatusError as exc:
            limited = exc.response.status_code == 403 and (exc.response.headers.get('x-ratelimit-remaining') == '0' or 'retry-after' in exc.response.headers)
            if (exc.response.status_code not in {429, 500, 502, 503, 504} and not limited) or attempt == attempts - 1:
                raise
            delay = retry_delay(exc.response, attempt)
            if delay >= budget.remaining():
                raise
        except httpx.DecodingError:
            # Retrying identical malformed content only consumes the task budget.
            raise
        except (httpx.HTTPError, OSError):
            if attempt == attempts - 1:
                raise
        finally:
            if path:
                budget.control.storage.remove(path)
            logger.debug("remote_request host=%s attempt=%d elapsed=%.3f", httpx.URL(url).host, attempt + 1, time.monotonic() - started)
        budget.pause(delay)
    raise CollectionError("远程请求失败")


@contextmanager
def bounded_stream(client, url, budget, socket_timeout, **kwargs):
    from backend.http_safety import safe_stream
    with safe_stream(client, url, budget, socket_timeout, **kwargs) as response:
        yield response
