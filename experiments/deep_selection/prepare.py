"""Explicit online acquisition of pinned tool sources, separate from regression tests."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import httpx


def prepare(destination: Path) -> None:
    lock = json.loads(Path(__file__).with_name("sources.lock.json").read_text(encoding="utf-8"))
    with httpx.Client(timeout=20, follow_redirects=False) as client:
        for entry in lock:
            relative = Path(entry["tool"]) / entry["path"]
            if relative.is_absolute() or ".." in relative.parts:
                raise ValueError("非法工具源码路径")
            target = destination / relative
            if target.exists() and hashlib.sha256(target.read_bytes()).hexdigest() == entry["sha256"]:
                continue
            response = None
            for attempt in range(3):
                try:
                    response = client.get(entry["url"])
                    response.raise_for_status()
                    break
                except httpx.HTTPError:
                    if attempt == 2:
                        raise
            data = response.content
            if len(data) != entry["size"] or hashlib.sha256(data).hexdigest() != entry["sha256"]:
                raise ValueError("上游工具摘要/大小不符")
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--destination", type=Path, default=Path("tmp/deep-selection/sources"))
    prepare(parser.parse_args().destination)
