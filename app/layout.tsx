import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from 'next-themes'
import { AudienceProvider } from '@/lib/audience-context'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { JsonLd } from '@/components/shared/JsonLd'
import '@/styles/globals.css'

const BASE_URL = 'https://clevisgikenyi.dev'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: 'Clevis Gikenyi — Full-Stack Software Engineer',
    template: '%s | Clevis Gikenyi',
  },
  description:
    'Cardiff-based full-stack engineer specialising in Python, Django, and Next.js. Award-winning developer with two shipped production systems. Available for full-time roles and freelance projects.',
  keywords: [
    'full-stack developer', 'software engineer', 'Python', 'Django',
    'Next.js', 'React', 'TypeScript', 'Cardiff', 'Wales', 'UK',
    'freelance developer', 'web developer', 'Django REST Framework',
    'hire developer', 'freelance web app',
  ],
  authors:  [{ name: 'Clevis Gikenyi', url: BASE_URL }],
  creator:  'Clevis Gikenyi',
  publisher:'Clevis Gikenyi',

  // Canonical
  alternates: { canonical: BASE_URL },

  // Open Graph
  openGraph: {
    type:      'website',
    url:        BASE_URL,
    siteName:  'Clevis Gikenyi',
    title:     'Clevis Gikenyi — Full-Stack Software Engineer',
    description:
      'Cardiff-based full-stack engineer specialising in Python, Django, and Next.js. Two shipped production systems. Available for roles and projects.',
    locale: 'en_GB',
  },

  // Twitter / X
  twitter: {
    card:        'summary_large_image',
    title:       'Clevis Gikenyi — Full-Stack Software Engineer',
    description: 'Cardiff-based full-stack engineer. Python · Django · Next.js. Award-winning. Available.',
    creator:     '@clevisgikenyi', // update if you have a Twitter handle
  },

  // Indexing
  robots: {
    index:               true,
    follow:              true,
    googleBot: {
      index:             true,
      follow:            true,
      'max-image-preview': 'large',
      'max-snippet':     -1,
    },
  },

  // Icons — add these files to /public/
  icons: {
  icon: [
    { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
  ],
  apple: [
    { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  ],
  shortcut: ['/favicon.ico'],
},

  // Web app manifest
  manifest: '/manifest.json',

  // Verification — add once you set up Google Search Console
  // verification: { google: 'your-verification-code' },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)',  color: '#0c0c0a' },
  ],
  width:        'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AudienceProvider>
            <Navbar />
            <main id="top" className="min-h-screen pt-20">
              {children}
            </main>
            <Footer />
          </AudienceProvider>
        </ThemeProvider>

        {/* Vercel Analytics — free, no cookie banner needed */}
        <JsonLd />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
