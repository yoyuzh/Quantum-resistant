"""Public collector facade."""
from __future__ import annotations

import re
from pathlib import Path
from urllib.parse import urlparse

from backend.collection_common import CollectionError, CollectionTimeout, CollectedSources, Deadline, SourceDocument, get_with_retries
from backend.collection_config import *


def is_supported_source_path(path: str | Path) -> bool:
    return Path(path).suffix.lower() in ALLOWED_SOURCE_SUFFIXES


def validate_pypi_package_name(package_name: str) -> str:
    cleaned = package_name.strip()
    if not PACKAGE_RE.fullmatch(cleaned) or ".." in cleaned:
        raise ValueError("PyPI 包名只能包含字母、数字、点、下划线和短横线")
    return cleaned


def validate_github_repository_url(repository_url: str) -> str:
    parsed = urlparse(repository_url.strip())
    parts = parsed.path.strip("/").split("/")
    if parsed.scheme not in {"http", "https"} or parsed.netloc.lower() != "github.com" or len(parts) < 2:
        raise ValueError("请输入包含 owner/repo 的 github.com 仓库地址")
    owner, repo = parts[0], parts[1].removesuffix(".git")
    if not re.fullmatch(r"[A-Za-z0-9_.-]+", owner) or not re.fullmatch(r"[A-Za-z0-9_.-]+", repo) or owner in {".", ".."} or repo in {".", ".."}:
        raise ValueError("GitHub 仓库名称格式不正确")
    return f"https://github.com/{owner}/{repo}"


def source_priority(path: str) -> tuple[int, int, str]:
    lowered = path.lower()
    return (0 if any(hint in lowered for hint in GITHUB_SOURCE_HINTS) else 1,
            0 if Path(path).suffix.lower() == ".py" else 1, path)


def collect_github_sources(repository_url: str, max_files: int = MAX_COLLECTED_FILES, *, deadline: Deadline | None = None) -> CollectedSources:
    from backend.remote_sources import github_sources
    return github_sources(validate_github_repository_url(repository_url), max_files, deadline or Deadline.after())


def collect_pypi_sources(package_name: str, *, deadline: Deadline | None = None) -> CollectedSources:
    from backend.remote_sources import pypi_sources
    return pypi_sources(validate_pypi_package_name(package_name), deadline or Deadline.after())


from backend.archives import collect_from_zip_bytes, collect_from_tar_bytes, safe_archive_member_name


def collect_local_directory_sources(directory: Path, origin: str) -> CollectedSources:
    documents = []
    candidates = [p for p in sorted(directory.rglob("*")) if p.is_file() and is_supported_source_path(p)]
    for path in candidates:
        if len(documents) >= MAX_COLLECTED_FILES:
            break
        if path.stat().st_size > MAX_COLLECTED_FILE_BYTES:
            continue
        try:
            content = path.read_text(encoding="utf-8-sig")
        except (UnicodeError, OSError):
            continue
        documents.append((origin, path.relative_to(directory).as_posix(), content))
    return CollectedSources(documents, candidates=len(candidates), skipped=len(candidates) - len(documents), partial=len(documents) < len(candidates))
