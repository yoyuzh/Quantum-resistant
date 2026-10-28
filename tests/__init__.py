"""Keep test configuration independent from the developer's retained credentials."""
import os
from pathlib import Path
import tempfile

os.environ.setdefault('QUANTUM_AI_CONFIG_DIR', str(Path(tempfile.gettempdir()) / f'quantum-ai-tests-{os.getpid()}'))
