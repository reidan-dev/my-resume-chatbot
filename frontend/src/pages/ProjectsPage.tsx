import { useState, useEffect } from 'react'
import { GitFork, ExternalLink, ChevronDown, FileText, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import resumeData from '../data/resume.json'
import { deviconClass } from '../utils/deviconMap'
import { createPortal } from 'react-dom'

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
  image: string | null
  emoji: string | null
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

const gradients = [
  'from-emerald-400 to-teal-600',
  'from-violet-400 to-indigo-600',
  'from-rose-400 to-pink-600',
  'from-amber-400 to-orange-600',
  'from-sky-400 to-blue-600',
]
function gradientFor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return gradients[h % gradients.length]
}

function ImageBanner({ project }: { project: Project }) {
  if (project.image) {
    return (
      <div className="w-full h-20 overflow-hidden rounded-t-2xl">
        <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
      </div>
    )
  }
  const gradient = gradientFor(project.name)
  return (
    <div className={`w-full h-20 rounded-t-2xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
      {project.emoji
        ? <span className="text-4xl select-none drop-shadow-sm">{project.emoji}</span>
        : <span className="text-white/30 font-bold text-4xl select-none tracking-tight">
            {project.name.split(/[\s—–-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')}
          </span>
      }
    </div>
  )
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

function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false)
  const [pdfOpen, setPdfOpen] = useState(false)
  const status = statusConfig[project.status] ?? statusConfig.archived

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
        <ImageBanner project={project} />

        <div className="flex flex-col gap-2 p-4 flex-1">
          {/* Name + status */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug">{project.name}</h3>
            <span className={`shrink-0 flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${status.className}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${project.status === 'live' ? 'animate-pulse' : ''}`} />
              {status.label}
            </span>
          </div>

          {/* Tagline */}
          <p className="text-xs font-medium text-gray-700 dark:text-gray-200 leading-snug">{project.tagline}</p>

          {/* Expandable description */}
          <div>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
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
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => {
              const icon = deviconClass(tag)
              return (
                <span key={tag} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {icon && <i className={`${icon} text-[11px] leading-none`} />}
                  {tag}
                </span>
              )
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700 mt-auto">
            <span className="text-[10px] text-gray-400 dark:text-gray-500">{project.period}</span>
            <div className="flex items-center gap-3">
              {project.pdf && (
                <button
                  onClick={() => setPdfOpen(true)}
                  className="flex items-center gap-1 text-[10px] text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors font-medium"
                >
                  <FileText size={12} />
                  <span>Deck</span>
                </button>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                  <GitFork size={12} />
                  <span>GitHub</span>
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-medium">
                  <ExternalLink size={12} />
                  <span>Live</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {pdfOpen && project.pdf && (
        <PdfModal url={project.pdf} title={project.name} onClose={() => setPdfOpen(false)} />
      )}
    </>
  )
}

export function ProjectsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Projects</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Side projects and personal work I can share openly.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </div>
  )
}
