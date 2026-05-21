import { useState, useEffect } from 'react'
import { Mail, ExternalLink } from 'lucide-react'

const LIMIT = 5
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? 'reinieldan@gmail.com'
const CONTACT_LINKEDIN = import.meta.env.VITE_CONTACT_LINKEDIN ?? 'https://linkedin.com/in/danpablo'
const CONTACT_GITHUB = import.meta.env.VITE_CONTACT_GITHUB ?? 'https://github.com/reidan22'

function useCountdown(target: Date) {
  const [label, setLabel] = useState('')

  useEffect(() => {
    function update() {
      const ms = target.getTime() - Date.now()
      if (ms <= 0) { setLabel('now'); return }
      const d = Math.floor(ms / 86_400_000)
      const h = Math.floor((ms % 86_400_000) / 3_600_000)
      const m = Math.floor((ms % 3_600_000) / 60_000)
      setLabel(d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`)
    }
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [target])

  return label
}

export function ContactCard({ resetAt }: { resetAt: Date }) {
  const timeLeft = useCountdown(resetAt)

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 space-y-4 text-sm animate-fade-in">
      <div>
        <p className="font-semibold text-emerald-800 text-base">🎉 Looks like you're interested!</p>
        <p className="text-emerald-700 mt-1">
          You've used all {LIMIT} questions. Let's connect directly.
        </p>
      </div>

      <div className="space-y-2">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="flex items-center gap-3 min-h-[44px] text-emerald-700 hover:text-emerald-900 transition-colors"
        >
          <Mail size={16} />
          {CONTACT_EMAIL}
        </a>
        <a
          href={CONTACT_LINKEDIN}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 min-h-[44px] text-emerald-700 hover:text-emerald-900 transition-colors"
        >
          <ExternalLink size={16} />
          LinkedIn Profile
        </a>
        <a
          href={CONTACT_GITHUB}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 min-h-[44px] text-emerald-700 hover:text-emerald-900 transition-colors"
        >
          <ExternalLink size={16} />
          GitHub Profile
        </a>
      </div>

      <p className="text-xs text-emerald-600">↻ Questions reset in {timeLeft}</p>
    </div>
  )
}
