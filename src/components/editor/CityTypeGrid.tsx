'use client'

import type { CityType } from '@/types/map'
import { CITY_CFG } from '@/lib/constants'
import { CityMarker } from '@/components/map/markers/CityMarker'
import { cn } from '@/lib/utils'

interface CityTypeGridProps {
  selected: CityType
  onChange: (type: CityType) => void
}

export function CityTypeGrid({ selected, onChange }: CityTypeGridProps) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {(Object.entries(CITY_CFG) as [CityType, typeof CITY_CFG[CityType]][]).map(([key, cfg]) => (
        <button
          key={key}
          type="button"
          className={cn(
            'bg-secondary rounded-lg p-2 cursor-pointer text-center transition-colors border-2',
            key === selected
              ? 'border-gold'
              : 'border-transparent hover:border-gold-dim'
          )}
          onClick={() => onChange(key)}
        >
          <svg viewBox="-14 -14 28 28" width={28} height={28} className="mx-auto mb-1 overflow-visible">
            <CityMarker cfg={cfg} x={0} y={0} />
          </svg>
          <div className="font-heading text-[7px] text-muted-foreground tracking-wide leading-tight">
            {cfg.lbl}
          </div>
        </button>
      ))}
    </div>
  )
}
