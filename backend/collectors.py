from __future__ import annotations

import io
import re
import tarfile
import tempfile
import zipfile
from pathlib import Path
from urllib.parse import urlparse

import httpx

SourceDocument = tuple[str, str, str]

ALLOWED_SOURCE_SUFFIXES = {
    ".py",
    ".pyw",
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
HTTP_TIMEOUT_SECONDS = 20.0
PACKAGE_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_.-]{0,213}$")


class CollectionError(RuntimeError):
    pass


def is_supported_source_path(path: str | Path) -> bool:
    return Path(path).suffix.lower() in ALLOWED_SOURCE_SUFFIXES


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


def collect_github_sources(repository_url: str) -> list[SourceDocument]:
    normalized_url = validate_github_repository_url(repository_url)
    parsed = urlparse(normalized_url)
    owner, repo = parsed.path.strip("/").split("/")[:2]
    archive_urls = [
        f"https://github.com/{owner}/{repo}/archive/refs/heads/main.zip",
        f"https://github.com/{owner}/{repo}/archive/refs/heads/master.zip",
    ]

    last_error: Exception | None = None
    with httpx.Client(timeout=HTTP_TIMEOUT_SECONDS, follow_redirects=True) as client:
        for archive_url in archive_urls:
            try:
                response = client.get(archive_url)
                response.raise_for_status()
                documents = collect_from_zip_bytes(response.content, normalized_url)
                if documents:
                    return documents
            except (httpx.HTTPError, zipfile.BadZipFile, UnicodeDecodeError) as exc:
                last_error = exc

    raise CollectionError(f"无法采集 GitHub 仓库源码：{last_error}")


def collect_pypi_sources(package_name: str) -> list[SourceDocument]:
    normalized_name = validate_pypi_package_name(package_name)
    metadata_url = f"https://pypi.org/pypi/{normalized_name}/json"
    origin = f"pypi:{normalized_name}"

    try:
        with httpx.Client(timeout=HTTP_TIMEOUT_SECONDS, follow_redirects=True) as client:
            metadata = client.get(metadata_url)
            metadata.raise_for_status()
            payload = metadata.json()
            urls = payload.get("urls", [])
            source_dist = next((item for item in urls if item.get("packagetype") == "sdist"), None)
            if source_dist is None:
                source_dist = next((item for item in urls if str(item.get("filename", "")).endswith(".whl")), None)
            if source_dist is None or not source_dist.get("url"):
                raise CollectionError("PyPI 包没有可下载的源码包或 wheel")
            archive = client.get(str(source_dist["url"]))
            archive.raise_for_status()
    except httpx.HTTPError as exc:
        raise CollectionError(f"无法采集 PyPI 包：{exc}") from exc

    filename = str(source_dist.get("filename", ""))
    try:
        if filename.endswith(".zip") or filename.endswith(".whl"):
            return collect_from_zip_bytes(archive.content, origin)
        if filename.endswith((".tar.gz", ".tgz", ".tar.bz2", ".tar")):
            return collect_from_tar_bytes(archive.content, origin)
    except (tarfile.TarError, zipfile.BadZipFile, UnicodeDecodeError) as exc:
        raise CollectionError(f"无法解析 PyPI 包源码：{exc}") from exc

    with tempfile.TemporaryDirectory() as tmp_dir:
        archive_path = Path(tmp_dir) / filename
        archive_path.write_bytes(archive.content)
        return collect_local_directory_sources(archive_path.parent, origin)
