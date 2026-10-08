"""Validate desktop release identity and assets; never publish or execute samples."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]
VERSION = re.compile(r"(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)(?:-(?:alpha|beta|rc)\.(?:0|[1-9][0-9]*))?")


TARGET_SUFFIXES = {
    "windows-x64": "win-x64.exe",
    "linux-x64": "linux-amd64.deb",
    "macos-x64": "mac-x64.dmg",
    "macos-arm64": "mac-arm64.dmg",
}


def installer_name(version: str, target: str) -> str:
    if target not in TARGET_SUFFIXES:
        raise ValueError("不支持的桌面发布目标")
    return f"Quantum-Scanner-{version}-{TARGET_SUFFIXES[target]}"


def validate_version(tag: str, manifest: dict, lock: dict) -> str:
    version = manifest.get("version")
    if not isinstance(version, str) or VERSION.fullmatch(version) is None:
        raise ValueError("桌面版本号必须为 x.y.z 或 x.y.z-alpha/beta/rc.n")
    if tag != f"desktop-v{version}":
        raise ValueError("标签必须与 desktop/package.json 版本一致：desktop-v" + version)
    if lock.get("version") != version or lock.get("packages", {}).get("", {}).get("version") != version:
        raise ValueError("desktop/package-lock.json 版本与 package.json 不一致")
    return version


def git_output(root: Path, *args: str) -> str:
    return subprocess.check_output(["git", *args], cwd=root, text=True).strip()


def release_identity(root: Path, tag: str, expected_sha: str | None = None,
                     target: str = "windows-x64") -> dict[str, str]:
    desktop = root / "desktop"
    version = validate_version(
        tag,
        json.loads((desktop / "package.json").read_text(encoding="utf-8")),
        json.loads((desktop / "package-lock.json").read_text(encoding="utf-8")),
    )
    sha = git_output(root, "rev-parse", "HEAD")
    tag_sha = git_output(root, "rev-parse", "--verify", f"refs/tags/{tag}^{{commit}}")
    if re.fullmatch(r"[0-9a-f]{40}", sha) is None or tag_sha != sha:
        raise ValueError("checkout 必须为指定版本标签的确切提交")
    if expected_sha is not None and expected_sha != sha:
        raise ValueError("构建提交与 CI 检查提交不一致")
    return {"tag": tag, "version": version, "sha": sha, "target": target,
            "installer": installer_name(version, target)}


def verify_installer(directory: Path, installer: str) -> str:
    if Path(installer).name != installer or "\\" in installer:
        raise ValueError("安装包名称必须为文件名")
    path = directory / installer
    if not path.is_file() or path.stat().st_size < 2:
        raise ValueError("安装包不存在或为空")
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        if path.suffix == ".exe":
            valid = stream.read(2) == b"MZ"
        elif path.suffix == ".deb":
            valid = stream.read(8) == b"!<arch>\n"
        elif path.suffix == ".dmg" and path.stat().st_size >= 512:
            stream.seek(-512, os.SEEK_END)
            valid = stream.read(4) == b"koly"
        else:
            valid = False
        if not valid:
            raise ValueError("安装包格式与目标扩展名不一致")
        stream.seek(0)
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    checksum = digest.hexdigest()
    lines = (directory / "SHA256SUMS.txt").read_text(encoding="utf-8").splitlines()
    if lines != [f"{checksum}  {installer}"]:
        raise ValueError("SHA256SUMS.txt 与待发布安装包不一致")
    return checksum


def write_release_files(root: Path, identity: dict[str, str], checksum: str) -> None:
    directory = root / "desktop" / "release"
    information = {
        **identity, "sha256": checksum, "target": identity.get("target", "windows-x64"), "signed": False,
        "python_version": sys.version.split()[0],
        "node_version": subprocess.check_output(["node", "--version"], text=True).strip(),
        "workflow_run_id": os.environ.get("GITHUB_RUN_ID"),
    }
    (directory / "BUILD-INFO.json").write_text(
        json.dumps(information, ensure_ascii=False, indent=2) + "\n", encoding="utf-8",
    )
    notes = (
        f"{information['target']} 桌面测试版 {identity['version']}\n\n"
        "包含安装包、SHA256SUMS.txt 和 BUILD-INFO.json。\n"
        f"源码提交：`{identity['sha']}`。\n\n"
        "该提交已通过 Windows/Linux CI 检查；打包后的 Python 后端已通过离线冒烟检查。\n"
        "安装程序尚未代码签名，本次发布为预发布版本。自动检查不代表安装后桌面交互已实机验收。\n"
        "安装后无需另行安装 Python、Node.js 或 WebView2。\n"
        "可用 PowerShell 的 Get-FileHash -Algorithm SHA256 校验下载文件；校验值不证明发布者身份。\n"
    )
    (directory / "RELEASE-NOTES.md").write_text(notes, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("stage", choices=("prepare", "verify"))
    parser.add_argument("--tag", default=os.environ.get("RELEASE_TAG", ""))
    parser.add_argument("--sha", default=os.environ.get("RELEASE_SHA"))
    parser.add_argument("--target", choices=tuple(TARGET_SUFFIXES),
                        default=os.environ.get("RELEASE_TARGET", "windows-x64"))
    args = parser.parse_args()
    if args.stage == "verify" and not args.sha:
        parser.error("verify 必须指定 CI 已检查的提交 SHA")
    identity = release_identity(ROOT, args.tag, args.sha, args.target)
    if args.stage == "verify":
        checksum = verify_installer(ROOT / "desktop" / "release", identity["installer"])
        write_release_files(ROOT, identity, checksum)
    elif output := os.environ.get("GITHUB_OUTPUT"):
        with Path(output).open("a", encoding="utf-8") as stream:
            for key, value in identity.items():
                stream.write(f"{key}={value}\n")
    print(json.dumps(identity, ensure_ascii=False))


if __name__ == "__main__":
    main()
