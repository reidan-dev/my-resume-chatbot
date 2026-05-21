function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3 pb-2 border-b border-gray-200">
        {title}
      </h2>
      {children}
    </section>
  )
}

const stack = [
  {
    layer: 'Frontend',
    items: 'React 18 · TypeScript · Vite · Tailwind CSS v3 · Lucide React · ReactMarkdown',
  },
  {
    layer: 'Backend',
    items: 'Python 3.11 · FastAPI · LangChain · Server-Sent Events (SSE streaming)',
  },
  {
    layer: 'AI / LLM',
    items: 'OpenAI gpt-4o-mini (chat) · text-embedding-3-small (embeddings)',
  },
  {
    layer: 'Vector Store',
    items: 'ChromaDB (local dev) · Supabase pgvector (production)',
  },
  {
    layer: 'Deployment',
    items: 'Vercel (frontend) · Railway (backend) · Supabase (hosted DB)',
  },
  {
    layer: 'Security',
    items: '3-layer rate limiting · Input injection guard · Global daily API cap',
  },
]

const dataFlow = [
  {
    step: '1 — Ingest (run once)',
    desc: 'Resume and HR Q&A guide markdown files are loaded, chunked by LangChain\'s RecursiveCharacterTextSplitter, then embedded via text-embedding-3-small and stored in ChromaDB (local) or Supabase pgvector (production). Run via the ingest script at the root.',
  },
  {
    step: '2 — Retrieval',
    desc: 'Each user message is embedded with the same model and used to perform a cosine similarity search against the vector store. The top-k most relevant document chunks are retrieved as grounding context.',
  },
  {
    step: '3 — Generation',
    desc: 'Retrieved chunks, the full chat history, and a configurable system prompt (loaded from personality.md) are assembled and sent to gpt-4o-mini. The LLM streams tokens back to FastAPI via the OpenAI async streaming API.',
  },
  {
    step: '4 — Streaming to client',
    desc: 'FastAPI forwards each token as a Server-Sent Event (SSE). The React frontend reads the stream incrementally, rendering markdown in real-time with a typing indicator. Source chunk metadata is displayed in a collapsible RAG trail below each response.',
  },
]

const security = [
  {
    layer: 'Layer 1 — Input Guard',
    desc: 'Incoming messages are scanned for known prompt injection patterns ("ignore previous instructions", "jailbreak", "reveal system prompt", etc.) before reaching the LLM. Invalid requests are rejected with HTTP 400.',
  },
  {
    layer: 'Layer 2 — Per-IP Rate Limiting',
    desc: 'A sliding window rate limiter tracks requests per IP. A burst check (max 3 requests/minute) catches rapid-fire abuse. Exceeding limits returns HTTP 429. On Railway, the trusted IP is read from the last X-Forwarded-For hop to prevent spoofing.',
  },
  {
    layer: 'Layer 3 — Global Daily Cap',
    desc: 'A thread-safe in-memory counter tracks total API calls across all users. Once the daily limit is hit, all chat requests return HTTP 503 until midnight reset. This is the hard backstop against cost overruns.',
  },
]

const features = [
  'RAG-grounded responses — answers are strictly derived from the indexed resume and Q&A guide; the LLM is instructed not to invent facts outside the provided context.',
  'Real-time streaming — tokens stream as they are generated via SSE, with an animated typing indicator while the model is working.',
  'Collapsible RAG trail — each AI response shows which document chunks were retrieved, collapsed by default to keep the UI clean.',
  'Configurable bot personality — Folio\'s name, tone, and emphasis points are defined in personality.md and injected at startup, making the chatbot easy to repersonalize without touching code.',
  '"Dan" is interactive — every mention of "Dan" in an AI response is a clickable link that opens a contact modal with a direct email form.',
  'Strict third-person enforcement — the system prompt explicitly forbids first-person language; the bot always refers to Dan in third person regardless of how questions are phrased.',
  'Startup suggestion — one random suggested question is shown on open to prompt engagement without cluttering the UI.',
]

export function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">About this App</h1>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          This portfolio site is a full-stack AI application — not just a static resume.{' '}
          <strong className="text-gray-700">Folio</strong> is a Retrieval-Augmented Generation (RAG) chatbot
          that lets recruiters and HR professionals ask natural-language questions about Dan's background
          and get grounded, accurate answers in real time.
        </p>
      </header>

      <Section title="Tech Stack">
        <div className="space-y-2">
          {stack.map(({ layer, items }) => (
            <div key={layer} className="flex flex-col sm:flex-row sm:gap-3 text-sm">
              <span className="font-medium text-gray-700 sm:w-32 shrink-0">{layer}</span>
              <span className="text-gray-500">{items}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Data Flow">
        <div className="space-y-4">
          {dataFlow.map(({ step, desc }) => (
            <div key={step}>
              <div className="text-sm font-semibold text-gray-800 mb-1">{step}</div>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Security Layers">
        <div className="space-y-4">
          {security.map(({ layer, desc }) => (
            <div key={layer}>
              <div className="text-sm font-semibold text-gray-800 mb-1">{layer}</div>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Features">
        <ul className="space-y-2">
          {features.map((f) => (
            <li key={f} className="text-sm text-gray-600 flex gap-2">
              <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </Section>

    </div>
  )
}
