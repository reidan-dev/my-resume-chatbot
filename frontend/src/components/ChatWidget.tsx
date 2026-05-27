import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { X, Send, RotateCcw, Minus } from 'lucide-react'
import { useChat } from '../hooks/useChat'
import type { useRateLimit } from '../hooks/useRateLimit'
import type { HealthResult } from '../hooks/useHealth'
import { MessageBubble } from './MessageBubble'
import { ContactCard } from './ContactCard'
import { SuggestedQuestions } from './SuggestedQuestions'
import { RateLimitBadge } from './RateLimitBadge'

const BOT_NAME = import.meta.env.VITE_BOT_NAME ?? 'Folio'
const BOT_INTRO = import.meta.env.VITE_BOT_INTRO ?? `Hey there! I'm Folio, Dan's AI portfolio assistant — powered by a RAG pipeline that grounds every answer directly in his resume and Q&A guide, so no guessing here. Ask me anything about his background, skills, or experience!`

function renderIntro(text: string) {
  return text.split(/(\bFolio\b|\bDan\b)/g).map((part, i) => {
    if (part === 'Folio') return <strong key={i} className="font-semibold text-red-900">{part}</strong>
    if (part === 'Dan')   return <strong key={i} className="font-semibold text-emerald-600">{part}</strong>
    return part
  })
}

interface Props {
  isOpen: boolean
  onClose: () => void
  rateLimit: ReturnType<typeof useRateLimit>
  health: HealthResult
  limit: number
  onDanClick: () => void
  onFirstMessage?: () => void
}

export function ChatWidget({ isOpen, onClose, rateLimit, health, limit, onDanClick, onFirstMessage }: Props) {
  const { messages, sendMessage, isStreaming, isExhausted, remaining, resetAt, reset } = useChat(rateLimit)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isAtBottomRef = useRef(true)

  function handleScroll() {
    const el = scrollContainerRef.current
    if (!el) return
    isAtBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 50
  }

  useEffect(() => {
    if (!isOpen || !isAtBottomRef.current) return
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen])

  useEffect(() => {
    if (isStreaming) {
      const orig = document.title
      document.title = 'Folio is thinking… | Dan Pablo'
      return () => { document.title = orig }
    }
  }, [isStreaming])

  function submit() {
    const text = input.trim()
    if (!text || isStreaming || isExhausted || health.status === 'offline') return
    const isFirst = messages.length === 0
    setInput('')
    isAtBottomRef.current = true
    sendMessage(text)
    if (isFirst) onFirstMessage?.()
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const showSuggestions = messages.length === 0 && !isExhausted

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Chat panel */}
      <div
        className={`
          fixed z-50 flex flex-col bg-white dark:bg-gray-900 shadow-2xl will-change-transform overflow-hidden
          transition-all duration-300 ease-out

          /* Mobile: bottom sheet — slides up/down */
          inset-x-0 bottom-0 rounded-t-2xl max-h-[85dvh]
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}

          /* Desktop: floating box — fades + scales in/out */
          md:inset-x-auto md:bottom-20 md:right-6 md:top-auto
          md:w-[320px] md:h-[460px] md:rounded-2xl md:border md:border-gray-200 dark:md:border-gray-700
          md:translate-y-0
          ${isOpen
            ? 'md:opacity-100 md:scale-100 md:pointer-events-auto'
            : 'md:opacity-0 md:scale-95 md:translate-y-3 md:pointer-events-none'
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100 dark:border-gray-800 shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-1.5">
            <span className="text-base leading-none select-none shrink-0">🤖</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{BOT_NAME}</span>
            <div className={`w-1.5 h-1.5 rounded-full ${
              health.status === 'online' ? 'bg-emerald-500' :
              health.status === 'offline' ? 'bg-red-400' :
              'bg-gray-300 animate-pulse'
            }`} />
            <RateLimitBadge remaining={remaining} limit={limit} />
          </div>
          <div className="flex items-center gap-0.5">
            {messages.length > 0 && (
              <button
                onClick={reset}
                title="New conversation"
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <RotateCcw size={13} />
              </button>
            )}
            <button
              onClick={onClose}
              title="Close"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
            >
              <X size={15} />
            </button>
            <button
              onClick={onClose}
              title="Minimize"
              className="hidden md:flex p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Minus size={15} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
          {/* Static intro message */}
          <div className="flex justify-start gap-1.5 items-start">
            <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-sm leading-none select-none">🤖</span>
            </div>
            <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-tl-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 text-xs">
              {renderIntro(BOT_INTRO)}
            </div>
          </div>

          {showSuggestions && (
            <div className="pb-1">
              <SuggestedQuestions onSelect={(q) => sendMessage(q)} disabled={isStreaming} />
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} onDanClick={onDanClick} />
          ))}

          {isExhausted && <ContactCard resetAt={resetAt} />}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {!isExhausted && (
          <div className="px-3 pt-2.5 border-t border-gray-100 dark:border-gray-800 shrink-0 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
            <div className="flex items-end gap-1.5 min-w-0">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about Dan…"
                rows={1}
                disabled={isStreaming}
                className="flex-1 min-w-0 resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 max-h-24 overflow-hidden"
              />
              <button
                onClick={submit}
                disabled={!input.trim() || isStreaming || health.status === 'offline'}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={13} />
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-center gap-2 text-[10px] text-gray-400">
              <span>{health.model}</span>
              <span className="text-gray-300">·</span>
              <span>Conversations may be logged.</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
