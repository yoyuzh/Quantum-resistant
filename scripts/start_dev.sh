#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

BACKEND_HOST="${BACKEND_HOST:-127.0.0.1}"
BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_HOST="${FRONTEND_HOST:-127.0.0.1}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
PYTHON_BIN="${PYTHON_BIN:-python3}"

if [[ -x "${REPO_ROOT}/.venv/bin/python" ]]; then
  PYTHON_BIN="${REPO_ROOT}/.venv/bin/python"
fi

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  if [[ -n "${FRONTEND_PID}" ]] && kill -0 "${FRONTEND_PID}" 2>/dev/null; then
    kill "${FRONTEND_PID}" 2>/dev/null || true
  fi
  if [[ -n "${BACKEND_PID}" ]] && kill -0 "${BACKEND_PID}" 2>/dev/null; then
    kill "${BACKEND_PID}" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

cd "${REPO_ROOT}"

if [[ ! -d "web/node_modules" ]]; then
  echo "Installing frontend dependencies..."
  (cd web && npm install)
fi

export QUANTUM_ALLOWED_ORIGINS="${QUANTUM_ALLOWED_ORIGINS:+${QUANTUM_ALLOWED_ORIGINS},}http://${FRONTEND_HOST}:${FRONTEND_PORT}"
if [[ "${FRONTEND_HOST}" == "127.0.0.1" || "${FRONTEND_HOST}" == "localhost" ]]; then
  export QUANTUM_ALLOWED_ORIGINS="${QUANTUM_ALLOWED_ORIGINS},http://127.0.0.1:${FRONTEND_PORT},http://localhost:${FRONTEND_PORT}"
fi

echo "Starting backend on http://${BACKEND_HOST}:${BACKEND_PORT}"
"${PYTHON_BIN}" start.py --host "${BACKEND_HOST}" --port "${BACKEND_PORT}" --strict-port &
BACKEND_PID="$!"

echo "Starting frontend on http://${FRONTEND_HOST}:${FRONTEND_PORT}/static/"
(cd web && export BACKEND_URL="http://${BACKEND_HOST}:${BACKEND_PORT}" && exec node node_modules/vite/bin/vite.js --host "${FRONTEND_HOST}" --port "${FRONTEND_PORT}" --strictPort) &
FRONTEND_PID="$!"

cat <<EOF

Development services are starting:
- Backend API: http://${BACKEND_HOST}:${BACKEND_PORT}
- Frontend UI: http://${FRONTEND_HOST}:${FRONTEND_PORT}/static/

Press Ctrl+C to stop both services.
EOF

while true; do
  if ! kill -0 "${BACKEND_PID}" 2>/dev/null; then
    wait "${BACKEND_PID}" 2>/dev/null || true
    exit 1
  fi
  if ! kill -0 "${FRONTEND_PID}" 2>/dev/null; then
    wait "${FRONTEND_PID}" 2>/dev/null || true
    exit 1
  fi
  sleep 1
done
