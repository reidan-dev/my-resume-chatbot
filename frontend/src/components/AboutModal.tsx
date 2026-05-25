import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const stack = [
  { layer: 'Frontend',     items: 'React 18 · TypeScript · Vite · Tailwind CSS v3 · Lucide React' },
  { layer: 'Backend',      items: 'Python 3.13 · FastAPI · LangChain · Server-Sent Events (SSE streaming) · uv' },
  { layer: 'AI / LLM',     items: 'OpenAI gpt-4o-mini (chat) · text-embedding-3-small (embeddings)' },
  { layer: 'Vector Store', items: 'ChromaDB (local dev) · Supabase pgvector (production)' },
  { layer: 'Database',     items: 'Supabase (PostgreSQL) — pgvector for embeddings, chat_logs for conversation history' },
  { layer: 'Deployment',   items: 'Vercel (frontend) · Railway (backend, Dockerized) · Supabase (hosted DB)' },
  { layer: 'Security',     items: '4-layer protection — input guard · per-IP rate limiting · global daily cap · contact form guard' },
]

const dataFlow = [
  {
    step: '1 — Ingest (run once)',
    desc: "Resume and HR Q&A guide are loaded, chunked by LangChain's MarkdownHeaderTextSplitter, embedded via text-embedding-3-small, and stored in Supabase pgvector. Re-run any time the source files change.",
  },
  {
    step: '2 — Retrieval',
    desc: 'Each user message is embedded with the same model and used to perform a cosine similarity search against the vector store. The top-k most relevant document chunks are retrieved as grounding context.',
  },
  {
    step: '3 — Generation',
    desc: 'Retrieved chunks, the full chat history, and a system prompt (from personality.md) are assembled and sent to gpt-4o-mini. The LLM streams tokens back to FastAPI via the OpenAI async streaming API.',
  },
  {
    step: '4 — Streaming to client',
    desc: 'FastAPI forwards each token as a Server-Sent Event (SSE). The React frontend reads the stream incrementally, rendering text in real-time. Source chunk metadata is shown below each response.',
  },
  {
    step: '5 — Conversation logging',
    desc: 'After each completed response, the question and answer are written asynchronously to a chat_logs table in Supabase. This is fire-and-forget — it never delays the response.',
  },
]

const security = [
  {
    layer: 'Layer 1 — Input Guard',
    desc: 'Messages are validated for length (max 300 chars) and scanned for prompt injection patterns before reaching the LLM. Violations return HTTP 400 immediately.',
  },
  {
    layer: 'Layer 2 — Per-IP Rate Limiting',
    desc: 'A sliding window limiter tracks requests per IP with two sub-limits: burst (max 3/minute) and window (configurable per mode). IP is read from the last X-Forwarded-For hop to prevent spoofing.',
  },
  {
    layer: 'Layer 3 — Global Daily Cap',
    desc: 'A shared in-memory counter caps total API calls across all users per day. Catches VPN rotation and distributed bots that bypass per-IP limits.',
  },
  {
    layer: 'Layer 4 — Contact Form Guard',
    desc: 'The contact form has its own protection: IP rate limit (3/hour), a hidden honeypot field, field length validation, URL count cap, and a keyword filter for spam terms.',
  },
]

const features = [
  'RAG-grounded responses — answers are strictly derived from the indexed resume and Q&A guide.',
  'Real-time streaming — tokens stream as they are generated via SSE.',
  'Source badges — each AI response shows which resume section was retrieved as context.',
  '"Dan" is interactive — every mention in an AI response opens a contact modal.',
  'Conversation memory — the last 6 turns are included in every prompt for follow-up context.',
  'Contact form with spam protection — honeypot, IP rate limit, field validation, and keyword filter.',
  'Conversation logging — every Q&A pair is stored in Supabase for owner review.',
  'Mobile-first responsive design — bottom sheet on mobile, floating widget on desktop.',
]

interface Props {
  onClose: () => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        {title}
      </h3>
      {children}
    </section>
  )
}

export function AboutModal({ onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-2xl bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90dvh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">About Folio</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">How this AI resume site works</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-5 py-5 flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
            This resume site is a full-stack AI application — not just a static page.{' '}
            <strong className="text-gray-700 dark:text-gray-200">Folio</strong> is a Retrieval-Augmented
            Generation (RAG) chatbot that lets recruiters ask natural-language questions about Dan's background
            and get grounded, accurate answers in real time.
          </p>

          <Section title="Tech Stack">
            <div className="space-y-2">
              {stack.map(({ layer, items }) => (
                <div key={layer} className="flex flex-col sm:flex-row sm:gap-3 text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-200 sm:w-28 shrink-0">{layer}</span>
                  <span className="text-gray-500 dark:text-gray-400">{items}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="How It Works">
            <div className="space-y-3">
              {dataFlow.map(({ step, desc }) => (
                <div key={step}>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-0.5">{step}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Security Layers">
            <div className="space-y-3">
              {security.map(({ layer, desc }) => (
                <div key={layer}>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-0.5">{layer}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Features">
            <ul className="space-y-1.5">
              {features.map((f) => (
                <li key={f} className="text-sm text-gray-600 dark:text-gray-300 flex gap-2">
                  <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>
    </div>,
    document.body
  )
}
