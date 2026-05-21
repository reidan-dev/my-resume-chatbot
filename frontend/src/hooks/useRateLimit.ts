import { useState, useCallback } from 'react'

const STORAGE_KEY = 'resume_rl'
const LIMIT = 5
const WINDOW_MS = 3 * 24 * 60 * 60 * 1000

interface RLState {
  count: number
  resetAt: number
}

function load(): RLState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { count: 0, resetAt: Date.now() + WINDOW_MS }
    const s = JSON.parse(raw) as RLState
    return Date.now() >= s.resetAt
      ? { count: 0, resetAt: Date.now() + WINDOW_MS }
      : s
  } catch {
    return { count: 0, resetAt: Date.now() + WINDOW_MS }
  }
}

export function useRateLimit() {
  const [state, setState] = useState<RLState>(load)

  const increment = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, count: prev.count + 1 }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const syncFromHeaders = useCallback((remaining: number, resetAt: string) => {
    const next = { count: LIMIT - remaining, resetAt: new Date(resetAt).getTime() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setState(next)
  }, [])

  return {
    remaining: Math.max(0, LIMIT - state.count),
    isExhausted: state.count >= LIMIT,
    resetAt: new Date(state.resetAt),
    increment,
    syncFromHeaders,
  }
}
