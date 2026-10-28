"""Serial isolated runs at the product and A boundaries, with no model access."""
from __future__ import annotations

import os
from pathlib import Path
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]


def main():
    cases = [('small', 1, 2048, False), ('a-boundary', 200, 8 * 1024 * 1024, False),
             ('over-a', 201, 8 * 1024 * 1024 + 42000, False),
             ('large', 5000, 100 * 1024 * 1024, False), ('cancel', 20, 40960, True)]
    with tempfile.TemporaryDirectory(prefix='original-a-benchmark-config-') as config:
        env = {**os.environ, 'QUANTUM_AI_CONFIG_DIR': config, 'QUANTUM_AI_ENABLED': '0', 'QUANTUM_AI_API_KEY': ''}
        for name, count, size, cancel in cases:
            code = f'from scripts.benchmark_assisted import run; run({count}, {size}, "output/original-a/resources/{name}.json", {cancel})'
            subprocess.run([sys.executable, '-B', '-c', code], cwd=ROOT, env=env, check=True)


if __name__ == '__main__':
    main()
