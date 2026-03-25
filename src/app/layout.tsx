import type { Metadata, Viewport } from 'next'
import { Cinzel, IM_Fell_English } from 'next/font/google'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
})

const imFell = IM_Fell_English({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Eradriel — Mappa Interattiva',
  description: 'Mappa interattiva del mondo di Eradriel per la campagna D&D',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className={`${cinzel.variable} ${imFell.variable} h-full`}>
      <body className="h-full overflow-hidden select-none">
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: 'font-[var(--font-cinzel)] !bg-accent !text-gold !border-gold-dim !text-xs tracking-wider',
          }}
        />
      </body>
    </html>
  )
}
