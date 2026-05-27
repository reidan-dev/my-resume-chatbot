import { useState, useEffect, useRef } from 'react'
import { Shield, Code2, Brain, Check, Lock, Zap, Server, Globe, Database, Mail } from 'lucide-react'

// ─── Typewriter hook ─────────────────────────────────────────────────────────

const BASE_TEXT = 'Ask my resume anything.'

const QUESTIONS = [
  'What kind of backend projects has Dan worked on?',
  'Does Dan have experience with cloud platforms?',
  'Has Dan built any AI-powered applications?',
  'Does Dan have experience with hardware or IoT systems?',
  'Can Dan work with frontend frameworks?',
  'Has Dan done any data analysis or reporting work?',
  'Does Dan have experience mentoring or teaching?',
  'Does Dan have experience with automated deployments?',
]

function useTypewriter() {
  const reduced = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [text, setText] = useState(BASE_TEXT)

  useEffect(() => {
    if (reduced.current) return

    const cancelled = { current: false }
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

    const typeOut = async (target: string) => {
      for (let i = 0; i <= target.length; i++) {
        if (cancelled.current) return
        setText(target.slice(0, i))
        let delay = 24 + Math.random() * 16
        const prev = target[i - 1]
        if (prev === ' ' && Math.random() < 0.4) delay += 30
        if (prev === ',' || prev === '?') delay += 60
        if (Math.random() < 0.06) delay += 55  // rare stumble
        await sleep(delay)
      }
    }

    const eraseBack = async (current: string) => {
      for (let i = current.length; i >= 0; i--) {
        if (cancelled.current) return
        setText(current.slice(0, i))
        await sleep(18 + Math.random() * 12)
      }
    }

    async function loop() {
      await sleep(6000 + Math.random() * 3000)   // initial static hold
      let lastIdx = -1

      while (!cancelled.current) {
        let idx: number
        do { idx = Math.floor(Math.random() * QUESTIONS.length) } while (idx === lastIdx)
        lastIdx = idx
        const q = QUESTIONS[idx]

        await eraseBack(BASE_TEXT)
        if (cancelled.current) return
        await sleep(180)

        await typeOut(q)
        if (cancelled.current) return
        await sleep(3000 + Math.random() * 2000)  // hold question

        await eraseBack(q)
        if (cancelled.current) return
        await sleep(180)

        await typeOut(BASE_TEXT)
        if (cancelled.current) return
        await sleep(5000 + Math.random() * 3000)  // hold base text
      }
    }

    loop()
    return () => { cancelled.current = true }
  }, [])

  return { text, animated: !reduced.current }
}

// ─── Flow diagram — vertical step cards ─────────────────────────────────────

type FlowStep = {
  emoji: string
  title: string
  sub: string
  desc: string
  highlight?: boolean
}

const humanSteps: FlowStep[] = [
  {
    emoji: '📄',
    title: 'My Resume',
    sub: 'Experience, skills & projects',
    desc: "Everything about Dan lives here — experience, skills, education. It's the single source of truth the chatbot draws from.",
  },
  {
    emoji: '🤖',
    title: 'Folio Chatbot',
    sub: 'Finds the relevant parts & answers',
    desc: 'You ask a question. Folio searches the resume, finds the most relevant sections, and crafts a natural answer grounded strictly in the facts.',
    highlight: true,
  },
  {
    emoji: '💬',
    title: 'Your Answer',
    sub: 'Natural language, streamed in real time',
    desc: 'The answer appears token by token as it generates — not a copy-paste, but a genuine explanation based on what the resume actually says.',
  },
  {
    emoji: '📌',
    title: 'Source Citation',
    sub: 'Verified & explorable',
    desc: 'Every answer includes a badge showing which resume section was used as context. You can verify the answer and explore the original text.',
  },
]

const techSteps: FlowStep[] = [
  {
    emoji: '📄',
    title: 'Embed',
    sub: 'Resume + Q&A guide → pgvector index',
    desc: "The resume and Q&A guide are split into chunks and converted to vectors using OpenAI's text-embedding-3-small. These live in pgvector on Supabase — a searchable index of meaning, not just keywords.",
  },
  {
    emoji: '🧠',
    title: 'Retrieve',
    sub: 'Semantic search via LangChain',
    desc: "Your question is embedded the same way, then LangChain queries pgvector for the most semantically similar chunks. It's like a librarian who remembers every line of the resume.",
    highlight: true,
  },
  {
    emoji: '⚡',
    title: 'Generate',
    sub: 'gpt-4o-mini prompt → SSE stream',
    desc: 'The retrieved chunks and your question form a prompt for gpt-4o-mini. The model streams its response via Server-Sent Events — tokens arrive one by one, not all at once.',
  },
  {
    emoji: '🔗',
    title: 'Cite',
    sub: 'Context → clickable source badge',
    desc: 'Each answer includes source badges showing which resume section was retrieved. You can verify the answer and click through to explore the original text.',
  },
]

function FlowDiagram({ steps }: { steps: FlowStep[] }) {
  return (
    <div>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        return (
          <div key={i} className="flex gap-4">
            {/* Left column: step number + connector line */}
            <div className="flex flex-col items-center pt-1 shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                step.highlight
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-900/50'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
              }`}>
                {i + 1}
              </div>
              {!isLast && (
                <div className="w-px flex-1 my-2 bg-gradient-to-b from-gray-200 dark:from-gray-700 to-transparent" />
              )}
            </div>

            {/* Right column: card */}
            <div className={`flex-1 mb-3 rounded-xl border p-4 ${
              step.highlight
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/60'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex items-center justify-center text-xl shrink-0 shadow-sm">
                  {step.emoji}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold leading-snug ${
                    step.highlight ? 'text-emerald-900 dark:text-emerald-100' : 'text-gray-900 dark:text-gray-100'
                  }`}>{step.title}</p>
                  <p className={`text-[10px] font-medium mt-0.5 leading-snug ${
                    step.highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'
                  }`}>{step.sub}</p>
                </div>
              </div>
              <p className={`text-[11px] leading-relaxed ${
                step.highlight ? 'text-emerald-800 dark:text-emerald-200/80' : 'text-gray-500 dark:text-gray-400'
              }`}>{step.desc}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Small reusable pieces ───────────────────────────────────────────────────

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full mb-3">
      {children}
    </span>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{children}</h2>
}

function Divider() {
  return (
    <div className="flex items-center gap-3" role="separator">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200 dark:to-gray-700" />
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-600" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200 dark:to-gray-700" />
    </div>
  )
}

function HeroHeadline() {
  const { text, animated } = useTypewriter()
  return (
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-tight min-h-[2.25em]">
      {text}
      {animated && (
        <span
          aria-hidden
          className="inline-block w-[2px] h-[1.15em] bg-gray-700 dark:bg-gray-300 align-middle ml-[2px] animate-blink"
        />
      )}
    </h1>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="space-y-14">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="motion-safe:animate-fade-in-up">
          <div className="text-5xl mb-4 select-none" aria-hidden>🤖</div>
          <HeroHeadline />
          <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
            Folio is a full-stack RAG chatbot grounded strictly in Dan's real experience — not a toy demo, a deployed production product used by actual visitors.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700">
              <Globe size={11} /> Live on danpablo.dev
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700">
              <Zap size={11} /> Real-time streaming
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700">
              <Shield size={11} /> 4-layer API security
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700">
              <Check size={11} /> Source citations
            </span>
          </div>
        </section>

        <Divider />

        {/* ── Problem → Solution ───────────────────────────────────────────── */}
        <section className="motion-safe:animate-fade-in-up" style={{ animationDelay: '60ms', animationFillMode: 'both' }}>
          <blockquote className="border-l-[3px] border-emerald-400 pl-4 text-base font-medium text-gray-700 dark:text-gray-200 italic leading-relaxed mb-5">
            "A resume is a summary — not a conversation. The answers recruiters actually want are buried in bullet points."
          </blockquote>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-xl p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-2">The Gap</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Recruiters spend minutes scanning a resume and form a superficial impression. Deeper answers require a separate interview.
              </p>
            </div>
            <div className="rounded-xl p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">The Fix</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                A chatbot that finds the relevant parts of the resume and answers in natural language — with source citations, in real time.
              </p>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── How It Works ─────────────────────────────────────────────────── */}
        <section className="motion-safe:animate-fade-in-up" style={{ animationDelay: '120ms', animationFillMode: 'both' }}>
          <Chip>How It Works</Chip>
          <SectionTitle>The flow, in two layers</SectionTitle>

          {/* Human Layer */}
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-4">
              Human Layer — what you experience
            </p>
            <FlowDiagram steps={humanSteps} />
          </div>

          {/* Tech Layer */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-4">
              Tech Layer — how Folio actually does it
            </p>
            <FlowDiagram steps={techSteps} />
          </div>
        </section>

        <Divider />

        {/* ── Architecture ─────────────────────────────────────────────────── */}
        <section className="motion-safe:animate-fade-in-up" style={{ animationDelay: '180ms', animationFillMode: 'both' }}>
          <Chip>Architecture</Chip>
          <SectionTitle>What I Built</SectionTitle>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
              <div className="inline-flex items-center gap-1.5 mb-3">
                <Code2 size={14} className="text-sky-500 dark:text-sky-400" />
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400">Frontend</span>
              </div>
              <ul className="space-y-1.5">
                {['React + TypeScript', 'Vite + Tailwind CSS', 'SSE token streaming', 'Source badge citations', 'Mobile-first responsive'].map(item => (
                  <li key={item} className="text-[11px] text-gray-600 dark:text-gray-400 flex gap-1.5">
                    <span className="text-gray-300 dark:text-gray-600 shrink-0">—</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
              <div className="inline-flex items-center gap-1.5 mb-3">
                <Server size={14} className="text-violet-500 dark:text-violet-400" />
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400">Backend</span>
              </div>
              <ul className="space-y-1.5">
                {['FastAPI (Python)', 'LangChain RAG pipeline', 'OpenAI gpt-4o-mini', 'text-embedding-3-small', 'Dockerized'].map(item => (
                  <li key={item} className="text-[11px] text-gray-600 dark:text-gray-400 flex gap-1.5">
                    <span className="text-gray-300 dark:text-gray-600 shrink-0">—</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
              <div className="inline-flex items-center gap-1.5 mb-3">
                <Database size={14} className="text-amber-500 dark:text-amber-400" />
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Infrastructure</span>
              </div>
              <ul className="space-y-1.5">
                {['Railway (backend)', 'Vercel (frontend)', 'Supabase + pgvector', 'Conversation logging', 'Env-swappable'].map(item => (
                  <li key={item} className="text-[11px] text-gray-600 dark:text-gray-400 flex gap-1.5">
                    <span className="text-gray-300 dark:text-gray-600 shrink-0">—</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── Tech Stack ───────────────────────────────────────────────────── */}
        <section className="motion-safe:animate-fade-in-up" style={{ animationDelay: '240ms', animationFillMode: 'both' }}>
          <Chip>Built With</Chip>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Lucide', 'FastAPI', 'LangChain', 'OpenAI', 'Supabase', 'pgvector', 'Docker', 'Railway', 'Vercel'].map(tech => (
              <span key={tech} className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-200 dark:border-emerald-800">
                {tech}
              </span>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── Security ─────────────────────────────────────────────────────── */}
        <section className="motion-safe:animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
          <Chip>Security</Chip>
          <SectionTitle>4-Layer API Security</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: Shield, name: 'Input Guard',           desc: 'Messages validated for length (max 300 chars) and scanned for prompt injection before reaching the LLM. Violations return HTTP 400.' },
              { icon: Lock,   name: 'Per-IP Rate Limiting',  desc: 'Sliding window limiter per IP with two sub-limits: burst (max 3/min) and a configurable window limit per mode.' },
              { icon: Zap,    name: 'Global Daily Cap',      desc: 'Shared in-memory counter caps total API calls across all users per day. Catches VPN rotation and distributed bots.' },
              { icon: Mail,   name: 'Contact Form Guard',    desc: 'Separate protection: IP rate limit (3/hr), hidden honeypot field, field length validation, URL count cap, and keyword filter for spam.' },
            ].map(({ icon: Icon, name, desc }) => (
              <div key={name} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <Icon size={12} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── Features ─────────────────────────────────────────────────────── */}
        <section className="motion-safe:animate-fade-in-up" style={{ animationDelay: '360ms', animationFillMode: 'both' }}>
          <Chip>Features</Chip>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {[
              'RAG-grounded responses — strictly from indexed resume & Q&A guide',
              'Real-time SSE token streaming',
              'Source badges per AI response',
              '"Dan" links open a contact modal',
              'Conversation memory (last 6 turns)',
              'Contact form with spam protection',
              'Full conversation logging to Supabase',
              'Mobile-first — bottom sheet on mobile, widget on desktop',
            ].map(f => (
              <div key={f} className="flex gap-2.5">
                <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <Check size={9} className="text-emerald-600 dark:text-emerald-400" />
                </span>
                <span className="text-[11px] leading-snug text-gray-600 dark:text-gray-300">{f}</span>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── The Result ───────────────────────────────────────────────────── */}
        <section className="motion-safe:animate-fade-in-up" style={{ animationDelay: '420ms', animationFillMode: 'both' }}>
          <Chip>The Result</Chip>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Live at danpablo.dev</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              A stranger can click "Chat with Folio", ask about Dan's background, and get a sourced answer in real time — streaming tokens, showing which resume section was used as context. The chatbot handles questions across his full career, from IC design at Synkom to backend work at Biarri Networks.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
              It's also a repersonalizable template: swap in a new resume via env vars, and the chatbot adapts without any code changes.
            </p>
          </div>
        </section>

        <Divider />

        {/* ── Future Use ───────────────────────────────────────────────────── */}
        <section className="motion-safe:animate-fade-in-up" style={{ animationDelay: '480ms', animationFillMode: 'both' }}>
          <Chip>Future Use</Chip>
          <SectionTitle>A reusable pattern for any product</SectionTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 -mt-2">
            Folio is a proof of concept: any product, service, or website can embed a conversational assistant grounded in its own knowledge base — not a generic chatbot, but one that knows exactly what you give it.
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { emoji: '🛠️', label: 'SaaS product page',  desc: 'Guide visitors through features, pricing, and use cases based on their needs.' },
              { emoji: '🛍️', label: 'E-commerce site',    desc: 'Help shoppers find products, compare options, and make purchase decisions.' },
              { emoji: '🖼️', label: 'Portfolio / agency', desc: 'Walk visitors through case studies, services, and pricing in a natural flow.' },
            ].map(({ emoji, label, desc }) => (
              <div key={label} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                <div className="text-2xl mb-2 select-none" aria-hidden>{emoji}</div>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-1">{label}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── Lessons Learned ──────────────────────────────────────────────── */}
        <section className="motion-safe:animate-fade-in-up" style={{ animationDelay: '540ms', animationFillMode: 'both' }}>
          <Chip>Lessons Learned</Chip>
          <SectionTitle>What I'd do differently</SectionTitle>
          <div className="space-y-3">
            {[
              { title: 'Dev parity',           body: "I use ChromaDB locally and pgvector in production. The difference in behavior means dev-to-prod drift. I'd use pgvector in dev for a single consistent environment." },
              { title: 'Better evaluation',    body: "There's no systematic way to measure answer quality. I'd add a test suite that runs known Q&A pairs and scores retrieval precision and answer accuracy over time." },
              { title: 'Smarter rate limits',  body: "The daily cap of 100 questions is a blunt instrument — it catches distributed abuse but also blocks legitimate users. I'd move to anomaly-detection instead of a hard ceiling." },
            ].map(({ title, body }) => (
              <div key={title} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 flex gap-3">
                <div className="shrink-0 w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mt-0.5">
                  <Brain size={12} className="text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mt-0.5">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
