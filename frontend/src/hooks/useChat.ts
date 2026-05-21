import { useState, useCallback, useRef } from 'react'
import { streamChat, resetChat } from '../lib/api'
import { useRateLimit } from './useRateLimit'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
  streaming?: boolean
  error?: boolean
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const sessionId = useRef(crypto.randomUUID())
  const abortRef = useRef<(() => void) | null>(null)
  const { syncFromHeaders, increment, isExhausted, remaining, resetAt } = useRateLimit()

  const sendMessage = useCallback(
    (text: string) => {
      if (isStreaming || isExhausted || !text.trim()) return

      const assistantId = crypto.randomUUID()

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'user', content: text },
        { id: assistantId, role: 'assistant', content: '', streaming: true },
      ])
      setIsStreaming(true)
      increment()

      const abort = streamChat(
        text,
        sessionId.current,
        (token) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + token } : m,
            ),
          )
        },
        (sources) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, sources } : m)),
          )
        },
        ({ remaining: r, reset_at, limit: _l }) => {
          syncFromHeaders(r, reset_at)
        },
        () => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, streaming: false } : m,
            ),
          )
          setIsStreaming(false)
        },
        (err) => {
          const msg =
            err === 'rate_limit_exceeded'
              ? "You've reached the question limit. Reach out directly!"
              : 'Something went wrong. Please try again.'
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: msg, streaming: false, error: true }
                : m,
            ),
          )
          setIsStreaming(false)
        },
      )

      abortRef.current = abort
    },
    [isStreaming, isExhausted, increment, syncFromHeaders],
  )

  const reset = useCallback(() => {
    abortRef.current?.()
    setMessages([])
    setIsStreaming(false)
    resetChat(sessionId.current)
    sessionId.current = crypto.randomUUID()
  }, [])

  return { messages, sendMessage, isStreaming, isExhausted, remaining, resetAt, reset }
}
