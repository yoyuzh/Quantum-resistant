from __future__ import annotations

import re

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
