# Resume Chatbot

A personal portfolio site with an embedded AI chatbot named **Folio**. Recruiters and HR professionals can ask natural language questions about Dan's background and experience. Answers are grounded in the resume via a RAG pipeline.

The site has two tabs — **Resume** (the interactive CV) and **About this App** (stack, architecture, data flow). Folio starts minimized; open it via the **Chat with Folio** button in the bottom-right corner.

**5 free questions per 3-day window per IP.** After the limit, a contact card appears.

---

## Stack

| Layer | Local Dev | Production |
|-------|-----------|------------|
| Frontend | React + Vite + Tailwind | Vercel |
| Backend | FastAPI (Python 3.13) | Railway |
| LLM | Ollama (llama3.2) | OpenAI gpt-4o-mini |
| Embeddings | nomic-embed-text (Ollama) | OpenAI text-embedding-3-small |
| Vector DB | ChromaDB (Docker) | Supabase pgvector |
| Rate limit | In-memory | In-memory |

---

## Quick Start

### 1. Start infrastructure (Ollama + ChromaDB)

```bash
docker compose up -d
```

### 2. Pull required models (first run only, ~2 GB)

```bash
docker exec ollama ollama pull llama3.2
docker exec ollama ollama pull nomic-embed-text
```

### 3. Backend

```bash
cd backend
cp .env.example .env   # edit contact info and review defaults
uv sync                # install dependencies
```

### 4. Ingest, backend, and frontend — use the root scripts

```bash
./0__run_ingest.sh     # embed resume into ChromaDB
./1__run_backend.sh    # start FastAPI on port 8000
./2__run_frontend.sh   # start Vite on port 5173 (new terminal)
```

Open [http://localhost:5173](http://localhost:5173).

---

## Updating Resume Content

Source documents live in `references/` — edit them there, then copy to `backend/data/` before re-ingesting:

```bash
# After editing references/hr-questions-context.md:
cp references/hr-questions-context.md backend/data/hr-questions-context.md

# Re-ingest to update the vector DB:
./0__run_ingest.sh
```

| File | Purpose |
|------|---------|
| `references/hr-questions-context.md` | Source — HR Q&A answers (edit here) |
| `references/Reiniel_Pablo_Software_Developer.pdf` | Original resume PDF |
| `references/resume-chatbot-spec.md` | Project specification |
| `backend/data/resume.md` | Working copy — what the chatbot reads |
| `backend/data/hr-questions-context.md` | Working copy — what the chatbot reads |

---

## Switching LLM Provider

Edit `backend/.env` and restart the backend:

```bash
# OpenAI (same key as embeddings)
LLM_PROVIDER=openai
OPENAI_MODEL=gpt-4o-mini
OPENAI_API_KEY=sk-...

# Claude
LLM_PROVIDER=claude
CLAUDE_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-sonnet-4-6
```

---

## Security

Three layers protect against API cost abuse — see [API_SECURITY.md](API_SECURITY.md) for full details.

| Layer | Protection |
|-------|-----------|
| Input guard | Max message length + prompt injection detection |
| Per-IP rate limit | Burst (3/min) + window (5/3 days) |
| Global daily cap | Hard stop at 100 questions/day across all users |
| Contact form guard | IP rate limit (3/hr) + honeypot + field validation + spam keyword filter |

**Set a hard spending limit in your OpenAI dashboard** (Billing → Limits → Hard limit: $5/month) as the ultimate backstop.

---

## Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full step-by-step guide.

**Stack:** Vercel (frontend) · Railway (backend) · Supabase pgvector (vectors) · OpenAI API (LLM + embeddings)
