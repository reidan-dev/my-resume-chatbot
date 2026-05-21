# Deployment Guide

**Stack:** Vercel (frontend) · Railway (backend) · Supabase (vector DB) · OpenAI API (LLM + embeddings)

**Time to complete:** ~30–45 minutes

---

## Before you start — accounts and API keys to gather

Create accounts on all four services first, then collect the values below. You'll paste them into the platforms in the steps that follow.

| # | What | Where to get it | You'll fill this in |
|---|------|----------------|---------------------|
| 1 | OpenAI API key | [platform.openai.com](https://platform.openai.com) → API Keys → Create Key | `sk-...` |
| 2 | Supabase DB password | Set by you when creating the Supabase project | your chosen password |
| 3 | Supabase connection string | Supabase dashboard (Step 3.3 below) | `postgresql+psycopg://...` |
| 4 | Railway backend URL | Railway dashboard (Step 5.5 below) | `https://....up.railway.app` |
| 5 | Vercel frontend URL | Vercel dashboard (Step 6.3 below) | `https://....vercel.app` |

---

## Step 0 — Test OpenAI locally before deploying

Before touching any cloud services, verify that the OpenAI integration works on your machine. This catches API key issues and model errors before you deploy.

### 0.1 Switch backend/.env to OpenAI

Open `backend/.env` and update these lines:

```bash
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...        # your key from platform.openai.com
EMBED_PROVIDER=openai
EMBED_MODEL=text-embedding-3-small

VECTOR_DB=chroma             # keep chroma for now — no Supabase needed yet
```

### 0.2 Re-ingest and run

```bash
./0__run_ingest.sh     # re-embeds docs using OpenAI embeddings
./1__run_backend.sh    # start FastAPI
./2__run_frontend.sh   # start Vite (new terminal)
```

### 0.3 Verify

Open [http://localhost:5173](http://localhost:5173) and ask Folio a question. If you get a streaming response, OpenAI is working correctly. ✓

If you see an error, check the backend terminal logs — it's almost always a wrong or missing `OPENAI_API_KEY`.

---

## Step 2 — Push your code to GitHub

Both Vercel and Railway deploy directly from a GitHub repo.

```bash
# From the project root
git add .
git commit -m "initial commit"
git push origin main
```

If you haven't created a GitHub repo yet:
1. Go to [github.com/new](https://github.com/new)
2. Create a **private** repo (recommended for a personal portfolio with API keys in env vars)
3. Follow the instructions GitHub gives you to push an existing repo

---

## Step 3 — Supabase (vector database)

### 1.1 Create a project

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Fill in:
   - **Name:** anything, e.g. `resume-chatbot`
   - **Database password:** choose a strong password — **save this, you'll need it**
   - **Region:** pick the one closest to you
3. Click **Create new project** and wait ~1 minute for it to provision

### 1.2 Enable the pgvector extension

1. In the left sidebar → **SQL Editor**
2. Click **New query**
3. Paste and run:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

4. Click **Run** — you should see `Success. No rows returned`

### 1.3 Get your connection string

1. Left sidebar → **Project Settings** (gear icon at the bottom)
2. Click **Database**
3. Scroll down to **Connection string**
4. Make sure the tab says **URI** (not Pooling)
5. Copy the string — it looks like:

```
postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijkl.supabase.co:5432/postgres
```

6. **Edit the prefix** — change `postgresql://` to `postgresql+psycopg://`:

```
postgresql+psycopg://postgres:[YOUR-PASSWORD]@db.abcdefghijkl.supabase.co:5432/postgres
```

> This prefix tells the Python driver to use psycopg3. Without it the connection will fail.

**Save this full string** — you will paste it as `DATABASE_URL` in Steps 2 and 3.

---

## Step 4 — Ingest the resume into Supabase (run locally, once)

This embeds your resume into the Supabase database so the chatbot can search it. You run this from your machine — not on any server.

### 2.1 Update your local `backend/.env`

Open `backend/.env` and change these values:

```bash
# Change these four lines:
VECTOR_DB=pgvector
DATABASE_URL=postgresql+psycopg://postgres:[YOUR-PASSWORD]@db.[YOUR-REF].supabase.co:5432/postgres
EMBED_PROVIDER=openai
OPENAI_API_KEY=sk-...

# Leave everything else as-is
```

### 2.2 Run the ingest

From the project root:

```bash
./0__run_ingest.sh
```

Expected output:
```
Ingesting into pgvector...
  data/resume.md: 16 chunks
  data/hr-questions-context.md: 47 chunks
Embedding and storing 63 chunks...
Done. 63 chunks ingested into pgvector.
```

### 2.3 Verify in Supabase

1. Go to your Supabase project → **Table Editor** (left sidebar)
2. You should see a table called `langchain_pg_embedding`
3. Click it — it should have rows (one per chunk)

If the table exists with rows, the ingest worked. ✓

---

## Step 5 — Railway (backend)

### 3.1 Create a project

1. Go to [railway.app](https://railway.app) → **New Project**
2. Click **Deploy from GitHub repo**
3. Authorize Railway to access your GitHub if prompted
4. Select your repository from the list
5. Railway will detect `railway.toml` and start a build automatically — let it run

### 3.2 Open the service settings

Once the project loads:
1. Click on the service card that appeared
2. Click the **Variables** tab at the top

### 3.3 Add environment variables

Click **Add Variable** for each one below. The table shows exactly what to type in the **Name** and **Value** fields.

**Variables to add — replace anything in `[ ]` with your real value:**

| Name | Value | Notes |
|------|-------|-------|
| `LLM_PROVIDER` | `openai` | |
| `OPENAI_MODEL` | `gpt-4o-mini` | Keep as-is |
| `OPENAI_API_KEY` | `sk-...` | From Step 1 prerequisites — used for both chat and embeddings |
| `EMBED_PROVIDER` | `openai` | |
| `EMBED_MODEL` | `text-embedding-3-small` | Keep as-is |
| `VECTOR_DB` | `pgvector` | |
| `DATABASE_URL` | `postgresql+psycopg://postgres:...` | Full string from Step 3.3 |
| `RATE_LIMIT_QUESTIONS` | `5` | Layer 2: questions per IP per window |
| `RATE_LIMIT_WINDOW_DAYS` | `3` | |
| `BURST_LIMIT` | `3` | Layer 2: questions per IP per minute |
| `GLOBAL_DAILY_LIMIT` | `100` | Layer 3: total questions/day across all users |
| `MAX_MESSAGE_LENGTH` | `300` | Layer 1: max characters per message |
| `LLM_MAX_TOKENS` | `500` | Max tokens per LLM response |
| `REDIS_URL` | *(leave empty)* | In-memory is fine for now |
| `CONTACT_NAME` | `Reiniel Dan Pablo` | Your name |
| `CONTACT_EMAIL` | `reinieldan@gmail.com` | Your email |
| `CONTACT_LINKEDIN` | `https://www.linkedin.com/in/reiniel-dan-pablo` | Your LinkedIn |
| `CONTACT_GITHUB` | `https://github.com/reidan-dev` | Your GitHub |
| `BACKEND_CORS_ORIGINS` | `https://your-app.vercel.app` | **Placeholder for now** — update after Step 6 |
| `SESSION_MEMORY_TURNS` | `6` | |
| `RETRIEVAL_TOP_K` | `4` | |
| `BOT_NAME` | `Folio` | Display name shown in the chat header |
| `SMTP_HOST` | e.g. `smtp.gmail.com` | For the contact form email sender |
| `SMTP_PORT` | `587` | |
| `SMTP_USER` | your Gmail address | Sender account |
| `SMTP_PASSWORD` | your app password | Gmail → Security → App Passwords |

### 3.4 Trigger a deploy

After adding variables, Railway redeploys automatically. Watch the **Deployments** tab — the build takes ~2 minutes.

When it shows a green **Active** badge, the backend is live.

### 3.5 Get your backend URL

1. Click the **Settings** tab
2. Scroll to **Domains**
3. Click **Generate Domain**
4. Copy the URL — it looks like `https://my-resume-chatbot-production.up.railway.app`

**Save this URL** — you'll need it in Step 6.

### 3.6 Verify the backend is working

Open this in your browser (replace with your actual URL):

```
https://my-resume-chatbot-production.up.railway.app/health
```

You should see:
```json
{"status": "ok", "model": "gpt-4o-mini"}
```

If you see an error, check the **Deployments → Logs** tab in Railway for details.

---

## Step 6 — Vercel (frontend)

### 4.1 Import the project

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Click **Import Git Repository**
3. Find and select your GitHub repo
4. **Important:** Under **Root Directory**, click **Edit** and type `frontend`
5. Leave **Framework Preset** as **Vite** (auto-detected)
6. Do **not** click Deploy yet — add env vars first

### 4.2 Add environment variables

Still on the same import screen, scroll down to **Environment Variables**.

Add each one:

| Name | Value | Notes |
|------|-------|-------|
| `VITE_API_URL` | `https://my-resume-chatbot-production.up.railway.app` | Your Railway URL from Step 5.5 — **no trailing slash** |
| `VITE_CONTACT_EMAIL` | `reinieldan@gmail.com` | Your email |
| `VITE_CONTACT_LINKEDIN` | `https://www.linkedin.com/in/reiniel-dan-pablo` | Your LinkedIn |
| `VITE_CONTACT_GITHUB` | `https://github.com/reidan-dev` | Your GitHub |
| `VITE_OWNER_NAME` | `Reiniel Dan Pablo` | Your name |
| `VITE_BOT_NAME` | `Folio` | Chat widget header name |
| `VITE_BOT_INTRO` | `Hey there! I'm Folio, Dan's AI portfolio assistant — powered by a RAG pipeline that grounds every answer directly in his resume and Q&A guide, so no guessing here. Ask me anything about his background, skills, or experience!` | Opening message in the chat |
| `VITE_OPEN_TO_WORK` | `true` or `false` | Shows/hides the "Open to work" badge in the nav and resume header |

### 4.3 Deploy

Click **Deploy**. Vercel builds in ~30 seconds.

When done, you'll see a URL like `https://my-resume-chatbot.vercel.app`.

**Save this URL** — you need it for the next step.

### 4.4 Update CORS on Railway

The backend currently has a placeholder for `BACKEND_CORS_ORIGINS`. Update it now:

1. Go back to Railway → your service → **Variables**
2. Find `BACKEND_CORS_ORIGINS`
3. Change the value to your real Vercel URL:
   ```
   https://my-resume-chatbot.vercel.app
   ```
4. Railway redeploys automatically (~1 minute)

---

## Step 7 — Verify everything works end-to-end

1. Open your Vercel URL in a browser
2. The resume page should load — two tabs at the top: **Resume** and **About this App**
3. The **Folio** chat widget opens automatically in the bottom-right corner
4. Type: `What is Dan's strongest programming language?`
5. You should see a streaming response appear within a few seconds

If the chat responds correctly, your deployment is complete. ✓

---

## Summary of what you deployed

```
Browser → https://your-app.vercel.app        (Vercel — static React + Vite app)
             ↓ API calls (SSE streaming)
         https://your-app.up.railway.app      (Railway — FastAPI backend)
             ↓ vector search
         Supabase pgvector                    (resume + HR Q&A embeddings)
             ↓ LLM call
         OpenAI API (gpt-4o-mini)             (generates the streamed answer)
```

---

## Updating resume content after deployment

When you edit `backend/data/resume.md` or `backend/data/hr-questions-context.md`:

```bash
# 1. Re-ingest to update the Supabase vectors
# Confirm backend/.env has VECTOR_DB=pgvector and DATABASE_URL pointing to Supabase
./0__run_ingest.sh

# 2. Push code changes so Railway redeploys with the latest files
git add backend/data/
git commit -m "update resume content"
git push
```

---

## Adding a custom domain (optional)

**Vercel:**
1. Project → **Settings** → **Domains**
2. Type your domain and click **Add**
3. Vercel shows you the DNS records to add — go to your domain registrar and add them

**Railway:**
1. Service → **Settings** → **Domains** → **Add Custom Domain**
2. Add the CNAME record Railway gives you to your DNS

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Chat shows no response / blank | Resume not ingested into Supabase | Re-run Step 4 |
| `CORS error` in browser console | `BACKEND_CORS_ORIGINS` wrong | Update it in Railway to match your exact Vercel URL |
| `connection refused` or DB error | Wrong `DATABASE_URL` prefix | Must start with `postgresql+psycopg://` not `postgresql://` |
| Railway build fails with `uv.lock` error | Lockfile out of sync | Run `cd backend && uv sync` locally and push the updated `uv.lock` |
| Vercel build fails | Wrong root directory | Go to Vercel → Project Settings → General → Root Directory → set to `frontend` |
| Railway `health` endpoint returns 500 | Missing env var | Check Railway logs, compare Variables against Step 5.3 table |
| Chat works locally but not in prod | `VITE_API_URL` pointing to localhost | Update in Vercel environment variables to your Railway URL |
