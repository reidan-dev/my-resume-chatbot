import { useEffect, useRef, useState } from 'react'

let _id = 0

export function MermaidDiagram({ chart }: { chart: string }) {
  const [svg, setSvg] = useState('')
  const id = useRef(`mermaid-${++_id}`)

  useEffect(() => {
    import('mermaid').then(({ default: mermaid }) => {
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
      mermaid.render(id.current, chart)
        .then(({ svg }) => setSvg(svg))
        .catch(() => setSvg(''))
    })
  }, [chart])

  if (!svg) return null
  return (
    <div
      className="overflow-x-auto my-4 flex justify-center"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
