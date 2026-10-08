from __future__ import annotations

import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

from scripts.desktop_release import installer_name, release_identity, validate_version, verify_installer, write_release_files


class DesktopReleaseTests(unittest.TestCase):
    def setUp(self) -> None:
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.desktop = self.root / "desktop"
        self.desktop.mkdir()
        self.version = "0.1.1"
        self.tag = "desktop-v0.1.1"
        self.manifest = {"version": self.version}
        self.lock = {"version": self.version, "packages": {"": self.manifest}}
        for name, data in [("package.json", self.manifest), ("package-lock.json", self.lock)]:
            (self.desktop / name).write_text(json.dumps(data), encoding="utf-8")

    def test_version_mismatch_and_untrusted_tag_are_rejected(self) -> None:
        self.assertEqual(validate_version(self.tag, self.manifest, self.lock), self.version)
        for tag in ["main", "desktop-v0.1.0", "desktop-v0.1.1\nsha=evil", "--help"]:
            with self.subTest(tag=tag), self.assertRaises(ValueError):
                validate_version(tag, self.manifest, self.lock)
        with self.assertRaises(ValueError):
            validate_version(self.tag, self.manifest, {**self.lock, "version": "0.1.0"})
        with self.assertRaises(ValueError):
            validate_version(self.tag, self.manifest, {"version": self.version, "packages": {}})

    def test_lightweight_and_annotated_tags_resolve_to_exact_commit(self) -> None:
        def git(*args: str) -> str:
            return subprocess.check_output(["git", *args], cwd=self.root, text=True).strip()
        git("init", "--quiet")
        git("config", "user.name", "Release Test")
        git("config", "user.email", "release@example.invalid")
        git("add", "desktop")
        git("-c", "commit.gpgsign=false", "commit", "--quiet", "-m", "fixture")
        sha = git("rev-parse", "HEAD")
        git("-c", "tag.gpgsign=false", "tag", self.tag)
        self.assertEqual(release_identity(self.root, self.tag, sha)["sha"], sha)
        git("tag", "-d", self.tag)
        git("-c", "tag.gpgsign=false", "tag", "-a", self.tag, "-m", "fixture")
        self.assertEqual(release_identity(self.root, self.tag, sha)["sha"], sha)
        with self.assertRaises(ValueError):
            release_identity(self.root, self.tag, "0" * 40)
        (self.root / "changed.txt").write_text("new commit", encoding="utf-8")
        git("add", "changed.txt")
        git("-c", "commit.gpgsign=false", "commit", "--quiet", "-m", "next fixture")
        with self.assertRaises(ValueError):
            release_identity(self.root, self.tag)

    def test_tampered_or_missing_installer_blocks_delivery(self) -> None:
        directory = self.desktop / "release"
        directory.mkdir()
        name = f"Quantum-Scanner-{self.version}-win-x64.exe"
        content = b"MZ" + b"offline fixture"
        digest = hashlib.sha256(content).hexdigest()
        (directory / name).write_bytes(content)
        (directory / "SHA256SUMS.txt").write_text(f"{digest}  {name}\n", encoding="utf-8")
        self.assertEqual(verify_installer(directory, name), digest)
        (directory / name).write_bytes(content + b"tampered")
        with self.assertRaises(ValueError):
            verify_installer(directory, name)
        (directory / name).write_bytes(b"not an executable")
        with self.assertRaises(ValueError):
            verify_installer(directory, name)
        (directory / name).unlink()
        with self.assertRaises(ValueError):
            verify_installer(directory, name)

    def test_all_native_formats_and_target_names(self) -> None:
        directory = self.desktop / "release"
        directory.mkdir()
        samples = {
            "windows-x64": ("win-x64.exe", b"MZfixture"),
            "linux-x64": ("linux-amd64.deb", b"!<arch>\nfixture"),
            "macos-x64": ("mac-x64.dmg", b"fixture" + b"koly" + bytes(508)),
            "macos-arm64": ("mac-arm64.dmg", b"fixture" + b"koly" + bytes(508)),
        }
        for target, (suffix, content) in samples.items():
            with self.subTest(target=target):
                name = installer_name(self.version, target)
                self.assertEqual(name, f"Quantum-Scanner-{self.version}-{suffix}")
                checksum = hashlib.sha256(content).hexdigest()
                (directory / name).write_bytes(content)
                (directory / "SHA256SUMS.txt").write_text(f"{checksum}  {name}\n", encoding="utf-8")
                self.assertEqual(verify_installer(directory, name), checksum)
                identity = {"tag": self.tag, "version": self.version, "sha": "a" * 40,
                            "installer": name, "target": target}
                with patch("scripts.desktop_release.subprocess.check_output", return_value="v24.0.0"):
                    write_release_files(self.root, identity, checksum)
                information = json.loads((directory / "BUILD-INFO.json").read_text())
                self.assertEqual(information["target"], target)
                self.assertEqual(information["installer"], name)
                (directory / name).write_bytes(b"invalid format")
                with self.assertRaises(ValueError):
                    verify_installer(directory, name)
        with self.assertRaises(ValueError):
            installer_name(self.version, "macos-universal")
        with self.assertRaises(ValueError):
            verify_installer(directory, "../outside.exe")

    def test_build_information_preserves_identity_and_unsigned_notice(self) -> None:
        (self.desktop / "release").mkdir()
        identity = {"tag": self.tag, "version": self.version, "sha": "a" * 40,
                    "installer": f"Quantum-Scanner-{self.version}-win-x64.exe"}
        with patch("scripts.desktop_release.subprocess.check_output", return_value="v24.0.0\n"):
            write_release_files(self.root, identity, "b" * 64)
        info = json.loads((self.desktop / "release" / "BUILD-INFO.json").read_text(encoding="utf-8"))
        self.assertEqual(info["sha"], identity["sha"])
        self.assertEqual(info["sha256"], "b" * 64)
        self.assertFalse(info["signed"])
        notes = (self.desktop / "release" / "RELEASE-NOTES.md").read_text(encoding="utf-8")
        self.assertIn("预发布", notes)
        self.assertIn("不代表安装后桌面交互已实机验收", notes)


if __name__ == "__main__":
    unittest.main()
