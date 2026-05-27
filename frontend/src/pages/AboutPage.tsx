import { useState } from 'react'
import { ChevronDown, Shield, Code2, ArrowUpRight, Brain, MessageSquare, Cpu, Sparkles } from 'lucide-react'

function CollapsibleSection({ title, subtitle, icon: Icon, children }: { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <section className="pb-6 last:pb-0">
      <div>
        <button
          onClick={() => setOpen((v) => !v)}
          title={open ? 'Collapse' : 'Expand'}
          className="flex items-start gap-1.5 text-left group"
        >
          <ChevronDown
            size={13}
            className={`mt-0.5 shrink-0 text-emerald-500 dark:text-emerald-400 transition-transform duration-200 ${open ? 'rotate-180' : '-rotate-90'}`}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <Icon className="w-[13px] h-[13px] shrink-0 text-emerald-500 dark:text-emerald-400" />
              <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{title}</div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</div>
          </div>
        </button>
      </div>
      <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="pt-2">{children}</div>
        </div>
      </div>
    </section>
  )
}

const W = 168
const H = 150
const GAP = 40
const N = 4
const WIDE = N * W + (N - 1) * GAP + 32
const cols = [0, 1, 2, 3].map(i => 16 + i * (W + GAP))

const humanRow: { emoji: string; title: string; sub: string; solid?: boolean }[] = [
  { emoji: '📄', title: 'My Resume',        sub: 'Experience, skills & projects' },
  { emoji: '🤖', title: 'Folio Chatbot',    sub: 'Reads your resume & answers',  solid: true },
  { emoji: '💬', title: 'Your Answer',       sub: 'Natural, grounded in real time' },
  { emoji: '📌', title: 'Source Citation',  sub: 'Verified & explorable' },
]

const techRow: typeof humanRow = [
  { emoji: '📄', title: 'Resume + Q&A Guide',  sub: 'Chunks → pgvector index' },
  { emoji: '🧠', title: 'LangChain Embed',     sub: 'text-embedding-3-small', solid: true },
  { emoji: '⚡', title: 'LLM Prompt & Stream', sub: 'gpt-4o-mini → SSE' },
  { emoji: '🔗', title: 'Citations & Links',   sub: 'Context → clickable source' },
]

function FlowDiagram({ rows, label }: { rows: typeof humanRow; label: string }) {
  const boxH = H + 18
  const svgH = boxH + 18
  const y0 = 18

  function Box({ x, y, title, sub, emoji, solid }: { x: number; y: number; title: string; sub: string; emoji?: string; solid?: boolean }) {
    const bg = solid ? 'url(#boxGradSolid)' : 'url(#boxGrad)'
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
    return (
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="#059669" strokeWidth="1.8" markerEnd="url(#arr-emerald)" opacity="0.55" />
    )
  }

  return (
    <svg viewBox={`0 0 ${WIDE} ${svgH}`} className="w-full h-auto mt-6" xmlns="http://www.w3.org/2000/svg">
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

export function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">About Folio</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          A full-stack AI project — not just a static resume.
        </p>
      </header>

      <CollapsibleSection title="The Problem" subtitle="Why build a chatbot for a resume?" icon={Shield}>
        <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
          <p>
            Recruiters and HR professionals spend minutes scanning a resume only to form a superficial impression.
            They want to dig deeper — but the answers live buried in bullet points, or require a separate interview
            to uncover.
          </p>
          <p>
            The gap is real: a resume is a summary, not a conversation. I wanted to build something that bridges that
            gap for my own resume — letting anyone ask natural-language questions and get accurate, grounded answers
            in real time. Not a demo. Not a mock. Something actually deployed and used.
          </p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="What I Built" subtitle="A full-stack AI project" icon={Code2}>
        <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
          <p>
            <strong className="text-gray-900 dark:text-gray-100">Folio</strong> is a full-stack AI application —
            a resume site with an embedded <strong>RAG chatbot</strong> that lets users ask questions like{" "}
            <em className="text-gray-700 dark:text-gray-200">"What did Dan build at Denso?"</em> or{" "}
            <em className="text-gray-700 dark:text-gray-200">"What's Dan's approach to testing?"</em> and get
            precise, sourced answers drawn strictly from the resume and Q&A guide.
          </p>
          <p>
            End-to-end: I designed the RAG pipeline (<strong>LangChain</strong>, <strong>text-embedding-3-small</strong>, <strong>pgvector</strong>), built the
            <strong>FastAPI</strong> backend with 4-layer API security (input guard, per-IP rate limiting, daily cap, contact form
            protection), and created a <strong>React</strong> frontend with real-time <strong>SSE</strong> token streaming, source citations,
            conversation memory, and a contact modal.
          </p>
          <p>
            It's deployed on <strong>Railway</strong> (backend, Dockerized) and <strong>Vercel</strong> (frontend) with <strong>Supabase</strong> as the hosted
            database. Chat history is logged and disclosed — transparency by default.
          </p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="How It Works" subtitle="The flow, in two layers" icon={Cpu}>
        <div className="pl-6 border-l-2 border-emerald-100 dark:border-emerald-900/40">
          <CollapsibleSection title="Human Layer" subtitle="What happens in plain English" icon={MessageSquare}>
            <FlowDiagram rows={humanRow} label="HUMAN FLOW" />
            <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
            <p className="text-gray-600 dark:text-gray-400">
              <strong className="text-gray-900 dark:text-gray-100">1. Your Resume</strong> — Everything about me lives here:
              my experience, skills, education. It's the single source of truth.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              <strong className="text-gray-900 dark:text-gray-100">2. Folio Chatbot</strong> — When you ask a question, Folio
              reads your resume, finds the relevant parts, and uses an AI model to craft a natural answer — not a copy-paste,
              but a genuine explanation based on the facts it knows.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              <strong className="text-gray-900 dark:text-gray-100">3. Your Answer</strong> — The answer streams back to you in
              real time, with source citations showing exactly which part of my resume was used as the basis. You always know
              where the information comes from.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              <strong className="text-gray-900 dark:text-gray-100">4. Source Citation</strong> — Every answer includes a link to
              the original resume section so you can verify and explore further.
            </p>
            </div>
          </CollapsibleSection>
          <CollapsibleSection title="Tech Layer" subtitle="How Folio actually does it" icon={Cpu}>
            <FlowDiagram rows={techRow} label="TECH FLOW" />
            <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
            <p className="text-gray-600 dark:text-gray-400">
              <strong className="text-gray-900 dark:text-gray-100">1. Embedding.</strong> My resume and Q&A guide are split into
              chunks and converted into numerical vectors using OpenAI's <strong>text-embedding-3-small</strong>. These vectors
              live in <strong>pgvector</strong> on Supabase — a searchable index of meaning, not just keywords.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              <strong className="text-gray-900 dark:text-gray-100">2. Retrieval.</strong> When you ask a question, it's embedded the
              same way, then <strong>LangChain</strong> searches pgvector for the most similar resume chunks. It's like a
              librarian who remembers every page of the resume.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              <strong className="text-gray-900 dark:text-gray-100">3. Generation.</strong> The retrieved context + your question form
              a prompt for <strong>gpt-4o-mini</strong>. The answer streams back via <strong>SSE</strong> (Server-Sent Events) —
              tokens appear one by one, not all at once.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              <strong className="text-gray-900 dark:text-gray-100">4. Citation.</strong> Each answer includes source badges showing
              which resume section was retrieved, so you can verify the answer and click through to explore the original text.
            </p>
            </div>
          </CollapsibleSection>
          </div>
        </CollapsibleSection>

      <CollapsibleSection title="The Result" subtitle="What's actually working today" icon={ArrowUpRight}>
        <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
          <p>
            Folio works. A stranger can click the "Chat with Folio" button, ask a question about my background,
            and get a sourced answer in real time — streaming tokens, showing which resume section was used as context.
          </p>
          <p>
            The site <strong className="text-gray-900 dark:text-gray-100">danpablo.dev</strong> is live. The chatbot
            handles questions across the full span of my career — from IC design at Synkom to backend development at
            Biarri Networks. It's not a toy demo; it's production-grade with real security layers.
          </p>
          <p>
            It also serves as a repersonalizable template: change the env vars, swap in a new resume, and the chatbot
            adapts without any code changes.
          </p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Future Use" subtitle="A reusable pattern for any product" icon={Sparkles}>
        <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
          <p>
            Folio started as a personal project, but the pattern behind it is a proof of concept for something much
            broader: <strong className="text-gray-900 dark:text-gray-100">any product, service, or website can benefit from an embedded chatbot</strong> that acts as a conversational assistant or guide.
          </p>
          <p>
            Think of it this way — in my case, <strong>the product being showcased is me</strong>. The chatbot lets recruiters and hiring managers explore my background conversationally instead of scanning bullet points. But the same pattern applies to any domain:
          </p>
          <ul className="space-y-1.5">
            <li className="flex gap-2">
              <span className="text-emerald-400 shrink-0 mt-0.5">→</span>
              <span><strong>SaaS product page</strong> — guide visitors through features, pricing, and use cases based on their needs</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400 shrink-0 mt-0.5">→</span>
              <span><strong>E-commerce site</strong> — help shoppers find products, compare options, and make purchase decisions</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400 shrink-0 mt-0.5">→</span>
              <span><strong>Portfolio / agency site</strong> — walk visitors through case studies, services, and pricing in a natural flow</span>
            </li>
          </ul>
          <p>
            All it takes is swapping out the knowledge base (resume, product catalog, FAQ docs) — the architecture, RAG pipeline, and UI stay the same. The chatbot adapts to whatever you're showcasing.
          </p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="What I'd Do Differently" subtitle="Lessons learned building it" icon={Brain}>
        <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
          <p>
            <strong className="text-gray-900 dark:text-gray-100">Dev parity.</strong> I use <strong>ChromaDB</strong> locally and
            <strong>pgvector</strong> in production. The difference in behavior between the two means dev-to-production drift exists.
            I'd use pgvector in dev for a single environment.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-gray-100">Better evaluation.</strong> There's no systematic
            way to measure answer quality. I'd add a test suite that runs a set of known Q&A pairs and scores
            retrieval precision and answer accuracy over time.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-gray-100">The daily cap of 100 questions</strong> is a blunt
            instrument. It catches distributed abuse but also blocks legitimate users. I'd move to a smarter
            anomaly-detection approach rather than a hard ceiling.
          </p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Built With" subtitle="Tech stack, security, and features" icon={Code2}>
        <div className="space-y-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Tech Stack</div>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Lucide', 'FastAPI', 'LangChain', 'OpenAI', 'Supabase', 'pgvector', 'Docker', 'Railway', 'Vercel'].map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-200 dark:border-emerald-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Security Layers</div>
            <div className="space-y-3">
              {[
                { name: 'Input Guard', desc: 'Messages are validated for length (max 300 chars) and scanned for prompt injection patterns before reaching the LLM. Violations return HTTP 400 immediately.' },
                { name: 'Per-IP Rate Limiting', desc: 'A sliding window limiter tracks requests per IP with two sub-limits: burst (max 3/minute) and window (configurable per mode).' },
                { name: 'Global Daily Cap', desc: 'A shared in-memory counter caps total API calls across all users per day. Catches VPN rotation and distributed bots.' },
                { name: 'Contact Form Guard', desc: 'The contact form has its own protection: IP rate limit (3/hour), a hidden honeypot field, field length validation, URL count cap, and a keyword filter for spam terms.' },
              ].map(({ name, desc }) => (
                <div key={name}>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-0.5">{name}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Features</div>
            <ul className="space-y-1.5">
              {[
                'RAG-grounded responses — answers are strictly derived from the indexed resume and Q&A guide.',
                'Real-time streaming — tokens stream as they are generated via SSE.',
                'Source badges — each AI response shows which resume section was retrieved as context.',
                '"Dan" is interactive — every mention in an AI response opens a contact modal.',
                'Conversation memory — the last 6 turns are included in every prompt for follow-up context.',
                'Contact form with spam protection — honeypot, IP rate limit, field validation, and keyword filter.',
                'Conversation logging — every Q&A pair is stored in Supabase for owner review.',
                'Mobile-first responsive design — bottom sheet on mobile, floating widget on desktop.',
              ].map((f) => (
                <li key={f} className="text-sm text-gray-600 dark:text-gray-300 flex gap-2">
                  <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  )
}
