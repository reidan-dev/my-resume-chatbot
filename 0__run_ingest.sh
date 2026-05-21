#!/bin/bash
set -e
ROOT="$(dirname "$0")"
cp "$ROOT/references/hr-questions-context.md" "$ROOT/backend/data/hr-questions-context.md"
echo "Synced hr-questions-context.md → backend/data/"
cd "$ROOT/backend"
uv run python -m rag.ingest
