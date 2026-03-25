'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { useMapStore } from '@/stores/mapStore'
import { CITY_CFG } from '@/lib/constants'
import { CityMarker } from '@/components/map/markers/CityMarker'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function CityContent() {
  const searchParams = useSearchParams()
  const id = searchParams?.get('id')
  const [mounted, setMounted] = useState(false)
  const { cities, regions } = useMapStore()

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return <div className="h-screen bg-ink flex items-center justify-center">
      <div className="font-display text-gold text-xl tracking-[4px] animate-pulse">ERADRIEL</div>
    </div>
  }

  if (!id) {
    // List all cities
    return (
      <div className="min-h-screen bg-ink">
        <TopBar />
        <main className="pt-16 pb-8 px-4 max-w-2xl mx-auto">
          <h1 className="font-heading text-2xl text-gold tracking-wider mb-6">Città</h1>
          <div className="grid gap-2">
            {cities.map(city => {
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
                    <p className="text-[10px] text-muted-foreground">{city.region} — {city.pop}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </main>
      </div>
    )
  }

  const city = cities.find(c => c.id === id)
  if (!city) {
    return (
      <div className="min-h-screen bg-ink">
        <TopBar />
        <main className="pt-16 pb-8 px-4 max-w-2xl mx-auto text-center">
          <p className="text-muted-foreground mt-12">Città non trovata</p>
          <Link href="/map" className="text-gold text-sm mt-4 inline-block hover:underline">Torna alla mappa</Link>
        </main>
      </div>
    )
  }

  const cfg = CITY_CFG[city.type] || CITY_CFG.borgo
  const region = regions.find(r => r.name === city.region)

  return (
    <div className="min-h-screen bg-ink">
      <TopBar />
      <main className="pt-16 pb-8 px-4 max-w-2xl mx-auto">
        <Link href="/cities" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors mb-6">
          <ArrowLeft size={14} />
          Tutte le città
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg viewBox="-20 -20 40 40" width={64} height={64} style={{ overflow: 'visible' }}>
              <CityMarker cfg={cfg} x={0} y={0} />
            </svg>
          </div>

          {region && (
            <Link href={`/regions?id=${region.id}`} className="text-xs italic text-muted-foreground hover:text-gold transition-colors">
              {city.region}
            </Link>
          )}

          <h1 className="font-heading text-3xl text-gold tracking-wider mt-2">{city.name}</h1>

          <div className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-gold-dark to-transparent my-4" />

          <p className="text-lg text-parchment-light opacity-90">{city.pop}</p>
          <p className="text-xs italic text-muted-foreground mt-1">{cfg.lbl}</p>
        </div>

        {city.description && (
          <div className="border-t border-border/30 pt-4 mt-4">
            <h2 className="font-heading text-xs text-gold tracking-wider mb-2 uppercase">Descrizione</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{city.description}</p>
          </div>
        )}

        <div className="mt-8 p-3 rounded-lg bg-card/50 border border-border text-center">
          <p className="text-[10px] text-muted-foreground">Coordinate: {city.x}, {city.y}</p>
        </div>
      </main>
    </div>
  )
}

export default function CityPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-ink flex items-center justify-center">
        <div className="font-display text-gold text-xl tracking-[4px] animate-pulse">ERADRIEL</div>
      </div>
    }>
      <CityContent />
    </Suspense>
  )
}
