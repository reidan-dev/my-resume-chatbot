# Resume Chatbot Assistant — Project Specification

> Paste this entire file as your starting prompt when you begin building.

---

## Project Overview

Build a personal resume portfolio web app with an embedded AI chatbot that lets HR professionals and recruiters ask natural language questions about your background, skills, and experience. The chatbot uses Retrieval-Augmented Generation (RAG) to answer accurately from a structured resume knowledge base.

Visitors get **5 free questions per 3-day window** (tracked per IP on the backend, mirrored in localStorage on the frontend). After the limit is reached, the chat input is replaced with a contact card inviting them to reach out directly. The limit resets automatically — no account or login required.

The app is **fully responsive** — the resume page and chat widget work on phones, tablets, and desktops.

**Stack at a glance:**

| Layer | Local Dev | Production |
|-------|-----------|------------|
| Frontend | React + Vite + Tailwind | Vercel / Netlify |
| Backend | FastAPI (Python 3.11+) | Render / Railway / Fly.io |
| Python pkg mgr | **uv** (no global pip installs) | uv inside Docker |
| LLM | Ollama (llama3 / mistral) | Anthropic Claude API |
| Embeddings | nomic-embed-text (Ollama) | Claude or OpenAI embeddings |
| Vector DB | ChromaDB (local) | Pinecone / Weaviate / Qdrant |
| Orchestration | LangChain + LlamaIndex | same |
| Rate limit store | In-memory dict (dev) | Redis (prod) |
| Config | `.env` + `.env.example` | Platform env vars |
| Container | Docker Compose | Docker / managed PaaS |

---

## Goals

1. Showcase your resume in a clean, professional web page
2. Let visitors query your experience conversationally
3. Ground all answers in your actual resume content — no hallucinations
4. Support multi-turn conversation with memory of the prior exchange
5. Cite which resume section the answer came from
6. Rate-limit to 5 questions per IP per 3-day window; show a contact card when exhausted
7. Easy swap between local LLM and Claude API via a single `.env` variable
8. Fully responsive — works on mobile, tablet, and desktop without separate codebases

---

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                           Browser                              │
│  ┌───────────────────────┐   ┌─────────────────────────────┐  │
│  │   Resume Page (React)  │   │     Chat Widget (React)     │  │
│  │   - Single col mobile  │   │  - Full-screen on mobile    │  │
│  │   - Two col desktop    │   │  - Sidebar/float on desktop │  │
│  │   - PDF export btn     │   │  - SSE streaming response   │  │
│  │                        │   │  - Source citations         │  │
│  │                        │   │  - "X questions left" badge │  │
│  │                        │   │  - Contact card (on limit)  │  │
│  └───────────────────────┘   └─────────────────────────────┘  │
└──────────────────────────────────┬─────────────────────────────┘
                                   │ REST / SSE
┌──────────────────────────────────▼─────────────────────────────┐
│                         FastAPI Backend                         │
│                                                                 │
│  POST /chat          — chat (enforces rate limit per IP)        │
│  GET  /rate-limit    — check current limit status (read-only)   │
│  POST /chat/reset    — clear session history                    │
│  GET  /health        — liveness check                           │
│  POST /ingest        — re-index resume (admin, local only)      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Rate Limit Middleware (IP-based, 5 req / 3-day window)  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              RAG Pipeline (LangChain + LlamaIndex)       │  │
│  │  1. Query → embed                                        │  │
│  │  2. Vector search → top-k chunks                         │  │
│  │  3. Build prompt: system + context + history + query     │  │
│  │  4. Stream LLM response                                  │  │
│  │  5. Return answer + source metadata + rate limit headers │  │
│  └───────────────┬───────────────────────────┬─────────────┘  │
│                  │                           │                  │
│        ┌─────────▼──────┐         ┌──────────▼───────┐        │
│        │   Vector DB     │         │   LLM Provider   │        │
│        │  ChromaDB /     │         │  Ollama (local)  │        │
│        │  Pinecone       │         │  Claude (prod)   │        │
│        └────────────────┘         └──────────────────┘        │
│                                                                 │
│        ┌──────────────────────────────────────────────┐        │
│        │  Rate Limit Store                            │        │
│        │  dict (dev)  |  Redis with 3-day TTL (prod)  │        │
│        └──────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                                   │
               ┌───────────────────▼──────────────────┐
               │  resume.md + hr-questions-context.md  │
               │  (ingested into vector DB on startup)  │
               └──────────────────────────────────────┘
```

---

## Repository Structure

```
resume-chatbot/
├── docker-compose.yml
├── .gitignore                        # ignores all .env files, .venv, __pycache__
│
├── backend/
│   ├── pyproject.toml                # uv project manifest + dependencies
│   ├── uv.lock                       # committed lockfile — reproducible installs
│   ├── .env                          # LOCAL ONLY — never commit
│   ├── .env.example                  # committed template with empty values
│   ├── main.py
│   ├── config.py                     # pydantic-settings reads from .env
│   ├── middleware/
│   │   └── rate_limiter.py
│   ├── rag/
│   │   ├── ingest.py
│   │   ├── retriever.py
│   │   └── chain.py
│   ├── llm/
│   │   ├── provider.py
│   │   └── prompts.py
│   ├── models/
│   │   └── schemas.py
│   ├── data/
│   │   ├── resume.md                 # YOUR RESUME — primary source of truth
│   │   └── hr-questions-context.md  # HR Q&A context — ingested alongside resume
│   └── Dockerfile
│
└── frontend/
    ├── .env.local                    # LOCAL ONLY — never commit (VITE_ prefix)
    ├── .env.example                  # committed template
    ├── src/
    │   ├── pages/
    │   │   └── ResumePage.tsx
    │   ├── components/
    │   │   ├── ChatWidget.tsx        # Responsive: full-screen mobile, float desktop
    │   │   ├── MessageBubble.tsx
    │   │   ├── SourceBadge.tsx
    │   │   ├── RateLimitBadge.tsx
    │   │   ├── ContactCard.tsx
    │   │   └── SuggestedQuestions.tsx
    │   ├── hooks/
    │   │   ├── useChat.ts
    │   │   └── useRateLimit.ts
    │   ├── lib/
    │   │   └── api.ts
    │   └── App.tsx
    ├── package.json
    ├── tailwind.config.ts
    └── vite.config.ts
```

---

## Python Package Management — uv

All Python dependencies are managed with [`uv`](https://docs.astral.sh/uv/). No global `pip install` ever. The `.venv` lives inside `backend/` and is created automatically.

### Install uv (once, globally)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Create the project

```bash
cd backend
uv init               # creates pyproject.toml + .venv
uv add fastapi uvicorn[standard] sse-starlette pydantic-settings python-dotenv \
       langchain langchain-community langchain-anthropic langchain-ollama \
       langchain-chroma llama-index llama-index-vector-stores-chroma \
       chromadb redis httpx
```

### Common uv commands

```bash
uv sync                          # install/sync all deps from uv.lock
uv add <package>                 # add a new dependency
uv remove <package>              # remove a dependency
uv run uvicorn main:app --reload # run app inside .venv (no activate needed)
uv run python scripts/ingest.py  # run any script inside .venv
uv run pytest                    # run tests
```

You **never** need to activate the venv manually — `uv run` handles it. Commit both `pyproject.toml` and `uv.lock`; `.venv/` goes in `.gitignore`.

### `pyproject.toml`

```toml
[project]
name = "resume-chatbot-backend"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "fastapi",
    "uvicorn[standard]",
    "sse-starlette",
    "pydantic-settings",
    "python-dotenv",
    "langchain",
    "langchain-community",
    "langchain-anthropic",
    "langchain-ollama",
    "langchain-chroma",
    "llama-index",
    "llama-index-vector-stores-chroma",
    "chromadb",
    "redis[asyncio]",
    "httpx",
]

[tool.uv]
dev-dependencies = [
    "pytest",
    "httpx",  # for TestClient
]
```

### Dockerfile (uv-based)

```dockerfile
FROM python:3.11-slim

# Copy the uv binary from the official image — no system-level install
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Install dependencies first (layer cache)
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# Copy application code
COPY . .

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Environment Variables & `.env` Files

All configuration lives in `.env` files. **Never commit real values.** Always commit the `.env.example` with empty values as documentation.

### `.gitignore` (root)

```
# Environment files — never commit real secrets
.env
.env.local
.env.*.local

# Python
.venv/
__pycache__/
*.pyc

# Node
node_modules/

# Build output
dist/
```

### `backend/.env.example`

```bash
# ── LLM ──────────────────────────────────────────────────
LLM_PROVIDER=ollama              # "ollama" | "claude"
OLLAMA_MODEL=llama3
OLLAMA_BASE_URL=http://ollama:11434
CLAUDE_API_KEY=                  # sk-ant-...
CLAUDE_MODEL=claude-sonnet-4-6

# ── Embeddings ───────────────────────────────────────────
EMBED_PROVIDER=ollama            # "ollama" | "openai"
EMBED_MODEL=nomic-embed-text
OPENAI_API_KEY=

# ── Vector DB ────────────────────────────────────────────
VECTOR_DB=chroma                 # "chroma" | "pinecone" | "qdrant"
CHROMA_HOST=chromadb
CHROMA_PORT=8001
PINECONE_API_KEY=
PINECONE_INDEX=resume

# ── Rate limiting ─────────────────────────────────────────
RATE_LIMIT_QUESTIONS=5
RATE_LIMIT_WINDOW_DAYS=3
REDIS_URL=                       # leave empty → in-memory (dev only)

# ── Contact info (surfaced in ContactCard & system prompt) ─
CONTACT_EMAIL=you@email.com
CONTACT_LINKEDIN=linkedin.com/in/yourprofile
CONTACT_GITHUB=github.com/yourusername

# ── App ───────────────────────────────────────────────────
BACKEND_CORS_ORIGINS=http://localhost:5173
SESSION_MEMORY_TURNS=6
RETRIEVAL_TOP_K=4
```

### `frontend/.env.example`

```bash
# All frontend env vars MUST start with VITE_ to be exposed to the browser
VITE_API_URL=http://localhost:8000

# Contact info (duplicated here so the frontend ContactCard works without an API call)
VITE_CONTACT_EMAIL=you@email.com
VITE_CONTACT_LINKEDIN=https://linkedin.com/in/yourprofile
VITE_CONTACT_GITHUB=https://github.com/yourusername
VITE_OWNER_NAME=Dan Pablo
```

### Loading `.env` in FastAPI (`config.py`)

```python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    llm_provider: str = "ollama"
    ollama_model: str = "llama3"
    ollama_base_url: str = "http://localhost:11434"
    claude_api_key: str = ""
    claude_model: str = "claude-sonnet-4-6"

    rate_limit_questions: int = 5
    rate_limit_window_days: int = 3
    redis_url: str = ""

    contact_email: str = ""
    contact_linkedin: str = ""
    contact_github: str = ""

    backend_cors_origins: str = "http://localhost:5173"
    session_memory_turns: int = 6
    retrieval_top_k: int = 4

settings = Settings()
```

`pydantic-settings` reads `.env` automatically — no manual `load_dotenv()` call needed. In Docker, platform-level env vars override the file.

---

## Backend — Key Implementation Details

### 1. Rate Limiter (`middleware/rate_limiter.py`)

**Dual enforcement:** backend is authoritative (IP-based); frontend mirrors state in localStorage for instant UX feedback without a round-trip.

```python
from fastapi import Request, HTTPException
from datetime import datetime, timedelta, timezone
from collections import defaultdict

RATE_LIMIT  = settings.rate_limit_questions
WINDOW_DAYS = settings.rate_limit_window_days

# Dev: in-memory. Prod: swap for Redis with TTL.
_store: dict[str, dict] = defaultdict(lambda: {"count": 0, "reset_at": None})

def _get_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    return forwarded.split(",")[0].strip() if forwarded else request.client.host

async def rate_limit(request: Request) -> dict:
    ip  = _get_ip(request)
    now = datetime.now(timezone.utc)
    rec = _store[ip]

    if rec["reset_at"] is None or now >= rec["reset_at"]:
        rec["count"]    = 0
        rec["reset_at"] = now + timedelta(days=WINDOW_DAYS)

    if rec["count"] >= RATE_LIMIT:
        raise HTTPException(status_code=429, detail={
            "error":          "rate_limit_exceeded",
            "questions_used": rec["count"],
            "limit":          RATE_LIMIT,
            "reset_at":       rec["reset_at"].isoformat(),
        })

    rec["count"] += 1
    return {
        "remaining": RATE_LIMIT - rec["count"],
        "reset_at":  rec["reset_at"].isoformat(),
        "limit":     RATE_LIMIT,
    }
```

**Redis version for production** — replace `_store` with:

```python
import redis.asyncio as aioredis
r = aioredis.from_url(settings.redis_url)

# On each request: HINCRBY ip count 1 / HGET ip reset_at / EXPIRE ip TTL_SECONDS
```

### 2. Chat Endpoint with Rate Limit Headers

```python
@app.post("/chat")
async def chat(body: ChatRequest, rl: dict = Depends(rate_limit)):
    async def stream():
        async for token in rag_chain.astream(body.message, body.session_id):
            yield f"data: {json.dumps({'type': 'token', 'text': token})}\n\n"
        yield f"data: {json.dumps({'type': 'rate_limit', **rl})}\n\n"
        yield "data: [DONE]\n\n"

    response = EventSourceResponse(stream())
    response.headers["X-RateLimit-Limit"]     = str(rl["limit"])
    response.headers["X-RateLimit-Remaining"] = str(rl["remaining"])
    response.headers["X-RateLimit-Reset"]     = rl["reset_at"]
    return response

@app.get("/rate-limit")
async def check_rate_limit(request: Request):
    # Read-only — does NOT increment. Frontend calls on widget open.
    ip  = _get_ip(request)
    rec = _store.get(ip, {"count": 0, "reset_at": None})
    remaining = max(0, RATE_LIMIT - rec["count"])
    return {"remaining": remaining, "limit": RATE_LIMIT, "reset_at": rec.get("reset_at")}
```

### 3. Resume Ingestion (`rag/ingest.py`)

```python
DATA_FILES = [
    "data/resume.md",               # Professional facts
    "data/hr-questions-context.md", # Behavioral Q&A context
]

# Strategy:
# - Split each file on ## headers → one chunk per section
# - Metadata per chunk: { source_file, section, type: "resume"|"context" }
# - Embed with nomic-embed-text (local) or text-embedding-3-small (prod)
# - Upsert into ChromaDB collection "resume"
```

### 4. LLM Provider Factory (`llm/provider.py`)

```python
def get_llm():
    if settings.llm_provider == "claude":
        from langchain_anthropic import ChatAnthropic
        return ChatAnthropic(
            model=settings.claude_model,
            api_key=settings.claude_api_key,   # loaded from .env
        )
    from langchain_ollama import ChatOllama
    return ChatOllama(model=settings.ollama_model, base_url=settings.ollama_base_url)
```

### 5. System Prompt (`llm/prompts.py`)

```
You are a helpful assistant on {owner_name}'s portfolio website.
Answer questions from HR professionals and recruiters about
{owner_name}'s background, skills, experience, and work style.

Rules:
- Answer ONLY from the provided context (resume + Q&A guide).
- If context lacks detail, say so honestly — never guess or invent facts.
- Be concise and professional. Bullet points are fine for lists.
- Salary questions: say "{owner_name} prefers to discuss this directly"
  and mention {contact_email}.
- Off-topic questions: politely redirect.

Context:
{context}

Conversation so far:
{history}
```

---

## Frontend — Key Implementation Details

### Responsive Design Strategy

The app uses **Tailwind CSS breakpoints** (`sm`, `md`, `lg`) throughout. The core rule:

| Breakpoint | Resume page | Chat widget |
|------------|------------|-------------|
| `< md` (mobile) | Single column, stacked sections | Full-screen overlay (bottom sheet) |
| `md` (tablet) | Two column | Floating sidebar (right side) |
| `lg+` (desktop) | Two column + sticky chat | Floating sidebar or split pane |

Key mobile rules:
- All tap targets minimum `min-h-[44px]` (Apple HIG)
- No hover-only interactions — everything works on touch
- Input area padded for safe area on notched phones: `pb-[env(safe-area-inset-bottom)]`
- Chat opens as a bottom sheet on mobile (slides up from bottom), not a corner widget

### Mobile vs Desktop Chat Widget

```
── Mobile (< md) ──────────────────      ── Desktop (md+) ──────────────────────
                                         
  [resume page — full width]              [resume page — 60%] [chat — 40%]
                                         
  ┌─────────────────────────┐             ┌───────────────────────────────┐
  │  💬  Ask about Dan  [^] │ ← FAB btn   │ 💬 Ask about Dan  [3 left] [×]│
  └─────────────────────────┘             ├───────────────────────────────┤
                                          │  messages...                  │
  ↓ tap FAB → slides up full screen       │                               │
                                          │  [suggested questions]        │
  ┌─────────────────────────────────┐     │                               │
  │ [×]  Ask about Dan   [3 left]   │     │  ┌─────────────────────┐      │
  ├─────────────────────────────────┤     │  │ Type a question…    │[→]   │
  │                                 │     │  └─────────────────────┘      │
  │  messages...                    │     └───────────────────────────────┘
  │                                 │
  │  [suggested questions]          │
  │                                 │
  ├─────────────────────────────────┤
  │ ┌───────────────────────┐ [→]   │
  │ │ Type a question…      │       │
  │ └───────────────────────┘       │
  │         safe area padding       │
  └─────────────────────────────────┘
```

### Rate Limit Hook (`hooks/useRateLimit.ts`)

```typescript
const STORAGE_KEY = "resume_rl";
const LIMIT       = 5;
const WINDOW_MS   = 3 * 24 * 60 * 60 * 1000;

interface RLState { count: number; resetAt: number; }

function load(): RLState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, resetAt: Date.now() + WINDOW_MS };
    const s = JSON.parse(raw) as RLState;
    return Date.now() >= s.resetAt
      ? { count: 0, resetAt: Date.now() + WINDOW_MS }
      : s;
  } catch { return { count: 0, resetAt: Date.now() + WINDOW_MS }; }
}

export function useRateLimit() {
  const [state, setState] = useState<RLState>(load);

  const increment = useCallback(() => {
    setState(prev => {
      const next = { ...prev, count: prev.count + 1 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const syncFromHeaders = useCallback((remaining: number, resetAt: string) => {
    const next = { count: LIMIT - remaining, resetAt: new Date(resetAt).getTime() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setState(next);
  }, []);

  return {
    remaining:   Math.max(0, LIMIT - state.count),
    isExhausted: state.count >= LIMIT,
    resetAt:     new Date(state.resetAt),
    increment,
    syncFromHeaders,
  };
}
```

### `RateLimitBadge` Colour States

| Remaining | Colour | Text |
|-----------|--------|------|
| 5 | hidden | — |
| 3–4 | green | "X questions left" |
| 2 | amber | "2 questions left" |
| 1 | orange | "Last question!" |
| 0 | — | `ContactCard` replaces input |

### `ContactCard` Component

```tsx
export function ContactCard({ resetAt }: { resetAt: Date }) {
  const timeLeft = useCountdown(resetAt); // "2d 14h"

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 space-y-4 text-sm">
      <div>
        <p className="font-semibold text-emerald-800 text-base">
          🎉 Looks like you're interested!
        </p>
        <p className="text-emerald-700 mt-1">
          You've used all {LIMIT} questions. Let's connect directly.
        </p>
      </div>

      <div className="space-y-3">
        {/* Each row is touch-friendly: min-h-[44px], full-width tap target */}
        <a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`}
           className="flex items-center gap-3 min-h-[44px] text-emerald-700 hover:text-emerald-900">
          <span>✉️</span> {import.meta.env.VITE_CONTACT_EMAIL}
        </a>
        <a href={import.meta.env.VITE_CONTACT_LINKEDIN} target="_blank" rel="noreferrer"
           className="flex items-center gap-3 min-h-[44px] text-emerald-700 hover:text-emerald-900">
          <span>💼</span> LinkedIn
        </a>
        <a href={import.meta.env.VITE_CONTACT_GITHUB} target="_blank" rel="noreferrer"
           className="flex items-center gap-3 min-h-[44px] text-emerald-700 hover:text-emerald-900">
          <span>🐙</span> GitHub
        </a>
      </div>

      <p className="text-xs text-emerald-600">↻ Questions reset in {timeLeft}</p>
    </div>
  );
}
```

The `ContactCard` appears as the final message in the thread AND replaces the text input. Contact details come from `VITE_*` env vars so they're never hardcoded.

### After Each Response (`hooks/useChat.ts`)

1. Increment local counter via `useRateLimit().increment()`
2. Sync authoritative state from `X-RateLimit-Remaining` + `X-RateLimit-Reset` headers
3. If `isExhausted` → append `ContactCard` as synthetic assistant message + disable input

---

## `resume.md` Structure

Structure so the RAG chunker splits cleanly on `##` headers:

```markdown
# Dan Pablo — Full Stack Engineer

**Email**: dan@email.com | **LinkedIn**: linkedin.com/in/danpablo | **GitHub**: github.com/danpablo

---

## Summary
...

## Skills
...

## Work Experience
...

## Projects
...

## Education
...

## Certifications
...
```

`hr-questions-context.md` (same `backend/data/` folder) is also ingested, providing behavioral and personality context the resume alone can't capture.

---

## Local Development Setup

### Prerequisites

- [`uv`](https://docs.astral.sh/uv/) — `curl -LsSf https://astral.sh/uv/install.sh | sh`
- Node 20+
- Docker + Docker Compose (for Ollama, ChromaDB)

### First-time setup

```bash
git clone <repo> && cd resume-chatbot

# Backend
cd backend
cp .env.example .env          # fill in values (LLM_PROVIDER=ollama to start)
uv sync                       # installs all deps into .venv — no pip needed

# Frontend
cd ../frontend
cp .env.example .env.local    # fill in VITE_ values
npm install
```

### Start services and run

```bash
# Terminal 1 — infrastructure (Ollama + ChromaDB)
docker compose up

# First run only — pull models (~4 GB)
docker exec ollama ollama pull llama3
docker exec ollama ollama pull nomic-embed-text

# Terminal 2 — backend
cd backend
uv run uvicorn main:app --reload --port 8000

# Ingest resume (run once, and after any changes to resume.md or hr-questions-context.md)
uv run python -m rag.ingest

# Terminal 3 — frontend
cd frontend
npm run dev          # opens http://localhost:5173
```

### Switch to Claude API

```bash
# backend/.env
LLM_PROVIDER=claude
CLAUDE_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-sonnet-4-6
# then restart: uv run uvicorn main:app --reload
```

---

## Production Deployment Plan

### Backend → Render / Railway / Fly.io

- Set all env vars in the platform dashboard (mirrors `backend/.env.example`)
- Switch `LLM_PROVIDER=claude`, `VECTOR_DB=pinecone`, add `REDIS_URL`
- Render offers a free Redis add-on — use it for persistent rate limits
- The Dockerfile uses `uv sync --frozen` for reproducible builds from `uv.lock`

### Frontend → Vercel / Netlify

- Set `VITE_API_URL=https://your-backend.onrender.com`
- Set all `VITE_CONTACT_*` and `VITE_OWNER_NAME` vars in the platform dashboard
- Static build, zero server cost

### Vector DB → Pinecone Starter (free, 1 index)

- Run `uv run python -m rag.ingest` locally pointing at the prod Pinecone index after first deploy
- Re-run any time you update `resume.md` or `hr-questions-context.md`

### Production notes

- **No Ollama in production** — local dev only
- **Always use Redis in prod** — in-memory rate limit resets on every restart
- **Never commit `.env` files** — use platform env vars or secrets manager

---

## Suggested Build Order

1. Fill in `resume.md` and `hr-questions-context.md` with real content — do this first
2. `uv init` in `backend/`, `uv add` all dependencies, commit `pyproject.toml` + `uv.lock`
3. Backend: copy `.env.example` → `.env`, wire `config.py` with `pydantic-settings`
4. Backend: FastAPI skeleton + `/health` + rate limiter middleware
5. RAG: ingest script → verify both files chunk and embed correctly
6. RAG: retriever + LangChain chain with Ollama → test via `curl`
7. Frontend: copy `.env.example` → `.env.local`, `npm install`
8. Frontend: Resume page — mobile-first, single column, responsive up to desktop
9. Frontend: `useRateLimit` hook + `RateLimitBadge`
10. Frontend: Chat widget — mobile bottom sheet + desktop sidebar
11. Frontend: SSE streaming hook + `ContactCard` exhaust state
12. Wire up: full end-to-end conversation with rate limit sync from headers
13. Add: conversation memory, source citations, suggested questions
14. Swap: Claude API + Pinecone + Redis (`.env` change only, no code change)
15. Deploy: backend → Render, frontend → Vercel

---

## Open Questions to Decide Before Starting

- [ ] Fill in `backend/.env` and `frontend/.env.local` with your real contact info
- [ ] Fill in `resume.md` with your actual experience
- [ ] Fill in `hr-questions-context.md` with honest, specific answers
- [ ] Mobile chat: bottom sheet (slides up) or full-page route (`/chat`)?
- [ ] Should suggested questions be hardcoded or LLM-generated per conversation?
- [ ] Do you want analytics on which questions get asked most?
- [ ] Should the `ContactCard` include a short inline contact form (name + message)?
- [ ] Any additional contact methods — phone, Calendly link, etc.?
