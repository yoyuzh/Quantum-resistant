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

Remote source collection is bounded to text-like code/config/key files and is intended for demo-scale migration assessment, not full repository indexing.
