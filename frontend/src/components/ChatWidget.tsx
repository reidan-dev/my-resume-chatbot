import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { X, Send, RotateCcw, Minus } from 'lucide-react'
import { useChat } from '../hooks/useChat'
import type { useRateLimit } from '../hooks/useRateLimit'
import { MessageBubble } from './MessageBubble'
import { ContactCard } from './ContactCard'
import { SuggestedQuestions } from './SuggestedQuestions'
import { RateLimitBadge } from './RateLimitBadge'

const LIMIT = 5
const BOT_NAME = import.meta.env.VITE_BOT_NAME ?? 'Folio'
const BOT_INTRO = import.meta.env.VITE_BOT_INTRO ?? `Hi! Ask me anything about Dan's background, skills, and experience.`

interface Props {
  isOpen: boolean
  onClose: () => void
  rateLimit: ReturnType<typeof useRateLimit>
  onDanClick: () => void
}

export function ChatWidget({ isOpen, onClose, rateLimit, onDanClick }: Props) {
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
    if (!isAtBottomRef.current) return
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen])

  function submit() {
    const text = input.trim()
    if (!text || isStreaming || isExhausted) return
    setInput('')
    isAtBottomRef.current = true
    sendMessage(text)
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
          fixed z-50 flex flex-col bg-white shadow-2xl will-change-transform
          transition-all duration-300 ease-out

          /* Mobile: bottom sheet */
          inset-x-0 bottom-0 rounded-t-2xl max-h-[85dvh]
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}

          /* Desktop: floating messenger-style box */
          md:inset-x-auto md:bottom-20 md:right-6 md:top-auto
          md:w-[320px] md:h-[460px] md:rounded-2xl md:border md:border-gray-200
          md:translate-y-0
          ${!isOpen ? 'md:hidden' : 'md:flex md:flex-col'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100 shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-1.5">
            <span className="text-base">👓</span>
            <span className="font-semibold text-gray-900 text-sm">{BOT_NAME}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <RateLimitBadge remaining={remaining} limit={LIMIT} />
          </div>
          <div className="flex items-center gap-0.5">
            {messages.length > 0 && (
              <button
                onClick={reset}
                title="New conversation"
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <RotateCcw size={13} />
              </button>
            )}
            <button
              onClick={onClose}
              title="Close"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors md:hidden"
            >
              <X size={15} />
            </button>
            <button
              onClick={onClose}
              title="Minimize"
              className="hidden md:flex p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Minus size={15} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
          {/* Static intro message */}
          <div className="flex justify-start gap-1.5 items-start">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm shrink-0 mt-0.5">
              👓
            </div>
            <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-tl-sm bg-white border border-gray-200 text-gray-800 text-xs">
              {BOT_INTRO}
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
          <div className="px-3 py-2.5 border-t border-gray-100 shrink-0 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
            <div className="flex items-end gap-1.5">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about Dan…"
                rows={1}
                disabled={isStreaming}
                className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 max-h-24 overflow-y-auto"
                style={{ fieldSizing: 'content' } as React.CSSProperties}
              />
              <button
                onClick={submit}
                disabled={!input.trim() || isStreaming}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
