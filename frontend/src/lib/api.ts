const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export async function checkRateLimit(): Promise<{
  remaining: number
  limit: number
  reset_at: string | null
}> {
  const res = await fetch(`${BASE}/rate-limit`)
  return res.json()
}

export async function resetChat(sessionId: string): Promise<void> {
  await fetch(`${BASE}/chat/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId }),
  })
}

export function streamChat(
  message: string,
  sessionId: string,
  onToken: (token: string) => void,
  onSources: (sources: string[]) => void,
  onRateLimit: (data: { remaining: number; reset_at: string; limit: number }) => void,
  onDone: () => void,
  onError: (err: string) => void,
): () => void {
  const controller = new AbortController()

  fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id: sessionId }),
    signal: controller.signal,
  })
    .then(async (res) => {
      if (!res.ok) {
        if (res.status === 429) {
          onError('rate_limit_exceeded')
        } else {
          onError(`Request failed: ${res.status}`)
        }
        return
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') {
            onDone()
            return
          }
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'token') onToken(parsed.text)
            else if (parsed.type === 'sources') onSources(parsed.sources)
            else if (parsed.type === 'rate_limit') onRateLimit(parsed)
            else if (parsed.type === 'error') onError(parsed.message)
          } catch {
            // non-JSON line, skip
          }
        }
      }
      onDone()
    })
    .catch((err) => {
      if (err.name !== 'AbortError') onError(err.message)
    })

  return () => controller.abort()
}
