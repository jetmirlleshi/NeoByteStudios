import { cn } from '@/lib/utils'

/**
 * Props for the GradientText component.
 * @property children  - Text or inline content to render with the gradient.
 * @property from      - Starting gradient color (hex). Defaults to brand purple (#7c3aed).
 * @property to        - Ending gradient color (hex). Defaults to brand blue (#3b82f6).
 * @property className - Additional Tailwind classes merged via `cn()`.
 */
interface GradientTextProps {
  children: React.ReactNode
  from?: string
  to?: string
  className?: string
}

/**
 * Inline span that renders its children with a horizontal gradient fill.
 *
 * Uses `bg-clip-text` + `text-transparent` so the gradient shows through the
 * text glyphs. Custom `from` / `to` colors are applied via inline style so
 * they can be dynamic (e.g. per-division accent colors).
 *
 * This is a **server component** -- no client JS is shipped.
 */
export default function GradientText({
  children,
  from = '#7c3aed',
  to = '#3b82f6',
  className,
}: GradientTextProps) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        className
      )}
      style={{
        // Tailwind v4 uses CSS variables under the hood for gradient stops.
        // We set them inline so arbitrary from/to values work without
        // generating extra utility classes.
        '--tw-gradient-from': from,
        '--tw-gradient-to': to,
        '--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to)`,
      } as React.CSSProperties}
    >
      {children}
    </span>
  )
}
