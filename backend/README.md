# Backend

FastAPI service for the quantum-vulnerable public-key algorithm scanner.

```bash
python start.py
```

Open `http://127.0.0.1:8000`.

The API exposes:

- `POST /api/scan/snippet`
- `POST /api/scan/files`
- `POST /api/scan/github`
- `POST /api/scan/pypi`
- `GET /api/knowledge/graph`
- `POST /api/report/markdown`
- `GET /api/health`
- `GET /api/samples`
- `GET /api/popular/results`
- `POST /api/popular/scan`

Remote source collection is bounded to text-like code/config/key files and is intended for demo-scale migration assessment, not full repository indexing.

See [architecture](../docs/architecture.md) for module boundaries, coverage and diagnostics,
shared deadlines, and the single-process popular refresh lock. Development proxy configuration
and offline verification commands are documented in the root README.
