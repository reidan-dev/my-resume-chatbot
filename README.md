# Resume Chatbot

A personal portfolio site with an embedded AI chatbot. Recruiters and HR professionals can ask natural language questions about Dan's background and experience. Answers are grounded in the resume via a RAG pipeline.

**5 free questions per 3-day window per IP.** After the limit, a contact card appears.

---

## Stack

| Layer | Local Dev | Production |
|-------|-----------|------------|
| Frontend | React + Vite + Tailwind | Vercel / Netlify |
| Backend | FastAPI (Python 3.11) | Render / Railway |
| LLM | Ollama (llama3) | Claude API |
| Embeddings | nomic-embed-text (Ollama) | OpenAI embeddings |
| Vector DB | ChromaDB (Docker) | Pinecone |
| Rate limit | In-memory | Redis |

---

## First-time Setup

### 1. Start infrastructure (Ollama + ChromaDB)

```bash
docker compose up -d
```

### 2. Pull required models (first run only, ~4 GB)

```bash
docker exec ollama ollama pull llama3
docker exec ollama ollama pull nomic-embed-text
```

### 3. Backend

```bash
cd backend
cp .env.example .env        # already copied — edit values if needed
uv sync                     # install all deps
uv run python -m rag.ingest # embed resume into ChromaDB
uv run uvicorn main:app --reload --port 8000
```

### 4. Frontend (new terminal)

```bash
cd frontend
cp .env.example .env.local  # already copied
npm install
npm run dev                 # opens http://localhost:5173
```

---

## Updating Resume Content

Source documents live in `references/` — edit them there, then copy to `backend/data/` before re-ingesting:

```bash
# After editing references/hr-questions-context.md:
cp references/hr-questions-context.md backend/data/hr-questions-context.md

# After editing backend/data/resume.md directly, or re-copying from references/:
cd backend
uv run python -m rag.ingest
```

| File | Purpose |
|------|---------|
| `references/hr-questions-context.md` | Source — HR Q&A answers (edit here) |
| `references/Reiniel_Pablo_Software_Developer.pdf` | Original resume PDF |
| `references/resume-chatbot-spec.md` | Project specification |
| `backend/data/resume.md` | Working copy — what the chatbot reads |
| `backend/data/hr-questions-context.md` | Working copy — what the chatbot reads |

---

## Switching to Claude API

Edit `backend/.env`:

```bash
LLM_PROVIDER=claude
CLAUDE_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-sonnet-4-6
```

Then restart the backend.

---

## Production Deployment

- **Backend → Render / Railway / Fly.io**: set all env vars from `.env.example`, switch `LLM_PROVIDER=claude`, `VECTOR_DB=pinecone`, add `REDIS_URL`
- **Frontend → Vercel / Netlify**: set `VITE_API_URL=https://your-backend.domain`, set all `VITE_CONTACT_*` vars
- Run `uv run python -m rag.ingest` once pointed at the prod Pinecone index after first deploy
