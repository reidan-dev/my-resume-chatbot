FROM python:3.13-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --frozen --no-dev

COPY backend/ .

# Railway injects $PORT dynamically; fall back to 8000 for local Docker use
CMD uv run uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
