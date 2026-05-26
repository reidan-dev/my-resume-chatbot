import { useEffect, useRef, useState, useCallback } from 'react'

let _id = 0

export function MermaidDiagram({ chart }: { chart: string }) {
  const [svg, setSvg] = useState('')
  const [error, setError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef(chart)
  const id = useRef(`mermaid-${++_id}`)

  // Keep chart ref current for rendering callback
  useEffect(() => { chartRef.current = chart } , [chart])

  const render = useCallback(() => {
    setSvg('')
    setError(false)
    import('mermaid').then(async ({ default: mermaid }) => {
      if (!containerRef.current) return
      const dark = document.documentElement.classList.contains('dark')
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          primaryColor: dark ? '#064e3b' : '#d1fae5',
          primaryTextColor: dark ? '#d1fae5' : '#064e3b',
          primaryBorderColor: '#10b981',
          lineColor: dark ? '#6ee7b7' : '#059669',
          secondaryColor: dark ? '#1f2937' : '#f9fafb',
          tertiaryColor: dark ? '#111827' : '#ffffff',
          fontFamily: 'inherit',
          fontSize: '13px',
        },
      })
      try {
        const { svg: rendered } = await mermaid.render(id.current, chartRef.current)
        setSvg(rendered)
      } catch {
        setError(true)
      }
    })
  }, [])

  // Re-render when dark mode changes
  useEffect(() => {
    const observer = new MutationObserver(() => render())
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [render])

  useEffect(() => { render() }, [render])

  if (error) return <p className="text-xs text-red-400 my-2">Diagram failed to render</p>
  if (!svg) return <div ref={containerRef} className="my-4 flex justify-center h-32 animate-pulse" />
  return (
    <div
      ref={containerRef}
      className="overflow-x-auto my-4 flex justify-center"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
