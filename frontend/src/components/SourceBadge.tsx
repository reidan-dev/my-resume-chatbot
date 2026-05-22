import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface Props {
  sources: string[]
}

export function SourceBadge({ sources }: Props) {
  const [open, setOpen] = useState(false)

  if (!sources?.length) return null

  return (
    <div className="mt-1.5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
      >
        {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
        RAG trail ({sources.length})
      </button>

      {open && (
        <div className="flex flex-col gap-1 mt-1">
          {sources.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700"
            >
              📄 {s}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
