import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { SourceBadge } from './SourceBadge'
import type { Message } from '../hooks/useChat'

interface Props {
  message: Message
  onDanClick?: () => void
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-1 h-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.7s' }}
        />
      ))}
    </div>
  )
}

function processContent(content: string): string {
  return content
    .replace(/\bDan\b/g, '[Dan](#contact)')
    .replace(/\bFolio\b/g, '[Folio](#folio)')
}

export function MessageBubble({ message, onDanClick }: Props) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)

  function copyToClipboard() {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] px-3 py-2 rounded-2xl rounded-tr-sm bg-emerald-600 text-white text-xs">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start gap-1.5 items-start group">
      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm shrink-0 mt-0.5">
        👓
      </div>
      <div className="max-w-[85%] space-y-1">
        <div
          className={`relative px-3 py-2 rounded-2xl rounded-tl-sm text-xs ${
            message.error
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-white border border-gray-200 text-gray-800'
          }`}
        >
          {!message.streaming && !message.error && message.content && (
            <button
              onClick={copyToClipboard}
              title="Copy response"
              className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-gray-300 hover:text-gray-500 hover:bg-gray-100"
            >
              {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
            </button>
          )}
          {message.streaming && !message.content ? (
            <TypingIndicator />
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-4 mb-1.5 space-y-0.5">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 mb-1.5 space-y-0.5">{children}</ol>,
                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                code: ({ children }) => (
                  <code className="px-1 py-0.5 rounded bg-gray-100 text-xs font-mono text-gray-800">
                    {children}
                  </code>
                ),
                a: ({ href, children }) => {
                  if (href === '#contact') {
                    return (
                      <button
                        onClick={onDanClick}
                        className="text-emerald-600 font-semibold hover:underline cursor-pointer"
                      >
                        {children}
                      </button>
                    )
                  }
                  if (href === '#folio') {
                    return <strong className="font-semibold text-red-900">{children}</strong>
                  }
                  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
                },
              }}
            >
              {processContent(message.content)}
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
