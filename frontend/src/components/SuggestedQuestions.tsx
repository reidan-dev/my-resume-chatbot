import { useState } from 'react'

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
  const [question] = useState(() => QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)])

  return (
    <div className="mt-1">
      <button
        onClick={() => onSelect(question)}
        disabled={disabled}
        className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-emerald-400 dark:hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {question}
      </button>
    </div>
  )
}
