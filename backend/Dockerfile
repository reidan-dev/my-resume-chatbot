FROM python:3.11-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

COPY . .

# Railway injects $PORT dynamically; fall back to 8000 for local Docker use
CMD uv run uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
