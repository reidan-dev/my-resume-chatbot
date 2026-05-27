import { useState, useEffect } from 'react'
import { deviconClass } from '../utils/deviconMap'
import { Mail, MapPin, Phone, ChevronDown, Wrench, Briefcase, GraduationCap, FileText } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import resumeData from '../data/resume.json'

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸', PH: '🇵🇭', JP: '🇯🇵', ES: '🇪🇸', VN: '🇻🇳', AU: '🇦🇺',
}
const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States', PH: 'Philippines', JP: 'Japan', ES: 'Spain', VN: 'Vietnam', AU: 'Australia',
}

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} className="font-semibold text-gray-800 dark:text-gray-200">{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  )
}

const GITHUB   = import.meta.env.VITE_CONTACT_GITHUB   ?? 'https://github.com/reidan-dev'
const EMAIL    = import.meta.env.VITE_CONTACT_EMAIL    ?? 'reinieldan@gmail.com'
const LINKEDIN = import.meta.env.VITE_CONTACT_LINKEDIN ?? 'https://www.linkedin.com/in/reiniel-dan-pablo'

const QUOTE = "it's me, hi, i'm the developer, it's me..."

function QuoteLine() {
  const [count, setCount]   = useState(0)
  const [phase, setPhase]   = useState<'typing' | 'holding' | 'deleting'>('typing')

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    if (phase === 'typing') {
      if (count < QUOTE.length) t = setTimeout(() => setCount(c => c + 1), 65)
      else                      t = setTimeout(() => setPhase('holding'), 5000)
    } else if (phase === 'holding') {
      t = setTimeout(() => setPhase('deleting'), 0)
    } else {
      if (count > 0) t = setTimeout(() => setCount(c => c - 1), 38)
      else           t = setTimeout(() => setPhase('typing'),    450)
    }
    return () => clearTimeout(t)
  }, [count, phase])

  const full     = count === QUOTE.length
  const displayed = QUOTE.slice(0, count)

  const linkCls = 'underline underline-offset-2 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors'

  return (
    <blockquote className="border-l-2 border-emerald-400 dark:border-emerald-500 pl-4 mt-3 animate-fade-in-up">
      <p className="text-sm italic text-emerald-600 dark:text-emerald-400 break-words">
        {full ? (
          <>
            <a href={LINKEDIN} target="_blank" rel="noreferrer" className={linkCls}>it's me</a>
            {", hi, i'm the developer, "}
            <a href={LINKEDIN} target="_blank" rel="noreferrer" className={linkCls}>it's me</a>
            {'...'}
          </>
        ) : (
          displayed
        )}
        <span className="animate-pulse ml-px">|</span>
      </p>
    </blockquote>
  )
}

const { meta, skills, experience, projects, education } = resumeData

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

function Section({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  const { ref, inView } = useInView(0.05)
  return (
    <div
      ref={ref}
      className={`mb-8 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        <span className="flex items-center gap-2"><Icon className="w-4 h-4 shrink-0" />{title}</span>
      </h2>
      {children}
    </div>
  )
}

export function ResumePage({ onAboutClick }: { onAboutClick?: () => void }) {
  const [collapsed, setCollapsed] = useState<Set<number>>(() => new Set(experience.map((_, i) => i)))
  const [collapsedProjects, setCollapsedProjects] = useState<Set<number>>(() => new Set(projects.items.map((_, i) => i)))
  const [collapsedEdu, setCollapsedEdu] = useState<Set<number>>(() => new Set(education.map((_, i) => i)))

  function toggleJob(i: number) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  function toggleProject(i: number) {
    setCollapsedProjects((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  function toggleEdu(i: number) {
    setCollapsedEdu((prev) => {
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
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          {meta.name.first} <AnimatedDan /> {meta.name.last}
        </h1>
        <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
          {meta.titles.map((title, i) => (
            <span key={title}>
              {i > 0 && (
                <><span className="sm:hidden"><br /></span><span className="hidden sm:inline"> · </span></>
              )}
              {title}
            </span>
          ))}
        </p>

        <QuoteLine />

        <div className="mt-4 space-y-2">
          <div className="flex flex-wrap gap-2">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm print:shadow-none"
            >
              <Mail size={12} /> {EMAIL}
            </a>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm print:shadow-none"
            >
              <LinkedInIcon /> LinkedIn
            </a>
            <a
              href={GITHUB}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm print:shadow-none"
            >
              <GitHubIcon /> GitHub
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 shadow-sm print:shadow-none">
              <MapPin size={12} /> {meta.location}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 shadow-sm print:shadow-none">
              <Phone size={12} /> {meta.phone}
            </span>
          </div>
        </div>
      </header>

      {/* Skills */}
      <Section title="Skills" icon={Wrench}>
        <div className="space-y-3">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{category}</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {items.map((skill) => {
                  const icon = deviconClass(skill)
                  return (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-default"
                    >
                      {icon && <i className={`${icon} text-[13px] leading-none`} />}
                      {skill}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Experience */}
      <Section title="Experience" icon={Briefcase}>
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
                    <button
                      onClick={() => toggleJob(i)}
                      title={isCollapsed ? 'Expand' : 'Collapse'}
                      className="flex items-start gap-1.5 text-left group"
                    >
                      <ChevronDown
                        size={13}
                        className={`mt-0.5 shrink-0 text-emerald-500 dark:text-emerald-400 transition-transform duration-200 print:hidden ${isCollapsed ? '-rotate-90' : ''}`}
                      />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{job.title}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{job.company}</div>
                      </div>
                    </button>
                    <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 mt-0.5 pl-5 sm:pl-0">
                      {job.period}
                      <span className="text-gray-300 dark:text-gray-600"> · </span>
                      ({job.duration})
                    </span>
                  </div>

                  <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}>
                    <div className="overflow-hidden">
                      {job.countries && job.countries.length > 0 && (
                        <div className="mt-2 flex items-center gap-2 flex-wrap text-xs text-gray-400 dark:text-gray-500">
                          <span className="font-medium">Countries worked with:</span>
                          {job.countries.map((c) => (
                            <span key={c} className="text-base cursor-default hover:scale-110 transition-transform" title={`Worked with teammates/clients in ${COUNTRY_NAMES[c] ?? c}`}>
                              {COUNTRY_FLAGS[c]}
                            </span>
                          ))}
                        </div>
                      )}
                      <ul className="mt-2 space-y-1 pl-5">
                        {job.bullets.map((b) => (
                          <li key={b} className="text-sm text-gray-600 dark:text-gray-300 flex gap-2">
                            <span className="text-gray-300 dark:text-gray-600 shrink-0 mt-0.5">—</span>
                            <span><RichText text={b} /></span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Projects */}
      <Section title="Projects & Training" icon={FileText}>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{projects.note}</p>
        <div className="space-y-4">
          {projects.items.map((p, i) => {
            const isCollapsed = collapsedProjects.has(i)
            return (
              <div key={p.name}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                  <button
                    onClick={() => toggleProject(i)}
                    title={isCollapsed ? 'Expand' : 'Collapse'}
                    className="flex items-start gap-1.5 text-left group"
                  >
                    <ChevronDown size={13} className={`mt-0.5 shrink-0 text-emerald-500 dark:text-emerald-400 transition-transform duration-200 print:hidden ${isCollapsed ? '-rotate-90' : ''}`} />
                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{p.name}</span>
                  </button>
                  <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 pl-5 sm:pl-0">{p.period}</span>
                </div>
                <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}>
                  <div className="overflow-hidden">
                    <ul className="mt-2 space-y-1 pl-5">
                      {p.bullets.map((b) => (
                        <li key={b} className="text-sm text-gray-600 dark:text-gray-300 flex gap-2">
                          <span className="text-gray-300 dark:text-gray-600 shrink-0 mt-0.5">—</span>
                          <span><RichText text={b} /></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Education */}
      <Section title="Education" icon={GraduationCap}>
        {education.map((edu, i) => {
          const isCollapsed = collapsedEdu.has(i)
          return (
            <div key={edu.degree}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-0.5">
                <button
                  onClick={() => toggleEdu(i)}
                  title={isCollapsed ? 'Expand' : 'Collapse'}
                  className="flex items-start gap-1.5 text-left group"
                >
                  <ChevronDown size={13} className={`mt-0.5 shrink-0 text-emerald-500 dark:text-emerald-400 transition-transform duration-200 print:hidden ${isCollapsed ? '-rotate-90' : ''}`} />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{edu.degree}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{edu.school}</div>
                  </div>
                </button>
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 mt-0.5 pl-5 sm:pl-0">Graduated {edu.graduated}</span>
              </div>
              <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}>
                <div className="overflow-hidden">
                  <ul className="mt-2 space-y-1 pl-5">
                    {edu.bullets.map((b) => (
                      <li key={b} className="text-sm text-gray-600 dark:text-gray-300 flex gap-2">
                        <span className="text-gray-300 dark:text-gray-600 shrink-0 mt-0.5">—</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </Section>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 print:hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs text-gray-400 dark:text-gray-500">Last updated {meta.lastUpdated}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onAboutClick}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors underline underline-offset-2"
            >
              About Folio
            </button>
            <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
            <a
              href="https://simple.danpablo.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              <span>View Simple Version</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="17 17 17 7 7 7"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
