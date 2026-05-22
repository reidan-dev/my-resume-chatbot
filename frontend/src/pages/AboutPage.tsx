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
    items: 'React 18 · TypeScript · Vite · Tailwind CSS v3 · Lucide React',
  },
  {
    layer: 'Backend',
    items: 'Python 3.13 · FastAPI · LangChain · Server-Sent Events (SSE streaming) · uv',
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
    layer: 'Database',
    items: 'Supabase (PostgreSQL) — pgvector for embeddings, chat_logs for conversation history',
  },
  {
    layer: 'Deployment',
    items: 'Vercel (frontend) · Railway (backend, Dockerized) · Supabase (hosted DB)',
  },
  {
    layer: 'Security',
    items: '4-layer protection — input guard · per-IP rate limiting · global daily cap · contact form guard',
  },
]

const dataFlow = [
  {
    step: '1 — Ingest (run once)',
    desc: 'Resume and HR Q&A guide markdown files are loaded, chunked by LangChain\'s RecursiveCharacterTextSplitter, embedded via text-embedding-3-small, and stored in ChromaDB (local) or Supabase pgvector (production). Re-run any time the source files change.',
  },
  {
    step: '2 — Retrieval',
    desc: 'Each user message is embedded with the same model and used to perform a cosine similarity search against the vector store. The top-k most relevant document chunks are retrieved as grounding context.',
  },
  {
    step: '3 — Generation',
    desc: 'Retrieved chunks, the full chat history, and a system prompt (loaded from personality.md) are assembled and sent to gpt-4o-mini. The LLM streams tokens back to FastAPI via the OpenAI async streaming API.',
  },
  {
    step: '4 — Streaming to client',
    desc: 'FastAPI forwards each token as a Server-Sent Event (SSE). The React frontend reads the stream incrementally, rendering text in real-time. Source chunk metadata (which section of the resume was used) is shown below each response.',
  },
  {
    step: '5 — Conversation logging',
    desc: 'After each completed response, the question and answer are written asynchronously to a chat_logs table in Supabase. This is fire-and-forget — it never delays the response. Users are disclosed via the chat footer.',
  },
]

const security = [
  {
    layer: 'Layer 1 — Input Guard',
    desc: 'Incoming messages are validated for length (max 300 characters) and scanned for known prompt injection patterns ("ignore previous instructions", "jailbreak", "reveal system prompt", etc.) before reaching the LLM. Violations return HTTP 400 immediately.',
  },
  {
    layer: 'Layer 2 — Per-IP Rate Limiting',
    desc: 'A sliding window rate limiter tracks requests per IP with two sub-limits: burst (max 3/minute) to stop rapid-fire bots, and window (max 5 per 3-day period) for sustained abuse. The trusted IP is read from the last X-Forwarded-For hop to prevent spoofing.',
  },
  {
    layer: 'Layer 3 — Global Daily Cap',
    desc: 'A shared in-memory counter tracks total API calls across all users. Once the daily limit (100 questions) is reached, all chat requests return HTTP 503 until midnight UTC. Catches VPN rotation and distributed bot attacks that bypass per-IP limits.',
  },
  {
    layer: 'Layer 4 — Contact Form Guard',
    desc: 'The contact form has its own independent protection: IP rate limit (3 submissions/hour), a hidden honeypot field that bots fill, field length validation, URL count cap (blocks link-spam), and a keyword filter for known spam terms.',
  },
]

const features = [
  'RAG-grounded responses — answers are strictly derived from the indexed resume and Q&A guide; the LLM is instructed not to invent facts outside the provided context.',
  'Real-time streaming — tokens stream as they are generated via SSE, with an animated typing indicator while the model is working.',
  'Source badges — each AI response shows which section of the resume was retrieved as context.',
  'Configurable bot personality — Folio\'s name, tone, and intro message are set via environment variables, making the chatbot easy to repersonalize without touching code.',
  '"Dan" is interactive — every mention of "Dan" in an AI response is a clickable link that opens a contact modal with a direct email form.',
  'Conversation memory — the last 6 turns of chat history are included in every prompt so Folio can answer follow-up questions in context.',
  'Contact form with spam protection — honeypot, IP rate limit, field validation, URL cap, and keyword filter before any email is sent.',
  'Conversation logging — every Q&A pair is stored in Supabase for owner review. Disclosed in the chat footer.',
  'Mobile-first responsive design — bottom sheet on mobile (slides up with safe-area support), floating widget on desktop.',
  'Nav actions — Open to work badge, share (Web Share API with clipboard fallback), and print icon always visible at the top.',
]

export function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">About</h1>
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
