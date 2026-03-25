'use client'

import { TopBar } from '@/components/layout/TopBar'
import { Clock } from 'lucide-react'

export default function TimelinePage() {
  const events = [
    { date: 'Anno 1, Giorno 1', session: 1, title: 'L\'Inizio', summary: 'Gli avventurieri si incontrano per la prima volta alla Torre di Nartharion.' },
    { date: 'Anno 1, Giorno 3', session: 2, title: 'La Prima Missione', summary: 'Il gruppo parte verso Brughiscuri per investigare strani avvenimenti.' },
  ]

  return (
    <div className="min-h-screen bg-ink">
      <TopBar />
      <main className="pt-16 pb-8 px-4 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-heading text-2xl text-gold tracking-wider">Timeline</h1>
          <p className="text-xs text-muted-foreground italic mt-1">Cronologia della campagna</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-gold-dim via-gold-dim/50 to-transparent" />

          <div className="space-y-6">
            {events.map((event, i) => (
              <div key={i} className="relative pl-10">
                {/* Dot */}
                <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-gold bg-ink" />

                <div className="p-4 rounded-xl border border-border bg-card/50">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-heading text-gold-dim tracking-wider uppercase">{event.date}</span>
                    {event.session && (
                      <span className="text-[9px] font-heading text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                        Sessione {event.session}
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-sm text-gold tracking-wider mb-1">{event.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{event.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground italic">
            Pagina in costruzione — la timeline sarà aggiornata con il procedere della campagna.
          </p>
        </div>
      </main>
    </div>
  )
}
