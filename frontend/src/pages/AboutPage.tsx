import { Shield, Code2, Brain, Check, Lock, Zap, Server, Globe, Database, Mail } from 'lucide-react'

// ─── SVG flow diagram ────────────────────────────────────────────────────────

const W = 168
const H = 150
const GAP = 40
const N = 4
const WIDE = N * W + (N - 1) * GAP + 32
const cols = [0, 1, 2, 3].map(i => 16 + i * (W + GAP))

type FlowStep = { emoji: string; title: string; sub: string; solid?: boolean }

const humanRow: FlowStep[] = [
  { emoji: '📄', title: 'My Resume',           sub: 'Experience, skills & projects' },
  { emoji: '🤖', title: 'Folio Chatbot',       sub: 'Reads your resume & answers',  solid: true },
  { emoji: '💬', title: 'Your Answer',          sub: 'Natural, grounded in real time' },
  { emoji: '📌', title: 'Source Citation',     sub: 'Verified & explorable' },
]

const techRow: FlowStep[] = [
  { emoji: '📄', title: 'Resume + Q&A Guide', sub: 'Chunks → pgvector index' },
  { emoji: '🧠', title: 'LangChain Embed',    sub: 'text-embedding-3-small', solid: true },
  { emoji: '⚡', title: 'LLM Prompt & Stream',sub: 'gpt-4o-mini → SSE' },
  { emoji: '🔗', title: 'Citations & Links',  sub: 'Context → clickable source' },
]

function FlowDiagram({ rows, label }: { rows: FlowStep[]; label: string }) {
  const boxH = H + 18
  const svgH = boxH + 18
  const y0 = 18

  function Box({ x, y, title, sub, emoji, solid }: { x: number; y: number; title: string; sub: string; emoji?: string; solid?: boolean }) {
    const bg      = solid ? 'url(#boxGradSolid)' : 'url(#boxGrad)'
    const strokeW = solid ? 1.5 : 1.2
    const txtColor = solid ? '#ffffff' : '#059669'
    const subColor = solid ? 'rgba(255,255,255,0.7)' : 'rgba(5,150,105,0.5)'
    return (
      <g>
        <rect x={x} y={y} width={W} height={H} rx="14" fill={bg} stroke="#059669" strokeWidth={strokeW} />
        {emoji ? (
          <text x={x + W / 2} y={y + 46} textAnchor="middle" fontSize="34" fontFamily="inherit">{emoji}</text>
        ) : (
          <text x={x + W / 2} y={y + 50} textAnchor="middle" fill={txtColor} fontSize="13" fontFamily="inherit" fontWeight="600">{title}</text>
        )}
        <text x={x + W / 2} y={y + (emoji ? 82 : 70)} textAnchor="middle" fill={txtColor} fontSize="12" fontFamily="inherit" fontWeight="600">{emoji ? title : ''}</text>
        <text x={x + W / 2} y={y + (emoji ? 100 : 90)} textAnchor="middle" fill={subColor} fontSize="10" fontFamily="inherit">{sub}</text>
      </g>
    )
  }

  function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
    return <line x1={x1} y1={y} x2={x2} y2={y} stroke="#059669" strokeWidth="1.8" markerEnd="url(#arr-emerald)" opacity="0.55" />
  }

  return (
    <svg viewBox={`0 0 ${WIDE} ${svgH}`} className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" aria-label={label}>
      <defs>
        <marker id="arr-emerald" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill="#059669" />
        </marker>
        <linearGradient id="boxGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ecfdf5" />
          <stop offset="100%" stopColor="#d1fae5" />
        </linearGradient>
        <linearGradient id="boxGradSolid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
      <text x="16" y="12" fill="#059669" fontSize="9" fontFamily="inherit" fontWeight="600" letterSpacing="1" opacity="0.4">{label}</text>
      {rows.map((s, i) => (
        <Box key={i} x={cols[i]} y={y0} title={s.title} sub={s.sub} emoji={s.emoji} solid={s.solid} />
      ))}
      {[0, 1, 2].map(i => (
        <Arrow key={i} x1={cols[i] + W + 4} x2={cols[i + 1] - 4} y={y0 + H / 2} />
      ))}
    </svg>
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

// ─── Page ────────────────────────────────────────────────────────────────────

export function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="space-y-14">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="motion-safe:animate-fade-in-up">
          <div className="text-5xl mb-4 select-none" aria-hidden>🤖</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
            Ask my resume<br className="hidden sm:block" /> anything.
          </h1>
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

        {/* ── How It Works ─────────────────────────────────────────────────── */}
        <section className="motion-safe:animate-fade-in-up" style={{ animationDelay: '120ms', animationFillMode: 'both' }}>
          <Chip>How It Works</Chip>
          <SectionTitle>The flow, in two layers</SectionTitle>

          {/* Human Layer */}
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-3">
              Human Layer — what you experience
            </p>
            <FlowDiagram rows={humanRow} label="HUMAN FLOW" />
            <div className="mt-4 grid sm:grid-cols-2 gap-2">
              {[
                { n: '1', title: 'Your Resume',     desc: "Everything about Dan lives here — experience, skills, education. It's the single source of truth." },
                { n: '2', title: 'Folio Chatbot',   desc: 'You ask a question. Folio finds the relevant resume sections and crafts a natural answer grounded in the facts.' },
                { n: '3', title: 'Your Answer',     desc: 'The answer streams back in real time — not a copy-paste, but a genuine explanation based on what it knows.' },
                { n: '4', title: 'Source Citation', desc: 'Every answer shows which resume section was used. You can verify and explore further.' },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center justify-center mt-0.5">{n}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{title}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Layer */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-3">
              Tech Layer — how Folio actually does it
            </p>
            <FlowDiagram rows={techRow} label="TECH FLOW" />
            <div className="mt-4 grid sm:grid-cols-2 gap-2">
              {[
                { n: '1', title: 'Embedding',   desc: "Resume and Q&A guide are chunked and vectorized using OpenAI's text-embedding-3-small, stored in pgvector on Supabase." },
                { n: '2', title: 'Retrieval',   desc: 'Your question is embedded the same way. LangChain searches pgvector for the most semantically similar chunks.' },
                { n: '3', title: 'Generation',  desc: 'Retrieved context + question form a prompt for gpt-4o-mini. The answer streams back token by token via SSE.' },
                { n: '4', title: 'Citation',    desc: 'Source badges show which resume section was retrieved, so you can verify the answer and click through to explore.' },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center justify-center mt-0.5">{n}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{title}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

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
