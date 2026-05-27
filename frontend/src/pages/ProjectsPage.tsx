import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { GitFork, ExternalLink, ChevronDown, FileText, X, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import resumeData from '../data/resume.json'
import { deviconClass } from '../utils/deviconMap'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

type Project = {
  name: string
  tagline: string
  description: string
  period: string
  status: 'live' | 'wip' | 'archived' | 'local' | 'migrating'
  tags: string[]
  github: string | null
  live: string | null
  pdf: string | null
}

const projects = resumeData.personal_projects as Project[]

const statusConfig = {
  live:      { label: 'Live',        dot: 'bg-emerald-500', className: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700' },
  wip:       { label: 'In Progress', dot: 'bg-amber-400',   className: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700' },
  archived:  { label: 'Archived',    dot: 'bg-gray-400',    className: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700' },
  local:     { label: 'Local',       dot: 'bg-sky-400',     className: 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-700' },
  migrating: { label: 'Migrating',   dot: 'bg-yellow-400',  className: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700' },
}

function PdfModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  const [numPages, setNumPages] = useState<number>(0)
  const [page, setPage] = useState(1)
  const [width, setWidth] = useState(600)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setPage((p) => Math.min(p + 1, numPages))
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   setPage((p) => Math.max(p - 1, 1))
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, numPages])

  useEffect(() => {
    function onResize() {
      setWidth(Math.min(window.innerWidth - 48, 760))
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex flex-col items-center gap-3 w-full max-w-3xl">
        {/* Header */}
        <div className="w-full flex items-center justify-between bg-white dark:bg-gray-900 rounded-xl px-4 py-2.5 shadow-lg">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{title}</span>
          <div className="flex items-center gap-3 shrink-0 ml-3">
            {numPages > 0 && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {page} / {numPages}
              </span>
            )}
            <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* PDF page */}
        <div className="rounded-xl overflow-hidden shadow-2xl bg-white">
          <Document
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<div className="flex items-center justify-center w-full h-64 text-sm text-gray-400">Loading…</div>}
          >
            <Page pageNumber={page} width={width} renderTextLayer={false} renderAnnotationLayer={false} />
          </Document>
        </div>

        {/* Navigation */}
        {numPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(numPages, 12) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${page === i + 1 ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
                />
              ))}
              {numPages > 12 && <span className="text-white/50 text-xs self-center ml-1">+{numPages - 12}</span>}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, numPages))}
              disabled={page === numPages}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

function EmojiBadge({ emoji }: { emoji: string | null }) {
  return (
    <div className="shrink-0 flex items-center justify-center w-9 h-9 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-xl">
      {emoji || '📦'}
    </div>
  )
}

const nameEmoji: Record<string, string | null> = {
  'Beadify':              '🎨',
  'My AI-enabled Chatbot Resume Page': '🤖',
  'Check-App':            '🩺',
  'Eevee Virtual Pet — macOS': '🐾',
  'PH 2022 Election Map': '🗺️',
}

function StatusBadge({ status }: { status: Project['status'] }) {
  const cfg = statusConfig[status] ?? statusConfig.archived
  return (
    <span className={`shrink-0 inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${cfg.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${status === 'live' ? 'animate-pulse' : ''}`} />
      {cfg.label}
    </span>
  )
}

function TagPill({ tag }: { tag: string }) {
  const icon = deviconClass(tag)
  return (
    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-700/60 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-600/50">
      {icon && <i className={`${icon} text-[12px] leading-none`} />}
      {tag}
    </span>
  )
}

function FooterLinks({ project }: { project: Project }) {
  return (
    <div className="flex items-center gap-1.5">
      {project.pdf && (
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 font-medium hover:bg-violet-100 dark:hover:bg-violet-900/30 cursor-pointer transition-colors">
          <FileText size={11} />
          Deck
        </span>
      )}
      {project.github && (
        <a href={project.github} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <GitFork size={11} />
          Code
        </a>
      )}
      {project.live && (
        <a href={project.live} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
          <ExternalLink size={11} />
          Live
        </a>
      )}
    </div>
  )
}

function MentoredProjectsCard() {
  const groups = [
    { num: 'I',  site: 'https://web-system-g1.vercel.app', doc: 'https://web-system-g1.vercel.app/source/files/Project%20Document.pdf' },
    { num: 'II', site: 'https://web-system-g2.vercel.app', doc: 'https://web-system-g2.vercel.app/files/Project%20Document.pdf' },
    { num: 'III',site: 'https://web-system-g3.vercel.app', doc: 'https://web-system-g3.vercel.app/assets/files/Project%20Document.pdf' },
    { num: 'IV', site: 'https://web-system-g4.vercel.app', doc: 'https://web-system-g4.vercel.app/files/Project_Management-Deliverable.pdf' },
    { num: 'V',  site: 'https://web-system-g5.vercel.app', doc: 'https://web-system-g5.vercel.app/src/files/Project%20Charter1.pdf' },
  ]
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up">
      <div className="p-4 pb-3">
        <div className="flex items-start gap-2.5">
          <EmojiBadge emoji="🎓" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug">Mentored Projects</h3>
              <span className={`shrink-0 inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${statusConfig.live.className}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-200 mt-1 leading-snug">
              Full-stack web projects built by student teams under Dan's mentorship at STI College
            </p>
          </div>
        </div>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mt-2.5">
          During my tenure as a part-time college instructor, I mentored 5 student groups across Web System courses. Each team built a full-stack portfolio and project hub with individual profiles, interactive elements, and deliverable documentation — simulating real product owner / developer dynamics.
        </p>
      </div>
      <div className="px-4 pb-3.5 pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 flex-wrap">
          {groups.map((g, i) => (
            <div key={g.num}
              className="shrink-0 flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 rounded-full pl-3 pr-2 py-1 border border-gray-100 dark:border-gray-600/50">
              <span className="text-xs font-bold text-gray-300 dark:text-gray-600 select-none">{g.num}</span>
              <a href={g.site} target="_blank" rel="noopener noreferrer"
                className="text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <ExternalLink size={13} />
              </a>
              <a href={g.doc} target="_blank" rel="noopener noreferrer"
                className="text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                <FileText size={13} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-3.5 flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">2023</span>
      </div>
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const [pdfOpen, setPdfOpen] = useState(false)
  const emoji = nameEmoji[project.name]

  return (
    <>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up"
        style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
      >
        <div className="p-4 pb-3">
          {/* Header */}
          <div className="flex items-start gap-2.5">
            <EmojiBadge emoji={emoji} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug">{project.name}</h3>
                <StatusBadge status={project.status} />
              </div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-200 mt-1 leading-snug">{project.tagline}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-2.5">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              <ChevronDown size={12} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
              {expanded ? 'Less' : 'More'}
            </button>
            <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed pt-1.5">{project.description}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {project.tags.map((tag) => <TagPill key={tag} tag={tag} />)}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-3.5 flex items-center justify-between pt-2 mt-auto border-t border-gray-100 dark:border-gray-700">
          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">{project.period}</span>
          <FooterLinks project={project} />
        </div>
      </div>

      {pdfOpen && project.pdf && (
        <PdfModal url={project.pdf} title={project.name} onClose={() => setPdfOpen(false)} />
      )}
    </>
  )
}

export function ProjectsPage({ onAboutClick }: { onAboutClick?: () => void }) {
  const folio = projects.find(p => p.name === 'My AI-enabled Chatbot Resume Page')
  const others = projects.filter(p => p.name !== 'My AI-enabled Chatbot Resume Page')

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Projects</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Side projects and personal work I can share openly.
        </p>
      </div>

      {/* Hero: Folio — the live demo */}
      {folio && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up">
          <div className="p-4 pb-3">
            {/* Header */}
            <div className="flex items-start gap-2.5">
              <EmojiBadge emoji={nameEmoji[folio.name]} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-snug">{folio.name}</h3>
                  <StatusBadge status="live" />
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-200 mt-1 leading-snug">{folio.tagline}</p>
              </div>
            </div>

            {/* Description (always expanded) */}
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mt-2.5">{folio.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2.5">
              {folio.tags.map((tag) => <TagPill key={tag} tag={tag} />)}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 pb-3.5 flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">{folio.period}</span>
            <div className="flex items-center gap-1.5">
              {onAboutClick && (
                <button onClick={onAboutClick}
                  className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                  <ArrowUpRight size={11} />
                  Details
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Other projects */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Other Projects</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          {others.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
        <div className="mt-6">
          <MentoredProjectsCard />
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 print:hidden">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={onAboutClick}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors underline underline-offset-2"
            >
              About Folio
            </button>
            <span className="text-gray-300 dark:text-gray-600">|</span>
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
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Last updated {resumeData.meta.lastUpdated}</p>
        </div>
      </div>
    </div>
  )
}
