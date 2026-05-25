import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export type HealthStatus = 'checking' | 'online' | 'offline'

export interface HealthResult {
  status: HealthStatus
  model: string
  rateLimit: { mode: string; limit: number; windowDays: number } | null
}

export function useHealth(): HealthResult {
  const [result, setResult] = useState<HealthResult>({ status: 'checking', model: '…', rateLimit: null })

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch(`${API_URL}/health`, {
          signal: AbortSignal.timeout(5000),
        })
        if (res.ok) {
          const data = await res.json()
          setResult({
            status: 'online',
            model: data.model ?? 'unknown',
            rateLimit: data.rate_limit
              ? { mode: data.rate_limit.mode, limit: data.rate_limit.limit, windowDays: data.rate_limit.window_days }
              : null,
          })
        } else {
          setResult((prev) => ({ ...prev, status: 'offline' }))
        }
      } catch {
        setResult((prev) => ({ ...prev, status: 'offline' }))
      }
    }

    check()
    const id = setInterval(check, 30_000)
    return () => clearInterval(id)
  }, [])

  return result
}
