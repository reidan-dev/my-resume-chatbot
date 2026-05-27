interface AnimatedBorderProps {
  children: React.ReactNode
  /** CSS border-radius value applied to the outer wrapper, e.g. "1rem", "9999px", "12px" */
  radius?: string
  /** Extra classes on the outer wrapper (layout, hover effects, etc.) */
  className?: string
  /** Extra classes on the inner content div (background, padding, etc.) */
  innerClassName?: string
}

/**
 * Wraps children in a 2px animated emerald conic-gradient border.
 * The gradient rotates one full turn, then pauses ~4 s before repeating.
 * Respects prefers-reduced-motion (static gradient when reduced).
 */
export function AnimatedBorder({
  children,
  radius = '1rem',
  className = '',
  innerClassName = '',
}: AnimatedBorderProps) {
  return (
    <div
      className={`animated-border ${className}`}
      style={{ '--ab-radius': radius } as React.CSSProperties}
    >
      <div className={`animated-border-inner ${innerClassName}`}>
        {children}
      </div>
    </div>
  )
}
