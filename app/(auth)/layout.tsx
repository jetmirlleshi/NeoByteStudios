import Link from 'next/link'
import AnimatedLogo from '@/components/ui/AnimatedLogo'
import { SITE } from '@/lib/constants'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-24">
      {/* Gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-brand-from/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-accent/20 blur-[120px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <AnimatedLogo size={36} />
          <span className="font-display text-2xl font-bold tracking-tight bg-gradient-to-r from-brand-from to-accent bg-clip-text text-transparent">
            {SITE.name}
          </span>
        </Link>

        {/* Glass card */}
        <div className="w-full rounded-2xl border border-border-custom bg-bg-secondary/60 p-8 shadow-xl backdrop-blur-md">
          {children}
        </div>
      </div>
    </div>
  )
}
