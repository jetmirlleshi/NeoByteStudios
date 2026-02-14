import { cn } from '@/lib/utils'

interface DivisionIconProps {
  slug: string
  color?: string
  className?: string
  size?: number
}

export default function DivisionIcon({
  slug,
  color = 'currentColor',
  className,
  size = 24,
}: DivisionIconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: cn('shrink-0', className),
    'aria-hidden': true as const,
  }

  switch (slug) {
    case 'writer':
      return (
        <svg {...props}>
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          <path d="m15 5 4 4" />
        </svg>
      )
    case 'forge':
      return (
        <svg {...props}>
          <path d="M9.5 2 12 5l2.5-3" />
          <path d="M6 7h12l-1 8H7z" />
          <path d="M7 15l-2 7h14l-2-7" />
          <path d="M12 7v8" />
          <circle cx="12" cy="3.5" r="0.5" fill={color} stroke="none" />
        </svg>
      )
    case 'games':
      return (
        <svg {...props}>
          <rect x="2" y="6" width="20" height="12" rx="6" />
          <path d="M6 12h4" />
          <path d="M8 10v4" />
          <circle cx="16" cy="10" r="1" fill={color} stroke="none" />
          <circle cx="18" cy="12" r="1" fill={color} stroke="none" />
        </svg>
      )
    case 'vision':
      return (
        <svg {...props}>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
  }
}
