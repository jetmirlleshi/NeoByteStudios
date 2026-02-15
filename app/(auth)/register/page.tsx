import { SignUp } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up — NeoByteStudios',
  description: 'Create your NeoByteStudios account.',
}

export default function RegisterPage() {
  return (
    <div className="flex justify-center">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'w-full',
            card: 'bg-transparent shadow-none p-0 w-full',
            headerTitle: 'text-text-primary',
            headerSubtitle: 'text-text-secondary',
            socialButtonsBlockButton:
              'border-border-custom bg-bg-card text-text-primary hover:bg-bg-secondary',
            socialButtonsBlockButtonText: 'text-text-primary',
            dividerLine: 'bg-border-custom',
            dividerText: 'text-text-secondary',
            formFieldLabel: 'text-text-secondary',
            formFieldInput:
              'bg-bg-card border-border-custom text-text-primary focus:border-[#7c3aed] focus:ring-[#7c3aed]',
            formButtonPrimary:
              'bg-gradient-to-r from-[#7c3aed] to-[#06d6a0] hover:opacity-90',
            footerActionLink: 'text-[#7c3aed] hover:text-[#06d6a0]',
            identityPreviewEditButton: 'text-[#7c3aed]',
          },
        }}
        signInUrl="/login"
        forceRedirectUrl="/"
      />
    </div>
  )
}
