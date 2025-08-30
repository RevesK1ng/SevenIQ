import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { ThemeProvider } from '@/components/theme-provider'
import { validateConfig } from '@/lib/config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SevenIQ - AI-Powered Explanations',
  description: 'Transform complex topics into crystal-clear explanations using AI. Perfect for students, professionals, and curious minds.',
  keywords: 'AI, explanations, learning, education, artificial intelligence, simplify, understand',
  authors: [{ name: 'SevenIQ Team' }],
  creator: 'SevenIQ',
  publisher: 'SevenIQ',
  robots: 'index, follow',
  openGraph: {
    title: 'SevenIQ - AI-Powered Explanations',
    description: 'Transform complex topics into crystal-clear explanations using AI.',
    url: 'https://seveniq.com',
    siteName: 'SevenIQ',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SevenIQ - AI-Powered Explanations',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SevenIQ - AI-Powered Explanations',
    description: 'Transform complex topics into crystal-clear explanations using AI.',
    images: ['/og-image.png'],
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0077FF',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Validate configuration on server side
  if (typeof window === 'undefined') {
    validateConfig()
  }

  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <main className="flex-1">
                {children}
              </main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
