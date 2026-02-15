import { UserProfile } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile — NeoByteStudios',
  description: 'Manage your NeoByteStudios profile.',
}

export default function ProfilePage() {
  return (
    <div className="relative mx-auto max-w-4xl px-6 py-32">
      {/* Gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-[#7c3aed]/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-[#06d6a0]/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <h1 className="mb-8 font-display text-3xl font-bold tracking-tight text-text-primary">
          Your Profile
        </h1>

        <UserProfile
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-bg-secondary/60 border border-border-custom shadow-xl backdrop-blur-md rounded-2xl',
              navbar: 'border-border-custom',
              navbarButton: 'text-text-secondary hover:text-text-primary',
              navbarButtonActive: 'text-text-primary',
              headerTitle: 'text-text-primary',
              headerSubtitle: 'text-text-secondary',
              formFieldLabel: 'text-text-secondary',
              formFieldInput:
                'bg-bg-card border-border-custom text-text-primary focus:border-[#7c3aed] focus:ring-[#7c3aed]',
              formButtonPrimary:
                'bg-gradient-to-r from-[#7c3aed] to-[#06d6a0] hover:opacity-90',
              profileSectionTitle: 'text-text-primary',
              profileSectionContent: 'text-text-secondary',
              profileSectionPrimaryButton: 'text-[#7c3aed] hover:text-[#06d6a0]',
            },
          }}
        />
      </div>
    </div>
  )
}
