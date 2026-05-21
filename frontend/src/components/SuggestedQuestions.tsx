const QUESTIONS = [
  "Tell me about Dan's professional background.",
  "What is Dan's strongest programming language?",
  "What kind of projects has Dan worked on?",
  "Does Dan have experience with AI or machine learning?",
  "Is Dan available for remote work?",
  "What are Dan's career goals?",
]

interface Props {
  onSelect: (q: string) => void
  disabled?: boolean
}

export function SuggestedQuestions({ onSelect, disabled }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Suggested questions</p>
      <div className="flex flex-wrap gap-2">
        {QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            disabled={disabled}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}
