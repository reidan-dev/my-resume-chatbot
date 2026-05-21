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

This file was auto-created from `backend/.env.example`. Open it and review:

```bash
# ── LLM ──────────────────────────────────────────────────────────────
LLM_PROVIDER=ollama              # keep as "ollama" for local dev
OLLAMA_MODEL=llama3              # the model Docker will pull
OLLAMA_BASE_URL=http://localhost:11434
CLAUDE_API_KEY=                  # leave blank for local dev
CLAUDE_MODEL=claude-sonnet-4-6   # only used when LLM_PROVIDER=claude

# ── Embeddings ────────────────────────────────────────────────────────
EMBED_PROVIDER=ollama            # keep as "ollama" for local dev
EMBED_MODEL=nomic-embed-text     # the embedding model Docker will pull
OPENAI_API_KEY=                  # leave blank for local dev

# ── Vector DB ─────────────────────────────────────────────────────────
VECTOR_DB=chroma                 # keep as "chroma" for local dev
CHROMA_HOST=localhost            # DO NOT change — matches Docker
CHROMA_PORT=8001                 # DO NOT change — matches docker-compose.yml
PINECONE_API_KEY=                # leave blank for local dev
PINECONE_INDEX=resume

# ── Rate limiting ──────────────────────────────────────────────────────
RATE_LIMIT_QUESTIONS=5           # questions per window per IP
RATE_LIMIT_WINDOW_DAYS=3
REDIS_URL=                       # leave blank → uses in-memory (fine for dev)

# ── Contact info ───────────────────────────────────────────────────────
CONTACT_NAME=Reiniel Dan Pablo   # ← your name
CONTACT_EMAIL=reinieldan@gmail.com         # ← your email
CONTACT_LINKEDIN=https://www.linkedin.com/in/reiniel-dan-pablo  # ← your LinkedIn
CONTACT_GITHUB=https://github.com/reidan-dev                    # ← your GitHub

# ── App ────────────────────────────────────────────────────────────────
BACKEND_CORS_ORIGINS=http://localhost:5173  # DO NOT change for local dev
SESSION_MEMORY_TURNS=6
RETRIEVAL_TOP_K=4
```

**What you actually need to edit:**
- `CONTACT_NAME`, `CONTACT_EMAIL`, `CONTACT_LINKEDIN`, `CONTACT_GITHUB` — make sure these match your real details
- Everything else is already correct for local dev

---

### Frontend: `frontend/.env.local`

This file was auto-created from `frontend/.env.example`. Open it and review:

```bash
VITE_API_URL=http://localhost:8000    # DO NOT change for local dev

VITE_CONTACT_EMAIL=reinieldan@gmail.com
VITE_CONTACT_LINKEDIN=https://www.linkedin.com/in/reiniel-dan-pablo
VITE_CONTACT_GITHUB=https://github.com/reidan-dev
VITE_OWNER_NAME=Reiniel Dan Pablo
```

**What you actually need to edit:**
- Same contact fields — keep them in sync with `backend/.env`
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

This is a one-time download (~4 GB total). Run both:

```bash
docker exec ollama ollama pull llama3
docker exec ollama ollama pull nomic-embed-text
```

> `llama3` is the chat model. `nomic-embed-text` converts text into vectors for search.
> This only needs to run once — Docker volumes persist the data.

---

## Step 4 — Install backend dependencies

```bash
cd backend
uv sync
```

`uv sync` reads `pyproject.toml` + `uv.lock` and installs everything into a local `.venv`. You never need to activate it — `uv run` handles that automatically.

---

## Step 5 — Ingest the resume into ChromaDB

The ingest script reads from `backend/data/resume.md` and `backend/data/hr-questions-context.md` and embeds them into ChromaDB.

> **Source files vs working copies**
>
> | Location | Role |
> |----------|------|
> | `references/hr-questions-context.md` | Source — edit here |
> | `references/Reiniel_Pablo_Software_Developer.pdf` | Original resume PDF |
> | `references/resume-chatbot-spec.md` | Project specification |
> | `backend/data/resume.md` | Working copy — what the chatbot reads |
> | `backend/data/hr-questions-context.md` | Working copy — what the chatbot reads |
>
> If you've edited anything in `references/`, copy it to `backend/data/` first:
> ```bash
> cp references/hr-questions-context.md backend/data/hr-questions-context.md
> ```

Then run the ingest:

```bash
cd backend
uv run python -m rag.ingest
```

You should see output like:
```
Connecting to ChromaDB...
  data/resume.md: 12 chunks
  data/hr-questions-context.md: 28 chunks
Embedding and storing 40 chunks...
Done. 40 chunks ingested into ChromaDB.
```

---

## Step 6 — Start the backend

```bash
cd backend
uv run uvicorn main:app --reload --port 8000
```

Verify it's running by opening: [http://localhost:8000/health](http://localhost:8000/health)

You should see: `{"status": "ok"}`

---

## Step 7 — Start the frontend

Open a new terminal:

```bash
cd frontend
npm install    # only needed the first time
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — the resume page and chat widget should load.

---

## All terminals at a glance

| Terminal | Command | Purpose |
|----------|---------|---------|
| 1 | `docker compose up -d` (root) | Ollama + ChromaDB |
| 2 | `uv run uvicorn main:app --reload --port 8000` (backend/) | FastAPI |
| 3 | `npm run dev` (frontend/) | React app |

---

## Re-ingesting after edits

1. Edit the source file in `references/`
2. Copy it to `backend/data/`:
   ```bash
   cp references/hr-questions-context.md backend/data/hr-questions-context.md
   # or edit backend/data/resume.md directly
   ```
3. Re-ingest:
   ```bash
   cd backend
   uv run python -m rag.ingest
   ```
4. Restart the backend (Ctrl+C → re-run uvicorn) so the new embeddings are picked up.

---

## Switching to Claude API (optional)

To use Claude instead of Ollama, edit `backend/.env`:

```bash
LLM_PROVIDER=claude
CLAUDE_API_KEY=sk-ant-...          # your Anthropic API key
CLAUDE_MODEL=claude-sonnet-4-6     # or claude-opus-4-7 for higher quality
```

Then restart the backend. You don't need Ollama or Docker running when using Claude.

---

## Stopping everything

```bash
docker compose down    # stops and removes containers (data is preserved in volumes)
```

To also delete the stored model data and vector DB (full reset):

```bash
docker compose down -v
```
