from __future__ import annotations

import io
import base64
import binascii
import os
import re
import tarfile
import time
import zipfile
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import quote, urlparse

import httpx

SourceDocument = tuple[str, str, str]

ALLOWED_SOURCE_SUFFIXES = {
    ".py",
    ".pyw",
    ".cs",
    ".csproj",
    ".xaml",
    ".xml",
    ".md",
    ".java",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".go",
    ".rs",
    ".txt",
    ".pem",
    ".yml",
    ".yaml",
    ".json",
    ".cfg",
    ".ini",
    ".toml",
}
MAX_COLLECTED_FILE_BYTES = 2 * 1024 * 1024
MAX_COLLECTED_FILES = 80
MAX_ARCHIVE_BYTES = 80 * 1024 * 1024
HTTP_TIMEOUT_SECONDS = 20.0
GITHUB_HTTP_TIMEOUT_SECONDS = 8.0
GITHUB_FILE_WORKERS = 8
PACKAGE_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_.-]{0,213}$")
GITHUB_API_ACCEPT = "application/vnd.github+json"
GITHUB_SOURCE_HINTS = (
    "crypto",
    "crypt",
    "cipher",
    "sign",
    "verify",
    "key",
    "cert",
    "tls",
    "ssl",
    "ssh",
    "jwt",
    "auth",
)


class CollectionError(RuntimeError):
    pass


def describe_http_error(error: Exception | None) -> str:
    if error is None:
        return "未知错误"
    if isinstance(error, httpx.HTTPStatusError):
        status_code = error.response.status_code
        if status_code == 404:
            return "仓库不存在、分支不可访问，或没有可采集的受支持文本源码文件"
        if status_code in {403, 429}:
            return "GitHub API 访问受限或速率限制；请稍后重试，或配置 GITHUB_TOKEN 后再扫描"
        return f"GitHub 返回 HTTP {status_code}"
    if isinstance(error, httpx.TimeoutException):
        return "连接 GitHub 超时，请稍后重试"
    if isinstance(error, httpx.ReadError):
        return "GitHub 连接中断，请稍后重试"
    return str(error)


def is_supported_source_path(path: str | Path) -> bool:
    return Path(path).suffix.lower() in ALLOWED_SOURCE_SUFFIXES


def source_priority(path: str) -> tuple[int, int, str]:
    lowered = path.lower()
    hint_score = 0 if any(hint in lowered for hint in GITHUB_SOURCE_HINTS) else 1
    suffix_score = 0 if Path(path).suffix.lower() == ".py" else 1
    return (hint_score, suffix_score, path)


def decode_github_blob(payload: dict[str, object]) -> str:
    encoding = str(payload.get("encoding", ""))
    content = str(payload.get("content", ""))
    if encoding != "base64" or not content:
        raise CollectionError("GitHub API 未返回可解码的文件内容")
    try:
        compact_content = "".join(content.split())
        data = base64.b64decode(compact_content, validate=True)
        return data.decode("utf-8-sig")
    except (binascii.Error, UnicodeDecodeError) as exc:
        raise CollectionError("GitHub API 文件内容不是可扫描的 UTF-8 文本") from exc


def get_with_retries(
    client: httpx.Client,
    url: str,
    *,
    headers: dict[str, str] | None = None,
    params: dict[str, str] | None = None,
    max_bytes: int | None = None,
    attempts: int = 3,
) -> httpx.Response:
    last_error: Exception | None = None
    for attempt in range(1, attempts + 1):
        try:
            with client.stream("GET", url, headers=headers, params=params) as response:
                response.raise_for_status()
                content_length = response.headers.get("content-length")
                if max_bytes is not None and content_length and int(content_length) > max_bytes:
                    raise CollectionError(f"远程文件超过 {max_bytes // (1024 * 1024)} MB 限制")
                chunks: list[bytes] = []
                size = 0
                for chunk in response.iter_bytes():
                    size += len(chunk)
                    if max_bytes is not None and size > max_bytes:
                        raise CollectionError(f"远程文件超过 {max_bytes // (1024 * 1024)} MB 限制")
                    chunks.append(chunk)
                content = b"".join(chunks)
                headers_copy = dict(response.headers)
                headers_copy.pop("content-encoding", None)
                headers_copy["content-length"] = str(len(content))
                return httpx.Response(
                    response.status_code,
                    headers=headers_copy,
                    content=content,
                    request=response.request,
                )
        except (httpx.HTTPError, OSError, CollectionError) as exc:
            last_error = exc
            if attempt < attempts:
                time.sleep(0.25 * attempt)
                continue
            raise exc
    raise CollectionError(f"请求失败：{last_error}")


def validate_pypi_package_name(package_name: str) -> str:
    cleaned = package_name.strip()
    if not PACKAGE_RE.fullmatch(cleaned) or ".." in cleaned or "/" in cleaned or "\\" in cleaned:
        raise ValueError("PyPI 包名只能包含字母、数字、点、下划线和短横线")
    return cleaned


def validate_github_repository_url(repository_url: str) -> str:
    parsed = urlparse(repository_url.strip())
    path_parts = [part for part in parsed.path.strip("/").split("/") if part]
    if parsed.scheme not in {"https", "http"} or parsed.netloc.lower() != "github.com":
        raise ValueError("请输入 github.com 仓库地址")
    if len(path_parts) < 2:
        raise ValueError("GitHub 仓库地址需要包含 owner/repo")
    owner, repo = path_parts[0], path_parts[1].removesuffix(".git")
    if not owner or not repo:
        raise ValueError("GitHub 仓库地址需要包含 owner/repo")
    return f"https://github.com/{owner}/{repo}"


def safe_archive_member_name(name: str) -> str:
    parts = [part for part in Path(name).parts if part not in {"", ".", ".."}]
    if len(parts) > 1:
        parts = parts[1:]
    return "/".join(parts) or Path(name).name


def collect_from_zip_bytes(data: bytes, origin: str) -> list[SourceDocument]:
    documents: list[SourceDocument] = []
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        for info in archive.infolist():
            if info.is_dir() or not is_supported_source_path(info.filename):
                continue
            if info.file_size > MAX_COLLECTED_FILE_BYTES:
                continue
            try:
                content = archive.read(info).decode("utf-8-sig")
            except UnicodeDecodeError:
                continue
            documents.append((origin, safe_archive_member_name(info.filename), content))
            if len(documents) >= MAX_COLLECTED_FILES:
                break
    return documents


def collect_from_tar_bytes(data: bytes, origin: str) -> list[SourceDocument]:
    documents: list[SourceDocument] = []
    with tarfile.open(fileobj=io.BytesIO(data), mode="r:*") as archive:
        for member in archive.getmembers():
            if not member.isfile() or not is_supported_source_path(member.name):
                continue
            if member.size > MAX_COLLECTED_FILE_BYTES:
                continue
            extracted = archive.extractfile(member)
            if extracted is None:
                continue
            try:
                content = extracted.read().decode("utf-8-sig")
            except UnicodeDecodeError:
                continue
            documents.append((origin, safe_archive_member_name(member.name), content))
            if len(documents) >= MAX_COLLECTED_FILES:
                break
    return documents


def collect_local_directory_sources(directory: Path, origin: str) -> list[SourceDocument]:
    documents: list[SourceDocument] = []
    for path in sorted(directory.rglob("*")):
        if not path.is_file() or not is_supported_source_path(path):
            continue
        if path.stat().st_size > MAX_COLLECTED_FILE_BYTES:
            continue
        try:
            content = path.read_text(encoding="utf-8-sig")
        except UnicodeDecodeError:
            continue
        documents.append((origin, path.relative_to(directory).as_posix(), content))
        if len(documents) >= MAX_COLLECTED_FILES:
            break
    return documents


def collect_github_sources(repository_url: str, max_files: int = MAX_COLLECTED_FILES) -> list[SourceDocument]:
    normalized_url = validate_github_repository_url(repository_url)
    parsed = urlparse(normalized_url)
    owner, repo = parsed.path.strip("/").split("/")[:2]
    last_error: Exception | None = None
    file_limit = max(1, min(max_files, MAX_COLLECTED_FILES))

    with httpx.Client(timeout=GITHUB_HTTP_TIMEOUT_SECONDS, follow_redirects=True, trust_env=True) as client:
        headers = {"Accept": GITHUB_API_ACCEPT}
        github_token = os.environ.get("GITHUB_TOKEN")
        if github_token:
            headers["Authorization"] = f"Bearer {github_token}"
        branch_candidates = ["main", "master"]
        try:
            repo_api = get_with_retries(
                client,
                f"https://api.github.com/repos/{owner}/{repo}",
                headers=headers,
                attempts=2,
            )
            default_branch = repo_api.json().get("default_branch")
            if default_branch:
                branch_candidates = [default_branch, *[b for b in branch_candidates if b != default_branch]]
        except (httpx.HTTPError, ValueError, CollectionError) as exc:
            last_error = exc

        for branch in branch_candidates:
            try:
                tree_response = get_with_retries(
                    client,
                    f"https://api.github.com/repos/{owner}/{repo}/git/trees/{quote(branch, safe='')}",
                    headers=headers,
                    params={"recursive": "1"},
                    attempts=2,
                )
                tree_payload = tree_response.json()
                tree_items = tree_payload.get("tree", [])
                candidates: list[dict[str, str | int]] = []
                for item in tree_items:
                    path = str(item.get("path", ""))
                    size = int(item.get("size") or 0)
                    if item.get("type") != "blob" or not is_supported_source_path(path):
                        continue
                    if size > MAX_COLLECTED_FILE_BYTES:
                        continue
                    candidates.append({
                        "path": path,
                        "size": size,
                        "blob_url": str(item.get("url", "")),
                    })

                if candidates:
                    candidates.sort(key=lambda item: source_priority(str(item["path"])))
                    documents: list[SourceDocument] = []
                    selected = candidates[:file_limit]

                    def fetch_source(item: dict[str, str | int]) -> SourceDocument | None:
                        path = str(item["path"])
                        blob_url = str(item.get("blob_url") or "")
                        with httpx.Client(
                            timeout=GITHUB_HTTP_TIMEOUT_SECONDS,
                            follow_redirects=True,
                            trust_env=True,
                        ) as file_client:
                            try:
                                if blob_url:
                                    response = get_with_retries(
                                        file_client,
                                        blob_url,
                                        headers=headers,
                                        max_bytes=MAX_COLLECTED_FILE_BYTES * 2,
                                        attempts=1,
                                    )
                                    content = decode_github_blob(response.json())
                                    return (normalized_url, path, content)
                            except (httpx.HTTPError, ValueError, CollectionError):
                                pass

                            try:
                                contents_response = get_with_retries(
                                    file_client,
                                    f"https://api.github.com/repos/{owner}/{repo}/contents/{quote(path, safe='/')}",
                                    headers=headers,
                                    params={"ref": branch},
                                    max_bytes=MAX_COLLECTED_FILE_BYTES * 2,
                                    attempts=1,
                                )
                                content = decode_github_blob(contents_response.json())
                            except (httpx.HTTPError, ValueError, CollectionError):
                                return None
                        return (normalized_url, path, content)

                    with ThreadPoolExecutor(max_workers=GITHUB_FILE_WORKERS) as executor:
                        future_map = {executor.submit(fetch_source, item): item for item in selected}
                        for future in as_completed(future_map):
                            result = future.result()
                            if result is None:
                                continue
                            documents.append(result)
                            if len(documents) >= file_limit:
                                break
                    if documents:
                        documents.sort(key=lambda item: source_priority(item[1]))
                        return documents[:file_limit]
            except (httpx.HTTPError, ValueError, CollectionError) as exc:
                last_error = exc

        archive_urls = [
            f"https://github.com/{owner}/{repo}/archive/refs/heads/{branch}.zip"
            for branch in branch_candidates
        ]
        for archive_url in archive_urls:
            try:
                response = get_with_retries(client, archive_url, max_bytes=MAX_ARCHIVE_BYTES, attempts=2)
                documents = collect_from_zip_bytes(response.content, normalized_url)[:file_limit]
                if documents:
                    return documents
            except (httpx.HTTPError, zipfile.BadZipFile, UnicodeDecodeError, CollectionError) as exc:
                last_error = exc

    raise CollectionError(f"无法采集 GitHub 仓库源码：{describe_http_error(last_error)}")


def pypi_candidate_score(item: dict[str, object]) -> tuple[int, int, str]:
    package_type = str(item.get("packagetype", ""))
    filename = str(item.get("filename", ""))
    if package_type == "sdist":
        type_score = 0
    elif filename.endswith(".whl"):
        type_score = 1
    else:
        type_score = 2
    pure_python_score = 0 if "py3-none-any.whl" in filename else 1
    return (type_score, pure_python_score, filename)


def collect_pypi_sources(package_name: str) -> list[SourceDocument]:
    normalized_name = validate_pypi_package_name(package_name)
    metadata_url = f"https://pypi.org/pypi/{normalized_name}/json"
    origin = f"pypi:{normalized_name}"
    last_error: Exception | None = None

    for trust_env in (False, True):
        try:
            with httpx.Client(
                timeout=HTTP_TIMEOUT_SECONDS,
                follow_redirects=True,
                trust_env=trust_env,
            ) as client:
                metadata = get_with_retries(client, metadata_url, attempts=3)
                payload = metadata.json()
                urls = sorted(payload.get("urls", []), key=pypi_candidate_score)
                candidates = [
                    item for item in urls
                    if item.get("url") and str(item.get("filename", "")).endswith(
                        (".zip", ".whl", ".tar.gz", ".tgz", ".tar.bz2", ".tar")
                    )
                ]
                if not candidates:
                    raise CollectionError("PyPI 包没有可下载的源码包或 wheel")

                for candidate in candidates:
                    filename = str(candidate.get("filename", ""))
                    try:
                        archive = get_with_retries(
                            client,
                            str(candidate["url"]),
                            max_bytes=MAX_ARCHIVE_BYTES,
                            attempts=3,
                        )
                        if filename.endswith((".zip", ".whl")):
                            documents = collect_from_zip_bytes(archive.content, origin)
                        elif filename.endswith((".tar.gz", ".tgz", ".tar.bz2", ".tar")):
                            documents = collect_from_tar_bytes(archive.content, origin)
                        else:
                            documents = []
                        if documents:
                            return documents
                    except (
                        httpx.HTTPError,
                        tarfile.TarError,
                        zipfile.BadZipFile,
                        UnicodeDecodeError,
                        CollectionError,
                    ) as exc:
                        last_error = exc
                        continue
        except (httpx.HTTPError, ValueError, CollectionError) as exc:
            last_error = exc
            continue

    raise CollectionError(f"无法采集 PyPI 包：{last_error}")
