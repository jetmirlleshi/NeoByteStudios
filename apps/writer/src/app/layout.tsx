import type { Metadata } from "next";
import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import { authClient } from "@/lib/auth/client";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NeoByteWriter — Lo strumento AI per scrittori",
    template: "%s | NeoByteWriter",
  },
  description:
    "Scrivi il tuo romanzo con l'aiuto dell'intelligenza artificiale. Editor avanzato, worldbuilding, assistente AI e molto altro.",
  keywords: [
    "scrittura",
    "romanzo",
    "AI",
    "editor",
    "worldbuilding",
    "fiction",
    "scrittore",
  ],
  authors: [{ name: "NeoByteStudios" }],
  creator: "NeoByteStudios",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://writer.neobytestudios.com",
    siteName: "NeoByteWriter",
    title: "NeoByteWriter — Lo strumento AI per scrittori",
    description:
      "Scrivi il tuo romanzo con l'aiuto dell'intelligenza artificiale.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeoByteWriter — Lo strumento AI per scrittori",
    description:
      "Scrivi il tuo romanzo con l'aiuto dell'intelligenza artificiale.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <NeonAuthUIProvider
          authClient={authClient}
          redirectTo="/dashboard"
          emailOTP
          social={{
            providers: ["google", "github"],
          }}
        >
          <Providers>{children}</Providers>
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
