import { useState } from 'react'
import { Check, Copy, Glasses } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { SourceBadge } from './SourceBadge'
import type { Message } from '../hooks/useChat'

interface Props {
  message: Message
  onDanClick?: () => void
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end gap-1 h-4">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.7s' }}
          />
        ))}
      </div>
      <span className="text-xs text-gray-400 italic">Folio is thinking…</span>
    </div>
  )
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
      <div className="flex flex-col items-end gap-0.5">
        <div className="max-w-[80%] px-3 py-2 rounded-2xl rounded-tr-sm bg-emerald-600 text-white text-xs">
          {message.content}
        </div>
        <span className="text-[10px] text-gray-400 pr-1">{formatTime(message.createdAt)}</span>
      </div>
    )
  }

  return (
    <div className="flex justify-start gap-1.5 items-start group">
      <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
        <Glasses size={13} className="text-emerald-500" />
      </div>
      <div className="max-w-[85%] space-y-1">
        <div
          className={`relative px-3 py-2 rounded-2xl rounded-tl-sm text-xs ${
            message.error
              ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100'
          }`}
        >
          {!message.streaming && !message.error && message.content && (
            <button
              onClick={copyToClipboard}
              title="Copy response"
              className="absolute top-1.5 right-1.5 opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
                code: ({ children }) => (
                  <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs font-mono text-gray-800 dark:text-gray-200">
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
                    return <strong className="font-semibold text-red-900 dark:text-red-400">{children}</strong>
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
        {!message.streaming && (
          <span className="text-[10px] text-gray-400 pl-1">{formatTime(message.createdAt)}</span>
        )}
      </div>
    </div>
  )
}
