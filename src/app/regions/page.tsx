'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { useMapStore } from '@/stores/mapStore'
import { CITY_CFG } from '@/lib/constants'
import { CityMarker } from '@/components/map/markers/CityMarker'
import { ArrowLeft, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function RegionContent() {
  const searchParams = useSearchParams()
  const id = searchParams?.get('id')
  const [mounted, setMounted] = useState(false)
  const { regions, cities } = useMapStore()

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return <div className="h-screen bg-ink flex items-center justify-center">
      <div className="font-display text-gold text-xl tracking-[4px] animate-pulse">ERADRIEL</div>
    </div>
  }

  if (!id) {
    // List all regions
    return (
      <div className="min-h-screen bg-ink">
        <TopBar />
        <main className="pt-16 pb-8 px-4 max-w-2xl mx-auto">
          <h1 className="font-heading text-2xl text-gold tracking-wider mb-6">Regioni</h1>
          <div className="grid gap-3">
            {regions.map(r => (
              <Link
                key={r.id}
                href={`/regions?id=${r.id}`}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card/50 hover:border-gold-dim transition-all group"
              >
                <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{ backgroundColor: r.color, border: `2px solid ${r.stroke}` }} />
                <div>
                  <h3 className="font-heading text-sm text-gold tracking-wider group-hover:text-gold/90">{r.name}</h3>
                  <p className="text-[10px] text-muted-foreground italic">{r.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    )
  }

  const region = regions.find(r => r.id === id)
  if (!region) {
    return (
      <div className="min-h-screen bg-ink">
        <TopBar />
        <main className="pt-16 pb-8 px-4 max-w-2xl mx-auto text-center">
          <p className="text-muted-foreground mt-12">Regione non trovata</p>
          <Link href="/map" className="text-gold text-sm mt-4 inline-block hover:underline">Torna alla mappa</Link>
        </main>
      </div>
    )
  }

  const regionCities = cities.filter(c => c.region === region.name)

  return (
    <div className="min-h-screen bg-ink">
      <TopBar />
      <main className="pt-16 pb-8 px-4 max-w-2xl mx-auto">
        <Link href="/regions" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors mb-6">
          <ArrowLeft size={14} />
          Tutte le regioni
        </Link>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg mx-auto mb-3" style={{ backgroundColor: region.color, border: `2px solid ${region.stroke}` }} />
          <h1 className="font-heading text-3xl text-gold tracking-wider">{region.name}</h1>
          <p className="text-sm italic text-muted-foreground mt-1">{region.sub}</p>
        </div>

        <div className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-gold-dark to-transparent mb-8" />

        {region.description && (
          <p className="text-sm text-foreground/80 leading-relaxed mb-8">{region.description}</p>
        )}

        <h2 className="font-heading text-sm text-gold tracking-wider mb-4">
          <MapPin size={14} className="inline mr-1.5" />
          Insediamenti ({regionCities.length})
        </h2>

        <div className="grid gap-2">
          {regionCities.map(city => {
            const cfg = CITY_CFG[city.type] || CITY_CFG.borgo
            return (
              <Link
                key={city.id}
                href={`/cities?id=${city.id}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card/50 hover:border-gold-dim transition-all group"
              >
                <svg viewBox="-14 -14 28 28" width={24} height={24} style={{ overflow: 'visible', flexShrink: 0 }}>
                  <CityMarker cfg={cfg} x={0} y={0} />
                </svg>
                <div className="min-w-0">
                  <h3 className="font-heading text-xs text-gold tracking-wider truncate group-hover:text-gold/90">{city.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{city.pop} — {cfg.lbl}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default function RegionPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-ink flex items-center justify-center">
        <div className="font-display text-gold text-xl tracking-[4px] animate-pulse">ERADRIEL</div>
      </div>
    }>
      <RegionContent />
    </Suspense>
  )
}
