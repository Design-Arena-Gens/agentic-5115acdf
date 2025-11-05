import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Natal Chart Generator',
  description: 'Generate your personalized natal chart with planetary positions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
