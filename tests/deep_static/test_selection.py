"""Offline regression of the experiment boundary, without candidate installation."""
from __future__ import annotations

import hashlib
from pathlib import Path
import sys
import tempfile
import time
import unittest
from unittest.mock import patch

from deep_analysis.inputs import LogicalInput
from experiments.deep_selection.runner import file_view, run_one, safe_paths, view_digests
from tests.deep_static.corpus import load_cases


class MaterializationTests(unittest.TestCase):
    def setUp(self):
        self.inputs = load_cases()[0].inputs

    def paths(self, *paths):
        source = self.inputs.sources[0]
        return LogicalInput(sources=tuple(source.model_copy(update={
            "identity": source.identity.model_copy(update={"relative_path": path, "source_id": str(index)})
        }) for index, path in enumerate(paths)))

    def test_reject_path_escape_and_platform_aliases(self):
        for path in ("../escape.py", "/root.py", "C:/a.py", "a\\b.py", "a//b.py",
                     "a/./b.py", "a/../b.py", "CON.py", "x/NUL.txt", "a. /b.py", "a\x00.py"):
            with self.subTest(path=path), self.assertRaises(ValueError):
                safe_paths(self.paths(path))

    def test_reject_collisions(self):
        for paths in (("A.py", "a.py"), ("e\u0301.py", "é.py"), ("a", "a/b.py")):
            with self.subTest(paths=paths), self.assertRaises(ValueError):
                safe_paths(self.paths(*paths))

    def test_exact_bytes_readonly_and_cleanup_on_error(self):
        with self.assertRaisesRegex(RuntimeError, "injected"):
            with file_view(self.inputs) as (view, scratch, outside):
                home = view.parent
                self.assertEqual(len(view_digests(view)), len(self.inputs.sources))
                for source in self.inputs.sources:
                    target = view / source.identity.relative_path
                    self.assertEqual(target.read_bytes(), source.content.encode())
                    self.assertEqual(hashlib.sha256(target.read_bytes()).hexdigest(), source.identity.sha256)
                    self.assertEqual(target.stat().st_mode & 0o222, 0)
                raise RuntimeError("injected")
        self.assertFalse(home.exists())

    def test_detect_link_in_view(self):
        with file_view(self.inputs) as (view, scratch, outside):
            view.chmod(0o700)
            (view / "link.py").symlink_to(outside)
            with self.assertRaisesRegex(ValueError, "链接"):
                view_digests(view)

    def test_tool_digest_is_checked_before_import(self):
        from experiments.deep_selection.runner import verify_tools
        data = b"# trusted tool bytes\n"
        entry = {"tool": "candidate", "path": "core.py", "size": len(data),
                 "sha256": hashlib.sha256(data).hexdigest()}
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            target = root / "candidate/core.py"
            target.parent.mkdir()
            target.write_bytes(data)
            with patch("experiments.deep_selection.runner.json.loads", return_value=[entry]):
                verify_tools(root)
                target.write_bytes(b"# tampered\n")
                with self.assertRaisesRegex(ValueError, "摘要"):
                    verify_tools(root)


@unittest.skipUnless(sys.platform == "darwin" and Path("/usr/bin/sandbox-exec").exists(),
                     "requires verified macOS sandbox; never run unisolated")
class SandboxTests(unittest.TestCase):
    def setUp(self):
        self.inputs = load_cases()[0].inputs
        self.temporary = tempfile.TemporaryDirectory(prefix="quantum-empty-tools-")
        self.addCleanup(self.temporary.cleanup)
        self.empty = Path(self.temporary.name)
        self.created = []
        original = tempfile.TemporaryDirectory
        def record(*args, **kwargs):
            result = original(*args, **kwargs)
            self.created.append(Path(result.name))
            return result
        self.patcher = patch("experiments.deep_selection.runner.tempfile.TemporaryDirectory", record)
        self.patcher.start()
        self.addCleanup(self.patcher.stop)

    def run_mode(self, mode, **kwargs):
        result = run_one(self.inputs, mode, self.empty, self.empty, **kwargs)
        self.assertTrue(all(not path.exists() for path in self.created))
        self.assertTrue(result["source_unchanged"])
        if result.get("worker_started") is not False:
            self.assertTrue(result["worker_reaped"])
        return result

    def test_real_os_denials_and_scratch_allowance(self):
        result = self.run_mode("probe")
        self.assertEqual(result["state"], "completed", result.get("error"))
        facts = result["facts"]["facts"]
        self.assertEqual(facts.pop("scratch_write"), "allowed")
        self.assertEqual(set(facts.values()), {"denied"})
        self.assertEqual(len(facts), 9)

    def test_ast_without_tool_or_target_dependencies(self):
        result = self.run_mode("ast")
        self.assertEqual(result["state"], "completed", result.get("error"))
        self.assertEqual(result["facts"]["facts"]["failures"], [])
        self.assertTrue(result["facts"]["facts"]["calls"])
        self.assertEqual(result["facts"]["blocked"], [])

    def test_cancel_before_spawn(self):
        result = self.run_mode("stall", cancelled=lambda: True)
        self.assertEqual(result["state"], "cancelled")
        self.assertFalse(result["worker_started"])

    def test_running_cancel_kills_and_reaps(self):
        started = time.monotonic()
        result = self.run_mode("stall", cancelled=lambda: time.monotonic() - started > .15)
        self.assertEqual(result["state"], "cancelled")
        self.assertLess(result["returncode"], 0)

    def test_deadline_kills_and_reaps(self):
        result = self.run_mode("stall", seconds=.15)
        self.assertEqual(result["state"], "timeout")
        self.assertLess(result["returncode"], 0)

    def test_candidate_absence_fails_closed(self):
        result = self.run_mode("scalpel")
        self.assertEqual(result["state"], "failed")
        self.assertIn("ModuleNotFoundError", result["error"])


if __name__ == "__main__":
    unittest.main()
