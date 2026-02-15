import { SignIn } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — NeoByteStudios',
  description: 'Sign in to your NeoByteStudios account.',
}

export default function LoginPage() {
  return (
    <div className="flex justify-center">
      <SignIn
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
              'bg-bg-card border-border-custom text-text-primary focus:border-brand-from focus:ring-brand-from',
            formButtonPrimary:
              'bg-gradient-to-r from-brand-from to-accent hover:opacity-90',
            footerActionLink: 'text-brand-from hover:text-accent',
            identityPreviewEditButton: 'text-brand-from',
          },
        }}
        signUpUrl="/register"
        forceRedirectUrl="/"
      />
    </div>
  )
}
