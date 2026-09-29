from __future__ import annotations

import json
import os
import tempfile
from dataclasses import asdict
from pathlib import Path


def write_results(result, output_path: Path) -> None:
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    content = json.dumps(asdict(result), indent=2, ensure_ascii=False)
    fd, name = tempfile.mkstemp(dir=output_path.parent, prefix=".popular_", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as stream:
            fd = None
            stream.write(content)
        os.replace(name, output_path)
    finally:
        if fd is not None:
            os.close(fd)
        if os.path.exists(name):
            os.unlink(name)
