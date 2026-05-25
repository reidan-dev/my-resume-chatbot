import { useState, useCallback } from 'react'

const STORAGE_KEY = 'resume_rl'
const RESET_SECRET = import.meta.env.VITE_RESET_SECRET as string | undefined

interface RLState {
  count: number
  resetAt: number
}

function load(windowMs: number): RLState {
  try {
    const params = new URLSearchParams(window.location.search)
    if (RESET_SECRET && params.get('reset') === RESET_SECRET) {
      localStorage.removeItem(STORAGE_KEY)
      window.history.replaceState(null, '', window.location.pathname)
    }
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { count: 0, resetAt: Date.now() + windowMs }
    const s = JSON.parse(raw) as RLState
    return Date.now() >= s.resetAt
      ? { count: 0, resetAt: Date.now() + windowMs }
      : s
  } catch {
    return { count: 0, resetAt: Date.now() + windowMs }
  }
}

export function useRateLimit(limit: number = 5, windowMs: number = 3 * 24 * 60 * 60 * 1000) {
  const [state, setState] = useState<RLState>(() => load(windowMs))

  const increment = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, count: prev.count + 1 }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const syncFromHeaders = useCallback((remaining: number, resetAt: string) => {
    const next = { count: limit - remaining, resetAt: new Date(resetAt).getTime() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setState(next)
  }, [limit])

  return {
    remaining: Math.max(0, limit - state.count),
    isExhausted: state.count >= limit,
    resetAt: new Date(state.resetAt),
    increment,
    syncFromHeaders,
  }
}
