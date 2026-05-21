interface Props {
  sources: string[]
}

export function SourceBadge({ sources }: Props) {
  if (!sources?.length) return null

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {sources.map((s) => (
        <span
          key={s}
          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500 border border-gray-200"
          title="Source section"
        >
          📄 {s}
        </span>
      ))}
    </div>
  )
}
