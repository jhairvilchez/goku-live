import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Bangers, Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const bangers = Bangers({ subsets: ['latin'], weight: '400', variable: '--font-bangers' })

export const metadata: Metadata = {
  title: 'Goku Live – Personaje interactivo para TikTok Live',
  description:
    'Overlay de Goku que responde comentarios con IA y baila con cada regalo usando TikFinity y TikTok LIVE Studio.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0c0a09',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`dark ${geist.variable} ${bangers.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
