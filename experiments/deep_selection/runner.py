"""Bounded, macOS-sandboxed common-input experiments, not production adapters."""
from __future__ import annotations

import argparse
from contextlib import contextmanager
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import signal
import subprocess
import sys
import sysconfig
import tempfile
import time
import unicodedata
from typing import Callable, Iterator

from deep_analysis.identity import content_digest
from deep_analysis.inputs import LogicalInput
from tests.deep_static.corpus import load_cases

ROOT = Path(__file__).resolve().parents[2]
WORKER = Path(__file__).with_name("worker.py").resolve()


def safe_paths(inputs: LogicalInput) -> tuple[str, ...]:
    """Small experiment boundary. The production protocol is a later task."""
    result, keys = [], set()
    devices = {"con", "prn", "aux", "nul", *(f"com{i}" for i in range(1, 10)), *(f"lpt{i}" for i in range(1, 10))}
    for source in inputs.sources:
        path = unicodedata.normalize("NFC", source.identity.relative_path)
        parts = path.split("/")
        if (PurePosixPath(path).is_absolute() or "\\" in path or ":" in path or
                len(parts) > 20 or len(path.encode()) > 512 or
                any(part in ("", ".", "..") or part.endswith((".", " ")) or
                    part.split(".")[0].casefold() in devices for part in parts) or
                any(unicodedata.category(char).startswith("C") for char in path)):
            raise ValueError("非法实验相对路径")
        key = path.casefold()
        if key in keys or any(key.startswith(old + "/") or old.startswith(key + "/") for old in keys):
            raise ValueError("实验路径冲突")
        result.append(path)
        keys.add(key)
    return tuple(result)


def view_digests(root: Path) -> dict:
    result = {}
    for path in root.rglob("*"):
        if path.is_symlink():
            raise ValueError("实验视图出现链接")
        if path.is_file():
            result[path.relative_to(root).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
    return result


def verify_tools(vendor: Path) -> None:
    """Check pinned upstream bytes before importing any downloaded tool."""
    lock = json.loads(Path(__file__).with_name("sources.lock.json").read_text())
    for entry in lock:
        path = vendor / entry["tool"] / entry["path"]
        if not path.resolve().is_relative_to(vendor.resolve()) or path.is_symlink():
            raise ValueError("工具源码路径越界")
        data = path.read_bytes()
        if len(data) != entry["size"] or hashlib.sha256(data).hexdigest() != entry["sha256"]:
            raise ValueError("工具源码与锁定摘要不符")


@contextmanager
def file_view(inputs: LogicalInput) -> Iterator[tuple[Path, Path, Path]]:
    paths = safe_paths(inputs)
    with tempfile.TemporaryDirectory(prefix="quantum-engine-experiment-") as temporary:
        home = Path(temporary).resolve()
        view, scratch, outside = home / "input", home / "scratch", home / "outside-marker"
        view.mkdir(mode=0o700)
        scratch.mkdir(mode=0o700)
        outside.write_text("outside-sentinel", encoding="utf-8")
        manifest = []
        for source, relative in zip(inputs.sources, paths):
            target = view / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            with target.open("xb") as stream:
                stream.write(source.content.encode("utf-8"))
            if content_digest(source.content) != hashlib.sha256(target.read_bytes()).hexdigest():
                raise ValueError("物化摘要不一致")
            target.chmod(0o400)
            manifest.append(source.identity.model_dump(mode="json") | {"relative_path": relative})
        (scratch / "manifest.json").write_text(json.dumps(manifest), encoding="utf-8")
        for directory in sorted((p for p in view.rglob("*") if p.is_dir()), reverse=True):
            directory.chmod(0o500)
        view.chmod(0o500)
        try:
            yield view, scratch, outside
        finally:
            # Reap workers before entering here. Restore only directories created
            # in our private view; scratch links are unlinked by rmtree, not followed.
            view.chmod(0o700)
            for directory in view.rglob("*"):
                if directory.is_dir() and not directory.is_symlink():
                    directory.chmod(0o700)


def python_executable() -> Path:
    """Bypass the Homebrew launcher that would need a second process exec."""
    app = Path(sys.base_prefix) / "Resources/Python.app/Contents/MacOS/Python"
    return app.resolve() if app.is_file() else Path(sys.executable).resolve()


def sandbox_profile(view: Path, scratch: Path, vendor: Path, dependencies: Path) -> str:
    # OS runtime reads are necessary for the interpreter and dynamic loader.
    # Target module resolution never receives these paths as project roots.
    roots = {Path(sys.base_prefix).resolve(), Path(sysconfig.get_path("stdlib")).resolve(),
             Path("/System/Library"), Path("/usr/lib"), view, scratch, vendor, dependencies}
    readable = " ".join(f"(subpath {json.dumps(str(path), ensure_ascii=False)})" for path in sorted(roots))
    executable = str(python_executable())
    return ("(version 1)(allow default)(deny network*)(deny file-read* file-write*)"
            "(allow file-read-metadata)"
            f"(allow file-read* {readable} (literal {json.dumps(str(WORKER), ensure_ascii=False)}) (literal \"/dev/null\") (literal \"/\"))"
            f"(allow file-write* (subpath {json.dumps(str(scratch))}) (literal \"/dev/null\"))"
            "(deny process-fork)(deny process-exec)"
            f"(allow process-exec (literal {json.dumps(executable)}))")


def stop(process: subprocess.Popen) -> None:
    try:
        os.killpg(process.pid, signal.SIGKILL)
    except ProcessLookupError:
        pass
    process.wait(timeout=3)


def run_one(inputs: LogicalInput, mode: str, vendor: Path, dependencies: Path, *,
            seconds: float = 5, cancelled: Callable[[], bool] = lambda: False) -> dict:
    if mode not in ("ast", "scalpel", "codegraph", "codegraph_readonly", "probe", "stall"):
        raise ValueError("未知实验模式")
    if sys.platform != "darwin" or not Path("/usr/bin/sandbox-exec").exists():
        raise RuntimeError("没有已核验OS沙箱，拒绝无隔离执行候选工具")
    if not 0 < seconds <= 120:
        raise ValueError("实验截止必须在0至120秒内")
    vendor, dependencies = vendor.resolve(), dependencies.resolve()
    before_inputs = inputs.model_dump_json()
    with file_view(inputs) as (view, scratch, outside):
        before = view_digests(view)
        profile = sandbox_profile(view, scratch, vendor, dependencies)
        argv = ["/usr/bin/sandbox-exec", "-p", profile, str(python_executable()), "-I", "-S", "-B",
                str(WORKER), mode, str(view), str(scratch), str(vendor), str(dependencies), str(outside)]
        state = "completed"
        process = None
        try:
            with (scratch / "stdout").open("wb") as output, (scratch / "stderr").open("wb") as errors:
                if cancelled():
                    return {"state": "cancelled", "worker_started": False, "source_unchanged": True}
                process = subprocess.Popen(argv, cwd=scratch, stdin=subprocess.DEVNULL, stdout=output,
                                           stderr=errors, env={"PATH": "/usr/bin:/bin", "LANG": "C.UTF-8"}, start_new_session=True)
                started = time.monotonic()
                while process.poll() is None:
                    if cancelled():
                        state = "cancelled"
                        stop(process)
                        break
                    if time.monotonic() - started >= seconds:
                        state = "timeout"
                        stop(process)
                        break
                    size = sum(p.stat().st_size for p in scratch.rglob("*") if p.is_file() and not p.is_symlink())
                    if size > 16 * 1024 * 1024:
                        state = "disk_limit"
                        stop(process)
                        break
                    try:
                        process.wait(timeout=.02)
                    except subprocess.TimeoutExpired:
                        pass
            if process.returncode and state == "completed":
                state = "failed"
            raw = (scratch / "stdout").read_text(encoding="utf-8")
            stderr = (scratch / "stderr").read_text(encoding="utf-8")
            payload = json.loads(raw) if state == "completed" else None
            if before != view_digests(view) or before_inputs != inputs.model_dump_json():
                raise ValueError("工具修改了输入快照")
            if outside.read_text() != "outside-sentinel":
                raise ValueError("工具修改了视图外标记")
            return {"state": state, "returncode": process.returncode, "worker_reaped": process.poll() is not None,
                    "source_unchanged": True, "outside_unchanged": True, "facts": payload,
                    "error": stderr[-4000:] if state == "failed" else None,
                    "materialized_bytes": sum(source.identity.size_bytes for source in inputs.sources)}
        finally:
            if process is not None and process.poll() is None:
                stop(process)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--vendor", type=Path, default=ROOT / "tmp/deep-selection/sources")
    parser.add_argument("--dependencies", type=Path,
                        default=ROOT / "tmp/deep-selection/venv/lib/python3.14/site-packages")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--case")
    arguments = parser.parse_args()
    verify_tools(arguments.vendor)
    rows = []
    for case in load_cases():
        if arguments.case and arguments.case != case.case_id:
            continue
        expected = {json.dumps(item.sink.model_dump(), sort_keys=True) for item in case.expected.operations}
        for mode in ("ast", "scalpel", "codegraph", "codegraph_readonly"):
            row = run_one(case.inputs, mode, arguments.vendor, arguments.dependencies)
            facts = ((row.get("facts") or {}).get("facts") or {})
            actual = {json.dumps(span, sort_keys=True) for span in facts.get("calls", []) if span is not None}
            row.update(case_id=case.case_id, mode=mode,
                       source_map={source.identity.source_id: source.identity.relative_path for source in case.inputs.sources},
                       gold_sink_locations=len(expected), retained_gold_sink_locations=len(expected & actual),
                       operation_metrics=None, reason="工具原生结构事实不是密码操作预测，不据此伪造端到端成绩")
            rows.append(row)
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps({"schema_version": "engine-selection-1", "rows": rows},
                                           ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
