from __future__ import annotations

import base64
import binascii
import os
import tarfile
import zipfile
from urllib.parse import quote, urlparse

import httpx

from backend.archives import collect_from_tar_bytes, collect_from_zip_bytes
from backend.collection_common import CollectionError, CollectionTimeout, CollectedSources, Deadline, concurrent_collect, get_with_retries
from backend.collection_config import MAX_ARCHIVE_BYTES, MAX_COLLECTED_FILES, MAX_COLLECTED_FILE_BYTES
from backend.collectors import is_supported_source_path, source_priority


def github_headers() -> dict[str, str]:
    headers = {"Accept": "application/vnd.github+json"}
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def describe_http_error(exc: Exception | None) -> str:
    if isinstance(exc, httpx.HTTPStatusError):
        status = exc.response.status_code
        if status in {403, 429}:
            return "远程服务限制访问或请求过多；GitHub 可配置 GITHUB_TOKEN 后重试"
        if status == 404:
            return "资源不存在或没有访问权限"
        return f"远程服务返回 HTTP {status}"
    if isinstance(exc, (httpx.TimeoutException, CollectionTimeout)):
        return "远程连接超时"
    return "连接失败，或响应不是受支持的源码数据"


def decode_github_blob(payload: dict) -> str:
    if not isinstance(payload, dict):
        raise CollectionError("GitHub 文件响应格式无效")
    if payload.get("encoding") != "base64":
        raise CollectionError("GitHub 文件编码不支持")
    try:
        data = base64.b64decode("".join(str(payload.get("content", "")).split()), validate=True)
        if len(data) > MAX_COLLECTED_FILE_BYTES:
            raise CollectionError("文件超过 2 MiB 限制")
        return data.decode("utf-8-sig")
    except (binascii.Error, UnicodeError) as exc:
        raise CollectionError("文件不是有效 UTF-8 文本") from exc


def github_sources(url: str, max_files: int, deadline: Deadline) -> CollectedSources:
    limit = max(1, min(max_files, MAX_COLLECTED_FILES))
    owner, repo = urlparse(url).path.strip("/").split("/")
    api = f"https://api.github.com/repos/{owner}/{repo}"
    headers, branches, last_error = github_headers(), ["main", "master"], None
    with httpx.Client(follow_redirects=True, trust_env=True) as client:
        try:
            metadata = get_with_retries(client, api, headers=headers, attempts=2, deadline=deadline).json()
            if not isinstance(metadata, dict):
                raise CollectionError("GitHub 仓库响应格式无效")
            default = metadata.get("default_branch")
            if default:
                branches = [default, *[b for b in branches if b != default]]
        except CollectionTimeout:
            raise
        except (httpx.HTTPError, ValueError, CollectionError, OSError) as exc:
            last_error = exc
        for branch in branches:
            try:
                payload = get_with_retries(client, f"{api}/git/trees/{quote(branch, safe='')}", headers=headers,
                                           params={"recursive": "1"}, attempts=2, deadline=deadline).json()
                if not isinstance(payload, dict) or not isinstance(payload.get("tree"), list) or not all(isinstance(i, dict) for i in payload["tree"]):
                    raise CollectionError("GitHub 文件列表响应格式无效")
                candidates = [i for i in payload.get("tree", []) if i.get("type") == "blob" and is_supported_source_path(str(i.get("path", "")))]
                candidates.sort(key=lambda i: source_priority(i["path"]))
                eligible = [i for i in candidates if int(i.get("size") or 0) <= MAX_COLLECTED_FILE_BYTES][:limit]
                def fetch(item):
                    path = item["path"]
                    blob_url = str(item.get("url", ""))
                    urls = []
                    if blob_url.startswith(api + "/git/blobs/"):
                        urls.append((blob_url, None))
                    urls.append((f"{api}/contents/{quote(path, safe='/')}", {"ref": branch}))
                    with httpx.Client(follow_redirects=True, trust_env=True) as file_client:
                        for target, params in urls:
                            try:
                                response = get_with_retries(file_client, target, headers=headers, params=params,
                                                            max_bytes=MAX_COLLECTED_FILE_BYTES * 2, attempts=1, deadline=deadline)
                                return (url, path, decode_github_blob(response.json()))
                            except CollectionTimeout:
                                raise
                            except (httpx.HTTPError, ValueError, CollectionError, OSError):
                                continue
                    raise CollectionError(f"未能读取 {path}")
                completed, timed_out = concurrent_collect(eligible, fetch, 8, deadline)
                docs = [result for _, result in completed if not isinstance(result, Exception)]
                if docs:
                    docs.sort(key=lambda d: source_priority(d[1]))
                    skipped = len(candidates) - len(docs)
                    diagnostics = []
                    if skipped or payload.get("truncated"):
                        diagnostics.append({"code": "partial_collection", "message": f"仅扫描已采集的 {len(docs)} 个文件，存在未扫描文件。"})
                    if timed_out:
                        diagnostics.append({"code": "collection_timeout", "message": "采集达到时间预算，已保留完成的文件。"})
                    return CollectedSources(docs, limit=limit, candidates=None if payload.get("truncated") else len(candidates),
                                            skipped=skipped, partial=bool(skipped or timed_out or payload.get("truncated")), diagnostics=diagnostics)
                if timed_out:
                    raise CollectionTimeout("GitHub 文件采集超时")
            except CollectionTimeout:
                raise
            except (httpx.HTTPError, ValueError, CollectionError, OSError) as exc:
                last_error = exc
        for branch in branches:
            try:
                archive = get_with_retries(client, f"{url}/archive/refs/heads/{quote(branch, safe='')}.zip",
                                           max_bytes=MAX_ARCHIVE_BYTES, attempts=2, deadline=deadline)
                docs = collect_from_zip_bytes(archive.content, url, max_files=limit, deadline=deadline)
                if docs:
                    return docs
            except CollectionTimeout:
                raise
            except (httpx.HTTPError, ValueError, CollectionError, zipfile.BadZipFile, OSError) as exc:
                last_error = exc
    raise CollectionError(f"无法采集 GitHub 仓库：{describe_http_error(last_error)}")


def pypi_candidate_score(item: dict) -> tuple:
    filename = str(item.get("filename", ""))
    return (0 if item.get("packagetype") == "sdist" else 1, 0 if "py3-none-any.whl" in filename else 1, filename)


def pypi_sources(name: str, deadline: Deadline) -> CollectedSources:
    last_error = None
    for trust_env in (False, True):
        try:
            with httpx.Client(follow_redirects=True, trust_env=trust_env) as client:
                payload = get_with_retries(client, f"https://pypi.org/pypi/{name}/json", deadline=deadline).json()
                if not isinstance(payload, dict) or not isinstance(payload.get("urls"), list) or not all(isinstance(i, dict) for i in payload["urls"]):
                    raise CollectionError("PyPI 版本响应格式无效")
                for item in sorted(payload.get("urls", []), key=pypi_candidate_score):
                    filename, url = str(item.get("filename", "")), str(item.get("url", ""))
                    if urlparse(url).scheme != "https" or urlparse(url).hostname not in {"files.pythonhosted.org", "pypi.org"}:
                        continue
                    if not filename.endswith((".zip", ".whl", ".tar.gz", ".tgz", ".tar.bz2", ".tar")):
                        continue
                    try:
                        response = get_with_retries(client, url, max_bytes=MAX_ARCHIVE_BYTES, deadline=deadline)
                        if filename.endswith((".zip", ".whl")):
                            docs = collect_from_zip_bytes(response.content, f"pypi:{name}", strip_root=not filename.endswith(".whl"), deadline=deadline)
                        else:
                            docs = collect_from_tar_bytes(response.content, f"pypi:{name}", deadline=deadline)
                        if docs:
                            return docs
                    except CollectionTimeout:
                        raise
                    except (httpx.HTTPError, CollectionError, tarfile.TarError, zipfile.BadZipFile, OSError) as exc:
                        last_error = exc
        except CollectionTimeout:
            raise
        except (httpx.HTTPError, ValueError, CollectionError, OSError) as exc:
            last_error = exc
    raise CollectionError(f"无法采集 PyPI 包：{describe_http_error(last_error)}")
