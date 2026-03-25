'use client'

import Link from 'next/link'
import { Map, BookOpen, Clock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-ink relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 30% 40%, #d4a830 0%, transparent 50%),
                          radial-gradient(circle at 70% 60%, #d4a830 0%, transparent 50%)`,
      }} />

      <div className="relative z-10 text-center max-w-lg">
        {/* Compass SVG */}
        <div className="mx-auto mb-8 opacity-60">
          <svg width={80} height={80} viewBox="0 0 80 80">
            <circle cx={40} cy={40} r={36} fill="rgba(6,3,1,0.9)" stroke="#8B6914" strokeWidth={1.5} />
            <polygon points="40,8 45,38 40,32 35,38" fill="#b02818" />
            <polygon points="40,72 45,42 40,48 35,42" fill="#a08040" />
            <polygon points="72,40 42,35 48,40 42,45" fill="#a08040" />
            <polygon points="8,40 38,35 32,40 38,45" fill="#a08040" />
            <circle cx={40} cy={40} r={4} fill="#d4a830" stroke="#8B6914" strokeWidth={1} />
          </svg>
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl sm:text-5xl text-gold tracking-[6px] mb-3">
          ERADRIEL
        </h1>
        <p className="text-sm italic text-muted-foreground mb-12">
          Mappa Interattiva del Mondo di Eradriel
        </p>

        {/* Entry card */}
        <div className="flex justify-center mb-8">
          <Link
            href="/map"
            className="group p-6 rounded-xl border border-border bg-card/50 hover:border-gold transition-all duration-200 hover:bg-accent/50 max-w-xs w-full"
          >
            <Map size={28} className="mx-auto mb-3 text-gold opacity-80 group-hover:opacity-100 transition-opacity" />
            <h2 className="font-heading text-sm text-gold tracking-wider mb-1">Esplora</h2>
            <p className="text-xs text-muted-foreground">Esplora la mappa del mondo</p>
          </Link>
        </div>

        {/* Secondary links */}
        <div className="flex justify-center gap-6">
          <Link href="/lore" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors">
            <BookOpen size={14} />
            <span>Lore</span>
          </Link>
          <Link href="/timeline" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors">
            <Clock size={14} />
            <span>Timeline</span>
          </Link>
        </div>
      </div>

      {/* Bottom ornament */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gold-dim to-transparent" />
    </div>
  )
}
