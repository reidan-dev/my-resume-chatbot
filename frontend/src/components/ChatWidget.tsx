import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { X, Send, RotateCcw } from 'lucide-react'
import { useChat } from '../hooks/useChat'
import { MessageBubble } from './MessageBubble'
import { ContactCard } from './ContactCard'
import { SuggestedQuestions } from './SuggestedQuestions'
import { RateLimitBadge } from './RateLimitBadge'

const LIMIT = 5

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function ChatWidget({ isOpen, onClose }: Props) {
  const { messages, sendMessage, isStreaming, isExhausted, remaining, resetAt, reset } = useChat()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen])

  function submit() {
    const text = input.trim()
    if (!text || isStreaming || isExhausted) return
    setInput('')
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
          fixed z-50 flex flex-col bg-white shadow-xl
          transition-transform duration-300 ease-out

          /* Mobile: full-screen bottom sheet */
          inset-x-0 bottom-0 rounded-t-2xl max-h-[90dvh]
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}

          /* Desktop: right sidebar, always present */
          md:top-0 md:right-0 md:bottom-0 md:left-auto md:rounded-none
          md:w-[420px] md:max-h-full md:border-l md:border-gray-200
          md:translate-y-0
          ${!isOpen ? 'md:hidden' : ''}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-gray-900 text-sm">Ask about Dan</span>
            <RateLimitBadge remaining={remaining} limit={LIMIT} />
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={reset}
                title="New conversation"
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <RotateCcw size={15} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors md:hidden"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {showSuggestions && (
            <div className="pb-2">
              <SuggestedQuestions onSelect={(q) => sendMessage(q)} disabled={isStreaming} />
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isExhausted && <ContactCard resetAt={resetAt} />}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {!isExhausted && (
          <div className="px-4 py-3 border-t border-gray-100 shrink-0 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a question…"
                rows={1}
                disabled={isStreaming}
                className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 max-h-32 overflow-y-auto"
                style={{ fieldSizing: 'content' } as React.CSSProperties}
              />
              <button
                onClick={submit}
                disabled={!input.trim() || isStreaming}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
