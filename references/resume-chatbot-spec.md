# Resume Chatbot — Technical Reference

What was built, how it works, and how the pieces fit together.

---

## What It Is

A personal resume site with an embedded AI chatbot named **Folio**. Recruiters and HR professionals can ask natural language questions about Dan's background and experience. Answers are grounded in the resume via a RAG pipeline — the LLM never guesses outside what's in the documents.

Visitors get **5 free questions per 3-day window** (tracked per IP on the backend, mirrored in localStorage on the frontend). After the limit is reached, a contact card appears. The limit resets automatically — no account or login required.

---

## Production Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS v3 |
| Backend | Python 3.13 · FastAPI · LangChain · SSE streaming |
| Package manager | uv (no global pip installs, lockfile committed) |
| LLM | OpenAI gpt-4o-mini |
| Embeddings | OpenAI text-embedding-3-small |
| Vector DB | Supabase pgvector (production) · ChromaDB (local dev) |
| Chat logging | Supabase PostgreSQL — `chat_logs` table |
| Container | Docker (python:3.13-slim + uv) deployed on Railway |
| Frontend host | Vercel |
| Rate limit store | In-memory (resets on redeploy) |
| Config | pydantic-settings + `.env` / platform env vars |

---

## Local Dev Stack

| Layer | Technology |
|-------|-----------|
| LLM | Ollama (llama3.2, 3B) |
| Embeddings | Ollama (nomic-embed-text) |
| Vector DB | ChromaDB (Docker container) |
| Ollama | Docker container |

---

## Repository Structure

```
my-resume-chatbot/
├── docker-compose.yml          # Ollama + ChromaDB for local dev
├── railway.toml                # Railway build config (Dockerfile, health check)
├── .gitignore
├── 0__run_ingest.sh            # embed docs into vector DB
├── 1__run_backend.sh           # start FastAPI
├── 2__run_frontend.sh          # start Vite
│
├── backend/
│   ├── pyproject.toml          # uv project manifest + dependencies
│   ├── uv.lock                 # committed lockfile
│   ├── .env.example            # template — copy to .env and fill in
│   ├── Dockerfile              # python:3.13-slim + uv, build context = repo root
│   ├── main.py                 # FastAPI app, endpoints, CORS, SMTP
│   ├── config.py               # pydantic-settings reads from .env
│   ├── middleware/
│   │   ├── rate_limiter.py     # per-IP burst + window rate limiting
│   │   ├── input_guard.py      # message length + injection pattern check
│   │   ├── global_cap.py       # shared daily question counter
│   │   └── contact_guard.py    # contact form: IP limit + honeypot + validation
│   ├── rag/
│   │   ├── ingest.py           # chunk + embed + store docs
│   │   ├── retriever.py        # vector store retriever (async_mode=True for pgvector)
│   │   └── chain.py            # RAG chain: retrieve + prompt + stream + log
│   ├── llm/
│   │   ├── provider.py         # LLM + embeddings factory (openai / claude / ollama)
│   │   └── prompts.py          # system prompt template
│   ├── models/
│   │   └── schemas.py          # ChatRequest, ContactRequest (includes honeypot field)
│   ├── services/
│   │   └── chat_logger.py      # fire-and-forget insert to Supabase chat_logs
│   └── data/
│       ├── resume.md           # working copy of resume (ingested)
│       ├── hr-questions-context.md  # HR Q&A context (ingested)
│       └── personality.md      # Folio's tone and behavior instructions
│
├── frontend/
│   ├── index.html              # viewport: no zoom, safe-area
│   ├── .env.example            # template — copy to .env.local and fill in
│   ├── src/
│   │   ├── App.tsx             # nav (tabs + open-to-work + share + print), FAB
│   │   ├── pages/
│   │   │   ├── ResumePage.tsx  # resume layout, AnimatedDan, skill highlights
│   │   │   └── AboutPage.tsx   # stack, data flow, security, features
│   │   ├── components/
│   │   │   ├── ChatWidget.tsx  # bottom sheet (mobile) / float (desktop), SSE
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── SourceBadge.tsx
│   │   │   ├── RateLimitBadge.tsx
│   │   │   ├── ContactCard.tsx
│   │   │   ├── ContactModal.tsx  # email form with honeypot field
│   │   │   └── SuggestedQuestions.tsx
│   │   ├── hooks/
│   │   │   ├── useChat.ts
│   │   │   ├── useRateLimit.ts  # localStorage mirror + ?reset=<secret> support
│   │   │   └── useHealth.ts     # polls /health every 30s
│   │   └── lib/
│   │       └── api.ts
│   ├── package.json
│   ├── tailwind.config.ts
│   └── vite.config.ts
│
└── references/
    ├── resume-chatbot-spec.md       # this file
    ├── hr-questions-context.md      # source — copy to backend/data/ before ingesting
    ├── skills-ratings.md            # personal skill self-assessment (not ingested)
    └── Reiniel_Pablo_Software_Developer.pdf  # original resume PDF
```

---

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Liveness check — returns `{status, model}` |
| POST | `/chat` | Chat — enforces all 3 security layers, streams SSE |
| GET | `/rate-limit` | Read-only rate limit status for current IP |
| POST | `/chat/reset` | Clear session conversation history |
| POST | `/contact` | Send contact form email (enforces contact guard) |

---

## Security Layers

All four layers run on every relevant request in this order:

```
Request → [Input Guard] → [Rate Limiter] → [Global Cap] → LLM
Contact → [Contact Guard] → SMTP
```

| Layer | File | What it does |
|-------|------|-------------|
| Input Guard | `middleware/input_guard.py` | Max 300 chars + injection pattern blocklist → HTTP 400 |
| Per-IP Rate Limit | `middleware/rate_limiter.py` | Burst: 3/min, Window: 5/3 days per IP → HTTP 429 |
| Global Daily Cap | `middleware/global_cap.py` | 100 questions/day across all users → HTTP 503 |
| Contact Form Guard | `middleware/contact_guard.py` | IP limit (3/hr) + honeypot + length + URL cap + spam keywords → HTTP 400/422/429 |

IP spoofing protection: uses the **last** entry in `X-Forwarded-For`, which is injected by Railway's proxy.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `LLM_PROVIDER` | `ollama` | `openai`, `claude`, or `ollama` |
| `OPENAI_API_KEY` | — | Required when provider is `openai` |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI chat model |
| `CLAUDE_API_KEY` | — | Required when provider is `claude` |
| `CLAUDE_MODEL` | `claude-sonnet-4-6` | Anthropic model |
| `OLLAMA_MODEL` | `llama3.2` | Local Ollama model |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | |
| `EMBED_PROVIDER` | `ollama` | `openai` or `ollama` |
| `EMBED_MODEL` | `nomic-embed-text` | Embedding model name |
| `VECTOR_DB` | `chroma` | `chroma` or `pgvector` |
| `DATABASE_URL` | — | `postgresql+psycopg://...` — Supabase connection string |
| `CHROMA_HOST` | `localhost` | |
| `CHROMA_PORT` | `8001` | |
| `BURST_LIMIT` | `3` | Max questions per IP per minute |
| `RATE_LIMIT_QUESTIONS` | `5` | Max questions per IP per window |
| `RATE_LIMIT_WINDOW_DAYS` | `3` | Window length in days |
| `GLOBAL_DAILY_LIMIT` | `100` | Max total questions per day |
| `MAX_MESSAGE_LENGTH` | `300` | Max characters per message |
| `LLM_MAX_TOKENS` | `500` | Max tokens per LLM response |
| `REDIS_URL` | — | Leave blank — uses in-memory |
| `BACKEND_CORS_ORIGINS` | `http://localhost:5173` | Comma-separated allowed origins |
| `SESSION_MEMORY_TURNS` | `6` | Conversation turns kept in memory |
| `RETRIEVAL_TOP_K` | `4` | Chunks retrieved per query |
| `BOT_NAME` | `Folio` | |
| `CONTACT_NAME` | — | Owner full name |
| `CONTACT_EMAIL` | — | Owner email |
| `CONTACT_LINKEDIN` | — | Full LinkedIn URL |
| `CONTACT_GITHUB` | — | Full GitHub URL |
| `SMTP_HOST` | `smtp.gmail.com` | |
| `SMTP_PORT` | `587` | |
| `SMTP_USER` | — | Gmail address |
| `SMTP_PASSWORD` | — | Gmail App Password |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Railway backend URL (no trailing slash) |
| `VITE_CONTACT_EMAIL` | |
| `VITE_CONTACT_LINKEDIN` | |
| `VITE_CONTACT_GITHUB` | |
| `VITE_OWNER_NAME` | |
| `VITE_BOT_NAME` | Chat widget header name |
| `VITE_BOT_INTRO` | Opening message in the chat |
| `VITE_OPEN_TO_WORK` | `true` / `false` — shows badge in nav |
| `VITE_RESET_SECRET` | Secret for `/?reset=<value>` rate limit reset |

---

## Data Sources

| File | Purpose | Ingested? |
|------|---------|-----------|
| `backend/data/resume.md` | Resume — primary source of truth | Yes |
| `backend/data/hr-questions-context.md` | Behavioral Q&A context | Yes |
| `backend/data/personality.md` | Folio's tone and style instructions | Injected at runtime (not vectorized) |
| `references/hr-questions-context.md` | Source copy — edit here, then copy to `backend/data/` | No |

---

## Chat Logging

Every completed Q&A pair is written to Supabase asynchronously after the response finishes streaming:

```sql
CREATE TABLE chat_logs (
  id bigserial primary key,
  created_at timestamptz default now(),
  session_id text,
  user_message text,
  ai_response text
);
```

RLS is enabled with no policies — only the service role (backend via `DATABASE_URL`) can write. The public anon key is blocked. View logs in Supabase → Table Editor → `chat_logs`.

Logging is skipped silently when `DATABASE_URL` is unset (local dev with Chroma).

---

## Deployment

See `DEPLOYMENT.md` for the full step-by-step guide.

```
Browser → Vercel (React + Vite, static)
             ↓ API calls (SSE)
         Railway (FastAPI in Docker)
             ↓ vector search
         Supabase pgvector (resume + Q&A embeddings)
             ↓ chat logging
         Supabase PostgreSQL (chat_logs table)
             ↓ LLM call
         OpenAI API (gpt-4o-mini)
```

### Railway build notes

- `railway.toml` uses `dockerfilePath = "backend/Dockerfile"` with no `buildContext` override — full repo root is the context
- Dockerfile COPYs from `backend/pyproject.toml`, `backend/uv.lock`, and `backend/` explicitly
- Health check: `GET /health` with 300s timeout

---

## Updating Resume Content

Source documents live in `references/` — edit them there, then copy to `backend/data/` before re-ingesting:

```bash
cp references/hr-questions-context.md backend/data/hr-questions-context.md
./0__run_ingest.sh
```

For production (Supabase pgvector), re-ingest locally with `VECTOR_DB=pgvector` and `DATABASE_URL` pointing to Supabase, then push the code change so Railway redeploys.

---

## Rate Limit Reset (Owner)

Navigate to `/?reset=<VITE_RESET_SECRET>` to clear the browser-side localStorage counter. The secret is set in Vercel env vars. Works on any device including mobile.
