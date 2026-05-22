import { useState, useEffect } from 'react'
import { ExternalLink, Mail, MapPin, Phone, ChevronDown } from 'lucide-react'
import { useInView } from '../hooks/useInView'

const TECH_TERMS = [
  // multi-word terms first (longest match wins)
  'Claude Code', 'OpenAI Codex', 'Presto SQL', 'Gensim LDA', 'Logistic Regression',
  'Apache Superset', 'Apache Spark', 'Apache Zeppelin',
  'Agile Scrum', 'REST APIs', 'REST API',
  'BeautifulSoup', 'SciSpaCy', 'Selenium',
  'Node.js', 'Vue.js', 'FastAPI', 'Django', 'Flask', 'Bootstrap', 'SpaCy',
  'TypeScript', 'JavaScript', 'PostgreSQL', 'Bitbucket', 'GitHub',
  'Jenkins', 'Terraform', 'Docker', 'GraphQL', 'Microservices',
  'React', 'Python', 'Pytest', 'Jest', 'TDD', 'Jira', 'Confluence', 'Waterfall',
  'AWS', 'HTML5', 'CSS3', 'SQL', 'TCL', 'Bash', 'Git',
  'F1-score', '94%', '98–100%',
]

const _termSet = new Set(TECH_TERMS)
const _highlightPattern = new RegExp(
  `(${[...TECH_TERMS].sort((a, b) => b.length - a.length)
    .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')})`
)

function HighlightedText({ text }: { text: string }) {
  const parts = text.split(_highlightPattern)
  return (
    <>
      {parts.map((part, i) =>
        _termSet.has(part)
          ? <strong key={i} className="font-semibold text-gray-800 dark:text-gray-200">{part}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  )
}

const GITHUB = import.meta.env.VITE_CONTACT_GITHUB ?? 'https://github.com/reidan-dev'
const EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? 'reinieldan@gmail.com'

const skills: Record<string, string[]> = {
  'Backend Development': ['Python', 'Django', 'Flask', 'FastAPI', 'Node.js', 'REST APIs', 'GraphQL', 'Microservices', 'TDD', 'Pytest', 'Jest'],
  'Frontend & Web': ['JavaScript', 'React', 'Vue.js', 'Bootstrap', 'HTML5', 'CSS3'],
  'Data & Infrastructure': ['Presto SQL', 'PostgreSQL', 'Apache Superset', 'Apache Spark', 'AWS (S3/Lambda/EC2)', 'Terraform', 'Jenkins', 'Docker'],
  'Tools & Methods': ['Git', 'Jira', 'Confluence', 'Claude Code', 'OpenAI Codex', 'Agile Scrum', 'Waterfall'],
}

const experience = [
  {
    title: 'Software Developer – Backend',
    company: 'Sharesource → Biarri Networks (AUS)',
    period: 'Sep 2022 – Apr 2026',
    duration: '3 yrs 7 mos',
    bullets: [
      'Maintained and extended 60+ proprietary Python packages: internal algorithmic tools used by GIS designers and network consultants to plan and design fibre optic network infrastructure, from small-scale local deployments to national-level rollouts.',
      'Core work: adding new features, keeping packages current with framework/library advances, performance optimization, and resolving issues reported by GIS designers and consultants.',
      'Maintained clean REST API contracts between backend packages and frontends, ensuring GIS design tools stayed reliably connected across the full stack.',
      'Part of package maintenance included writing and maintaining Pytest test suites (TDD) per repo, with integration tests and regression tests scheduled via Jenkins cron jobs to run automatically and catch breakage across the ecosystem.',
      'Configured Jenkins pipelines for cron-based job management across complex multi-repo packages.',
      'Deployed critical infrastructure hotfixes under tight production constraints; optimized webhook pipelines.',
      'Pioneered AI automation workflows using Claude Code and OpenAI Codex to eliminate repetitive developer tasks.',
    ],
  },
  {
    title: 'Data Visualization Consultant / Data Analyst',
    company: 'Amihan Global Strategies',
    period: 'Aug 2022 – Feb 2023',
    duration: '6 mos',
    bullets: [
      'Technical lead for a national-scale data project ingesting 100k+ real-time rows daily from a national service actively used by millions of Filipinos.',
      'Cleaned, aggregated, and surfaced actionable metrics from raw JSON/XML telemetry using Python, Presto SQL, PostgreSQL, Apache Zeppelin, and Apache Spark.',
      'Built Apache Superset dashboards presenting complex data insights in a way accessible to non-technical clients and stakeholders.',
      'Contributed to customer persona classification — segmenting daily service users to enable targeted service improvements, smarter resource allocation, and data-driven business decisions.',
      'Contributed to traffic management analytics to monitor and optimize national service load patterns.',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Denso Techno Philippines Inc.',
    period: 'Aug 2019 – Feb 2022',
    duration: '2 yrs 6 mos',
    bullets: [
      'Built full-stack enterprise web applications connected to production factories in Japan — replacing manual machine checks with real-time dashboards showing live production line flow and machine conditions.',
      'Machines on the factory floor sent status and telemetry to APIs; built the full stack (Django/FastAPI backends, React/Vue.js frontends) to ingest, process, and visualize that data for operators.',
      'Deployed microservices with Docker on AWS (S3, Lambda, EC2) using Terraform.',
      'Achieved 98–100% QA clearance across all integration contracts via strict TDD with Pytest and Jest.',
    ],
  },
  {
    title: 'Part-Time College Instructor',
    company: 'STI College – Angeles City',
    period: 'Feb 2023 – Jul 2023',
    duration: '5 mos',
    bullets: [
      'Taught IT students full-stack web development (backend to frontend) with the goal of each student shipping a personal website by end of semester — achieved.',
      'Taught project management to Business Administration students; cross-pollinated both courses by having biz ad students manage IT students\' capstone projects — simulating real product owner / developer dynamics.',
      'Both class goals met: IT students shipped, biz ad students completed full project documentation hitting all milestones as if submitting to a real product owner.',
    ],
  },
  {
    title: 'IC Design Engineer',
    company: 'Synkom IC Technology Inc.',
    period: 'Oct 2018 – Apr 2019',
    duration: '6 mos',
    bullets: [
      'Wrote automated data parsing scripts in Python, TCL, and Bash to clean hardware verification logs.',
      'Designed hardware layout specifications and schematics based on circuit theory.',
    ],
  },
  {
    title: 'Academic Instructor',
    company: 'AMA Computer College – Angeles City',
    period: 'Jun 2017 – Aug 2017',
    duration: '3 mos',
    bullets: [
      'Taught General Mathematics and General Science across 8 sections of 20–25 Senior High School students.',
      'Managing 160+ students simultaneously across multiple sections developed strong people management, scheduling, and classroom leadership skills that carry directly into engineering team dynamics.',
    ],
  },
]

const projects = [
  {
    name: 'AI Resume Site with RAG Chatbot (this site)',
    period: 'Personal Project, 2025',
    bullets: [
      'Built a full-stack AI resume site with an embedded RAG chatbot named Folio — production-deployed, not a demo.',
      'Stack: FastAPI + LangChain RAG pipeline, OpenAI gpt-4o-mini, Supabase pgvector, React + TypeScript + Vite + Tailwind CSS.',
      'Deployed on Railway (backend, Dockerized) and Vercel (frontend); SSE token streaming, Supabase chat logging, 4-layer API security.',
    ],
  },
  {
    name: 'Check-App — Clinical Decision Support Chatbot',
    period: 'Eskwelabs Bootcamp, 2021',
    bullets: [
      'Built a Messenger chatbot triaging symptoms to medical specialists (ENT, Neurology, Ophthalmology).',
      'NLP pipeline: BeautifulSoup/Selenium scraping, SpaCy/SciSpaCy preprocessing, Gensim LDA, Logistic Regression — 94% F1-score on 7,300+ clinical records.',
      'Awarded Best in Project Management and Best Project (Sprint 4).',
    ],
  },
]

function AnimatedDan() {
  const [phase, setPhase] = useState<'idle' | 'drawing' | 'lit' | 'erasing'>('idle')

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>

    function run() {
      t = setTimeout(() => {
        setPhase('drawing')
        t = setTimeout(() => {
          setPhase('lit')
          t = setTimeout(() => {
            setPhase('erasing')
            t = setTimeout(() => {
              setPhase('idle')
              run()
            }, 650)
          }, 5000)
        }, 750)
      }, 5000 + Math.random() * 5000)
    }

    run()
    return () => clearTimeout(t)
  }, [])

  return (
    <span
      style={{
        backgroundImage: 'linear-gradient(#059669, #059669)',
        backgroundPosition: '0% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: (phase === 'drawing' || phase === 'lit') ? '100% 3px' : '0% 3px',
        transition:
          phase === 'drawing' ? 'background-size 0.75s ease' :
          phase === 'lit'     ? 'color 0.4s ease' :
          phase === 'erasing' ? 'background-size 0.65s ease, color 0.4s ease' :
          'none',
        color: phase === 'lit' ? '#059669' : '',
        paddingBottom: '2px',
      }}
    >
      Dan
    </span>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { ref, inView } = useInView(0.05)
  return (
    <div
      ref={ref}
      className={`mb-8 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        {title}
      </h2>
      {children}
    </div>
  )
}

export function ResumePage() {
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set())

  function toggleJob(i: number) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Header */}
      <header className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Reiniel <AnimatedDan /> A. Pablo
        </h1>
        <p className="mt-1 text-base font-medium text-emerald-600">
          <span className="block sm:inline">Software Developer</span>
          <span className="hidden sm:inline"> · </span>
          <span className="block sm:inline">Data Analyst</span>
          <span className="hidden sm:inline"> · </span>
          <span className="block sm:inline">AI Practitioner</span>
        </p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
          <a href={`mailto:${EMAIL}`} className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
            <Mail size={13} /> {EMAIL}
          </a>
          <a href={GITHUB} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
            <ExternalLink size={13} /> {GITHUB.replace('https://', '')}
          </a>
          <span className="flex items-center gap-1.5">
            <MapPin size={13} /> Pampanga, PH
          </span>
          <span className="flex items-center gap-1.5">
            <Phone size={13} /> (+63) 976-208-8422
          </span>
        </div>
      </header>

      {/* Skills */}
      <Section title="Skills">
        <div className="space-y-3">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{category}</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Experience */}
      <Section title="Experience">
        <div>
          {experience.map((job, i) => {
            const isCollapsed = collapsed.has(i)
            const isLast = i === experience.length - 1
            return (
              <div key={job.title + job.company} className="flex gap-3">
                {/* Timeline column: dot + line share same center */}
                <div className="flex flex-col items-center shrink-0 print:hidden">
                  <div className="w-2 h-2 mt-[5px] rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-200 shrink-0" />
                  {!isLast && <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 mt-1" />}
                </div>

                {/* Content */}
                <div className={`flex-1 ${!isLast ? 'pb-6' : ''}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-0.5">
                    <div className="flex items-start gap-1.5">
                      <button
                        onClick={() => toggleJob(i)}
                        title={isCollapsed ? 'Expand' : 'Collapse'}
                        className="mt-0.5 p-0.5 rounded text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors shrink-0 print:hidden"
                      >
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`}
                        />
                      </button>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{job.title}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{job.company}</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 mt-0.5 pl-5 sm:pl-0">
                      {job.period}
                      <span className="text-gray-300 dark:text-gray-600"> · </span>
                      {job.duration}
                    </span>
                  </div>

                  {!isCollapsed && (
                    <ul className="mt-2 space-y-1 pl-5">
                      {job.bullets.map((b) => (
                        <li key={b} className="text-sm text-gray-600 dark:text-gray-300 flex gap-2">
                          <span className="text-gray-300 dark:text-gray-600 shrink-0 mt-0.5">—</span>
                          <span><HighlightedText text={b} /></span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Projects */}
      <Section title="Projects & Training">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Most of my work across all roles involved end-to-end development — frontend, API, and backend — but the products and software I built are proprietary and not publicly shareable.{' '}
          <span className="text-gray-600 dark:text-gray-300">I'm happy to walk through them in detail in person.</span>{' '}
          The projects below are ones I can share openly.
        </p>
        <div className="space-y-4">
          {projects.map((p) => (
            <div key={p.name}>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{p.name}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{p.period}</span>
              </div>
              <ul className="mt-2 space-y-1">
                {p.bullets.map((b) => (
                  <li key={b} className="text-sm text-gray-600 dark:text-gray-300 flex gap-2">
                    <span className="text-gray-300 dark:text-gray-600 shrink-0 mt-0.5">—</span>
                    <span><HighlightedText text={b} /></span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Education */}
      <Section title="Education">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-0.5">
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">BS Electronics and Communications Engineering</div>
            <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">AMA Computer College</div>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 mt-0.5">Graduated Apr 2017</span>
        </div>
        <ul className="mt-2 space-y-1">
          <li className="text-sm text-gray-600 dark:text-gray-300 flex gap-2">
            <span className="text-gray-300 dark:text-gray-600 shrink-0 mt-0.5">—</span>
            Clark Development Corporation – Student Excellence Awardee
          </li>
          <li className="text-sm text-gray-600 dark:text-gray-300 flex gap-2">
            <span className="text-gray-300 dark:text-gray-600 shrink-0 mt-0.5">—</span>
            PRC Licensed Electronics Engineer & Electronics Technician (Apr 2018)
          </li>
        </ul>
      </Section>

      <p className="text-xs text-gray-400 dark:text-gray-600 text-center mt-2 pb-2 print:hidden">Last updated May 2026</p>
    </div>
  )
}
