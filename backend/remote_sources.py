from __future__ import annotations

import base64
import binascii
import hashlib
import os
import tarfile
import time
import zipfile
from collections import Counter
from threading import Lock
from urllib.parse import quote, urlparse

import httpx

from backend.archives import collect_from_tar_bytes, collect_from_zip_bytes
from backend.collection_common import CollectionError, CollectionTimeout, CollectedSources, Deadline, concurrent_collect, get_with_retries, remote_client_options
from backend.collection_config import MAX_ARCHIVE_BYTES, MAX_COLLECTED_FILES, MAX_COLLECTED_FILE_BYTES
from backend.collectors import is_supported_source_path, source_priority


class GitHubAuthenticationError(CollectionError):
    pass


class GitHubRateLimitError(CollectionError):
    pass


class FileCollectionError(CollectionError):
    def __init__(self, message, reason):
        super().__init__(message)
        self.reason = reason


_REJECTED_AUTH: dict[bytes, float] = {}
_REJECTED_AUTH_LOCK = Lock()
_REJECTED_AUTH_TTL_SECONDS = 300


def _auth_fingerprint(authorization: str) -> bytes:
    return hashlib.sha256(authorization.encode("utf-8")).digest()


def _auth_was_rejected(authorization: str) -> bool:
    with _REJECTED_AUTH_LOCK:
        rejected_at = _REJECTED_AUTH.get(_auth_fingerprint(authorization))
    return rejected_at is not None and time.monotonic() - rejected_at < _REJECTED_AUTH_TTL_SECONDS


def github_headers() -> dict[str, str]:
    headers = {"Accept": "application/vnd.github+json"}
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        authorization = f"Bearer {token}"
        if not _auth_was_rejected(authorization):
            headers["Authorization"] = authorization
    return headers


def describe_http_error(exc: Exception | None) -> str:
    if isinstance(exc, httpx.HTTPStatusError):
        status = exc.response.status_code
        if status == 401:
            return "GitHub 拒绝访问（HTTP 401），请检查令牌或仓库权限"
        if status in {403, 429}:
            return "远程服务限制访问或请求过多；GitHub 可配置 GITHUB_TOKEN 后重试"
        if status == 404:
            return "资源不存在或没有访问权限"
        return f"远程服务返回 HTTP {status}"
    if isinstance(exc, httpx.ConnectTimeout):
        return "建立远程连接超时，请检查网络与代理"
    if isinstance(exc, httpx.ReadTimeout):
        return "读取远程数据超时，服务响应较慢"
    if isinstance(exc, httpx.PoolTimeout):
        return "等待可用连接超时，请稍后重试"
    if isinstance(exc, (httpx.TimeoutException, CollectionTimeout)):
        return "远程连接超时"
    if isinstance(exc, httpx.DecodingError):
        return "远程响应解压失败，请重试；若持续出现，请检查代理是否改写了压缩响应"
    if isinstance(exc, httpx.ProxyError):
        return "代理连接失败，请检查代理服务是否运行及代理地址配置"
    if isinstance(exc, httpx.ConnectError):
        return "无法建立远程连接，请检查网络、域名解析及代理的 HTTPS 连接"
    if isinstance(exc, ValueError):
        return "远程响应格式无效，未取得预期的 JSON 数据"
    if isinstance(exc, CollectionError):
        return str(exc)
    return "连接失败，请检查系统代理与网络，或确认远程响应是受支持的源码数据"


def github_get(client: httpx.Client, url: str, *, headers: dict[str, str], **kwargs) -> httpx.Response:
    """Retry a public GitHub resource anonymously after a rejected token."""
    original_headers = headers
    headers = headers.copy()
    if headers.get('Authorization') and _auth_was_rejected(headers['Authorization']):
        headers.pop('Authorization')
    try:
        return get_with_retries(client, url, headers=headers.copy(), **kwargs)
    except httpx.HTTPStatusError as exc:
        if exc.response.status_code in {403, 429} and urlparse(url).hostname == "api.github.com":
            raise GitHubRateLimitError("GitHub API 限制访问或请求过多；请检查 GITHUB_TOKEN 或稍后重试") from exc
        if exc.response.status_code != 401 or "Authorization" not in headers:
            raise
        rejected_auth = headers.pop("Authorization")
        with _REJECTED_AUTH_LOCK:
            _REJECTED_AUTH[_auth_fingerprint(rejected_auth)] = time.monotonic()
            if original_headers.get('Authorization') == rejected_auth:
                original_headers.pop('Authorization', None)
        try:
            return get_with_retries(client, url, headers=headers.copy(), **kwargs)
        except httpx.HTTPStatusError as retry_exc:
            if retry_exc.response.status_code == 401:
                raise GitHubAuthenticationError("GitHub 拒绝匿名访问（HTTP 401），请检查仓库权限") from retry_exc
            if retry_exc.response.status_code in {403, 429}:
                raise GitHubRateLimitError("GitHub 令牌被拒绝，匿名请求又受到限流；请更新 GITHUB_TOKEN") from retry_exc
            raise


def decode_github_blob(payload: dict) -> str:
    if not isinstance(payload, dict):
        raise CollectionError("GitHub 文件响应格式无效")
    if payload.get("encoding") != "base64":
        raise CollectionError("GitHub 文件编码不支持")
    try:
        data = base64.b64decode("".join(str(payload.get("content", "")).split()), validate=True)
        if len(data) > MAX_COLLECTED_FILE_BYTES:
            raise FileCollectionError("文件超过 2 MiB 限制", 'file_size')
        return data.decode("utf-8-sig")
    except (binascii.Error, UnicodeError) as exc:
        raise FileCollectionError("文件不是有效 UTF-8 文本", 'encoding') from exc


def github_sources(url: str, max_files: int, deadline: Deadline) -> CollectedSources:
    limit = max(1, min(max_files, MAX_COLLECTED_FILES))
    owner, repo = urlparse(url).path.strip("/").split("/")
    api = f"https://api.github.com/repos/{owner}/{repo}"
    headers, branches, last_error = github_headers(), ["main", "master"], None
    api_rate_error = None
    deadline.control.emit(stage="获取仓库信息")
    with httpx.Client(**remote_client_options()) as client:
        try:
            metadata = github_get(client, api, headers=headers, attempts=2, deadline=deadline).json()
            if not isinstance(metadata, dict):
                raise CollectionError("GitHub 仓库响应格式无效")
            default = metadata.get("default_branch")
            if default:
                branches = [default]
        except (CollectionTimeout, GitHubAuthenticationError):
            raise
        except GitHubRateLimitError as exc:
            api_rate_error = last_error = exc
        except (httpx.HTTPError, ValueError, CollectionError, OSError) as exc:
            last_error = exc
        for branch in branches:
            if api_rate_error:
                break
            try:
                deadline.control.emit(stage="获取文件列表")
                payload = github_get(client, f"{api}/git/trees/{quote(branch, safe='')}", headers=headers,
                                           params={"recursive": "1"}, attempts=2, deadline=deadline).json()
                if not isinstance(payload, dict) or not isinstance(payload.get("tree"), list) or not all(isinstance(i, dict) for i in payload["tree"]):
                    raise CollectionError("GitHub 文件列表响应格式无效")
                candidates = [i for i in payload.get("tree", []) if i.get("type") == "blob" and is_supported_source_path(str(i.get("path", "")))]
                candidates.sort(key=lambda i: source_priority(i["path"]))
                version = str(payload.get('sha') or branch)
                if len(candidates) > 32 or payload.get('truncated'):
                    try:
                        deadline.control.emit(stage='下载仓库归档')
                        archive = github_get(client, f'{url}/archive/{quote(version, safe="")}.zip', headers=headers,
                                             max_bytes=MAX_ARCHIVE_BYTES, attempts=2, deadline=deadline, spool=True)
                        archive_path = archive.extensions.get('archive_path')
                        try:
                            return collect_from_zip_bytes(archive_path or archive.content, url, max_files=limit, deadline=deadline)
                        finally:
                            if archive_path:
                                deadline.control.storage.remove(archive_path)
                    except (CollectionTimeout, GitHubAuthenticationError):
                        raise
                    except (httpx.HTTPError, ValueError, CollectionError, zipfile.BadZipFile, OSError) as exc:
                        last_error = exc
                eligible = [i for i in candidates if int(i.get("size") or 0) <= MAX_COLLECTED_FILE_BYTES][:limit]
                reasons = Counter(file_size=len(candidates) - len([i for i in candidates if int(i.get('size') or 0) <= MAX_COLLECTED_FILE_BYTES]))
                reasons['file_limit'] = max(0, len(candidates) - reasons['file_size'] - len(eligible))
                deadline.control.emit(candidate_files=None if payload.get('truncated') else len(candidates), processed_files=sum(reasons.values()), skipped_files=sum(reasons.values()), totals_final=False)
                deadline.control.emit(stage="采集源码文件")
                def fetch(item):
                    path = item["path"]
                    blob_url = str(item.get("url", ""))
                    urls = []
                    file_error = None
                    if blob_url.startswith(api + "/git/blobs/"):
                        urls.append((blob_url, None))
                    urls.append((f"{api}/contents/{quote(path, safe='/')}", {"ref": version}))
                    for target, params in urls:
                        try:
                            response = github_get(client, target, headers=headers, params=params,
                                                        max_bytes=MAX_COLLECTED_FILE_BYTES * 2, attempts=1, deadline=deadline)
                            content = decode_github_blob(response.json())
                            if not deadline.control.accept(len(content.encode('utf-8'))):
                                raise FileCollectionError("采集文本达到来源总量上限", 'text_budget')
                            document = deadline.control.publish((url, path, content))
                            deadline.control.emit(collected_delta=1, processed_delta=1)
                            return document
                        except (CollectionTimeout, GitHubAuthenticationError, GitHubRateLimitError):
                            raise
                        except (httpx.HTTPError, ValueError, CollectionError, OSError) as exc:
                            file_error = exc
                            continue
                    deadline.control.emit(processed_delta=1, skipped_delta=1)
                    raise FileCollectionError(f"未能读取 {path}：{describe_http_error(file_error)}", getattr(file_error, 'reason', 'download_failure'))
                completed, timed_out = concurrent_collect(eligible, fetch, 2 if limit <= 6 else 4, deadline)
                docs = [result for _, result in completed if not isinstance(result, Exception)]
                auth_error = next((result for _, result in completed if isinstance(result, GitHubAuthenticationError)), None)
                rate_error = next((result for _, result in completed if isinstance(result, GitHubRateLimitError)), None)
                if docs:
                    docs.sort(key=lambda d: source_priority(d[1]))
                    skipped = len(candidates) - len(docs)
                    diagnostics = []
                    if skipped or payload.get("truncated"):
                        diagnostics.append({"code": "partial_collection", "message": f"仅扫描已采集的 {len(docs)} 个文件，存在未扫描文件。"})
                    errors = [str(value) for _, value in completed if isinstance(value, CollectionError)]
                    if errors:
                        diagnostics.append({"code": "file_collection_errors", "message": "；".join(errors[:3])})
                    if timed_out:
                        diagnostics.append({"code": "collection_timeout", "message": "采集达到时间预算，已保留完成的文件。"})
                    for _, value in completed:
                        if isinstance(value, Exception):
                            reasons[getattr(value, 'reason', 'download_failure')] += 1
                    reasons['cancelled' if deadline.control.cancelled.is_set() else 'timeout'] += max(0, len(eligible) - len(completed))
                    deadline.control.emit(processed_files=len(candidates), skipped_files=skipped, analysis_total=len(docs), totals_final=True)
                    return CollectedSources(docs, limit=limit, candidates=None if payload.get("truncated") else len(candidates),
                                            skipped=skipped, partial=bool(skipped or timed_out or payload.get("truncated")), diagnostics=diagnostics, skip_reasons=dict(reasons))
                if timed_out:
                    raise CollectionTimeout("GitHub 文件采集超时")
                if auth_error:
                    raise auth_error
                if rate_error:
                    raise rate_error
            except (CollectionTimeout, GitHubAuthenticationError):
                raise
            except GitHubRateLimitError as exc:
                api_rate_error = last_error = exc
                break
            except (httpx.HTTPError, ValueError, CollectionError, OSError) as exc:
                last_error = exc
        for branch in branches:
            try:
                deadline.control.emit(stage="下载仓库归档")
                archive = github_get(client, f"{url}/archive/refs/heads/{quote(branch, safe='')}.zip", headers=headers,
                                     max_bytes=MAX_ARCHIVE_BYTES, attempts=2, deadline=deadline, spool=True)
                archive_path = archive.extensions.get('archive_path')
                try:
                    docs = collect_from_zip_bytes(archive_path or archive.content, url, max_files=limit, deadline=deadline)
                finally:
                    if archive_path:
                        deadline.control.storage.remove(archive_path)
                if docs:
                    return docs
            except (CollectionTimeout, GitHubAuthenticationError):
                raise
            except (httpx.HTTPError, ValueError, CollectionError, zipfile.BadZipFile, OSError) as exc:
                last_error = exc
    raise CollectionError(f"无法采集 GitHub 仓库：{describe_http_error(api_rate_error or last_error)}")


def pypi_candidate_score(item: dict) -> tuple:
    filename = str(item.get("filename", ""))
    return (0 if item.get("packagetype") == "sdist" else 1, 0 if "py3-none-any.whl" in filename else 1, filename)


def pypi_sources(name: str, deadline: Deadline) -> CollectedSources:
    last_error: Exception | None = None
    options = [{"follow_redirects": False, "trust_env": False}]
    proxy_options = remote_client_options()
    if proxy_options.get("proxy") or any(os.environ.get(key) for key in ("HTTPS_PROXY", "HTTP_PROXY", "ALL_PROXY")):
        options.append(proxy_options)
    for index, client_options in enumerate(options):
        if index and not isinstance(last_error, (httpx.TransportError, OSError)):
            break
        try:
            deadline.control.emit(stage="获取 PyPI 发行信息")
            with httpx.Client(**client_options) as client:
                payload = get_with_retries(client, f"https://pypi.org/pypi/{name}/json", deadline=deadline,
                                           attempts=1 if index == 0 and len(options) > 1 else 3,
                                           socket_timeout=4.0 if index == 0 and len(options) > 1 else 8.0).json()
                if not isinstance(payload, dict) or not isinstance(payload.get("urls"), list) or not all(isinstance(i, dict) for i in payload["urls"]):
                    raise CollectionError("PyPI 版本响应格式无效")
                candidates = [item for item in sorted(payload.get("urls", []), key=pypi_candidate_score)
                              if not item.get('yanked') and isinstance(item.get('size', 0), (int, float))
                              and item.get('size', 0) <= MAX_ARCHIVE_BYTES
                              and str(item.get('filename', '')).endswith(('.zip', '.whl', '.tar.gz', '.tgz', '.tar.bz2', '.tar'))
                              and urlparse(str(item.get('url', ''))).scheme == 'https'
                              and urlparse(str(item.get('url', ''))).hostname in {'files.pythonhosted.org', 'pypi.org'}][:3]
                for item in candidates:
                    filename, url = str(item.get("filename", "")), str(item.get("url", ""))
                    if urlparse(url).scheme != "https" or urlparse(url).hostname not in {"files.pythonhosted.org", "pypi.org"}:
                        continue
                    if not filename.endswith((".zip", ".whl", ".tar.gz", ".tgz", ".tar.bz2", ".tar")):
                        continue
                    try:
                        deadline.control.emit(stage="下载 PyPI 发行包")
                        response = get_with_retries(client, url, max_bytes=MAX_ARCHIVE_BYTES, deadline=deadline,
                                                    attempts=1 if index == 0 and len(options) > 1 else 3, spool=True)
                        archive_path = response.extensions.get('archive_path')
                        try:
                            if filename.endswith((".zip", ".whl")):
                                docs = collect_from_zip_bytes(archive_path or response.content, f"pypi:{name}", strip_root=not filename.endswith(".whl"), deadline=deadline)
                            else:
                                docs = collect_from_tar_bytes(archive_path or response.content, f"pypi:{name}", deadline=deadline)
                        finally:
                            if archive_path:
                                deadline.control.storage.remove(archive_path)
                        if docs:
                            return docs
                    except CollectionTimeout:
                        raise
                    except (httpx.HTTPError, CollectionError, tarfile.TarError, zipfile.BadZipFile, OSError) as exc:
                        last_error = exc
                        if index == 0 and len(options) > 1 and isinstance(exc, (httpx.TransportError, OSError)):
                            break
        except CollectionTimeout:
            raise
        except (httpx.HTTPError, ValueError, CollectionError, OSError) as exc:
            last_error = exc
    raise CollectionError(f"无法采集 PyPI 包：{describe_http_error(last_error)}")
