"""FastAPI backend package for the quantum-vulnerable crypto scanner."""

from __future__ import annotations

import json
from pathlib import Path

# The same manifest is bundled with the frozen backend and read by Vite.
__version__ = json.loads(
    (Path(__file__).resolve().parents[1] / 'desktop' / 'package.json').read_text(encoding='utf-8')
)['version']
