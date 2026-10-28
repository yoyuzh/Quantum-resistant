"""Portable logical paths; never interpret source names as host paths."""
from __future__ import annotations

import re
import unicodedata


def safe_path(value: str) -> str:
    path = unicodedata.normalize("NFC", value)
    parts = path.split("/")
    if (not path or len(path.encode("utf-8")) > 512 or len(parts) > 20
            or "\\" in path or ":" in path or any(unicodedata.category(c).startswith("C") for c in path)):
        raise ValueError("路径格式或长度不安全")
    for part in parts:
        stem = part.split(".")[0].rstrip(' ').upper()
        if (part in ("", ".", "..") or part.endswith((".", " "))
                or any(c in part for c in '<>"|?*')
                or re.fullmatch(r"CON|PRN|AUX|NUL|COM[1-9¹²³]|LPT[1-9¹²³]", stem)):
            raise ValueError("路径含空段、点段或平台不安全名称")
    return path


def validate_paths(values: list[str]) -> tuple[str, ...]:
    paths = tuple(safe_path(value) for value in values)
    keys: set[str] = set()
    for path in paths:
        key = path.casefold()
        if key in keys:
            raise ValueError("路径存在大小写或Unicode等价冲突")
        keys.add(key)
    for key in keys:
        parts = key.split("/")
        if any("/".join(parts[:i]) in keys for i in range(1, len(parts))):
            raise ValueError("路径存在文件与目录冲突")
    return paths
