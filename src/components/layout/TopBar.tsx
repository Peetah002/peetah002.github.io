'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Map, BookOpen, Clock } from 'lucide-react'

interface TopBarProps {
  children?: React.ReactNode
}

export function TopBar({ children }: TopBarProps) {
  const pathname = usePathname()

  const navLinks = [
    { href: '/map', label: 'Mappa', icon: Map },
    { href: '/lore', label: 'Lore', icon: BookOpen },
    { href: '/timeline', label: 'Timeline', icon: Clock },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 h-13 z-50 bg-ink/97 border-b border-border flex items-center gap-1.5 px-safe no-scrollbar overflow-x-auto">
      {/* Title */}
      <Link
        href="/"
        className="font-display text-[13px] text-gold tracking-[2px] whitespace-nowrap mr-1 flex-shrink-0 hover:text-gold/80 transition-colors"
      >
        ERADRIEL
      </Link>

      {/* Separator */}
      <div className="w-px h-6 bg-border flex-shrink-0 mx-0.5" />

      {/* Nav links */}
      <nav className="flex items-center gap-1 flex-shrink-0">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname?.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'h-8 px-2.5 rounded-md border text-[10px] font-heading tracking-wider whitespace-nowrap flex-shrink-0',
                'flex items-center gap-1.5 transition-all duration-100',
                isActive
                  ? 'bg-accent border-gold text-gold'
                  : 'bg-secondary/80 border-border text-foreground hover:border-gold-dim hover:text-gold'
              )}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Separator */}
      {children && <div className="w-px h-6 bg-border flex-shrink-0 mx-0.5" />}

      {/* Page-specific actions */}
      {children}
    </header>
  )
}
