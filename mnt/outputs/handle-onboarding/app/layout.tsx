import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Handle — Onboarding',
  description: 'Configura tu agente de Handle en minutos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
