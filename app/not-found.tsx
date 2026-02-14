import Link from 'next/link'
import GradientText from '@/components/ui/GradientText'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <GradientText from="#7c3aed" to="#06d6a0" className="font-display text-6xl md:text-8xl font-bold">
        404
      </GradientText>
      <p className="text-lg text-text-secondary mt-4">
        This page doesn&apos;t exist in any of our universes&hellip; yet.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-gradient-to-r from-brand-from to-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Back to Home
      </Link>
    </div>
  )
}
