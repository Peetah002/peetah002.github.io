'use client'

import type { City } from '@/types/map'
import { CITY_CFG } from '@/lib/constants'
import { CityMarker } from '@/components/map/markers/CityMarker'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

interface CityInfoPanelProps {
  city: City | null
  open: boolean
  onClose: () => void
}

export function CityInfoPanel({ city, open, onClose }: CityInfoPanelProps) {
  if (!city) return null
  const cfg = CITY_CFG[city.type] || CITY_CFG.borgo

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="bg-ink/99 border-t-2 border-gold-dark rounded-t-2xl max-h-[78vh] overflow-y-auto md:max-w-md md:ml-auto md:rounded-tl-2xl"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{city.name}</SheetTitle>
        </SheetHeader>

        <div className="px-4 py-4 space-y-4">
          {/* Icon */}
          <div className="flex justify-center">
            <svg viewBox="-16 -16 32 32" width={48} height={48} style={{ overflow: 'visible' }}>
              <CityMarker cfg={cfg} x={0} y={0} />
            </svg>
          </div>

          {/* Region subtitle */}
          <p className="text-center text-xs text-muted-foreground italic">{city.region}</p>

          {/* Name */}
          <h2 className="text-center font-heading text-2xl text-gold">{city.name}</h2>

          {/* Divider */}
          <div className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-gold-dark to-transparent" />

          {/* Population */}
          <p className="text-center text-base text-parchment-light opacity-90">{city.pop}</p>

          {/* Type */}
          <p className="text-center text-xs text-muted-foreground italic">{cfg.lbl}</p>

          {/* Description */}
          {city.description && (
            <div className="pt-2 border-t border-gold-dim/30">
              <p className="text-sm leading-relaxed text-foreground/80">{city.description}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
