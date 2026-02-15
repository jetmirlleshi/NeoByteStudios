import type { Metadata } from 'next'
import { Geist, Space_Grotesk } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ThemeProvider from '@/components/ui/ThemeProvider'
import SoundProvider from '@/components/ui/SoundProvider'
import CustomCursor from '@/components/ui/CustomCursor'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { SITE, SOCIAL_LINKS } from '@/lib/constants'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
  },
  other: {
    'theme-color': '#0a0a0f',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-bg-primary" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('nbs-theme');if(t==='light')document.documentElement.setAttribute('data-theme','light')})()`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${spaceGrotesk.variable} antialiased flex min-h-screen flex-col`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-brand-from focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: SITE.name,
              url: SITE.url,
              description: SITE.description,
              logo: `${SITE.url}/icon.svg`,
              sameAs: SOCIAL_LINKS.map((s) => s.href),
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: SITE.name,
              url: SITE.url,
              description: SITE.description,
            }),
          }}
        />
        <ClerkProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <SoundProvider>
                <ErrorBoundary>
                  <CustomCursor />
                </ErrorBoundary>
                <Navbar />
                <main id="main-content" className="flex-1">{children}</main>
                <Footer />
              </SoundProvider>
            </ErrorBoundary>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
