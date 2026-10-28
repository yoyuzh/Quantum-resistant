"""Reproduce the pinned engine, changing absolute package imports only."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
COMMIT = 'd8e07c903d5cd15e19142613491bb7dbae69699d'


def main() -> None:
    names = subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', COMMIT, 'deep_analysis', 'scanner'], cwd=ROOT).decode().splitlines()
    records = {}
    for name in names:
        raw = subprocess.check_output(['git', 'show', f'{COMMIT}:{name}'], cwd=ROOT)
        relocated = raw.decode().replace('from deep_analysis', 'from original_a.deep_analysis').replace('from scanner', 'from original_a.scanner').encode()
        path = ROOT / 'original_a' / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(relocated)
        records[name] = {'original_sha256': hashlib.sha256(raw).hexdigest(), 'relocated_sha256': hashlib.sha256(relocated).hexdigest()}
    (ROOT / 'original_a/__init__.py').write_text('"""Pinned original A engine. See manifest.json for provenance."""\n')
    (ROOT / 'original_a/manifest.json').write_text(json.dumps({'commit': COMMIT, 'relocation': 'absolute package imports only', 'files': records}, indent=2) + '\n')


if __name__ == '__main__':
    main()
