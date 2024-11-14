import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Infrarood Verwarmings Calculator',
  description: 'Bereken de benodigde infrarood verwarming voor uw ruimte',
}

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className={inter.className + ' embed-body'}>
        {children}
      </body>
    </html>
  )
}
