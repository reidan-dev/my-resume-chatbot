interface Props {
  remaining: number
  limit: number
}

export function RateLimitBadge({ remaining, limit }: Props) {
  if (remaining >= limit) return null

  const color =
    remaining >= 3
      ? 'bg-emerald-100 text-emerald-700'
      : remaining === 2
        ? 'bg-amber-100 text-amber-700'
        : 'bg-orange-100 text-orange-700'

  const label =
    remaining === 1 ? 'Last question!' : `${remaining} question${remaining !== 1 ? 's' : ''} left`

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  )
}
