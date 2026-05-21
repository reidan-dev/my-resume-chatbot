import { useState } from 'react'

interface Props {
  remaining: number
  limit: number
}

export function RateLimitBadge({ remaining, limit }: Props) {
  const [open, setOpen] = useState(false)

  if (remaining >= limit) return null

  const color =
    remaining >= 3
      ? 'bg-emerald-100 text-emerald-700'
      : remaining === 2
        ? 'bg-amber-100 text-amber-700'
        : 'bg-orange-100 text-orange-700'

  const label =
    remaining === 1 ? 'Last question!' : `${remaining} questions left`

  return (
    <div className="relative inline-flex items-center gap-1">
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-500 text-[9px] font-bold flex items-center justify-center hover:bg-gray-300 transition-colors shrink-0"
        aria-label="Why is there a question limit?"
      >
        ?
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-56 p-2.5 rounded-lg bg-gray-900 text-white text-xs shadow-xl z-50 leading-relaxed">
          <div className="absolute bottom-full left-3 border-4 border-transparent border-b-gray-900" />
          This chatbot uses a paid AI API. The question limit is a security measure to prevent excessive usage and keep it running for everyone. Questions reset every 3 days.
        </div>
      )}
    </div>
  )
}
