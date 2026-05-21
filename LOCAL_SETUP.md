# Local Development Setup

This guide walks you through running the resume chatbot on your machine from scratch.

---

## Prerequisites

Make sure these are installed before starting:

| Tool | Check command | Install |
|------|--------------|---------|
| Docker Desktop | `docker --version` | [docker.com](https://www.docker.com/products/docker-desktop/) |
| uv (Python pkg manager) | `uv --version` | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| Node.js 20+ | `node --version` | [nodejs.org](https://nodejs.org) |

---

## Step 1 — Configure environment files

You need two `.env` files: one for the backend, one for the frontend. Both are already pre-filled with sensible defaults — you only need to change a few values.

### Backend: `backend/.env`

Copy from the example if it doesn't exist yet:

```bash
cp backend/.env.example backend/.env
```

Open it and review:

```bash
# ── LLM ──────────────────────────────────────────────────────────────
LLM_PROVIDER=ollama              # keep as "ollama" for local dev
OLLAMA_MODEL=llama3.2            # 3B model, fits in ~2 GB RAM
OLLAMA_BASE_URL=http://localhost:11434
OPENAI_MODEL=gpt-4o-mini         # only used when LLM_PROVIDER=openai
CLAUDE_API_KEY=                  # only used when LLM_PROVIDER=claude
CLAUDE_MODEL=claude-sonnet-4-6

# ── Embeddings ────────────────────────────────────────────────────────
EMBED_PROVIDER=ollama            # keep as "ollama" for local dev
EMBED_MODEL=nomic-embed-text
OPENAI_API_KEY=                  # only needed when EMBED_PROVIDER=openai

# ── Vector DB ─────────────────────────────────────────────────────────
VECTOR_DB=chroma                 # keep as "chroma" for local dev
CHROMA_HOST=localhost            # DO NOT change — matches Docker
CHROMA_PORT=8001                 # DO NOT change — matches docker-compose.yml
DATABASE_URL=                    # only needed for pgvector (production)

# ── Rate limiting & security ───────────────────────────────────────────
RATE_LIMIT_QUESTIONS=5           # questions per window per IP
RATE_LIMIT_WINDOW_DAYS=3
BURST_LIMIT=3                    # max questions per IP per minute
GLOBAL_DAILY_LIMIT=100           # max total questions per day
MAX_MESSAGE_LENGTH=300           # max characters per message
LLM_MAX_TOKENS=500               # max tokens per LLM response
REDIS_URL=                       # leave blank → uses in-memory (fine for dev)

# ── Contact info ───────────────────────────────────────────────────────
CONTACT_NAME=Reiniel Dan Pablo
CONTACT_EMAIL=reinieldan@gmail.com
CONTACT_LINKEDIN=https://www.linkedin.com/in/reiniel-dan-pablo
CONTACT_GITHUB=https://github.com/reidan-dev

# ── App ────────────────────────────────────────────────────────────────
BACKEND_CORS_ORIGINS=http://localhost:5173  # DO NOT change for local dev
SESSION_MEMORY_TURNS=6
RETRIEVAL_TOP_K=4
BOT_NAME=Folio

# ── Contact form (SMTP) ────────────────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=                   # your Gmail address
SMTP_PASSWORD=               # Gmail app password (Settings → Security → App Passwords)
```

**What you actually need to edit:**
- `CONTACT_NAME`, `CONTACT_EMAIL`, `CONTACT_LINKEDIN`, `CONTACT_GITHUB` — make sure these match your real details
- Everything else is already correct for local dev

---

### Frontend: `frontend/.env.local`

Copy from the example if it doesn't exist yet:

```bash
cp frontend/.env.example frontend/.env.local
```

Open it and review:

```bash
VITE_API_URL=http://localhost:8000    # DO NOT change for local dev

VITE_CONTACT_EMAIL=reinieldan@gmail.com
VITE_CONTACT_LINKEDIN=https://www.linkedin.com/in/reiniel-dan-pablo
VITE_CONTACT_GITHUB=https://github.com/reidan-dev
VITE_OWNER_NAME=Reiniel Dan Pablo
VITE_BOT_NAME=Folio
VITE_BOT_INTRO=Hey there! I'm Folio, Dan's AI portfolio assistant — powered by a RAG pipeline that grounds every answer directly in his resume and Q&A guide, so no guessing here. Ask me anything about his background, skills, or experience!

# Set to "true" to show the "Open to work" badge in the nav and resume header
VITE_OPEN_TO_WORK=false
```

**What you actually need to edit:**
- Same contact fields — keep them in sync with `backend/.env`
- `VITE_BOT_NAME` / `VITE_BOT_INTRO` — customize the chat widget name and opening message
- `VITE_OPEN_TO_WORK` — set to `true` to show the "Open to work" badge in the nav and resume header
- `VITE_API_URL` stays as `http://localhost:8000` for local dev

---

## Step 2 — Start Docker services

From the project root:

```bash
docker compose up -d
```

This starts two containers:
- **ollama** on port `11434` — the local LLM server
- **chromadb** on port `8001` — the vector database

Verify they're running:

```bash
docker compose ps
```

---

## Step 3 — Pull the AI models (first time only)

This is a one-time download (~2 GB total). Run both:

```bash
docker exec ollama ollama pull llama3.2
docker exec ollama ollama pull nomic-embed-text
```

> `llama3.2` is the 3B chat model (~2 GB, fits in most machines).
> `nomic-embed-text` converts text into vectors for search.
> This only needs to run once — Docker volumes persist the data.

---

## Step 4 — Install backend dependencies

```bash
cd backend
uv sync
```

`uv sync` reads `pyproject.toml` + `uv.lock` and installs everything into a local `.venv`. You never need to activate it manually — `uv run` handles that automatically.

---

## Step 5 — Ingest, backend, frontend — use the root scripts

Three shell scripts at the project root handle the most common commands. Run them from the project root:

```bash
./0__run_ingest.sh     # embed resume into ChromaDB (run once, then after any content edits)
./1__run_backend.sh    # start FastAPI on http://localhost:8000
./2__run_frontend.sh   # start Vite on http://localhost:5173 (open a new terminal)
```

Verify the backend is up: [http://localhost:8000/health](http://localhost:8000/health) → `{"status": "ok"}`

Open the app: [http://localhost:5173](http://localhost:5173)

---

## All terminals at a glance

| Terminal | Command | Purpose |
|----------|---------|---------|
| 1 | `docker compose up -d` (root) | Ollama + ChromaDB |
| 2 | `./1__run_backend.sh` (root) | FastAPI on port 8000 |
| 3 | `./2__run_frontend.sh` (root) | React app on port 5173 |

---

## Re-ingesting after content edits

1. Edit the source file in `references/` (HR context) or directly in `backend/data/` (resume)
2. If you edited in `references/`, copy to the working location:
   ```bash
   cp references/hr-questions-context.md backend/data/hr-questions-context.md
   ```
3. Re-ingest:
   ```bash
   ./0__run_ingest.sh
   ```
4. Restart the backend (Ctrl+C in terminal 2 → re-run `./1__run_backend.sh`)

---

## Switching to OpenAI or Claude (optional)

To use OpenAI gpt-4o-mini instead of Ollama, edit `backend/.env`:

```bash
LLM_PROVIDER=openai
OPENAI_MODEL=gpt-4o-mini
OPENAI_API_KEY=sk-...

EMBED_PROVIDER=openai
EMBED_MODEL=text-embedding-3-small
```

To use Claude instead:

```bash
LLM_PROVIDER=claude
CLAUDE_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-sonnet-4-6
```

Then restart the backend. When using OpenAI or Claude you don't need Ollama running — you can skip `docker compose up` if ChromaDB is also not needed (i.e. using pgvector instead).

---

## Stopping everything

```bash
docker compose down    # stops containers (data is preserved in volumes)
```

To also delete the stored model data and vector DB (full reset):

```bash
docker compose down -v
```
