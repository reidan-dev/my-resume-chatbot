import { useState, useEffect, useRef } from 'react'
import { Shield, Code2, Brain, Check, Lock, Zap, Server, Globe, Database, Mail, MessageSquare, Sparkles } from 'lucide-react'
import wallEve from '../../assets/walle_and_eve.png'

// ─── Typewriter hook ──────────────────────────────────────────────────────────

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
        if (Math.random() < 0.06) delay += 55
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
      await sleep(6000 + Math.random() * 3000)
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
        await sleep(3000 + Math.random() * 2000)
        await eraseBack(q)
        if (cancelled.current) return
        await sleep(180)
        await typeOut(BASE_TEXT)
        if (cancelled.current) return
        await sleep(5000 + Math.random() * 3000)
      }
    }

    loop()
    return () => { cancelled.current = true }
  }, [])

  return { text, animated: !reduced.current }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroHeadline() {
  const { text, animated } = useTypewriter()
  return (
    <p className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-300 leading-snug min-h-[2em]">
      {text}
      {animated && (
        <span
          aria-hidden
          className="inline-block w-[2px] h-[1.15em] bg-gray-500 dark:bg-gray-400 align-middle ml-[2px] animate-blink"
        />
      )}
    </p>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full mb-3">
      {children}
    </span>
  )
}

function SlideTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-2">{children}</h2>
}

function SlideSubtitle({ children }: { children: React.ReactNode }) {
  return <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-6">{children}</p>
}

// ─── Slide wrapper ────────────────────────────────────────────────────────────

function Slide({ children, tinted = false }: { children: React.ReactNode; tinted?: boolean }) {
  return (
    <div
      data-folio-slide
      className={`snap-start min-h-screen flex items-center py-14 ${tinted ? 'bg-emerald-50/60 dark:bg-emerald-950/10' : ''}`}
      style={{ scrollMarginTop: '52px' }}
    >
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">{children}</div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AboutPage({ onOpenChat }: { onOpenChat?: () => void }) {
  useEffect(() => {
    document.documentElement.classList.add('folio-snap')
    return () => document.documentElement.classList.remove('folio-snap')
  }, [])

  useEffect(() => {
    let locked = false

    function navigateSlide(direction: 1 | -1) {
      if (locked) return
      locked = true
      const slides = Array.from(document.querySelectorAll<HTMLElement>('[data-folio-slide]'))
      if (!slides.length) return
      const mid = window.scrollY + 52 + (window.innerHeight - 52) / 2
      let currentIdx = 0
      slides.forEach((slide, i) => {
        if (slide.getBoundingClientRect().top + window.scrollY <= mid) currentIdx = i
      })
      const targetIdx = Math.max(0, Math.min(currentIdx + direction, slides.length - 1))
      slides[targetIdx].scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => { locked = false }, 700)
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      navigateSlide(e.deltaY > 0 ? 1 : -1)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      e.preventDefault()
      const slides = Array.from(document.querySelectorAll<HTMLElement>('[data-folio-slide]'))
      if (!slides.length) return
      const mid = window.scrollY + 52 + (window.innerHeight - 52) / 2
      let currentIdx = 0
      slides.forEach((slide, i) => {
        if (slide.getBoundingClientRect().top + window.scrollY <= mid) currentIdx = i
      })
      const targetIdx = e.key === 'ArrowDown'
        ? Math.min(currentIdx + 1, slides.length - 1)
        : Math.max(currentIdx - 1, 0)
      slides[targetIdx].scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div>

      {/* ── Slide 1: Hero ─────────────────────────────────────────────────── */}
      <Slide>
        <section className="motion-safe:animate-fade-in-up">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Live at danpablo.dev</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-5xl select-none leading-none" aria-hidden>🤖</div>
            <h1 className="text-5xl font-bold text-emerald-600 dark:text-emerald-400 leading-none">Meet Folio</h1>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3">
            Your resume, as a conversation.
          </h2>
          <HeroHeadline />
          <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
            Folio is an AI chatbot built on my resume. It answers real questions about my background, grounded strictly in what I've documented, with source citations in real time.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { icon: Globe,  label: 'Live production app' },
              { icon: Zap,    label: 'Real-time streaming' },
              { icon: Shield, label: '4-layer security'    },
              { icon: Check,  label: 'Source-cited answers'},
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700">
                <Icon size={11} className="text-emerald-500" />{label}
              </span>
            ))}
          </div>
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              <MessageSquare size={15} />
              Try Folio now
            </button>
          )}
        </section>
      </Slide>

      {/* ── Slide 2: The Problem ──────────────────────────────────────────── */}
      <Slide>
        <section className="motion-safe:animate-fade-in-up">
          <Chip>The Problem</Chip>
          <SlideTitle>Resumes don't answer follow-up questions.</SlideTitle>
          <SlideSubtitle>A recruiter reads a bullet point and wants to know more. Usually, that means scheduling an interview. Folio skips that step.</SlideSubtitle>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="rounded-2xl p-5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
              <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-3">Before Folio</p>
              <ul className="space-y-2">
                {[
                  'Scan a resume in 6 minutes',
                  'Form a shallow first impression',
                  'Schedule a call just to ask basic questions',
                  'Wait days for a response',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="text-red-300 shrink-0 mt-0.5">✕</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl p-5 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-3">With Folio</p>
              <ul className="space-y-2">
                {[
                  'Ask anything, get an answer instantly',
                  'Answers grounded in the actual resume',
                  'See which section was used as context',
                  'Have a real conversation about experience',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <blockquote className="border-l-[3px] border-emerald-400 pl-4 text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed">
            "A resume is a summary, not a conversation. The answers recruiters actually want are buried in bullet points."
          </blockquote>
        </section>
      </Slide>

      {/* ── Slide 3: How It Works (simple) ───────────────────────────────── */}
      <Slide tinted>
        <section className="motion-safe:animate-fade-in-up">
          <Chip>How It Works</Chip>
          <SlideTitle>Three steps. No jargon.</SlideTitle>
          <SlideSubtitle>You ask a question. Folio finds the answer in my resume. You get a clear, sourced response in seconds.</SlideSubtitle>
          <div className="space-y-4">
            {[
              {
                step: '01',
                emoji: '💬',
                title: 'You ask',
                desc: "Type any question about my background: skills, experience, projects, or career. No special syntax needed, just plain English.",
              },
              {
                step: '02',
                emoji: '🔍',
                title: 'Folio searches',
                desc: "Behind the scenes, Folio finds the most relevant parts of my resume using semantic search: not just keyword matching, but understanding what you mean.",
                highlight: true,
              },
              {
                step: '03',
                emoji: '✅',
                title: 'You get a sourced answer',
                desc: 'A clear, natural-language answer streams to you in real time, with a badge showing exactly which part of the resume it came from.',
              },
            ].map(({ step, emoji, title, desc, highlight }) => (
              <div key={step} className={`flex gap-4 rounded-2xl border p-4 ${highlight ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/60' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${highlight ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
                  {step}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg leading-none">{emoji}</span>
                    <p className={`text-sm font-bold ${highlight ? 'text-emerald-900 dark:text-emerald-100' : 'text-gray-900 dark:text-gray-100'}`}>{title}</p>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${highlight ? 'text-emerald-800 dark:text-emerald-200/80' : 'text-gray-500 dark:text-gray-400'}`}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 flex gap-3">
            <span className="text-lg leading-none select-none shrink-0">💬</span>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
              <span className="font-semibold text-gray-700 dark:text-gray-300">One thing to know:</span> Folio speaks about me in the third person in chat ("Dan has experience in..."). It's intentional. Folio is a character helping you get to know me, not me talking directly.
            </p>
          </div>
        </section>
      </Slide>

      {/* ── Slide 4: Things you can ask ───────────────────────────────────── */}
      <Slide>
        <section className="motion-safe:animate-fade-in-up">
          <Chip>Try It</Chip>
          <SlideTitle>Things recruiters actually ask.</SlideTitle>
          <SlideSubtitle>Folio handles all of these, and anything else you can think of. Click "Try Folio now" on any slide to test it yourself.</SlideSubtitle>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { emoji: '🧠', q: "What's Dan's strongest technical skill?" },
              { emoji: '☁️', q: 'Has he worked with cloud platforms?' },
              { emoji: '🤖', q: 'Tell me about his AI or ML experience.' },
              { emoji: '🏢', q: "What's his most recent role and what did he build?" },
              { emoji: '🛠️', q: 'What programming languages does he know?' },
              { emoji: '📈', q: 'Has he worked at a startup or in a fast-paced environment?' },
            ].map(({ emoji, q }) => (
              <div key={q} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 flex items-start gap-3">
                <span className="text-xl leading-none shrink-0 mt-0.5">{emoji}</span>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-snug italic">"{q}"</p>
              </div>
            ))}
          </div>
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
            >
              <MessageSquare size={15} />
              Ask Folio now
            </button>
          )}
        </section>
      </Slide>

      {/* ── Slide 5: What makes it different ─────────────────────────────── */}
      <Slide tinted>
        <section className="motion-safe:animate-fade-in-up">
          <Chip>What Makes It Different</Chip>
          <SlideTitle>Not a generic chatbot.</SlideTitle>
          <SlideSubtitle>Folio only knows what my resume tells it. That sounds like a constraint, but it's the whole point. Every answer is true, or it's not given at all.</SlideSubtitle>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: '📌',
                title: 'Source-cited answers',
                desc: "Every response shows which section of my resume it drew from. You can verify every claim.",
              },
              {
                icon: '🚫',
                title: 'No hallucinations',
                desc: "Folio only answers from indexed content. If something isn't in the resume, it says so rather than inventing an answer.",
              },
              {
                icon: '⚡',
                title: 'Real-time streaming',
                desc: 'Answers stream token by token as they generate. No loading spinner, no wall of text dumped all at once.',
              },
              {
                icon: '🧵',
                title: 'Conversational memory',
                desc: 'Folio remembers the last 6 turns of conversation, so follow-up questions feel natural and context is never lost.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
                <div className="text-2xl mb-3 select-none">{icon}</div>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">{title}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </Slide>

      {/* ── Slide 6: The Story (Wall-E) ───────────────────────────────────── */}
      <Slide>
        <section className="motion-safe:animate-fade-in-up">
          <Chip>The Story</Chip>
          <SlideTitle>Old tech + new tech, working together.</SlideTitle>
          <div className="flex flex-col sm:flex-row items-center gap-8 mt-2">
            <div className="shrink-0">
              <img
                src={wallEve}
                alt="Wall-E and Eve, the old and new"
                className="w-48 sm:w-56 object-contain select-none rounded-2xl"
                draggable={false}
              />
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Wall-E collects everything. Methodical, organized, thorough. But he can't answer questions. That's what a traditional resume is: everything in there, neatly arranged, sitting still.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Eve arrives with a mission. She doesn't browse. She searches with intent, retrieves what matters, and brings it forward. That's the AI layer I built on top.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                The plant is what they were both working toward. Not just the combination of old and new, but the reason to combine them at all. Something alive. Something useful. Folio is that plant: a product that only exists because structured knowledge and intelligent retrieval came together with a clear goal.
              </p>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Why I built this</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                  I wanted anyone looking at my work to be able to actually dig in, not skim a PDF and make assumptions. Folio is the product, and it's also the proof I can build it.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Slide>

      {/* ── Slide 7: Under the Hood ───────────────────────────────────────── */}
      <Slide>
        <section className="motion-safe:animate-fade-in-up">
          <Chip>Under the Hood</Chip>
          <SlideTitle>Built for production, not just demos.</SlideTitle>
          <SlideSubtitle>A real RAG pipeline, not a toy. From the embedding index to the streaming API to the frontend widget.</SlideSubtitle>
          <div className="grid sm:grid-cols-3 gap-3 mb-8">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
              <div className="inline-flex items-center gap-1.5 mb-3">
                <Code2 size={13} className="text-sky-500" />
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400">Frontend</span>
              </div>
              <ul className="space-y-1.5">
                {['React + TypeScript', 'Vite + Tailwind CSS', 'SSE token streaming', 'Mobile-first'].map(item => (
                  <li key={item} className="text-[11px] text-gray-500 dark:text-gray-400 flex gap-1.5">
                    <span className="text-gray-300 dark:text-gray-600 shrink-0">—</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
              <div className="inline-flex items-center gap-1.5 mb-3">
                <Server size={13} className="text-violet-500" />
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400">Backend</span>
              </div>
              <ul className="space-y-1.5">
                {['FastAPI (Python)', 'LangChain RAG', 'OpenAI gpt-4o-mini', 'Dockerized'].map(item => (
                  <li key={item} className="text-[11px] text-gray-500 dark:text-gray-400 flex gap-1.5">
                    <span className="text-gray-300 dark:text-gray-600 shrink-0">—</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
              <div className="inline-flex items-center gap-1.5 mb-3">
                <Database size={13} className="text-amber-500" />
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Infrastructure</span>
              </div>
              <ul className="space-y-1.5">
                {['Railway + Vercel', 'Supabase + pgvector', 'Conversation logs', 'Env-swappable'].map(item => (
                  <li key={item} className="text-[11px] text-gray-500 dark:text-gray-400 flex gap-1.5">
                    <span className="text-gray-300 dark:text-gray-600 shrink-0">—</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Stack</p>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'FastAPI', 'LangChain', 'OpenAI', 'Supabase', 'pgvector', 'Docker', 'Railway', 'Vercel'].map(tech => (
                <span key={tech} className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium border border-emerald-200 dark:border-emerald-800">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      </Slide>

      {/* ── Slide 8: Security + The Result ───────────────────────────────── */}
      <Slide tinted>
        <section className="motion-safe:animate-fade-in-up">
          <Chip>Built to Last</Chip>
          <SlideTitle>Production-grade, from day one.</SlideTitle>
          <SlideSubtitle>I didn't just throw this together and hope for the best. It's properly secured, rate-limited, and built to handle real traffic.</SlideSubtitle>
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {[
              { icon: Shield, name: 'Input validation',     desc: 'Every message is validated for length and scanned for prompt injection before it ever touches the LLM.' },
              { icon: Lock,   name: 'Per-IP rate limiting', desc: 'Burst limits (3/min) and session-window limits prevent abuse while keeping the experience fast for real users.' },
              { icon: Zap,    name: 'Global daily cap',     desc: "A shared counter across all users catches distributed abuse patterns that per-IP limits can't catch alone." },
              { icon: Mail,   name: 'Contact form guard',   desc: 'Honeypot field, URL caps, keyword filtering, and field length validation. Separate protection for the contact form.' },
            ].map(({ icon: Icon, name, desc }) => (
              <div key={name} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <Icon size={12} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{name}</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-gray-800 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Live right now</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Folio is live and open to anyone. Recruiters, hiring managers, and clients can talk to it right now to learn about my background, skills, and experience. No scheduling, no waiting, no back-and-forth.
            </p>
          </div>
        </section>
      </Slide>

      {/* ── Slide 9: Beyond a Resume ──────────────────────────────────────── */}
      <Slide>
        <section className="motion-safe:animate-fade-in-up">
          <Chip>The Bigger Picture</Chip>
          <SlideTitle>A pattern that works for anything.</SlideTitle>
          <SlideSubtitle>Folio is also a proof of concept: any product, website, or service can have a conversational assistant grounded in its own knowledge. Not a generic chatbot, but one that knows exactly what you feed it.</SlideSubtitle>
          <div className="grid sm:grid-cols-3 gap-3 mb-8">
            {[
              { emoji: '🛠️', label: 'SaaS product page',  desc: 'Guide visitors through features and pricing based on their actual questions.' },
              { emoji: '🛍️', label: 'E-commerce site',    desc: 'Help shoppers find the right product by understanding what they actually need.' },
              { emoji: '🖼️', label: 'Portfolio / agency', desc: 'Walk clients through case studies and services in a natural back-and-forth.' },
            ].map(({ emoji, label, desc }) => (
              <div key={label} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <div className="text-2xl mb-2 select-none">{emoji}</div>
                <p className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-1">{label}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 flex gap-4">
            <Sparkles size={18} className="text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Swap in a new knowledge base via environment variables and the chatbot adapts completely. No code changes, no retraining. The architecture is intentionally generic.
            </p>
          </div>
        </section>
      </Slide>

      {/* ── Slide 10: Lessons Learned + CTA ──────────────────────────────── */}
      <Slide>
        <section className="motion-safe:animate-fade-in-up">
          <Chip>Lessons Learned</Chip>
          <SlideTitle>What I'd do differently.</SlideTitle>
          <div className="space-y-3 mb-10">
            {[
              { title: 'Dev–prod parity',      body: "I use ChromaDB locally and pgvector in production. The behavioral difference causes subtle dev-to-prod drift. I'd standardize on pgvector everywhere from day one." },
              { title: 'Evaluation pipeline',  body: "There's no systematic way to measure answer quality. I'd add a test suite that runs known Q&A pairs and scores retrieval precision and answer accuracy over time." },
              { title: 'Smarter rate limits',  body: "The daily cap is a blunt instrument. It catches abuse but can block legitimate users. Anomaly detection on usage patterns would be a more nuanced solution." },
            ].map(({ title, body }) => (
              <div key={title} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex gap-3">
                <div className="shrink-0 w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mt-0.5">
                  <Brain size={12} className="text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{title}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mt-0.5">{body}</p>
                </div>
              </div>
            ))}
          </div>
          {onOpenChat && (
            <div className="rounded-2xl bg-emerald-600 px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-white text-base">See it in action.</p>
                <p className="text-emerald-100 text-sm mt-0.5">Ask Folio anything about my experience, projects, or skills.</p>
              </div>
              <button
                onClick={onOpenChat}
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 text-sm font-bold transition-colors"
              >
                <MessageSquare size={15} />
                Chat with Folio
              </button>
            </div>
          )}
        </section>
      </Slide>

    </div>
  )
}
