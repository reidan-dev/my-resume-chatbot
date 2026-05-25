import { useState } from 'react'
import { GitFork, ExternalLink, ChevronDown } from 'lucide-react'
import resumeData from '../data/resume.json'
import { deviconClass } from '../utils/deviconMap'

type Project = {
  name: string
  tagline: string
  description: string
  period: string
  status: 'live' | 'wip' | 'archived' | 'local'
  tags: string[]
  github: string | null
  live: string | null
  image: string | null
  emoji: string | null
}

const projects = resumeData.personal_projects as Project[]

const statusConfig = {
  live:     { label: 'Live',        dot: 'bg-emerald-500', className: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700' },
  wip:      { label: 'In Progress', dot: 'bg-amber-400',   className: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700' },
  archived: { label: 'Archived',    dot: 'bg-gray-400',    className: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700' },
  local:    { label: 'Local',       dot: 'bg-sky-400',     className: 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-700' },
}

/* Deterministic gradient per project name so placeholders feel intentional */
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

function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false)
  const status = statusConfig[project.status] ?? statusConfig.archived

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {/* Image / banner */}
      <ImageBanner project={project} />

      {/* Body */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        {/* Name + status */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug">{project.name}</h3>
          <span className={`shrink-0 flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${status.className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${project.status === 'live' ? 'animate-pulse' : ''}`} />
            {status.label}
          </span>
        </div>

        {/* Tagline — always visible */}
        <p className="text-xs font-medium text-gray-700 dark:text-gray-200 leading-snug">{project.tagline}</p>

        {/* Long description — expandable */}
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
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
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
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <GitFork size={12} />
                <span>GitHub</span>
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-medium"
              >
                <ExternalLink size={12} />
                <span>Live</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
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
