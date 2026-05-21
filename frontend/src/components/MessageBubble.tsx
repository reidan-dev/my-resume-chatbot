import ReactMarkdown from 'react-markdown'
import { SourceBadge } from './SourceBadge'
import type { Message } from '../hooks/useChat'

interface Props {
  message: Message
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 h-5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse-dot"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </div>
  )
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-emerald-600 text-white text-sm">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] space-y-1">
        <div
          className={`px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm ${
            message.error
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-white border border-gray-200 text-gray-800'
          }`}
        >
          {message.streaming && !message.content ? (
            <TypingIndicator />
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                code: ({ children }) => (
                  <code className="px-1 py-0.5 rounded bg-gray-100 text-xs font-mono text-gray-800">
                    {children}
                  </code>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        {message.sources && message.sources.length > 0 && !message.streaming && (
          <SourceBadge sources={message.sources} />
        )}
      </div>
    </div>
  )
}
